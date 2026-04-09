# MEMORY.md — Validação e Alinhamento PoC (React vs Vue)

**Última atualização:** 09/04/2026T10:00:00Z  
**Objetivo:** Validar equivalência React vs Vue, aumentar cobertura de testes ~20% → 70%, auditar OWASP  
**Status geral:** Fase 1 — Bloco A (imediato)  
**Timeline:** 4-5 semanas (Fase 1: 50h + Fase 2: 28h)

---

## 🎯 CONTEXTO

Transição do ciclo anterior (refatoração React com backend integrado) para novo ciclo (validação PoC em paralelo React + Vue). Ambas PoCs têm ~75% funcionalidade equivalente (90% em React, 85% em Vue) mas com graves lacunas em cobertura de testes (~20% vs 70% target).

---

## SECTION: GLOBAL PROGRESS

| Campo        | Valor                                         |
| ------------ | --------------------------------------------- |
| **Fase**     | 1 — Alinhamento de PoC (Blocos A-F)           |
| **Bloco**    | A — Remoção de Escopo (imediato)              |
| **Status**   | 🔴 TODO                                       |
| **Objetivo** | 100% equivalência React ↔ Vue, 70%+ cobertura |
| **Timeline** | Fase 1: 2-3 sem (50h) \| Fase 2: 2 sem (28h)  |

---

## SECTION: FASE 1 — Alinhamento de PoC

### ✅ Bloco A: Remoção de Escopo

| #   | Tarefa                                                         | React | Vue | Status  | Notas                                                    |
| --- | -------------------------------------------------------------- | ----- | --- | ------- | -------------------------------------------------------- |
| A1  | Remover rotas ForgotPassword, ResetPassword, Profile, Messages | ✅    | ✅  | ✅ DONE | Não existem em nenhuma PoC; Escopo já limpo              |
| A2  | Auditar TeacherCoursePage (React orphaned)                     | ⚠️    | N/A | 🔴 TODO | Arquivo existe mas não em routes.tsx; deve remover em A3 |
| A3  | Remover páginas fora de escopo                                 | ⏳    | ✅  | 🔴 TODO | React: remover TeacherCoursePage.tsx + test              |
| A4  | Validar rotas apenas: Auth, Courses, Modules, Lessons, Exams   | ⏳    | ⏳  | 🔴 TODO | Checklist: routes.tsx (React) + router/index.ts (Vue)    |

---

### 🟡 Bloco B: Eliminar Duplicação Python/Power-BI

| #   | Tarefa                                                | React | Vue | Status  | Notas                                                   |
| --- | ----------------------------------------------------- | ----- | --- | ------- | ------------------------------------------------------- |
| B1  | Criar CourseFlow parametrizado com `courseId` (React) | ❌    | N/A | 🔴 TODO | Refatorar CourseDetailPage → dinâmico via route params  |
| B2  | Criar CourseFlow parametrizado com `courseId` (Vue)   | N/A   | ❌  | 🔴 TODO | Refatorar CourseDetailsView → dinâmico via route params |
| B3  | Consolidar provaData.ts + pythonProvaData.ts (React)  | ❌    | ❌  | 🔴 TODO | Unificar em courseConfig.ts com courseId dinâmico       |
| B4  | Consolidar mock data (Vue)                            | N/A   | ❌  | 🔴 TODO | Idem React                                              |
| B5  | Remover PythonDetailPage (se existir)                 | ✅    | ✅  | ✅ DONE | Não encontrado em nenhuma PoC                           |

---

### 🟡 Bloco C: Equivalência HTTP/Auth Simétrica

| #   | Tarefa                                          | React | Vue | Status         | Notas                                          |
| --- | ----------------------------------------------- | ----- | --- | -------------- | ---------------------------------------------- |
| C1  | Validar Axios interceptor (JWT + refresh token) | ✅    | ⏳  | 🟡 IN_PROGRESS | React implementado; Vue precisa validar parity |
| C2  | Validar tratamento 500+ erros (erro global)     | ⏳    | ⏳  | 🔴 TODO        | Ambas devem padronizar                         |
| C3  | Validar login mockado (ambas)                   | ✅    | ✅  | ✅ DONE        | Backend sem auth real; mocks corretos          |
| C4  | Auditar refresh token flow (ambas)              | ⏳    | ⏳  | 🔴 TODO        | Testes de 401 → retry → sucesso                |

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

### 🔴 Imediato (Esta semana - Bloco A)

1. **A2/A3:** Remover `TeacherCoursePage.tsx` (React) — 30 min
   - Delete arquivo e testes
   - Valide que `npm run build` passa

2. **C1:** Auditar Axios interceptor Vue vs React — 1h
   - Comparar tratamento de JWT, refresh, erro 500+
   - Documentar diferenças

3. **Type Check:** Rodar em ambas — 15 min
   ```bash
   cd apps/poc-react-vite && npm run type-check
   cd ../poc-vue-vite && npm run type-check
   ```

### 🟡 Semana 1-2 (Blocos B-F)

4. **Bloco B:** Parametrizar CourseFlow (React + Vue) — 12-16h
5. **Bloco D:** Normalizar Zod naming (ambas) — 4-6h
6. **Bloco E:** Aumentar cobertura (ambas) — 24-30h ← **MAIOR esforço**
7. **Bloco F:** Code quality audit (ambas) — 4-6h

### 🟡 Semana 3-4 (Fase 2)

8. **Fase 2:** Lighthouse + OWASP + Relatório — 28h

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
