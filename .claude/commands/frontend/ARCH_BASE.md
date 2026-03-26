## Base Architecture Snapshot — `solar-poc` (v2)

### TDD-First Protocol for Stories

1. Write the story tests first and validate RED state.
2. Implement the smallest change needed to make tests pass.
3. Refactor only after GREEN, preserving tested behavior.
4. Run test, type-check, lint, and build before closing the story.
5. Story is DONE only when RED-GREEN-REFACTOR evidence exists.

---

### 1. Shared Types Package (`@ava-poc/types`)

**Mecanismo de resolução no monorepo:**

- Declarado em [packages/types/package.json](apackage.json) com `"name": "@ava-poc/types"` e `"main": "./src/index.ts"` — TypeScript puro, sem build step
- Consumido via pnpm workspace protocol: `"@ava-poc/types": "workspace:*"` em package.json
- `moduleResolution: "bundler"` nos dois `tsconfig.json` permite ao Vite resolver arquivos `.ts` diretamente via symlink — sem alias `paths` necessário
- Padrão de import em todo o projeto: `import { ICourse, IApiError } from "@ava-poc/types"`

**16 interfaces exportadas em dois tiers:**

| Tier          | Interfaces                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Domain Models | `IUserSession`, `ICourse`, `IModule`, `ILesson`, `IQuiz`, `IQuestion`, `IStudentSubmission`                                   |
| API Contracts | `IApiError`, `ICreateCoursePayload`, `IUpdateCoursePayload`, `IQuestionAnswer`, `ISubmitQuizPayload`, `IQuizSubmissionResult` |

**Regra de escopo de tipos (implícita, não escrita):**

| Scope                           | Localização                                    | Conteúdo                                                                                                                                                       |
| ------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domínio + contratos de API      | `@ava-poc/types` (packages/types/src/index.ts) | 16 interfaces acima                                                                                                                                            |
| Props React/UI compartilhadas   | `src/types/index.ts` (local ao app)            | `ICourseCardProps`, `IMessageCardProps`, `IBreadcrumb`, `IPageHeaderProps`, `ModuleItemType`, `ILessonItem`, `IModuleData`, `IProgressBarProps` (9 interfaces) |
| Props específicas de componente | Colocadas no próprio arquivo                   | N/A                                                                                                                                                            |

> **Risco de refatoração:** a regra de escopo entre os dois `index.ts` é implícita. Ao mover tipos entre camadas ou ao consolidar para o backend, é necessário verificar qual dos dois arquivos cada página importa.

**Inconsistência de contrato identificada:**

- `IUserSession.role` em `@ava-poc/types`: `"student" | "creator" | "admin"`
- `UserProfile.role` em `useAuthStore.ts`: `"professor" | "student"`
- Nenhuma página usa `IUserSession` diretamente — usam `UserProfile` local. Os dois tipos nunca são reconciliados.

---

### 2. Configuração Global de API (`api.ts`)

**Instância Axios única (`apiClient`):**

| Propriedade    | Valor                          | Fonte                                 |
| -------------- | ------------------------------ | ------------------------------------- |
| `baseURL`      | `import.meta.env.VITE_API_URL` | Env var; fallback `"/api"` se ausente |
| `timeout`      | `10000` (10s)                  | Hardcoded                             |
| `Content-Type` | `"application/json"`           | Header padrão                         |

**Response Interceptor — pipeline de normalização de erros:**

Qualquer erro que sair do Axios passa por este funil antes de chegar ao chamador:

| Tipo recebido    | Formato de saída (`IApiError`)                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `AxiosError`     | `{ message: error.message, status: error.response?.status, statusText: error.response?.statusText, timestamp: ISO string }` |
| `Error` genérico | `{ message: error.message, timestamp: ISO string }`                                                                         |
| `unknown`        | `{ message: "An unexpected error occurred", timestamp: ISO string }`                                                        |

