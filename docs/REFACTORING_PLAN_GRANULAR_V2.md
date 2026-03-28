# Plano de Refatoração Granular: UFC LMS Frontend

**Data:** 24/03/2026  
**Versão:** 2.0 — Granular, mapeado a endpoints backend  
**Uso:** Referência persistente para múltiplos chats de implementação  
**Status:** Pronto para execução iterativa (requisitos aprovados)

---

## Visão Geral

**Ambição:** Migrar frontend de 100% mock para integração completa com backend Spring Boot 3.4 (PostgreSQL 16).

**Estrutura:** 7 fases numeradas (0-6) organizadas em **43 subtarefas** (após integração de 5 gaps críticos), cada uma mapeada a:

- ✅ Componente(s) React específico(s)
- ✅ Endpoint(s) backend correspondente(s) — retirado de `arquitetura.md`
- ✅ Tecnologia (Zustand, React Query, Zod, etc.)
- ✅ Testes esperados
- ✅ Duração estimada
- ✅ Critério de aceitação observável

### Estratégia de Execução Híbrida Portável (Frontend-Only)

- Este ciclo altera apenas frontend.
- Execução por gates:
  - Gate 1: base estrutural e tipagem canônica.
  - Gate 2: auth/perfil estáveis no frontend.
  - Gate 3: integração por domínio em paralelo (cursos e provas/admin).
- Operação portável:
  - Sem caminhos absolutos de máquina na documentação.
  - Sessão sempre retomada por `MEMORY.md` na raiz.
  - Setup local padronizado por `.env.example` + `.env.local`.

### Governança de Atualização de Documentação

- Após cada story concluída:
  - atualizar `MEMORY.md` (status, commits, próxima ação).
- Ao concluir fase:
  - revisar `REFACTORING_QUICK_REFERENCE.md` (progressão e próximas ready).
- Ao alterar fluxo operacional:
  - revisar `docs/README.md` (orquestração dos 3 agentes).

---

## FASE 0: Segurança de Navegação (1-2 semanas)

**Objetivo:** Proteger rotas com guard global de autenticação + autorização por role. Eliminar P0-1 (falta de guard).

**Entrega esperada:**

- `ProtectedRoute` component que valida `isLoggedIn` + `role`
- Todas as rotas autenticadas ativas protegidas
- Logout limpa estado de sessão no cliente e redireciona sem chamada de endpoint

### 0.1 Criar componente ProtectedRoute com validação de role

**Arquivo:** `src/components/ProtectedRoute.tsx` (novo)  
**Lógica:**

- Verifica `useAuthStore().isLoggedIn`
- Verifica `useAuthStore().currentUser.role` contra lista de roles permitidos
- Se falhar: autenticação → redirect `/` com toast "Sessão expirada"
- Se falhar: autenticação → redirect `/` com toast "Sessão expirada"
- Se falhar: autorização → redirect `/unauthorized` (404-like) com toast "Acesso negado"
- Se OK → renderiza `<Outlet />`

**Testes:**

- Sem token → redireciona para login
- Com token inválido → redireciona para login
- Com role inválido → página de acesso negado
- Com role correto → renderiza página

**Duração:** 1 dia (design component, testes simples)

**Commits esperados:**

```
feat: Criar ProtectedRoute com validação de autenticação e role
test: Adicionar testes para ProtectedRoute (sem token, role inválido, com sucesso)
```

---

### 0.2 Integrar ProtectedRoute em `routes.ts`

**Arquivo:** `src/routes.ts` (refactor)  
**Ação:** Envolver todas as rotas autenticadas ativas em `<ProtectedRoute>` com `allowedRoles` explícito.

**Antes:**

```typescript
{ path: "/courses", element: <CoursesPage /> }
```

**Depois:**

```typescript
{
  path: "/courses",
  element: <ProtectedRoute allowedRoles={["professor", "student"]}><CoursesPage /></ProtectedRoute>
}
```

**Rotas ativas a guardar:**

- /courses
- /courses/:id/manage (professor only)
- /profile
- /my-courses (professor only)
- /create-course (professor only)
- /create-course/modules (professor only)
- /create-course/exam (professor only)
- /courses/power-bi/\* (8 rotas)
- /courses/python/\* (8 rotas)
- /courses/power-bi/\* (8 rotas)
- /courses/python/\* (8 rotas)
- /admin/usuarios (admin only)

**Fora do escopo ativo:** rotas legadas de mensageria (`/message`, `/messages`, `/received-messages`) devem ser removidas/ocultadas na 4.5 por nao possuirem endpoint contratual.

**Testes:**

- Acessar `/courses` sem autenticação → redirect `/`
- Acessar `/create-course` como student → 404 ou unauthorized
- Acessar `/admin/usuarios` como professor → 404 ou unauthorized

**Duração:** 1.5 dias (refactoring em massa, validação cruzada das rotas ativas)

**Commits esperados:**

```
refactor: Integrar ProtectedRoute em routes.ts para rotas autenticadas
test: Validar proteção de navegação em rotas críticas (professor, student, admin)
```

---

### 0.3 Remover hardcodes de role em páginas

**Arquivos:** Todas as 24 páginas autenticadas em `src/pages/`  
**Ação:** Procura por `useAuthStore().currentUser.role === "professor"` em páginas; remover branches de autorização local, confiar em `ProtectedRoute`.
**Exemplo:**

- `CoursesPage.tsx` → remover `if (role === "professor") { /* render prof view */ }`
- Página agora renderiza APENAS seu conteúdo; `ProtectedRoute` valida quem chega
  **Duração:** 2 dias (refactoring, testes unitários de comportamento)
  **Commit esperado:**

  **Duração:** 2 dias (refactoring, testes unitários de comportamento)
  **Commit esperado:**

```
refactor: Remover hardcodes de role de pages — confiar em ProtectedRoute
```

---

### 0.4 Implementar logout seguro e limpeza de estado

**Arquivo:** `src/store/useAuthStore.ts` (refactor)  
**Ação:**

- `logout()` action limpa:
- `currentUser = null`
- `isLoggedIn = false`
- `token = null` (se tiver)
- estado em memória do frontend (sem persistir JWT em storage inseguro)
- Após logout → redirect automático para `/`
  **Regra contratual estrita:**
  **Regra contratual estrita:**
- Não existe endpoint de logout em `arquitetura.md`.
- Fluxo de logout deve ser exclusivamente local no frontend: limpar estado de autenticação e redirecionar.
- É proibido adicionar `POST /logout`, `POST /auth/logout` ou qualquer rota equivalente fora do contrato.
  **Testes:**
  **Testes:**
- Chamar `logout()` → `isLoggedIn === false`
- Chamar `logout()` → estado de autenticação limpo em memória
- Chamar `logout()` → redirect para `/`
- Chamar `logout()` → nenhuma chamada de API de logout é disparada
  **Duração:** 1 dia
  **Commits esperados:**

  **Duração:** 1 dia
  **Commits esperados:**

```
refactor: Implementar logout seguro com limpeza de sessão e estado de autenticação
test: Validar logout limpa estado global e redireciona
```

---

### 0.5 Implementar Unauthorized page e tratamento de erro de acesso

**Arquivo:**

**Arquivo:**

- `src/pages/UnauthorizedPage.tsx` (novo)
- `src/routes.ts` (adicionar rota /unauthorized)
  **Lógica:**
  **Lógica:**
- Página minimalista: "Você não tem permissão para acessar este recurso"
- Botão "Voltar" ou "Ir para dashboard"
- Redirection automática após 5s para `/courses`
  **Duração:** 0.5 dias
  **Commit esperado:**

  **Duração:** 0.5 dias
  **Commit esperado:**

```
feat: Criar UnauthorizedPage com redirecionamento automático
```

---

### 0.6 Validar que nenhuma rota pública é protegida incorretamente

**Rotas públicas (NÃO devem ser guardiadas):**

- `/` (login)
- `/register`
- `/forgot-password`
  **Teste:** Acessar cada uma sem autenticação → deve funcionar
  **Duração:** 0.5 dias
  **Commit esperado:**

  **Teste:** Acessar cada uma sem autenticação → deve funcionar
  **Duração:** 0.5 dias
  **Commit esperado:**

```
test: Validar rotas públicas não são bloqueadas por ProtectedRoute
```

---

### 0.7 Implementar tratamento de erros HTTP padronizado + estados de carregamento

**Arquivo:** `src/services/api.ts` (refactor)
**Requisitos:** RF39-RF44 (integração preserva layout e UX), RNF16 (feedback claro ao usuário)
**Responsabilidades:**

1. **Response interceptor trata HTTP errors com toasts:**

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sessão expirada → toast + redirect login
      toast.error("Sessão expirada. Faça login novamente.");
      useAuthStore.getState().logout();
      window.location.href = "/";
    } else if (error.response?.status === 403) {
      // Sem permissão
      toast.error("Você não tem permissão para realizar esta ação.");
    } else if (error.response?.status === 409) {
      // Conflito (ex: curso já existe)
      toast.error(error.response.data.message || "Recurso em conflito");
    } else if (error.response?.status === 422) {
      // Validação falhou
      toast.error("Dados inválidos. Verifique os campos.");
    } else if (error.response?.status >= 500) {
      // Erro no servidor
      toast.error("Erro no servidor. Tente novamente.");
    }
    return Promise.reject(error);
  },
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sessão expirada → toast + redirect login
      toast.error("Sessão expirada. Faça login novamente.");
      useAuthStore.getState().logout();
      window.location.href = "/";
    } else if (error.response?.status === 403) {
      // Sem permissão
      toast.error("Você não tem permissão para realizar esta ação.");
    } else if (error.response?.status === 409) {
      // Conflito (ex: curso já existe)
      toast.error(error.response.data.message || "Recurso em conflito");
    } else if (error.response?.status === 422) {
      // Validação falhou
      toast.error("Dados inválidos. Verifique os campos.");
    } else if (error.response?.status >= 500) {
      // Erro no servidor
      toast.error("Erro no servidor. Tente novamente.");
    }
    return Promise.reject(error);
  },
);
```

2. **Estados de carregamento em componentes (via React Query):**

- Desabilitar botões submit durante requisição (`mutation.isPending`)
- Exibir spinner/skeleton loading
- Mostrar "Carregando..." em texto

3. **Estados vazios em listas:**

- Cursos vazio: "Crie seu primeiro curso"
- Módulos vazio: "Adicione módulos ao curso"
- Mensagens vazio: "Nenhuma mensagem"
- Exames vazio: "Crie sua primeira prova"
  **Testes:**
  **Testes:**
- API erro 401 → toast exibido + redirect login
- API erro 409 → toast com mensagem de conflito
- API erro 500 → toast genérico
- Loading state: botão desabilitado durante requisição
- Estado vazio: mensagem exibida (cursos, módulos, etc.)
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
feat: Implementar response interceptor com tratamento de HTTP errors (RF39-RF44)
feat: Adicionar loading states em componentes de ação
feat: Implementar estados vazios em listas com mensagens orientadoras
test: Validar toasts de erro, loading states, estados vazios
```

## **Impacto:** Reutilizado em Fases 2, 3, 4, 5 (todas as integrações backend)

## **Impacto:** Reutilizado em Fases 2, 3, 4, 5 (todas as integrações backend)

**Checklist Fase 0:**

- [x] `ProtectedRoute` component criado e testado
- [x] Todas as rotas autenticadas ativas envolvidas em `ProtectedRoute`
- [x] Role hardcodes removidos de páginas
- [x] Logout seguro implementado localmente (estado limpo + redirect, sem endpoint)
- [x] UnauthorizedPage criada
- [x] Rotas públicas validadas (sem guard falso)
- [x] Bundle sem regressão

**Nota de auditoria (2026-03-27, atualizada):**

- Todos os itens do Checklist Fase 0 confirmados ✅ por auditoria em 27/03/2026.
- Evidências: `routes/ProtectedRoute.tsx` (guard ativo), `store/useAuthStore.ts` (logout local com `set({...INITIAL_STATE})` + `window.history.replaceState`), `__tests__/unit/routes/publicRoutes.test.tsx` (4 testes passando), `get_errors` zero erros, zero hardcodes de role em pages.

---

## FASE 1: Contratos Canônicos e Tipagem (1-2 semanas)

**Objetivo:** Eliminar ambiguidade entre tipos. Matriz única de domínio + API contracts. Resolver inconsistência `role`.
**Entrega esperada:**

- @ava-poc/types v1.0 com 16 interfaces consolidadas e versionadas
- authSchema.ts, courseSchema.ts, etc. em sync com tipos
- Zero `any` em TypeScript
- Nenhuma página importa tipos locais desalinhados

### 1.1 Auditar e consolidar tipos em @ava-poc/types

**Arquivo:** `packages/types/src/index.ts`
**Situação atual (conflito):**

- `IUserSession.role` em types: `"student" | "creator" | "admin"`
- `UserProfile.role` em useAuthStore.ts: `"professor" | "student"`
- Nenhuma página usa `IUserSession` corretamente
  **Ação:**

  **Ação:**

1. Definir **tabela de mapeamento canonical:**

```
Backend (DB):     PROFESSOR      | ALUNO        | ADMIN
Frontend (code):  "professor"    | "student"    | "admin"
API Response:     "PROFESSOR"    | "ALUNO"      | "ADMIN" (enum)
```

