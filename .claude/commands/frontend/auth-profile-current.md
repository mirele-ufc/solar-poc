## Current State Memory Document — Slice D: Auth & Profile

### TDD-First Protocol for Stories in this Slice

1. Create tests for the story behavior before code changes.
2. Execute tests and confirm RED baseline.
3. Implement only the minimal code needed for GREEN.
4. Refactor after GREEN while keeping tests passing.
5. Close story only after test + type-check + lint + build pass.

---

### 1. Auth Workflow (Fluxo de Autenticação)

**Rota de entrada:** `/` → LoginPage.tsx (sem `AuthLayout`; rota pública)

**Grafo de navegação do fluxo auth:**

```
/ (LoginPage)
  ├── "Esqueceu a senha?" → /forgot-password (ForgotPasswordPage)
  │     └── submit OU "Voltar ao login" → / (LoginPage)
  ├── "Cadastrar" → /register (RegisterPage)
  │     └── submit válido OU "Já sou usuário" → / (LoginPage)  ← sucesso vai para "/" não "/courses"
  └── submit válido → /courses
```

> **Quirk crítico:** `RegisterPage.onSubmitValid()` faz `navigate("/courses")` — sem chamar nenhuma action de store. Não há cadastro real; o formulário simula sucesso e joga direto na area autenticada sem setar `isLoggedIn`.

**`LoginPage` — lógica de submit:**

- `useForm` + `zodResolver(loginSchema)` — campos: `username`, `password`
- `onSubmitValid` → chama `useAuthStore.login(username.trim(), password)` → retorna `boolean`
  - `true` → `navigate("/courses")`
  - `false` → `setGeneralError("Usuário ou senha incorretos")`
- `onSubmitInvalid` → `setGeneralError("Por favor, preencha os campos destacados para acessar")`
- Sem loading state; sem `isLoading` flag

---

### 2. Store de Autenticação (`useAuthStore`)

**Interfaces locais** (não vêm de `@ava-poc/types`):

```
UserProfile { name, cpf, email, photoUrl: string|null, role: "professor"|"student", password?: string }
SentMessage { id, recipientId, recipientLabel, subject, body, sentAt: ISO string }
```

**Estado inicial:** `currentUser = estudante`, `sentMessages = MOCK_MESSAGES[3]`, `isLoggedIn = false`

**Actions e suas lógicas:**

| Action                       | Lógica                                                                                             | Efeito colateral                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `login(username, password)`  | Lookup em `CREDENTIALS[username.toLowerCase()]`; compara `.password`; retorna `boolean`            | Seta `currentUser` + `isLoggedIn: true` se OK                                         |
| `logout()`                   | Reseta `currentUser` para `DEFAULT_USER` (estudante), `isLoggedIn: false`                          | **Restaura `sentMessages` para `MOCK_MESSAGES`** — apaga mensagens enviadas na sessão |
| `updateCurrentUser(partial)` | Spread merge: `{ ...currentUser, ...partial }`                                                     | Mutação de perfil em memória apenas; sem persistência                                 |
| `sendMessage(msg)`           | Cria `{ ...msg, id: "msg-${Date.now()}", sentAt: new Date().toISOString() }`; **prepend** na lista | sentMessages cresce durante a sessão; reset no logout                                 |

**Credenciais hardcoded (`CREDENTIALS`):**

| Username      | Password      | Role          | Nome                | Email                  |
| ------------- | ------------- | ------------- | ------------------- | ---------------------- |
| `"professor"` | `"professor"` | `"professor"` | Prof. Eduardo Silva | professor@ufc.br       |
| `"estudante"` | `"estudante"` | `"student"`   | Eduardo Marinho     | eduardo.marinho@ufc.br |

**Mock Messages pré-carregadas:** 3 mensagens com IDs `msg-001`, `msg-002`, `msg-003` (todos com `sentAt` de março/2026, curso `power-bi` ou `all`)

**Flags de segurança documentadas no próprio código:**

- Credenciais hardcoded no bundle JS — apenas protótipo
- Campo `password` em `UserProfile` não deve existir em produção
- Em produção: autenticação via backend HTTPS + HttpOnly cookies

---

### 3. Schemas de Validação Auth (`authSchema.ts`)

**Três schemas e seus tipos inferidos:**

`loginSchema` → `LoginFormValues`:

- `username`: `string.trim().min(1, "Login não informado")`
- `password`: `string.trim().min(1, "Senha não informada")`

`registerSchema` → `RegisterFormValues` (com `.refine` cross-field):

- `cpf`: regex `/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/` — aceita com ou sem formatação; mensagem: `"CPF inválido"`
- `email`: `.email("Email inválido")`
- `password`: `.min(6, "A senha deve ter ao menos 6 caracteres")`
- `confirmPassword`: `.refine(data => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "As senhas não coincidem" })`
- `gender`: `string.min(1, "Gênero não informado")`

`forgotPasswordSchema` → `ForgotPasswordFormValues`:

- `email`: `string.trim().min(1, "Email não informado").email("Email inválido")`

