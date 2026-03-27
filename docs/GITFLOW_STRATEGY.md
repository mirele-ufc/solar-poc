# 🌳 GitFlow Strategy — Hierarchia de Branches e Workflow

> **Documento complementar a CLAUDE.md**  
> Define a estratégia completa de branching para o refactoring UFC LMS React.  
> **Referenciado por:** implement-and-commit.agent.md, COMO_COMECAR.md

---

## Visão Geral

Este projeto usa **GitFlow** com 5 tipos de branches hierárquicos:

```
┌─────────────────────────────────────┐
│            PRODUCTION (main)         │
│   (estável, tagged v.X.Y.Z)          │
└────────────▲────────────────────────┘
             │ (merge apenas de development)
             │
┌────────────┴────────────────────────┐
│     INTEGRATION (development)        │
│   (onde você pusheia PRs)             │
└────────────▲──────────────┬──────────┘
             │              │
      ┌──────┴──┐      ┌────┴─────┐
      │          │      │           │
   feature/   bugfix/  hotfix/   (apenas PREP)
   refactor   fix      urgent
     (Fase)  (Bug)   (Produção)
```

---

## 5 Tipos de Branches

### 1. 🌟 `feature/refactor-<dominio>`

**Uso:** Implementar uma fase inteira de refactoring.

**Base:** `development`  
**Destino:** `development` (via PR + code review)

**Naming:**

- `feature/refactor-auth` (Fase 2 - Autenticação)
- `feature/refactor-courses` (Fase 3 - Cursos)
- `feature/refactor-exams` (Fase 4 - Provas)

**Ciclo de Vida:**

```bash
# 1. Criar a partir de development
git checkout development
git pull origin development
git checkout -b feature/refactor-auth

# 2. Fazer commits (múltiplos ao longo da fase)
git commit -m "feat: Integrar login com endpoint POST /auth/login"
git commit -m "refactor: Extrair validações em schema Zod"
git commit -m "test: Adicionar testes para JWT refresh"

# 3. Push para feature branch
git push origin feature/refactor-auth

# 4. Criar PR no GitHub
# Title: [REFACTOR] Auth: Implementar autenticação com JWT
# Description: [lista de objetivos RNF, testes, dependências]

# 5. Code review → Merge em development
# 6. Deletar feature branch (local + remota)
git checkout development
git pull origin development
git branch -d feature/refactor-auth
git push origin --delete feature/refactor-auth
```

---

### 2. 🐛 `bugfix/fix-<tipo>`

**Uso:** Corrigir um bug descoberto durante desenvolvimento.

**Base:** `development`  
**Destino:** `development` (via PR)

**Naming:**

- `bugfix/fix-form-validation` (validação incorreta)
- `bugfix/fix-jwt-refresh` (token refresh não funciona)
- `bugfix/fix-logout-storage` (localStorage não limpa)

**Quando usar:**

- Bug descoberto em development (não em produção)
- Deve ser fixado antes de próxima feature branch
- Exemplo: Testes falhando, comportamento inesperado

**Ciclo de Vida:**

```bash
# 1. Criar bugfix branch
git checkout development
git pull origin development
git checkout -b bugfix/fix-form-validation

# 2. Implementar fix (TDD: RED→GREEN→REFACTOR)
# (mesmo ciclo que feature, mas mais curto)

# 3. Push e PR
git push origin bugfix/fix-form-validation
# PR → review → merge em development

# 4. Deletar
git checkout development
git branch -d bugfix/fix-form-validation
```

---

### 3. 🚨 `hotfix/fix-<severidade>`

**Uso:** Corrigir um bug **crítico em produção** (main).

**Base:** `main`  
**Destino:** `main` **E** `development` (2 PRs)

**Naming:**

- `hotfix/fix-login-crash` (login crashes em produção)
- `hotfix/fix-session-expired` (tokens não expiram)
- `hotfix/fix-data-corruption` (dados corrompidos)

**IMPORTANTE:** Hotfix é a ÚNICA branch que sai de `main` (não de `development`).

**Ciclo de Vida:**

