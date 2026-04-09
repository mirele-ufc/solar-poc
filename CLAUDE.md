# PoC LLM UFC — Documento Mestre de Contexto

## Objetivo

Plataforma LMS (Learning Management System) da UFC, inspirada na Anthropic Academy.
O backend em Spring Boot expoe API REST e recursos de IA para geracao de conteudo de aulas e quizzes.

Este documento serve como fonte de contexto para agentes de IA e para alinhamento entre frontend e backend.

## Regra de Ouro de Escopo

- Fonte de verdade contratual: `CLAUDE.md` + `.claude/commands/doc/arquitetura.md` (com RF/RN/RNF como apoio normativo).
- Frontend deve preservar layout e UX atuais durante a integracao.
- Neste ciclo, o foco principal e validação e alinhamento de duas PoC (React vs Vue) com aumento de cobertura de testes e auditoria de segurança.
- A documentação deve orientar e acompanhar a implementacao do plano de validação em `docs/PLAN.md`.

## Perfis de Usuario

- ADMIN: pre-cadastrado no sistema; ativa e desativa contas.
- PROFESSOR: cria e gerencia cursos, modulos, aulas e provas.
- ALUNO: se inscreve e consome cursos (Fase 2, nao implementado ainda).

## Stack de Referencia

### Backend

Java 21, Spring Boot 3.4, PostgreSQL 16, Flyway, JWT (JJWT), Spring AI, OpenAI GPT-4o,
Apache PDFBox, Apache Tika, OWASP HTML Sanitizer, MapStruct, Lombok, Spring Mail, Maven.

### Frontend

React 18+, Vite, TypeScript (strict mode), Zustand (state management), TanStack Query (React Query),
React Router, Zod (validation), React Hook Form, Shadcn UI components, CKEditor 5 (rich text),
Tailwind CSS (styling), Axios (HTTP client).

## Modelo de Dados Principal

```
Usuario (1) -> (N) Curso
Curso   (1) -> (N) Modulo
Modulo  (1) -> (N) Aula
Modulo  (1) -> (0..1) Prova
Prova   (1) -> (N) Pergunta
Pergunta(1) -> (N) Alternativa
Usuario (1) -> (N) TokenRecuperacaoSenha
```

## Convencoes de Codigo

### Backend

- Idioma de dominio: portugues (entidades, campos, metodos e variaveis).
- Pacote raiz: br.ufc.llm.
- Estrutura de dominio: controller, service, repository, domain, dto, exception.
- DTOs separados em Request e Response.
- Resposta padrao da API: { data, message, status }.
- Commits em portugues no imperativo.
- TDD: testes antes da implementacao.
- Se a IA errar: descrever erro primeiro, sem corrigir manualmente fora do fluxo acordado.

### Frontend

- Idioma de dominio: portugues para textos de tela e mensagens; ingles para codigo (variaveis, funcoes, tipos).
- Estrutura de dominio: pages, components, services, hooks, store, types, validations.
- Custom hooks para orquestracao de estado e logica complexa.
- Componentes funcionais com separacao clara: apresentacao, orquestracao, acesso a dados.
- Validacoes Zod centralizadas em schemas reutilizaveis.
- Commits em portugues no imperativo (mesma convencao do backend para rastreabilidade).
- Nomenclatura semantica: funcoes e variaveis descrevem intencao de negocio.
- Tipos TypeScript explicitos (nunca `any`); interfaces ou types para props, retornos, payloads.

## Estado Atual do Projeto

**Ciclo Atual:** Validação e Alinhamento de PoC (React vs Vue)

- **Backend:** Fase 1 ativa — autenticacao, perfil, cursos, modulos, aulas, provas e integracao com IA.
- **Frontend (Ciclo Anterior):** Refatoracao React com integracao backend (44% concluído, pausado).
- **Frontend (Ciclo Novo - ATIVO):** Validação de equivalência React ↔ Vue + aumento de cobertura de testes + auditoria OWASP.
- **Fase 2 (Aluno):** Permanece fora do escopo de implementacao do backend atual.

**Objetivo deste ciclo:** Duas PoCs avançadas (90% funcionalidade equivalente) com cobertura de testes baixa (~20%). Necessário:

1. Aumentar cobertura ~20% → 70% em ambas (maior esforço)
2. Validar paridade de arquitetura HTTP/Auth
3. Auditar segurança (OWASP: XSS, CSRF, Auth, Input Validation)
4. Gerar relatório comparativo + recomendação de tecnologia

## Alinhamento Frontend x Backend

