# MEMORY.md — Validação e Alinhamento PoC (React vs Vue)

**Última atualização:** 09/04/2026T21:30:00Z  
**Objetivo:** Validar equivalência React vs Vue, aumentar cobertura de testes ~20% → 70%, auditar OWASP  
**Status geral:** Fase 1 — Blocos A+B+C+D (100%) + E (30% iniciado — E1.1 + E1.2 DONE), Próximo: E1.3  
**Timeline:** 4-5 semanas (Fase 1: 50h + Fase 2: 28h)

---

## 🎯 CONTEXTO

Transição do ciclo anterior (refatoração React com backend integrado) para novo ciclo (validação PoC em paralelo React + Vue). Ambas PoCs têm ~75% funcionalidade equivalente (90% em React, 85% em Vue) mas com graves lacunas em cobertura de testes (~20% vs 70% target).

---

## SECTION: GLOBAL PROGRESS

| Campo        | Valor                                                               |
| ------------ | ------------------------------------------------------------------- | -------- |
| **Fase**     | 1 — Alinhamento de PoC (Blocos A-F)                                 |
| **Bloco**    | E — Aumentar Cobertura Testes (EM PROGRESSO — 30%)                  |
| **Status**   | ✅ A DONE (100%) ✅ B DONE (100%) ✅ C DONE (100%) ✅ D DONE (100%) | 🟡 E 30% |
| **Objetivo** | 100% equivalência React ↔ Vue, 70%+ cobertura                       |
| **Timeline** | Fase 1: 2-3 sem (50h) \| Fase 2: 2 sem (28h)                        |

**Progress (09/04/2026 — 21h30 — E1.1 + E1.2 INICIADOS E COMPLETOS):** ✅✅✅✅🟡

1. ✅ Bloco A: Remoção de escopo (5/5 subtarefas)
2. ✅ Bloco B: Parametrização CourseFlow (5/5 subtarefas) — commits 42ae1fe, c27b917
3. ✅ Bloco C: HTTP/Auth equivalência (5/5 subtarefas, **100% DONE**) — commit 853cf6d
4. ✅ Bloco D: Normalizar Zod Schemas (**100% DONE**) — commits 86a3118, 68d04ed
5. 🟡 Bloco E: Aumentar Cobertura Testes (30% — **E1.1 + E1.2 DONE, próximo: E1.3**) — commit 6049bd9

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

### 🟡 Bloco C: Equivalência HTTP/Auth Simétrica — ✅ 100% COMPLETO

| #   | Tarefa                                          | React | Vue | Status  | Notas                                                                  |
| --- | ----------------------------------------------- | ----- | --- | ------- | ---------------------------------------------------------------------- |
| C1  | Validar Axios interceptor (JWT + refresh token) | ✅    | ✅  | ✅ DONE | Refatorado: authService.ts + api.ts (apiClientRefresh). Commit 853cf6d |
| C2  | Validar tratamento 500+ erros (erro global)     | ✅    | ✅  | ✅ DONE | Ambas tratam: 403, 409, 422, 500+, ERR_NETWORK identicamente           |
| C3  | Validar login mockado (ambas)                   | ✅    | ✅  | ✅ DONE | Backend sem auth real; mocks corretos                                  |
| C4  | Auditar refresh token flow (ambas)              | ✅    | ✅  | ✅ DONE | Ambas usam retry logic com apiClientRefresh. Testes em E               |
| C5  | Type-check ambas (zero `any`)                   | ✅    | ✅  | ✅ DONE | React: type-check ✅. Vue: type-check ✅. 09/04 2026                   |

**Status Bloco C:** ✅ **100% COMPLETO** (C1-C5 todos concluídos)

**Detalhes Implementação C1 (Vue API Refactoring):**