```bash
# 1. Criar hotfix a partir de main
git checkout main
git pull origin main
git checkout -b hotfix/fix-login-crash

# 2. Implementar fix (URGENTE)
git commit -m "fix: Corrigir crash no login quando token expirado"
git commit -m "test: Adicionar teste de regressão para session timeout"

# 3. Push e PR #1 para main
git push origin hotfix/fix-login-crash
# PR #1: hotfix/fix-login-crash → main (PRIORITÁRIO)
# Merge → Tag: v1.0.1

# 4. Fazer o MESMO em development (cherry-pick ou PR #2)
git checkout development
git pull origin development
git checkout -b hotfix/fix-login-crash-backport
git cherry-pick <hash-do-commit>
# PR #2: hotfix/fix-login-crash-backport → development

# 5. Deletar (após ambas PRs mergeadas)
git branch -d hotfix/fix-login-crash
```

---

### 4. 📍 `development` (Permament)

**Uso:** Branch de integração contínua.

**Base:** Recebe PRs de feature/, bugfix/, hotfix/  
**Destino:** Envia PRs para main (periódico, após fases estáveis)

**Características:**

- ✅ Sempre buildable (CI/CD roda em todo PR)
- ✅ Testes passando
- ✅ Code review obrigatório
- ✅ Atualizada regularmente

---

### 5. 🔒 `main` (Permanent)

**Uso:** Branch de produção.

**Base:** Recebe PRs apenas de development  
**Destino:** Nunca faz checkout para trabalhar (é read-only)

**Características:**

- ✅ Sempre stable
- ✅ Tagged com versão (v1.0.0, v1.0.1, v1.1.0)
- ✅ Merges manuais (sem fast-forward)
- ✅ Protegida: requires reviews + CI/CD green

---

## Fluxo Completo (Exemplo: Fase 2 - Autenticação)

```
DIA 1: Iniciar Fase 2
────────────────────
git checkout development
git pull origin development
git checkout -b feature/refactor-auth

DIA 1-3: Implementar (RED→GREEN→REFACTOR)
─────────────────────────────────────────
git commit -m "test: Testes para POST /auth/login"
git commit -m "feat: Integrar login com backend"
git commit -m "refactor: Extrair validações em Zod schema"
git commit -m "feat: Implementar JWT refresh token flow"
git commit -m "test: Testes para token expiration"
git push origin feature/refactor-auth

DIA 3: Code Review + Merge (GitHub UI)
───────────────────────────────────────
# PR aberta: [REFACTOR] Auth: Implementar autenticação com JWT
# Reviews: 2-3 aprovações
# Merge → development (automatic delete branch)

DIA 4: Próxima Fase (3 - Cursos)
─────────────────────────────────
git checkout development
git pull origin development
git checkout -b feature/refactor-cursos
# ... repete ciclo ...

FINAL (após Fase 6): Lançar Produção
────────────────────────────────────
git checkout main
git pull origin main
git checkout -b release/v1.1.0
git merge --no-ff development

# Tag:
git tag -a v1.1.0 -m "Release: Refactoring completo UFC LMS"
git push origin main
git push origin v1.1.0
```

---

## Operação em Múltiplas Máquinas

Antes de iniciar em uma máquina diferente:

```bash
git checkout development
git pull origin development
git fetch --all --prune
git branch --show-current
```

Checklist obrigatório:

- Ler `MEMORY.md` na raiz antes de codificar
- Confirmar branch ativa correta (`development` ou `feature/refactor-*`)
- Validar `apps/poc-react-vite/.env.local` para o backend da máquina atual
- Evitar sessões paralelas na mesma branch em duas máquinas sem sync intermediário

---

## Naming Conventions Detalhadas

### Formato Geral

```
<tipo>/<escopo>-<descrição>

Onde:
- tipo: feature, bugfix, hotfix
- escopo: domínio ou tipo (auth, courses, exams, fix-jwt)
- descrição: breve (2-3 palavras)
```

### Exemplos por Fase

| Fase | Branch                  | Exemplo                               |
| ---- | ----------------------- | ------------------------------------- |
| 0    | feature/refactor-<tema> | feature/refactor-security-routing     |
| 1    | feature/refactor-<tema> | feature/refactor-types-validation     |
| 2    | feature/refactor-<tema> | feature/refactor-auth-backend         |
| 3    | feature/refactor-<tema> | feature/refactor-courses-modules      |
| 4    | feature/refactor-<tema> | feature/refactor-exams-messages       |
| 5    | feature/refactor-<tema> | feature/refactor-deduplication-routes |
| 6    | feature/refactor-<tema> | feature/refactor-hardening-a11y       |

