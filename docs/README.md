# 📚 Documentação: Refatoração UFC LMS Frontend

**Data:** 24/03/2026  
**Status:** ✅ Contexto completo e sincronizado  
**Para:** Todos os desenvolvedores (primeira vez ou retomando)

---

## 🤖 Seus 3 Agentes Autônomos

Você não faz tudo manual — temos **agentes que trabalham para você**:

| Agente        | Comando                   | O que faz                                                                                                      | Quando usar                               |
| ------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **validator** | `/start-implementation`   | Valida contexto (docs, 43 subtasks, baseline contratual estrito)                                               | Primeira vez, ou validar tudo             |
| **status**    | `/status-refactoring`     | Dashboard (fase, progresso %, próximas ready, blockers)                                                        | Para saber onde está e qual fazer próximo |
| **executor**  | `Implemente X.Y (Titulo)` | RED→GREEN→REFACTOR + etapa Git (planejamento e decisão), com commits/push/PR apenas após autorização explícita | Começar uma subtarefa                     |

### Quick Start com Agentes

```bash
# 1. Validar que tudo está OK
/start-implementation

# 2. Ver status e próximas ready
/status-refactoring

# 3. Escolher explicitamente a subtarefa
Implemente 0.1 (ProtectedRoute com TDD)
# Executor atua na subtarefa escolhida e pede autorização antes de ações de git ✅
```

**Seu trabalho:** Escolher conscientemente qual agente executar em cada etapa.  
**Validator faz:** validação e relatório de prontidão.  
**Status faz:** priorização e leitura de progresso.  
**Executor faz:** código, testes e documentação; commits, push e PR só com autorização explícita.

### Limite do Validator

`/start-implementation` não deve:

- modificar código
- escrever testes
- iniciar automaticamente uma subtarefa
- substituir `Implemente X.Y (Titulo)`

### Limite do Executor

`Implemente X.Y (Titulo)` não deve:

- criar commits sem autorização explícita do usuário
- fazer `git push` ou abrir PR sem autorização explícita do usuário
- seguir automaticamente para a próxima subtarefa ou fase

## 🔄 Fluxo Oficial dos 3 Agentes (Plano Híbrido Portável)

Sequência oficial para qualquer máquina/usuário:

1. `validator` (`/start-implementation`)

- Valida prontidão documental e contrato.
- Não implementa código.

2. `status` (`/status-refactoring`)

- Mostra fase atual, progresso, próximas ready e blockers.
- Não inicia subtarefa automaticamente.

3. `executor` (`Implemente X.Y (Titulo)`)

- Implementa a subtarefa escolhida via RED → GREEN → REFACTOR.
- Commit/push somente após autorização explícita.

4. Repetir ciclo:

- `status` novamente para confirmar progresso e próxima ação.

### Estratégia Híbrida (Frontend-Only)

- Sequencial por gates: base estrutural e contratos/tipos.
- Paralelo por domínio após estabilizar auth/perfil.
- Sem mudanças no backend neste ciclo.
- Fluxos sem endpoint contratual permanecem fora do escopo ativo.

---

## 🚀 Para Novos Desenvolvedores

### 1️⃣ **Comece AQUI** (5 minutos)

👉 **[COMO_COMECAR.md](COMO_COMECAR.md)**

- Setup inicial (Node, pnpm, backend validação)
- Ler documentação nesta ordem
- TDD walkthrough para Fase 0.1 (ProtectedRoute)

### 2️⃣ **Visão Geral do Projeto** (10 minutos)

👉 **[REFACTORING_QUICK_REFERENCE.md](REFACTORING_QUICK_REFERENCE.md)**

- 7 fases numeradas (0-6) em 1 página
- 43 subtarefas distribuídas (7+6+7+6+7+4+6)
- baseline contratual estrito de endpoints (somente arquitetura.md)
- 12 RNs (Regras de Negócio) mapeadas para fases
- Padrões TDD e commits

### 3️⃣ **Plano Granular Detalhado** (20-30 minutos)

👉 **[REFACTORING_PLAN_GRANULAR_V2.md](REFACTORING_PLAN_GRANULAR_V2.md)**

- Cada subtarefa com:
  - Descrição e lógica
  - Arquivos a criar/modificar
  - Testes esperados
  - Commits recomendados
  - Duração estimada
- Tabela de endpoints backend (somente endpoints oficiais de arquitetura.md)
- RF, RN, RNF mapping
- 5 gaps críticos integrados

### 4️⃣ **Escalabilidade Multi-Framework** (Fase 2+)

👉 **[MULTI_FRONTEND_ROADMAP.md](MULTI_FRONTEND_ROADMAP.md)**

- Estratégia de escalação para Vue e Next.js
- Turbo monorepo structure
- Reusability matrix (80% shared types, validation, services)
- Timeline: React (1-17 sem), Vue (18-28 sem), Next (29-39 sem)

---

## 🔍 Estrutura de Fases

