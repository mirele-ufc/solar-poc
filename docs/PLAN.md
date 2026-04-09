## 🎯 Plan: Validar e Planificar Testes de PoC (React vs Vue)

**TL;DR:** Ambas as PoC são ~75% equivalentes atualmente. Necessário: (1) remover 8 páginas fora de escopo; (2) eliminar duplicação Python/Power-BI; (3) implementar interceptador HTTP simétrico em Vue; (4) aumentar cobertura de testes de 13% → 70% em React e 0% → 70% em Vue. Depois: plano de testes de performance (Lighthouse) + OWASP Core (XSS, CSRF, Auth, Input).

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

#### **Bloco E: Testes — Aumentar Cobertura** _(Sequencial, React depois Vue)_

9. **React:** Aumentar cobertura de ~13% → 70%
   - Adicionar testes:
     - Forms: CourseCreateForm, ModuleCreateForm, LessonCreateForm (cada um 3-5 testes)
     - Services: courseService, moduleService, lessonService (mocks de API)
     - Routes: verificar acesso guard, redirecionamento
     - Integration: fluxo completo (login → criar curso → criar módulo → criar aula)
   - Ferramentas: Vitest + React Testing Library (já em uso)
   - Coverage command: `npm run test:coverage` (criar se não existe)
   - Target: ~70% statements, ~60% branches
   - _Commit:_ `test: Adicionar testes de forms, services, routes — React (70% coverage)`

10. **Vue:** Criar testes (atualmente 0%)
    - Adicionar testes (mesmos tipos que React):
      - Stores: useAuthStore, useCourseStore (Pinia mock)
      - Composables: useLogin, useCourses
      - Components: CourseCard, CourseGrid, FormFields
      - Views: CourseListView, CourseCreateView (integração)
    - Ferramentas: Vitest + Vue Test Utils (setup necessário)
    - Target: ~70% (paridade com React após correção)
    - _Dependência:_ Bloco E/9 completo
    - _Commit:_ `test: Criar testes (Vitest + VTU) — Vue (70% coverage)`

#### **Bloco F: Code Quality — Zero `any` + Slots Pattern** _(Paralelo)_

11. **React:** TypeScript strict — zero `any`
    - Buscar: grep `any` em LoginPage.tsx e similares
    - Substituir: `any` → `Type | undefined` (union type apropriado)
    - Testes: `npm run type-check` sem erros
    - _Commit:_ `refactor: Replace any com proper TypeScript types — React`

12. **Vue:** TypeScript strict — zero `any`
    - Idem React
    - _Commit:_ `refactor: Replace any com proper TypeScript types — Vue`

13. **Componentes Reutilizáveis — Slots Pattern** _(Paralelo, React + Vue)_
    - React:
      - Exemplo: `<Card>`: mudar de `<Card title={} body={} />` → `<Card><Card.Header><Card.Title>...</Card.Title></Card.Header><Card.Body>...</Card.Body></Card>`
      - Aplicar em: FormContainer, PageHeader, CourseCard (se aplicável)
      - Benefício: composição explícita, sem muitas props
      - Testes: verificar que composição ainda funciona
    - Vue:
      - Idem com `<template #header>`, `<template #body>` em vez de props
      - Aplicar em: mesmos componentes
    - _Commit:_ `refactor: Implementar Slots Pattern em componentes reutilizáveis`

#### **Verificação Final Fase 1** _(Checklist)_

14. Ambas PoC:
    - [ ] `npm run build` sem erros
    - [ ] `npm run type-check` sem erros (zero `any`)
    - [ ] `npm run lint` sem warnings
    - [ ] `npm run test` — cobertura ≥70%
    - [ ] Funcionalidades: Auth (mock), Courses, Modules, Lessons, Quizzes completas
    - [ ] Rotas: apenas Auth, Courses, Modules, Lessons, Quizzes (Mensagens/Perfil removidas)
    - [ ] HTTP: ambas fazem requests com interceptador + tratamento centralizado de erros
    - [ ] Estrutura: CourseFlow parametrizado (sem Python/Power-BI duplicação)
    - _Commit:_ `chore: Validação final Fase 1 — equivalência 100% ✅`

---

### **FASE 2: Plano de Testes (Performance + OWASP)**

#### **A. Performance Baseline (Lighthouse CI)**

15. **Setup Lighthouse CI**
    - Instalação: `npm install -g @lhci/cli@latest`
    - Config: `lighthouserc.json` (raiz de cada PoC)
    - Métricas:
      - **Performance:** ≥85 (FCP, LCP, CLS, TTI)
      - **Accessibility:** ≥90
      - **Best Practices:** ≥90
      - **SEO:** ≥85
    - _Commit:_ `chore: Setup Lighthouse CI`

16. **Bundle Size Baseline**
    - Ferramentas: `npm run build`, `source-map-explorer`, `webpack-bundle-analyzer`
    - Targets:
      - React (gzipped): ≤200KB
      - Vue (gzipped): ≤180KB
    - Baseline: registrar valores atuais
    - _Commit:_ `docs: Bundle size baseline`

