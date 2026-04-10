# 🔧 SESSÃO ATUAL (09/04/2026 — 15:05:00Z) — Correções de Integração

## ✅ FIX: Login Persistência em React + FormData em Vue

### Problema 1 — React: Login não estava persistindo

- **Raiz do problema:** Vue salvava em localStorage (saveAuthToStorage/loadAuthFromStorage)
  - React perdia sessão ao recarregar página (apenas em memória com Zustand)

- **Solução implementada:**
  - Adicionar `loadAuthFromStorage()`: Restaura sessão em useAuthStore boot
  - Adicionar `saveAuthToStorage()`: Persiste ao fazer login/updateCurrentUser
  - Atualizar `logout()`: Limpa localStorage
  - **Arquivos:** `src/store/useAuthStore.ts`

- **Validação:** ✅ React 260/260 tests PASS

### Problema 2 — Vue: Erro 500 ao criar curso

- **Raiz do problema:** FormData multipart mal formatado

  ```
  ❌ ANTES: formData.append('dados', jsonString) → servidor recebe como string
  ✅ DEPOIS: formData.append('dados', new Blob([jsonString], {type: 'application/json'}))
  ```

  - React já estava enviando corretamente com Blob
  - Vue enviava como string simples

- **Solução implementada:**
  - Atualizar `courseService.createCourse()` em Vue
  - Enviar `dados` como Blob com `type: "application/json"`
  - **Arquivos:** `src/services/api/courseService.ts`

- **Validação:** ✅ Vue 162/162 tests PASS

## Commit

- **Hash:** c11535e
- **Mensagem:** "fix: Adicionar persistência de login em React + corrigir FormData em Vue"
- **Stats:** 2 files changed, 162 insertions(+), 103 deletions(-)

## Status Atual

- **React:** Login persiste ao recarregar ✅
- **Vue:** Criar curso funciona sem 500 ✅
- **Equivalência:** 100% — ambos salvam login e enviam FormData identicamente
- **Próximo:** Continuar com F3 (Clean Code Audit)

---

## 🔍 AUDITORIA COMPLETA DE SERVICES

Após encontrar o erro de FormData em courseService, foi feita auditoria em **todos os services** da aplicação Vue.

**Resultado:** 3 arquivos com o mesmo erro encontrados e corrigidos:

### Erros Encontrados

| Service          | Função             | Erro                 | Solução       | Status                         |
| ---------------- | ------------------ | -------------------- | ------------- | ------------------------------ |
| courseService.ts | createCourse       | String JSON          | new Blob(...) | ✅ CORRIGIDO (commit anterior) |
| moduleService.ts | createModule       | String JSON          | new Blob(...) | ✅ CORRIGIDO (novo commit)     |
| lessonService.ts | createLesson       | String JSON (2x)     | new Blob(...) | ✅ CORRIGIDO (novo commit)     |
| authService.ts   | uploadProfilePhoto | OK (arquivo simples) | —             | ✅ OK                          |
| quizService.ts   | todos              | OK (sem FormData)    | —             | ✅ OK                          |
| api.ts           | —                  | OK                   | —             | ✅ OK                          |

### Padrão Correto (Aplicado)

```typescript
// ❌ ANTES (Vue)
formData.append("dados", JSON.stringify(payload));

// ✅ DEPOIS (React + Vue agora)
formData.append(
  "dados",
  new Blob([JSON.stringify(payload)], { type: "application/json" }),
);
```

### Validações Finais

- **Vue type-check:** ✅ ZERO ERRORS
- **Vue tests:** ✅ 162/162 PASS
- **React type-check:** ✅ (sem mudanças)

### Commits Relacionados

1. **c11535e** — fix: Persistência login React + FormData courseService Vue
2. **[novo]** — fix: FormData em moduleService + lessonService (Vue)

---

# 🔧 SESSÃO 10/04/2026 — Otimização de Bundle, Limpeza e Bug Fixes

## ✅ REFACTOR: Otimizar bundle React — lazy-loading, dead code, recharts

### Problema

- Bundle React era monolítico (1,041 KB raw / 300 KB gzip) sem code-splitting
- 46 componentes Shadcn UI importados mas nunca usados
- 48 dependências mortas no package.json (MUI, Emotion, 26 Radix, recharts, etc.)
- recharts pesava 905 KB raw para um único gráfico donut

### Solução implementada

1. **Code-splitting:** `React.lazy()` + `Suspense` com `SuspenseWrapper` para 15 rotas em `routes.tsx`
2. **Dead code:** Removidos 46 componentes Shadcn UI (mantidos: card.tsx, modal.tsx, utils.ts)
3. **Deps mortas:** Removidas 48 dependências do `package.json` (net -153 packages no lockfile)
4. **recharts → DonutChart:** Substituído recharts (905 KB) por `DonutChart.tsx` — componente SVG leve (~2 KB) com hover tooltip
5. **Arquivos:** `routes.tsx`, `package.json`, `ManageCoursePage.tsx`, `DonutChart.tsx` (novo), 46 arquivos deletados

