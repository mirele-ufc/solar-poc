# Análise de Performance — React vs Vue PoC

> Gerado automaticamente. Métricas coletadas via `vite build` + análise estática.

---

## 1. Bundle Size (Produção — gzip)

### React (Single Bundle)

| Asset            | Raw             | gzip          |
| ---------------- | --------------- | ------------- |
| `index.js`       | 1,041.53 KB     | **300.06 KB** |
| `index.css`      | 105.46 KB       | **17.98 KB**  |
| **Total JS+CSS** | **1,146.99 KB** | **318.04 KB** |

⚠️ **Alerta:** Bundle JS excede 500 KB (raw). Sem code-splitting por rota.

### Vue (Code-Split por Rota)

| Asset                               | Raw         | gzip        |
| ----------------------------------- | ----------- | ----------- |
| `index.js` (core)                   | 116.23 KB   | 45.23 KB    |
| `api.js` (Axios + interceptors)     | 39.77 KB    | 15.79 KB    |
| `fileSchema.js` (Zod + validação)   | 61.94 KB    | 17.24 KB    |
| `CreateModulesView.js` (maior page) | 42.84 KB    | 14.88 KB    |
| `CreateExamView.js`                 | 22.06 KB    | 7.08 KB     |
| Demais chunks (20 arquivos)         | ~120 KB     | ~40 KB      |
| `index.css` + page CSS              | 47.74 KB    | 10.30 KB    |
| **Total JS+CSS (all chunks)**       | **~450 KB** | **~173 KB** |

✅ Vue é **~45% menor** que React em gzip total graças ao code-splitting automático do Vue Router.

### Comparação Direta

| Métrica             | React     | Vue       | Vencedor       |
| ------------------- | --------- | --------- | -------------- |
| JS gzip total       | 300.06 KB | ~163 KB   | **Vue** (-46%) |
| CSS gzip total      | 17.98 KB  | ~10.30 KB | **Vue** (-43%) |
| Total gzip          | ~318 KB   | ~173 KB   | **Vue** (-46%) |
| Code-split por rota | ❌ Não    | ✅ Sim    | **Vue**        |
| Maior chunk         | 300 KB    | 45 KB     | **Vue**        |
| Initial load (core) | 300 KB    | 61 KB\*   | **Vue**        |

\*Vue initial load = `index.js` (45 KB) + `api.js` (16 KB) = ~61 KB gzip

---

## 2. Stress Testing — Tutorial & Guia de Execução

### O que testar

1. **Renderização de volume** — Listar 1000+ cursos no grid
2. **Interação rápida** — Digitação rápida em campos de busca
3. **Navegação intensiva** — Abrir/fechar modais 50x em sequência

### Como medir FPS (Chrome DevTools)

```
1. Abrir Chrome DevTools (F12)
2. Aba "Performance"
3. Clicar ⏺ (Record)
4. Executar ação de stress (scroll rápido em lista de 1000 items)
5. Parar gravação
6. Verificar:
   - FPS: gráfico verde no topo (deve manter ≥30 FPS)
   - Long Tasks: barras vermelhas (devem ser raras, <200ms)
   - Main Thread: tempo idle vs busy
```

### Como medir Input Latency

```
1. Chrome DevTools > Performance
2. Ativar "Web Vitals" checkbox
3. Digitar rapidamente em campo de busca
4. Parar gravação
5. Verificar:
   - INP (Interaction to Next Paint): deve ser <200ms
   - Input delay: tempo entre keystroke e re-render
```

### Metas de Performance

| Métrica                 | Target  | Crítico |
| ----------------------- | ------- | ------- |
| FPS (scroll 1000 items) | ≥30 FPS | <15 FPS |
| Input responsiveness    | <100ms  | >300ms  |
| Render 1000 items       | <2s     | >5s     |
| Modal open/close        | <100ms  | >500ms  |

---

## 3. Memory Leak Detection — Tutorial

### O que testar

1. **Modal lifecycle** — Abrir/fechar AddLessonPopup 50x → memória cresce infinito?
2. **Navegação** — Courses → Modules → Lessons → voltar (50x) → leak?
3. **Busca intensiva** — Filtrar cursos 50+ ciclos → memória liberada?

### Como tirar Heap Snapshots (Chrome DevTools)

