## 🎯 Plan Revisado (10/04/2026): Validação de PoC + OWASP + Performance Avançada

**TL;DR:** Fase 1 (~1 semana): 100% equivalência funcional (React ↔ Vue) + code quality. Fase 2 (~3-4 dias): OWASP Security enhancements + Performance avançada (Stress, Memory Leaks, Boot) + Tutoriais locais (sem CI/CD obrigatório). **Removido:** Bloco E (testes de cobertura unit/integration); Foco: Qualidade feita (análise) over quantity (numbers).

---

## 📋 Steps

### **FASE 1: Alinhamento de PoC (100% Equivalência)**

#### **Bloco A: Remoção de Escopo** _(Paralelo em React + Vue)_

1. Remover rotas não-essenciais: ForgotPassword, ResetPassword, Profile, Messages
   - React: 8 páginas + testes → delete
   - Vue: 8 views + rotas → delete
   - Ambas: atualizar routes.tsx/router.ts
   - _Dependência:_ nenhuma (independente)

#### **Bloco B: Eliminar Duplicação Python/Power-BI** _(Sequencial)_

2. **React:** Criar `CourseFlow` parametrizado (recebe `courseId` via route params)
   - Padrão: `<Route path="/courses/:courseId/..." element={<CourseFlowWrapper />} />`
   - CourseFlowWrapper renderiza dinamicamente (CourseDetail, ExamInstructions, etc)
   - Remover: CourseDetailPage + PythonDetailPage (mover lógica para `<CourseDetail courseId={id} />`)
   - Testes: verificar com courseId=1 (Power-BI) e courseId=2 (Python)
   - _Commit exemplo:_ `refactor: Parametrizar CourseFlow com courseId — remove duplicação Python`
3. **Vue:** Mesma abordagem com composable + route params
   - Padrão: `/courses/:courseId/details`, `/courses/:courseId/exam` (dinâmica)
   - Remover: CourseDetailsView + PythonDetailsView
   - Usar composable `useCourseFlow(courseId)` para orquestar
   - _Dependência:_ Bloco B/2 completo (React primeiro, Vue espelha padrão)
   - _Commit exemplo:_ `refactor: Parametrizar CourseFlow com route params — Vue`

#### **Bloco C: Equivalência HTTP/Auth Simétrica** _(Paralelo com alguns passos sequenciais)_

4. **React:** Validar axios interceptor (JWT + refresh token)
   - Localizar: api.ts (já existe)
   - Verificar: interceptador trata 401, retry com refresh token, redireciona login se fail
   - Adicionar: interceptador também trata 500+ como erro global
   - Testes: mock 401 → deve fazer refresh → retry original request
   - _Commit:_ `refactor: Validar e melhorar interceptador Axios no React`

5. **Vue:** Implementar interceptador HTTP (vue atualmente usa fetch nativo)
   - Opção A: Migrar fetch → Axios + interceptador (mais simples)
   - Opção B: Wrapper de fetch com interceptador (menos dependência)
   - **Recomendação:** Opção A (Axios) para paridade com React
   - Implementar em api.ts (criar se não existe)
   - Padrão idêntico ao React: JWT, refresh token, 401 handling
   - Testes: idem React
   - _Dependência:_ Bloco C/4 completo (React primeiro)
   - _Commit:_ `refactor: Implementar interceptador Axios no Vue com parity com React`

6. **Ambas:** Validar login mock quando backend sem autenticação
   - Investigar: .backend tem endpoint `/auth/login` real?
   - Se SIM: usar endpoint real, ambas chamam POST /auth/login
   - Se NÃO: implementar mock que simula JWT (para testes locais)
   - **Caso Atual:** Backend não tem autenticação (confirmado)
   - Ação: Ambas PoC mockam login, mas estrutura deve permitir swap real depois
   - _Idem tanto React quanto Vue_
   - _Commit:_ `test: Mock login com JWT simulado (preparar para auth real em Fase 2)`

#### **Bloco D: Validações Zod — Consistência** _(Paralelo)_

