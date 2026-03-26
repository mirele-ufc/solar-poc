# GEMINI.md - Contexto de Instrução do Projeto

Este arquivo serve como o guia definitivo de diretrizes, arquitetura e padrões para o projeto `poc-next-app`. Todas as interações devem seguir rigorosamente estas definições.

## 🚀 Visão Geral do Projeto

- **Objetivo:** Prova de Conceito (POC) definitiva para uma aplicação Next.js moderna, focada em segurança, acessibilidade e performance.
- **Stack Principal:**
  - **Framework:** Next.js 16 (Versão com mudanças significativas/breaking changes).
  - **Biblioteca UI:** React 19.
  - **Linguagem:** TypeScript (Strict Mode).
  - **Estilização:** Tailwind CSS 4 + Design Tokens em CSS Variables.
  - **Estado:** Zustand.
  - **Validação e Tipagem:** Zod + `@ava-poc/types` (Workspace dependency).
  - **Comunicação API:** Axios.
  - **Componentes & UI:** Lucide-react (Ícones), clsx + tailwind-merge (Utilidades CSS).

## 🏗️ Arquitetura e Padrões

O projeto segue uma **Arquitetura em Camadas (Layered Architecture)** para promover baixo acoplamento e separação de responsabilidades:

1.  **Camada de Rede (API):** Clientes de API isolados em `src/services/` utilizando Axios. Utiliza JWT stateless (access + refresh token).
2.  **Camada de Estado:** Gerenciamento de estado global (Zustand) ou local.
3.  **Camada de UI:** Componentes funcionais e puramente visuais (`src/components/ui` e `src/components/shared`). Utiliza `clsx` e `tailwind-merge` para gestão dinâmica de classes Tailwind. Lógica complexa em **Custom Hooks** (`src/hooks/`).

### 📦 Arquitetura Modular

Para garantir a escalabilidade, o projeto adota uma abordagem **Modular (Feature-based)**. Cada funcionalidade principal deve ser isolada, contendo seus próprios componentes, hooks e lógica, reduzindo o acoplamento global.

- **Componentes de Domínio:** Devem residir dentro de pastas específicas da feature ou em `src/components/shared` se forem reutilizados em mais de um módulo.
- **Isolamento de Lógica:** Hooks que atendem apenas a uma feature devem ser mantidos próximos a ela.
- **Exportação Clara:** Utilize arquivos `index.ts` para expor apenas o necessário de cada módulo.

#### 📂 Estrutura de Pastas (Exemplo)

```text
/
├── e2e/                        # 🎭 TESTES END-TO-END (Playwright/Cypress)
│   ├── auth.spec.ts
│   └── course-flow.spec.ts
│
├── src/
│   ├── app/                    # 🚦 CAMADA DE ROTEAMENTO (Next.js puro)
│   │   ├── (public)/           # Rotas sem autenticação (Route Group)
│   │   │   ├── page.tsx        # Landing Page do AVA
│   │   │   └── layout.tsx
│   │   ├── (auth)/             # Rotas de Login/Registro
│   │   │   ├── login/page.tsx  # Apenas importa o <LoginForm /> do módulo
│   │   │   └── register/page.tsx
│   │   ├── globals.css         # Tailwind base
│   │   └── layout.tsx          # Root Layout (Providers, HTML, Body)
│   │
│   ├── modules/                # 🧠 CAMADA DE DOMÍNIO (A inteligência do AVA)
│   │   ├── auth/               # Domínio de Autenticação
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LoginForm.test.tsx # ✅ TESTE CO-LOCALIZADO
│   │   │   │   └── AuthBanner.tsx
│   │   │   ├── actions/
│   │   │   │   ├── login-action.ts
│   │   │   │   └── login-action.test.ts # ✅ TESTE DE SERVER ACTION
│   │   │   └── schemas/
│   │   │       └── auth.schema.ts
│   │   │
│   │   ├── course/             # Domínio de Cursos e Catálogo
│   │   │   ├── components/
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   └── CourseCard.test.tsx
│   │   │   ├── actions/
│   │   │   │   └── get-course.ts
│   │   │   └── store/
│   │   │       └── use-player.ts
│   │   │
│   │   └── student/            # Domínio do Aluno (Progresso, Certificados)
│   │       ├── components/
│   │       └── actions/
│   │
│   └── shared/                 # 🛠️ CAMADA COMPARTILHADA (Código genérico)
│       ├── components/
│       │   ├── ui/             # Componentes burros (shadcn/ui)
│       │   │   ├── button.tsx
│       │   │   └── button.test.tsx
│       │   └── layout/         # Componentes globais
│       │       ├── Header.tsx
│       │       └── Sidebar.tsx
│       ├── lib/                # Configurações de bibliotecas de terceiros
│       │   ├── axios.ts
│       │   └── utils.ts
│       └── hooks/              # Hooks React genéricos
│           ├── use-debounce.ts
│           └── use-debounce.test.tsx
```