```
1. Chrome DevTools > Memory tab
2. Selecionar "Heap Snapshot"
3. Clicar "Take Snapshot" (ANTES da ação)
4. Executar ação (ex: abrir/fechar modal 10x)
5. Clicar "Take Snapshot" (DEPOIS da ação)
6. Selecionar Snapshot 2 > "Comparison" dropdown > comparar com Snapshot 1
7. Ordenar por "Size Delta" descendente
8. Procurar:
   - Detached DOM nodes (elements não mais no DOM mas retidos em memória)
   - Event listeners não removidos
   - Closures crescentes (funções que capturam grandes escopos)
```

### Indicadores de Leak

| Sinal                              | Significado                                  | Gravidade  |
| ---------------------------------- | -------------------------------------------- | ---------- |
| Heap cresce monotonicamente        | Memória nunca é liberada                     | 🔴 Crítico |
| Detached HTMLElement count grows   | Componentes não desmontam limpo              | 🟡 Médio   |
| Event listeners count grows        | `addEventListener` sem `removeEventListener` | 🟡 Médio   |
| Closures retêm referências grandes | Garbage collector não libera                 | 🟠 Alto    |

### Expectativa (ambas PoCs)

- ✅ React: hooks com cleanup em `useEffect` return
- ✅ Vue: `onUnmounted` em composables
- ✅ Ambas: session timeout hook remove event listeners no unmount
- ⚠️ Verificar: CKEditor lifecycle (se usado) — conhecido por leaks se não destruído

---

## 4. Boot Performance (TTI — Time to Interactive)

### Como medir TTI

```
1. Chrome DevTools > Performance
2. Clicar ⏺ e recarregar a página (Ctrl+Shift+R)
3. Parar gravação após carregamento
4. Localizar marker "DCL" (DOMContentLoaded) e "FCP" (First Contentful Paint)
5. TTI = tempo até a thread principal estar idle (marcado automaticamente)
```

### Metas

| Métrica                        | Target   | Tolerável |
| ------------------------------ | -------- | --------- |
| FCP (First Contentful Paint)   | <1.5s    | <3s       |
| TTI (Time to Interactive)      | <3s (3G) | <5s       |
| LCP (Largest Contentful Paint) | <2.5s    | <4s       |

### Fatores que afetam TTI

| Fator              | React         | Vue                   | Impacto          |
| ------------------ | ------------- | --------------------- | ---------------- |
| Bundle parse time  | Alto (300 KB) | Baixo (45 KB initial) | **Vue vantagem** |
| Hydration cost     | N/A (SPA)     | N/A (SPA)             | Empate           |
| Route lazy loading | Não           | Sim (automático)      | **Vue vantagem** |
| CSS parsing        | 18 KB gzip    | 10 KB gzip            | **Vue vantagem** |

---

## 5. Dead Code Analysis

### Como verificar unused imports

```bash
# React
cd apps/poc-react-vite
npx tsc --noEmit 2>&1 | grep "TS6133"  # unused variables

# Vue
cd apps/poc-vue-vite
npx vue-tsc --noEmit 2>&1 | grep "TS6133"
```

### Como usar source-map-explorer

```bash
# Instalar
npm install -g source-map-explorer

# React (gerar source maps)
cd apps/poc-react-vite
npx vite build --sourcemap
npx source-map-explorer dist/assets/index-*.js

# Vue
cd apps/poc-vue-vite
npx vite build --sourcemap
npx source-map-explorer dist/assets/index-*.js
```

### Status atual de dead code

| PoC           | Unused imports (TS6133) | Status    |
| ------------- | ----------------------- | --------- |
| React (src)   | 0                       | ✅ Limpo  |
| React (tests) | 3 (pre-existing)        | ⚠️ Testes |
| Vue (src)     | 0                       | ✅ Limpo  |

---

## 6. Recomendações

### React — Prioridade Alta

1. **Implementar code-splitting por rota** — Usar `React.lazy()` + `Suspense` no `routes.tsx`
2. **Tree-shaking de dependências** — Verificar se `sonner`, `react-hook-form` estão sendo totalmente importados
3. **Considerar manual chunks** — Separar vendor (react, axios, zod) de app code

### Vue — Manutenção

1. ✅ Code-splitting já funciona automaticamente via Vue Router
2. ✅ Bundle está dentro de targets (<200 KB gzip total)
3. ⚠️ `fileSchema.js` chunk (17 KB gzip) — Zod é pesado; considerar validação nativa para schemas simples

### Ambas PoCs

- Comprimir imagens estáticas (8.3 MB PNG detectado no React build)
- Considerar `vite-plugin-compression` para pre-compress assets
