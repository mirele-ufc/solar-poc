# Escalabilidade Multi-Frontend: Roadmap para Vue + Next.js

**Status:** 📋 Documentação | Válida para fases futuras  
**Escopo:** Planejamento (nenhuma mudança em React agora)  
**Foco Atual:** React 18 + Vite (Fase 0-6 em progresso)  
**Expansão Planejada:** Vue 3 + Next.js (Fase 7+)

---

## 🎯 Visão Geral

A arquitetura de refatoração foi **projetada para ser agnóstica a framework**, permitindo:

✅ **Reutilização:**
- Mesmo plano de refatoração (43 subtarefas)
- Mesmo baseline contratual estrito de endpoints em arquitetura.md
- Mesmos requisitos (RF/RN/RNF)
- Mesmo agente de validação
- Mesmos tipos compartilhados

⚠️ **O que muda:**
- Stack específica por framework
- Padrões de componentes
- Convenções de código (CLAUDE-TECH.md)
- Ferramentas de build/test

---

## 📊 Estrutura de Monorepo Turbo (Proposta)

```
ava-poc/
├── packages/
│   ├── types/ (COMPARTILHADO)
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts (IUserSession, ICourse, etc.)
│   │       ├── api.ts
│   │       ├── domain.ts
│   │       └── contracts.ts
│   │
│   └── refactoring-context/ (COMPARTILHADO)
│       ├── package.json
│       └── docs/
│           ├── REFACTORING_PLAN_GRANULAR_V2.md
│           ├── REFACTORING_QUICK_REFERENCE.md
│           ├── COMO_COMECAR.md
│           ├── README.md
│           └── /memories/ (symlink ou submodule)
│
├── apps/
│   ├── poc-react-vite/
│   │   ├── package.json
│   │   ├── CLAUDE-REACT.md (diretrizes React-específicas)
│   │   ├── CLAUDE.md (base compartilhada)
│   │   ├── .claude/
│   │   │   ├── agents/
│   │   │   │   ├── start-implementation.agent.md (REUTILIZADO)
│   │   │   │   └── start-implementation-react.agent.md (optional)
│   │   │   └── commands/
│   │   │       └── frontend/
│   │   │           └── *-current.md (React context)
│   │   ├── src/
│   │   │   ├── components/ (React + Slots Pattern)
│   │   │   ├── hooks/ (custom hooks)
│   │   │   ├── store/ (Zustand)
│   │   │   ├── services/ (baseline contratual estrito)
│   │   │   ├── validations/ (Zod schemas)
│   │   │   └── pages/ (24 rotas autenticadas)
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── poc-vue-vite/ (FUTURO)
│   │   ├── package.json
│   │   ├── CLAUDE-VUE.md (diretrizes Vue-específicas)
│   │   ├── CLAUDE.md (base compartilhada)
│   │   ├── .claude/
│   │   │   ├── agents/
│   │   │   │   ├── start-implementation.agent.md (REUTILIZADO)
│   │   │   │   └── start-implementation-vue.agent.md (validações Vue)
│   │   │   └── commands/
│   │   │       └── frontend/
│   │   │           └── *-current.md (Vue context)
│   │   ├── src/
│   │   │   ├── components/ (Vue .SFC + Slots)
│   │   │   ├── composables/ (Vue Composition API)
│   │   │   ├── stores/ (Pinia)
│   │   │   ├── services/ (baseline contratual, reutilizável)
│   │   │   ├── validations/ (idem, Zod é agnóstico)
│   │   │   └── pages/ (Vue components)
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── poc-next/ (FUTURO)
│       ├── package.json
│       ├── CLAUDE-NEXT.md (diretrizes Next-específicas)
│       ├── CLAUDE.md (base compartilhada)
│       ├── .claude/
│       │   ├── agents/
│       │   │   ├── start-implementation.agent.md (REUTILIZADO)
│       │   │   └── start-implementation-next.agent.md (RSC validation)
│       │   └── commands/
│       │       └── frontend/
│       │           └── *-current.md (Next context)
│       ├── app/ (Next.js App Router)
│       │   ├── api/
│       │   ├── (auth)/
│       │   ├── (dashboard)/
│       │   └── layout.tsx
│       ├── src/
│       │   ├── components/ (RSC + Client Components)
│       │   ├── hooks/ (client-only)
│       │   ├── lib/ (utilities)
│       │   ├── services/ (baseline contratual estrito)
│       │   └── validations/ (Zod)
│       ├── next.config.ts
│       └── tsconfig.json
│
├── turbo.json (config workspace)
├── package.json (root)
├── pnpm-workspace.yaml
└── README.md (monorepo guide)
```

