# MEMORY.md — Rastreamento de Progresso Contínuo

> **Fonte de verdade única** para progresso do refactoring UFC LMS React.  
> Atualizado automaticamente pelo agente **IMPLEMENT-AND-COMMIT** após cada subtarefa.  
> Lido pelo agente **STATUS-REFACTORING** para gerar dashboard.

---

# MEMORY.md — Refatoração UFC LMS (Sessão Ativa)

**Última atualização:** 26/03/2026 (1.2 implementada — migração useAuthStore para IUserSession)  
**Sprint ativo:** Fase 1 — Contratos Canônicos e Tipagem  
**Status geral:** 21% (9/43 subtarefas)

---

## SECTION: GLOBAL PROGRESS

| Campo      | Valor                                              |
| ---------- | -------------------------------------------------- |
| **Fase**   | 1 — Contratos Canônicos e Tipagem                 |
| **Módulo** | 1.2 — Migrar useAuthStore para tipos globais      |
| **Story**  | 1.2 — Migração do store para IUserSession concluída |
| **Status** | DONE                                               |
| **Branch** | feature/refactor-contratos-tipagem                 |

**Status:** Fase 1 em andamento, Story 1.2 ✅ DONE, 9/43 total (21%), next: 1.3

### ✅ Completes

| Sub | Title                                           | Status | Date       | Commit                                | PR  |
| --- | ----------------------------------------------- | ------ | ---------- | ------------------------------------- | --- |
| 0.1 | Criar ProtectedRoute com validação de role      | ✅     | 25/03      | ce2df32                               | —   |
| 0.2 | Integrar ProtectedRoute em routes.ts            | ✅     | 25/03/2026 | 028ba89                               | —   |
| 0.3 | Remover hardcodes de role em páginas            | ✅     | 25/03/2026 | 41a3b29                               | —   |
| 0.4 | Implementar logout seguro local                 | ✅     | 26/03/2026 | 7689a26 + cd395ac                     | —   |
| 0.5 | Implementar Unauthorized page                   | ✅     | 26/03/2026 | 8fa0cd3 + 00d9fe6                     | —   |
| 0.6 | Validar rotas públicas sem guard incorreto      | ✅     | 26/03/2026 | 189c57f                               | —   |
| 0.7 | HTTP error interceptor + loading + empty states | ✅     | 26/03/2026 | 1aac552 + 3edb2fc + 41cb179 + 4390f75 | —   |
| 1.1 | Auditar e consolidar tipos em @ava-poc/types    | ✅     | 26/03/2026 | 9bb4021 + 910841e                     | —   |
| 1.2 | Migrar useAuthStore para tipos globais          | ✅     | 26/03/2026 | 6dfa8ae + 146efd2 + 99f8ba3 + 6a664e6 + d285b57 | —   |

### 📊 By-Phase Metrics

| Phase     | Complete | Total  | %       | Status             | Start Date | Est. End |
| --------- | -------- | ------ | ------- | ------------------ | ---------- | -------- |
| 0         | 7        | 7      | 100%    | ✅ COMPLETA        | 25/03      | 26/03    |
| 1         | 2        | 6      | 33%     | 🔄 IN_PROGRESS     | 26/03      | —        |
| 2         | 0        | 7      | 0%      | ⏳ FUTURE          | —          | —        |
| 3         | 0        | 6      | 0%      | ⏳ FUTURE          | —          | —        |
| 4         | 0        | 7      | 0%      | ⏳ FUTURE          | —          | —        |
| 5         | 0        | 4      | 0%      | ⏳ FUTURE          | —          | —        |
| 6         | 0        | 6      | 0%      | ⏳ FUTURE          | —          | —        |
| **TOTAL** | **9**    | **43** | **21%** | **🟢 IN PROGRESS** | 25/03      | —        |

### ⏳ Next Ready (First 3)