7. **React:** Normalizar naming Zod schemas
   - Padrão: `{Entity}{Operation}RequestSchema` + `{Entity}{Operation}ResponseSchema`
   - Exemplo: `CourseCreateRequestSchema`, `CourseCreateResponseSchema`, `CourseUpdateRequestSchema`
   - Atualizar: validations/ (renomear tudo)
   - Testes: verificar que schemas validam dados corretos/inválidos
   - _Commit:_ `refactor: Normalizar naming Zod schemas — React`

8. **Vue:** Integrar vee-validate completamente + normalizar Zod
   - Padrão: `<Form as="form" @submit="onSubmit" :validation-schema="courseCreateSchema">`
   - Localizar: componentes que still usam manual validation (ex: useLogin.ts)
   - Migrar: manual → vee-validate com Zod resolver
   - Normalizar naming: idêntico ao React
   - Testes: idem React
   - _Commit:_ `refactor: Integrar vee-validate + normalizar schemas Zod — Vue`

#### **Bloco F: Code Quality — Zero `any` + Slots Pattern** _(Paralelo)_

16. **React:** TypeScript strict — zero `any`
    - Buscar: grep `any` em LoginPage.tsx e similares
    - Substituir: `any` → `Type | undefined` (union type apropriado)
    - Verificar: `npm run type-check` sem erros
    - _Commit:_ `refactor: Replace any com proper TypeScript types — React`

17. **Vue:** TypeScript strict — zero `any`
    - Idem React
    - _Commit:_ `refactor: Replace any com proper TypeScript types — Vue`

18. **Componentes Reutilizáveis — Slots Pattern** _(Paralelo, React + Vue)_
    - React:
      - Exemplo: `<Card>`: mudar de `<Card title={} body={} />` → `<Card><Card.Header><Card.Title>...</Card.Title></Card.Header><Card.Body>...</Card.Body></Card>`
      - Aplicar em: FormContainer, PageHeader, CourseCard (se aplicável)
      - Benefício: composição explícita, sem muitas props
      - Verificar que composição ainda funciona
    - Vue:
      - Idem com `<template #header>`, `<template #body>` em vez de props
      - Aplicar em: mesmos componentes
    - _Commit:_ `refactor: Implementar Slots Pattern em componentes reutilizáveis`

#### **Verificação Final Fase 1** _(Checklist)_

19. Ambas PoC:
    - [ ] `npm run build` sem erros
    - [ ] `npm run type-check` sem erros (zero `any`)
    - [ ] `npm run lint` sem warnings
    - [ ] Funcionalidades: Auth (mock), Courses, Modules, Lessons, Quizzes completas
    - [ ] Rotas: apenas Auth, Courses, Modules, Lessons, Quizzes
    - [ ] HTTP: ambas fazem requests com interceptador + tratamento centralizado de erros
    - [ ] Estrutura: CourseFlow parametrizado (sem Python/Power-BI duplicação)
    - _Commit:_ `chore: Validação final Fase 1 — equivalência 100% ✅`

---

### **FASE 2: OWASP Security + Advanced Performance Analysis**

#### **Parte A: OWASP Security Enhancements** _(~11h / Semana 2)_

20. **XSS Prevention Hardening**
    - Implementado em cherry-pick 319f857: `sanitize.ts` + DOMPurify ✅
    - **Adicionar:**
      - Content Security Policy (CSP) headers configuração
      - Script nonce geração
      - Validação real-time de user-input
    - **Testes Manual:** Injetar `<script>alert()</script>` em course.name → deve escapar
    - _Commit:_ `refactor: Harden XSS prevention — CSP + nonce + real-time validation`

21. **CSRF Protection**
    - **Validar:** Backend gera CSRF token em requests iniciais?
    - **Se SIM:** Implementar em ambos interceptadores HTTP (adicionar `X-CSRF-Token` header)
    - **Se NÃO:** Documentar limitação + sugerir ao backend
    - **Teste:** Mock ataque sem token → esperar 403 Forbidden
    - _Commit:_ `feat: Implement CSRF token flow — both PoCs (manual test guide)`

22. **Authentication Hardening**
    - JWT: validação de assinatura ✅ (já existe)
    - Refresh Token: rotação automática em interceptador
    - Session timeout: 30min com redirecimento para login
    - Logout: limpar tokens + redirecionar para /login
    - **Manual Test:** Login → esperar 30min → nova requisição → refresh automático ✅
    - _Commit:_ `refactor: Authentication hardening — session timeout + auto-refresh`

