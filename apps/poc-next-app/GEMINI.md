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
  - **Tipagem Compartilhada:** `@ava-poc/types` (Workspace dependency).

## 🏗️ Arquitetura e Padrões

O projeto segue uma **Arquitetura em Camadas (Layered Architecture)** para promover baixo acoplamento e separação de responsabilidades:

1.  **Camada de Rede (API):** Clientes de API isolados (ex: `services/` ou `api/`).
2.  **Camada de Estado:** Gerenciamento de estado global (Zustand) ou local de forma previsível.
3.  **Camada de UI:** Componentes funcionais e puramente visuais. Lógica complexa deve ser extraída para **Custom Hooks**.

### 🛡️ Mandatos de Segurança (OWASP)

- **Zero Trust Client:** O navegador é um ambiente não confiável. Regras de negócio críticas e autorização devem ser validadas no Back-end.
- **Prevenção de XSS:** Confie no escape automático do JSX. O uso de `dangerouslySetInnerHTML` é proibido sem sanitização (DOMPurify).
- **Tratamento de Erros:** Proibido expor stack traces ou erros técnicos na UI. Use feedbacks amigáveis (Toasts/Alerts).

### ♿ Acessibilidade (WCAG 2.1/2.2 AA)

- **A11y First:** Uso obrigatório de HTML semântico (`<main>`, `<nav>`, `<section>`, etc.).
- **Navegação:** Todos os elementos interativos devem ser acessíveis por teclado.
- **Atributos:** Uso correto de `aria-*` e `roles` onde necessário.

## 🎨 Design System e Estilização

- **Restrição de Layout:** O layout e design visual existente **não devem ser alterados** sem solicitação explícita.
- **Design Tokens:** Utilize estritamente as variáveis definidas em `src/styles/theme.css` (Primary, Secondary, Neutral, Semantic colors).
- **Tipografia:** Fonte Geist (Sans e Mono) configurada via `next/font`.

## 🛠️ Comandos de Desenvolvimento

- **Desenvolvimento:** `npm run dev`
- **Build:** `npm run build`
- **Iniciar Production:** `npm run start`
- **Linting:** `npm run lint`

## 📝 Convenções de Código

- **Nomenclatura:** Código em Inglês (variáveis, funções, classes), Textos da UI em Português.
- **TypeScript:** Proibido o uso de `any`. Use interfaces/types explícitos para props e payloads de API.
- **Componentes:** Máximo de 200 linhas por arquivo. Acima disso, decomponha em subcomponentes.
- **Hooks:** Extraia lógica de busca de dados e manipulação de estado complexo para hooks customizados (ex: `useUser`, `useFetchData`).

## Preferências de código adicionais

Você é um Arquiteto e Desenvolvedor Sênior Especialista em Next.js (App Router) e React 18+.
Sempre que gerar ou refatorar código neste diretório, siga rigorosamente as regras abaixo:

- Regra de Estrutura: Mutações de dados devem ser criadas como Server Actions estritamente na pasta src/services/actions.ts. Lógicas de cliente ficam em src/hooks/ e a interface dividida entre src/components/ui/ e src/components/shared/.

1. PARADIGMA SERVER-FIRST: Todo componente deve ser um Server Component (RSC) por padrão. Utilize a diretiva `"use client"` apenas onde houver estrita necessidade de interatividade (useState, hooks, eventos onClick).
2. DATA FETCHING: Utilize o `fetch` nativo do Next.js diretamente nos Server Components. Evite SWR ou React Query para carregamento inicial.
3. MUTAÇÕES: Para envio de arquivos (Upload de PDF) e formulários, utilize EXCLUSIVAMENTE Server Actions (`"use server"`).
4. ESTADO: Para gerir o estado interativo das respostas do Quiz no cliente, utilize o Zustand.
5. ESTILIZAÇÃO: Mantenha estritamente as classes do Tailwind CSS.
6. SEGURANÇA (OWASP): É ESTRITAMENTE PROIBIDO o uso de `dangerouslySetInnerHTML`. Faça a validação rigorosa de dados (extensão de arquivo, MIME types) dentro das Server Actions.

---

_Nota: Este projeto utiliza uma versão do Next.js com mudanças estruturais. Sempre consulte a documentação local em `node_modules/next/dist/docs/` se necessário._
