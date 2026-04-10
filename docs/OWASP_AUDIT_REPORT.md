# Auditoria OWASP — Resumo de Segurança

> Auditoria realizada contra OWASP Top 10 (2021) para ambas PoCs.
> Foco: XSS (A03), CSRF (A05), Auth (A07), Input Validation (A04), CSP.

---

## 1. XSS Prevention (OWASP A03)

### Estado Atual: ✅ PASS

| Verificação                    | React              | Vue                               |
| ------------------------------ | ------------------ | --------------------------------- |
| Escape automático de templates | ✅ JSX auto-escape | ✅ Template auto-escape           |
| `dangerouslySetInnerHTML`      | ❌ Não usado       | N/A                               |
| `v-html` sem sanitização       | N/A                | ❌ Não existe (usa DOMPurify)     |
| `eval()` / `Function()`        | ❌ Não encontrado  | ❌ Não encontrado                 |
| `innerHTML` direto             | ❌ Não encontrado  | ❌ Não encontrado                 |
| DOMPurify para rich content    | ❌ Não necessário  | ✅ `sanitize.ts` com ALLOWED_TAGS |
| CSP meta tag                   | ✅ Adicionado      | ✅ Adicionado                     |

### Implementação CSP

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' http://localhost:8080;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
"
/>
```

> **Nota:** `'unsafe-inline'` em `script-src` é necessário para compatibilidade com Vite dev server. Em produção, backend deve enviar CSP header sem `'unsafe-inline'` usando nonces.

---

## 2. CSRF Protection (OWASP A05)

### Estado Atual: ⚠️ PARCIAL (limitação de backend)

| Verificação                        | React                       | Vue                         |
| ---------------------------------- | --------------------------- | --------------------------- |
| `X-Requested-With: XMLHttpRequest` | ✅ Adicionado               | ✅ Adicionado               |
| CSRF token em headers              | ❌ Backend não gera         | ❌ Backend não gera         |
| SameSite cookies                   | ❌ Responsabilidade backend | ❌ Responsabilidade backend |

### Mitigação Aplicada

- Header `X-Requested-With: XMLHttpRequest` em todas as requisições
- Backend pode validar este header para rejeitar requests cross-origin simples
- Para proteção completa, backend deve usar `SameSite=Strict` em cookies

### Limitação Documentada

> CSRF full requer cooperação backend: geração de token CSRF + cookie SameSite. O frontend aplica mitigação parcial via header customizado. Esta limitação é aceitável para PoC sem backend ativo.

---

## 3. Authentication Hardening (OWASP A07)

### Estado Atual: ✅ PASS (com ressalvas documentadas)

| Verificação                 | React                         | Vue                               |
| --------------------------- | ----------------------------- | --------------------------------- |
| JWT em Authorization header | ✅ `Bearer ${token}`          | ✅ `Bearer ${token}`              |
| Refresh token flow          | ✅ 401 → refresh → retry      | ✅ 401 → refresh → retry          |
| Session timeout (30min)     | ✅ `useSessionTimeout` hook   | ✅ `useSessionTimeout` composable |
| Logout cleanup              | ✅ Clear state + localStorage | ✅ Clear state + localStorage     |
| Token storage               | ⚠️ localStorage               | ⚠️ localStorage                   |

### Session Timeout — Implementação

- **Timeout:** 30 minutos de inatividade (RN09)
- **Verificação:** A cada 1 minuto
- **Eventos monitorados:** `mousemove`, `keydown`, `click`, `scroll`, `touchstart`
- **Ação:** Logout + redirect para `/`
- **Cleanup:** Remove event listeners no unmount

### Ressalva: localStorage

> Tokens em localStorage são acessíveis via XSS. Em produção, migrar para HttpOnly cookies com `Secure; SameSite=Strict`. Para esta PoC sem backend real, localStorage é aceitável e a limitação está documentada.

---

## 4. Input Validation (OWASP A04)

### Estado Atual: ✅ PASS

| Verificação             | React                              | Vue                                |
| ----------------------- | ---------------------------------- | ---------------------------------- |
| Zod schemas para auth   | ✅ loginFormSchema, registerSchema | ✅ loginFormSchema, registerSchema |
| CPF validation (regex)  | ✅                                 | ✅                                 |
| Email validation        | ✅                                 | ✅                                 |
| Password min length (6) | ✅                                 | ✅                                 |
| File size limits        | ✅ 5MB (images/docs), 50MB (video) | ✅ 5MB (images/docs), 50MB (video) |
| File extension check    | ✅                                 | ✅                                 |
| File MIME type check    | ✅                                 | ✅                                 |
| **File magic bytes**    | ✅ (portado de Vue)                | ✅ (implementação original)        |

### Tripla Validação de Arquivos

```
1. Extensão do nome do arquivo (.pdf, .jpg, .png, .mp4, .docx)
2. MIME type do browser (application/pdf, image/jpeg, etc.)
3. Magic bytes — leitura dos primeiros 8 bytes do arquivo:
   - PDF: 25504446 (%PDF)
   - PNG: 89504E47
   - JPG: FFD8FF
   - MP4: contém "66747970" (ftyp)
   - DOCX: 504B0304 (PK ZIP header)