23. **Input Validation Hardening**
    - Zod schemas já existem ✅
    - **Adicionar:**
      - Validação de file type com magic bytes ✅ (em cherry-pick f8bd044)
      - Tamanho máximo enforced (5MB images, 50MB videos)
      - Caracteres especiais escapados
    - _Commit:_ `refactor: Input validation hardening — magic bytes + size limits`

#### **Parte B: Advanced Performance Analysis** _(~11h / Semana 2)_

24. **Stress Testing — Rendering Performance** _(NOVO)_
    - **Objetivo:** Testar comportamento com alto volume de dados
    - **Teste 1:** Renderizar 1000+ items em CourseGrid/ModulesList
      - Métrica: FPS mantém ≥30 FPS?
      - Métrica: Tempo de render < 2s?
    - **Teste 2:** Interação rápida (typing rápido, scrolling rápido)
      - Métrica: Input responsiveness < 100ms
    - **Tools:** Chrome DevTools Performance tab + React/Vue Profiler
    - **Tutorial Local:** Step-by-step como abrir DevTools, medir FPS em stress
    - _Commit:_ `test: Stress testing — rendering performance (tutorial + manual results)`

25. **Memory Leak Detection** _(NOVO)_
    - **Objetivo:** Identificar vazamento de memória em operações comuns
    - **Teste 1:** Abrir/fechar AddLessonPopup modal 50x → memória cresce infinito?
    - **Teste 2:** Navegar Courses → Modules → Lessons → voltar (50x) → leak?
    - **Teste 3:** Search + filter courses (50+ ciclos) → memória liberada?
    - **Tools:** Chrome DevTools Memory tab, heap snapshots, comparison
    - **Tutorial Local:** Como tirar snapshots, comparar, identificar leaks
    - _Commit:_ `test: Memory leak detection (heap snapshots + tutorial + findings)`

26. **Boot Performance + Code Surface** _(NOVO)_
    - **Objetivo:** Medir tamanho e velocidade de startup
    - **Métrica 1 - Bundle Size:**
      - React gzipped: medir atual vs target ≤200KB
      - Vue gzipped: medir atual vs target ≤180KB
    - **Métrica 2 - Time to Interactive (TTI):**
      - Medir TTI em load inicial
      - Target: < 3s em conexão normal (3G)
    - **Métrica 3 - Dead Code:**
      - Verificar unused imports, unused variables com ESLint
      - Usar `source-map-explorer` para identificar código não-usado no bundle
    - **Tools:** `webpack-bundle-analyzer`, `source-map-explorer`, ESLint, Chrome DevTools
    - **Tutorial Local:** Como rodar bundle analysis end-to-end
    - _Commit:_ `test: Boot performance + code surface analysis (metrics + tutorial)`

#### **Parte C: Lighthouse Baseline** _(~2h / Semana 2)_

27. **Lighthouse Score Baseline**
    - **Configuração:** Rodar manualmente (não CI/CD obrigatório nesta PoC)
    - **Métricas Rastreadas:**
      - Performance: ≥85 (FCP, LCP, CLS, TTI)
      - Accessibility: ≥90
      - Best Practices: ≥90
      - SEO: ≥85
    - **Baseline Report:** Registrar valores atuais para ambas PoCs
    - **Tutorial Local:** Como instalar Lighthouse VS Code extension, rodar manualmente
    - _Commit:_ `test: Lighthouse baseline (scores + tutorial + recommendations)`

#### **Parte D: Relatório Comparativo Final** _(~3h / Fim de Semana 2)_