- O frontend atual possui duas PoCs com funcionalidade abrangente mas com graves lacunas em cobertura de testes (~20%).
- A validacao atual deve garantir 100% equivalencia funcional entre React e Vue, com cobertura ≥70% em ambas.
- Ambas as PoCs devem ser auditadas contra OWASP Core (XSS, CSRF, Auth, Input Validation).
- Apos validacao e aumento de cobertura, sera gerado um relatorio comparativo com recomendação de tecnologia.
- Toda divergencia de payload, status e regra de nego cio ja foi resolvida em ciclo anterior; este ciclo e de auditoria e qualidade.

### Fonte de Verdade Contratual (Obrigatoria)

- A fonte de verdade da aplicacao e composta por `CLAUDE.md` (diretrizes) + `.claude/commands/doc/arquitetura.md` (contrato tecnico e endpoints).
- As rotas e servicos frontend devem refletir somente endpoints existentes em `arquitetura.md`.
- Endpoint nao documentado em `arquitetura.md` nao deve permanecer no plano de implementacao ativo.
- Em caso de conflito entre `CLAUDE.md` e `arquitetura.md`, interromper a execucao, confirmar com o usuario o caminho oficial, e registrar a decisao nos documentos afetados antes de codificar.

## Diretrizes de Engenharia Frontend (Implementacao Neste Ciclo - Validação)

As diretrizes abaixo sao obrigatorias na validacao e aumento de cobertura de testes neste ciclo.

### Validação de Equivalência React vs Vue

- Ambas PoCs devem ter as mesmas funcionalidades implementadas: Auth, Courses, Modules, Lessons, Quizzes
- Ambas devem usar Axios com interceptador identico (JWT, refresh token, erro handling)
- Ambas devem usar Zod para validacoes (naming normalizado)
- Ambas devem ter zero `any` em TypeScript strict mode
- Ambas devem usar Slots Pattern em componentes reutilizaveis

### Qualidade de Codigo (aplicavel a ambas PoCs)

- Clean Code: funcoes pequenas, responsabilidade unica, baixo acoplamento, sem duplicacao.
- SOLID em componentes: separar apresentacao, orquestracao de fluxo e acesso a dados.
- Naming semantico: nomes de funcoes, variaveis e estados devem expressar intencao de negocio.
- Logica declarativa: preferir composicao e funcoes puras; isolar efeitos colaterais.

### Padroes de Componentes

- **Slots Pattern**: Componentes reutilizaveis devem suportar renderizacao flexivel via children ou composicao de slots nomeados.
  - Exemplo: `<Card><Card.Header><Card.Title>Titulo</Card.Title></Card.Header><Card.Body>Conteudo</Card.Body></Card>`
  - Evita passar muitas props e facilita customizacao sem duplicacao de componentes.
  - Preferir composicao explícita a props complexas.

### Gerenciamento de Estado (Zustand)

- Estado global: gerenciar contexto de autenticacao, usuario logado, sessao e permissoes.
- Stores Zustand devem ser organizados por dominio: `useAuthStore`, `useCourseStore`, `useUserStore`.
- Cada store expoe apenas seletores derivados necessarios via funcoes custom hooks.
- Evitar sobrecarga de estado: manter apenas dados compartilhados entre multiplas telas.
- Exemplo de store:
  ```typescript
  // store/useAuthStore.ts
  import { create } from "zustand";
  export const useAuthStore = create((set) => ({
    usuario: null,
    token: null,
    acessar: (usuario, token) => set({ usuario, token }),
    sair: () => set({ usuario: null, token: null }),
  }));
  ```

### Queries e Data Fetching (TanStack Query)

- Usar TanStack Query (React Query) para gerenciar estado de dados remotos e cache.
- Organizar em hooks customizados: `useGetCursos()`, `useCreateCurso()`, `useAtualizarModulo()`.
- Beneficios: sincronizacao automatica, refetch inteligente, deduplicacao, tratamento de loading/erro centralizado.
- Queries devem ser separadas de mutations; cada uma em seu custom hook.
- Exemplo:
  ```typescript
  // hooks/queries/useCursos.ts
  import { useQuery } from "@tanstack/react-query";
  export function useGetCursos() {
    return useQuery({
      queryKey: ["cursos"],
      queryFn: async () => {
        const res = await api.get("/cursos");
        return res.data.data;
      },
    });
  }
  ```
- Invalidacoes de cache apos mutacoes (POST/PUT/DELETE) para manter sincronizacao.

### Performance Frontend

- Code splitting por rota e por blocos de alto custo.
- Lazy loading de paginas e componentes secundarios.
- Memorizacao seletiva para calculos derivados, callbacks e seletores de estado.
- Evitar memoizacao indiscriminada e otimizar com base em medicao.

## Diretrizes de Seguranca (OWASP)