```

> Magic bytes previnem ataques onde um arquivo malicioso é renomeado para extensão aceita. O MIME type do browser é spoofável; os magic bytes não.

---

## 5. Padrões Perigosos — Auditoria

| Padrão                      | React                 | Vue                   | Status        |
| --------------------------- | --------------------- | --------------------- | ------------- |
| `eval()`                    | ❌ Nenhum             | ❌ Nenhum             | ✅ Seguro     |
| `Function()` constructor    | ❌ Nenhum             | ❌ Nenhum             | ✅ Seguro     |
| `innerHTML` =               | ❌ Nenhum             | ❌ Nenhum             | ✅ Seguro     |
| `dangerouslySetInnerHTML`   | ❌ Nenhum             | N/A                   | ✅ Seguro     |
| `v-html` sem sanitização    | N/A                   | ❌ Nenhum             | ✅ Seguro     |
| `document.write()`          | ❌ Nenhum             | ❌ Nenhum             | ✅ Seguro     |
| Hardcoded secrets no bundle | ⚠️ Mock credentials\* | ⚠️ Mock credentials\* | Aceitável\*\* |

\* Mock credentials existem por design (PoC sem backend real)
\*\* Em produção, remover MOCK_USERS e usar autenticação real via API

---

## 6. Resumo de Ações Implementadas

| Ação                       | Commit                           | Arquivos                                                  |
| -------------------------- | -------------------------------- | --------------------------------------------------------- |
| CSP meta tags              | `b54934a`                        | `index.html` (ambas)                                      |
| X-Requested-With header    | `b54934a`                        | `api.ts` (ambas)                                          |
| Session timeout 30min      | `b54934a`                        | `useSessionTimeout.ts` + `ProtectedRoute.tsx` + `App.vue` |
| Magic bytes (React parity) | `b54934a`                        | `fileSchema.ts` (React)                                   |
| DOMPurify sanitize.ts      | `319f857` (cherry-pick anterior) | `sanitize.ts` (Vue)                                       |
| Zero `any` TypeScript      | `368f972` (Bloco F)              | 17 arquivos                                               |

---

## 7. Recomendações para Produção

### Prioridade Crítica

1. Migrar token storage de localStorage para HttpOnly cookies
2. Backend implementar CSRF token validation
3. Backend enviar CSP header completo (sem `unsafe-inline`)

### Prioridade Alta

4. Implementar rate limiting no backend para login (prevenir brute force)
5. Adicionar CAPTCHA em formulários públicos
6. Implementar CSP nonces para inline scripts

### Prioridade Média

7. Adicionar Subresource Integrity (SRI) para CDN assets
8. Implementar Feature-Policy/Permissions-Policy headers
9. Security audit automatizado no CI/CD (npm audit, Snyk)