17. **Runtime Performance**
    - Teste: navegação Courses → Modules → Lessons (3 mudanças de rota)
    - Métrica: Time to Interactive (TTI) < 2s em cada rota
    - Teste: criar curso (form pesado) → verificar FID (First Input Delay) < 100ms
    - Ferramentas: Chrome DevTools, Web Vitals API
    - _Commit:_ `test: Add runtime performance tests`

#### **B. OWASP Core Security Testing**

18. **XSS Prevention (Cross-Site Scripting)**
    - **Teste 1:** Injetar `<script>alert('XSS')</script>` em course.name
      - Via API: POST /courses com `title: "<script>alert(...)</script>"`
      - Validar no UI: texto é renderizado escapado (não executa)
      - Esperado: HTML: `&lt;script&gt;...&lt;/script&gt;`
    - **Teste 2:** Injetar `<img src=x onerror="alert('XSS')">` em lesson.contentEditor
      - Validar: conteúdo HTML é sanitizado pelo backend (OWASP HTML Sanitizer)
      - Frontend: React `dangerouslySetInnerHTML` NÃO usado sem sanitização
    - **Teste 3:** Form inputs: verificar que Zod rejeita HTML cru
      - Exemplo: courseCreateSchema deve rejeitar `title: "<body>x</body>"`
    - _Commit:_ `test: OWASP XSS prevention tests`

19. **CSRF Protection (Cross-Site Request Forgery)**
    - **Pré-requisito:** Backend deve gerar CSRF token
      - Confirmar: .backend retorna `X-CSRF-Token` header em GET /courses (ou similar)
      - Se NÃO tem: backend precisa adicionar (fora escopo PoC-testing, apenas documentar)
    - **Teste 1:** Criar CSRF token ao logar, incluir em requisições POST/PUT/DELETE
      - React: axios interceptador adiciona `X-CSRF-Token` header
      - Vue: Axios interceptador (novo) adiciona header
    - **Teste 2:** Mock ataque: POST sem token → esperar 403 Forbidden
    - _Commit:_ `test: OWASP CSRF protection tests`

20. **Autenticação & Sessão**
    - **Teste 1:** JWT refresh token flow
      - Login: recebe access_token (curta validade) + refresh_token (longa)
      - Após 30min: access_token expira
      - Ação: Axios interceptador automaticamente chama POST /auth/refresh
      - Esperado: novo access_token retornado, requisição original é retry
      - Se falha: usuário redirecionado para login
    - **Teste 2:** Logout
      - Ação: clearAuthStore() no Zustand/Pinia
      - Esperado: tokens removidos de localStorage/memory, redirecionado para /login
      - Nota: logout é local (sem endpoint backend, conforme contrato)
    - **Teste 3:** Proteção de rotas
      - Acesso sem token: GET /courses/1/modules → 401 (deve redirecionar)
      - Acesso com token: idem → 200 com dados
    - _Commit:_ `test: OWASP authentication & session tests`

21. **Input Validation (Frontend + Backend)**
    - **Teste 1:** Course name
      - Max 255 caracteres: enviar 300 caracteres → rejeitado
      - Min 3 caracteres: enviar "ab" → rejeitado (Zod + Backend)
      - Caracteres especiais: "Curso <script>" → sanitizado ou rejeitado
    - **Teste 2:** File upload
      - Max 10MB: enviar arquivo > 10MB → rejeitado (Frontend Zod, Backend verificação)
      - Ext válida: .jpg, .png, .pdf apenas
      - MIME check: submit .exe com MIME type falsificado → rejeitado
    - **Teste 3:** CPF/Email (se houver)
      - CPF inválido: "000.000.000-00" → rejeitado
      - Email inválido: "notaemail" → rejeitado
    - **Teste 4:** Lesson content
      - HTML injection: `<iframe src="malicious.com"></iframe>` → sanitizado
    - _Commit:_ `test: OWASP input validation tests`

#### **C. Matriz de Comparação Resultados**

22. **Crear relatório comparativo:**
    - **Tabela 1: Funcionalidade vs Tecnologia**
      ```
      | Feature | React | Vue | Parity |
      |---------|-------|-----|--------|
      | Auth | ✅ mock | ✅ mock | 100% |
      | Courses CRUD | ✅ full | ✅ full | 100% |
      | ...
      ```
    - **Tabela 2: Performance**
      ```
      | Métrica | React | Vue | Winner |
      |---------|-------|-----|--------|
      | Lighthouse Score | 88 | 86 | React |
      | Bundle Size (gzipped) | 198KB | 175KB | Vue |
      | TTI (Courses page) | 1.8s | 1.9s | React |
      ```
    - **Tabela 3: Security (OWASP)**
      ```
      | Test | React | Vue | Notes |
      |------|-------|-----|-------|
      | XSS Prevention | ✅ PASS | ✅ PASS | Both OK |
      | CSRF | ✅ PASS | ✅ PASS | Both OK |
      | Auth Flow | ✅ PASS | ✅ PASS | Both OK |
      ```
    - **Tabela 4: Code Quality**
      ```
      | Metric | React | Vue | Notes |
      |--------|-------|-----|-------|
      | Test Coverage | 70% | 70% | Parity |
      | TypeScript Errors | 0 | 0 | Zero any |
      | Duplicated Code | 0% | 0% | Removed Python |
      ```
    - _Commit:_ `docs: Criar relatório comparativo React vs Vue`

23. **Recomendação final:**
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