Em todos os casos: `console.error("[API Error]", apiError)` + `Promise.reject(apiError)`. Callers sempre recebem um `IApiError` tipado.

**Request Interceptor:** pass-through stub. Comentário no código indica ponto de inserção do header `Authorization: Bearer <token>` — ainda não implementado. `useAuthStore` e `apiClient` são atualmente desconectados entre si.

**Padrão da camada de serviço (`courseService.ts`, `quizService.ts`):**

- Todas as funções são `async/await` com chamadas Axios tipadas via genérico: `apiClient.get<ICourse[]>("/courses")`
- Importam tipos exclusivamente de `@ava-poc/types` — sem interfaces locais nos arquivos de serviço
- **Nenhum serviço é chamado por nenhuma página atualmente** — toda UI usa dados hardcoded/mock

Endpoints mapeados:

| Serviço         | Função                                    | Método + Endpoint                                             |
| --------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `courseService` | `fetchCourses()`                          | `GET /courses` → `ICourse[]`                                  |
| `courseService` | `fetchCourseById(id)`                     | `GET /courses/:id` → `ICourse`                                |
| `courseService` | `createCourse(payload)`                   | `POST /courses` → `ICourse`                                   |
| `courseService` | `updateCourse(id, payload)`               | `PATCH /courses/:id` → `ICourse`                              |
| `courseService` | `deleteCourse(id)`                        | `DELETE /courses/:id` → `void`                                |
| `quizService`   | `fetchQuizById(id)`                       | `GET /quizzes/:id` → `IQuiz`                                  |
| `quizService`   | `submitQuiz(payload)`                     | `POST /quizzes/:id/submit` → `IQuizSubmissionResult`          |
| `quizService`   | `fetchStudentQuizHistory(studentId)`      | `GET /students/:id/quiz-submissions` → `IStudentSubmission[]` |
| `quizService`   | `fetchQuizSubmissionResult(submissionId)` | `GET /quiz-submissions/:id` → `IQuizSubmissionResult`         |

---

### 3. Store de Autenticação (`useAuthStore`)

**Interfaces locais** (não exportadas de `@ava-poc/types`):

```
UserProfile {
  name: string
  cpf: string
  email: string
  photoUrl: string | null
  role: "professor" | "student"
  password?: string        ← presente apenas no protótipo; não deve existir em produção
}

SentMessage {
  id: string               ← gerado como "msg-${Date.now()}"
  recipientId: string      ← ID do grupo destinatário (ex: "power-bi", "all")
  recipientLabel: string   ← label display do destinatário
  subject: string
  body: string
  sentAt: string           ← ISO date string
}
```

**Estado completo da store:**

| Campo          | Tipo            | Valor inicial                                |
| -------------- | --------------- | -------------------------------------------- |
| `currentUser`  | `UserProfile`   | Perfil estudante (`DEFAULT_USER`)            |
| `sentMessages` | `SentMessage[]` | `MOCK_MESSAGES` (3 mensagens pré-carregadas) |
| `isLoggedIn`   | `boolean`       | `false`                                      |

**Credenciais hardcoded (`CREDENTIALS`):**

| Username      | Password      | Role          | Nome                | CPF         | Email                  |
| ------------- | ------------- | ------------- | ------------------- | ----------- | ---------------------- |
| `"professor"` | `"professor"` | `"professor"` | Prof. Eduardo Silva | 98765432100 | professor@ufc.br       |
| `"estudante"` | `"estudante"` | `"student"`   | Eduardo Marinho     | 12345678901 | eduardo.marinho@ufc.br |

**Mensagens mock pré-carregadas (`MOCK_MESSAGES`):**

| ID        | RecipientId  | Subject                              | sentAt                   |
| --------- | ------------ | ------------------------------------ | ------------------------ |
| `msg-001` | `"power-bi"` | "Bem-vindos ao curso de Power BI!"   | 2026-03-10T09:00:00.000Z |
| `msg-002` | `"all"`      | "Aviso: Manutenção do sistema SOLAR" | 2026-03-08T14:30:00.000Z |
| `msg-003` | `"power-bi"` | "Material complementar — Módulo 02"  | 2026-03-05T11:15:00.000Z |

