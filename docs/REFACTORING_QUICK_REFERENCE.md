# Quick Reference: Refatoração UFC LMS Frontend

**Data:** 24/03/2026  
**Versão:** 2.0 Granular  
**Público:** Implementadores (desenvolvedor + AI agents)

---

## 1. Estrutura em 7 Fases Numeradas (0-6) e 43 Subtarefas (com 5 gaps integrados)

```
Fase 0: Segurança (7 tarefas, 1-2 sem) — +0.7 (error handling)
  └─ ProtectedRoute, routes.ts, role cleanup, logout local seguro sem endpoint, unauthorized page, rotas públicas, error handling HTTP

Fase 1: Contratos (6 tarefas, 1-2 sem) — +1.6 (Slots Pattern)
  └─ @ava-poc/types v1.0, role mapping, Zod schemas, migration useAuthStore, zero any, Slots Pattern (Card, Modal, FormContainer)

Fase 2: Auth Backend (7 tarefas, 2-3 sem) — 2.3 refactor inline (email OU username)
  └─ authService, request interceptor, login (email OU username), register, refresh flow, profile, forgot/reset pwd

Fase 3: Cursos Backend (6 tarefas, 2-3 sem)
  └─ courseService, CoursesPage, CreateCoursePage, ManageCoursePage, modulesService, lessonsService

Fase 4: Exames + Conformidade Contratual (7 tarefas, 2-3 sem) — +4.7 (AI quiz generation)
  └─ examService, CreateExamPage, ExamPage/ExamResultPage, saneamento de rotas não contratuais, AI quiz gen (Spring AI)

Fase 5: Deduplicação (4 tarefas, 1-2 sem)
  └─ Lesson compartilhada, Exam compartilhada, rotas genéricas :courseId, configuração dinâmica

Fase 6: Hardening (6 tarefas, 1-2 sem) — +6.7 (Governança PR)
  └─ Breadcrumbs, idioma, A11y, docs slices, CLAUDE.md atualizado, governança de review
```

**TOTAL: 43 Subtarefas | Cronograma: 11-17 semanas**

---

## 2. Endpoints Backend: Resumo por Domínio

### Auth (5 endpoints)
- `POST /auth/cadastro` → authService.register()
- `POST /auth/login` → authService.login()
- `POST /auth/refresh` → authService.refreshAccessToken()
- `POST /auth/recuperar-senha` → authService.requestPasswordReset()
- `POST /auth/redefinir-senha` → authService.resetPassword()

### Perfil (3 endpoints)
- `GET /perfil` → authService.getProfile()
- `PUT /perfil/foto` → authService.uploadProfilePhoto()
- `PUT /perfil/senha` → authService.changePassword()

### Admin (3 endpoints)
- `GET /admin/usuarios` → adminService.listUsers()
- `PATCH /admin/usuarios/{id}/ativar` → adminService.activateUser()
- `PATCH /admin/usuarios/{id}/desativar` → adminService.deactivateUser()

### Cursos (7 endpoints)
- `GET /cursos` → courseService.fetchCourses()
- `POST /cursos` → courseService.createCourse()
- `GET /cursos/{id}` → courseService.fetchCourseById()
- `PUT /cursos/{id}` → courseService.updateCourse()
- `DELETE /cursos/{id}` → courseService.deleteCourse()
- `PATCH /cursos/{id}/status` → courseService.updateCourseStatus()
- `GET /cursos/buscar` → courseService.searchCourses()

### Módulos (4 endpoints)
- `POST /cursos/{cursoId}/modulos` → modulesService.createModule()
- `PUT /modulos/{id}` → modulesService.updateModule()
- `DELETE /modulos/{id}` → modulesService.deleteModule()
- `PATCH /modulos/{id}/ordem` → modulesService.reorderModule()

### Aulas (6 endpoints)
- `POST /modulos/{moduloId}/aulas` → lessonsService.createLesson()
- `PUT /aulas/{id}` → lessonsService.updateLesson()
- `DELETE /aulas/{id}` → lessonsService.deleteLesson()
- `PATCH /aulas/{id}/ordem` → lessonsService.reorderLesson()
- `POST /aulas/{id}/gerar-conteudo` → lessonsService.generateContent()
- `POST /aulas/{id}/confirmar-conteudo` → lessonsService.confirmContent()

