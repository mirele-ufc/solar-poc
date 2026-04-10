# Relatório Comparativo Final — React vs Vue PoC

> Análise completa de paridade funcional, performance, segurança e qualidade de código.
> Branch: `feature/refactor-pocs-equivalence`

---

## 1. Paridade Funcional

| Feature                  | React   | Vue     | Status   |
| ------------------------ | ------- | ------- | -------- |
| Auth (mock login/logout) | ✅      | ✅      | 100%     |
| Courses CRUD             | ✅      | ✅      | 100%     |
| Modules CRUD             | ✅      | ✅      | 100%     |
| Lessons + File Upload    | ✅      | ✅      | 100%     |
| Quizzes (create + take)  | ✅      | ✅      | 100%     |
| Admin Features           | ✅      | ✅      | 100%     |
| Course Detail (dynamic)  | ✅      | ✅      | 100%     |
| Enrollment Flow          | ✅      | ✅      | 100%     |
| Protected Routes         | ✅      | ✅      | 100%     |
| **Total**                | **9/9** | **9/9** | **100%** |

---

## 2. Performance Metrics

| Métrica             | React                     | Vue              | Vencedor        |
| ------------------- | ------------------------- | ---------------- | --------------- |
| Bundle JS (gzip)    | ~225 KB (29 chunks)       | ~163 KB          | **Vue** (-28%)  |
| Bundle CSS (gzip)   | ~10 KB                    | ~10 KB           | Empate          |
| Total gzip          | ~235 KB                   | ~173 KB          | **Vue** (-26%)  |
| Initial load (gzip) | ~127 KB (core + app)      | ~61 KB (core)    | **Vue** (-52%)  |
| Code-split por rota | ✅ React.lazy() + Suspense | ✅ Vue Router     | Empate          |
| Maior chunk single  | 118 KB (vendor)           | 45 KB            | **Vue**         |
| Build time          | 4.1s                      | 5.7s             | **React**       |
| Chunks lazy-loaded  | 27 route chunks           | ~20 view chunks  | Comparável      |

### Análise

- Ambas PoCs agora usam code-splitting por rota
- React usa `React.lazy()` + `Suspense` com SuspenseWrapper para 15 rotas
- Vue usa code-splitting automático via Vue Router
- React otimizado: remoção de 48 deps mortas, 46 componentes Shadcn UI não-usados, recharts (905 KB) substituído por DonutChart SVG (~2 KB)
- Bundle React reduziu de 318 KB (monolítico) → 235 KB (total) / 127 KB (initial load)
- Vue mantém vantagem em initial load (61 KB vs 127 KB) por vendor bundle menor

---

## 3. Segurança (OWASP Core)

| Teste                                | React                      | Vue                             | Cobertura       |
| ------------------------------------ | -------------------------- | ------------------------------- | --------------- |
| **XSS Prevention**                   | ✅ JSX escape + DOMPurify  | ✅ Template escape + DOMPurify  | 100%            |
| **v-html / dangerouslySetInnerHTML** | ✅ dangerouslySetInnerHTML com sanitize.ts | ✅ v-html com sanitize.ts | 100%  |
| **CSP Headers**                      | ✅ Meta tag adicionada     | ✅ Meta tag adicionada          | 100%            |
| **CSRF (X-Requested-With)**          | ✅ Header adicionado       | ✅ Header adicionado            | Parcial\*       |
| **Session Timeout (30min)**          | ✅ useSessionTimeout hook  | ✅ useSessionTimeout composable | 100%            |
| **Token Storage**                    | ⚠️ localStorage            | ⚠️ localStorage                 | Documentado\*\* |
| **Token Refresh Flow**               | ✅ 401 → retry com refresh | ✅ 401 → retry com refresh      | 100%            |
| **Input Validation (Zod)**           | ✅ Schemas tipados         | ✅ Schemas tipados              | 100%            |
| **File Validation (Magic Bytes)**    | ✅ Tripla validação        | ✅ Tripla validação             | 100%            |
| **Logout Cleanup**                   | ✅ Clear state + storage   | ✅ Clear state + storage        | 100%            |