1. **1.3 — [Próxima subtarefa — verificar docs/REFACTORING_PLAN_GRANULAR_V2.md]**
   - Duração: —
   - Dependências: 1.2 ✅ (em fase de commits)
   - Status: ⏳ READY APÓS MERGE DE 1.2
   - Detalhes: Confirmar com documentação

2. **1.4 — [Próxima]**
   - Duração: —
   - Status: ⏳ FUTURE

3. **[Próxima fase 2+]**
   - Status: ⏳ FUTURE

### ⛔ Blockers

❌ **Nenhum blocker detectado.**

- ✅ Backend: Status desconhecido (validar em `/start-implementation`)
- ✅ Tests: Vitest pronto para usar
- ✅ Git: Branch `feature/refactor-auth-guard-global` sincronizada com origin
- ✅ Documentação: Todas docs em `/docs/` presentes

---

## SECTION: SESSION CONTEXT

| #   | Story | Status  | Commits | Testes | Evidencia de teste criado                                                                             | Evidencia RED inicial                       | Notas                                                                                                |
| --- | ----- | ------- | ------- | ------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | 0.1.1 | ✅ DONE | 1/1     | 2/2    | src/**tests**/unit/routes/ProtectedRoute.test.tsx                                                     | RED inicial registrado no ciclo da story    | Guard global aplicado no roteamento + commit realizado                                               |
| 2   | 0.2.1 | ✅ DONE | 1/1     | 3/3    | src/**tests**/unit/routes/ProtectedRoute.test.tsx                                                     | RED registrado na suite de rotas            | routes.ts segmentado por role (professor/student e professor only) + commit realizado                |
| 3   | 0.3.1 | ✅ DONE | 1/1     | 3/3    | src/**tests**/unit/pages/roleCleanup.test.tsx                                                         | Suite de regressão criada no ciclo          | Role cleanup concluído em pages; mensageria protegida por rota; commits 41a3b29 + 1d0cccb publicados |
| 4   | 0.4.1 | ✅ DONE | 2/2     | 3/3    | src/**tests**/unit/store/authLogout.test.ts, src/**tests**/unit/components/AuthLayout.logout.test.tsx | RED validado (1 falha funcional)            | Logout local aplicado no AuthLayout sem endpoint backend                                             |
| 5   | 0.5.1 | ✅ DONE | 2/2     | 3/3    | src/**tests**/unit/pages/UnauthorizedPage.test.tsx                                                    | RED validado (import da página ausente)     | UnauthorizedPage criada com botão de retorno e redirecionamento automático para /courses             |
| 6   | 0.6.1 | ✅ DONE | 1/1     | 4/4    | src/**tests**/unit/routes/publicRoutes.test.tsx                                                       | RED estrutural (testes antes de rodar)      | Suite valida que /, /register, /forgot-password e /unauthorized são acessíveis sem autenticação      |
| 7   | 1.1.1 | ✅ DONE | 2/2     | 27/27  | Type-check OK; Vitest: 27/27 testes passando                                                          | Draft: tipos consolidados em @ava-poc/types | Consolidação de tipos em v1.0 + resolução de role (professor/student/admin) + imports bem-definidos  |

**Resumo:** 7/7 stories Fase 0 + 1/1 story Fase 1.1, Total 8/8 commits, 27/27 testes focados passando

### Last Action

- **Date:** 26/03/2026 16:00 UTC
- **Machine:** local
- **What:** Subtarefa 1.1 implementada — consolidação de tipos em @ava-poc/types v1.0
- **Testes executados:**
  - Type-check TypeScript: ✅ PASSED (consolidação validada)
  - Vitest: 27/27 ✅ PASSED
- **Commits realizados:**
  - `9bb4021` refactor: Consolidar tipos domain + API em @ava-poc/types v1.0
  - `910841e` refactor: Resolver inconsistência role e atualizar imports
- **Status:** Consolidação de tipos concluída; todos os consumidores migrados para @ava-poc/types; imports centralizados; role resolvido (professor/student/admin)
- **Próxima:** 1.2 (Migrar useAuthStore para tipos globais) — READY NOW