### Provas (5 endpoints — +1 AI)
- `POST /modulos/{moduloId}/prova` → examService.createExam()
- `GET /modulos/{moduloId}/prova` → examService.fetchExamByModule()
- `PUT /provas/{id}` → examService.updateExam()
- `DELETE /provas/{id}` → examService.deleteExam()
- `POST /modulos/{moduloId}/prova/gerar-quiz-ia` → examService.generateQuizWithAI() **[Gap 4.7 — Spring AI]**

### Perguntas (3 endpoints)
- `POST /provas/{provaId}/perguntas` → examService.createQuestion()
- `PUT /perguntas/{id}` → examService.updateQuestion()
- `DELETE /perguntas/{id}` → examService.deleteQuestion()

### Alternativas (3 endpoints)
- `POST /perguntas/{perguntaId}/alternativas` → examService.createAlternative()
- `PUT /alternativas/{id}` → examService.updateAlternative()
- `DELETE /alternativas/{id}` → examService.deleteAlternative()

**BASELINE CONTRATUAL: 39 endpoints oficiais** (conforme arquitetura.md).

**REGRA ESTRITA DE CONTRATO:**
- Rotas e servicos frontend devem refletir somente endpoints presentes em `.claude/commands/doc/arquitetura.md`.
- Endpoint nao documentado em `arquitetura.md` sai do escopo ativo e deve ser removido da implementacao e dos planos.
- Nao existe endpoint de logout no contrato atual; `logout` deve ser apenas limpeza local de estado + navegacao.
- Em caso de conflito entre `CLAUDE.md` e `arquitetura.md`, parar e confirmar com o usuario antes de continuar.

### Decisoes de Arquitetura (Obrigatorias)
- Upload de arquivos: local no servidor (disco).
- Categorias de curso: deduplicacao case-insensitive.
- Prova vinculada ao modulo (1:1).
- Conteudo de aula: arquivo + CKEditor coexistem.
- Pacote raiz backend: `br.ufc.llm`.

---

## 3. Mapeamento RN (Regras de Negócio)

| RN | Descrição | Enforce | Fase |
|---|---|---|---|
| RN01 | Ativação de conta: INATIVO só, ADMIN ativa | Backend + Frontend guard | 0 |
| RN02 | Propriedade de curso: Professor → apenas seus cursos | Backend (FK professor_id) + Frontend role | 0-3 |
| RN03 | Imutabilidade CPF/email: readonly no perfil | Frontend (disabled input) | 2 |
| RN04 | Renumeração módulos: ao deletar, renumera demais | Backend (SQL trigger) + Frontend refetch | 3 |
| RN05 | Pergunta: mín. 2 alternativas, 1 correta exatamente | Zod schema + Backend validation | 4 |
| RN06 | Visibilidade curso: RASCUNHO não visto por alunos | Backend (filtro status) | 0-3 |
| RN07 | Tipos arquivo aula: PDF, MP4, AVI, MOV, WebM | fileSchema + Backend MIME check | 3 |
| RN08 | Foto perfil: JPG/PNG/GIF, mín. 200x200 | imageFileSchema + Backend size check | 2 |
| RN09 | Token recuperação: 30 min expiração, uso único | Backend (token_table.usado = true) | 2 |
| RN10 | Deduplicação categoria: case-insensitive | Backend (LOWER()) + Frontend display normalized | 3 |
| RN11 | Config prova independentes: checkbox toggle | Backend bitflags + Frontend conditional render | 4 |
| RN12 | Conteúdo IA: não salva até confirmação explícita | Frontend modal preview + endpoint separado | 3 |

---

## 4. Critério de Aceitação por Fase

### Fase 0 ✅ Finalização = quando:
- ProtectedRoute bloqueia sem token ou role inválido
- Todas as rotas autenticadas ativas protegidas
- Logout limpa estado local de autenticação e redireciona sem chamar endpoint backend
- Rotas públicas acessíveis sem guard

### Fase 1 ✅ Finalização = quando:
- @ava-poc/types tem 16 interfaces consolidadas
- Zero `any` em TypeScript
- useAuthStore importa IUserSession
- Todos schemas Zod nos validations/

### Fase 2 ✅ Finalização = quando:
- Login/Register/ForgotPwd integrados
- JWT refresh automático em interceptor
- ProfilePage carrega dados reais
- Logout permanece estritamente local; não existe endpoint `/auth/logout` no contrato

### Fase 3 ✅ Finalização = quando:
- CoursesPage lista cursos reais (GET /cursos)
- CreateCoursePage integrada (POST /cursos)
- ManageCoursePage editável (PUT /cursos/:id)
- Módulos renumerados ao deletar (RN04)
- Aulas suportam PDF + CKEditor (RN07)