```
Fase 0 (1-2 sem): Segurança
  ├─ ProtectedRoute + role-based access
  ├─ Guard em todas as rotas autenticadas ativas
  ├─ Error handling HTTP + loading states (Gap 0.7)
  └─ 7 subtarefas

Fase 1 (1-2 sem): Contratos & Tipos
  ├─ @ava-poc/types v1.0 consolidada
  ├─ Zod schemas centralizados
  ├─ useAuthStore migration
  ├─ Slots Pattern (Card, Modal, FormContainer) (Gap 1.6)
  └─ 6 subtarefas

Fase 2 (2-3 sem): Auth Backend
  ├─ authService (POST /auth/login, /cadastro, /refresh)
  ├─ Login com email OU username (Gap 2.3)
  ├─ JWT refresh token flow
  ├─ ProfilePage, ForgotPassword, ResetPassword
  └─ 7 subtarefas

Fase 3 (2-3 sem): Cursos & Módulos
  ├─ courseService, modulesService, lessonsService
  ├─ CoursesPage, CreateCoursePage, ManageCoursePage
  ├─ Lições com CKEditor + PDF upload (RN07)
  └─ 6 subtarefas

Fase 4 (2-3 sem): Exames + Conformidade Contratual
  ├─ examService (GET/POST /provas, /perguntas, /alternativas)
  ├─ ExamPage, ExamResultPage
  ├─ AI quiz generation via Spring AI (Gap 4.7)
  ├─ Remoção de fluxos/rotas sem endpoint oficial
  └─ 7 subtarefas

Fase 5 (1-2 sem): Deduplicação
  ├─ Componentes compartilhadas (Lesson, Exam, shared routes)
  ├─ Configuração dinâmica por :courseId
  └─ 4 subtarefas

Fase 6 (1-2 sem): Hardening
  ├─ Breadcrumbs, i18n (português), A11y
  ├─ PR template, code review checklist (Gap 6.7)
  ├─ CLAUDE.md atualizado
  └─ 6 subtarefas

TOTAL: 43 subtarefas | 11-17 semanas
```

**Nota de escopo histórico:** quando houver menções legadas a fluxos de mensageria ou endpoints não contratuais em documentos auxiliares, trate-as apenas como registro histórico. Esses fluxos permanecem fora do escopo ativo até formalização em `.claude/commands/doc/arquitetura.md`.

---

## 📌 Endpoints Backend

Baseline atual:

- 39 endpoints oficiais no contrato de arquitetura
- fluxos sem endpoint em arquitetura.md devem ser removidos do escopo ativo
- nenhuma rota frontend deve depender de endpoint não documentado no contrato
- não existe endpoint de logout no contrato; logout deve apenas limpar estado local e navegar

| Domínio           | Count  | Service          | Status  |
| ----------------- | ------ | ---------------- | ------- |
| Auth              | 5      | `authService`    | Phase 2 |
| Perfil            | 3      | `authService`    | Phase 2 |
| Admin             | 3      | `userService`    | Phase 2 |
| Cursos            | 7      | `courseService`  | Phase 3 |
| Módulos           | 4      | `modulesService` | Phase 3 |
| Aulas             | 6      | `lessonsService` | Phase 3 |
| Provas            | 5      | `examService`    | Phase 4 |
| Perguntas         | 3      | `examService`    | Phase 4 |
| Alternativas      | 3      | `examService`    | Phase 4 |
| **TOTAL oficial** | **39** |                  |         |

---

## ✨ Recursos Principais

- ✅ **Zero Trust Client:** Todas validações críticas no backend
- ✅ **TDD Mandatory:** RED → GREEN → REFACTOR para cada subtarefa
- ✅ **Clean Code:** Funções pequenas, responsabilidade única, SOLID
- ✅ **Slots Pattern:** Componentes reutilizáveis com flexible composition
- ✅ **Zustand + React Query:** State management + data fetching
- ✅ **Zod Schemas:** Validação centralizada
- ✅ **TypeScript Strict:** Zero `any`
- ✅ **Tailwind + Shadcn:** Styling + components
- ✅ **GitFlow:** feature/ branches, PRs obrigatórias

---

## 🔗 Integração com Backend

**Validação obrigatória antes de Fase 2:**

```bash
# Confirme que backend tem:
POST /auth/login
POST /auth/cadastro
POST /auth/refresh
GET  /perfil
# ... baseline contratual estrito de arquitetura.md
```

Veja seção 3 de [COMO_COMECAR.md](COMO_COMECAR.md#3-validar-contrato-com-backend) para checklist.

---

## 🚦 Validação de Contexto

Para verificar se todo contexto está sincronizado:

```bash
/start-implementation
```

**Esperado:** ✅ GREEN — "CONTEXTO VALIDADO COM SUCESSO"

**Importante:** esse comando apenas valida contexto e retorna um relatório. Ele não inicia implementação.

Se ⚠️ YELLOW ou ❌ RED: veja [COMO_COMECAR.md](COMO_COMECAR.md) seção "Troubleshooting".

---

## 📝 Próxima Ação

1. **Leia [COMO_COMECAR.md](COMO_COMECAR.md)** (5-10 min)
2. **Execute `/start-implementation`** para validar contexto (5 min)
3. **Execute `/status-refactoring`** para ver a próxima subtarefa ready
4. **Se decidir executar uma subtarefa**, autorize explicitamente o handoff para o executor e então use o comando, por exemplo:
   ```bash
   Implemente 0.1 (ProtectedRoute com TDD)
   ```

---

**Versão:** 2.0 | **Data:** 24/03/2026 | **Status:** Pronto para implementação ✅