2. Criar tipos únicos em @ava-poc/types:

```typescript
// Domínio
export interface IUserSession {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  role: "professor" | "student" | "admin";
  status: "ATIVO" | "INATIVO";
  fotoUrl?: string;
  id: string;
  nome: string;
  cpf: string;
  email: string;
  role: "professor" | "student" | "admin";
  status: "ATIVO" | "INATIVO";
  fotoUrl?: string;
}
export interface ICourse {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  cargaHoraria: string;
  status: "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";
  professorId: string;
  // ... demais campos
export interface ICourse {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  cargaHoraria: string;
  status: "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";
  professorId: string;
  // ... demais campos
}
// API Contracts
// API Contracts
export interface ILoginRequest {
  email: string;
  senha: string;
  email: string;
  senha: string;
}
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: IUserSession;
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: IUserSession;
}
export interface ICourseCreateRequest {
  titulo: string;
  categoria: string;
  descricao: string;
  cargaHoraria: string;
  requerEndereco: boolean;
  requerGenero: boolean;
  requerIdade: boolean;
export interface ICourseCreateRequest {
  titulo: string;
  categoria: string;
  descricao: string;
  cargaHoraria: string;
  requerEndereco: boolean;
  requerGenero: boolean;
  requerIdade: boolean;
}
export interface IApiError {
  message: string;
  status: number;
  timestamp: string;
export interface IApiError {
  message: string;
  status: number;
  timestamp: string;
}
```

3. Exportar tipos versionados:

```typescript
export const TYPES_VERSION = "1.0.0";
```

**Testes:**

- `npm run type-check` — sem erros
- Nenhuma página importa tipos locais de useAuthStore
- Rodar type-checker em strict mode
  **Duração:** 2 dias (audit, consolidação, refactor de imports)
  **Commits esperados:**

  **Duração:** 2 dias (audit, consolidação, refactor de imports)
  **Commits esperados:**

```
refactor: Consolidar tipos domain + API em @ava-poc/types v1.0
refactor: Resolver inconsistência role (professor/creator mapeamento)
chore: Adicionar TYPES_VERSION = "1.0.0" para rastreabilidade
```

---

### 1.2 Migrar useAuthStore para tipos globais

**Arquivo:** `src/store/useAuthStore.ts`
**Antes:**

```typescript
type UserProfile = {
  name: string;
  role: "professor" | "student";
  password?: string; // ❌ NUNCA deve existir em produção
  name: string;
  role: "professor" | "student";
  password?: string; // ❌ NUNCA deve existir em produção
};
```

**Depois:**

```typescript
import { IUserSession } from "@ava-poc/types";
type StoreState = {
  currentUser: IUserSession | null;
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  currentUser: IUserSession | null;
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
};
```

**Ação:**

- Remover campo `password` de `UserProfile`
- Remover hardcoded CREDENTIALS (será integrado com backend em Fase 2)
- Usar `IUserSession` como fonte de verdade
  **Duração:** 1 dia
  **Commit esperado:**

  **Duração:** 1 dia
  **Commit esperado:**

```
refactor: Migrar useAuthStore para tipos globais IUserSession
```

---

### 1.3 Centralizar e alinhar schemas Zod

**Arquivos:** `src/validations/`
**Ação:** Cada schema reflete a interface de tipos correspondente.
**Exemplo:**

```typescript
// validations/authSchema.ts
import { z } from "zod";
import { ILoginRequest } from "@ava-poc/types";
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
}) satisfies z.ZodType<ILoginRequest>;
export type LoginFormValues = z.infer<typeof loginSchema>;
```

**Schemas a refatorar:**

- `authSchema.ts` → loginSchema, registerSchema, forgotPasswordSchema
- `courseSchema.ts` → courseCreateSchema, courseUpdateSchema
- `examSchema.ts` → questionSchema, quizSubmitSchema
- `fileSchema.ts` → imageSchema, videoSchema, pdfSchema (refatorar para usar Zod + RN07/RN08)
- `messageSchema.ts` → legado fora do escopo ativo (manter apenas para rastreabilidade)
  **Testes:**
  **Testes:**
- Validação de email falha se inválido
- Validação de CPF passa para CPF válido
- Validação de imagem 200x200 passa; 100x100 falha
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Alinhar schemas Zod com tipos de contrato (auth, courses, exams)
test: Validar cobertura de schemas Zod para casos de erro
```

---

### 1.4 Remover tipos locais duplicados de pages

**Ação:** Procurar `types/index.ts` e pages; remover tipos que devem estar em @ava-poc/types.
**Exemplo de remoção:**

- `ICourseCardProps` → se usada em múltiplas páginas, mover para @ava-poc/types

- `ICourseCardProps` → se usada em múltiplas páginas, mover para @ava-poc/types
- `IMessageCardProps` → se usada apenas em uma página, deixar no arquivo
  **Duração:** 1 dia
  **Commit esperado:**

  **Duração:** 1 dia
  **Commit esperado:**

```
refactor: Remover tipos locais duplicados — centralizar em @ava-poc/types
```

---

### 1.5 Validar zero `any` em TypeScript

**Comando:** `grep -r "any" src/ --include="*.ts" --include="*.tsx"`
**Ação:** Remover ou documentar cada `any` com comentário de justificativa.
**Duração:** 0.5 dias
**Commit esperado:**

```
refactor: Remover any de TypeScript — tipos explícitos obrigatórios
```

---

### 1.6 Refatorar componentes com Slots Pattern — Card, Modal, FormContainer

**Objetivo:** Implementar padrão de composição via slots para eliminar prop explosion. Alinha-se com CLAUDE.md § Padrões de Componentes.
**Problema atual:**

```typescript
// ❌ Muitas props
<Card title="Curso" category="Dev" image={url} imageAlt="..."
<Card title="Curso" category="Dev" image={url} imageAlt="..."
subtitle="Aprenda" description="..." />
```

**Solução (Slots):**

```typescript
// ✅ Composição clara
<Card>
<Card.Header>
<Card.Image src={url} alt="..." />
<Card.Title>Curso</Card.Title>
<Card.Category>Dev</Card.Category>
</Card.Header>
<Card.Body>
<Card.Subtitle>Aprenda</Card.Subtitle>
<Card.Description>...</Card.Description>
</Card.Body>
<Card.Footer>
<Button>Ação</Button>
</Card.Footer>
</Card>
```

**Componentes a refatorar:**

1. **Card (atualizar existente em `src/components/ui/card.tsx`)**

- Adicionar slots: `Card.Image`, `Card.Header`, `Card.Body`, `Card.Footer`
- Manter backward-compatibility se necessário (children como fallback)

2. **Modal (novo em `src/components/ui/modal.tsx`)**

```typescript
<Modal isOpen={isOpen} onClose={onClose}>
<Modal.Header>Confirmar ação</Modal.Header>
<Modal.Body>Você tem certeza?</Modal.Body>
<Modal.Footer>
<Button variant="ghost" onClick={onClose}>Cancelar</Button>
<Button variant="primary" onClick={onConfirm}>Confirmar</Button>
</Modal.Footer>
</Modal>
```

3. **FormContainer (novo em `src/components/FormContainer.tsx`)**

- Base para CreateCoursePage, CreateExamPage, etc.

```typescript
<FormContainer onSubmit={handleSubmit}>
<FormContainer.Header title="Criar Curso" />
<FormContainer.Body>
<Input name="titulo" label="Título" />
<Input name="categoria" label="Categoria" />
</FormContainer.Body>
<FormContainer.Footer>
<Button type="submit">Salvar</Button>
<Button type="button" onClick={onCancel} variant="ghost">Cancelar</Button>
</FormContainer.Footer>
</FormContainer>
```

**Benefícios:**

- Elimina prop explosion (5-10 props → composição clara)
- SOLID: cada slot tem responsabilidade única
- Reutilização aumenta (componentes adaptáveis)
- DRY: reduz duplicação em Fase 5 (Python vs Power BI)
  **Testes:**
  **Testes:**
- Card renderiza slots corretamente (image, header, body, footer)
- Modal fecha ao clicar Cancelar
- FormContainer submete dados via `handleSubmit` callback
- Slots não renderizados → component não quebra
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Refatorar Card component com Slots Pattern
feat: Criar Modal component com composição de slots (Header, Body, Footer)
feat: Criar FormContainer com slots — base para create pages
test: Validar composição de slots em componentes (Card, Modal, FormContainer)
```

**Impacto em fases posteriores:**

- Fase 2: LoginPage e RegisterPage usam FormContainer
- Fase 3: CreateCoursePage refatorada com FormContainer
- Fase 4: CreateExamPage refatorada com FormContainer
- Fase 5: Deduplicação Python vs Power BI reutiliza componentes com slots (menos duplicação)

---

**Checklist Fase 1:**

- [x] @ava-poc/types consolidado com 16 interfaces versionadas
- [x] Tabela de mapeamento role documentada
- [x] useAuthStore migrado para `IUserSession`
- [x] Schemas Zod alinhados com tipos de contrato
- [x] Zero `any` em TypeScript
- [x] `npm run type-check` — zero erros

**Nota de auditoria (2026-03-27, atualizada):**

- Todos os itens do Checklist Fase 1 confirmados ✅ por auditoria em 27/03/2026.
- Evidências: `packages/types/src/index.ts` (`TYPES_VERSION = "1.0.0"`, 16+ interfaces, tabela de mapeamento de roles documentada), `useAuthStore.ts` importa `IUserSession` de `@ava-poc/types`, schemas com `satisfies z.ZodType<...>` em `authSchema.ts`/`courseSchema.ts`/`examSchema.ts`, `get_errors` zero erros, zero `: any` no src.

---

## FASE 2: Autenticação com Backend (2-3 semanas)

**Objetivo:** Integrar login real com `/auth/login`, `/auth/cadastro`, `/auth/refresh`.
**Entrega esperada:**

- LoginPage consumindo `POST /auth/login` (novo)
- RegisterPage consumindo `POST /auth/cadastro` (novo)
- JWT armazenado com segurança (preferência por cookie httpOnly; sem persistir em localStorage)
- Refresh token flow automático
- Logout sem endpoint dedicado; apenas limpeza local do estado de autenticação

### 2.1 Criar authService.ts com endpoints de autenticação

**Arquivo:** `src/services/authService.ts` (novo)
**Funções esperadas:**

```typescript
export const authService = {
// POST /auth/login
login(email: string, senha: string): Promise<ILoginResponse>,
  // POST /auth/cadastro
register(payload: ICadastroRequest): Promise<ILoginResponse>,
  // POST /auth/recuperar-senha
requestPasswordReset(email: string): Promise<{ message: string }>,
  // POST /auth/redefinir-senha
resetPassword(token: string, novaSenha: string): Promise<{ message: string }>,
  // POST /auth/refresh
refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>,
  // GET /perfil
getProfile(): Promise<IUserSession>,
};
```

**Mapping de endpoints (de arquitetura.md):**

- `POST /auth/cadastro`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/recuperar-senha`
- `POST /auth/redefinir-senha`
- **Não existe** `POST /auth/logout` nem qualquer endpoint de logout no contrato
  **Testes unitários:**
  **Testes unitários:**
- login valido → retorna `ILoginResponse` com tokens
- login inválido → `IApiError` com status 401
- register válido → usuario criado
- register CPF duplicado → `IApiError` com status 409
- refresh com token expirado → `IApiError` com status 401
  **Duração:** 2 dias
  **Commits esperados:**

  **Duração:** 2 dias
  **Commits esperados:**

```
feat: Criar authService.ts com endpoints (login, register, forgot, refresh)
test: Validar authService contra backend (mocks com MSW se backend indisponível)
```

---

### 2.2 Implementar Request Interceptor em api.ts

**Arquivo:** `src/services/api.ts` (refactor)
**Ação:** Request interceptor injeta `Authorization: Bearer <accessToken>` em toda requisição.
**Lógica:**

```typescript
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Duração:** 1 dia
**Commit esperado:**

```
refactor: Implementar request interceptor para injetar JWT em headers
```

---

### 2.3 Integrar LoginPage com POST /auth/login (com suporte email OU username)

**Arquivo:** `src/pages/LoginPage.tsx` (refactor)  
**Validação:** `src/validations/authSchema.ts` (refactor com RF02)
**Requisito RF02:** Login com **e-mail ou nome de usuário** + senha → JWT
**Schema Zod (Gap 3 inline refactor):**

```typescript
// validations/authSchema.ts
export const loginSchema = z.object({
  emailOuUsuario: z
    .string()
    .min(1, "E-mail ou nome de usuário obrigatório")
    .refine(
      (value) => isValidEmail(value) || isValidUsername(value),
      "E-mail ou nome de usuário inválido",
    ),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  emailOuUsuario: z
    .string()
    .min(1, "E-mail ou nome de usuário obrigatório")
    .refine(
      (value) => isValidEmail(value) || isValidUsername(value),
      "E-mail ou nome de usuário inválido",
    ),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
// Helpers
const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidUsername = (value: string) => /^[a-zA-Z0-9_]{3,20}$/.test(value);
```

**Payload para backend:**