- Criar `src/services/authService.ts` (127 linhas) — idêntico React, centraliza auth logic
- Criar `src/services/types/authService.types.ts` — tipos reutilizáveis (IRegisterPayload, IChangePasswordPayload, IMessageResponse, IRefreshResponse)
- Refatorar `src/services/api.ts`:
  - Adicionar `apiClientRefresh` instance (sem interceptadores) para prevenir recursão em refresh
  - Remover hardcoded URL `axios.post('${VITE_API_URL}/auth/refresh'...)` → usar `apiClientRefresh.post('/auth/refresh'...)`
  - Usar `authService.refreshAccessToken(refreshToken)` abstração no interceptador
- Estender `useAuthStore`:
  - Adicionar `token` e `refreshToken` properties (inicializado como null)
  - Adicionar `setTokens(newToken, newRefreshToken?)` action
  - Atualizar `logout()` para limpar tokens
- Corrigir import: `AxiosError` como valor (não `import type`)
- Exportar ambos `apiClient` e `apiClientRefresh` de api.ts

**Validação C1:**

- Type-check Vue: ✅ (zero erros)
- Type-check React: ✅ (zero erros)
- Paridade HTTP/Auth 100%: ✅ (ambas PoCs agora com arquitetura simétrica)

---

### 🟡 Bloco D: Normalizar Zod Schemas — ✅ 100% COMPLETO

| #   | Tarefa                            | React | Vue | Status  | Notas                                                |
| --- | --------------------------------- | ----- | --- | ------- | ---------------------------------------------------- |
| D1  | Normalizar naming Zod (React)     | ✅    | N/A | ✅ DONE | Commit 86a3118 — 6 renamings, testes atualizados     |
| D2  | Normalizar naming Zod (Vue)       | N/A   | ✅  | ✅ DONE | Commit 68d04ed — 4 schemas novos + sync courseSchema |
| D3  | Sincronizar schemas (Vue ← React) | N/A   | ✅  | ✅ DONE | authSchema, messageSchema, examSchema criados        |
| D4  | Testar validações (ambas)         | ✅    | ✅  | ✅ DONE | Validações refatoradas, type-check ✅                |

**Status Bloco D:** ✅ **100% COMPLETO** (D1-D4 todos concluídos)

**Detalhes Implementação D1-D4 (Normalizar Zod Schemas):**

**Padrão de Nomenclatura (Aplicado a ambas PoCs):**

- API Schemas: `{Entity}{Operation}RequestSchema` (ex: `CourseCreateRequestSchema`, `QuizSubmitRequestSchema`)
- Form Schemas: `{Entity}{Operation}FormSchema` (ex: `RegisterFormSchema`, `EnrollmentFormSchema`)
- Helper Schemas: `{Purpose}Schema` (ex: `imageFileSchema`, `profileImageDimensionSchema`)

**React (D1) — Renamings:**

- `registerSchema` → `registerFormSchema` (authSchema.ts)
- `enrollmentSchema` → `enrollmentFormSchema` (enrollmentSchema.ts)
- `composeMessageSchema` → `messageComposeFormSchema` (messageSchema.ts)
- `createQuestionSchema` → `questionCreateFormSchema` (examSchema.ts)
- `quizSubmitSchema` → `quizSubmitRequestSchema` (examSchema.ts)
- Alias `questionSchema` atualizado para referenciar novo nome

**React (D1) — Usages Atualizadas:**

- EnrollmentPage.tsx, RegisterPage.tsx, CreateExamPage.tsx
- **tests**/unit/validations/schemas.contract.test.ts (5 testes atualizados)

**Vue (D2-D3) — Schemas Criados:**

- `authSchema.ts` (NEW) — loginRequestSchema, registerRequestSchema, registerFormSchema
- `messageSchema.ts` (NEW) — messageComposeFormSchema, sendMessageRequestSchema
- `examSchema.ts` (NEW) — questionCreateFormSchema, quizSubmitRequestSchema, questionSchema
- `courseSchema.ts` (UPDATED) — Adicionado courseCreateRequestSchema, courseUpdateRequestSchema