### 🛡️ Mandatos de Segurança (OWASP)

- **Zero Trust Client:** O navegador é um ambiente não confiável. Regras de negócio críticas e autorização devem ser validadas no Back-end.
- **Validação:** Uso obrigatório de **Zod** para validação de schemas de entrada e saída (Server Actions e Formulários).
- **Prevenção de XSS:** Confie no escape automático do JSX. O uso de `dangerouslySetInnerHTML` é proibido sem sanitização.
- **Tratamento de Erros:** Proibido expor stack traces. Use feedbacks amigáveis.
- **MIME Type:** Validação rigorosa de arquivos (PDF, MP4, AVI, MOV, WebM) no envio.

### ♿ Acessibilidade (WCAG 2.1/2.2 AA)

- **A11y First:** Uso obrigatório de HTML semântico.
- **Navegação:** Todos os elementos interativos acessíveis por teclado.

## 🌟 Regras de Ouro (Core Rules)

Para garantir a aderência à Prova de Conceito, as seguintes regras são mandatórias:

- **RN01 - Ativação:** Usuários são criados como `INATIVO`. Apenas ADMIN pode ativar.
- **RN03 - Imutabilidade:** CPF e Email são estritamente somente leitura após o cadastro.
- **RN05 - Provas:** Mínimo de 2 alternativas por pergunta e exatamente 1 correta.
- **RN12 - IA:** Conteúdo gerado por IA exige confirmação explícita do professor para ser salvo.
- **Logout Local:** O logout é exclusivamente local (limpeza de tokens); não existe endpoint de logout no backend.

## 🎨 Design System e Estilização

- **Restrição de Layout:** O layout e design visual existente **não devem ser alterados** sem solicitação explícita.
- **Design Tokens:** Utilize estritamente as variáveis definidas em `src/styles/theme.css` (Primary, Secondary, Neutral, Semantic colors).
- **Tipografia:** Fonte Geist (Sans e Mono) configurada via `next/font`.

## 🌿 Estratégia de Git (GitFlow)

O projeto utiliza uma adaptação do **GitFlow** para garantir a estabilidade e rastreabilidade:

- **Branches Principais:**
  - `main`: Reflete o estado atual de produção. Código estável e testado.
  - `develop`: Branch de integração para novas funcionalidades. Base para todas as `feature branches`.
- **Branches de Apoio:**
  - `feature/*`: Utilizadas para o desenvolvimento de novas funcionalidades (ex: `feature/US-P01-cadastro`). Devem ser criadas a partir de `develop`.
  - `hotfix/*`: Utilizadas para correções críticas imediatas em produção. Criadas a partir de `main` e integradas em `main` e `develop`.
  - `release/*`: Utilizadas para preparação de uma nova versão de produção. Criadas a partir de `develop`.