### Fase 4 ✅ Finalização = quando:
- ExamPage carrega perguntas do backend
- Submissão backend calcula resultado
- ExamResultPage exibe resultado server-side
- Fluxos legados de mensageria permanecem fora do escopo ativo

### Fase 5 ✅ Finalização = quando:
- LessonPage única (sem Python duplciação)
- ExamPage única
- Rotas usam :courseId (não /power-bi/...)
- Sem regressão visual em power-bi ou python

### Fase 6 ✅ Finalização = quando:
- Breadcrumbs padronizados
- Código em English, UX em Português
- A11y: ARIA, keyboard nav, contraste OK
- Documentação e CLAUDE.md atualizados

---

## 5. Tecnologia por Fase

| Fase | Tech Stack | Libs | Patterns |
|---|---|---|---|
| **0** | React Router, Zustand | zustand | ProtectedRoute, Context |
| **1** | TypeScript, Zod | zod, ts-node | Type Safety, Schema Validation |
| **2** | Axios, JWT | axios, react-query | Interceptors, Token Refresh, Custom Hooks |
| **3-4** | React Query, TanStack | @tanstack/react-query | useQuery, useMutation, Invalidation |
| **5** | React Router | react-router-dom | Dynamic Routes, Route Params |
| **6** | Accessibility | aria, keyboard-nav | ARIA Labels, Focus Management |

---


## 5.1 ADMIN: Cobertura Dedicada (RF04/RF05 + US-A01/A02/A03)

### Endpoints Admin
- `GET /admin/usuarios` → adminService.listUsers()
- `PATCH /admin/usuarios/{id}/ativar` → adminService.activateUser()
- `PATCH /admin/usuarios/{id}/desativar` → adminService.deactivateUser()

### User Stories Admin (Rastreabilidade)
| Story | Regra/Requisito | Fase | Evidência esperada |
|---|---|---|---|
| US-A01 | RF04 | 0-2 | Lista paginada com status e perfil |
| US-A02 | RF04, RN01 | 2 | Ativação de conta via PATCH |
| US-A03 | RF04, RN01, RF05 | 2 | Desativação e bloqueio de autenticação |

---

## 5.2 Matriz de Rastreabilidade (RF/RN/RNF/US -> Fase/Subtarefa)

### RF críticos (fonte: .claude/commands/doc/requisitos-funcionais.md)
| ID | Tema | Fase/Subtarefa |
|---|---|---|
| RF01-RF03 | Cadastro/login/recuperação | Fase 2 (2.1-2.7) |
| RF04-RF05 | Ativação/desativação + bloqueio INATIVO | Fase 2 + seção ADMIN |
| RF06-RF08 | Perfil e senha | Fase 2 |
| RF09-RF17 | Cursos | Fase 3 |
| RF18-RF21 | Módulos | Fase 3 |
| RF22-RF25 | Aulas + arquivos + CKEditor | Fase 3 |
| RF26-RF28 | Conteúdo IA por aula | Fase 3 |
| RF29-RF34 | Provas por módulo | Fase 4 |
| RF35-RF38 | Quiz IA por módulo | Fase 4.7 |
| RF39-RF44 | Integração FE-BE preservando UX | Fase 0.7 + transversal |

### RN (fonte: .claude/commands/doc/regras-negocio.md)
Cobertura consolidada em "## 3. Mapeamento RN" (RN01-RN12).

### RNF (fonte: .claude/commands/doc/requisitos-nao-funcionais.md)
| Faixa | Tema | Cobertura no plano |
|---|---|---|
| RNF14-RNF18 | Integração FE-BE | Fases 0-4 |
| RNF19-RNF23 | Clean Code/SOLID/naming/domínio | Fases 1-6 |
| RNF24-RNF29 | Performance frontend | Fases 5-6 |
| RNF30-RNF32 | Governança de entrega | Fase 6.7 |

### User Stories (fonte: .claude/commands/doc/user-stories.md)
- US-A01..US-A03 → seção ADMIN (acima)
- US-P01..US-P37 → cobertas por Fases 2, 3 e 4
- US-AL01..US-AL07 → fora do escopo desta execução (Fase 2 do produto)

## 6. Dependências Críticas Entre Fases

