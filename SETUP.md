# SETUP — Como Continuar o Desenvolvimento em Outra Máquina

## Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** >= 9 ou **pnpm** >= 8 (este projeto usa pnpm)
- **Git** com acesso ao repositório
- **Visual Studio Code** (opcional, recomendado)

---

## Passo 1: Clonar Repositório (ou sincronizar)

```bash
# Se começando do zero:
cd c:\Users\<seu-usuario>\poc\
git clone <repo-url> solar-poc
cd solar-poc
git checkout development  # ou feature/refactor-auth-data-layer

# Se já tem repo local:
cd c:\Users\<seu-usuario>\poc\solar-poc
git pull origin development
```

---

## Passo 2: Instalar Dependências

```bash
# Com pnpm (recomendado — mais rápido)
pnpm install

# Ou com npm
npm install
```

**Nota:** `pnpm-lock.yaml` é o lockfile. Se estiver desatualizado, rodar:
```bash
pnpm install --frozen-lockfile
```

---

## Passo 3: Configurar Variáveis de Ambiente

Copiar `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

**Abrir `.env.local` e preencher:**
```
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
VITE_DEBUG_MODE=false
VITE_ENABLE_STUDENT_FEATURES=false
```

---

## Passo 4: Validar Setup Frontend

```bash
# Type-checking (validar tipos TypeScript)
npm run type-check

# Linting (verificar código)
npm run lint

# Build (teste de compilação)
npm run build

# Dev server (rodar aplicação)
npm run dev
# Acessar http://localhost:5173
```

Se tudo passar, frontend está pronto. Se houver erro, ver **Troubleshooting** abaixo.

---

## Passo 5: Verificar Backend

O backend deve estar rodando em `http://localhost:8080`:

### Opção A: Executar localmente (Java + Maven)

```bash
cd .backend
mvn clean install
mvn spring-boot:run
```

**Verificar conectividade:**
```bash
curl http://localhost:8080/actuator/health
# Esperado: {"status":"UP"}
```

### Opção B: Usar Docker (se disponível)

```bash
cd .backend
docker-compose up -d
```

---

## Passo 6: Ler Documentação Essencial

**Antes de começar, ler nesta ordem:**

1. **`CLAUDE.md`** — Principais convenções, stack, diretrizes de código
2. **`MEMORY.md`** — Status atual do progresso e próxima ação
3. **`/memories/session/plan.md`** — Plano detalhado de refatoração (5 fases)
4. **`.claude/commands/doc/arquitetura.md`** — Endpoints da API REST

---

## Retomando o Trabalho (Importante!)

### Ao entrar em outra máquina:

1. **Ler `MEMORY.md`** (nesta raiz)
   - Identificar qual foi a última ação concluída
   - Ler seção "Próxima Ação"

2. **Ir para `/memories/session/plan.md`**
   - Localizar a Fase + Story indicada em MEMORY.md
   - Ler a descrição detalhada

3. **Executar a story** conforme plano
   - Criar/modificar arquivos
   - Rodar validações (`npm run type-check`, `npm run lint`)
   - Fazer commits granulares

4. **Atualizar `MEMORY.md`**
   ```markdown
   **Última atualização:** 2026-04-XX T14:00:00Z
   | 0.1 | Setup | ✅ DONE | 1/1 | 0/0 | Type-check OK |
   
   **Próxima Ação:**
   **Story:** 1.0 — Zustand auth store
   ...
   ```

5. **Fazer push antes de mudar de máquina**
   ```bash
   git add MEMORY.md
   git commit -m "chore: Atualizar MEMORY.md — Story 0.1 concluída"
   git push origin feature/refactor-auth-data-layer
   ```

---

## Estrutura de Diretórios (Para Referência)

```
solar-poc/
├── src/
│   ├── app/
│   │   ├── components/          ← Componentes React (apresentação)
│   │   ├── routes.ts            ← Roteamento
│   │   ├── App.tsx
│   │   └── context/             ← AppContext (será substituído por Zustand)
│   ├── services/                ← NOVO: Camada de HTTP
│   │   ├── api/
│   │   │   ├── client.ts        ← Axios client com JWT
│   │   │   └── endpoints.ts     ← Constantes de endpoints
│   │   └── auth/
│   │       └── service.ts       ← Lógica de autenticação
│   ├── store/                   ← NOVO: Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useCourseStore.ts
│   │   └── ...
│   ├── hooks/                   ← NOVO: Custom hooks
│   │   ├── useAuthentication.ts
│   │   ├── queries/
│   │   │   ├── useCourses.ts
│   │   │   └── ...
│   │   └── mutations/
│   │       ├── useCourses.ts
│   │       └── ...
│   ├── types/                   ← NOVO: TypeScript types
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── errors.ts
│   ├── validations/             ← NOVO: Zod schemas
│   │   ├── authSchema.ts
│   │   ├── courseSchema.ts
│   │   └── ...
│   ├── utils/                   ← NOVO: Funções auxiliares
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── errorHandler.ts
│   ├── __tests__/               ← NOVO: Testes
│   │   └── unit/
│   │       └── hooks/
│   ├── styles/
│   ├── assets/
│   ├── imports/
│   └── main.tsx
├── MEMORY.md                    ← Rastreamento de progresso
├── SETUP.md                     ← Este arquivo
├── .env.example                 ← Variáveis de ambiente
├── .env.local                   ← Seu arquivo local (gitignored)
├── CLAUDE.md                    ← Diretrizes
├── .claude/commands/doc/        ← Documentação contratual
├── .backend/                    ← Backend Spring Boot
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
└── ...
```

