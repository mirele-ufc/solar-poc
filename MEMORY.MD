# MEMORY.md — Validação e Alinhamento PoC (React vs Vue)

**Última atualização:** 09/04/2026T15:45:00Z  
**Objetivo:** Validar equivalência React vs Vue, aumentar cobertura de testes ~20% → 70%, auditar OWASP  
**Status geral:** Fase 1 — Bloco B (100% COMPLETO), Bloco C próximo  
**Timeline:** 4-5 semanas (Fase 1: 50h + Fase 2: 28h)

---

## 🎯 CONTEXTO

Transição do ciclo anterior (refatoração React com backend integrado) para novo ciclo (validação PoC em paralelo React + Vue). Ambas PoCs têm ~75% funcionalidade equivalente (90% em React, 85% em Vue) mas com graves lacunas em cobertura de testes (~20% vs 70% target).

---

## SECTION: GLOBAL PROGRESS

| Campo        | Valor                                         |
| ------------ | --------------------------------------------- | -------- |
| **Fase**     | 1 — Alinhamento de PoC (Blocos A-F)           |
| **Bloco**    | C — Equivalência HTTP/Auth (próximo)          |
| **Status**   | ✅ A DONE (100%) ✅ B DONE (100%)             | 🟡 C 90% |
| **Objetivo** | 100% equivalência React ↔ Vue, 70%+ cobertura |
| **Timeline** | Fase 1: 2-3 sem (50h) \| Fase 2: 2 sem (28h)  |

**Progress (09/04/2026 — Blocos A + B Finalizados):** ✅✅

1. ✅ Bloco A: Remoção de escopo (5/5 subtarefas)
2. ✅ Bloco B: Parametrização CourseFlow (5/5 subtarefas) — commits 42ae1fe, c27b917
3. 🟡 Bloco C: HTTP/Auth equivalência (5/5 subtarefas, 90% done) — pendente refactor Vue API

---

## SECTION: FASE 1 — Alinhamento de PoC

### ✅ Bloco A: Remoção de Escopo — 100% COMPLETO

| #   | Tarefa                                                         | React | Vue | Status  | Notas                                             |
| --- | -------------------------------------------------------------- | ----- | --- | ------- | ------------------------------------------------- |
| A1  | Remover rotas ForgotPassword, ResetPassword, Profile, Messages | ✅    | ✅  | ✅ DONE | Não existem em nenhuma PoC; Escopo já limpo       |
| A2  | Auditar TeacherCoursePage (React orphaned)                     | ✅    | N/A | ✅ DONE | Removido 09/04 — commit bdad0ae, build ✅         |
| A3  | Remover páginas fora de escopo                                 | ✅    | ✅  | ✅ DONE | React: TeacherCoursePage.tsx removido + test      |
| A4  | Validar rotas apenas: Auth, Courses, Modules, Lessons, Exams   | ✅    | ✅  | ✅ DONE | Audit completo — 16 rotas cada, equivalência 100% |
| A5  | Adicionar /unauthorized em Vue (missing)                       | ✅    | ✅  | ✅ DONE | Commit 9d1d9e6 — paridade completa React ↔ Vue    |

**Status Bloco A:** ✅ **100% COMPLETO** (todos A1-A5 concluídos)

---

### 🟡 Bloco B: Eliminar Duplicação Python/Power-BI — ✅ 100% COMPLETO

| #   | Tarefa                                                | React | Vue | Status  | Notas                                                       |
| --- | ----------------------------------------------------- | ----- | --- | ------- | ----------------------------------------------------------- |
| B1  | Criar CourseFlow parametrizado com `courseId` (React) | ✅    | N/A | ✅ DONE | Refatorado ExamPage + ExamInstructionsPage — commit 42ae1fe |
| B2  | Criar CourseFlow parametrizado com `courseId` (Vue)   | N/A   | ✅  | ✅ DONE | Refatorado ExamView + ExamInstructionsView — commit c27b917 |
| B3  | Consolidar provaData.ts + pythonProvaData.ts (React)  | ✅    | ✅  | ✅ DONE | Integrado em coursesConfig.ts (ambas PoCs)                  |
| B4  | Consolidar mock data (Vue)                            | N/A   | ✅  | ✅ DONE | Idem React                                                  |
| B5  | Remover PythonDetailPage (se existir)                 | ✅    | ✅  | ✅ DONE | Não encontrado em nenhuma PoC                               |