### Resultado

- **Antes:** 1,041 KB raw / 300 KB gzip (bundle único)
- **Depois:** ~703 KB raw / ~225 KB gzip (29 chunks) — initial load ~127 KB gzip
- **Build time:** 7.8s → 4.1s
- **Commit:** `a74cab1`

---

## ✅ CHORE: Limpar dead code e corrigir dependências na PoC Vue

### Problema

- 12 arquivos de dead code: componentes, ícones, assets template
- `lucide-vue-next` usado em ExamResultView mas não declarado no `package.json` (phantom dep)
- IconCheck.vue e IconClose.vue redundantes (existem no lucide-vue-next)

### Solução implementada

1. **Removidos 12 arquivos:** Card.vue, PasswordField.vue, ReadonlyField.vue, HelloWorld.vue, IconCheck.vue, IconClose.vue, IconCross.vue, hero.png, vite.svg, vue.svg, svg duplicado, diretório icons/
2. **Adicionado:** `lucide-vue-next` como dependência explícita
3. **Migrado:** Imports em `ExamResultView.vue` de ícones locais para `lucide-vue-next` (`Check as IconCheck`, `X as IconClose`)
4. **Restaurado:** `Modal.vue` que foi deletado acidentalmente (usado por ExamView.vue)

### Validação

- **Vue build:** ✅ PASS
- **Vue type-check:** ✅ ZERO ERRORS
- **Commit:** `7f06b7e`

---

## ✅ FIX: Corrigir persistência de estado na criação de curso e validação de prova

### Problema 1 — React: Estado stale ao criar curso

- `useCreationStore` persistia dados no localStorage via Zustand persist
- Ao navegar para "Criar Curso", formulário carregava dados de um curso anterior
- `useForm` inicializava com `defaultValues` do localStorage

### Solução

- Adicionado `useLocation` para detectar entrada fresca vs retorno com draft
- `clearAllCreationData()` chamado ao entrar sem `location.state?.preserveDraft`
- Flag `isFreshEntry` controla defaults do formulário (null em entrada fresca)
- **Arquivo:** `CreateCoursePage.tsx`

### Problema 2 — React: Erro ao enviar prova com IA

- `mapQuestionsToBackendQuizPayload()` podia produzir alternativas vazias
- Nenhuma alternativa era marcada como correta quando `isCorrect` não matchava

### Solução

- Validação pré-envio: cada pergunta deve ter ≥2 alternativas preenchidas
- Fallback: se nenhuma alternativa marcada como correta, marca a primeira
- **Arquivo:** `CreateExamPage.tsx`

### Validação

- **React build:** ✅ PASS
- **React type-check:** ✅ ZERO ERRORS
- **Commit:** `fd51c1e`

---

## ✅ FEAT: Renderizar conteúdo de aula gerado por IA como HTML formatado

### Problema

- Vue renderiza conteúdo de aula gerado por IA com formatação (via `v-html` + DOMPurify)
- React mostrava o HTML cru em um `<textarea readOnly>` — sem formatação visual

### Solução implementada

1. **Criado** `src/utils/sanitize.ts` — wrapper DOMPurify com mesma config da PoC Vue (ALLOWED_TAGS: b, i, em, strong, p, br, ul, li, h1, h2, h3)
2. **Substituído** `<textarea value={generatedContent} readOnly>` por `<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(generatedContent) }}>` com classes prose para formatação
3. **Adicionado** `dompurify` ao `package.json` do React
4. **Arquivos:** `CreateModulesPage.tsx`, `sanitize.ts` (novo)

### Validação

- **React build:** ✅ PASS (chunk CreateModulesPage 23→46 KB por DOMPurify, lazy-loaded)
- **Paridade Vue/React:** ✅ Ambas renderizam HTML formatado com sanitização idêntica
- **Commit:** `f124613`

---

## Commits desta sessão

| Hash      | Tipo     | Descrição                                                            |
| --------- | -------- | -------------------------------------------------------------------- |
| `a74cab1` | refactor | Otimizar bundle React — lazy-loading, remover dead code, recharts    |
| `7f06b7e` | chore    | Limpar dead code e corrigir dependências na PoC Vue                  |
| `fd51c1e` | fix      | Corrigir persistência de estado na criação de curso e validação      |
| `f124613` | feat     | Renderizar conteúdo de aula gerado por IA como HTML formatado        |