As diretrizes abaixo sao obrigatorias em toda codificacao frontend e backend.

### Zero Trust Client

- O React roda no navegador e e um ambiente nao confiavel.
- Remova qualquer logica de autorizacao, regras de negocio sensíveis ou calculos criticos do lado do cliente.
- Validacoes no frontend servem apenas para UX. A seguranca real deve ser delegada ao backend.
- Nunca confie em dados enviados pelo frontend; revalide sempre no backend.

### Prevencao de XSS (Cross-Site Scripting)

- Confie no escape automatico do JSX.
- Proibido o uso de `dangerouslySetInnerHTML` sem sanitizacao.
- Se for absolutamente necessario renderizar HTML rico, use bibliotecas de sanitizacao (ex: DOMPurify) antes da renderizacao.
- Backend sanitiza HTML com OWASP HTML Sanitizer antes de persistir.

### Protecao de Dados Sensíveis

- Nunca armazene tokens JWT, senhas ou dados sensíveis em localStorage ou sessionStorage sem protecao.
- Use cookies httpOnly e Secure para armazenar tokens de autenticacao.
- Implemente refresh token flow com validade limitada (RN09: 30 minutos).
- Limpe credenciais da memoria apos logout.

### Prevencao de CSRF (Cross-Site Request Forgery)

- Implemente validacao de tokens CSRF em requisicoes de escrita (POST, PUT, DELETE).
- Backend valida origem (Origin/Referer header) e token CSRF em mutacoes.
- Frontend inclui token CSRF em headers de requisicoes sensíveis.

### Validacao de Entrada

- Frontend valida entrada com Zod schemas para melhor UX.
- Backend revalida obrigatoriamente todos os inputs, nunca confie no frontend.
- Rejeite inputs que nao correspondem aos tipos esperados ou RNs aplicaveis.
- Aplique limites de tamanho, formato e caracteres especiais.

### Content Security Policy (CSP)

- Configure headers CSP no backend para restringir origens de scripts, estilos e recursos.
- Restringir `script-src` a 'self' e apenas origens confiáveis.
- Usar `nonce` ou `hash` para inline scripts quando necessario.

### Autenticacao e Sessao

- Implemente JWT com access token (curta validade) e refresh token (longa validade).
- Valide assinatura JWT no backend em toda requisicao autenticada.
- Nao implemente endpoint de logout sem contrato explicito em `.claude/commands/doc/arquitetura.md`.
- No contrato atual, logout no frontend deve apenas limpar estado local de autenticacao e redirecionar o usuario.
- Redirecione para login apos token expirado com mensagem clara.

### Controle de Acesso

- Implemente guardas no frontend para preservar UX sem alterar seguranca real.
- Backend valida permissões (ownership de cursos, status da conta) em toda requisicao.
- ADMIN ativa/desativa contas (RN01); PROFESSOR gerencia apenas seus cursos (RN02).
- Nao exponha IDs sensíveis ou dados de outros usuarios na API response.

## Guardrails de Implementacao

- Nao quebrar layout, hierarquia de navegacao ou experiencia atual do usuario.
- Nao duplicar regras de negocio do backend em componentes de UI sem necessidade.
- Priorizar aderencia contratual: endpoint, request, response, regras RN e codigos HTTP.
- Qualquer excecao de contrato deve ser documentada antes da implementacao.

## Operacao Portavel (Cross-Machine)

- Neste ciclo, a implementacao e frontend-only.
- O estado operacional deve ser retomado sempre a partir de `MEMORY.md` na raiz.
- Documentacao e comandos devem usar caminhos relativos, sem dependencias de path local absoluto.
- Setup local do frontend deve partir de `apps/poc-react-vite/.env.example` para `.env.local`.

## Estrutura de Branches (GitFlow)

### Hierarquia de Branches

- **main**: branch de producao (estado estavel, acessivel via PR aprovado e CI/CD verde).
- **development**: branch de integracao continua (recebe features/bugfixes via PR, valida contra backend).
- **feature/xxx**: nova funcionalidade ou refatoracao (base: development, nomear por dominio: feature/refactor-auth, feature/upgrade-courses-crud).
- **bugfix/xxx**: correcao de bug (base: development, nomear por tipo: bugfix/fix-form-validation, bugfix/jwt-refresh).
- **hotfix/xxx**: correcao urgente em producao (base: main, nomear por severidade: hotfix/login-crash).

### Fluxo de Merge

```
feature/xxx --PR--> development (code review obrigatorio)
                        |
                    CI/CD (tests, lint, type check)
                        |
                   development --PR--> main (merge manual apos validacao)
                                          |
                                   (tag de release: v.X.Y.Z)
```

