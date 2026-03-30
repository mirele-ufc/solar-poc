# 🔄 Próximas Etapas — Fase 2 (Autenticação com Backend)

**Data:** 30/03/2026  
**Status Atual:** Fase 2 — 4/7 subtarefas completadas (57%)  
**Total Progresso:** 17/43 subtarefas (40%)

---

## 📋 Fase 2 — Roadmap (7 subtarefas)

| #   | Subtarefa                               | Status     | Duração  | Dependências |
| --- | --------------------------------------- | ---------- | -------- | ------------ |
| 2.1 | authService endpoints (Auth/Perfil)     | ✅ DONE    | 1 dia    | -            |
| 2.2 | Request Interceptor JWT                 | ✅ DONE    | 1 dia    | 2.1          |
| 2.3 | Integrar LoginPage com POST /auth/login | ✅ DONE    | 1.5 dias | 2.2          |
| 2.4 | Integrar RegisterPage com backend       | ✅ DONE    | 1 dia    | 2.3          |
| 2.5 | Implementar refresh token flow          | ⏳ NEXT    | 1 dia    | 2.4          |
| 2.6 | Integrar ProfilePage com backend        | ⏳ BLOCKED | 1.5 dias | 2.5          |
| 2.7 | Admin: Ativar/desativar contas          | ⏳ BLOCKED | 1 dia    | 2.1          |

---

## ✅ Subtarefa 2.3 — Integrar LoginPage com POST /auth/login

**Objetivo:** Conectar formulário de login (frontend) com endpoint `POST /auth/login` (backend), suportando **email OU username**.

### Componentes Afetados

- `src/pages/LoginPage.tsx` — Formulário de autenticação
- `src/services/authService.ts` — Método login() já existe
- `src/validations/authSchema.ts` — Schemas Zod (refactor para email OU username)

### Fluxo

1. Usuário preenche: email/username + senha
2. Frontend valida com Zod (aceita ambos)
3. POST `/auth/login` com payload `{ emailOuUsuario, senha }`
4. Backend detecta se é email ou username internamente
5. Backend retorna JWT (accessToken + refreshToken) + usuário
6. Frontend armazena tokens em store (Zustand) + solicita header Authorization
7. Redireciona para `/courses` (dashboard)

### Testes Esperados

- Login com **email válido** → sucesso + redirect `/courses`
- Login com **username válido** → sucesso + redirect `/courses`
- Login com credenciais inválidas → toast "Usuário ou senha incorretos"
- Validação Zod: rejeita email inválido E username inválido (< 3 chars)
- Rede indisponível → toast "Erro de conexão"
- Loading state: botão desabilitado durante submissão
- JWT armazenado corretamente em store

### Estimativa

- Implementação: 1.5 dias
- Testes: paralelo
- Commits: 3-4 commits granulares

---

## ✅ Subtarefa 2.4 — Integrar RegisterPage com Backend

**Objetivo:** Conectar formulário de registro (frontend) com endpoint `POST /auth/cadastro` (backend).

### Componentes Afetados

- `src/pages/RegisterPage.tsx` — Formulário de registro
- `src/services/authService.ts` — Método register() já existe
- `src/validations/authSchema.ts` — Schemas Zod

### Fluxo

1. Usuário preenche: nome, email, CPF, senha, confirmação
2. Frontend valida com Zod
3. POST `/auth/cadastro` com payload
4. Backend retorna `UsuarioResponse` + status de ativação
5. Frontend exibe mensagem de sucesso
6. Redireciona para login (ou painel se auto-ativado)

### Testes Esperados

- Validação de CPF format válido
- Validação de email único
- Validação de senha mínima
- Caso de sucesso: mensagem + redirecionamento
- Caso de erro: exibir mensagem específica

### Estimativa

- Implementação: 1 dia
- Testes: 1 dia em paralelo
- Commits: 3-4 commits granulares

---

## 🎯 Subtarefa 2.5 — Refresh Token Flow (próxima)

**Objetivo:** Implementar renovação automática de JWT quando accessToken expirar.

### Componentes Afetados