**Validação Bloco D:**

- React type-check: ✅ PASS
- React build: ✅ PASS (839 modules, 4.20s, 294.98 KB gzip)
- Vue type-check: ✅ PASS (zero novos erros introduzidos)
- Ambas PoCs: 100% equival​ência em naming de schemas

---

### 🔴 Bloco E: Aumentar Cobertura de Testes ← **EM PROGRESSO (CRÍTICO)**

| #         | Tarefa                         | React    | Vue      | Target  | Status                           | Notas                                                          |
| --------- | ------------------------------ | -------- | -------- | ------- | -------------------------------- | -------------------------------------------------------------- |
| E1.1      | registerFormSchema (30 testes) | ✅ DONE  | ✅ DONE  | 30      | ✅ **COMPLETE** (commit 6049bd9) | Cobertura: nome, cpf, email, password, confirmPassword, perfil |
| E1.2      | loginRequestSchema (23 testes) | ✅ DONE  | ✅ DONE  | 23      | ✅ **COMPLETE** (commit 6049bd9) | Cobertura: email/username, senha; 100% passing                 |
| E1.3      | courseCreateRequestSchema      | 🔴 TODO  | 🔴 TODO  | ~20     | 🔴 TODO (PRÓXIMO)                | titulo, descricao, categoria, cargaHoraria                     |
| E1.4      | enrollmentFormSchema           | 🔴 TODO  | 🔴 TODO  | ~15     | 🔴 TODO                          | firstName, lastName, city, gender                              |
| E1.5      | messageComposeFormSchema       | 🔴 TODO  | 🔴 TODO  | ~12     | 🔴 TODO                          | recipient, subject, message                                    |
| E2        | Testes de Services             | ~8%      | ~10%     | 20%     | 🔴 TODO                          | courseService, moduleService, lessonService (mocks)            |
| E3        | Testes de Routes/Components    | ~7%      | ~0%      | 15%     | 🔴 TODO                          | Acesso guard, redirecionamento, integração                     |
| E4        | Coverage Reports CI/CD         | ❌       | ❌       | 15%     | 🔴 TODO                          | Setup `vitest --coverage` em ambas                             |
| E5        | Testes de Integração E2E       | ❌       | ❌       | 10%     | 🔴 TODO                          | Login → Criar curso → Criar módulo → Criar aula                |
| **Total** | **~20% → 70%**                 | **~25%** | **~22%** | **70%** | 🟡 IN_PROGRESS (30% bloco)       | Faltam ~70 testes (E1.3-E5)                                    |

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

### 🟡 Bloco E: Aumentar Cobertura de Testes — EM PROGRESSO (30%)

| #   | Tarefa                                | React   | Vue     | Status  | Notas                                                        |
| --- | ------------------------------------- | ------- | ------- | ------- | ------------------------------------------------------------ |
| E1  | E1.1: registerFormSchema (30)         | ✅ DONE | ✅ DONE | ✅ DONE | Testes: nome, cpf, email, password, confirmPassword, perfil  |
|     | E1.2: loginRequestSchema (23)         | ✅ DONE | ✅ DONE | ✅ DONE | Testes: email/username, senha; 100% passing (commit 6049bd9) |
|     | E1.3: courseCreateRequestSchema (~20) | 🔴 TODO | 🔴 TODO | PRÓXIMO | **PRÓXIMA AÇÃO**                                             |
|     | E1.4: enrollmentFormSchema (~15)      | 🔴 TODO | 🔴 TODO | TODO    |                                                              |
|     | E1.5: messageComposeFormSchema (~12)  | 🔴 TODO | 🔴 TODO | TODO    |                                                              |
| E2  | Testes de Services (mock API)         | 🔴 TODO | 🔴 TODO | TODO    | courseService, moduleService, lessonService (~40-50 testes)  |
| E3  | Testes de Routes/Components           | 🔴 TODO | 🔴 TODO | TODO    | ProtectedRoute, access guards (~20-30 testes)                |
| E4  | Coverage CI/CD setup                  | 🔴 TODO | 🔴 TODO | TODO    | vitest --coverage config + reports                           |
| E5  | E2E Integration Tests                 | 🔴 TODO | 🔴 TODO | TODO    | Login → Cursos → Módulos → Aulas flow (~10-15 testes)        |