### Bugfix Examples

| Bug                          | Branch                     |
| ---------------------------- | -------------------------- |
| Form validation broken       | bugfix/fix-form-validation |
| JWT refresh not working      | bugfix/fix-jwt-refresh     |
| Logout doesn't clear storage | bugfix/fix-logout-cleanup  |

### Hotfix Examples

| Critical Issue                 | Branch                        |
| ------------------------------ | ----------------------------- |
| Login crashes on expired token | hotfix/fix-login-crash        |
| Session not expiring           | hotfix/fix-session-expiration |
| XSS vulnerability              | hotfix/fix-xss-vulnerability  |

---

## Responsabilidade do Agente de Desenvolvedor (7 Passos)

O agente de desenvolvimento e refatoração assume as seguintes responsabilidades durante a implementação:

### 1. Criar branch feature a partir de development

```bash
git checkout development
git pull origin development
git checkout -b feature/refactor-<dominio>
```

**Validar:** Branch criada localmente, pronta para começar.

---

### 2. Executar refatoração incremental por domínio

- ✅ Manter commits granulares e lógicos (um conceito = um commit)
- ✅ Cada commit deve deixar o código em estado funcionável (sem quebras de build ou tipo)
- ✅ Commits devem aderir a RNF, Clean Code e SOLID do CLAUDE.md

---

### 3. Fazer commit de cada etapa concluída

- Usar comando: `git add <arquivos>` ou `git add .` para stage
- Usar comando: `git commit -m "[TIPO] Descrição"` com idioma e formato correto

**Exemplo durante refactoring de Auth:**

```bash
git commit -m "refactor: Extrair validacoes de autenticacao para schema Zod dedicado"
git commit -m "refactor: Criar custom hook useAuthentication para orquestracao de login"
git commit -m "refactor: Integrar LoginPage com endpoint POST /auth/login"
git commit -m "test: Adicionar testes para validacoes de credenciais"
```

---

### 4. Validar antes de push

**OBRIGATÓRIO:** Todos os checks devem passar:

```bash
pnpm type-check    # ✅ TypeScript
pnpm lint         # ✅ ESLint
pnpm test         # ✅ Vitest
pnpm build        # ✅ Vite build
```

Se qualquer um falhar → **NÃO fazer push**. Corrigir e tentar novamente.

---

### 5. Fazer push para feature branch

```bash
git push origin feature/refactor-<dominio>
```

**Esperado:** Branch criada no GitHub e visível em `https://github.com/user/repo/tree/feature/refactor-<dominio>`

---

### 6. Criar Pull Request

**Obrigatório usar template completo:**

- **Título:** `[REFACTOR] <Domínio>: <Resumo>`
- **Descrição:** Seguir template (Objetivos, Mudanças, Testes, Dependências, Checklist)
- **Reviewers:** Atribuir 2+ reviewers
- **Labels:** `phase-X`, `refactor`, `type-typescript` (se aplicável)

(Ver seção "PR Template Completo" para exemplo)

**Estado esperado:**

- ✅ CI/CD rodando (GitHub Actions)
- ⏳ Aguardando reviews

---

### 7. Acompanhar code review e mergear quando aprovado

**Fluxo:**

1. Reviewers comentam / aprovam
2. Resolver comentários (se houver) → novo commit
3. Após 2+ aprovações + CI/CD verde ✅
4. **Merge em development** via GitHub UI (não local)
5. **Deletar feature branch** (automático ou manual)

**Local:**

```bash
git checkout development
git pull origin development
git branch -d feature/refactor-<dominio>
```

---

## Rastreabilidade de Commits

### Formato de Commit

```
[TIPO] Descrição curta (max 72 caracteres)

[corpo opcional - explica "por que"]
```

### ⚠️ Regra Crítica: Cada Commit Deve Deixar Código Funcionável

**OBRIGATÓRIO:** Cada commit individual deve estar buildável e sem quebras de tipo.