**Status Bloco B:** ✅ **100% COMPLETO** (todos B1-B5 concluídos)

**Detalhes Implementação:**

- React: coursesConfig.ts expandido com ExamQuestion[] para cada curso
- React: ExamPage.tsx parametrizado com route params :id → courseId dinâmico
- React: ExamInstructionsPage.tsx parametrizado
- Vue: coursesConfig.ts expandido idêntico ao React
- Vue: ExamView.vue parametrizado com route params :id → courseId dinâmico
- Vue: ExamInstructionsView.vue parametrizado
- Ambas: breadcrumbs, navegações e número de questões agora dinâmicos

---

### 🟡 Bloco C: Equivalência HTTP/Auth Simétrica

| #   | Tarefa                                          | React | Vue | Status        | Notas                                                        |
| --- | ----------------------------------------------- | ----- | --- | ------------- | ------------------------------------------------------------ |
| C1  | Validar Axios interceptor (JWT + refresh token) | ✅    | ⚠️  | 🟡 AUDIT DONE | Audit: 85% parity. Vue hardcoda URL (refatorar). Ver doc.    |
| C2  | Validar tratamento 500+ erros (erro global)     | ✅    | ✅  | ✅ DONE       | Ambas tratam: 403, 409, 422, 500+, ERR_NETWORK identicamente |
| C3  | Validar login mockado (ambas)                   | ✅    | ✅  | ✅ DONE       | Backend sem auth real; mocks corretos                        |
| C4  | Auditar refresh token flow (ambas)              | ✅    | ✅  | 🟡 AUDIT IN   | Ambas usam retry logic. Testes ainda faltam (Bloco E)        |
| C5  | Type-check ambas (zero `any`)                   | ✅    | ✅  | ✅ DONE       | React: type-check ✅. Vue: type-check ✅. 09/04 2026         |

**Status Bloco C:** ✅ **~90% DONE** (refatoração Vue + testes pendentes em Bloco E)

---

### 🟡 Bloco D: Normalizar Zod Schemas

| #   | Tarefa                               | React | Vue | Status  | Notas                                              |
| --- | ------------------------------------ | ----- | --- | ------- | -------------------------------------------------- |
| D1  | Normalizar naming Zod (React)        | ⏳    | N/A | 🔴 TODO | Padrão: `{Entity}{Operation}RequestSchema`         |
| D2  | Normalizar naming Zod (Vue)          | N/A   | ⏳  | 🔴 TODO | Idem React                                         |
| D3  | Integrar vee-validate completo (Vue) | N/A   | ⏳  | 🔴 TODO | Remover manual validation; usar vee-validate + Zod |
| D4  | Testar validações (ambas)            | ⏳    | ⏳  | 🔴 TODO | Verificar schemas rejeitam dados inválidos         |

---

### 🔴 Bloco E: Aumentar Cobertura de Testes ← **CRÍTICO**

| #         | Tarefa                      | React    | Vue     | Target  | Status                     | Notas                                                      |
| --------- | --------------------------- | -------- | ------- | ------- | -------------------------- | ---------------------------------------------------------- |
| E1        | Testes de Forms             | ~5%      | ~5%     | 20%     | 🔴 TODO                    | CourseCreateForm, ModuleCreateForm, etc. (3-5 testes cada) |
| E2        | Testes de Services          | ~8%      | ~10%    | 20%     | 🔴 TODO                    | courseService, moduleService, lessonService (mocks)        |
| E3        | Testes de Routes/Components | ~7%      | ~0%     | 15%     | 🔴 TODO                    | Acesso guard, redirecionamento, integração                 |
| E4        | Coverage Reports CI/CD      | ❌       | ❌      | 15%     | 🔴 TODO                    | Setup `vitest --coverage` em ambas                         |
| E5        | Testes de Integração E2E    | ❌       | ❌      | 10%     | 🔴 TODO                    | Login → Criar curso → Criar módulo → Criar aula            |
| **Total** | **~20%**                    | **~15%** | **70%** | 🔴 TODO | **Faltam ~100-120 testes** |