### Observações Contratuais da 0.2

- A rota `/admin/usuarios` não existe no roteador atual (`src/routes.ts`); registrado para implementação posterior quando a rota/página admin estiver no escopo ativo.

### For Next Session

Quando você voltar para continuar:

```bash
# 1. Antes de tudo, validar contexto
/status-refactoring

# 2. Começar Fase 1.2
Implemente 1.2 (Migrar useAuthStore para tipos globais)
```

### Important Notes

- 📖 **Primeira vez?** Leia: `docs/COMO_COMECAR.md` (setup + TDD walkthrough)
- 🚀 **Pronto para codificar?** Siga: `docs/REFACTORING_QUICK_REFERENCE.md` (10 min overview)
- 📋 **Detalhes de cada subtarefa?** Consulte: `docs/REFACTORING_PLAN_GRANULAR_V2.md`
- 🎯 **Entendeu o workflow?** Comande: `Implemente 0.7 (Tratamento HTTP padronizado + loading states)`

### Velocity & Timeline

- **Velocidade esperada:** 1-2 subtarefas/dia (durante ramp-up da Fase 0)
- **Timeline total:** 11-17 semanas (43 subtarefas)
- **Estimativa final:** Meados de maio de 2026

_Será atualizada conforme velocidade real for estabelecida._

---

## SECTION: MAINTENANCE

**Story:** 0.1.2  
**Título:** Política central de role  
**Etapa:** RED (escrever teste antes da implementação)  
**Arquivo:** src/routes/types.ts + src/routes + src/**tests**/unit/routes  
**Estimativa:** 60-90 min

### How to Update This File

**Quando o agente IMPLEMENT-AND-COMMIT completa uma subtarefa:**

1. Adicione nova linha em tabela `✅ Completes`:

   ```
   | 0.1 | Criar ProtectedRoute com validação de role | ✅ | 24/03 | abc1234 | #125 |
   ```

2. Atualize `Fase 0` em tabela `By-Phase Metrics`:

   ```
   | 0 | 1 | 7 | 14% | 🟢 IN PROGRESS | 24/03 | — |
   ```

3. Atualize linha de status inicial:

   ```
   Status: Fase 0 — Segurança, 1/7 complete, 1/43 total (2%), next: 0.2
   ```

4. Mova próximas ready (remova blocker, adicione nova):

   ```
   ⏳ Next Ready
   1. 0.2 — Integrar ProtectedRoute (1.5 dias) ✅ READY NOW
   2. 0.3 — Cleanup rotas (0.5 dias) ⏳ BLOCKED on 0.2
   3. 0.4 — Logout Seguro (1 dia) ⏳ BLOCKED on 0.2, 0.3
   ```

5. Atualize SESSION CONTEXT:
   ```
   Last Action:
   - Date: 24/03/2026 14:30
   - Machine: [seu-pc]
   - What: Merged PR#125 (0.1 ProtectedRoute)
   - Status: Tudo commitado
   ```

**Automatização:** O agente IMPLEMENT-AND-COMMIT faz isso automaticamente. Você não precisa editar manual (mas pode se precisar corrigir).

### File Locations

- **Este arquivo:** Raiz do projeto → `./MEMORY.md`
- **Lido por:** `/status-refactoring` agente
- **Atualizado por:** `/implement-and-commit` agente
- **Backup:** Commit history em git (cada atualização é um commit)

### Git Strategy

- Cada atualização de MEMORY.md vem com commit `docs: Atualizar MEMORY.md com subtarefa X.Y completa`
- History é preservado em git → Sempre possível rolar back se necessário
- MEMORY.md é versionado no git (não local-only)

---

## QUICK REFERENCE

| Ação                            | Comando                                      |
| ------------------------------- | -------------------------------------------- |
| Ver status atual                | `/status-refactoring`                        |
| Começar implementação           | `Implemente 0.4 (Implementar logout seguro)` |
| Ver contexto                    | Ler este arquivo: **MEMORY.md**              |
| Consultar detalhes da subtarefa | `docs/REFACTORING_PLAN_GRANULAR_V2.md`       |
| Validar contexto todo           | `/start-implementation`                      |
| Ler guia completo               | `docs/COMO_COMECAR.md`                       |