```
   FASE 0 (Segurança)
        ↓ [bloqueia tudo]
   FASE 1 (Contratos)
        ↓ [precisa de tipos para integração]
   FASE 2 (Auth) ←─────┐
        ↓               │ podem rodar paralelo
   FASE 3 (Cursos)      │ após FASE 1 OK
        ↓               │
   FASE 4 (Exames) ←────┘
        ↓ [estabilidade necessária]
   FASE 5 (Dedup)
        ↓ [cleanup final]
   FASE 6 (Hardening)
```

---

## 7. Checklist Rápido de Início (para novo chat)

- [ ] Conectado com backend Spring Boot disponível?
- [ ] Endpoints `/auth/*`, `/cursos/*`, `/provas/*` documentados e funcional?
- [ ] Banco PostgreSQL 16 com schema via Flyway?
- [ ] JWT (access + refresh) implementado no backend?
- [ ] CORS configurado para frontend (localhost:5173)?
- [ ] `/admin/usuarios` endpoints para ativação de conta?
- [ ] Fluxos sem endpoint oficial foram removidos do escopo ativo?
- [ ] CI/CD pipeline pronto para main → development → feature branches?

---

## 8. Estrutura de Arquivos (Referência Histórica + Alvo de Refatoração)

**Nota de escopo histórico:** quando houver menções legadas a fluxos de mensageria ou endpoints não contratuais em documentos auxiliares, trate-as apenas como registro histórico. Esses fluxos permanecem fora do escopo ativo até formalização em `.claude/commands/doc/arquitetura.md`.

```
src/
  ├─ components/
  │  ├─ shared/
  │  │  ├─ ProtectedRoute.tsx          [Fase 0]
  │  │  ├─ UnauthorizedPage.tsx        [Fase 0]
  │  │  ├─ Breadcrumb.tsx              [Fase 6]
  │  │  └─ AuthLayout.tsx              [existente]
  │  └─ ui/
  │     └─ [shadcn components]         [existente]
  ├─ pages/
  │  ├─ LoginPage.tsx                  [Fase 2 - integrado]
  │  ├─ ProfilePage.tsx                [Fase 2 - integrado]
  │  ├─ CoursesPage.tsx                [Fase 3 - integrado]
  │  ├─ CreateCoursePage.tsx           [Fase 3 - integrado]
  │  ├─ ManageCoursePage.tsx           [Fase 3 - integrado]
  │  ├─ ModulesPage.tsx                [Fase 5 - shared]
  │  ├─ LessonPage.tsx                 [Fase 5 - shared, genérica]
  │  ├─ ExamPage.tsx                   [Fase 5 - shared, genérica]
  │  ├─ ExamResultPage.tsx             [Fase 4 - servidor-side]
  │  ├─ MessagesPage.tsx               [Legado - fora do escopo ativo]
  │  └─ StudentMessagesPage.tsx        [Legado - fora do escopo ativo]
  ├─ services/
  │  ├─ api.ts                         [interceptors Fase 2]
  │  ├─ authService.ts                 [Fase 2]
  │  ├─ courseService.ts               [Fase 3]
  │  ├─ modulesService.ts              [Fase 3]
  │  ├─ lessonsService.ts              [Fase 3]
  │  ├─ examService.ts                 [Fase 4]
  │  └─ messageService.ts              [Legado - fora do escopo ativo]
  ├─ store/
  │  ├─ useAuthStore.ts                [Fase 2 - refactored]
  │  └─ useCourseStore.ts              [existente, pode renovar]
  ├─ validations/
  │  ├─ authSchema.ts                  [Fase 1 - alinhado Zod]
  │  ├─ courseSchema.ts                [Fase 1 - alinhado Zod]
  │  ├─ examSchema.ts                  [Fase 1 - alinhado Zod]
  │  ├─ fileSchema.ts                  [Fase 1 - alinhado Zod]
  │  └─ messageSchema.ts               [Legado - fora do escopo ativo]
  ├─ types/
  │  └─ index.ts                       [Fase 6 review, local UI props]
  ├─ routes.ts                         [Fase 0 refactor, Fase 5 update]
  ├─ App.tsx                           [existente]
  └─ main.tsx                          [existente]

packages/types/src/
  └─ index.ts                          [Fase 1 - 16 interfaces consolidadas]

.claude/commands/
  └─ frontend/
     ├─ auth-profile-current.md        [Fase 6 - docs update]
     ├─ courses-current.md             [Fase 6 - docs update]
     ├─ exams-current.md               [Fase 6 - docs update]
     ├─ messaging-current.md           [Fase 6 - docs update]
     ├─ navigation-routing-current.md  [Fase 6 - docs update]
     └─ python-variant-current.md      [Fase 6 - docs update]
```