28. **Comparison Report — React vs Vue**
    - **Tabela 1: Paridade Funcional**
      ```
      | Feature | React | Vue | Status |
      |---------|-------|-----|--------|
      | Auth (mock) | ✅ | ✅ | 100% |
      | Courses CRUD | ✅ | ✅ | 100% |
      | Modules | ✅ | ✅ | 100% |
      | Lessons + Files | ✅ | ✅ | 100% (cherry-picks merged) |
      | Quizzes | ✅ | ✅ | 100% |
      | Admin Features | ✅ | ✅ | 100% |
      ```
    - **Tabela 2: Performance Metrics**
      ```
      | Metric | React | Vue | Winner |
      |--------|-------|-----|--------|
      | Bundle Size (gzip) | XXX KB | YYY KB | — |
      | TTI (Time to Interactive) | XXX ms | YYY ms | — |
      | FPS (Stress Test 1000 items) | XX FPS | YY FPS | — |
      | Memory (clean, no leaks) | ✅/⚠️ | ✅/⚠️ | — |
      ```
    - **Tabela 3: Security (OWASP)**
      ```
      | Test | React | Vue | Coverage |
      |------|-------|-----|----------|
      | XSS Prevention | ✅ | ✅ | 100% |
      | CSRF Protection | ✅/⚠️ | ✅/⚠️ | — |
      | Auth Hardening | ✅ | ✅ | 100% |
      | Input Validation | ✅ | ✅ | 100% |
      ```
    - **Tabela 4: Code Quality**
      ```
      | Aspect | React | Vue | Status |
      |--------|-------|-----|--------|
      | Zero `any` | ✅ | ✅ | PASS |
      | Slots Pattern | ⚠️ | ⚠️ | Partial |
      | Lint Zero Warnings | ✅ | ✅ | PASS |
      ```
    - **Final Recommendation:**
      - Análise qualitativa: qual PoC é melhor para produção?
      - Baseado em: Paridade + Performance + Security + Maintainability
      - Justificativa técnica
    - _Commit:_ `docs: Final comparison report — React vs Vue recommendation`

---

### **📊 Timeline Revisado**

| Fase  | Bloco                         | Duração                | Status            |
| ----- | ----------------------------- | ---------------------- | ----------------- |
| **1** | A (Cleanup)                   | ~2h                    | ✅ DONE           |
| **1** | B (Parametrização CourseFlow) | ~8h                    | 🔄 PRÓXIMO        |
| **1** | C (HTTP Parity)               | ~2h                    | ⏳ This Week      |
| **1** | D (Zod Normalização)          | ~3h                    | ⏳ This Week      |
| **1** | F (Code Quality)              | ~3h                    | ⏳ This Week      |
|       | **Fase 1 Total**              | **~18h / ~1 semana**   | —                 |
| **2** | A (OWASP Hardening)           | ~11h                   | ⏳ Próxima Semana |
| **2** | B (Performance Avançada)      | ~11h                   | ⏳ Próxima Semana |
| **2** | C (Lighthouse)                | ~2h                    | ⏳ Próxima Semana |
| **2** | D (Relatório)                 | ~3h                    | ⏳ Próxima Semana |
|       | **Fase 2 Total**              | **~27h / ~3-4 dias**   | —                 |
|       | **GRAND TOTAL**               | **~45h / ~10-11 dias** | —                 |

---

### **🚀 Próximas Ações (Ordem de Execução)**

#### **Hoje/Amanhã (Bloco B)**

1. Parametrizar CourseFlow React com `courseId` dinâmico
2. Remover CourseDetailPage + PythonDetailPage (consolidar m funcionalidade)
3. Atualizar routes.tsx com padrão dinâmico
4. Espelhar em Vue com composable + route params

#### **Esta Semana (Blocos C-D-F)**

5. Validar HTTP interceptadores (C)
6. Normalizar Zod naming (D)
7. Code quality final + Slots Pattern (F)

#### **Próxima Semana (Fase 2)**

8. OWASP hardening + manual tests
9. Performance stress testing + memory analysis
10. Lighthouse baseline
11. Relatório comparativo final

---

### **📝 Notas Importantes**

- ✅ Removido: Bloco E (testes de cobertura unit/integration)
  - Razão: Foco em qualidade feita (análise), não quantity (números)
  - Cobertura será implícita nas análises de OWASP + performance
- ✅ Adicionado: Tutoriais locais para cada teste avançado
  - Não CI/CD obrigatório (opcional para pipeline futuro)
  - Foco em "como rodar manualmente" e "o que procurar"

- ✅ Cherry-picks já aplicados:
  - `f8bd044`: File uploads + fileValidator ✅
  - `319f857`: XSS protection + sanitize.ts ✅

