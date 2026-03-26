## Current State Memory Document — Slice G: Navigation & Routing

<<<<<<< HEAD
### Protocolo obrigatorio por story (TDD-first)

1. Definir e criar testes da story antes da implementacao.
2. Rodar testes e garantir estado RED inicial.
3. Implementar mudanca minima para GREEN.
4. Refatorar mantendo comportamento coberto por testes.
5. Encerrar story somente com validacao completa concluida.
=======
<<<<<<< HEAD
>>>>>>> 091524b0dc18fc2a8f2a0912653958b45d76bd77
### Patch Incremental 1 — Aderencia Contratual de Rotas

Fonte de verdade aplicada nesta analise: `CLAUDE.md` + `.claude/commands/doc/arquitetura.md`.

Regra ativa:
1. Rotas e fluxos frontend devem refletir somente endpoints documentados em arquitetura.md.
2. Fluxos sem endpoint contratual (ex.: mensageria) saem do escopo ativo ate formalizacao.
<<<<<<< HEAD
=======
=======
### Protocolo obrigatorio por story (TDD-first)

1. Definir e criar testes da story antes da implementacao.
2. Rodar testes e garantir estado RED inicial.
3. Implementar mudanca minima para GREEN.
4. Refatorar mantendo comportamento coberto por testes.
5. Encerrar story somente com validacao completa concluida.
>>>>>>> 81c2a527e7d58755bbbcee50355f9e429550c47f
>>>>>>> 091524b0dc18fc2a8f2a0912653958b45d76bd77

### 1. Arquitetura de Navegação (Visão Geral)

Infraestrutura de roteamento:

1. O router é criado com createBrowserRouter em routes.ts.
2. A aplicação injeta o router via RouterProvider em App.tsx.
3. O bootstrap em main.tsx só monta App e carrega estilos globais em main.tsx.

Layout de navegação:

1. A maioria das rotas autenticadas usa o layout compartilhado AuthLayout.tsx.
2. Esse layout concentra header fixo, menu lateral, menu de perfil e toaster global em AuthLayout.tsx.

Quirk crítico:

1. Não existe proteção de autenticação no nível de rotas/layout com isLoggedIn fora do store.
2. A flag isLoggedIn aparece apenas no store em useAuthStore.ts, sem uso no router/layout.

---

### 2. Manifesto Completo de Rotas

| Rota                                | Componente                 | Layout     | Tipo de acesso atual          | Guard técnico                    |
| ----------------------------------- | -------------------------- | ---------- | ----------------------------- | -------------------------------- |
| /                                   | LoginPage                  | Público    | Público                       | Nenhum                           |
| /register                           | RegisterPage               | Público    | Público                       | Nenhum                           |
| /forgot-password                    | ForgotPasswordPage         | Público    | Público                       | Nenhum                           |
| /courses                            | CoursesPage                | AuthLayout | Autenticada por convenção     | Nenhum                           |
| /courses/:id/manage                 | ManageCoursePage           | AuthLayout | Professor por intenção        | Nenhum                           |
| /courses/power-bi                   | CourseDetailPage           | AuthLayout | Usuário logado por intenção   | Nenhum                           |
| /courses/power-bi/enrollment        | EnrollmentPage             | AuthLayout | Usuário logado por intenção   | Nenhum                           |
| /courses/power-bi/modules           | ModulesPage                | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/power-bi/modules/:modId    | LessonsPage                | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/power-bi/exam/instructions | ExamInstructionsPage       | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/power-bi/exam              | ExamPage                   | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/power-bi/exam/results      | ExamResultPage             | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/power-bi/manage            | ManageCoursePage           | AuthLayout | Professor por intenção        | Nenhum                           |
| /courses/python                     | PythonDetailPage           | AuthLayout | Usuário logado por intenção   | Nenhum                           |
| /courses/python/enrollment          | PythonEnrollmentPage       | AuthLayout | Usuário logado por intenção   | Nenhum                           |
| /courses/python/modules             | PythonModulesPage          | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/python/modules/:modId      | PythonLessonsPage          | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/python/exam/instructions   | PythonExamInstructionsPage | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/python/exam                | PythonExamPage             | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /courses/python/exam/results        | PythonExamResultPage       | AuthLayout | Matriculado/role por intenção | useEnrollmentGuard no componente |
| /profile                            | ProfilePage                | AuthLayout | Usuário logado por intenção   | Nenhum                           |
| /my-courses                         | MyCoursesPage              | AuthLayout | Usuário logado por intenção   | Nenhum                           |
| /create-course                      | CreateCoursePage           | AuthLayout | Professor por intenção        | Nenhum                           |
| /create-course/modules              | CreateModulesPage          | AuthLayout | Professor por intenção        | Nenhum                           |
| /create-course/exam                 | CreateExamPage             | AuthLayout | Professor por intenção        | Nenhum                           |
| /message                            | MessagePage                | AuthLayout | Fora do contrato (escopo inativo) | N/A                         |
| /messages                           | MessagesPage               | AuthLayout | Fora do contrato (escopo inativo) | N/A                         |
| /received-messages                  | StudentMessagesPage        | AuthLayout | Fora do contrato (escopo inativo) | N/A                         |

