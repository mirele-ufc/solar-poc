## Current State Memory Document — Slice E: Enrollment Flow

### TDD-First Protocol for Stories in this Slice

1. Define and write tests before any implementation step.
2. Run and confirm failing tests (RED) first.
3. Implement the minimum for tests to pass (GREEN).
4. Refactor with behavior preserved by test suite.
5. Finish the story only after full validation pipeline passes.

### 1. Fluxo de Matrícula e Navegação

Rota de entrada principal do fluxo:

- Detalhe do curso: CourseDetailPage.tsx
- Formulário de inscrição: EnrollmentPage.tsx
- Página de meus cursos: MyCoursesPage.tsx

Mapa de navegação observado:

- /courses/power-bi
- Se não matriculado: botão Inscrever-se leva para /courses/power-bi/enrollment
- Se matriculado: botão Acessar curso leva para /courses/power-bi/modules
- Cancelar matrícula no detalhe: remove matrícula, mostra toast, redireciona para /courses
- Finalizar inscrição: valida formulário, executa matrícula no store e redireciona para /courses/power-bi/modules após delay de 1.8s

Quirk crítico:

- O courseId do fluxo está hardcoded como power-bi em múltiplos pontos do fluxo de inscrição e cancelamento, sem centralização em constante compartilhada.

Referência de rotas:

- routes.ts

---

### 2. Contratos e Estado de Matrícula

Fonte de estado:

- useCourseStore.ts

Estado do store:

- enrolledCourses: lista de cursos matriculados
- courseStudentRoles: lista de cursos onde o usuário tem papel de aluno

Ações do store:

- enrollInCourse(courseId): adiciona curso se ainda não existir
- unenrollFromCourse(courseId): remove curso da lista
- isEnrolledInCourse(courseId): consulta matrícula
- hasCourseStudentRole(courseId): consulta papel de aluno por curso
- setCourseStudentRoles(courseIds): define cursos com papel de aluno

Observações arquiteturais documentadas no próprio store:

- Estado é de UI e não substitui autorização real
- Backend deve validar matrícula e permissões
- courseStudentRoles deve vir do backend

Risco de integração:

- Sem persistência no store, refresh de página tende a perder o contexto de matrícula local.

---

### 3. Schema de Validação de Inscrição

Arquivo:

- enrollmentSchema.ts

Campos e regras:

- firstName: obrigatório, trim, mensagem Nome não informado
- lastName: obrigatório, trim, mensagem Sobrenome não informado
- city: obrigatório, trim, mensagem Cidade não informada
- gender: obrigatório, trim, mensagem Gênero não informado

Tipo inferido:

- EnrollmentFormValues

Ponto importante:

- Schema é simples e direto, mas constitui contrato funcional do gate de inscrição; qualquer mudança de campo precisa refletir no backend de matrícula quando houver integração.

---

### 4. EnrollmentPage: Submit, Validação e Efeitos

Arquivo:

- EnrollmentPage.tsx

Composição técnica:

- React Hook Form com zodResolver(enrollmentSchema)
- Campos controlados via watch e setValue
- Trigger manual de validação no clique de finalizar

Estados locais relevantes:

- status: idle, success, error
- showErrors: controla exibição de erros
- generoOpen: estado do dropdown de gênero

Comportamento de envio:

- handleFinalizar ativa exibição de erros e executa trigger
- Se inválido: status error e scroll para topo
- Se válido: enrollInCourse(power-bi), status success e redirecionamento temporizado para módulos

UI e UX relevantes:

- Banner de sucesso com role alert e aria-live polite
- Banner de erro no topo
- Botão fixo no rodapé para finalizar inscrição
- Dropdown customizado de gênero com listbox e aria-selected

Quirks relevantes:

- Opções de gênero estão hardcoded no próprio componente
- Curso alvo da matrícula também está hardcoded como power-bi
- Fluxo depende de temporizador para navegação após sucesso

---

### 5. CourseDetailPage: Gate de Entrada e Cancelamento

Arquivo:

- CourseDetailPage.tsx

Lógica central:

- enrolled = isEnrolledInCourse(power-bi)
- Botão principal:
- Matriculado: acessa módulos
- Não matriculado: vai para enrollment
- Botão secundário aparece somente matriculado:
- Abre modal de confirmação de cancelamento
- Ao confirmar: unenrollFromCourse(power-bi), toast de sucesso e navegação para /courses

Pontos de implementação:

- Uso de toast do Sonner para feedback
- Modal com bloqueio visual por overlay e mensagens de impacto
- Conteúdo textual do curso totalmente estático no arquivo

Risco de integração:

- Cancelamento hoje é apenas mutação local do Zustand; em backend real, precisa de endpoint e tratamento de falha de rede antes de remover acesso no cliente.

---

### 6. MyCoursesPage: Dual Role Professor e Aluno

Arquivo:

- MyCoursesPage.tsx

Objetivo funcional:

- Exibir cursos em duas perspectivas quando perfil for professor:
- Cursos que leciono
- Cursos em que estou matriculado como aluno

Pontos críticos observados:

- isProfessor está hardcoded como true no arquivo
- PROFESSOR_TAUGHT_COURSES_DATA contém valores fixos no front
- Regra de estudante para professor usa interseção:
- enrolledCourses
- courseStudentRoles
- Destino do clique:
- Se professor e curso em PROFESSOR_TAUGHT_COURSES, vai para /courses/:id/manage
- Caso contrário, vai para /courses/:id

Riscos:

- Com isProfessor fixo, a visualização sempre entra no modo professor independentemente da sessão real
- Existem duas constantes de cursos de professor com escopos diferentes dentro do mesmo arquivo, gerando risco de inconsistência
- Dados de catálogo de cursos estão duplicados localmente, sem fonte unificada

---

### 7. Lógica Transversal: Guard de Matrícula

Arquivo:

- useEnrollmentGuard.ts

Regra do guard:

- Se usuário for professor:
- Se tiver papel de aluno no curso, aplica validação de matrícula
- Se não tiver papel de aluno no curso, bypass completo
- Se usuário for student:
- Exige matrícula no curso

Consequência de negócio:

- Professor pode ter acesso irrestrito em cursos sem courseStudentRole
- Professor com courseStudentRole cai no mesmo gate do aluno

Aplicação prática:

- O guard é usado em módulos, aulas e provas dos fluxos power-bi e python, ou seja, impacta diretamente o acesso pós-inscrição e pós-cancelamento.

Referências de uso:

- ModulesPage.tsx
- LessonsPage.tsx
- ExamInstructionsPage.tsx
- ExamPage.tsx
- ExamResultPage.tsx
- PythonModulesPage.tsx
- PythonLessonsPage.tsx
- PythonExamInstructionsPage.tsx
- PythonExamPage.tsx
- PythonExamResultPage.tsx

Risco crítico:

- Sem documentação explícita dessa regra de bypass, uma refatoração pode quebrar o cenário professor-como-aluno ou abrir acesso indevido.

---

### 8. Padrões e Riscos Cross-cutting do Slice E

Padrões observados:

- Forte dependência de ids hardcoded de curso
- Store local como fonte primária de estado de matrícula
- Fluxo de navegação controlado no front por condição de matrícula
- Uso de UI local para feedback de sucesso e erro sem roundtrip de API

Principais riscos:

- Segurança: autorização real não existe no cliente e depende de backend futuro
- Consistência: regras de role espalhadas entre guard e páginas
- Escalabilidade: hardcodes de catálogo e ids dificultam expansão para novos cursos
- Confiabilidade: sem persistência de sessão/matrícula, estado pode divergir após refresh

---

### 9. Checklist de Riscos de Integração Antes da Refatoração

1. Centralizar constantes de courseId e rotas de matrícula para remover hardcodes repetidos.
2. Substituir isProfessor hardcoded por role real da sessão no fluxo de meus cursos.
3. Definir contrato backend para enroll e unenroll antes de migrar ações do store.
4. Preservar semanticamente a regra de bypass do useEnrollmentGuard no desenho novo.
5. Garantir sincronização entre enrolledCourses e courseStudentRoles em carga inicial de sessão.
6. Formalizar fallback de erro de rede para inscrição e cancelamento com rollback de UI.
7. Evitar divergência entre catálogo local de cursos e fonte oficial de dados.
