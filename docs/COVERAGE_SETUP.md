# Coverage Configuration — Bloco E4

## Objetivo

Configurar CI/CD para coleta e reporte de cobertura de testes automatizada em ambas as PoCs (React e Vue).

---

## Configuração Vitest Coverage

### React (`apps/poc-react-vite`)

**Arquivo:** `vite.config.ts`

```typescript
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/test/setup.ts",
  css: true,
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html", "lcov"],
    exclude: [
      "node_modules/",
      "src/test/",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/types/**",
      "**/mocks/**",
    ],
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70,
  },
}
```

**Script:**

```bash
npm run test:coverage
```

**Outputs:**

- `coverage/` — Relatórios HTML
- `coverage/coverage-final.json` — Dados brutos (LCOV)
- Console output — Resumo texto

---

### Vue (`apps/poc-vue-vite`)

**Arquivo:** `vitest.config.ts`

```typescript
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: [],
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html", "lcov"],
    exclude: [
      "node_modules/",
      "dist/",
      "src/test/",
      "**/*.test.ts",
      "**/*.spec.ts",
      "**/mockData.ts",
      "**/types/**",
      "**/mocks/**",
    ],
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70,
  },
}
```

**Script:**

```bash
npm run test:coverage
```

**Outputs:**

- `coverage/` — Relatórios HTML
- `coverage/coverage-final.json` — Dados brutos (LCOV)
- Console output — Resumo texto

---

## Thresholds de Cobertura

Ambas as PoCs têm os mesmos thresholds configurados:

| Métrica    | Target |
| ---------- | ------ |
| Lines      | ≥ 70%  |
| Functions  | ≥ 70%  |
| Branches   | ≥ 70%  |
| Statements | ≥ 70%  |

---

## CI/CD Integration (GitHub Actions)

### Exemplo de Workflow (`.github/workflows/test-coverage.yml`)

```yaml
name: Test Coverage

on: [push, pull_request]

jobs:
  coverage:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        app: [poc-react-vite, poc-vue-vite]

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - run: pnpm install

      - name: Run tests with coverage
        run: cd apps/${{ matrix.app }} && npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/${{ matrix.app }}/coverage/coverage-final.json
          flags: ${{ matrix.app }}
```

---

## Comandos Locais

### Gerar cobertura (sem CI):

```bash
# React
cd apps/poc-react-vite && npm run test:coverage

# Vue
cd apps/poc-vue-vite && npm run test:coverage
```

### Visualizar relatório HTML:

```bash
# React
open coverage/index.html

# Vue (no Windows)
start coverage\index.html
```

---

## Exclusões Configuradas

**Arquivos/Pastas excluídos de cobertura:**

- `node_modules/` — Dependências externas
- `dist/` / `build/` — Output compilado
- `src/test/` — Setup de testes
- `**/*.test.ts` / `**/*.test.tsx` / `**/*.spec.ts` — Próprios testes
- `**/types/**` — Definições de tipos
- `**/mocks/**` — Mock data

Isso evita inflar cobertura com código de setup ou tipos.

---

## Próximas Etapas

1. **Antes de E4 completo:**
   - [ ] Validar que `npm run test:coverage` executa sem erros em ambas PoCs
   - [ ] Confirmar HTML reports gerados em `coverage/`
   - [ ] Verificar que thresholds são respeitados (≥70%)

2. **Para CI/CD produção:**
   - [ ] Criar GitHub Actions workflow
   - [ ] Integrar com Codecov ou similar
   - [ ] Configurar proteção de PR (block if coverage < 70%)
   - [ ] Gerar badges de coverage

3. **Melhorias futuras:**
   - [ ] E2E tests (Playwright/Cypress)
   - [ ] Performance benchmarks
   - [ ] Mutation testing (StrykerJS)

---

## Referências

- [Vitest Coverage Docs](https://vitest.dev/guide/coverage.html)
- [V8 Coverage Provider](https://vitest.dev/config/#coverage-provider)
- [Codecov GitHub Actions](https://github.com/codecov/codecov-action)