> **Nota:** `RegisterPage` usa `registerSchema` do `authSchema.ts` via `zodResolver`, porém a ação `onSubmitValid` não chama store alguma — o campo `password` validado aqui nunca chega ao `useAuthStore`.

---

### 4. Página de Cadastro (`RegisterPage`)

**Campos do formulário:**

| Campo             | Componente                | Tipo       | Validação                                                                                 |
| ----------------- | ------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| `cpf`             | `InputField` (local)      | `text`     | Regex CPF + required                                                                      |
| `email`           | `InputField` (local)      | `email`    | Email format + required                                                                   |
| `password`        | `InputField` (local)      | `password` | min 6 + required                                                                          |
| `confirmPassword` | `InputField` (local)      | `password` | Cross-field match                                                                         |
| `gender`          | `SelectField` (local)     | `select`   | required; opções hardcoded: feminino / masculino / outro / prefiro-nao-informar           |
| `agreed`          | `<input type="checkbox">` | `checkbox` | **Fora do schema Zod**; estado React local `boolean`; sem validação — não bloqueia submit |

**Componentes embutidos no arquivo:**

- `InputField` — input genérico com toggle de senha; gera `id` via `label.toLowerCase().replace(/\s+/g, "-")`
- `SelectField` — `<select>` com ícone SVG customizado; mesmo padrão de `id`

**Risco de integração:** `onSubmitValid` faz apenas `navigate("/courses")` sem chamar qualquer action. Ao integrar com backend, este é o ponto de inserção de `register(payload)`.

---

### 5. Página de Perfil (`ProfilePage`)

**Fontes de dados:** exclusivamente leitura de `useAuthStore.currentUser` — sem API calls.

**Seções e comportamentos:**

**Seção Foto de Perfil:**

- Input de arquivo hidden; disparado por `fileInputRef.current?.click()`
- `handlePhotoChange`: valida `file.type.startsWith("image/")` → `FileReader` → `updateCurrentUser({ photoUrl: reader.result as string })`
- "Remover foto": `updateCurrentUser({ photoUrl: null })`
- Arquivo `accept="image/*"` (mais permissivo que `imageFileSchema` de Slice B, que aceita apenas jpg/png)

**Seção Dados Pessoais (somente leitura):**

- CPF exibido via `maskCPF(currentUser.cpf)` → **mascara os 6 últimos dígitos**: `"XXX.XXX.***-**"`
- Email direto de `currentUser.email`
- Componente `ReadonlyField` local com `useId()` para acessibilidade

**Seção Alterar Senha:**

- 3 campos gerenciados por state local (`currentPw`, `newPw`, `confirmPw`), **fora de react-hook-form**
- `handlePasswordSave()`: validação manual imperativa (sem Zod):
  1. `currentPw === currentUser.password` (comparação plaintext — herança do protótipo)
  2. `newPw.length >= 6`
  3. `confirmPw === newPw`
- Se válido: `updateCurrentUser({ password: newPw })` + `pwSuccess = true` + `setTimeout(4000)` para limpar

**Helpers locais no arquivo:**

| Helper           | Lógica                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `initials(name)` | `split(" ")` → primeiro char da 1ª palavra + primeiro char da última; fallback para primeiros 2 chars da 1ª palavra |
| `maskCPF(raw)`   | Remove não-dígitos; se 11 dígitos: retorna `"XXX.XXX.***-**"`; senão raw                                            |

**Componentes locais no arquivo:** `ReadonlyField` (com `useId`), `PasswordField` (com toggle show/hide e `error` prop)

**Badge de role:** hardcoded como `"Estudante"` em português — não deriva de `currentUser.role`.

---

### 6. Página de Recuperação de Senha (`ForgotPasswordPage`)

- Um campo: `email` com `forgotPasswordSchema`
- `onSubmitValid` e o botão "Voltar ao login" ambos fazem `navigate("/")` — sem chamada a API, sem envio de email real
- **Fluxo incompleto por design:** placeholder de integração com backend de recuperação

---

### 7. Padrões e Riscos Cross-cutting

**Padrão de erro duplicado em auth pages:** as 3 páginas públicas (Login, Register, ForgotPassword) seguem estrutura idêntica:

- `showErrors: boolean` + `generalError: string` gerenciados via `useState`
- `onSubmitInvalid` seta `generalError` + `setShowErrors(true)` + `window.scrollTo(0, 0)`
- `onSubmitValid` faz `setShowErrors(false)` + `setGeneralError("")`

**Inconsistência de role type** (já identificada em ARCH_BASE):

- `useAuthStore.UserProfile.role`: `"professor" | "student"`
- `@ava-poc/types.IUserSession.role`: `"student" | "creator" | "admin"`
- `ProfilePage` hardcoda a label `"Estudante"` — não lê de `currentUser.role`

**Sem persistência de sessão:** `useAuthStore` não usa `persist` middleware do Zustand. Refresh da página → volta ao estado inicial (`isLoggedIn: false`, `currentUser = estudante`).

**Sem proteção de rota de registro:** `RegisterPage` navega para `/courses` em `onSubmitValid` sem setar `isLoggedIn: true`. Se `AuthLayout` verificar `isLoggedIn`, o usuário recém-cadastrado seria redirecionado de volta para login.
