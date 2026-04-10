# Lighthouse Baseline — Tutorial & Expected Results

> Guia para execução manual de Lighthouse em ambas PoCs.

---

## 1. Como Instalar e Executar

### Opção A: Chrome DevTools (Recomendado)

```
1. Abrir a aplicação no Chrome (http://localhost:5173)
2. Abrir DevTools (F12)
3. Aba "Lighthouse"
4. Configurar:
   - Mode: Navigation
   - Device: Mobile (para métricas conservadoras) ou Desktop
   - Categories: ✅ Performance, ✅ Accessibility, ✅ Best Practices, ✅ SEO
5. Clicar "Analyze page load"
6. Aguardar relatório (~30s)
```

### Opção B: VS Code Extension

```
1. Instalar extensão "Lighthouse" no VS Code
2. Command Palette (Ctrl+Shift+P) > "Lighthouse: Run"
3. Inserir URL da aplicação
4. Selecionar categorias
```

### Opção C: CLI

```bash
# Instalar
npm install -g lighthouse

# Executar
lighthouse http://localhost:5173 --output html --output-path ./lighthouse-react.html
lighthouse http://localhost:5174 --output html --output-path ./lighthouse-vue.html

# Com throttling (simula 3G)
lighthouse http://localhost:5173 --throttling.cpuSlowdownMultiplier=4 --output json
```

---

## 2. Metas por Categoria

| Categoria          | Target | Mínimo Aceitável |
| ------------------ | ------ | ---------------- |
| **Performance**    | ≥85    | ≥70              |
| **Accessibility**  | ≥90    | ≥80              |
| **Best Practices** | ≥90    | ≥80              |
| **SEO**            | ≥85    | ≥75              |

---

## 3. Métricas de Performance Detalhadas

| Métrica                            | Bom    | Moderado  | Ruim   |
| ---------------------------------- | ------ | --------- | ------ |
| **FCP** (First Contentful Paint)   | <1.8s  | 1.8-3.0s  | >3.0s  |
| **LCP** (Largest Contentful Paint) | <2.5s  | 2.5-4.0s  | >4.0s  |
| **CLS** (Cumulative Layout Shift)  | <0.1   | 0.1-0.25  | >0.25  |
| **TBT** (Total Blocking Time)      | <200ms | 200-600ms | >600ms |
| **SI** (Speed Index)               | <3.4s  | 3.4-5.8s  | >5.8s  |

---

## 4. Expectativas por PoC

### React PoC

| Métrica        | Expectativa | Risco                                             |
| -------------- | ----------- | ------------------------------------------------- |
| Performance    | 70-80       | Bundle grande (300 KB gzip) impacta FCP/LCP       |
| Accessibility  | 85-95       | Depende de ARIA labels, contraste, semântica HTML |
| Best Practices | 85-90       | CSP adicionado ✅, sem console.log excessivo      |
| SEO            | 80-90       | SPA sem SSR (limitado)                            |

**Riscos identificados:**

- ⚠️ Bundle monolítico sem code-splitting — pode causar TBT alto
- ⚠️ Imagem de 8.3 MB no build — arrastar LCP se servida sem otimização

### Vue PoC

| Métrica        | Expectativa | Risco                                        |
| -------------- | ----------- | -------------------------------------------- |
| Performance    | 80-90       | Code-splitting reduz impacto de parse        |
| Accessibility  | 85-95       | Similar ao React — depende de HTML semântico |
| Best Practices | 85-90       | CSP adicionado ✅, DOMPurify ✅              |
| SEO            | 80-90       | SPA sem SSR (mesma limitação)                |

**Vantagens:**

- ✅ Chunks pequenos → menor TBT no initial load
- ✅ CSS separado por view → menor render-blocking

---

## 5. Como Registrar Baseline

Após executar Lighthouse em ambas PoCs, registrar:

```markdown
## Lighthouse Scores — [DATA]

### React PoC (localhost:5173)

- Performance: XX
- Accessibility: XX
- Best Practices: XX
- SEO: XX

### Vue PoC (localhost:5174)

- Performance: XX
- Accessibility: XX
- Best Practices: XX
- SEO: XX
```

---

## 6. Melhorias Comuns para Ambas

1. **Otimizar imagens** — Usar WebP/AVIF, lazy loading com `loading="lazy"`
2. **Preload fonts** — `<link rel="preload" href="..." as="font">`
3. **Preconnect** — `<link rel="preconnect" href="https://fonts.googleapis.com">`
4. **Minificar HTML** — Vite já faz automaticamente no build
5. **Cache headers** — Configurar no backend/CDN para assets estáticos
