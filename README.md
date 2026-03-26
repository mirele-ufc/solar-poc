# 🎓 UFC LMS — Plataforma de Aprendizado com React

> **Refatoração Frontend com TDD e Backend Integration**

[![Status](https://img.shields.io/badge/Status-Pronto%20para%20Implementação-brightgreen)]()
[![Subtarefas](https://img.shields.io/badge/Subtarefas-43%20%2F%206%20Fases-blue)]()
[![Endpoints](https://img.shields.io/badge/Endpoints-39%20Oficiais-orange)]()
[![Timeline](https://img.shields.io/badge/Timeline-11--17%20semanas-yellow)]()

---

## 🚀 Comece em 3 Passos (5 minutos)

```bash
# 1. Clonar e instalar
git clone <seu-repo> && cd ava-poc-react && pnpm install

# 2. Validar contexto
/start-implementation

# 3. Ver status
/status-refactoring
# Só depois escolha explicitamente a subtarefa a executar
```

✅ Cada agente tem uma função específica: validar, mostrar status ou executar.

👉 **Novo em agentes?** Siga seção **"🤖 Seu Workflow com Agentes"** abaixo.

---

## 📚 O Que é Este Projeto?

### Visão Geral

Este é um **projeto de refatoração frontend**. Estamos migrando de um frontend 100% com dados mockados para um frontend integrado com um backend real em **Spring Boot 3.4**.

**Objetivo:** Garantir que novo código seja:

- ✅ **Testado** (TDD: testes primeiro)
- ✅ **Bem estruturado** (Clean Code, SOLID)
- ✅ **Documentado** (cada feature tem guia claro)
- ✅ **Seguro** (validações no backend)

### Stack Tecnológico

| Tipo            | Stack                               |
| --------------- | ----------------------------------- |
| **Frontend**    | React 18+, TypeScript, Vite         |
| **Estado**      | Zustand + React Query               |
| **Validação**   | Zod                                 |
| **Componentes** | Shadcn UI, Tailwind CSS             |
| **Testes**      | Vitest + @testing-library/react     |
| **Backend**     | Spring Boot 3.4, PostgreSQL 16, JWT |

---

## 🤖 Como Usar os 3 Agentes Autônomos

Você tem 3 agentes que trabalham para você:

### 1️⃣ `/start-implementation` — Validar Contexto

Usa quando: primeira vez, ou para validar que tudo está OK.

```bash
/start-implementation
```

**O que faz:**

- ✅ Verifica todos 6 arquivos de documentação
- ✅ Confirma plano de 43 subtarefas
- ✅ Valida baseline contratual estrito de endpoints (somente arquitetura.md)
- ✅ Confirma 5 gaps integrados
- ✅ Sincroniza versões
- ✅ Apenas valida e reporta; não começa a implementação

**Resultado esperado:**

```
✅ CONTEXTO VALIDADO COM SUCESSO
Status: PRONTO PARA IMPLEMENTAÇÃO
```

**O que não faz:**

- ❌ Não modifica código do projeto
- ❌ Não escreve testes
- ❌ Não inicia automaticamente a Fase 0.1

---

### 2️⃣ `/status-refactoring` — Dashboard de Progresso

Usa quando: quer saber onde está, qual fazer depois, se há blockers.

```bash
/status-refactoring
```

**Retorna:**

- 📊 Resumo (fase, %, próximas ready)
- ✅ Últimas 5 completas
- 🏃 Próximas 3 prontas (duração + deps)
- 📈 Velocidade e timeline
- ⛔ Blockers (se houver)
- 💡 Recomendação de próxima ação

**Exemplo:**

```
Fase 0: 0/7 (0%)
Próximas 3 ready:
1. 0.1 — ProtectedRoute (1 dia)
2. 0.2 — Integrar ProtectedRoute (1.5 dias)
3. 0.3 — Cleanup rotas (0.5 dias)

💡 Próxima: "Deseja autorizar o handoff para o executor em 0.1 (ProtectedRoute com TDD)?"
```

---

### 3️⃣ `Implemente X.Y (Título)` — Executar Subtarefa

Usa quando: decidiu qual subtarefa fazer.

```bash
Implemente 0.1 (ProtectedRoute com TDD)
```

**O que faz (com autorização explícita do usuário):**

1. 🔴 **RED:** Escreve testes que falham
2. 🟢 **GREEN:** Implementa código que passa
3. 🔵 **REFACTOR:** Limpa código
4. 📝 **DOCS:** Atualiza MEMORY.MD

**As duas etapas abaixo não foram completamente implementadas e devem ser chamadas caso não executadas automaticamente**
**Sugestão: peça para que MEMORY.MD seja commitado por último e atualizado com os hashes dos commits feitos antes do seu commit** 5. 🧭 **GIT (Planejamento):** Define branch/commits/publicação e pergunta se usuário deseja seguir ou ajustar 6. 📤 **GIT (Execução):** Commit, push e PR somente se o usuário autorizar

**Autorizações obrigatórias:**

- ✅ Autorizar o handoff para o executor
- ✅ Autorizar commits git
- ✅ Autorizar `git push` e PR
- ✅ Autorizar seguir para a próxima subtarefa ou fase

**Resultado:**

```
✅ IMPLEMENTAÇÃO CONCLUÍDA

Subtarefa: 0.1 (ProtectedRoute)
Commits: 5 (test, feat, refactor, refactor, docs)
Planejamento Git: seguido/ajustado (conforme decisão do usuário)
Status: PRONTO PARA MERGE
Próxima: 0.2 (ready em ~1.5 dias)
```

---

### Seu Dia Típico com Agentes

```
MANHÃ:
1. /start-implementation (validar)
2. /status-refactoring (ver que fazer)

DURANTE O DIA:
3. Escolha explicitamente a subtarefa
4. Autorize o handoff para o executor
5. Implemente 0.1 (ProtectedRoute com TDD)
  → Executor faz RED→GREEN→REFACTOR e só publica no git com autorização
**Talvez seja necessário solicitar que etapa de planejamento do git seja feita**

6. (Opcional) Se tiver tempo:
   /status-refactoring
  Autorize nova execução somente se quiser seguir

FIM DO DIA:
7. PRs abertos → code review → merge
8. MEMORY.MD atualizado após execução autorizada ✅
```

---

## 🤖 Como Usar o Agente `/start-implementation` (Detalhado)

---

## 🤖 Seu Workflow com Agentes

Você NÃO faz tudo manual. Temos **3 agentes autônomos** que trabalham para você:

### 1. `/start-implementation` — Validar Contexto

**Quando usar:** Primeira vez executando, ou para validar que tudo está OK.

```
/start-implementation
```

**O que faz:**

- ✅ Verifica se todos 6 arquivos de documentação existem em `/docs/`
- ✅ Confirma que o plano tem 43 subtarefas
- ✅ Valida baseline contratual estrito (somente endpoints oficiais)
- ✅ Confirma que 5 gaps foram integrados
- ✅ Valida regras de negócio
- ✅ Sincroniza versões entre documentos
- ✅ Apenas retorna um relatório de prontidão

**O que não faz:**

- ❌ Não cria nem altera código
- ❌ Não executa subtarefas do plano
- ❌ Não substitui o comando `Implemente X.Y (Título)`

**Resultado esperado:**

```
✅ CONTEXTO VALIDADO COM SUCESSO
Status: PRONTO PARA IMPLEMENTAÇÃO
Próximo passo: Execute /status-refactoring ou autorize explicitamente handoff para o executor
```

---

### 2. `/status-refactoring` — Ver Onde Você Está

**Quando usar:** Toda vez que quer saber progresso, qual fazer depois, se há blockers.

```
/status-refactoring
```

**O que retorna:**

- 📊 Resumo atual (fase, % completado, próximas ready)
- ✅ Últimas 5 subtarefas completadas
- 🏃 Próximas 3 prontas para fazer (com duração e deps)
- 📈 Velocidade (subtarefas/dia) e timeline estimada
- ⛔ Blockers (se houver)
- 💡 Recomendação de próxima ação

**Exemplo de output:**

```
╔═══════════════════════════════════════════════════╗
║    📊 STATUS — REFACTORING UFC LMS REACT FRONTEND  ║
╚═══════════════════════════════════════════════════╝

Fase 0 — Segurança (progresso: 0/7, 0%)
Próximas 3 ready:
1. 0.1 — ProtectedRoute (1 dia)
2. 0.2 — Integrar ProtectedRoute (1.5 dias)
3. 0.3 — Cleanup rotas (0.5 dias)

Velocidade: [será calculada após primeira]
Estimativa final: Mai 2026

💡 Próxima ação: "Deseja autorizar o handoff para o executor em 0.1 (ProtectedRoute com TDD)?"
```

---

### 3. `Implemente X.Y (Título)` — Executar Uma Subtarefa

**Quando usar:** Depois de ver o status e decidir qual subtarefa fazer.

```
Implemente 0.1 (ProtectedRoute com TDD)
```

**O que faz (após autorizações explícitas):**

1. 🔴 **RED:** Escreve testes que FALHAM
2. 🟢 **GREEN:** Implementa código que faz testes PASSAREM
3. 🔵 **REFACTOR:** Limpa código, segue SOLID
4. 📝 **DOCS:** Atualiza `MEMORY.MD` com progresso

**As duas etapas abaixo não foram completamente implementadas e devem ser chamadas caso não executadas automaticamente**
**Sugestão: peça para que MEMORY.MD seja commitado por último e atualizado com os hashes dos commits feitos antes do seu commit** 5. 🧭 **GIT (Planejamento):** monta plano de branch/commits/publicação e pede decisão do usuário 6. 📤 **GIT (Execução):** faz git commit + push + PR somente se autorizado 7. ✅ **REPORT:** mostra estado da subtarefa, etapa Git e próxima ready

**Antes de prosseguir, o agente deve pedir autorização para:**

- handoff vindo de `/start-implementation` ou `/status-refactoring`
- seguir o planejamento Git proposto ou ajustar esse planejamento
- criar commits
- fazer `git push` e abrir/atualizar PR
- seguir para a próxima subtarefa ou próxima fase

**Resultado esperado:**

```
✅ IMPLEMENTAÇÃO CONCLUÍDA

Subtarefa: 0.1 (ProtectedRoute com TDD)
Commits: 5
├─ test: Adicionar testes para ProtectedRoute
├─ feat: Implementar ProtectedRoute
├─ refactor: Extrair lógica em funções
├─ refactor: Corrigir tipos TypeScript
└─ docs: Atualizar MEMORY.MD

Planejamento Git: seguido/ajustado (conforme decisão do usuário)

Status: ✅ PRONTO PARA MERGE
Próxima: 0.2 (pronta em ~1.5 dias)
```

---

### Seu Ciclo Diário

```
MANHÃ:
  1. git pull origin development
  2. /start-implementation (validar)
  3. /status-refactoring (ver que fazer)

DURANTE O DIA:
  4. Autorize o handoff para o executor, se quiser continuar
  5. Implemente 0.1 (ProtectedRoute com TDD)
    [Executor roda RED→GREEN→REFACTOR e pede autorização para ações de git]

  6. (Opcional) Se tiver tempo extra:
     /status-refactoring (ver próxima)
    Autorize nova execução apenas se quiser seguir

FINAL DO DIA:
  7. PRs estão abertos no GitHub se houve autorização de publicação
  8. Próxima subtarefa fica apenas recomendada, não iniciada automaticamente
  9. MEMORY.MD atualizado após execução autorizada ✅
```

---

## 📖 Documentação Estruturada em `/docs`

Toda a documentação está em [`docs/`](docs/) — **comece por esta ordem:**

### 1️⃣ [`docs/README.md`](docs/README.md)

**5 minutos**

- Links e mapa da documentação
- Resumo das 7 fases numeradas (0-6)
- Endpoints por domínio

### 2️⃣ [`docs/COMO_COMECAR.md`](docs/COMO_COMECAR.md) ← **COMECE AQUI!**

**10-20 minutos**

- Setup local (Node, pnpm, backend)
- Como ler a documentação
- Validação com backend
- **TDD walkthrough prático** para Fase 0.1 (ProtectedRoute)

### 3️⃣ [`docs/REFACTORING_QUICK_REFERENCE.md`](docs/REFACTORING_QUICK_REFERENCE.md)

**10 minutos**

- 7 fases numeradas (0-6) resumidas em 1 página
- baseline contratual estrito de endpoints em `.claude/commands/doc/arquitetura.md`
- rotas sem endpoint oficial devem ser removidas do escopo ativo
- 12 regras de negócio
- Padrões de commit e TDD

### 4️⃣ [`docs/REFACTORING_PLAN_GRANULAR_V2.md`](docs/REFACTORING_PLAN_GRANULAR_V2.md)

**20-30 minutos** (consulta conforme necessário)

- Cada subtarefa em detalhe
- Testes esperados
- Commits recomendados
- Duração estimada

### 5️⃣ [`docs/MULTI_FRONTEND_ROADMAP.md`](docs/MULTI_FRONTEND_ROADMAP.md)

**Futura escalação**

- Como expandir para Vue/Next.js depois
- Arquitetura Turbo monorepo

---

## 📋 O Que é o Plano de 43 Subtarefas?

### Resumo das 7 Fases Numeradas (0-6)

**Desconsiderem os prazos criados pela IA**

```
FASE 0 (1-2 semanas) — Segurança
├─ ProtectedRoute (guard de rotas)
├─ Role-based access control
├─ HTTP error handling
└─ 7 subtarefas

FASE 1 (1-2 semanas) — Tipos & Validação
├─ TypeScript types consolidados
├─ Zod schemas centralizados
├─ Slots Pattern (componentes reutilizáveis)
└─ 6 subtarefas

FASE 2 (2-3 semanas) — Autenticação
├─ Login/Register
├─ JWT refresh token
├─ Profile page
└─ 7 subtarefas

FASE 3 (2-3 semanas) — Cursos & Módulos
├─ Courses page
├─ Modules management
├─ Lessons with CKEditor
└─ 6 subtarefas

FASE 4 (2-3 semanas) — Provas & Conformidade Contratual
├─ Exams (create, take, results)
├─ Remoção de fluxos legados sem endpoint oficial
├─ AI quiz generation (Spring AI)
└─ 7 subtarefas

FASE 5 (1-2 semanas) — Deduplicação
├─ Componentes compartilhadas
├─ Rotas genéricas
└─ 4 subtarefas

FASE 6 (1-2 semanas) — Hardening
├─ Breadcrumbs, A11y, i18n
├─ PR governance
└─ 6 subtarefas

TOTAL: 43 subtarefas | 11-17 semanas
```

### O Que Significa "Subtarefa"?

Cada subtarefa é **1-2 dias de trabalho** e inclui:

1. **O que fazer:** Descrição clara
2. **Arquivos:** Quais criar/modificar
3. **Testes:** Testes que devem passar
4. **Commits:** Como fazer commit (em português)
5. **Duração:** Estimativa realista

**Exemplo: Subtarefa 0.1 (Criar ProtectedRoute)**

```
Arquivo: src/components/ProtectedRoute.tsx (novo)
Testes:  4 testes (sem token, role inválido, com sucesso)
Duração: 1 dia
Commits:
  - feat: Criar ProtectedRoute com validação de autenticação
  - test: Adicionar testes para ProtectedRoute
```

---

## ⚡ Seu Fluxo de Trabalho (Como Dev Junior)

### Dia 1: Setup & Validação

```bash
# 1. Clonar projeto
git clone <repo>
cd ava-poc-react

# 2. Instalar dependências
pnpm install

# 3. Validar contexto (agente)
/start-implementation

# 4. Ver status e escolher explicitamente a próxima subtarefa
/status-refactoring

# 5. Ler documentação (em `docs/`)
cat docs/COMO_COMECAR.md

# 6. Confirmar que backend está rodando
curl http://localhost:8080/health
```

### Dia 2: Começar Coding (Fase 0.1)

```bash
# 1. Criar branch
git checkout -b feature/refactor-phase-0

# 2. Criar arquivo com teste falhando (TDD - Step RED)
touch src/__tests__/ProtectedRoute.test.tsx
# ... escrever testes

# 3. Rodar testes (vão falhar ❌)
pnpm test

# 4. Implementar código (TDD - Step GREEN)
touch src/components/ProtectedRoute.tsx
# ... implementar a lógica

# 5. Rodar testes novamente (vão passar ✅)
pnpm test

# 6. Melhorar código (TDD - Step REFACTOR)
# ... limpar, extrair funções

# 7. Commit em português
git add .
git commit -m "feat: Criar ProtectedRoute com validação de autenticação"

# 8. Push e PR
git push origin feature/refactor-phase-0
# Abrir PR no GitHub
```

### Cíclico

Repita para cada subtarefa (0.2, 0.3, ... até Fase 6.7).

---

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Desenvolvimento (com hot reload)
pnpm dev

# Build para produção
pnpm build

# Rodar testes
pnpm test

# Rodar tests em modo watch
pnpm test:watch

# Linting
pnpm lint

# Type checking
pnpm type-check

# Validar contexto
/start-implementation
```

---

## ❓ Dúvidas Frequentes

### P: Por onde começar?

**R:** Siga estes passos em ordem:

1. `git clone` + `pnpm install`
2. `/start-implementation` (valida contexto)
3. `/status-refactoring` (ver próxima subtarefa ready)
4. Ler `docs/COMO_COMECAR.md` (10-15 min)
5. Ler `docs/REFACTORING_QUICK_REFERENCE.md` (10 min)
6. Se decidir executar, autorize explicitamente o handoff e então use `Implemente X.Y (Título)`

### P: O que é TDD?

**R:** Test-Driven Development:

1. **RED:** Escrever testes que falham
2. **GREEN:** Implementar código que faz testes passar
3. **REFACTOR:** Melhorar código mantendo testes passando

Exemplo em `docs/COMO_COMECAR.md` § 4.

### P: Como sou um junior, tenho dúvidas técnicas durante a codificação?

**R:**

1. Leia a subtarefa em `docs/REFACTORING_PLAN_GRANULAR_V2.md`
2. Veja exemplos de testes/código esperado
3. Consulte `CLAUDE.md` para convenções de código
4. Peça code review em seu PR

### P: O agente `/start-implementation` deu RED. E agora?

**R:** Leia o relatório ❌ do agente — ele explica qual arquivo está faltando ou qual validação falhou.
Geralmente:

- Arquivo faltando → `git pull` ou copiar manualmente
- Subtarefa incompleta → adicionar conforme Gap descrito
- Versão dessincronizada → atualizar header do arquivo

### P: O `/start-implementation` deveria começar a codar?

**R:** Não. O papel dele é apenas validar contexto e retornar um relatório de prontidão.
Se você quiser executar código, precisa chamar explicitamente o agente executor com:

```
Implemente X.Y (Título)
```

### P: Os agentes podem trocar automaticamente de validador/status para executor?

**R:** Não. `start-implementation` e `status-refactoring` podem sugerir o próximo passo, mas o handoff para `implement-and-commit` depende de autorização explícita do usuário.

### P: O executor pode commitar, fazer push e seguir para a próxima fase sozinho?

**R:** Não. O executor precisa de autorização explícita para:

1. iniciar a subtarefa
2. criar commits
3. fazer `git push` e abrir/atualizar PR
4. seguir para a próxima subtarefa ou próxima fase

### P: Backend não está rodando. Como testo localmente?

**R:**

1. Confirme que Spring Boot está em `http://localhost:8080`
2. Veja seção 3 de `docs/COMO_COMECAR.md` para checklist
3. Se mock ainda estiver ativo, pode avançar (Fases 0-1 não dependem backend)
4. Fase 2+ requer backend (Auth endpoints)

### P: Qual branch uso?

**R:** GitFlow:

- `main` = produção (não alterar)
- `development` = integração (sua base)
- `feature/refactor-<dominio>` = seu trabalho
  - Ex: `feature/refactor-phase-0`, `feature/refactor-auth`

### P: Como fazer commit?

**R:** Português, imperativo, formato:

```
[TIPO] Descrição curta (max 72 caracteres)

[tipos: feat, refactor, fix, test, docs]
```

Exemplos:

```
feat: Criar ProtectedRoute com validação de role
refactor: Extrair validações Zod em schema dedicado
test: Adicionar testes para ProtectedRoute
fix: Corrigir redirecionamento de sessão expirada
```

### P: Posso pular fases ou fazê-las em outra ordem?

**R:** Não recomendado. Cada fase depende da anterior:

- Fase 0 (segurança) bloqueia Fases 1-6
- Fase 1 (tipos) bloqueia Fase 2
- Fase 2 (auth) bloqueia Fase 3

Siga na ordem: 0 → 1 → 2 → 3 → 4 → 5 → 6.

---

## 📞 Suportes & Links

| Tópico                        | Link                                   |
| ----------------------------- | -------------------------------------- |
| **Setup Inicial**             | `docs/COMO_COMECAR.md`                 |
| **Visão Geral**               | `docs/REFACTORING_QUICK_REFERENCE.md`  |
| **Plano Detalhado**           | `docs/REFACTORING_PLAN_GRANULAR_V2.md` |
| **Convenções de Código**      | `CLAUDE.md`                            |
| **Escalação Multi-Framework** | `docs/MULTI_FRONTEND_ROADMAP.md`       |

---

## ✅ Checklist Pré-Fase 0.1

- [ ] Clonou o repositório?
- [ ] Rodou `pnpm install`?
- [ ] Executou `/start-implementation` (resultado GREEN)?
- [ ] Autorizou explicitamente o handoff para o executor, se quiser implementar agora?
- [ ] Leu `docs/COMO_COMECAR.md`?
- [ ] Confirmou que backend está rodando (ou mock está OK)?
- [ ] Entendeu o que é TDD?
- [ ] Autorizou commits e publicação no git, se aplicável?

Se tudo ✅, você está pronto! 🚀

---

## 📝 Regras de Ouro

1. **TDD Sempre:** Testes antes de código
2. **Commits Granulares:** Um conceito = um commit
3. **Português:** Commits, comments, variáveis de negócio em PT
4. **Sem `any` em TypeScript:** Tipos explícitos sempre
5. **Code Review:** PRs são obrigatórias
6. **Segurança Backend:** Nunca confie em dados do frontend

---

## 🎯 Timeline por Fase (Estimado)

| Fase      | Semanas   | Dev Junior     |
| --------- | --------- | -------------- |
| **0**     | 1-2       | ~1.5 sem       |
| **1**     | 1-2       | ~1.5 sem       |
| **2**     | 2-3       | ~2.5 sem       |
| **3**     | 2-3       | ~2.5 sem       |
| **4**     | 2-3       | ~2.5 sem       |
| **5**     | 1-2       | ~1 sem         |
| **6**     | 1-2       | ~1.5 sem       |
| **TOTAL** | **11-17** | **~12-18 sem** |

_Tempos incluem: code, testes, review, refactor._

---

## 🌟 Sucesso!

Parabéns por começar este projeto!

Lembre-se:

- 📚 A documentação é seu guia confiável
- 🤖 Use `/start-implementation` para validar progresso
- 💬 Pergunte em PRs durante code review
- ✅ Siga TDD religiosamente
- 🎉 Cada subtarefa completa é uma vitória!

---

**Versão:** 2.0 | **Data:** 24/03/2026 | **Status:** Pronto para implementação ✅

Comece agora: `docs/COMO_COMECAR.md` 👉