\* CSRF full requer backend com token validation (SameSite cookie + CSRF token)
\*\* localStorage é vulnerável a XSS; em produção, usar HttpOnly cookies

### Diferenças Notáveis

| Aspecto             | React                                                    | Vue                                                                  |
| ------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| Sanitização HTML    | DOMPurify com ALLOWED_TAGS whitelist (sanitize.ts)       | DOMPurify com ALLOWED_TAGS whitelist (sanitize.ts)                   |
| Refresh token Axios | Mesma instância com `_retry` flag                        | Instância separada `apiClientRefresh` (mais seguro — evita recursão) |
| File validation     | Magic bytes (portado de Vue)                             | Magic bytes (implementação original)                                 |
| Code-splitting      | React.lazy() + Suspense (manual)                         | Vue Router automático                                                |

---

## 4. Qualidade de Código

| Aspecto                    | React                            | Vue                                            | Status      |
| -------------------------- | -------------------------------- | ---------------------------------------------- | ----------- |
| Zero `any` em TypeScript   | ✅                               | ✅                                             | PASS        |
| TypeScript strict mode     | ✅                               | ✅                                             | PASS        |
| Zod schemas normalizados   | ✅ `loginFormSchema`             | ✅ `loginFormSchema`                           | PASS        |
| Slots Pattern              | ✅ Nativo (children/composition) | ✅ Named slots (`#header`, `#body`, `#footer`) | PASS        |
| State management           | Zustand (stores por domínio)     | Pinia (stores por domínio)                     | Equivalente |
| HTTP interceptor parity    | ✅ 95%                           | ✅ 95%                                         | PASS        |
| Dead code (unused imports) | 0 (src), 3 (tests)               | 0                                              | PASS        |
| Lint warnings              | 0                                | 0                                              | PASS        |

---

## 5. Arquitetura HTTP/Auth — Paridade

| Aspecto           | React                                  | Vue                                    |
| ----------------- | -------------------------------------- | -------------------------------------- |
| Base URL          | `VITE_API_URL \|\| localhost:8080`     | `VITE_API_URL \|\| localhost:8080`     |
| Timeout           | 10s                                    | 10s                                    |
| Auth header       | `Bearer ${token}`                      | `Bearer ${token}`                      |
| CSRF header       | `X-Requested-With: XMLHttpRequest`     | `X-Requested-With: XMLHttpRequest`     |
| Content-Type auto | JSON para POST/PUT, auto para FormData | JSON para POST/PUT, auto para FormData |
| 401 handling      | Refresh → retry → logout               | Refresh → retry → logout               |
| 403 handling      | Toast "sem permissão"                  | Toast "sem permissão"                  |
| 409 handling      | Toast com mensagem do backend          | Toast com mensagem do backend          |
| 422 handling      | Toast "dados inválidos"                | Toast "dados inválidos"                |
| 500+ handling     | Toast "erro no servidor"               | Toast "erro no servidor"               |
| Network error     | Toast com URL da API                   | Toast com URL da API                   |

**Paridade: 95%** — Única diferença: Vue usa `apiClientRefresh` separado para evitar loop de interceptors.

---

## 6. Métricas de Desenvolvimento

| Métrica                  | React  | Vue    |
| ------------------------ | ------ | ------ |
| Linhas de código (src/)  | ~4,500 | ~5,200 |
| Componentes              | ~25    | ~30    |
| Páginas/Views            | 14     | 14     |
| Services                 | 5      | 5      |
| Stores                   | 3      | 4      |
| Custom hooks/composables | 3      | 3      |
| Validation schemas       | 5      | 5      |

---

## 7. Prós e Contras

### React

**Prós:**

- Ecossistema maior e mais maduro
- Zustand é leve e intuitivo
- JSX oferece escape XSS automático sem configuração
- Maior pool de desenvolvedores no mercado
- React DevTools mais maduro