### 📑 Convenções de Commit

Seguimos o padrão de **Conventional Commits** enriquecido com o contexto da User Story (US) e do ciclo TDD:

- **Formato:** `<tipo>(<escopo>): <descrição> [ID-DA-US]`
- **Tipos Permitidos:**
  - `feat`: Nova funcionalidade.
  - `fix`: Correção de bug.
  - `docs`: Alterações na documentação.
  - `style`: Formatação, pontos e vírgulas ausentes (sem alteração de lógica).
  - `refactor`: Refatoração de código que não corrige bug nem adiciona funcionalidade.
  - `test`: Adição ou correção de testes.
  - `chore`: Atualização de tarefas de build, pacotes, etc.
- **Ciclo TDD (Obrigatório):**
  - Cada US deve ter ao menos três commits vinculados:
    1. `test(US-P01): add failing tests [RED]`
    2. `feat(US-P01): implement minimum for tests to pass [GREEN]`
    3. `refactor(US-P01): optimize and clean up code [REFACTOR]`

## 🛠️ Comandos de Desenvolvimento

- **Desenvolvimento:** `npm run dev`
- **Build:** `npm run build`
- **Iniciar Production:** `npm run start`
- **Linting:** `npm run lint`

## 📝 Convenções de Código

- **Clean Code & SOLID:** Funções pequenas, responsabilidade única, baixa duplicação e separação clara entre apresentação e lógica.
- **Nomenclatura:** Código em Inglês, Textos da UI em Português.
- **TypeScript:** Proibido `any`. Use interfaces/types explícitos.
- **Componentes:** Máximo de 200 linhas.
- **Logica Declarativa:** Priorizar composição e funções puras; isolar efeitos colaterais.

## 🚀 Performance e Otimização

Para manter a fluidez da aplicação, aplique:

- **Code Splitting:** Por rota e para componentes de alto custo.
- **Lazy Loading:** Paginas e componentes secundários via `dynamic` do Next.js.
- **Memoização Seletiva:** Usar `useMemo` e `useCallback` para cálculos pesados ou dependências de hooks que geram re-renders desnecessários.
- **Segmentação de Estado:** Evitar estados globais gigantescos que disparam re-render em toda a aplicação.

## Preferências de código adicionais

Você é um Arquiteto e Desenvolvedor Sênior Especialista em Next.js (App Router) e React 18+.
Sempre que gerar ou refatorar código neste diretório, siga rigorosamente as regras abaixo:

- Regra de Estrutura: Mutações de dados devem ser criadas como Server Actions dentro de cada módulo em `src/modules/{feature}/actions/`. Lógicas de cliente genéricas ficam em `src/shared/hooks/` e componentes base em `src/shared/components/ui/`.

1. PARADIGMA SERVER-FIRST: Todo componente deve ser um Server Component (RSC) por padrão. Utilize a diretiva `"use client"` apenas onde houver estrita necessidade de interatividade (useState, hooks, eventos onClick).
2. DATA FETCHING: Utilize o `fetch` nativo do Next.js diretamente nos Server Components. Evite SWR ou React Query para carregamento inicial.
3. MUTAÇÕES: Para envio de arquivos (Upload de PDF) e formulários, utilize EXCLUSIVAMENTE Server Actions (`"use server"`).
4. ESTADO: Para gerir o estado interativo das respostas do Quiz no cliente, utilize o Zustand.
5. ESTILIZAÇÃO: Mantenha estritamente as classes do Tailwind CSS.
6. SEGURANÇA (OWASP): É ESTRITAMENTE PROIBIDO o uso de `dangerouslySetInnerHTML`. Faça a validação rigorosa de dados (extensão de arquivo, MIME types) dentro das Server Actions.

---

_Nota: Este projeto utiliza uma versão do Next.js com mudanças estruturais. Sempre consulte a documentação local em `node_modules/next/dist/docs/` se necessário._