---

## 🔄 Fluxo de Desenvolvimento

### **Ciclo 1: React (ATUAL — Semanas 1-17)**

```
Semana 1-2:   Fase 0 (Segurança)
Semana 3-4:   Fase 1 (Contratos)
Semana 5-8:   Fase 2-3 (Auth + Cursos)
Semana 9-13:  Fase 4-5 (Exames + Deduplicação)
Semana 14-17: Fase 6 (Hardening + Docs)

Output:
✅ /apps/poc-react-vite/ integrado 100%
✅ /docs/ com contexto completo e versionado
✅ /packages/types/ v1.0 consolidado
```

### **Ciclo 2: Vue (FUTURO — Semanas 18-28)**

```
Semana 1-2:   Setup monorepo Turbo + adaptar tipos
Semana 3-4:   Fase 0-1 em Vue (reutilizar plano, adaptar patterns)
Semana 5-12:  Fase 2-6 em Vue (paralelo ao React, mesmas subtarefas)
Semana 13:    Validação cruzada (React vs Vue, feature parity)

Output:
✅ /apps/poc-vue-vite/ integrado 100%
✅ CLAUDE-VUE.md com diretrizes Vue
✅ start-implementation-vue.agent.md com validações Vue
✅ Prova: "Vue e React implementam mesma funcionalidade"
```

### **Ciclo 3: Next.js (FUTURO — Semanas 29-39)**

```
Semana 1:     Decisão: Full-stack (API routes) vs client-only
Semana 2-4:   Fase 0-1 em Next (RSC + server actions)
Semana 5-12:  Fase 2-6 em Next (paralelo)
Semana 13:    Validação (React vs Next, performance delta)

Output:
✅ /apps/poc-next/ integrado 100%
✅ CLAUDE-NEXT.md com Server Components + Actions
✅ start-implementation-next.agent.md
✅ Performance audit: Next vs React vs Vue
```

---

## 🛠️ O Que Muda por Framework

### **1. Tipos Compartilhados (SEM MUDANÇA)**

```typescript
// packages/types/src/index.ts — IDÊNTICO para React, Vue, Next

export interface IUserSession {
  id: string;
  nome: string;
  role: "professor" | "student" | "admin";
  // ... (mesmo código)
}

export interface ILoginRequest {
  emailOuUsuario: string;
  senha: string;
}

// Todos 3 frameworks importam daqui:
// import { IUserSession, ILoginRequest } from "@ava-poc/types"
```

### **2. Services & Zod Schemas (REUTILIZÁVEL 80%)**

```typescript
// src/services/authService.ts — 95% IGUAL em React, Vue, Next

import { ILoginRequest, ILoginResponse } from "@ava-poc/types";

export const authService = {
  async login(emailOuUsuario: string, senha: string): Promise<ILoginResponse> {
    const res = await api.post("/auth/login", {
      emailOuUsuario,
      senha,
    });
    return res.data.data;
  },
  // ... (20 funções idênticas)
};

// Validações Zod (IDÊNTICAS)
export const loginSchema = z.object({
  emailOuUsuario: z.string().email(),
  senha: z.string().min(6),
});
```

### **3. Padrões de Estado (DIFEREM)**

| React | Vue 3 | Next.js |
|-------|-------|---------|
| **Zustand** | **Pinia** | **Zustand + Server State** |
| `useAuthStore()` | `useAuthStore()` (Pinia) | `useAuthStore()` + server actions |
| `const { user } = useAuthStore()` | `const store = useAuthStore(); store.user` | Client: Zustand / Server: middleware |
| Global state only | Global + reactive | Global (split: client/server) |

### **4. Componentes (DIFEREM SINTAXE, MESMA LÓGICA)**

| React | Vue 3 | Next.js |
|-------|-------|---------|
| **Functional Components** | **SFC (.vue)** | **RSC/Client Comps** |
| `function Card({ children })` | `<script setup> defineSlots() </script>` | `export default function Card()` (RSC) |
| Props via destructure | `defineProps()` in `<script setup>` | Props via function args |
| Slots pattern: `<Card.Header>` | Slots: `<template #header>` | Slots: `{children}` prop |
| Hooks: `useState`, `useEffect` | Composables: `ref()`, `computed()` | Client: Hooks / Server: async |

### **5. Diretrizes (CLAUDE-TECH.md)**