```bash
# ✅ BOM: Cada etapa é independente e funciona
git commit -m "test: Testes para ProtectedRoute (sem token, role inválido)"
git commit -m "feat: Implementar ProtectedRoute com validação"
git commit -m "refactor: Extrair validação de role em função pura"
# Build após cada commit: ✅ ✅ ✅

# ❌ RUIM: Deixa código quebrado entre commits
git commit -m "feat: Extrair validação (ainda não usada - ERRO TYPE)"
git commit -m "feat: Implementar ProtectedRoute (encontra validação)"
# Build após commit 1: ❌ QUEBRADO
# Build após commit 2: ✅ OK
```

**Impacto:** Agentes e reviewers devem conseguir fazer `pnpm build` após cada commit.

---

### Tipos de Commit

| Tipo       | Mapa                  | Exemplo                                                               |
| ---------- | --------------------- | --------------------------------------------------------------------- |
| `feat`     | RF (novo requisito)   | feat: Integrar login com endpoint POST /auth/login                    |
| `refactor` | RNF (qualidade)       | refactor: Extrair validações de autenticação para schema Zod          |
| `test`     | RNF (TDD obrigatório) | test: Adicionar testes para ProtectedRoute (sem token, role inválido) |
| `fix`      | RN (correção)         | fix: Logout não limpava localStorage                                  |
| `docs`     | RNF (documentação)    | docs: Atualizar MEMORY.md com subtarefa 0.1 completa                  |
| `chore`    | —                     | chore: Atualizar dependências, setup husky                            |

### Associação com Regras

Cada commit **deve estar associado** a pelo menos uma regra:

```
✅ BOM:
feat: Implementar ProtectedRoute com validação de role [RF12, RN01]
Faz ProtectedRoute bloquear rotas sem token e valida role.

❌ RUIM:
feat: Update auth handling
Não fica claro qual RF/RN está sendo implementado.

✅ COM CORPO:
refactor: Migrar LoginPage para usar custom hook useAuthentication

O hook centraliza a lógica de autenticação, JWT, e estado de sessão.
Benefício: redução de acoplamento, facilita testes, alinha com RNF20 (SOLID).
Referência: CLAUDE.md § Diretrizes de Engenharia Frontend
```

---

### Checklist Final de Merge

```
☐ Code review aprovado (2+ reviewers)

☐ CI/CD green (tests, lint, build)

☐ MEMORY.md atualizado com subtarefa

☐ Merge em development (via GitHub UI)

☐ Feature branch deletada (automático)

☐ Limpeza Local (OBRIGATÓRIO após merge):
  git checkout development
  git pull origin development
  git branch -d feature/refactor-<dominio>  # Local
  # Se não deletou automaticamente:
  git push origin --delete feature/refactor-<dominio>  # Remota

☐ Próxima subtarefa:
  /status-refactoring (refresh)
  "Implemente X.Y (Próxima)"
```

---

## PR Template Completo (Exemplo Reproducido de CLAUDE.md)

### Quando Abrir PR

Após push de feature branch, **sempre use este template**:

```markdown
# [REFACTOR] Auth: Refatorar componentes de login e registro com Clean Code + JWT

## Objetivos

- RNF19: Clean Code (funções pequenas, baixo acoplamento)
- RNF20: SOLID (separar apresentação, orquestracao, dados)
- RNF22: Naming semântico
- RNF25: Lazy loading de formulários complexos

## Mudanças Principais

- Extrair validações Zod em `schema/authSchema.ts`
- Criar custom hook `useAuthentication` para orquestra login/logout
- Integrar `LoginPage` com endpoint real `POST /auth/login`
- Implementar JWT refresh token flow com cookies httpOnly

## Testes Adicionados

- Validações de email/CPF (Zod schema)
- Comportamento de timeout de sessão (30 min)
- Fallback para erro de conexão com mensagem ao usuário (sem endpoint não contratual)
- Token refresh automático em background

## Dependências / Blockers

- Backend: Endpoint `POST /auth/login` (documentado em `.claude/commands/doc/arquitetura.md`)
- Nenhum blocker identificado

## Checklist Dev

- [x] `pnpm type-check` ✅
- [x] `pnpm lint` ✅
- [x] `pnpm test` ✅
- [x] `pnpm build` ✅
- [x] MEMORY.md atualizado
- [x] Cada commit deixa código buildável
```

### Regras do Template