**Status Bloco E:** 🟡 **INICIADO — 30% COMPLETO** (E1.1 + E1.2 done, E1.3 próximo)

**Detalhes Implementação E1.1 + E1.2 (COMPLETOS):**

**E1.1 — registerFormSchema.test.ts (30 testes — React + Vue)**

Arquivo: `src/__tests__/unit/validations/registerFormSchema.test.ts`

- **Coverage:** 6 campos (nome, cpf, email, password, confirmPassword, perfil)
- **Test Cases:**
  - Nome field (5 tests): valid, empty, <3 chars, =3 chars, whitespace trim
  - CPF field (6 tests): valid (formatted/unformatted), empty, invalid, partial, trim
  - Email field (5 tests): valid, empty, invalid format, missing @, trim
  - Password field (5 tests): valid, empty, <6 chars, =6 chars, trim
  - Confirm Password (3 tests): mismatch, empty, match
  - Perfil field (3 tests): professor, student, invalid
  - Full payload validation (3 tests): valid parse, missing fields, extra fields
- **Status:** ✅ 30/30 PASS (React), ✅ 30/30 PASS (Vue)
- **Note:** Vue error message fix: "As senhas não conferem" (não "senhas não coincidem")

**E1.2 — loginRequestSchema.test.ts (23 testes — React + Vue)**

Arquivo: `src/__tests__/unit/validations/loginRequestSchema.test.ts`

- **Coverage:** 2 campos (email/username, senha)
- **Test Cases:**
  - Email field (10 tests): valid email, valid username (3-50 chars), empty, space, short/long, subdomain, special chars, numbers
  - Senha field (8 tests): valid, empty, <6 chars, =6 chars, trim, long, special chars, spaces
  - Full payload validation (5 tests): email+senha, username+senha, missing, both invalid, special formats
- **Status:** ✅ 23/23 PASS (React), ✅ 23/23 PASS (Vue)
- **Note:** Fixed regex test: emailOrUsernameRegex allows username (no @ required); replaced invalid "no @" test with "space in email"

**Commit:** 6049bd9 — "test: E1.1 + E1.2 — Expandir testes de validação Zod (53 testes)"

---

## SECTION: NOTAS RECENTES (09/04/2026 — 21h30)

### ✅ Bloco E: E1.1 + E1.2 Testes Zod Completados (DONE)

**Problema Encontrado:** Vue CourseCard.vue estava usando geração local de imagens baseada em pool (COURSE_IMAGES_POOL) em vez de respeitar o `imagePath` do backend. React CoursesPage.tsx respeitava `imagePath` mas retornava FALLBACK quando null.

**Solução Implementada:**

- Vue CourseCard.vue: Remover COURSE_IMAGES_POOL, implementar verificação de props.imagePath
- React CoursesPage.tsx: Sincronizar URL FALLBACK_BANNER (w=1080) com Vue
- Ambas PoCs: Quando backend retorna null/empty imagePath, mostrar FALLBACK_BANNER idêntico
- Suporte para URLs absolutas e relativas (com resolução via apiBaseUrl) em ambas

**Validação:** ✅ type-check ambas = PASS, commit 67dcaaf

**Resultado:** 100% equivalência React ↔ Vue em behavior de thumbnails, bloqueador visual resolvido

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

### 🔴 Bloco E (ATIVO) — Cobertura Testes — 24-30h (MAIOR ESFORÇO)

#### ✅ E1.1 + E1.2 COMPLETOS (commit 6049bd9)

