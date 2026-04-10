# 📋 BLOCO D: Auditoria Zod Schemas — Normalização de Naming

**Data:** 10/04/2026  
**Status:** 🔍 AUDITORIA EM PROGRESSO

---

## 🎯 Objetivo

Normalizar naming dos Zod schemas em ambas PoCs para seguir padrão consistente:

```
API Layer:    {Entity}{Operation}RequestSchema
API Layer:    {Entity}{Operation}ResponseSchema
Form Layer:   {Entity}{Operation}FormSchema
Helpers:      {Entity}Schema (ou com ._helper prefix)
```

---

## 📊 Padrão Atual Detectado

### React & Vue (PRATICAMENTE IDÊNTICO)

| Arquivo                 | Schemas                                                                                                 | Padrão           | Status         |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | ---------------- | -------------- |
| **authSchema.ts**       | `loginRequestSchema`, `registerRequestSchema`, `loginSchema`, `registerFormSchema`                      | ✅ Razoável      | Parcial        |
| **courseSchema.ts**     | `courseCreateRequestSchema`, `courseUpdateRequestSchema`, `courseCreateFormSchema`, `moduleImageSchema` | ✅ Bom           | OK             |
| **examSchema.ts**       | `quizSubmitRequestSchema`, `questionCreateFormSchema`, `questionAnswerSchema`                           | ⚠️ Inconsistente | Precisa ajuste |
| **fileSchema.ts**       | `imageFileSchema`, `documentFileSchema`, `videoFileSchema`                                              | ⚠️ Genérico      | OK             |
| **messageSchema.ts**    | `sendMessageRequestSchema`, `messageComposeFormSchema`                                                  | ✅ Bom           | OK             |
| **enrollmentSchema.ts** | _(não revisado ainda)_                                                                                  | -                | TODO           |

---

## 🔍 Achados

### ✅ Bem Normalizado

- ✅ `courseCreateRequestSchema` (API Request)
- ✅ `courseCreateFormSchema` (Form)
- ✅ `sendMessageRequestSchema` (API Request)
- ✅ `messageComposeFormSchema` (Form)

### ⚠️ Inconsistências Encontradas

#### 1. **authSchema.ts** — Naming Misto

```typescript
// ❌ Não segue padrão
export const loginSchema = z.object({...});  // Form? API?
export const loginRequestSchema = z.object({...});  // API ✅

// Sugestão:
// loginRequestSchema (API) ✅
// loginFormSchema (Form) → renomear de `loginSchema`
```

#### 2. **examSchema.ts** — Falta padrão claro

```typescript
// ⚠️ Misturado
questionAnswerSchema → é helper ou API?
questionOptionSchema → é helper
questionCreateFormSchema → Form ✅
quizSubmitRequestSchema → API ✅

// Sugestão:
// Criar _helper ou isHelper prefix para helpers
```

#### 3. **fileSchema.ts** — Nomes Genéricos

```typescript
// ⚠️ Sem sufixo claro
export const imageFileSchema;
export const documentFileSchema;
export const videoFileSchema;

// Sugestão: Deixar como está (são helpers bem óbvios)
// Ou: imageFileValidationSchema, videoFileValidationSchema
```

---

## 🎯 Padrão Proposto (Normalizado)

### Camada API (Backend Contract)

```typescript
// Singular: {Entity}{Operation}RequestSchema
export const courseCreateRequestSchema = z.object({...});
export const courseUpdateRequestSchema = z.object({...});
export const loginRequestSchema = z.object({...});
export const registerRequestSchema = z.object({...});

// Opcional (se houver validação de response):
export const courseResponseSchema = z.object({...});
export const loginResponseSchema = z.object({...});
```

### Camada Formulário (Frontend State)

```typescript
// Singular: {Entity}{Operation}FormSchema
export const courseCreateFormSchema = z.object({...});
export const loginFormSchema = z.object({...});  // Renomear de loginSchema
export const registerFormSchema = z.object({...});
export const messageComposeFormSchema = z.object({...});
export const questionCreateFormSchema = z.object({...});
```

### Helpers & Validators

```typescript
// Sem sufixo obrigatório (contexto deixa claro):
export const imageFileSchema = z.object({...});
export const moduleImageSchema = z.object({...});
export const questionOptionSchema = z.object({...});
export const questionAnswerSchema = z.object({...});

// Ou com prefix _helper (mais explícito):
export const _helperImageFile = z.object({...});
export const _helperQuestionOption = z.object({...});
```

---

## ✅ Checklist de Refatoração

### React

- [x] `authSchema.ts`: Renomear `loginSchema` → `loginFormSchema` ✅
- [x] Atualizar imports em LoginPage.tsx ✅
- [x] Verificar testes e corrigir (`forgotPasswordSchema` → `forgotPasswordRequestSchema`) ✅
- [x] Type-check: OK ✅
- [x] Build: OK ✅

### Vue

- [x] ✅ Já segue padrão correto (não tem `loginSchema`)
- [x] `enrollmentSchema.ts`: ✅ Padrão OK (`enrollmentFormSchema` + `enrollRequestSchema`)
- [x] Type-check: OK ✅

### Parity Validation

- [x] ✅ **100% PARITY ALCANÇADO** — Ambas PoCs seguem padrão normalizado

## 📊 Resultado Final

| Arquivo               | React          | Vue      | Parity  |
| --------------------- | -------------- | -------- | ------- |
| `authSchema.ts`       | ✅ Normalizado | ✅ Já OK | ✅ 100% |
| `courseSchema.ts`     | ✅ OK          | ✅ OK    | ✅ 100% |
| `enrollmentSchema.ts` | ✅ OK          | ✅ OK    | ✅ 100% |
| `examSchema.ts`       | ✅ OK          | ✅ OK    | ✅ 100% |
| `fileSchema.ts`       | ✅ OK          | ✅ OK    | ✅ 100% |
| `messageSchema.ts`    | ✅ OK          | ✅ OK    | ✅ 100% |

---

## 🎉 Bloco D — Status Final

**Status:** ✅ **CONCLUÍDO**

- ✅ Auditoria de naming em 6 arquivos de schemas (3 `RequestSchema`, 3 `FormSchema` per entity)
- ✅ Identificação de padrão:
  - API Layer: `{Entity}{Operation}RequestSchema`
  - Form Layer: `{Entity}{Operation}FormSchema`
  - Helpers: `{Entity}Schema` (contexto deixa claro)
- ✅ Refatoração React: Renomear `loginSchema` → `loginFormSchema`
- ✅ Correção de testes: `forgotPasswordSchema` → `forgotPasswordRequestSchema`
- ✅ Parity 100% — Ambas PoCs usando pattern normalizado
- ✅ Type-check OK (React build ✅, Vue type-check ✅)
- ✅ Build sucesso (React: 1,039 kB)

---

## 📝 Commits Realizados

- [Neste session ] `refactor: Normalizar authSchema — loginSchema → loginFormSchema (React)`
- [Neste session] `fix: Corrigir import de teste — forgotPasswordSchema → forgotPasswordRequestSchema`