**Actions e lógicas exatas:**

| Action                               | Lógica passo a passo                                                                                                                                                                                                 | Efeito colateral                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `login(username, password): boolean` | 1. Lookup `CREDENTIALS[username.toLowerCase()]` 2. Se encontrado E `entry.password === password`: seta `currentUser = entry.profile`, `isLoggedIn = true`, retorna `true` 3. Senão: retorna `false` sem mutar estado | Nenhum além do estado                                                           |
| `logout()`                           | 1. `currentUser = DEFAULT_USER` (estudante) 2. `isLoggedIn = false` 3. `sentMessages = MOCK_MESSAGES`                                                                                                                | **Reset de mensagens:** qualquer mensagem enviada durante a sessão é descartada |
| `updateCurrentUser(partial)`         | Spread merge: `currentUser = { ...currentUser, ...partial }`                                                                                                                                                         | Mutação em memória apenas — sem persistência em localStorage ou API             |
| `sendMessage(msg)`                   | Cria `{ ...msg, id: "msg-${Date.now()}", sentAt: new Date().toISOString() }`; **prepend** na lista: `sentMessages = [newMessage, ...sentMessages]`                                                                   | A lista cresce durante a sessão; reset completo no `logout()`                   |

> **Sem persistência de sessão:** `useAuthStore` não usa o middleware `persist` do Zustand. Um refresh da página retorna ao estado inicial: `isLoggedIn: false`, `currentUser = estudante`. O usuário precisa fazer login novamente.

---

### 4. Store de Matrícula (`useCourseStore`)

**Estado completo:**

| Campo                | Tipo       | Valor inicial |
| -------------------- | ---------- | ------------- |
| `enrolledCourses`    | `string[]` | `[]`          |
| `courseStudentRoles` | `string[]` | `[]`          |

**Actions e lógicas:**

| Action                                    | Lógica                                                      | Nota                            |
| ----------------------------------------- | ----------------------------------------------------------- | ------------------------------- |
| `enrollInCourse(courseId)`                | Guarda contra duplicata via `includes()` antes de adicionar | Atualização imutável via spread |
| `unenrollFromCourse(courseId)`            | `filter()` para remover o ID                                | —                               |
| `isEnrolledInCourse(courseId): boolean`   | `enrolledCourses.includes(courseId)` via `get()`            | Selector-style read             |
| `hasCourseStudentRole(courseId): boolean` | `courseStudentRoles.includes(courseId)` via `get()`         | Acesso dual-role para professor |
| `setCourseStudentRoles(roles)`            | Substitui array inteiro                                     | —                               |

**Padrão dual-role:** `courseStudentRoles` é uma segunda lista de matrícula para professores que acessam um curso no modo aluno. `useEnrollmentGuard` verifica `isEnrolledInCourse` E `hasCourseStudentRole` para determinar acesso.

**Sem estados de loading/error:** a store é puramente síncrona e orientada a UI — nenhum campo `isLoading` ou `error`.

---

### 5. Proteção de Rotas (`useEnrollmentGuard` + `AuthLayout`)

**`useEnrollmentGuard(courseId: string)`:**

Lógica de bypass por role (não documentada anteriormente):

```
1. Lê currentUser.role e isEnrolledInCourse(courseId) e hasCourseStudentRole(courseId)
2. Se role === "professor" E NÃO hasCourseStudentRole(courseId):
   → redireciona para "/courses"   ← professor bloqueado se não tiver student role
3. Se role !== "professor" E NÃO isEnrolledInCourse(courseId):
   → redireciona para "/courses"   ← aluno bloqueado se não matriculado
4. Caso contrário: acesso permitido
```