---

### 🟡 Bloco F: Code Quality — Zero `any` + Slots Pattern

| #   | Tarefa                         | React | Vue | Status   | Notas                                          |
| --- | ------------------------------ | ----- | --- | -------- | ---------------------------------------------- |
| F1  | TypeScript strict (zero `any`) | ✅    | ✅  | 🟡 AUDIT | Validar `npm run type-check` sem erros         |
| F2  | Slots Pattern em componentes   | ⏳    | ⏳  | 🔴 TODO  | Card, FormContainer, PageHeader (ambas)        |
| F3  | Naming semântico auditado      | ⏳    | ⏳  | 🔴 TODO  | Funções, variáveis, estados expressam intenção |

---

### ✅ Verificação Final Fase 1

- [ ] `npm run build` sem erros (ambas)
- [ ] `npm run type-check` sem erros (ambas)
- [ ] `npm run lint` sem warnings (ambas)
- [ ] `npm run test` — cobertura ≥70% (ambas)
- [ ] Rotas: apenas Auth, Courses, Modules, Lessons, Quizzes (ambas)
- [ ] HTTP: ambas com interceptador + tratamento centralizado
- [ ] CourseFlow parametrizado (sem duplicação)

---

## SECTION: FASE 2 — Performance + Segurança

| #   | Etapa                  | Status  | Target                   | Notas                                                 |
| --- | ---------------------- | ------- | ------------------------ | ----------------------------------------------------- |
| P1  | Lighthouse CI Setup    | ❌ TODO | N/A                      | `@lhci/cli`, `lighthouserc.json`                      |
| P2  | Performance Score      | ❌ TODO | ≥85                      | FCP, LCP, CLS, TTI                                    |
| P3  | Bundle Size            | ❌ TODO | React ≤200KB, Vue ≤180KB | gzipped                                               |
| S1  | XSS Prevention Tests   | ❌ TODO | 3 scenarios              | Script injection, img onerror, sanitização            |
| S2  | CSRF Protection Tests  | ❌ TODO | 2 scenarios              | Token + ataque mock                                   |
| S3  | Auth & Session Tests   | ❌ TODO | 3 scenarios              | Refresh, logout, rotas protegidas                     |
| S4  | Input Validation Tests | ❌ TODO | 4 scenarios              | Size, ext, MIME, special chars                        |
| R1  | Relatório Comparativo  | ❌ TODO | Tabela                   | React vs Vue (funcionalidade, performance, segurança) |
| R2  | Recomendação Final     | ❌ TODO | Documento                | Qual tecnologia escolher e por quê?                   |

---

## SECTION: PRÓXIMAS AÇÕES (Por Prioridade)

### ✅ Bloco A — FINALIZADO (09/04/2026)

- [x] **A1-A3:** Remoção páginas fora de escopo — ✅ DONE
- [x] **A4-A5:** Audit rotas + adicionar /unauthorized Vue — ✅ DONE
- [x] **Status:** 16 rotas por PoC, 100% equivalência ✅

### 🔴 Bloco B (Próximo) — Parametrização CourseFlow — 12-16h

1. **B1:** Criar CourseFlow parametrizado (React)
   - Refatorar CourseDetailPage para receber courseId dinâmico via route params
   - Pattern: `/courses/:id/...` (rotas já existem, lógica agora dinâmica)
2. **B2:** Criar CourseFlow parametrizado (Vue)
   - Refatorar CourseDetailsView idem React
3. **B3-B4:** Consolidar mock data (provaData.ts + pythonProvaData.ts)
   - Unificar em courseConfig.ts com courseId dinâmico
4. **B5:** Remover duplicação Python/Power-BI

**Estimativa:** 3-4 dias

### 🟡 Bloco C — HTTP/Auth — AUDIT (90% DONE, Vue refactor pendente)

- [x] **C1:** Axios interceptor audit — ✅ (85% parity)
- [ ] **C2:** Vue refatorar axios.post → authService.refreshAccessToken (minor)
- [x] **C3-C5:** Login mock, refresh flow, type-check — ✅

**Próximo:** Refatoração Vue + testes interceptor (Bloco E)