---

## 9. TDD e Commits Automáticos (Obrigatório em Cada Fase)

### TDD Workflow (Test-Driven Development)

**Ciclo RED → GREEN → REFACTOR para cada subtarefa:**

```
STEP 1: RED
--------
1. Escrever testes ANTES da implementação (falham explicitamente)
2. Padrão AAA: Arrange (setup) → Act (executa) → Assert (valida)
3. Exemplo minimalista:

   describe("ProtectedRoute", () => {
     it("redireciona sem token", () => {
       // Arrange: render componente sem token
       render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
       // Act: simula efeito de redirecionamento
       // Assert: verifica se Navigate("/") foi chamado
       expect(mockNavigate).toHaveBeenCalledWith("/");
     });
   });

STEP 2: GREEN
--------
1. Implementar funcionalidade mínima para testes passarem
2. Código pode ser "sujo" — objetivo é fazer testes ficarem verdes
   
   export function ProtectedRoute({ children, allowedRoles }) {
     const { isLoggedIn, currentUser } = useAuthStore();
     
     if (!isLoggedIn) return <Navigate to="/" />;
     if (!allowedRoles.includes(currentUser.role)) 
       return <Navigate to="/unauthorized" />;
     
     return <Outlet />;
   }

3. Rodar: npm run test -- ProtectedRoute.test.ts
   Resultado: 3/3 testes passando ✅

STEP 3: REFACTOR
--------
1. Melhorar código: remover duplicação, simplificar, melhorar nomes
2. Testes continuam passando
3. Exemplo refactor:

   const isUserAuthorized = (user, roles) => 
     user && roles.includes(user.role);

   export function ProtectedRoute({ children, allowedRoles }) {
     const { isLoggedIn, currentUser } = useAuthStore();
     
     if (!isLoggedIn || !isUserAuthorized(currentUser, allowedRoles)) {
       return <Navigate to={isLoggedIn ? "/unauthorized" : "/"} />;
     }
     
     return <Outlet />;
   }

4. Rodar novamente: npm run test
   Resultado: 3/3 testes ainda passando ✅
```

### Commits Automáticos (Git Hooks)

### Etapa Git do Executor (Planejamento + Decisão)

Antes de qualquer `commit/push/PR`, o executor deve:

1. Coletar estado atual do Git (`branch`, `status`, últimos commits)
2. Gerar e **exibir o relatório completo** de planejamento Git no formato `📋 PLANEJAMENTO GIT` (estado atual + branches + sequência de commits + estratégia de publicação + observações)
3. **Somente após exibir o relatório**, perguntar ao usuário: **seguir planejamento** ou **realizar ajustes**
4. Se AJUSTAR: coletar ajustes → regenerar relatório → confirmar novamente
5. Só após essa decisão prosseguir para execução de Git (quando autorizado)

**Regra:** nunca perguntar sem mostrar o relatório. O plano deve estar visível antes da decisão.

**Seu commit é automático se:**

```bash
npm run type-check  # ✅ sem erros
npm run lint        # ✅ sem warnings
npm run test        # ✅ cobertura ≥ 80%
npm run build       # ✅ build sucesso
  ↓
🎯 AUTORIZAR COMMIT?
(Agente ImplementAndCommit aguardando SIM/NÃO do usuário)
  ↓
SE SIM:
git add .
git commit -m "[TIPO] Descrição (max 72 caracteres)"
  ↓
✅ Commit feito (com autorização explícita)
```

**Configurar hook (opcional, via husky ou manual):**

```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run type-check && npm run lint && npm run test -- --coverage && npm run build
if [ $? -ne 0 ]; then
  echo "❌ Testes/lint/build falharam. Commit abortado."
  exit 1
fi
echo "✅ Status checks OK. Prosseguindo com commit..."
```

**Convenção de mensagem de commit:**

| Tipo | Padrão | Exemplo |
|---|---|---|
| feat | feat: [descrição RF ou RNF] | feat: Criar ProtectedRoute com validação de autenticação |
| refactor | refactor: [descrição de melhoria] | refactor: Extrair validação para função pura |
| test | test: [descrição de testes] | test: Adicionar testes para ProtectedRoute (sem token, role inválido) |
| fix | fix: [descrição de bug] | fix: Logout não limpava localStorage |
| docs | docs: [atualização doc] | docs: Atualizar MEMORY.md — Fase 0.1 complete |

---

## 9. Padrões de Implementação (Repetidos em Cada Fase)