1. **Title:** `[REFACTOR] <Domínio>: <Descrição Breve>`
2. **Objetivos:** Listar pelo menos 2 RNFs que essa PR endereça
3. **Mudanças:** Listar arquivos criados/modificados com a intencao
4. **Testes:** Descrever cobertura (não apenas "sim/não")
5. **Dependências:** Se espera por algo do backend
6. **Checklist:** Dev marca o que completou

---

## Fluxo Completo Diário (Para Dev)

### P: Devo fazer merge de feature em main após completar uma fase?

**R:** Não durante o desenvolvimento. A estratégia é:

- Fases 0-6 → feature branches → PRs → development
- Após Fase 6 completa → development → main (1 grande merge com tag de release)

### P: Se descobrir bug DURANTE implementação de fase, faço bugfix ou continuo?

**R:** Depende:

- **Bug na subtarefa atual:** Corrija na mesma feature branch, novo commit
- **Bug não relacionado:** Cria bugfix/xxx, arruma, volta à feature depois

Exemplo:

```bash
# Estava em feature/refactor-auth, descobriu bug em form validation
git checkout -b bugfix/fix-form-validation
# ... fix ...
git push → PR → merge development
# Volta:
git checkout feature/refactor-auth
git merge development (trazer fix)
```

### P: Se ouver conflito em merge, o que faço?

**R:** Git vai avisar. Resolva manualmente:

```bash
git merge development  # Ou git pull se já mergeou
# Abra arquivos com <<<<<<< >>>>>>
# Escolha qual versão manter
git add <arquivos>
git commit -m "merge: Resolver conflitos com development"
```

### P: Posso fazer push direto em development sem PR?

**R:** **Não**. Workflow obrigatório:

1. Design: `git checkout -b feature/refactor-X`
2. Code: commits
3. Validar: type-check, lint, test, build
4. Push: `git push origin feature/refactor-X`
5. PR: criar no GitHub com template
6. Review: 2+ aprovações
7. Merge: via GitHub (não local)

### P: Qual o tempo ideal pra deixar feature branch aberta?

**R:** 1-3 dias (uma subtarefa = ~1-1.5 dias para Fases 0-2).

Fases mais complexas (3-6) podem ser 2-3 dias.

Se ficar > 5 dias aberta → possível blocker → documentar em MEMORY.md.

### P: Como fazer se precisar de feature branch de feature?

**R:** Não faça. Estrutura é flat:

- Todas features saem de `development`
- Não há sub-branches

Se precisa de organização: use labels no GitHub (label: phase-2, label: auth).

---

## Proteção de Branches (GitHub Configuração)

### Regras para `main`

```
✅ Require pull request reviews before merging (2+ reviewers)
✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - ✅ Require code quality checks
✅ Require code reviews from owners (CODEOWNERS)
✅ Dismiss stale pull request approvals
✅ Include administrators in restrictions
```

### Regras para `development`

```
✅ Require pull request reviews before merging (1+ reviewer)
✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - ✅ Require tests to pass
✅ Allow force pushes (optional, para fix-up commits)
```

---

## Integração com Agentes

### Agente: `implement-and-commit.agent.md`

**Deve:**

- ✅ Fazer `git checkout development; git pull` antes de criar feature branch
- ✅ Criar `git checkout -b feature/refactor-<dominio>` na PREP stage
- ✅ Validar GitFlow antes de iniciar
- ✅ Gerar e exibir relatório completo de planejamento Git (`📋 PLANEJAMENTO GIT`: estado, branches, commits, publicação) **antes** de perguntar ao usuário (seguir/ajustar)
- ✅ Fazer `git push origin feature/refactor-<dominio>` após commits
- ✅ Reportar nome da feature branch e PR link

### Agente: `status-refactoring.agent.md`

**Deve:**

- ✅ Mostrar branch atual em status
- ✅ Alertar se dev está em branch errada (ex: ainda em hotfix depois de merge)
- ✅ Sugerir `git checkout development` se necessário

---

## Referências

- **CLAUDE.md** § Estrutura de Branches (GitFlow) — Definitions
- **implement-and-commit.agent.md** § Fase 1 PREP — GitFlow setup
- **COMO_COMECAR.md** § 4. Começar Fase 0 — Branch creation example
- **GitHub GitFlow Guide:** https://guides.github.com/introduction/flow/

---

**Versão:** 1.0  
**Data:** 24/03/2026  
**Status:** ✅ Ready for Implementation