```typescript
interface ILoginRequest {
  emailOuUsuario: string; // Backend detecta se é email ou username
  senha: string;
  emailOuUsuario: string; // Backend detecta se é email ou username
  senha: string;
}
```

**Implementação em LoginPage:**

```typescript
import { authService } from "@/services/authService";
import { loginSchema } from "@/validations/authSchema";
const mutation = useMutation({
  mutationFn: (creds: ILoginRequest) =>
    authService.login(creds.emailOuUsuario, creds.senha),
  onSuccess: (response) => {
    useAuthStore
      .getState()
      .setToken(response.accessToken, response.refreshToken);
    useAuthStore.getState().setCurrentUser(response.usuario);
    navigate("/courses");
  },
  onError: (error: IApiError) => {
    setGeneralError(error.message);
  },
  mutationFn: (creds: ILoginRequest) =>
    authService.login(creds.emailOuUsuario, creds.senha),
  onSuccess: (response) => {
    useAuthStore
      .getState()
      .setToken(response.accessToken, response.refreshToken);
    useAuthStore.getState().setCurrentUser(response.usuario);
    navigate("/courses");
  },
  onError: (error: IApiError) => {
    setGeneralError(error.message);
  },
});
const onSubmitValid = (data) => {
  mutation.mutate(data);
  mutation.mutate(data);
};
```

**Testes:**

- Login com email válido → sucesso + redirect `/courses` + token armazenado
- Login com username válido → sucesso + redirect `/courses`
- Login com credenciais inválidas → toast "Usuário ou senha incorretos"
- Login com campo inválido → validação Zod bloqueia
- Rede indisponível → toast "Erro de conexão"
- Loading state: botão desabilitado durante submissão
  **Duração:** 1.5 dias (inclui refactor inline 2.3 de loginSchema)
  **Commits esperados:**

  **Duração:** 1.5 dias (inclui refactor inline 2.3 de loginSchema)
  **Commits esperados:**

```
refactor: Atualizar loginSchema para aceitar email OU username (RF02)
refactor: Integrar LoginPage com POST /auth/login (email OU username)
test: Validar login com email, username, credenciais inválidas
```

---

### 2.4 Integrar RegisterPage com POST /auth/cadastro

**Arquivo:** `src/pages/RegisterPage.tsx` (refactor)
**Esquema:**

```typescript
export const registerSchema = z
  .object({
    nome: z.string().min(3, "Mínimo 3 caracteres"),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Mínimo 6 caracteres"),
    senhaConfirm: z.string(),
    perfil: z.enum(["professor", "student"]),
  })
  .refine((data) => data.senha === data.senhaConfirm, {
    message: "Senhas não coincidem",
    path: ["senhaConfirm"],
  });
export const registerSchema = z
  .object({
    nome: z.string().min(3, "Mínimo 3 caracteres"),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Mínimo 6 caracteres"),
    senhaConfirm: z.string(),
    perfil: z.enum(["professor", "student"]),
  })
  .refine((data) => data.senha === data.senhaConfirm, {
    message: "Senhas não coincidem",
    path: ["senhaConfirm"],
  });
```

**Mapeamento de payload:**

```typescript
const registerPayload: ICadastroRequest = {
  nome: form.nome,
  cpf: form.cpf,
  email: form.email,
  senha: form.senha,
  perfil: form.perfil === "professor" ? "PROFESSOR" : "ALUNO",
  nome: form.nome,
  cpf: form.cpf,
  email: form.email,
  senha: form.senha,
  perfil: form.perfil === "professor" ? "PROFESSOR" : "ALUNO",
};
```

**Testes:**

- Cadastro válido → usuario criado, status INATIVO
- CPF duplicado → erro 409
- Email duplicado → erro 409
- Senhas não coincidem → validação Zod bloqueia
- Após registro → exibir mensagem "Conta pendente de ativação"
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Integrar RegisterPage com POST /auth/cadastro
test: Validar registro com validações Zod (CPF, email, senha)
```

---

### 2.5 Implementar refresh token flow automático

**Arquivo:** `src/services/api.ts` (refactor)
**Lógica:** Response interceptor:

- Se status 401 → usar refresh token para obter novo access token
- Reenviar requisição com novo token
- Se refresh também falhar → redirect para login
  **Código:**

  **Código:**

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { accessToken } = await authService.refreshAccessToken(
          refreshToken!,
        );
        useAuthStore.getState().setToken(accessToken, refreshToken);
        return apiClient(error.config);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { accessToken } = await authService.refreshAccessToken(
          refreshToken!,
        );
        useAuthStore.getState().setToken(accessToken, refreshToken);
        return apiClient(error.config);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);
```

**Testes:**

- Requisição com token expirado → refresh automático
- Requisição reenviada com novo token → sucesso
- Refresh também falha → redirect login + logout
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
feat: Implementar refresh token flow automático em response interceptor
test: Validar refresh token e reenvio automático de requisição
```

---

### 2.6 Integrar ProfilePage com GET /perfil e PUT /perfil/senha

**Arquivo:** `src/pages/ProfilePage.tsx` (refactor)
**Endpoints (de arquitetura.md):**

- `GET /perfil` → retorna `IUserSession`
- `PUT /perfil/foto` → upload de foto
- `PUT /perfil/senha` → alterar senha (requer senha atual)
  **Ações:**

  **Ações:**

```typescript
// Carregar perfil
const { data: profile } = useQuery({
  queryKey: ["profile"],
  queryFn: () => authService.getProfile(),
  queryKey: ["profile"],
  queryFn: () => authService.getProfile(),
});
// Alterar senha
const changePwdMutation = useMutation({
  mutationFn: (data: IChangePasswordRequest) =>
    authService.changePassword(data.senhaAtual, data.novaSenha),
  onSuccess: () => toast("Senha alterada com sucesso"),
  mutationFn: (data: IChangePasswordRequest) =>
    authService.changePassword(data.senhaAtual, data.novaSenha),
  onSuccess: () => toast("Senha alterada com sucesso"),
});
// Upload foto
const uploadPhotoMutation = useMutation({
  mutationFn: (file: File) => authService.uploadProfilePhoto(file),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  mutationFn: (file: File) => authService.uploadProfilePhoto(file),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
});
```

**RN03 (Imutabilidade CPF/email):** Campos deshabilitados, readonly.
**RN08 (Foto de perfil):** Validação JPG/PNG/GIF + mín. 200x200 via `fileSchema`.
**Testes:**

- Carregar perfil → dados atualizados da store
- Alterar senha válida → sucesso
- Senha atual inválida → erro 401
- Upload foto inválida (< 200x200) → erro de validação Zod
- CPF/email não editáveis
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Integrar ProfilePage com GET /perfil e PUT /perfil/senha
test: Validar carga de perfil, alteração de senha, upload de foto
```

---

### 2.7 Integrar ForgotPasswordPage e ResetPasswordPage

**Arquivos:**

**Arquivos:**

- `src/pages/ForgotPasswordPage.tsx` (refactor)
- `src/pages/ResetPasswordPage.tsx` (novo)
  **Fluxo:**

  **Fluxo:**

1. ForgotPasswordPage → `POST /auth/recuperar-senha` com email
2. Backend envia token por email (RN09: expira em 30 minutos)
3. Usuário clica link no email → ResetPasswordPage com token na URL
4. Valida token e submete `POST /auth/redefinir-senha`
   **Rota:** `/reset-password?token=<token>` (pública, sem guard)
   **Testes:**

   **Rota:** `/reset-password?token=<token>` (pública, sem guard)
   **Testes:**

- Email válido → mensagem "Verifique seu email"
- Email inválido → erro genérico (sem enumeration)
- Token expirado → "Token expirado, solicite novo"
- Token usado (RN09) → "Token já foi utilizado"
- Redefinição válida → redirect login com mensagem "Senha alterada"
  **Duração:** 2 dias
  **Commits esperados:**

  **Duração:** 2 dias
  **Commits esperados:**

```
refactor: Integrar ForgotPasswordPage com POST /auth/recuperar-senha
feat: Criar ResetPasswordPage com POST /auth/redefinir-senha
test: Validar fluxo de recuperação de senha (token expirado, código usado)
```

---

**Checklist Fase 2:**

- [x] authService.ts criado com endpoints contratuais (login, register, forgot, refresh, reset, profile)
- [x] Request interceptor injeta JWT
- [x] LoginPage integrada com backend
- [x] RegisterPage integrada com backend
- [x] Refresh token flow automático
- [ ] ProfilePage integrada com backend (GET /perfil, PUT /perfil/senha)
- [ ] ForgotPasswordPage + ResetPasswordPage integradas
- [ ] Logout permanece local e não chama endpoint inexistente
- [ ] Branch `feature/refactor-auth-backend` mergeada em development
- [ ] Testes end-to-end passando (login → dashboard → logout)

---

## FASE 3: Gestão de Cursos com Backend (2-3 semanas)

**Objetivo:** Integrar cursos reais via `/cursos/*` endpoints (GET list, POST create, PUT update, DELETE delete).
**Entrega esperada:**

- CoursesPage consume `GET /cursos` paginado
- CreateCoursePage consome `POST /cursos`
- ManageCoursePage consome `GET /cursos/:id`, `PUT /cursos/:id`, `PATCH /cursos/:id/status`
- RN02 enforcement: professor vê apenas seus cursos
- RN06 enforcement: aluno vê apenas cursos PUBLICADOS
- RF13-RF15 enforcement: configuracoes de matricula e status do curso

### 3.1 Criar courseService.ts com endpoints de cursos

**Arquivo:** `src/services/courseService.ts` (novo)
**Funções:**

```typescript
export const courseService = {
// GET /cursos?status=PUBLICO&page=0&size=10
fetchCourses(params: { status?: string; page?: number; size?: number }): Promise<IPage<ICourse>>,
  // GET /cursos/:id
fetchCourseById(id: string): Promise<ICourse>,
  // POST /cursos
createCourse(payload: ICourseCreateRequest): Promise<ICourse>,
  // PUT /cursos/:id
updateCourse(id: string, payload: ICourseUpdateRequest): Promise<ICourse>,
  // DELETE /cursos/:id
deleteCourse(id: string): Promise<void>,
  // PATCH /cursos/:id/status
updateCourseStatus(id: string, status: "RASCUNHO" | "PUBLICADO" | "ARQUIVADO"): Promise<ICourse>,
  // GET /cursos/buscar?q=termo
searchCourses(query: string): Promise<ICourse[]>,
  // PUT /cursos/:id/capa (upload de imagem)
uploadCourseCover(id: string, file: File): Promise<ICourse>,
};
```

**Endpoints (de arquitetura.md):**

- `GET /cursos` (paginado)
- `POST /cursos`
- `GET /cursos/{id}`
- `PUT /cursos/{id}`
- `DELETE /cursos/{id}`
- `PATCH /cursos/{id}/status`
- `GET /cursos/buscar`
  **Testes:**
  **Testes:**
- Listar cursos → retorna paginado
- Criar curso válido → retorna ICourse com id
- Update curso válido → retorna atualizado
- Delete curso com alunos → erro 409 (RN02)
- Buscar por términa → retorna filtrado
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
feat: Criar courseService.ts com endpoints (GET, POST, PUT, DELETE, search)
test: Validar courseService contra backend (CRUD de cursos)
```

---

### 3.2 Integrar CoursesPage com GET /cursos e listar cursos reais

**Arquivo:** `src/pages/CoursesPage.tsx` (refactor)
**Antes:**

```typescript
const computacaoCourses = [
  { id: "power-bi", title: "Power Bi - Fundamentos" },
  // ... hardcoded
  { id: "power-bi", title: "Power Bi - Fundamentos" },
  // ... hardcoded
];
```

**Depois:**

```typescript
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";
export function CoursesPage() {
const user = useAuthStore((s) => s.currentUser);
  // Professor vê seus cursos ativos + arquivados
// Aluno vê cursos PUBLICADOS
const status = user?.role === "professor" ? undefined : "PUBLICADO";
  const { data, isLoading } = useQuery({
queryKey: ["courses", { status }],
queryFn: () => courseService.fetchCourses({ status }),
});
  if (isLoading) return <Spinner />;
  return (
<div>
{user?.role === "professor" && <Button>Criar Curso</Button>}
<CourseList courses={data?.content || []} />
</div>
);
}
```

**RN02 enforcement:** Filtragem no backend (backend retorna apenas cursos do professor).
**RN06 enforcement:** Se aluno, filtra por status=PUBLICADO.
**Paginação:** TanStack Query com suporte a offset/limit.
**Testes:**

- Professor vê seus 3 cursos + 3 arquivados
- Aluno vê apenas cursos PUBLICADOS
- Paginação funciona (page=0, size=10)
- Loading state exibido
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Integrar CoursesPage com GET /cursos e paginação
test: Validar listaem de cursos por role (professor, student)
```

---

### 3.3 Integrar CreateCoursePage com POST /cursos

**Arquivo:** `src/pages/CreateCoursePage.tsx` (refactor)
**Schema:**