---

**Criado:** 24/03/2026  
**Status:** ✅ Pronto para primeira subtarefa  
**Próxima ação:** Rodar `/start-implementation` para validar tudo

```
1. [Ação A]
2. [Ação B]
3. [Ação C]
```

---

## 📝 Arquivos em Edição

- [ ] `src/.../.../file1.tsx`
- [ ] `src/__tests__/.../file1.test.tsx`
- [ ] `src/.../.../file2.tsx`

**Status de cada um:**

- file1.tsx: [descrição do estado — 80% escrito, faltam testes]
- file1.test.tsx: [estado — RED, 2 testes falhando]
- file2.tsx: [estado — TODO]

---

## 🚦 Bloqueadores

**Nenhum registrado**

Ou:

| Bloqueador  | Impacto               | Solução           |
| ----------- | --------------------- | ----------------- |
| [descrição] | [qual story bloqueia] | [ação necessária] |

---

## 💡 Notas Rápidas

- **Config Zustand:** Middleware persist resolvido em Story 0.2.1
- **MSW mock:** API mocking funciona corretamente, não precisa ajuste
- **TypeScript:** strict mode — validar interface de store
- **Padrão TDD:** Aprovado, seguir AAA (Arrange, Act, Assert)
- **Commits:** Graph de commits em bom estado, merge pronto para development

---

## 📋 Checklist de Pronto (DoD)

Quando finalizar story, verificar:

- [ ] Testes unitários: 100% passando
- [ ] Testes de integração: passando
- [ ] `npm run type-check`: sem erros
- [ ] `npm run lint`: sem warnings
- [ ] `npm run build`: sucesso
- [ ] Commit automático feito com convenção correta
- [ ] Branch está atualizada com development (se necessário)
- [ ] Não quebrou outras stories/páginas

---

## 🔗 Links de Referência

| Link                                            | Propósito                                                      |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `/memories/REFACTORING_PLAN_FINAL.md`           | Plano técnico completo (fases, stories, endpoints)             |
| `/memories/refactoring-quick-ref.md`            | Quick reference (decisões, stack, próximas ações)              |
| `/memories/sprint-tracking.md`                  | Rastreamento de progresso global                               |
| `CLAUDE.md`                                     | Diretrizes de código, SOLID, Clean Code                        |
| `.claude/commands/doc/requisitos-funcionais.md` | RFs — orienta quais endpoints/funcionalidades implementar      |
| `.claude/commands/doc/user-stories.md`          | USs — contexto de negócio por perfil (ADMIN, PROFESSOR, ALUNO) |

---

## 🔄 Histórico de Updates Nesta Sessão

```
[HH:MM] Iniciada sessão, chat #X
[HH:MM] Story X.Y.1 — DONE (testes + implementação + commit)
[HH:MM] Story X.Y.2 — Em testes, 2/2 passando
[HH:MM] MEMORY.md atualizado — próximo: implementar arquivo2.tsx
```

---

## 🛑 Pausar / Retomar

**Se tokens esgotar ou precisar pausar:**

1. ✅ Garantir que MEMORY.md está 100% atualizado
2. ✅ Fazer commit final: `chore: Atualizar MEMORY.md — sessão pausada`
3. ✅ Feature branch fica em estado de trabalho-em-progresso (tudo staged/committed)
4. ✅ Próximo agente lê MEMORY.md para entender contexto

**Para retomar:**

1. Ler `MEMORY.md` inteiro
2. Ler seção "Próxima Ação"
3. Rodar `git status` para verificar estado da branch
4. Continuar do ponto exato onde parou

---

**Última atualização:** [vazio — preencher ao usar]  
**Status:** [vazio — preencher ao usar]  
**Sessão ativa:** SIM / NÃO