#### **CLAUDE-REACT.md**
```markdown
## Stack
React 18+, Vite, Zustand, React Query, React Router, Shadcn UI

## Padrões
- Functional components with custom hooks
- Zustand for global state
- React Query for remote data
- Slots pattern via children composition

## Testes
Vitest + @testing-library/react
```

#### **CLAUDE-VUE.md**
```markdown
## Stack
Vue 3, Vite, Pinia, VueQuery, Vue Router, Headless UI

## Padrões
- Single File Components (SFC) with Composition API
- Pinia for global state (reactive)
- VueQuery for remote data
- Slots pattern via <template #slotName>

## Testes
Vitest + @vue/test-utils
```

#### **CLAUDE-NEXT.md**
```markdown
## Stack
Next.js 14+, Server Components, Pinia, TanStack Query, Tailwind

## Padrões
- RSC (React Server Components) for data fetching
- Client Components for interactivity
- Server Actions for mutations
- Slots pattern via {children}

## Testes
Vitest + @testing-library/react (only client components)
```

---

## 📋 Checklist de Escalabilidade (Futuro)

### **Antes de Começar Vue (Semana 18)**

- [ ] Monorepo Turbo setup
  - [ ] `pnpm install -g turbo`
  - [ ] Mover `packages/types` para workspace
  - [ ] Criar `packages/refactoring-context`
  - [ ] Atualizar `turbo.json`

- [ ] Tipos consolidados
  - [ ] Exportar @ava-poc/types v1.0
  - [ ] React, Vue, Next todos importam daqui
  - [ ] Remover tipos locais duplicados

- [ ] Documentação multi-tech
  - [ ] CLAUDE.md (base compartilhada)
  - [ ] CLAUDE-REACT.md (current)
  - [ ] CLAUDE-VUE.md (template)
  - [ ] CLAUDE-NEXT.md (template)

- [ ] Agentes multi-tech
  - [ ] start-implementation.agent.md (agnóstico)
  - [ ] start-implementation-vue.agent.md (template)
  - [ ] start-implementation-next.agent.md (template)

- [ ] Services compartilhados
  - [ ] Copiar `src/services/` de React
  - [ ] Remover dependências React (Hooks, suspense)
  - [ ] Criar `/packages/services` reutilizável

### **Durante Vue + Next.js (Semana 18-39)**

- [ ] Para cada framework:
  - [ ] Executa `/start-implementation`
  - [ ] Percorre 43 subtarefas (idênticas)
  - [ ] Adapta padrões (Zustand → Pinia, etc.)
  - [ ] Cria CLAUDE-TECH.md específico
  - [ ] Documenta diffs em PR

- [ ] Testes cruzados
  - [ ] React vs Vue: mesmos endpoints, mesmos resultados
  - [ ] Vue vs Next: mesma auth flow, mesma UX
  - [ ] Validar feature parity

- [ ] Performance audit
  - [ ] Bundle size: React vs Vue vs Next
  - [ ] First contentful paint (FCP)
  - [ ] Core Web Vitals
  - [ ] Report em `/docs/PERFORMANCE_COMPARISON.md`

---

## 🎓 Benefícios da Abordagem Multi-Frontend

### **Para a UFC:**
- ✅ **Comparar frameworks** na prática (React vs Vue vs Next)
- ✅ **Reutilizar tipos** e lógica de negócio
- ✅ **Provar que backend é agnóstico** a frontend
- ✅ **Validar portabilidade** de designs

### **Para Developers:**
- ✅ **Aprender 3 frameworks** com mesmo projeto
- ✅ **Padrões análogos** (Zustand ↔ Pinia ↔ TanStack Query)
- ✅ **Mesmos testes** (Zod, services, tipos)
- ✅ **Portfolio impressionante** (UFC LMS em 3 stacks)

### **Para o Projeto:**
- ✅ **Escalabilidade** (fácil adicionar Svelte, Angular, etc.)
- ✅ **Manutenção** (tipos compartilhados = DRY)
- ✅ **CI/CD** (Turbo paraleliza testes dos 3 apps)

---

## 🚀 Próximas Etapas (AGORA)

**Foco: React (Fase 0-6, semanas 1-17)**

✅ Não bloqueia outros frameworks  
✅ Documentação já suporta escalabilidade  
✅ Agente de validação é agnóstico  
✅ Tipos estão preparados para reutilização  

**Quando React terminar (Semana 18):**
1. Criar monorepo Turbo
2. Adaptar tipos para `@ava-poc/types`
3. Começar Vue (reutiliza 80% de código)

---

**Salvo em:** `/docs/MULTI_FRONTEND_ROADMAP.md` — versionado e consultável quando escalar