```typescript
export const courseCreateSchema = z.object({
  titulo: z.string().min(5, "Mínimo 5 caracteres"),
  categoria: z.string().min(1, "Categoria obrigatória"),
  descricao: z.string().min(10, "Mínimo 10 caracteres"),
  cargaHoraria: z.string().regex(/^\d+h?$/, "Formato: 30h ou 30"),
  requerEndereco: z.boolean().default(false),
  requerGenero: z.boolean().default(false),
  requerIdade: z.boolean().default(false),
  titulo: z.string().min(5, "Mínimo 5 caracteres"),
  categoria: z.string().min(1, "Categoria obrigatória"),
  descricao: z.string().min(10, "Mínimo 10 caracteres"),
  cargaHoraria: z.string().regex(/^\d+h?$/, "Formato: 30h ou 30"),
  requerEndereco: z.boolean().default(false),
  requerGenero: z.boolean().default(false),
  requerIdade: z.boolean().default(false),
});
```

**Upload de capa:** Validação via `imageFileSchema` (RN10: mín. 200x200).
**Fluxo:**

```typescript
const createMutation = useMutation({
  mutationFn: async (data: ICourseCreateRequest) => {
    const curso = await courseService.createCourse(data);
    if (coverFile) {
      await courseService.uploadCourseCover(curso.id, coverFile);
    }
    return curso;
  },
  onSuccess: (curso) => {
    navigate("/courses");
    toast("Curso criado com sucesso");
  },
  mutationFn: async (data: ICourseCreateRequest) => {
    const curso = await courseService.createCourse(data);
    if (coverFile) {
      await courseService.uploadCourseCover(curso.id, coverFile);
    }
    return curso;
  },
  onSuccess: (curso) => {
    navigate("/courses");
    toast("Curso criado com sucesso");
  },
});
```

**Testes:**

- Criar curso válido → retorna com id
- Título vazio → erro Zod
- Capa < 200x200 → erro de validação
- Capa upload após POST → sucesso
- Navegação após criação → `/courses`
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Integrar CreateCoursePage com POST /cursos
test: Validar criação de curso com upload de capa
```

---

### 3.4 Integrar ManageCoursePage com GET/PUT/DELETE /cursos/:id

**Arquivo:** `src/pages/ManageCoursePage.tsx` (refactor)
**Ações:**

```typescript
// Carregar curso
const { data: course } = useQuery({
  queryKey: ["courses", courseId],
  queryFn: () => courseService.fetchCourseById(courseId),
  queryKey: ["courses", courseId],
  queryFn: () => courseService.fetchCourseById(courseId),
});
// Editar curso
const updateMutation = useMutation({
  mutationFn: (data: ICourseUpdateRequest) =>
    courseService.updateCourse(courseId, data),
  onSuccess: () => {
    toast("Curso atualizado");
    queryClient.invalidateQueries({ queryKey: ["courses"] });
  },
  mutationFn: (data: ICourseUpdateRequest) =>
    courseService.updateCourse(courseId, data),
  onSuccess: () => {
    toast("Curso atualizado");
    queryClient.invalidateQueries({ queryKey: ["courses"] });
  },
});
// Deletar curso
const deleteMutation = useMutation({
  mutationFn: () => courseService.deleteCourse(courseId),
  onSuccess: () => {
    navigate("/courses");
    toast("Curso removido");
  },
  onError: (error) => {
    if (error.status === 409) {
      toast("Não é possível deletar curso com alunos matriculados");
    }
  },
  mutationFn: () => courseService.deleteCourse(courseId),
  onSuccess: () => {
    navigate("/courses");
    toast("Curso removido");
  },
  onError: (error) => {
    if (error.status === 409) {
      toast("Não é possível deletar curso com alunos matriculados");
    }
  },
});
// Alterar status
const statusMutation = useMutation({
  mutationFn: (status: string) =>
    courseService.updateCourseStatus(courseId, status),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  mutationFn: (status: string) =>
    courseService.updateCourseStatus(courseId, status),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
});
```

**RN02 enforcement:** Backend valida que professor é dono do curso; frontend não permite editar curso de outro.
**RN06 enforcement:** Curso RASCUNHO não aparece para alunos (backend filtra).
**Testes:**

- Carregar curso existente → dados preenchidos
- Editar curso válido → sucesso
- Deletar curso sem alunos → sucesso
- Deletar curso com alunos → erro 409 + toast
- Publicar curso RASCUNHO → status muda para PUBLICADO
  **Duração:** 2 dias
  **Commits esperados:**

  **Duração:** 2 dias
  **Commits esperados:**

```
refactor: Integrar ManageCoursePage com GET/PUT/DELETE /cursos/:id
test: Validar edição e deleção de cursos (ownership, delete restriction)
```

---

### 3.5 Criar modulesService.ts e aulas com backend

**Arquivo:** `src/services/modulesService.ts` (novo)
**Funções (endpoints de arquitetura.md):**

- `POST /cursos/{cursoId}/modulos` — criar módulo
- `PUT /modulos/{id}` — editar módulo
- `DELETE /modulos/{id}` — deletar (renumera demais)
- `PATCH /modulos/{id}/ordem` — reordenar
  **RN04 enforcement:** Ao deletar módulo, backend renumera demais automaticamente.
  **Testes:**
  **RN04 enforcement:** Ao deletar módulo, backend renumera demais automaticamente.
  **Testes:**
- Criar módulo → nome gerado como "Módulo 01"
- Deletar módulo 2 de 3 → demais renomeados para "Módulo 01", "Módulo 02"
- Reordenar módulo 1 para posição 2 → ordem persiste
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
feat: Criar modulesService.ts com endpoints (POST, PUT, DELETE, PATCH ordem)
test: Validar renumeração de módulos ao deletar
```

---

### 3.6 Criar lessonsService.ts e integrar com Aulas

**Arquivo:** `src/services/lessonsService.ts` (novo)
**Funções (endpoints de arquitetura.md):**

- `POST /modulos/{moduloId}/aulas` — criar aula
- `PUT /aulas/{id}` — editar (CKEditor + arquivo coexistem)
- `DELETE /aulas/{id}` — deletar
- `PATCH /aulas/{id}/ordem` — reordenar
- `POST /aulas/{id}/gerar-conteudo` — Spring AI preview (não salva, RN12)
- `POST /aulas/{id}/confirmar-conteudo` — salvar conteúdo gerado
  **RN07 enforcement:** Tipos de arquivo: PDF, MP4, AVI, MOV, WebM. Rejeitar outros.
  **RN12 enforcement:** Conteúdo gerado NOT salvo até confirmação explícita.
  **Testes:**
  **RN07 enforcement:** Tipos de arquivo: PDF, MP4, AVI, MOV, WebM. Rejeitar outros.
  **RN12 enforcement:** Conteúdo gerado NOT salvo até confirmação explícita.
  **Testes:**
- Criar aula com arquivo PDF → sucesso
- Upload arquivo inválido (`.txt`) → erro RN07
- Gerar conteúdo IA → preview em modal, NÃO salvo
- Confirmar conteúdo gerado → persistido em `conteudo_gerado`
- Reordenar aulas → ordem refletida
  **Duração:** 2 dias
  **Commits esperados:**

  **Duração:** 2 dias
  **Commits esperados:**

```
feat: Criar lessonsService.ts com endpoints (CRUD, gerar-conteudo, confirmar)
test: Validar geração IA (preview sem save) e confirmação de conteúdo
```

---

**Checklist Fase 3:**

- [ ] courseService.ts criado
- [ ] CoursesPage integrada com GET /cursos (paginado, filtrado por role)
- [ ] CreateCoursePage integrada com POST /cursos + upload capa
- [ ] ManageCoursePage integrada com GET/PUT/DELETE /cursos/:id
- [ ] modulesService.ts integrado (renumeração ao deletar)
- [ ] lessonsService.ts integrado (CRUD, gerar conteúdo, confirmar)
- [ ] RN02 (propriedade), RN04 (renumeração), RN06 (status), RN07 (tipos arquivo) enforçados
- [ ] Branch `feature/refactor-courses-backend` mergeada em development

---

## FASE 4: Exames e Conformidade Contratual (2-3 semanas)

**Objetivo:** Integrar provas reais via endpoints oficiais de arquitetura e remover fluxos/rotas sem endpoint documentado.

### 4.1 Criar examService.ts com endpoints de prova

**Arquivo:** `src/services/examService.ts` (novo)
**Funções (endpoints de arquitetura.md):**

```typescript
export const examService = {
// POST /modulos/{moduloId}/prova
createExam(moduloId: string, payload: IExamCreateRequest): Promise<IExam>,
  // GET /modulos/{moduloId}/prova
fetchExamByModule(moduloId: string): Promise<IExam>,
  // PUT /provas/{id}
updateExam(id: string, payload: IExamUpdateRequest): Promise<IExam>,
  // DELETE /provas/{id}
deleteExam(id: string): Promise<void>,
  // POST /provas/{id}/perguntas
createQuestion(provaId: string, payload: IQuestionCreateRequest): Promise<IQuestion>,
  // PUT /perguntas/{id}
updateQuestion(id: string, payload: IQuestionUpdateRequest): Promise<IQuestion>,
  // DELETE /perguntas/{id}
deleteQuestion(id: string): Promise<void>,
  // POST /perguntas/{perguntaId}/alternativas
createAlternative(perguntaId: string, payload: IAlternativeCreateRequest): Promise<IAlternative>,
  // PUT /alternativas/{id}
updateAlternative(id: string, payload: IAlternativeUpdateRequest): Promise<IAlternative>,
  // DELETE /alternativas/{id}
deleteAlternative(id: string): Promise<void>,
  // POST /provas/{id}/gerar-quiz-ia (Spring AI, não salva)
generateQuizWithAI(provaId: string, sourceData: string): Promise<IQuiz>,
// DELETE /provas/{id}
deleteExam(provaId: string): Promise<void>,
  // GET /provas/{id}/resultados (statísticas pós-publicação)
fetchExamResults(provaId: string): Promise<IExamStats>,
};
```

**Testes:**

- Criar prova em módulo → sucesso
- Criar pergunta com < 2 alternativas → erro 400
- Criar pergunta sem resposta correta → erro 400
- Gerar quiz IA → preview retornado, NÃO salvo
- Submeter prova → backend calcula resultado, retorna pontuação
  **Duração:** 2 dias
  **Commits esperados:**

  **Duração:** 2 dias
  **Commits esperados:**

```
feat: Criar examService.ts com endpoints (CRUD prova/pergunta/alternativa, submit, gerar IA)
test: Validar validações de pergunta (mín. 2 alternativas, 1 correta)
```

---

### 4.2 Integrar CreateExamPage com POST /modulos/{moduloId}/prova e perguntas

**Arquivo:** `src/pages/CreateExamPage.tsx` (refactor)
**Fluxo:**

1. Criar prova via `POST /modulos/{moduloId}/prova`
2. Adicionar perguntas via `POST /provas/{id}/perguntas`
3. Adicionar alternativas via `POST /perguntas/{id}/alternativas`
   **RN05 enforcement:** Validar mín. 2 alternativas e exatamente 1 correta no frontend + backend.
   **RN11 enforcement:** Checkboxes independentes em aba Configurações (mostrar respostas erradas/corretas/valores).
   **Testes:**

   **RN05 enforcement:** Validar mín. 2 alternativas e exatamente 1 correta no frontend + backend.
   **RN11 enforcement:** Checkboxes independentes em aba Configurações (mostrar respostas erradas/corretas/valores).
   **Testes:**

- Criar prova com 3 perguntas → todas persistidas
- Pergunta sem alternativa correta → bloqueado salvamento
- Configurações independentes → todas salvas corretamente
  **Duração:** 2 dias
  **Commits esperados:**

  **Duração:** 2 dias
  **Commits esperados:**

```
refactor: Integrar CreateExamPage com POST /modulos/{moduloId}/prova
test: Validar criação de prova com perguntas e alternativas
```

---

### 4.3 Refatorar ExamPage para consumir GET /provas/:id e submeter

**Arquivo:** `src/pages/ExamPage.tsx` (refactor)
**Antes:** Carregava de `provaData.ts` (mock)
**Depois:**

```typescript
const { data: exam } = useQuery({
queryKey: ["exams", examId],
queryFn: () => examService.fetchExamByModule(examId),
});
const submitMutation = useMutation({
mutationFn: (answers: IExamSubmission) =>
onSuccess: (result) => {
navigate("/courses/power-bi/exam/results", { state: { result } });
},
});
```

**RN12 enforcement:** Frontend NÃO calcula resultado; backend retorna tudo.
**Testes:**