### 🟡 Bloco D — Normalizar Zod — 4-6h

- [ ] D1: Pattern naming React
- [ ] D2: Pattern naming Vue
- [ ] D3: vee-validate integração Vue
- [ ] D4: Testes validações

### 🔴 Bloco E — Cobertura Testes — 24-30h (MAIOR ESFORÇO)

- [ ] E1-E5: +100-120 testes necessários em ambas
- [ ] Setup coverage CI/CD

### 🟡 Bloco F — Code Quality — 4-6h

- [x] F1: Type-check ✅
- [ ] F2: Slots Pattern expand
- [ ] F3: Naming semântico audit

---

## SECTION: REFERÊNCIAS

| Documento                                                                              | Propósito                                 |
| -------------------------------------------------------------------------------------- | ----------------------------------------- |
| [docs/PLAN.md](docs/PLAN.md)                                                           | Plano completo com 23 etapas (Fase 1 + 2) |
| [CLAUDE.md](CLAUDE.md)                                                                 | Diretrizes arquiteturais e regra de ouro  |
| [apps/poc-react-vite/](apps/poc-react-vite/)                                           | PoC React (17 páginas, ~20% cobertura)    |
| [apps/poc-vue-vite/](apps/poc-vue-vite/)                                               | PoC Vue (15 views, ~15% cobertura)        |
| [/memories/session/plan-status-analysis.md](/memories/session/plan-status-analysis.md) | Análise detalhada 09/04/2026              |

---

## SECTION: ESTRUTURA DE BRANCHES

- **main:** Produção (não tocar)
- **development:** Integração contínua
- **feature/validate-poc-react:** Refatoração React (Blocos A-F)
- **feature/validate-poc-vue:** Refatoração Vue (Blocos A-F)

(Criar quando iniciar Bloco B)

---

## SECTION: COMANDOS RÁPIDOS

```bash
# Status das PoCs
cd apps/poc-react-vite && npm run test
cd apps/poc-vue-vite && npm run test

# Type check (ambas)
cd apps/poc-react-vite && npm run type-check
cd apps/poc-vue-vite && npm run type-check

# Build (ambas)
cd apps/poc-react-vite && npm run build
cd apps/poc-vue-vite && npm run build

# Lint (se disponível)
npm run lint
```

---

## ⛔ BLOCKERS

✅ **Nenhum blocker técnico inicial.**

- ✅ Ambas PoCs em estado funcionável
- ✅ Vitest disponível em ambas
- ✅ Documentação: `docs/PLAN.md` ✅
- ⚠️ Cobertura baixa (~20%) — será abordado em Bloco E

---

## 📝 COMO USAR ESTE MEMORY.md

1. **Iniciar sessão:** Leia "SECTION: GLOBAL PROGRESS"
2. **Próxima ação:** Consulte "SECTION: PRÓXIMAS AÇÕES"
3. **Fazer tarefa:** Escolha um Bloco/Tarefa e mude status
4. **Comitar:** Com referência a Bloco/Tarefa completada
5. **Atualizar:** Mude status de ❌ para ✅ em tabelas relevantes

---

## 📊 ESTIMATIVA DE ESFORÇO

| Fase                             | Horas   | Timeline        | Prioridade   |
| -------------------------------- | ------- | --------------- | ------------ |
| **Fase 1** (A-F)                 | 50h     | 2-3 semanas     | 🔴 CRÍTICO   |
| **Bloco E** sozinho              | 24-30h  | 1-2 semanas     | 🔴 **MAIOR** |
| **Fase 2** (Performance + OWASP) | 28h     | 2 semanas       | 🟡 ALTO      |
| **TOTAL**                        | **78h** | **4-5 semanas** | —            |

---

## ✅ CHECKLIST DE INÍCIO

- [ ] Leu `docs/PLAN.md` inteiro
- [ ] Leu CLAUDE.md (diretrizes)
- [ ] Verificou git status (limpo em development)
- [ ] Confirmou: `npm run type-check` em React (SEM ERROS)
- [ ] Confirmou: `npm run type-check` em Vue (SEM ERROS)
- [ ] Pronto para Bloco A/Tarefa A3 (remover TeacherCoursePage React)
