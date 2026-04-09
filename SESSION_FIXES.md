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