- `src/services/authService.ts` — Método refreshAccessToken()
- `src/services/api.ts` — Interceptor para renovação automática
- `src/store/useAuthStore.ts` — Armazenar refreshToken

### Fluxo

1. Usuário está logado (accessToken + refreshToken em store)
2. AccessToken expira (401 do backend)
3. API interceptor detecta 401
4. Chama `POST /auth/refresh` com refreshToken
5. Backend retorna novo accessToken
6. API interceptor retenta requisição original
7. Usuário não percebe (transparente)

### Testes Esperados

- Interceptor detecta 401
- Refresh token é enviado corretamente
- Nova requisição passa com novo token
- Se refresh falhar: logout + redireciona para login

### Estimativa

- Implementação: 1 dia
- Testes: 1 dia em paralelo
- Commits: 3-4 commits

---

## 📊 Dependências Críticas

```
2.1 (authService) ✅
  └── 2.2 (Request Interceptor) ✅
      └── 2.3 (LoginPage) ✅
          ├── 2.4 (RegisterPage) ✅
          │   └── 2.5 (Refresh Token) ⏳
          │       └── 2.6 (ProfilePage) ⏳
          │
          └── 2.7 (Admin activation) ⏳
```

---

## 🔑 Contratos Backend (Verificados)

### POST /auth/cadastro

```json
Request:
{
  "nome": "string",
  "email": "string",
  "cpf": "string (format: XXX.XXX.XXX-XX)",
  "senha": "string (min 8 chars)",
  "confirmarSenha": "string"
}

Response (201 Created):
{
  "data": {
    "id": "uuid",
    "nome": "string",
    "email": "string",
    "cpf": "string",
    "role": "professor|admin|student",
    "status": "PENDENTE_ATIVACAO|ATIVO"
  },
  "message": "Cadastro realizado. Aguarde ativação.",
  "status": 201
}
```

### POST /auth/refresh

```json
Request:
{
  "refreshToken": "string (JWT)"
}

Response (200 OK):
{
  "data": {
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT)"
  },
  "message": "Token renovado com sucesso.",
  "status": 200
}
```

---

## ✅ Checklist de Conclusão 2.3

- [x] Backend `POST /auth/login` verificado
- [x] Email/username validation testada (regex em Zod)
- [x] Schemas Zod atualizados para aceitar email OU username
- [x] LoginPage.tsx integrada com serviço
- [x] Testes unitários executados

---

## ✅ Checklist de Conclusão 2.4

- [x] 2.3 (LoginPage) concluída
- [x] Backend `POST /auth/cadastro` integrado
- [x] Validação de CPF aplicada no schema
- [x] Schemas Zod atualizados para CadastroRequest
- [x] RegisterPage.tsx integrada com serviço
- [x] Testes unitários executados

---

## 📝 Notas Gerais para Fase 2

### Convenção de Commits

- `test:` testes para subtarefa
- `refactor:` implementação + sincronizações
- `chore:` deps, configs, updates

### Princípios Mantidos

- ✅ TDD: testes antes da implementação
- ✅ Types estritos (zero `any`)
- ✅ Validações Zod centralizadas
- ✅ Testes passam antes de commit
- ✅ PR para review antes de merge

### Validações Pré-Push

```bash
pnpm type-check    # ✅ Zero erros TypeScript
pnpm lint           # ✅ Zero avisos ESLint
pnpm test           # ✅ Todos testes passam
git status          # ✅ Sem tracked/untracked
```

---

## 🔗 Links Úteis

- Plano completo: [REFACTORING_PLAN_GRANULAR_V2.md](REFACTORING_PLAN_GRANULAR_V2.md)
- Status agora: [MEMORY.MD](../MEMORY.MD)
- Arquitetura: [Estrutura de Pastas](REFACTORING_PLAN_GRANULAR_V2.md#estrutura-de-diretorios)

---

**Próximo agente:** Use `/status-refactoring` para validar readiness de 2.5  
**Executar 2.5:** Use `Implemente 2.5` após aprovação

---

**Última atualização:** 30/03/2026  
**Mantido por:** Agente de Refatoração UFC LMS