### Convencoes de Commit

- **Idioma**: Portugues no imperativo (ex: "Refatorar componente de autenticacao", nao "refatorou", "refatorando").
- **Formato**: `[TIPO] Descricao curta (max 72 caracteres).`
- **Tipos de commit padrao**:
  - `feat`: nova funcionalidade (mapeia RF).
  - `refactor`: melhoria de codigo, SOLID, Clean Code (mapeia atividade de refactoring).
  - `fix`: correcao de bug (mapeia bugfix).
  - `test`: adicionar ou melhoria de testes.
  - `docs`: atualizacao de documentacao.
  - `chore`: manutencao de dependencias, setup ou CI/CD.
- **Exemplos**:
  - `refactor: Extrair logica de autenticacao para custom hook useAuth`
  - `feat: Integrar login com endpoint POST /api/autenticar`
  - `fix: Validacao de email em formulario de registro`
  - `test: Adicionar testes unitarios para validacoes de CPF`

### Responsabilidade do Agente de Desenvolvedor

O agente de desenvolvimento e refatoracao assume as seguintes responsabilidades durante a implementacao:

1. **Criar branch feature a partir de development**:

   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/refactor-<dominio>
   ```

2. **Executar refatoracao incremental por dominio**:
   - Manter commits granulares e logicos (um conceito = um commit).
   - Cada commit deve deixar o codigo em estado funcionavel (sem quebras de build ou tipo).
   - Commits devem aderir a RNF, Clean Code e SOLID do documento.

3. **Fazer commit de cada etapa concluida**:
   - Usar comando: `git add <arquivos>` ou `git add .` para stage.
   - Usar comando: `git commit -m "[TIPO] Descricao"` com idioma e formato correto.
   - Exemplo durante refactoring de Auth:
     ```bash
     git commit -m "refactor: Extrair validacoes de autenticacao para schema Zod dedicado"
     git commit -m "refactor: Criar custom hook useAuthentication para orquestracao de login"
     git commit -m "refactor: Integrar LoginPage com endpoint POST /api/autenticar"
     git commit -m "test: Adicionar testes para validacoes de credenciais"
     ```

4. **Validar antes de push**:
   - Rodar `npm run build` ou `pnpm build` (compilacao).
   - Rodar `npm run lint` ou `pnpm lint` (lint).
   - Rodar `npm run type-check` (type checking TypeScript).
   - Rodar testes relevantes se existirem.

5. **Fazer push para feature branch**:

   ```bash
   git push origin feature/refactor-<dominio>
   ```

6. **Criar Pull Request**:
   - Titulo: `[REFACTOR] <Dominio>: <Resumo>`
   - Descricao: listar objetivos (RNF aplicaveis), mudancas principais, dependencias ou issues.
   - Exemplo:

     ```
     [REFACTOR] Auth: Refatorar componentes de login e registro com Clean Code + JWT

     Objetivos:
     - RNF19: Clean Code (funcoes pequenas, baixo acoplamento)
     - RNF20: SOLID (separar apresentacao, orquestracao, dados)
     - RNF22: Naming semantico
     - RNF25: Lazy loading de formularios complexos

     Mudancas:
     - Extrair validacoes Zod em schema/authSchema.ts
     - Criar custom hook useAuthentication
     - Integrar LoginPage com POST /api/autenticar
     - Implementar JWT refresh token flow

     Testes:
     - Validacoes de email/CPF
     - Comportamento de timeout de sessao
     - Fallback para erro de conexao
     ```

7. **Acompanhar code review e mergear quando aprovado**:
   - Uma vez aprovado, fazer merge em development via GitHub UI.
   - Deletar feature branch apos merge.

### Rastreabilidade de Commits

- Cada commit deve estar associado a um objetivo de refatoracao (RNF/RF/RN).
- Use a descricao curta do commit para explicar o "o que" foi feito.
- Use o corpo do commit (quando necessario) para explicar o "por que".
- Exemplo com corpo:

  ```
  refactor: Migrar LoginPage para usar custom hook useAuthentication

  O hook centraliza a logica de autenticacao, JWT, e estado de sessao.
  Beneficio: reducao de acoplamento, facilita testes, alinha com RNF20 (SOLID).
  ```

## Comandos Disponiveis

```
/requisitos-funcionais      -> RFs da Fase 1 orientados a FE-BE
/regras-negocio             -> RNs com rastreabilidade por fluxo
/requisitos-nao-funcionais  -> RNFs tecnicos + diretrizes de qualidade e performance frontend
/arquitetura                -> entidades, SQL e endpoints REST
/user-stories               -> historias por perfil com criterios observaveis
```