### Template: Novo Service
```typescript
// src/services/xService.ts
import { apiClient } from "./api";
import { IXResponse, IXCreateRequest } from "@ava-poc/types";

export const xService = {
  async fetchX(id: string): Promise<IXResponse> {
    const { data } = await apiClient.get<IXResponse>(`/x/${id}`);
    return data;
  },

  async createX(payload: IXCreateRequest): Promise<IXResponse> {
    const { data } = await apiClient.post<IXResponse>("/x", payload);
    return data;
  },

  // ... demais funções
};
```

### Template: Novo Hook com React Query
```typescript
// src/hooks/useX.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { xService } from "@/services/xService";

export function useFetchX(id: string) {
  return useQuery({
    queryKey: ["x", id],
    queryFn: () => xService.fetchX(id),
  });
}

export function useCreateX() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: xService.createX,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["x"] });
    },
  });
}
```

### Template: Novo Schema Zod
```typescript
// src/validations/xSchema.ts
import { z } from "zod";
import { IXCreateRequest } from "@ava-poc/types";

export const xCreateSchema = z.object({
  nome: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
}) satisfies z.ZodType<IXCreateRequest>;

export type XCreateFormValues = z.infer<typeof xCreateSchema>;
```

---

## 9.5 Gaps Críticos Identificados (5 tópicos + 43 subtarefas)

| Gap | Fase | Subtarefa | Duração | Impacto |
|---|---|---|---|---|
| **1. Tratamento de erros HTTP** | 0 | 0.7 | 1.5d | RF39-44 — mensagens claras, loading states, vazios |
| **2. Geração de quiz via IA** | 4 | 4.7 | 2-3d | RF35-38 — Spring AI preview antes de salvar |
| **3. Login email OU username** | 2 | 2.3 | inline | RF02 — refactor loginSchema |
| **4. Governança de entrega** | 6 | 6.7 | 1d | RNF30-32 — PR checklist, code review criteria |
| **5. Slots Pattern componentes** | 1 | 1.6 | 1.5d | CLAUDE.md — Card, Modal, FormContainer reutilizáveis |

**Subtarefas revisadas:** 39 → 43 (4 subtarefas novas, 1 refactor inline)  
**Duração revisada:** 10-16 sem. → 11-17 sem. (+7 dias)

---

## 10. Dúvidas Frequentes

**P: Começar com Fase 0 ou Fase 1?**  
A: Fase 0 (segurança) — bloqueia tudo. Sem guard, integração será frágil.

**P: Fazer tudo em uma branch gigante ou múltiplas branches?**  
A: **Múltiplas branches** — uma por fase, seguindo GitFlow padrão.

Workflow:
- **Tipo:** `feature/refactor-<dominio>` (ex: `feature/refactor-auth-guard`)
- **Base:** sempre `development`
- **Merge:** via GitHub UI com code review
- **Commits:** `test: ...`, `feat: ...`, `refactor: ...` (TDD)
- **Validar:** `pnpm type-check && pnpm lint && pnpm test && pnpm build`

Branch types adicionais:
- `bugfix/fix-<tipo>`: Bugs descobertos durante desenvolvimento
- `hotfix/fix-<severidade>`: Urgências críticas em produção

**Ver [GITFLOW_STRATEGY.md](GITFLOW_STRATEGY.md) para detalhes completos.**

**P: Backend não tem endpoint XYZ ainda. O que fazer?**  
A: Registrar como pendência contratual em `/memories/` e remover o fluxo do escopo ativo até o endpoint existir em `.claude/commands/doc/arquitetura.md`.

**P: Quanto tempo leva tudo?**  
A: ~11-17 semanas (4 meses) se 1 dev full-time. Pode paralelizar Fases 2-4 após Fase 1 OK.

**P: Qual é o risco maior?**  
A: Inconsistência de contrato FE-BE. Mitigação: validar endpoints com backend ANTES de Fase 2.

---

**Salvo em:** `/docs/REFACTORING_QUICK_REFERENCE.md` (versionado no repositório)

---

## 11. GitFlow Strategy — Documentação Completa

👉 **Ver [GITFLOW_STRATEGY.md](GITFLOW_STRATEGY.md) para:**

- 5 tipos de branches com ciclo de vida completo
- Workflow diário (checkout, pull, commit, push, PR, merge)
- Nomenclatura detalhada (feature, bugfix, hotfix, development, main)
- Rastreabilidade de commits vinculada a RF/RN/RNF
- 7 respostas FAQ sobre branches, conflitos, hotfix, merge strategies