---

## Convenções de Commits

**Sempre usar português no imperativo:**

```bash
git commit -m "[TIPO] Descrição curta (max 72 caracteres)

Corpo explicando o porquê (opcional).
Story: X.Y.Z

Referências:
- Issue #123
"
```

### Tipos de Commit

- **`feat:`** — Nova funcionalidade (mapeia RF)
- **`refactor:`** — Melhoria de código, SOLID, Clean Code (mapeia RNF)
- **`fix:`** — Correção de bug (mapeia bugfix)
- **`test:`** — Adicionar ou melhorar testes
- **`docs:`** — Atualizar documentação
- **`chore:`** — Dependências, setup, CI/CD

### Exemplos

```bash
# Novo feature
git commit -m "feat: Integrar login com endpoint POST /auth/login

Implementa JWT real, remove mock credentials.
Story: 1.0"

# Refactoring
git commit -m "refactor: Extrair validações de auth para schema Zod

Centraliza regras de validação em schema reutilizável.
Story: 1.1"

# Fix
git commit -m "fix: Corrigir validação de CPF em cadastro

CPF inválido estava passando na validação cliente.
Story: 1.1.1"

# Atualizar MEMORY.md
git commit -m "chore: Atualizar MEMORY.md — Sprint X completa

Status: X/Y stories concluídas"
```

---

## Troubleshooting

### ❌ "pnpm: command not found"

**Solução 1:** Instalar pnpm globalmente
```bash
npm install -g pnpm
```

**Solução 2:** Usar npm ao invés de pnpm
```bash
npm install
npm run dev
```

---

### ❌ Porta 5173 já em uso

**Solução:** Rodar em porta diferente
```bash
npm run dev -- --port 3000
# Acessar http://localhost:3000
```

Ou mudar em `vite.config.ts`:
```typescript
export default {
  server: {
    port: 3000,
  },
};
```

---

### ❌ Erro ao conectar backend (CORS, etc)

**Verificar se backend está rodando:**
```bash
curl http://localhost:8080/actuator/health
```

Se não responder, start backend conforme **Passo 5** acima.

**Se backend está rodando mas ainda dá erro CORS:**
- Backend precisa estar configurado com CORS permitido para `http://localhost:5173`
- Verificar `application.yml` em `.backend/src/main/resources/`

---

### ❌ "Build failed: not all code is typed correctly"

**Solução:** Rodar type-check para ver erros detalhados
```bash
npm run type-check
# Lê erros e corrige em src/
```

Ou usar VS Code com TypeScript language server ativado.

---

### ❌ Dependências faltando após clone

```bash
# Limpar cache
rm -rf node_modules pnpm-lock.yaml

# Reinstalar
pnpm install
```

---

### ❌ Git commits não estão indo

**Verificar remota:**
```bash
git remote -v
# Esperado: origin <repo-url>

# Se falta, adicionar:
git remote add origin <repo-url>

# Push forçado (cuidado!)
git push -u origin feature/refactor-auth-data-layer
```

---

## Perguntas Frequentes

### P: Como saber se estou no caminho certo?

**R:** Verifique `MEMORY.md`:
- Ler seção "Próxima Ação"
- Confirmar que está naquela story
- Seguir plano em `/memories/session/plan.md`
- Se não está, atualizar `MEMORY.md` com novo status

### P: E se encontrar um bloqueador?

**R:** Document em `MEMORY.md` na seção "Bloqueadores":

```markdown
## Bloqueadores

- **Story 1.2:** Erro ao chamar POST /auth/login
  - Repro: Fazer login no form
  - Erro: 401 Unauthorized
  - Esperado: 200 + JWT token
  - Ação: Validar se backend está rodando, se (CORS OK)
```

Depois, criar issue ou conversar com time.

### P: Como sincronizar entre máquinas?

**R:** Antes de trocar de máquina:

1. Atualizar `MEMORY.md` com status atual
2. Fazer commit + push
   ```bash
   git add MEMORY.md
   git commit -m "chore: Atualizar MEMORY.md — pausada em story X.Y"
   git push origin feature/refactor-auth-data-layer
   ```
3. Ao chegar na outra máquina, fazer `git pull` e ler `MEMORY.md`

### P: TypeScript strict mode está muito restritivo?

**R:** Isso é intencional (ver `CLAUDE.md` — "Tipos TypeScript explicitos, nunca `any`"). Seguir o padrão:
- Sempre importar tipos: `import type { User } from 'src/types'`
- Nunca usar `any`
- Se tipo é muito complexo, extrair para `src/types/`

### P: Preciso de novo endpoint API?

**R:** Atualizar `.claude/commands/doc/arquitetura.md` primeiro (faz parte do contrato). Depois:
1. Implementar no backend
2. Adicionar type em `src/types/api.ts`
3. Criar hook em `src/hooks/queries/` ou `mutations/`
4. Atualizar `src/services/api/endpoints.ts`

---

## Links Úteis

- **Node.js:** https://nodejs.org/
- **pnpm:** https://pnpm.io/installation
- **Vite:** https://vitejs.dev/
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/
- **Zustand:** https://github.com/pmndrs/zustand
- **TanStack Query:** https://tanstack.com/query/latest
- **Zod:** https://zod.dev/
- **VS Code:** https://code.visualstudio.com/

---

**Última atualização:** 2026-04-01
**Mantido por:** GitHub Copilot
