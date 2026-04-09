# Auditoria: Axios Interceptor (React vs Vue)

**Data:** 09/04/2026  
**Status:** ⚠️ DIFERENÇAS ENCONTRADAS (ambas funcionais, mas com padrões diferentes)

---

## ✅ Similaridades (Paridade)

| Aspecto                  | React                            | Vue                              | Status          |
| ------------------------ | -------------------------------- | -------------------------------- | --------------- |
| **Timeout**              | 10s                              | 10s                              | ✅ Idêntico     |
| **BaseURL**              | `VITE_API_URL \| localhost:8080` | `VITE_API_URL \| localhost:8080` | ✅ Idêntico     |
| **Response interceptor** | 401 refresh flow                 | 401 refresh flow                 | ✅ Mesma lógica |
| **HandleSessionExpired** | Logout + redirect                | Logout + redirect                | ✅ Mesma lógica |
| **Error codes tratados** | 403, 409, 422, 500+, ERR_NETWORK | 403, 409, 422, 500+, ERR_NETWORK | ✅ Idêntico     |
| **Request interceptor**  | JWT header + FormData            | JWT header + FormData            | ✅ Idêntico     |
| **Retry logic**          | `_retry` flag prevent loop       | `_retry` flag prevent loop       | ✅ Idêntico     |

---

## ⚠️ Diferenças (Padrões)

### 1. **Chamada de Refresh Token**

**React:**

```typescript
const response = await authService.refreshAccessToken(refreshToken);
```

**Vue:**

```typescript
const response = await axios.post(
  `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/refresh`,
  { refreshToken },
);
```

**Impacto:**

- ❌ Vue hardcoda URL de refresh (viola DRY)
- ✅ React usa abstração de serviço (reusable)
- **Ação:** Normalizar Vue para usar service (como React)

---

### 2. **Acesso ao Store (State Management)**

**React (Zustand):**

```typescript
useAuthStore.getState().token;
useAuthStore.getState().setTokens();
```

**Vue (Pinia):**

```typescript
const authStore = useAuthStore();
authStore.token;
authStore.setTokens();
```

**Impacto:**

- ✅ Ambas corretas (padrão framework)
- ⚠️ Sintaxe diferentes (esperado)

---

### 3. **Extração de Token em Response**

**React:**

```typescript
useAuthStore.getState().setTokens(response.accessToken, refreshToken);
```

**Vue:**

```typescript
const newAccessToken =
  response.data.accessToken || response.data.data?.accessToken;
authStore.setTokens(newAccessToken, refreshToken);
```

**Impacto:**

- ⚠️ Vue tem lógica extra de fallback (`response.data.data?.accessToken`)
- ✅ React assume response flat (`response.accessToken`)
- **Ação:** Verificar doc backend para confirmar formato correto

---

## 🎯 Recomendações (Bloco C)

### Priority 1: Vue — Refatorar Refresh Chamada

```typescript
// ANTES (Vue) - hardcoded
const response = await axios.post(
  `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/refresh`,
  { refreshToken },
);

// DEPOIS (Vue) - usar authService como React
const response = await authService.refreshAccessToken(refreshToken);
```

### Priority 2: Verificar Formato Response Backend

- Confirmar se resposta é `{ accessToken }` (flat, como React assume) ou `{ data: { accessToken } }`
- Vue tem fallback, o que sugere inconsistência

### Priority 3: Criar Testes de Interceptor (Bloco E)

- Ambas: teste de 401 → refresh → retry com sucesso
- Ambas: teste de refresh falha → logout → redirect
- Ambas: teste de outros status codes (403, 500+)

---

## ✅ Verdicts

| Métrica                  | Status  | Notas                                   |
| ------------------------ | ------- | --------------------------------------- |
| **Parity Atual**         | 85% ✅  | Ambas funcionam, mas padrões diferentes |
| **HTTP Error Handling**  | 100% ✅ | Tratamento igual em ambas               |
| **JWT Flow**             | 85% ⚠️  | Vue precisa refatorar refresh chamada   |
| **Pronto para Produção** | 75% ⚠️  | Testar edge cases antes                 |

---

## 📋 TODO (Bloco C)

- [ ] **Vue:** Refatorar `axios.post()` → `authService.refreshAccessToken()`
- [ ] **Ambas:** Confirmar formato response backend (`{ accessToken }` vs `{ data: { accessToken } }`)
- [ ] **Ambas:** Adicionar testes de interceptor (401 refresh, erros, network)
- [ ] **React:** Validar se `response.accessToken` é garantido ou precisa fallback como Vue

---

**Conclusão:** Ambas PoCs têm interceptadores funcionais. Vue precisa refatoração para match pattern React.