- ⏳ Próximas ações:
  - Bloco B: CourseFlow parametrizado
  - Branch: feature/refactor-pocs-equivalence (4 commits ahead)
    | Auth | ✅ mock | ✅ mock | 100% |
    | Courses CRUD | ✅ full | ✅ full | 100% |
    | ...
    ```
    - **Tabela 2: Performance**
    ```
    | Métrica               | React | Vue   | Winner |
    | --------------------- | ----- | ----- | ------ |
    | Lighthouse Score      | 88    | 86    | React  |
    | Bundle Size (gzipped) | 198KB | 175KB | Vue    |
    | TTI (Courses page)    | 1.8s  | 1.9s  | React  |
    ```
    - **Tabela 3: Security (OWASP)**
    ```
    | Test           | React   | Vue     | Notes   |
    | -------------- | ------- | ------- | ------- |
    | XSS Prevention | ✅ PASS | ✅ PASS | Both OK |
    | CSRF           | ✅ PASS | ✅ PASS | Both OK |
    | Auth Flow      | ✅ PASS | ✅ PASS | Both OK |
    ```
    - **Tabela 4: Code Quality**
    ```
    | Metric            | React | Vue | Notes          |
    | ----------------- | ----- | --- | -------------- |
    | Test Coverage     | 70%   | 70% | Parity         |
    | TypeScript Errors | 0     | 0   | Zero any       |
    | Duplicated Code   | 0%    | 0%  | Removed Python |
    ```
    - _Commit:_ `docs: Criar relatório comparativo React vs Vue`
    ```

28. **Recomendação final:**
    - Com base nos dados: qual tecnologia escolher?
    - Critérios: Performance, Segurança, Comunidade, Velocidade de desvs, Curva aprendizado
    - Documento: `RECOMENDACAO_TECH.md`
    - _Commit:_ `docs: Recomendação de tecnologia com justificativa`

---

## 📁 Arquivos Relevantes

### React PoC

- App.tsx — rotação de rotas
- routes.tsx — definição de rotas (remover 8 páginas)
- api.ts — Axios interceptador (validar)
- validations/ — renomear Zod schemas
- **tests**/ — aumentar cobertura
- LoginPage.tsx — remover `any`

### Vue PoC

- router/ — definição de rotas (remover 8 views)
- services/api/ — criar interceptador Axios
- store/ — validar Pinia stores
- services/mocks/ — dados de mock
- Nenhum arquivo `__tests__` (criar estrutura)

### Backend (referência)

- .backend/ — 23 endpoints (não modificar neste ciclo)
- Postman collection — documentación de endpoints

### Documentação

- CLAUDE.md — diretrizes do projeto
- REFACTORING_PLAN_GRANULAR_V2.md — contexto anterior

---

## ✅ Verificação

### Pré-execução

- [ ] `git status` limpo em development
- [ ] Backend .backend rodando em http://localhost:8080
- [ ] Node.js ≥18, npm/pnpm ≥7

### Pós-Fase 1

- [ ] Ambas PoC buildam sem erros
- [ ] Ambas PoC têm 70%+ cobertura de testes
- [ ] TypeScript: zero `any`
- [ ] Rotas: apenas Auth, Courses, Modules, Lessons, Quizzes
- [ ] No Python/Power-BI duplicação

### Pós-Fase 2

- [ ] Lighthouse: ambas ≥85 Performance
- [ ] Bundle size: React ≤200KB, Vue ≤180KB (gzipped)
- [ ] OWASP tests: 100% passando (XSS, CSRF, Auth, Input)
- [ ] Relatório comparativo: gerado com recomendação

---

## 🎯 Próximas Ações

**Quando aprovado:**

1. Usuário inicia **Fase 1** (1 semana) → alinhamento de PoCs
2. Usuário → Fase 2 (2 semanas) → testes performance + OWASP
3. Gera relatório e recomendação de tecnologia

**Ou:**

- Se preferir, I posso executar tudo (implementação em vez de planejamento)

**Ou:**

- Mudanças ao plano? Posso re-iterar agora antes de começar.

Aprova para começar a **Fase 1**, ou prefere discussão/ajustes?