> **Risco de refatoração:** o bypass por role é a única forma do professor acessar conteúdo de curso sem matrícula formal. Remover ou alterar este guard pode fechar acesso do professor ao conteúdo.

**`AuthLayout.tsx`:** wrapper de layout para todas as rotas protegidas em routes.ts. Contém:

- Barra de navegação sticky com menu hambúrguer
- Dropdown de perfil com initials computadas de `currentUser.name`
- Menu hardcoded: `["Cursos", "Portais", "Desenvolvimento", "Política", "Ajuda", "Idioma"]`
- `Sonner toaster` integrado (única instância na aplicação)
- Refs de focus management para acessibilidade do menu

---

### 6. Fluxo de Dados — Auth para API (estado atual vs. estado alvo)

**Estado atual:**

```
LoginPage → useAuthStore.login() → validação contra CREDENTIALS (bundle JS)
                                 → isLoggedIn: true + currentUser setado
                                 → AuthLayout renderiza (sem verificação de isLoggedIn!)

apiClient (Axios) → request interceptor vazio → sem token nos headers
courseService / quizService → chamadas prontas → não usadas por nenhuma página
```

**Pontos de integração para backend (identificados):**

| Arquivo                | Ponto de integração      | O que precisa mudar                                                    |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------- |
| api.ts                 | Request interceptor stub | Injetar `Authorization: Bearer <token>` de `useAuthStore`              |
| useAuthStore.ts        | `login()` action         | Substituir lookup em `CREDENTIALS` por chamada `POST /auth/login`      |
| useAuthStore.ts        | `sendMessage()` action   | Substituir prepend local por chamada `POST /messages`                  |
| RegisterPage.tsx       | `onSubmitValid()`        | Inserir chamada `POST /auth/register` antes de `navigate("/courses")`  |
| ForgotPasswordPage.tsx | `onSubmitValid()`        | Inserir chamada `POST /auth/forgot-password` antes de `navigate("/")`  |
| ProfilePage.tsx        | `handlePasswordSave()`   | Substituir comparação plaintext por chamada `PATCH /users/me/password` |

---

### 7. Flags de Refatoração (atualizado)

| #   | Flag                                                            | Arquivo(s)                                               | Impacto                                                                          |
| --- | --------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | `UserProfile.role` vs `IUserSession.role` — tipos incompatíveis | `useAuthStore.ts` ↔ `@ava-poc/types`                     | Qualquer guard ou componente que alternar entre os dois quebrará silenciosamente |
| 2   | Request interceptor vazio — auth desconectada da API            | `api.ts`                                                 | 100% das chamadas à API não autenticadas                                         |
| 3   | `CREDENTIALS` e `password` em bundle JS                         | `useAuthStore.ts`                                        | Risco de segurança; só aceitável como protótipo                                  |
| 4   | `logout()` descarta mensagens da sessão                         | `useAuthStore.ts`                                        | Comportamento surpreendente; em produção, mensagens devem persistir na API       |
| 5   | `RegisterPage.onSubmitValid` navega sem setar `isLoggedIn`      | `RegisterPage.tsx`                                       | Potencial loop de redirect se `AuthLayout` proteger por `isLoggedIn`             |
| 6   | `ProfilePage` valida senha em plaintext client-side             | `ProfilePage.tsx`                                        | Nunca deve comparar senha local em produção                                      |
| 7   | Sem `persist` middleware no Zustand                             | ambos os stores                                          | Refresh = logout automático; estado de matrícula perdido                         |
| 8   | `UserProfile` é tipo local                                      | `useAuthStore.ts`                                        | Deve estender ou substituir `IUserSession` de `@ava-poc/types`                   |
| 9   | Duplicação Python variant (5 páginas + 2 services)              | `Python*.tsx`, `pythonExamMock.ts`, `pythonProvaData.ts` | Candidata a unificação paramétrica por `courseId`                                |