**Contras:**

- ⚠️ Code-splitting requer `React.lazy()` manual (implementado)
- ⚠️ Vendor bundle ainda maior que Vue (118 KB vs 45 KB gzip)
- ❌ Routing mais verboso (createBrowserRouter)

### Vue

**Prós:**

- ✅ Code-splitting automático via Vue Router (zero configuração)
- ✅ Bundle 26% menor que React
- ✅ Initial load 52% menor (61 KB vs 127 KB)
- ✅ DOMPurify integrado para sanitização HTML (React agora também possui)
- ✅ SFC (.vue) encapsula template + script + style naturalmente
- ✅ Composables são idiomáticos e testáveis
- ✅ Refresh token com instância separada (mais robusto)

**Contras:**

- Ecossistema menor que React
- vue-tsc mais lento que tsc para type-checking
- Pool de desenvolvedores menor
- Template syntax pode ser limitante para lógica complexa

---

## 8. Recomendação Final

### Para esta PoC específica: **Vue** 🏆

**Justificativa técnica:**

1. **Performance:** Vue ainda lidera em initial load (-52%) e bundle total (-26%), mas o gap reduziu significativamente. React agora tem code-splitting completo com React.lazy() + Suspense. Build time React é mais rápido (4.1s vs 5.7s).

2. **Segurança:** Paridade completa — ambas usam DOMPurify com ALLOWED_TAGS para sanitização de conteúdo gerado por IA, mesma cobertura OWASP. Vue tem vantagem marginal no refresh token (instância Axios separada).

3. **Paridade funcional:** 100% equivalente — ambas PoCs implementam todas as features com a mesma qualidade, incluindo renderização formatada de conteúdo de aula gerado por IA.

4. **Qualidade de código:** Ambas passam em zero-any, Zod normalization, Slots Pattern. Vue ganha em encapsulamento natural via SFC. React teve limpeza significativa (46 componentes e 48 deps mortas removidas).

5. **Manutenção:** Vue Composition API (composables) é tão ou mais expressiva que React hooks, com lifecycle hooks mais explícitos (`onMounted`, `onUnmounted`).

### Ressalva

Se a equipe tiver maior experiência com React, o custo de migração e a curva de aprendizado podem superar as vantagens técnicas do Vue. A decisão final deve considerar:

- Perfil técnico da equipe
- Integração com ferramentas existentes (CI/CD, testing, monitoring)
- Roadmap de longo prazo (SSR? React Server Components? Nuxt?)
- Disponibilidade de talento no mercado local

---

## 9. Resumo Executivo

| Critério                  | React              | Vue             | Peso  |
| ------------------------- | ------------------ | --------------- | ----- |
| Paridade Funcional        | 100%               | 100%            | —     |
| Bundle Size               | ✅ 235 KB           | ✅ 173 KB       | Alto  |
| Initial Load              | ⚠️ 127 KB           | ✅ 61 KB        | Alto  |
| Code-splitting            | ✅ React.lazy()     | ✅ Automático   | Alto  |
| XSS Prevention            | ✅ JSX + DOMPurify | ✅ Template + DOMPurify | Médio |
| CSRF Mitigation           | ✅                 | ✅              | Médio |
| Auth Hardening            | ✅                 | ✅              | Médio |
| Input Validation          | ✅                 | ✅              | Médio |
| TypeScript Strict         | ✅                 | ✅              | Médio |
| Zero `any`                | ✅                 | ✅              | Médio |
| Slots Pattern             | ✅                 | ✅              | Baixo |
| DX (Developer Experience) | ✅                 | ✅              | Baixo |
| **Score Final**           | **8.5/10**         | **9/10**        | —     |

**Recomendação: Vue** — ligeiramente superior em performance (initial load 52% menor), equivalente em segurança, funcionalidade e qualidade. Gap reduziu significativamente após otimização do React.