- Carregar prova → exibe perguntas do backend
- Responder todas → enable botão enviar
- Enviar → backend calcula, retorna resultado
- Timeout prova → autoenvio (se implementado)
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Integrar ExamPage com GET /provas/:id e POST submissão
test: Validar submissão de prova e cálculo de resultado no backend
```

---

### 4.4 Refatorar ExamResultPage para consumir resultado do backend

**Arquivo:** `src/pages/ExamResultPage.tsx` (refactor)
**Antes:** Calculava resultado localmente comparando respostas vs gabarito

**Resposta carrega:**

- Pontuação total
- Percentual de acerto
- Status de aprovação (se aplicável)
- Feedback por pergunta (se configurado em RN11)
  **Testes:**
  **Testes:**
- Resultado exibe pontuação correta
- Percentual calculado corretamente
- Feedback condicional (mostrar respostas erradas/corretas)
  **Duração:** 1 dia
  **Commits esperados:**

  **Duração:** 1 dia
  **Commits esperados:**

```
refactor: ExamResultPage consome resultado do backend (não calcula localmente)
test: Validar exibição de resultado e feedback condicional
```

---

### 4.5 Remover fluxos de mensagens do escopo ativo (sem endpoint contratual)

**Arquivos:**

- `src/pages/MessagesPage.tsx`
- `src/pages/StudentMessagesPage.tsx`
- `src/routes.ts`
  **Ação:**
  **Ação:**
- Remover/ocultar rotas e chamadas dependentes de `/mensagens`.
- Manter apenas shell visual quando necessário para preservar UX, sem integração backend.
- Registrar remoção no plano e na rastreabilidade.
  **Testes:**
  **Testes:**
- Nenhuma chamada HTTP para `/mensagens` no fluxo ativo.
- Rotas não contratuais não aparecem na navegação principal.
  **Duração:** 1 dia
  **Commits esperados:**

  **Duração:** 1 dia
  **Commits esperados:**

```
refactor: Remover fluxos de mensagens sem endpoint oficial em arquitetura.md
test: Garantir ausência de chamadas para /mensagens no fluxo ativo
```

---

### 4.6 Saneamento de rotas e serviços não contratuais

**Arquivos:**

- `src/services/*`
- `src/routes.ts`
- documentação em `/docs/`
  **Ação:**
  **Ação:**
- Remover referências a endpoints não documentados em `.claude/commands/doc/arquitetura.md`.
- Garantir que rotas frontend reflitam somente endpoints contratuais.
- Atualizar documentação para refletir escopo limpo.
  **Testes:**
  **Testes:**
- Busca no código não retorna endpoints fora de `arquitetura.md`.
- Build/lint/test sem regressão após saneamento.
  **Duração:** 1.5 dias
  **Commits esperados:**

  **Duração:** 1.5 dias
  **Commits esperados:**

```
refactor: Sanear rotas e serviços para contrato estrito de arquitetura
docs: Atualizar rastreabilidade removendo endpoints sem contrato
```

---

### 4.7 Integrar geração de quiz via IA — POST /modulos/{id}/prova/gerar-quiz-ia

**Arquivo:** `src/pages/CreateExamPage.tsx` (refactor — nova aba/botão)  
**Requisitos:** RF35-RF38 (geração IA, preview sem save, edição pré-persistência), RNF10 (Spring AI)
**Fluxo (Gap 2):**

1. **Professor em aba "Perguntas"** clica botão **"Gerar com IA"**

- Modal abre: "Gerando perguntas..."
- Spinner exibido durante processamento

2. **Backend processa via Spring AI:**

- Lê conteúdo legível do módulo (aulas com `conteudo` ou `conteudo_gerado`)
- Retorna JSON (não salva automaticamente — RN12)

3. **Resposta backend (200 OK):**

```json
{
  "perguntas": [
    {
      "enunciado": "O que é Spring?",
      "alternativas": ["Framework", "Linguagem", "Bug"],
      "respostaCorretaIndex": 0,
      "pontos": 1
    },
    {
      "enunciado": "Qual é a anotação de controller?",
      "alternativas": ["@Controller", "@Service", "@Repository"],
      "respostaCorretaIndex": 0,
      "pontos": 1
    }
  ]
  "perguntas": [
    {
      "enunciado": "O que é Spring?",
      "alternativas": ["Framework", "Linguagem", "Bug"],
      "respostaCorretaIndex": 0,
      "pontos": 1
    },
    {
      "enunciado": "Qual é a anotação de controller?",
      "alternativas": ["@Controller", "@Service", "@Repository"],
      "respostaCorretaIndex": 0,
      "pontos": 1
    }
  ]
}
```

4. **Frontend exibe preview em modal:**

- Cada pergunta renderizada com alternativas
- Professor pode editar enunciado, alternativas, resposta correta **antes de salvar**
- Botões: "Descartar" (fecha modal), "Salvar Quiz" (persiste)

5. **Erro handling (222 ou 422):**

- Se módulo vazio: `422 Unprocessable Entity`
- Mensagem: "Adicione aulas ao módulo antes de gerar quiz com IA"
- Frontend exibe toast com orientação

6. **Submit via endpoint padrão:**

- Ao clicar "Salvar Quiz", submete perguntas editadas para `POST /provas/{provaId}/perguntas`
- Cada pergunta registra resposta correta antes de persistir
  **Mapeamento de endpoints:**
  **Mapeamento de endpoints:**
- `POST /modulos/{moduloId}/prova/gerar-quiz-ia` — Spring AI
- `POST /provas/{id}/perguntas` — persist perguntas editadas
  **Testes:**
  **Testes:**
- Módulo com aulas → gera perguntas sugeridas (mock ou real backend)
- Módulo vazio → erro 422 com mensagem orientadora
- Editar pergunta sugerida → alterações não salvas automaticamente
- Confirmar → cria prova com perguntas editadas
- Descarta → modal fecha, perguntas não persistidas
- Validação: pergunta tem ≥2 alternativas e 1 correta (RN05)
  **Duração:** 2-3 dias (integração IA, modal, edição, validações)
  **Commits esperados:**

  **Duração:** 2-3 dias (integração IA, modal, edição, validações)
  **Commits esperados:**

```
feat: Integrar geração de quiz via IA (POST /modulos/:id/prova/gerar-quiz-ia)
feat: Criar modal de preview e edição de perguntas geradas
test: Validar geração, edição e persistência condicional de quiz (RF35-RF38)
test: Validar erro handling para módulo vazio
```

## **Impacto:** RN12 enforcement (não salva até confirmação)

**Checklist Fase 4:\*\***

## **Impacto:** RN12 enforcement (não salva até confirmação)

**Checklist Fase 4:\*\***

- [ ] examService.ts criado com endpoints (CRUD, submit, gerar IA)
- [ ] CreateExamPage integrada com backend
- [ ] ExamPage integrada com GET /provas/:id
- [ ] ExamResultPage exibe resultado do backend
- [ ] Fluxos de mensagens removidos do escopo ativo (sem endpoint contratual)
- [ ] Rotas/serviços não contratuais saneados
- [ ] RN05 (validação pergunta), RN11 (configs independentes), RN12 (upload IA) enforçados
- [ ] Branch `feature/refactor-exams-contractual` mergeada em development

---

## FASE 5: Deduplicação Python vs Power BI (1-2 semanas)

**Objetivo:** Eliminar duplicação de páginas; uma base compartilhada com configurações por curso.

### 5.1 Extrair Lesson component compartilhado

**Antes:**

**Antes:**

- `LessonsPage.tsx` (power-bi)
- `PythonLessonsPage.tsx` (python)
  → 2 componentes idênticos
  **Depois:**
  → 2 componentes idênticos
  **Depois:**
- `LessonPage.tsx` (genérico com `:courseId` na rota)
- Configuração por curso (expiração, feedback, etc.) vem do backend
  **Duração:** 1.5 dias
  **Commit esperado:**

  **Duração:** 1.5 dias
  **Commit esperado:**

```
refactor: Extrair LessonPage compartilhada (elimina duplicação Python/Power BI)
```

---

### 5.2 Extrair Exam component compartilhado

**Antes:**

- `ExamPage.tsx`, `ExamResultPage.tsx`, `ExamInstructionsPage.tsx` (power-bi)
- `PythonExamPage.tsx`, `PythonExamResultPage.tsx`, `PythonExamInstructionsPage.tsx` (python)
  → 6 componentes com 95% overlapa
  **Depois:**
  → 6 componentes com 95% overlapa
  **Depois:**
- `/courses/:courseId/exam/instructions`
- `/courses/:courseId/exam`
- `/courses/:courseId/exam/results`
  **Duração:** 2 dias
  **Commits esperados:**

  **Duração:** 2 dias
  **Commits esperados:**

```
refactor: Extrair ExamPage compartilhada (elimina duplicação Python/Power BI)
```

---

### 5.3 Remover hardcodes `/courses/power-bi/*`, `/courses/python/*` de routes.ts

**Antes:**

```typescript
{ path: "/courses/power-bi/modules", element: <ModulesPage /> },
{ path: "/courses/python/modules", element: <PythonModulesPage /> },
```

**Depois:**

```typescript
{ path: "/courses/:courseId/modules", element: <ModulesPage /> },
```

**Duração:** 1 dia
**Commit esperado:**

```
refactor: Remover hardcodes de rotas — usar :courseId genérico
```

---

### 5.4 Alinhar configuração de curso com backend

**Ação:** Backend retorna em `GET /cursos/:id`:

- `tempoProvaMinutos` (ex: 90)
- `mostrarRespostasErradas` (ex: true)
- `mostrarResultadoAposFim` (ex: true)
- Variações de config por curso
  **Frontend usa configuração para:**
  **Frontend usa configuração para:**
- Timer de prova (dinamicamente, não hardcoded em Python vs Power BI)
- Feedback condicional
- Renderização de componentes
  **Duração:** 1 day
  **Commit esperado:**

  **Duração:** 1 day
  **Commit esperado:**

```
refactor: Consumir configuração dinâmica de curso (tempo prova, feedback, etc.)
```

---

**Checklist Fase 5:**

- [ ] LessonPage genérica criada (elimina PythonLessonsPage)
- [ ] ExamPage genérica criada (elimina PythonExamPage, PythonExamResultPage, etc.)
- [ ] Rotas sem hardcodes (:/courseId)
- [ ] Configuração dinâmica por curso consumida
- [ ] Sem regressão visual ou funcional em power-bi ou python
- [ ] Branch `feature/refactor-deduplicate-courses` mergeada em development

---

## FASE 6: Hardening, A11y e Documentação (1-2 semanas)

**Objetivo:** Padronização final, acessibilidade, atualização de docs.

### 6.1 Padronização de breadcrumbs

**Componente:** `<Breadcrumb />` em `src/components/shared/Breadcrumb.tsx`
**Implementação:**

- Usado em todas as 24 páginas autenticadas
- Estrutura: Home > Cursos > [Nome] > [Ação]
- Acessível: ARIA labels `aria-current="page"`
- Estilo: Tailwind, icones de separação (/)
  **Duração:** 1 day
  **Commit esperado:**

  **Duração:** 1 day
  **Commit esperado:**

```
refactor: Padronizar breadcrumbs em todas as páginas autenticadas
```

---

### 6.2 Auditoria de idioma (português em UX, inglês em código)

**Ação:** Procurar variáveis/funções em português no código; renomear para inglês se necessário.
**Exemplos:**

- ❌ `nome` → ✅ `userName` (em código)
- ✅ "Nome do usuário" (em UX, português)
- ❌ `handleMudarSenha` → ✅ `handleChangePassword`
  **Duração:** 1 day
  **Commit esperado:**

  **Duração:** 1 day
  **Commit esperado:**

```
refactor: Auditoria linguística (código em inglês, UX em português)
```

---

### 6.3 Melhorias de A11y

**Checklist:**

- [ ] ARIA labels em inputs
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Contraste de cores (WCAG AA)
- [ ] Screen reader testing (NVAccess + Firefox)
      **Duração:** 1.5 days
      **Commits esperados:**

      **Duração:** 1.5 days
      **Commits esperados:**

```
refactor: Adicionar ARIA labels em formulários
refactor: Melhorar navegação por teclado (Tab order, Escape para fechar modais)
```

---

### 6.4 Atualizar documentação de slices

**Arquivos:** `.claude/commands/frontend/` — todos os `*-current.md`
**Ação:** Elencar novo estado (pós-refactoring) com endpoints reais, não mocks.
**Duração:** 1 day
**Commits esperados:**

```
docs: Atualizar auth-profile-current.md — integração backend complete
docs: Atualizar courses-current.md — endpoints reais de CRUD
docs: Atualizar exams-current.md — resultado server-side
docs: Atualizar messaging-current.md — histórico persistente
```

---

### 6.5 Atualizar CLAUDE.md com novo estado

**Arquivo:** `CLAUDE.md`
**Mudanças:**

- Estado Atual do Projeto → "Fase 1 finalizada (Segurança + Contratos)"
- Alinhamento Frontend x Backend → removido "mock" em reflexões
- Novos endpoints documentados
  **Duração:** 0.5 days
  **Commit esperado:**

  **Duração:** 0.5 days
  **Commit esperado:**

```
docs: Atualizar CLAUDE.md — estado de refatoração completo
```

---

### 6.7 Implementar governança de entrega — PR checklist + code review criteria

**Objetivo:** Operacionalizar RNF30-RNF32 (atualização de documentação de contrato, revisão técnica, evidência de não-regressão).
**Artefatos a criar:**

1. **`.github/pull_request_template.md`**

```markdown
## 📋 Checklist de Submissão (Desenvolvedor)

- [ ] TDD: RED → GREEN → REFACTOR executado

- [ ] TDD: RED → GREEN → REFACTOR executado
- [ ] Testes escritos (mín. 2-3 por função)
- [ ] Cobertura ≥ 80%
- [ ] `npm run type-check` — zero erros
- [ ] `npm run lint` — zero warnings
- [ ] `npm run build` — sucesso
- [ ] Documentação atualizada:
- [ ] CLAUDE.md (se mudança de diretriz)
- [ ] RF/RN/RNF criados ou atualizados (se mudança de contrato)
- [ ] Docstrings de funções públicas (JSDoc)
- [ ] Nenhuma regressão visual (screenshot antes/depois se mudança UI)
- [ ] Aderência contratual confirmada (endpoint, payload, response status)
- [ ] Commits em português no imperativo com prefixo [TIPO]
  ## 🎯 RFs/RNs Associados
  ## 🎯 RFs/RNs Associados
- [ ] RF### — [descrição da funcionalidade]
- [ ] RN## — [regra de negócio associada]
  ## 📝 Notas
  [Detalhes adicionais sobre a mudança, decisões de design, ou problemas encontrados]
  ## 📝 Notas
  [Detalhes adicionais sobre a mudança, decisões de design, ou problemas encontrados]
```

2. **`.github/CODE_REVIEW_CHECKLIST.md`**

```markdown
# Code Review Checklist — UFC LMS Frontend (RNF30-32)

## Clean Code (RNF19)

## Clean Code (RNF19)

- [ ] Funções: < 10 linhas (exceto componentes React com muita JSX)
- [ ] Zero duplicação de código (DRY)
- [ ] Nomes descritivos: variáveis, funções, componentes refletem intenção de negócio
- [ ] Sem `console.log`, `debugger`, ou TODOs em produção
  ## SOLID (RNF20)
  ## SOLID (RNF20)
- [ ] Componente: uma única responsabilidade
- [ ] Separação clara: apresentação / orquestracao / acesso a dados
- [ ] Sem lógica de negócio em componentes de UI (deslocar para hooks ou services)
- [ ] Zero Test Doubles desnecessários (mocks bem justificados)
  ## Segurança (OWASP)
  ## Segurança (OWASP)
- [ ] Zero Trust Client: sem lógica de autorização/autenticação em cliente
- [ ] XSS: sem `dangerouslySetInnerHTML` sem sanitização (usar DOMPurify se necessário)
- [ ] CSRF: tokens validados em requisições de escrita
- [ ] Tokens JWT: armazenados em cookie httpOnly/Secure (evitar persistência em localStorage/sessionStorage)
  ## Performance (RNF24-29)
  ## Performance (RNF24-29)
- [ ] Bundle size: `npm run build -- --analyze` — sem regressões
- [ ] Lazy loading: componentes pesados com React.lazy() e Suspense
- [ ] Memo: apenas em componentes com descedentes 100+ elementos ou callbacks custosos
- [ ] React Query: deduplicacao, refetch inteligente, cache management
  ## Documentação (RNF30)
  ## Documentação (RNF30)
- [ ] CLAUDE.md: atualizado se mudança de diretriz ou contrato
- [ ] RF/RN/RNF: criados ou atualizados no repositório se novo requisito
- [ ] Tipos: JSDoc com @param, @returns em funções públicas
- [ ] User Stories: atualizadas se nova jornada de usuário
  ## Testes (RNF21)
  ## Testes (RNF21)
- [ ] Cobertura ≥ 80%
- [ ] TDD: RED → GREEN → REFACTOR evidente nos commits
- [ ] Naming: `test("deve X quando Y acontecer", ...)`
- [ ] Mocks: MSW ou @testing-library, não hardcodes em testes
```

3. **Seção em CLAUDE.md: "Critério de Aprovação de PR (RNF30-RNF32)"**

```markdown
## Critério de Aprovação de PR (RNF30-RNF32)

### Fase de Submissão (Desenvolvedor)

### Fase de Submissão (Desenvolvedor)

1. **TDD obrigatório:** RED → GREEN → REFACTOR
2. **Cobertura ≥ 80%** (nyc report)
3. **Validações passando:** type-check, lint, build
4. **Documentação atualizada:**

- CLAUDE.md reflete mudanças de diretriz ou contrato
- RF/RN/RNF criados ou atualizados
- JSDoc em funções públicas

5. **Evidência de não-regressão:** screenshot antes/depois (se mudança UI)
6. **Aderência contratual:** endpoint, payload, status HTTP documentados
   ### Fase de Code Review (Revisor)
7. **Checklist de Submissão:** desenvolvedor completou todos os itens
8. **CODE_REVIEW_CHECKLIST.md:** validar Clean Code, SOLID, Segurança, Performance
9. **RFs/RNs:** comportamento implementado alinha-se com contrato
10. **Testes:** 2-3 casos por função (sucesso, erro, edge case)
    ### Fase de Aprovação (2 Code Reviews Mínimo)
11. **CI/CD verde:** tests, lint, type-check, build
12. **Sem conflitos** com `development`
13. **Merge:** Squash or Rebase (manter histórico granular)
14. **Tag de release:** v.X.Y.Z pós-merge em `main`
15. **Checklist de Submissão:** desenvolvedor completou todos os itens
16. **CODE_REVIEW_CHECKLIST.md:** validar Clean Code, SOLID, Segurança, Performance
17. **RFs/RNs:** comportamento implementado alinha-se com contrato
18. **Testes:** 2-3 casos por função (sucesso, erro, edge case)
    ### Fase de Aprovação (2 Code Reviews Mínimo)
19. **CI/CD verde:** tests, lint, type-check, build
20. **Sem conflitos** com `development`
21. **Merge:** Squash or Rebase (manter histórico granular)
22. **Tag de release:** v.X.Y.Z pós-merge em `main`
```

4. **Validação piloto da governança**

- Abrir PR piloto usando o template e validar preenchimento obrigatório
- Executar checklist de revisão técnica em um caso real
- Confirmar rastreabilidade RF/RN/RNF e evidências de não-regressão
- Registrar ajustes finais na documentação de processo
  **Testes:**
  **Testes:**
- PR template aparece ao criar novo PR
- Todos PRs incluem checklist completo
- Code review checklist reflete critérios técnicos (Clean Code, SOLID, Performance)
- Governança validada em PR piloto com ajustes finais registrados
- Documentação de criteria visível para times
  **Duração:** 1 dia
  **Commits esperados:**

  **Duração:** 1 dia
  **Commits esperados:**

```
chore: Adicionar governança de entrega — PR template (RNF30-RNF32)
docs: Publicar CODE_REVIEW_CHECKLIST.md com critérios técnicos
docs: Atualizar CLAUDE.md com critério de aprovação de PR
docs: Consolidar validação piloto da governança de entrega
```

## **Impacto:** Aplicável a todos PRs futuro (gate de qualidade)

## **Impacto:** Aplicável a todos PRs futuro (gate de qualidade)

**Checklist Fase 6:**

- [ ] Breadcrumbs padronizados em todas as páginas
- [ ] Código em inglês, UX em português
- [ ] A11y: ARIA, keyboard nav, contraste validados
- [ ] Documentação de slices atualizada
- [ ] CLAUDE.md refletindo novo estado
- [ ] PR template criado e validado em PR piloto
- [ ] Code review checklist aplicado em revisão técnica
- [ ] Branch `feature/refactor-hardening-a11y` mergeada em development

---

## Resumo de 43 Subtarefas (após integração de 5 gaps)

| Fase      | # Subtarefas | Duração Total     | Risco     | RNF-chave                              |
| --------- | ------------ | ----------------- | --------- | -------------------------------------- |
| **0**     | 7            | 1-2 sem.          | Baixo     | RNF16, RNF17, RNF20                    |
| **1**     | 6            | 1-2 sem.          | Baixo     | RNF15, RNF19, RNF20, RNF21             |
| **2**     | 7            | 2-3 sem.          | Médio     | RNF02, RNF17, RF02 (email OU username) |
| **3**     | 6            | 2-3 sem.          | Médio     | RNF16, RNF23                           |
| **4**     | 7            | 2-3 sem.          | Médio     | RNF10 (AI), RNF16, RNF23, RF35-RF38    |
| **5**     | 4            | 1-2 sem.          | Médio     | RNF24-29                               |
| **6**     | 6            | 1-2 sem.          | Baixo     | RNF19-20, RNF30-32 (governance)        |
| **Total** | **43**       | **11-17 semanas** | **Médio** | Todas                                  |

| Fase      | # Subtarefas | Duração Total     | Risco     | RNF-chave                              |
| --------- | ------------ | ----------------- | --------- | -------------------------------------- |
| **0**     | 7            | 1-2 sem.          | Baixo     | RNF16, RNF17, RNF20                    |
| **1**     | 6            | 1-2 sem.          | Baixo     | RNF15, RNF19, RNF20, RNF21             |
| **2**     | 7            | 2-3 sem.          | Médio     | RNF02, RNF17, RF02 (email OU username) |
| **3**     | 6            | 2-3 sem.          | Médio     | RNF16, RNF23                           |
| **4**     | 7            | 2-3 sem.          | Médio     | RNF10 (AI), RNF16, RNF23, RF35-RF38    |
| **5**     | 4            | 1-2 sem.          | Médio     | RNF24-29                               |
| **6**     | 6            | 1-2 sem.          | Baixo     | RNF19-20, RNF30-32 (governance)        |
| **Total** | **43**       | **11-17 semanas** | **Médio** | Todas                                  |

**Detalhamento de gaps integrados:**

- **0.7** (1.5d): RFC39-RF44, RNF16 — Error handling padronizado
- **1.6** (1.5d): CLAUDE.md — Slots Pattern (Card, Modal, FormContainer)
- **2.3** (refactor inline): RF02 — Email OU username no login
- **4.7** (2-3d): RF35-RF38, RNF10 — Quiz generation via IA
- **6.7** (1d): RNF30-RNF32 — Governança PR (checklist, code review, docs)

## **Nota:** Fase 3 e Fase 5 não tém gaps adicionais; contagem acima reflete distribuição final.

## **Nota:** Fase 3 e Fase 5 não tém gaps adicionais; contagem acima reflete distribuição final.

## Tabela de Endpoints (Referência Rápida)

| Domínio      | Método | Endpoint                                  | Service             | Fase |
| ------------ | ------ | ----------------------------------------- | ------------------- | ---- |
| Auth         | POST   | `/auth/cadastro`                          | authService         | 2    |
| Auth         | POST   | `/auth/login`                             | authService         | 2    |
| Auth         | POST   | `/auth/refresh`                           | authService         | 2    |
| Auth         | POST   | `/auth/recuperar-senha`                   | authService         | 2    |
| Auth         | POST   | `/auth/redefinir-senha`                   | authService         | 2    |
| Perfil       | GET    | `/perfil`                                 | authService         | 2    |
| Perfil       | PUT    | `/perfil/foto`                            | authService         | 2    |
| Perfil       | PUT    | `/perfil/senha`                           | authService         | 2    |
| Admin        | GET    | `/admin/usuarios`                         | adminService (nova) | 2    |
| Admin        | PATCH  | `/admin/usuarios/{id}/ativar`             | adminService (nova) | 2    |
| Admin        | PATCH  | `/admin/usuarios/{id}/desativar`          | adminService (nova) | 2    |
| Cursos       | GET    | `/cursos`                                 | courseService       | 3    |
| Cursos       | POST   | `/cursos`                                 | courseService       | 3    |
| Cursos       | GET    | `/cursos/{id}`                            | courseService       | 3    |
| Cursos       | PUT    | `/cursos/{id}`                            | courseService       | 3    |
| Cursos       | DELETE | `/cursos/{id}`                            | courseService       | 3    |
| Cursos       | PATCH  | `/cursos/{id}/status`                     | courseService       | 3    |
| Cursos       | GET    | `/cursos/buscar`                          | courseService       | 3    |
| Módulos      | POST   | `/cursos/{cursoId}/modulos`               | modulesService      | 3    |
| Módulos      | PUT    | `/modulos/{id}`                           | modulesService      | 3    |
| Módulos      | DELETE | `/modulos/{id}`                           | modulesService      | 3    |
| Módulos      | PATCH  | `/modulos/{id}/ordem`                     | modulesService      | 3    |
| Aulas        | POST   | `/modulos/{moduloId}/aulas`               | lessonsService      | 3    |
| Aulas        | PUT    | `/aulas/{id}`                             | lessonsService      | 3    |
| Aulas        | DELETE | `/aulas/{id}`                             | lessonsService      | 3    |
| Aulas        | PATCH  | `/aulas/{id}/ordem`                       | lessonsService      | 3    |
| Aulas        | POST   | `/aulas/{id}/gerar-conteudo`              | lessonsService      | 3    |
| Aulas        | POST   | `/aulas/{id}/confirmar-conteudo`          | lessonsService      | 3    |
| Provas       | POST   | `/modulos/{moduloId}/prova`               | examService         | 4    |
| Provas       | GET    | `/modulos/{moduloId}/prova`               | examService         | 4    |
| Provas       | PUT    | `/provas/{id}`                            | examService         | 4    |
| Provas       | DELETE | `/provas/{id}`                            | examService         | 4    |
| Provas       | POST   | `/modulos/{moduloId}/prova/gerar-quiz-ia` | examService         | 4.7  |
| Perguntas    | POST   | `/provas/{provaId}/perguntas`             | examService         | 4    |
| Perguntas    | PUT    | `/perguntas/{id}`                         | examService         | 4    |
| Perguntas    | DELETE | `/perguntas/{id}`                         | examService         | 4    |
| Alternativas | POST   | `/perguntas/{perguntaId}/alternativas`    | examService         | 4    |
| Alternativas | PUT    | `/alternativas/{id}`                      | examService         | 4    |
| Alternativas | DELETE | `/alternativas/{id}`                      | examService         | 4    |

| Domínio      | Método | Endpoint                                  | Service             | Fase |
| ------------ | ------ | ----------------------------------------- | ------------------- | ---- |
| Auth         | POST   | `/auth/cadastro`                          | authService         | 2    |
| Auth         | POST   | `/auth/login`                             | authService         | 2    |
| Auth         | POST   | `/auth/refresh`                           | authService         | 2    |
| Auth         | POST   | `/auth/recuperar-senha`                   | authService         | 2    |
| Auth         | POST   | `/auth/redefinir-senha`                   | authService         | 2    |
| Perfil       | GET    | `/perfil`                                 | authService         | 2    |
| Perfil       | PUT    | `/perfil/foto`                            | authService         | 2    |
| Perfil       | PUT    | `/perfil/senha`                           | authService         | 2    |
| Admin        | GET    | `/admin/usuarios`                         | adminService (nova) | 2    |
| Admin        | PATCH  | `/admin/usuarios/{id}/ativar`             | adminService (nova) | 2    |
| Admin        | PATCH  | `/admin/usuarios/{id}/desativar`          | adminService (nova) | 2    |
| Cursos       | GET    | `/cursos`                                 | courseService       | 3    |
| Cursos       | POST   | `/cursos`                                 | courseService       | 3    |
| Cursos       | GET    | `/cursos/{id}`                            | courseService       | 3    |
| Cursos       | PUT    | `/cursos/{id}`                            | courseService       | 3    |
| Cursos       | DELETE | `/cursos/{id}`                            | courseService       | 3    |
| Cursos       | PATCH  | `/cursos/{id}/status`                     | courseService       | 3    |
| Cursos       | GET    | `/cursos/buscar`                          | courseService       | 3    |
| Módulos      | POST   | `/cursos/{cursoId}/modulos`               | modulesService      | 3    |
| Módulos      | PUT    | `/modulos/{id}`                           | modulesService      | 3    |
| Módulos      | DELETE | `/modulos/{id}`                           | modulesService      | 3    |
| Módulos      | PATCH  | `/modulos/{id}/ordem`                     | modulesService      | 3    |
| Aulas        | POST   | `/modulos/{moduloId}/aulas`               | lessonsService      | 3    |
| Aulas        | PUT    | `/aulas/{id}`                             | lessonsService      | 3    |
| Aulas        | DELETE | `/aulas/{id}`                             | lessonsService      | 3    |
| Aulas        | PATCH  | `/aulas/{id}/ordem`                       | lessonsService      | 3    |
| Aulas        | POST   | `/aulas/{id}/gerar-conteudo`              | lessonsService      | 3    |
| Aulas        | POST   | `/aulas/{id}/confirmar-conteudo`          | lessonsService      | 3    |
| Provas       | POST   | `/modulos/{moduloId}/prova`               | examService         | 4    |
| Provas       | GET    | `/modulos/{moduloId}/prova`               | examService         | 4    |
| Provas       | PUT    | `/provas/{id}`                            | examService         | 4    |
| Provas       | DELETE | `/provas/{id}`                            | examService         | 4    |
| Provas       | POST   | `/modulos/{moduloId}/prova/gerar-quiz-ia` | examService         | 4.7  |
| Perguntas    | POST   | `/provas/{provaId}/perguntas`             | examService         | 4    |
| Perguntas    | PUT    | `/perguntas/{id}`                         | examService         | 4    |
| Perguntas    | DELETE | `/perguntas/{id}`                         | examService         | 4    |
| Alternativas | POST   | `/perguntas/{perguntaId}/alternativas`    | examService         | 4    |
| Alternativas | PUT    | `/alternativas/{id}`                      | examService         | 4    |
| Alternativas | DELETE | `/alternativas/{id}`                      | examService         | 4    |

## **Nota contratual (regra estrita):** baseline oficial da arquitetura = 39 endpoints. Fluxos sem endpoint em `.claude/commands/doc/arquitetura.md` devem ser removidos do escopo ativo e da implementacao.

## **Nota contratual (regra estrita):** baseline oficial da arquitetura = 39 endpoints. Fluxos sem endpoint em `.claude/commands/doc/arquitetura.md` devem ser removidos do escopo ativo e da implementacao.

## Decisões Arquiteturais Consolidadas

| Decisão                   | Aplicação                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| **JWT + Refresh Token**   | Fase 2: access (curta) + refresh (longa) via cookies httpOnly/Secure + estado em memória no cliente |
| **Zustand + React Query** | Fase 0+: estado global (auth, user) em Zustand; dados remotos em React Query                        |
| **Zod Schemas**           | Fase 1+: todas validações de input em schemas reutilizáveis, exportadas de validations/             |
| **Service Layer**         | Fase 2+: todos endpoints via services (authService, courseService, etc.), não direto em páginas     |
| **Error Handling**        | Fases 2+: resposta interceptor trata erros, converte a IApiError, toast ou redirect conforme status |
| **Code Splitting**        | Fase 5+: lazy load de páginas secundárias; bundle analysis                                          |
| **Type Safety**           | Fase 1+: tipos explícitos; zero `any`; strict mode obrigatório                                      |

| Decisão                   | Aplicação                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| **JWT + Refresh Token**   | Fase 2: access (curta) + refresh (longa) via cookies httpOnly/Secure + estado em memória no cliente |
| **Zustand + React Query** | Fase 0+: estado global (auth, user) em Zustand; dados remotos em React Query                        |
| **Zod Schemas**           | Fase 1+: todas validações de input em schemas reutilizáveis, exportadas de validations/             |
| **Service Layer**         | Fase 2+: todos endpoints via services (authService, courseService, etc.), não direto em páginas     |
| **Error Handling**        | Fases 2+: resposta interceptor trata erros, converte a IApiError, toast ou redirect conforme status |
| **Code Splitting**        | Fase 5+: lazy load de páginas secundárias; bundle analysis                                          |
| **Type Safety**           | Fase 1+: tipos explícitos; zero `any`; strict mode obrigatório                                      |

### Checklist de Aderencia a Decisoes de Arquitetura (arquitetura.md)

- [ ] Upload de arquivos mantido local no servidor (sem storage externo fora de contrato).
- [ ] Categorias de curso tratadas com deduplicacao case-insensitive.
- [ ] Prova vinculada ao modulo em relacao 1:1.
- [ ] Aula com coexistencia de arquivo + conteudo CKEditor.
- [ ] Referencias de backend preservam pacote raiz `br.ufc.llm`.

---

## Matriz de Rastreabilidade de User Stories (US)

| Persona   | Stories                | Fases                                             |
| --------- | ---------------------- | ------------------------------------------------- |
| ADMIN     | US-A01, US-A02, US-A03 | Fase 0 (guard) + Fase 2 (auth/admin endpoints)    |
| PROFESSOR | US-P01..US-P37         | Fases 2, 3 e 4                                    |
| ALUNO     | US-AL01..US-AL07       | Fora do escopo desta execucao (Fase 2 do produto) |
| Persona   | Stories                | Fases                                             |
| --------- | ---------------------- | ------------------------------------------------- |
| ADMIN     | US-A01, US-A02, US-A03 | Fase 0 (guard) + Fase 2 (auth/admin endpoints)    |
| PROFESSOR | US-P01..US-P37         | Fases 2, 3 e 4                                    |
| ALUNO     | US-AL01..US-AL07       | Fora do escopo desta execucao (Fase 2 do produto) |

## Rastreabilidade Arquitetural (ER/DDL)

Referencia contratual: .claude/commands/doc/arquitetura.md.

Checklist minimo para implementacao:

- Modelo relacional respeitado: Usuario -> Curso -> Modulo -> Aula/Prova -> Pergunta -> Alternativa.
- Relacionamentos ON DELETE CASCADE refletidos em fluxos de exclusao no frontend.
- Tabelas de autenticacao e recuperacao de senha consideradas nos fluxos de auth/perfil.
- Endpoints REST do plano mantidos em paridade com Arquitetura.

## Critério de Aceitação Global

Ao término de cada fase ou subtarefa (obrigatório antes de commit):

### TDD (Test-Driven Development)

1. ✅ **Escrever testes ANTES da implementação** (RED step)

- Padrão AAA: **Arrange** (setup dados), **Act** (executa função), **Assert** (valida resultado)
- Exemplo:

```typescript
describe("ProtectedRoute", () => {
it("redireciona para login sem token", () => {
// Arrange: render sem token
render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
// Act: simula navegação
// Assert: verifica redirect para /
});
});
```

- Mínimo 2-3 testes por função crítica (services, hooks, validações)
- Cobertura ≥ 80% para componentes críticos

### Verificação de Código

2. ✅ **Funcionamento:** Todos critérios de "Verificação" / "Testes" satisfeitos
3. ✅ **Build:** `npm run build` sem erros
4. ✅ **Lint:** `npm run lint` sem warnings
5. ✅ **Tipos:** `npm run type-check` sem erros
6. ✅ **Performance:** Bundle não cresce; Lighthouse ≥ 85
7. ✅ **Segurança:** Zero Trust Client, XSS prevention, CSRF validation (se aplicável)
8. ✅ **Código:** Sem duplicação, Clean Code, SOLID, Naming semântico

### Commits com Autorização Explícita

9. ✅ **Preparar commits após testes passarem (aguardando autorização):**

```bash
# Validação obrigatória ANTES de perguntar por autorização
npm run type-check   # ✅ sem erros
npm run lint        # ✅ sem warnings
npm run test -- --coverage  # ✅ cobertura ≥ 80%
npm run build       # ✅ build sucesso

# Agente ImplementAndCommit então PERGUNTA:
# "Deseja autorizar o commit desta mudança?"
# Se SIM do usuário:
git add . && git commit -m "[TIPO] Descrição (max 72 caracteres)"
# Se NÃO: parar e aguardar instrução do usuário
```

- Convenção: `[feat|refactor|fix|test|docs|chore]` em português imperativo
- Exemplos:
  - `feat: Criar ProtectedRoute com validação de autenticação`
  - `refactor: Integrar ProtectedRoute em routes.ts`
  - `test: Adicionar testes para ProtectedRoute`
- Cada commit deixa código em estado funcional (sem quebras de build/tipos)
- **CRÍTICO:** Commits NUNCA são feitos automaticamente; requerem autorização explícita do usuário

### MEMORY.md de Sessão

10. ✅ **Atualizar MEMORY.md sessão após cada subtarefa concluída:**

```markdown
## 📊 Status Atual

    | Campo | Valor |

|---|---|
| **Fase/Subtarefa** | 0.1 — Criar ProtectedRoute |
| **Status** | DONE ✅ |
| **Commits** | 2/2 (feat, test) |
| **Testes** | 3/3 passando |
| **Branch** | feature/refactor-auth-guard-global | ## 📈 Progresso da Sessão
| # | Subtarefa | Status | Commits | Testes | Notas |
| **Branch** | feature/refactor-auth-guard-global | ## 📈 Progresso da Sessão
| # | Subtarefa | Status | Commits | Testes | Notas |
|---|---|---|---|---|---|
| 0.1 | Criar ProtectedRoute | ✅ DONE | 2 | 3/3 | Sem token → redirect ✓ |
| 0.2 | Integrar routes.ts | 🔄 IN_PROGRESS | 1 | 2/5 | Faltam testes para admin role | ## 🎯 Próxima Ação
**Subtarefa:** 0.2 — Integrar ProtectedRoute em routes.ts  
| 0.2 | Integrar routes.ts | 🔄 IN_PROGRESS | 1 | 2/5 | Faltam testes para admin role | ## 🎯 Próxima Ação
**Subtarefa:** 0.2 — Integrar ProtectedRoute em routes.ts  
**Etapa:** Testes RED (escrever 3 testes falhando)  
**Arquivo:** test/routes.test.ts  
**Próximo passo:**

1. Escrever teste: professor acessa /create-course → OK
2. Escrever teste: student acessa /create-course → 404
3. Escrever teste: sem token → redirect / ## 🚦 Bloqueadores
   **Nenhum no momento.** ## 💾 Estado das Sessão
   **Último commit:** feat(0.1): Criar ProtectedRoute com validação de autenticação  
   **Próximo:** feature/refactor-auth-guard-global — 0.2 tests RED
4. Escrever teste: sem token → redirect / ## 🚦 Bloqueadores
   **Nenhum no momento.** ## 💾 Estado das Sessão
   **Último commit:** feat(0.1): Criar ProtectedRoute com validação de autenticação  
   **Próximo:** feature/refactor-auth-guard-global — 0.2 tests RED
```

11. ✅ **Documentação:** Atualizada refletindo novo estado

---

## GAPS IDENTIFICADOS (Adições ao Plano Original)

### Gap 1: Requisitos de Integração e Preservação UX (RF39-RF44)

**Não mencionado no plano original.** Adicionar como **Fase 0.7 (nova subtarefa):**
**0.7 Implementar tratamento de erros HTTP padronizado + estados de carregamento**
**Documentação:** RF39-RF44, RNF16
**Ação:**

- Interceptor de response trata erros HTTP (401, 403, 409, 422, 500) com mensagens claras
- Cada fluxo integrado (login, criar curso, enviar prova) tem:
- Estado de loading (desabilita botões, mostra spinner)
- Estado de erro (toast ou inline message)
- Estado vazio (cursos list vazia → "Nenhum curso ainda")
- RNF16: Erros padronizados em toast/modal, sem quebrar jornada visual
  **Duração:** 1.5 dias
  **Testes:**
  **Duração:** 1.5 dias
  **Testes:**
- Erro 401 → redirect login + toast "Sessão expirada"
- Erro 409 → toast "Recurso em conflito"
- Erro 422 → validação inline "Campo inválido"
- Estado vazio em lista cursos → exibir "Crie seu primeiro curso"
  **Commit esperado:**

  **Commit esperado:**

```
feat: Implementar tratamento de erros HTTP padronizado (RF39-RF44)
test: Validar toasts de erro, loading states, estados vazios
```

---

### Gap 2: Quiz via IA — Geração Dinâmica (RF35-RF38)

**Não mencionado no plano original.** Adicionar como **Fase 4.7 (nova subtarefa) ou Tema Separado:**
**4.7 Integrar geração de quiz via IA — POST /modulos/{id}/prova/gerar-quiz-ia**
**Documentação:** RF35-RF38, RNF10
**Ações:**

- Novo endpoint backend: `POST /modulos/{moduloId}/prova/gerar-quiz-ia` (Spring AI)
- Frontend chama endpoint → recebe JSON com perguntas sugeridas pela IA
- Preview em modal (não salva automaticamente) → RN12
- Professor edita perguntas/alternativas antes de confirmar
- Se módulo sem conteúdo legível → erro 422 com mensagem "Adicione aulas antes de gerar quiz"
- Submit salva via endpoint padrão `POST /provas`
  **Duração:** 2-3 dias
  **Testes:**
  **Duração:** 2-3 dias
  **Testes:**
- Gerar quiz com conteúdo legível → retorna perguntas sugeridas
- Módulo vazio → erro 422 "Nenhum conteúdo para processar"
- Editar pergunta sugerida → não salva até confirmar submit
- Submit → cria prova com perguntas editadas
  **Commit esperado:**

  **Commit esperado:**

```
feat: Integrar geração de quiz via IA (RF35-RF38, /gerar-quiz-ia)
test: Validar geração e edição de quiz antes de persistência
```

---

### Gap 3: Login com Email OU Nome de Usuário (RF02)

**Não mencionado no plano original.** Refinar **Fase 2.3:**
**Atualizar esquema de LoginPage:**

```typescript
// Antes (plano original):
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6),
});
// Depois (com Gap 3):
export const loginSchema = z.object({
  emailOuUsuario: z
    .string()
    .min(1, "E-mail ou nome de usuário obrigatório")
    .refine(
      (value) => isValidEmail(value) || isValidUsername(value),
      "E-mail ou nome de usuário inválido",
    ),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  emailOuUsuario: z
    .string()
    .min(1, "E-mail ou nome de usuário obrigatório")
    .refine(
      (value) => isValidEmail(value) || isValidUsername(value),
      "E-mail ou nome de usuário inválido",
    ),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
});
```

**Payload para backend (RF02):**

```typescript
interface ILoginRequest {
  emailOuUsuario: string; // backend detecta se é email ou username
  senha: string;
  emailOuUsuario: string; // backend detecta se é email ou username
  senha: string;
}
```

**Duração:** 1 dia (refactor em 2.3)
**Testes (adicionar aos testes de 2.3):**

- Login com email válido → sucesso
- Login com username válido → sucesso
- Login com e-mail e username ambos inválidos → erro Zod

---

### Gap 4: Documentação e Governança de Entrega (RNF30-RNF32)

**Não mencionado no plano original.** Adicionar como **Fase 6.7 (nova subtarefa):**
**6.7 Implementar governança de entrega — checklist de revisão técnica**
**Documentação:** RNF30-RNF32
**Ações:**

- **RNF30 enforcement:** Toda mudança de contrato FE-BE deve ser refletida em:
- CLAUDE.md (se for diretriz global)
- RF (se for novo requisito)
- RN (se for regra de negócio)
- RNF (se for requisito técnico)
- User Stories (se for nova jornada)
  → Adicionar checklist no template de PR: "Documentação atualizada?"
- **RNF31 enforcement:** Publicar checklist de revisão técnica antes de PR:

```
✅ Clean Code: variáveis/funções < 10 linhas, sem duplicação
✅ SOLID: componente tem única responsabilidade
✅ Performance: bundle não cresceu (npm run build -- --analyze)
✅ Testes: cobertura ≥ 80%, AAA pattern
✅ Tipos: zero `any`, strict mode
✅ Sem regressão: manual testing em 3 navegadores
```

- **RNF32 enforcement:** Aprovação de PR exige:
- 2 aprovações (code review)
- CI/CD verde (tests, lint, type-check, build)
- Evidence de não regressão visual (screenshot antes/depois se houver mudança UI)
- Aderência contratual confirmada (comentário checando RF/RN relacionados)
  **Duração:** 1 dia
  **Documentos a criar:**
  **Duração:** 1 dia
  **Documentos a criar:**
- `.github/pull_request_template.md` — checklist em cada PR
- `.github/CODE_REVIEW_CHECKLIST.md` — critérios RNF30-31-32
- Instruções em CLAUDE.md § "Critério de Aprovação de PR"
  **Commit esperado:**

  **Commit esperado:**

```
chore: Adicionar governança de entrega (RNF30-RNF32 — PR checklist + code review)
docs: Publicar CODE_REVIEW_CHECKLIST.md com critérios técnicos
```

---

### Gap 5: Slots Pattern para Componentes Reutilizáveis (de CLAUDE.md)

**Mencionado em CLAUDE.md mas NÃO integrado ao plano.** Adicionar como **Fase 1.6 (nova subtarefa):**
**1.6 Refatorar componentes com Slots Pattern — Card, Modal, Form containers**
**Documentação:** CLAUDE.md § Padrões de Componentes
**Ações:**

1. **Card component** (exemplo):

```typescript
// Antes (muitas props):
<Card title="Curso" image={url} footer="Buy Now" />
   // Depois (slots):
<Card>
<Card.Header>
<Card.Image src={url} />
<Card.Title>Curso</Card.Title>
</Card.Header>
<Card.Body>Conteúdo</Card.Body>
<Card.Footer>Buy Now</Card.Footer>
</Card>
```

2. **Modal component** (exemplo):

```typescript
<Modal isOpen={isOpen}>
<Modal.Header>Confirmar ação</Modal.Header>
<Modal.Body>Mesmo seguro?</Modal.Body>
<Modal.Footer>
<Button>Cancelar</Button>
<Button>Confirmar</Button>
</Modal.Footer>
</Modal>
```

3. **Form container** (exemplo):

```typescript
<FormContainer>
<FormContainer.Header title="Criar Curso" />
<FormContainer.Body>
<Input name="titulo" />
</FormContainer.Body>
<FormContainer.Footer>
<Button>Salvar</Button>
</FormContainer.Footer>
</FormContainer>
```

**Benefícios:**

- Elimina explosion de props (`title`, `description`, `footer`, `headerImage`, etc.)
- Facilita customização sem criar novos componentes
- SOLID: Single Responsibility (cada slot faz uma coisa)
- Reutilização aumenta (componentes adaptáveis)
  **Duração:** 1.5 dias
  **Componentes a refatorar (uso de Slots):**
  **Duração:** 1.5 dias
  **Componentes a refatorar (uso de Slots):**
- Card (existente em shadcn, validar)
- Modal
- FormContainer (novo, base para CreateCoursePage, CreateExamPage, etc.)
- Layout (Header, Body, Footer)
  **Testes:**
  **Testes:**
- Card renderiza slots corretamente
- Modal fecha ao clicar Cancelar
- FormContainer submete dados via handleSubmit
  **Commit esperado:**

  **Commit esperado:**

```
refactor: Implementar Slots Pattern em componentes reutilizáveis (Card, Modal, Form)
test: Validar composição de slots em componentes
```

**Impacto em fases posteriores:**

- Fase 3: CreateCoursePage usa FormContainer com slots
- Fase 4: CreateExamPage usa FormContainer com slots
- Refatoração reduz duplicação em Python vs Power BI (Fase 5)

---

## Resumo de Gaps + Duração Total

| Gap | Fase | Subtarefa                                | Duração     | RNF/RF/RN      |
| --- | ---- | ---------------------------------------- | ----------- | -------------- |
| 1   | 0    | 0.7 Tratamento de erros padronizado      | 1.5d        | RF39-44, RNF16 |
| 2   | 4    | 4.7 Geração de quiz via IA               | 2-3d        | RF35-38        |
| 3   | 2    | 2.3 (refactor) Login email OU username   | 1d (inline) | RF02           |
| 4   | 6    | 6.7 Governança de entrega (PR checklist) | 1d          | RNF30-32       |
| 5   | 1    | 1.6 Slots Pattern para componentes       | 1.5d        | CLAUDE.md      |

| Gap | Fase | Subtarefa                                | Duração     | RNF/RF/RN      |
| --- | ---- | ---------------------------------------- | ----------- | -------------- |
| 1   | 0    | 0.7 Tratamento de erros padronizado      | 1.5d        | RF39-44, RNF16 |
| 2   | 4    | 4.7 Geração de quiz via IA               | 2-3d        | RF35-38        |
| 3   | 2    | 2.3 (refactor) Login email OU username   | 1d (inline) | RF02           |
| 4   | 6    | 6.7 Governança de entrega (PR checklist) | 1d          | RNF30-32       |
| 5   | 1    | 1.6 Slots Pattern para componentes       | 1.5d        | CLAUDE.md      |

**Impacto no cronograma:**

- Duração original: 10-16 semanas
- +7 dias de gaps = +1 semana
- **Duração revisada: 11-17 semanas**

---

## Como os Gaps se Encaixam no Plano

```
Antes (39 subtarefas sem gaps):
Fase 0: 6 subtarefas → +1 subtarefa (0.7) = 7
Fase 1: 5 subtarefas → +1 subtarefa (1.6) = 6
Fase 2: 7 subtarefas → refactor inline (2.3) = 7
Fase 3: 6 subtarefas (sem gaps adicionais) = 6
Fase 4: 6 subtarefas → +1 subtarefa (4.7) = 7
Fase 5: 4 subtarefas (sem gaps adicionais) = 4
Fase 6: 5 subtarefas → +1 subtarefa (6.7) = 6
Depois (43 subtarefas):
Total de 43 subtarefas (gap 3 de refactor inline não adiciona nova subtarefa, apenas refatora a 2.3 existente)
```

---

## Ações Imediatas para Usuario

1. ✅ **Aprovar os 5 gaps?** (recomendação: SIM, todos essenciais)
2. ✅ **Integrar gaps no plano persistente** (`/docs/REFACTORING_PLAN_GRANULAR_V2.md`)?
3. ✅ **Atualizar cronograma** (10-16 → 11-17 semanas)?
4. ✅ **Definir se deseja autorizar a execução da Fase 0.1 com gaps incluídos** ou apenas registrar a primeira iteração sem executar ainda?
5. **Validar com time backend:** Confirmar que todos endpoints listados existem ou estão planejados
6. **Priorizar:** Há alguma fase com maior urgência de negócio? (Recomendação: Fase 0 → Fase 1 → Fase 2)
7. **Se autorizar a execução da Fase 0:** Branch `feature/refactor-auth-guard-global`, 1º commit é ProtectedRoute
8. **Atualizar MEMORY.MD session:** Registrar progresso da sessão ( status inicial, próxima subtarefa)
9. **Commits granulares:** Cada subtarefa = 1-2 commits com rastreabilidade a RNF/RF/RN
10. **Revisão peer:** PR review obrigatório antes de merge em development

11. **Validar com time backend:** Confirmar que todos endpoints listados existem ou estão planejados
12. **Priorizar:** Há alguma fase com maior urgência de negócio? (Recomendação: Fase 0 → Fase 1 → Fase 2)
13. **Se autorizar a execução da Fase 0:** Branch `feature/refactor-auth-guard-global`, 1º commit é ProtectedRoute
14. **Atualizar MEMORY.MD session:** Registrar progresso da sessão ( status inicial, próxima subtarefa)
15. **Commits granulares:** Cada subtarefa = 1-2 commits com rastreabilidade a RNF/RF/RN
16. **Revisão peer:** PR review obrigatório antes de merge em development

---

## Referências Persistentes

- **CLAUDE.md** — Diretrizes obrigatórias (SOLID, Clean Code, RNF17-32)
- **diagnostico-refatoracao.md** — Matriz de riscos das 7 fases numeradas (0-6)
- **arquitetura.md** — Endpoints REST canônicos, schema SQL
- **requisitos-funcionais.md** — RFs (RF01-RF34)
- **regras-negocio.md** — RNs (RN01-RN12)
- **requisitos-nao-funcionais.md** — RNFs (RNF14-RNF32)
- **user-stories.md** — Contexto de negócio por role (ADMIN, PROFESSOR, ALUNO)

---

**Última atualização:** 24/03/2026 — Plano Granular v2.1 (43 subtarefas, contrato estrito de endpoints)  
**Status:** Pronto para implementação iterativa
