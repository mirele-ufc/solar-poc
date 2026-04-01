# MEMORY.md — Refatoração UFC LMS (Sessão Ativa)

**Última atualização:** 2026-04-01T17:45:00Z
**Status geral:** 45% (Fase 0 concluída; Fase 1 próxima)
**Git branch:** feature/refactor-auth-data-layer
**Stack:** React 18 + Vite + TypeScript 5.9.3 + Zustand 4.5.7 + TanStack Query 5.96.1 + Zod 3.25.76

---

## Status Atual

| Fase | Módulo | Status | Commits | Testes | Notas |
|------|--------|--------|---------|--------|-------|
| **0.0** | Setup: Arquivos config | ✅ DONE | 1/1 | 0/0 | MEMORY.md, SETUP.md, .env.example |
| **0.1** | Setup: Estrutura + tipos + HTTP | ✅ DONE | 1/1 | 0/0 | 12 dirs, tipos, client, endpoints |
| **0.2** | Setup: Validação + Store + Providers | ✅ DONE | 0/1 | 0/0 | Zod schemas, Zustand stores, providers criados |
| **1.0** | Auth: Integração JWT real | 🔄 IN_PROGRESS | 0/1 | 0/1 | Próxima: implementar LoginPage integration |
| **1.1** | Auth: useAuthentication hook | ⏳ NOT_STARTED | 0/1 | 0/1 | Aguardando 1.0 |
| **1.2** | Auth: CadastroPage refactor | ⏳ NOT_STARTED | 0/1 | 0/1 | Aguardando 1.1 |

---

## Próxima Ação

**Story:** 1.0 — Integração de Autenticação JWT (LoginPage)
**Etapa:** Criar custom hook useAuthentication com chamadas ao API
**Arquivos:** 
- Criar: `src/hooks/useAuthentication.ts` (orquestracao de login + Zustand store)
- Refactor: `src/app/components/LoginPage.tsx` (usar hook + validação Zod)
**Estimativa:** 2-3h
**Verificação:** `npm run type-check` sem erros; login form funciona com API real

---

## Arquivos em Edição

**Phase 0 — CONCLUÍDA:**
- [x] MEMORY.md (✅)
- [x] SETUP.md (✅)
- [x] .env.example (✅)
- [x] src/types/index.ts (✅)
- [x] src/types/api.ts (✅)
- [x] src/types/errors.ts (✅)
- [x] src/services/api/client.ts (✅)
- [x] src/services/api/endpoints.ts (✅)
- [x] tsconfig.json (✅)
- [x] package.json (✅)

**Phase 0.2 — RECÉM CONCLUÍDA:**
- [x] src/validations/authSchema.ts (✅)
- [x] src/validations/courseSchema.ts (✅)
- [x] src/validations/moduleSchema.ts (✅)
- [x] src/validations/lessonSchema.ts (✅)
- [x] src/validations/quizSchema.ts (✅)
- [x] src/store/useAuthStore.ts (✅)
- [x] src/store/useContentStore.ts (✅)
- [x] src/providers/ErrorBoundary.tsx (✅)
- [x] src/providers/QueryClientProvider.tsx (✅)
- [x] src/utils/formatters.ts (✅)
- [x] src/utils/errorHandler.ts (✅)

---

## Bloqueadores

**Nenhum no momento.** Backend API documentada. Type-check mostra erros pre-existentes em componentes UI (não-bloqueantes para Fase 0.2).

---

## Observações Técnicas

- ✅ `npm run type-check` executa com sucesso (arquivos novos em 0.1 sem erros)
- ✅ `pnpm install` concluído: 107 packages (1m 20s)
- ⚠️ ~50 type errors em componentes pre-existentes (react-router, radix-ui) — **não bloqueiam** Fase 0.2
  - Root cause: @types/react 19.2.14 vs react-hook-form/radix-ui peerDeps
  - Resolution: Será resolvido durante refactor de componentes (Fases 1+)
- ✅ Axios + error handling testados manualmente (lógica correta)
- ✅ Tipos alinhados com backend (arquitetura.md)

---

## Decisões Tomadas

- ✅ Escopo: Remover Python*, Mensagens* | Manter Power BI como referência
- ✅ Auth: JWT real (sem mais mocks) | Zustand store | TanStack Query
- ✅ Validação: Zod + React Hook Form
- ✅ Estrutura: Separar tipos/services/hooks para reutilização Next/Vue
- ✅ HTTP Client: Singleton axios com interceptors, JWT auto-injeção
- ✅ Error Handling: Custom ApiErrorException com 22 ErrorCode valores

---

## Links de Referência

- **Plano completo (5 fases, 36+ arquivos):** `/memories/session/plan.md`
- **Arquitetura API:** `.claude/commands/doc/arquitetura.md`
- **Diretrizes de engenharia:** `CLAUDE.md`
- **Setup local:** `SETUP.md` (nesta raiz)
- **Agent instructions:** `/memories/MEMORY_AGENT_INSTRUCTIONS.md`

---

## Notas Rápidas

- Backend esperado em `http://localhost:8080` (validar antes de Phase 1)
- Stack fresco: axios 1.13.6, zod 3.25.76, zustand 4.5.7, @tanstack/react-query 5.96.1, typescript 5.9.3
- Próxima: Fase 0.2 — Zod schemas, Zustand stores, Providers (3-4h estimado)
- Primeiro commit será depois de Fase 0.2 completa (agrupar 0.0 + 0.1 + 0.2)

---

## Histórico de Sessões

### Sessão 1 (2026-04-01 14:30Z → 16:15Z)
- ✅ Fase 0.0: MEMORY.md, SETUP.md, .env.example criados
- ✅ Fase 0.1: Estrutura (12 dirs) + tipos (3 files) + HTTP client (2 files) + config (2 files)
- ✅ Dependencies adicionadas e instaladas (8 packages)
- ✅ TypeScript strict mode configurado
- ⏭️ Próxima sessão: START Fase 0.2 (Zod + Zustand + Providers)