Observação de consistência:

1. TeacherCoursePage é importada, mas não está exposta no router em routes.ts.
2. Rotas de mensageria permanecem mapeadas como estado atual, porém devem ser removidas do escopo ativo por ausência de endpoint em arquitetura.md.

---

### 3. Mapa de Guardas Reais (Injeção por Página)

Uso de useEnrollmentGuard em Power BI:

1. ModulesPage.tsx
2. LessonsPage.tsx
3. ExamInstructionsPage.tsx
4. ExamPage.tsx
5. ExamResultPage.tsx

Uso em Python:

1. PythonModulesPage.tsx
2. PythonLessonsPage.tsx
3. PythonExamInstructionsPage.tsx
4. PythonExamPage.tsx
5. PythonExamResultPage.tsx

Regra crítica do guard:

1. Bypass para professor sem courseStudentRole em useEnrollmentGuard.ts.
2. Aplicação de regra de matrícula quando professor tem courseStudentRole em useEnrollmentGuard.ts.
3. Redirecionamento para /courses quando bloqueado em useEnrollmentGuard.ts.

---

### 4. Contrato Funcional de AuthLayout

Arquivo-base:

1. AuthLayout.tsx

Responsabilidades centrais:

1. Estrutura visual global da área autenticada com Outlet.
2. Controle de drawer, dropdown e foco por teclado.
3. Navegação contextual por role no menu de perfil.
4. Toaster global único para feedbacks de tela.

Itens de menu lateral com lacuna de destino:

1. Vários itens têm path nulo em AuthLayout.tsx, AuthLayout.tsx, AuthLayout.tsx, AuthLayout.tsx.
2. Consequência: clique fecha menu, mas não navega.

Navegação por role no menu de perfil:

1. Professor recebe entrada para mensagens enviadas (estado atual, fora do contrato).
2. Estudante recebe entrada para mensagens recebidas (estado atual, fora do contrato).
3. A ação Sair apenas navega para raiz em AuthLayout.tsx, sem chamar logout explicitamente.

---

### 5. Contrato Funcional de PageHeader

Arquivo:

1. PageHeader.tsx

Contrato de tipos:

1. Crumb com label e path opcional em PageHeader.tsx.
2. Props obrigatórias title, backPath e crumbs em PageHeader.tsx.

Comportamento:

1. Botão de voltar sempre usa backPath.
2. Breadcrumb renderiza item clicável quando há path e item estático quando não há path em PageHeader.tsx.
3. O último crumb pode receber aria-current page se não for link.

Risco de contrato:

1. Não há validação para inconsistência entre backPath e cadeia de crumbs.
2. Chaves de breadcrumb usam concatenação de label e índice, suscetível a colisões em listas com rótulos repetidos.

---

### 6. Navegação por Role e Fluxos de Entrada

Entradas públicas:

1. Login, registro e recuperação de senha são as únicas portas claramente públicas no router.

Entradas autenticadas por convenção:

1. Toda árvore sob courses e demais áreas com AuthLayout presume sessão válida, mas não há enforcement técnico no nível de rota.

Fluxos role-based implementados na UI:

1. Menu de perfil muda por currentUser.role.
2. Algumas páginas internas também fazem checagem local de role para mostrar ou esconder ações.
3. Como o enforcement é descentralizado, comportamento pode divergir entre telas.

---

### 7. Padrões e Riscos Cross-cutting do Slice G

Riscos críticos:

1. Ausência de guard de autenticação global no router/layout.
2. Dependência de validações locais por página para controle de acesso.
3. Bypass de professor no guard de matrícula é sensível e pode quebrar com refatoração.
4. Ação de sair sem logout explícito pode deixar estado incoerente.
5. Itens de navegação sem destino formal aumentam ruído de UX e ambiguidade de produto.
6. Import de página não roteada indica drift entre código e manifesto de navegação.

Riscos médios:

1. Duplicação de rotas de gerenciamento de curso por padrão dinâmico e por id fixo.
2. Forte acoplamento das rotas ao id de curso hardcoded.
3. Contrato de breadcrumb depende de disciplina manual dos chamadores.

---

### 8. Checklist de Integração e Refatoração (Slice G)

1. Definir e aplicar guard global de autenticação no nível de rotas com comportamento único de redirecionamento.
2. Consolidar matriz de autorização por role em camada única e reutilizável.
3. Formalizar manifesto de rotas como fonte única para frontend e backend.
4. Preservar explicitamente a regra professor-como-aluno do guard de matrícula.
5. Padronizar ação de saída para sempre executar logout antes de navegar.
6. Revisar itens de menu com path nulo e decidir destino, ocultação ou status de não implementado.
7. Remover rotas de mensageria do escopo ativo enquanto não existirem endpoints oficiais.
8. Eliminar imports não roteados ou promover suas rotas no manifesto oficial.
9. Reduzir duplicação de rotas de gestão e centralizar constants de courseId.