- [x] **E1.1:** registerFormSchema tests (30) — ✅ PASS (React + Vue)
- [x] **E1.2:** loginRequestSchema tests (23) — ✅ PASS (React + Vue)
- [ ] **E1.3:** courseCreateRequestSchema tests (~20) — 🔴 **PRÓXIMO** (FIM DA SESSÃO)
- [ ] **E1.4:** enrollmentFormSchema tests (~15)
- [ ] **E1.5:** messageComposeFormSchema tests (~12)
- [ ] **E2:** Service layer tests (~40-50)
- [ ] **E3:** Routes/Components tests (~20-30)
- [ ] **E4:** Coverage CI/CD setup
- [ ] **E5:** E2E Integration tests (~10-15)

**Próximo passo:** Criar E1.3 (courseCreateRequestSchema tests com titulo, descricao, categoria, cargaHoraria)

### 🟡 Bloco F — Code Quality — 4-6h

- [x] F1: Type-check ✅
- [ ] F2: Slots Pattern expand
- [ ] F3: Naming semântico audit

---

## SECTION: PRÓXIMA AÇÃO (RECOMENDAÇÃO PARA PRÓXIMA SESSÃO)

**OBS: O trabalho de E1.1 + E1.2 foi completado nesta sessão (commit 6049bd9). A próxima ação recomendada é E1.3.**

### 🎯 Próxima Tarefa: E1.3 — courseCreateRequestSchema Tests

**Quando:** Próxima sessão de desenvolvimento

**O que fazer:**

1. **Analisar courseCreateRequestSchema** (ambas PoCs)
   - React: `apps/poc-react-vite/src/validations/courseCreateRequestSchema` (ou onde estiver)
   - Vue: `apps/poc-vue-vite/src/validations/courseCreateRequestSchema` (ou idem)
   - Campos esperados: titulo, descricao, categoria, cargaHoraria (e outros?)

2. **Criar testes idênticos** (React + Vue)
   - Arquivo: `src/__tests__/unit/validations/courseCreateRequestSchema.test.ts`
   - Padrão: 8-10 describe blocks (um por campo)
   - Estimativa: ~20-25 testes por PoC

3. **Test cases sugeridos:**
   - Titulo: valid, empty, <3 chars, =3 chars, >100 chars, trim, special chars
   - Descricao: valid, empty, <10 chars, =10 chars, >500 chars, trim
   - Categoria: valid enum (programming, math, etc.), invalid, empty
   - CargaHoraria: valid number, <0, =0, >1000, string, decimal
   - Full payload validation: all fields, missing fields, extra fields

4. **Validar e comitar:**

   ```bash
   npm run test -- courseCreateRequestSchema.test.ts
   # Confirmar: 20+/20+ PASS (ambas)
   git commit -m "test: E1.3 — courseCreateRequestSchema (20 testes)"
   ```

5. **Próximo após E1.3:** E1.4 (enrollmentFormSchema)

---

## SECTION: REFERÊNCIAS

| Documento                                    | Propósito                                 |
| -------------------------------------------- | ----------------------------------------- |
| [docs/PLAN.md](docs/PLAN.md)                 | Plano completo com 23 etapas (Fase 1 + 2) |
| [CLAUDE.md](CLAUDE.md)                       | Diretrizes arquiteturais e regra de ouro  |
| [apps/poc-react-vite/](apps/poc-react-vite/) | PoC React (17 páginas, ~25% cobertura)    |
| [apps/poc-vue-vite/](apps/poc-vue-vite/)     | PoC Vue (15 views, ~22% cobertura)        |
| [MEMORY.md](MEMORY.md)                       | Este arquivo (status session)             |

---

## SECTION: ESTRUTURA DE BRANCHES

- **main:** Produção (não tocar)
- **development:** Integração contínua
- **feature/refactor-pocs-equivalence:** Branch ativa (Blocos A-F, este ciclo)

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
