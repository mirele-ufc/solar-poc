## Current State Memory Document — Slice A: Gestão de Cursos

### Protocolo obrigatorio por story (TDD-first)

1. Criar teste(s) da story antes da implementacao.
2. Rodar testes para validar RED inicial.
3. Implementar o minimo necessario para GREEN.
4. Refatorar apos GREEN sem alterar comportamento validado.
5. Encerrar apenas com test, type-check, lint e build em sucesso.

---

### 1. Feature Overview & Navegação

**Grafo de navegação entre as páginas do slice:**

```
/courses (CoursesPage)
  ├── [professor] "Criar curso" → /create-course (CreateCoursePage)
  │     └── handleNext() válido → /create-course/modules (CreateModulesPage, via state)
  ├── [professor] curso ativo (não python) → /courses/:id/manage (ManageCoursePage)
  │     └── botão voltar → /courses
  │     └── "Enviar mensagem" → /message
  └── [professor] curso "python" → /courses/python (detalhe/aluno)

/courses (CoursesPage) — visão aluno
  ├── "power-bi" → /courses/power-bi
  ├── "python" → /courses/python
  └── outros IDs → sem navegação (onClick vazio)
```

**`CoursesPage` — detalhes:**

- Sem `useState`; apenas `useNavigate()` e `useAuthStore()` (lê `currentUser.role`)
- Branch de renderização: `currentUser.role === "professor"` → view professor; caso contrário → view aluno
- Navegação professor: cursos ativos com `id !== "python"` → `navigate("/courses/${c.id}/manage")`; `id === "python"` → `navigate("/courses/python")`
- Navegação aluno: `goToCourse(id)` — funciona apenas para `"power-bi"` e `"python"`; demais IDs têm `onClickCourse` vazio
- Listas de cursos do professor: `activeCourses` (3 itens) e `archivedCourses` (3 itens) — archivedCourses têm callbacks no-op

**`CreateCoursePage` — detalhes:**

- Rota: `/create-course`
- Coleta metadados do curso + imagem de capa via `react-hook-form` com `zodResolver(createCourseSchema)`
- Validação de imagem feita fora do form via `imageFileSchema.safeParse(file)` antes de atualizar o `coverFile` no form
- Estado de preview: `imagePreview: string | null` (base64 via `FileReader`)
- Estado de erro de imagem: `error: string` (local, fora do schema — complementar ao Zod)
- Próximo passo: `navigate("/create-course/modules", { state: { courseData } })` passando `CourseInfoData` via React Router state

**`ManageCoursePage` — detalhes:**

- Rota: `/courses/:id/manage`; lê `id` via `useParams()`
- Lookup do curso: `COURSE_DATA[id] ?? COURSE_DATA["power-bi"]` — fallback hardcoded para `"power-bi"` se ID desconhecido
- Duas abas: `"dashboard"` (padrão) e `"modulos"`; controladas por `activeTab` local
- Painel de participantes: toggle via `showParticipants` local
- Painel de respostas de prova: toggle via `provaModId: string | null` — keyed por módulo

---

### 2. Arquitetura de Dados

**`CoursesPage` — dados de cursos (todos hardcoded no arquivo):**

`computacaoCourses` (visão aluno):

```
{ id: "power-bi",   title: "Power Bi - Fundamentos",         hours: "Carga horária: 30h" }
{ id: "python",     title: "Python Iniciante",                hours: "Carga horária: 24h" }
{ id: "matematica", title: "Matemática básica",               hours: "Carga horária: 36h" }
```

`designCourses` (visão aluno):

```
{ id: "historia-design",    title: "História do Design",                  hours: "Carga horária: 64h" }
{ id: "design-grafico",     title: "Design Gráfico - Iniciante",          hours: "Carga horária: 40h" }
{ id: "design-interfaces",  title: "Design de Interfaces Gráficas",       hours: "Carga horária: 48h" }
```

`activeCourses` + `archivedCourses` (visão professor): mesmos IDs e títulos, sem campo `hours`.

`COURSE_IMAGES` (mapa de imagens por ID — URLs Unsplash):

| ID                    | Chave                              |
| --------------------- | ---------------------------------- |
| `"power-bi"`          | `photo-1759661966728-4a02e3c6ed91` |
| `"python"`            | `photo-1624953587687-daf255b6b80a` |
| `"matematica"`        | `photo-1747654804155-ffd62d5dfb51` |
| `"historia-design"`   | `photo-1762330910399-95caa55acf04` |
| `"design-grafico"`    | `photo-1663000806489-08f132cf3032` |
| `"design-interfaces"` | `photo-1602576666092-bf6447a729fc` |

**`ManageCoursePage` — mock data:**

`COURSE_DATA` (3 cursos, keyed por ID): cada entrada contém `title`, `hours`, `students` (número), `avgScore` (inteiro %), `image` (URL Unsplash), `modules[]` com `{ id, name, lessons[{ id, name }] }`.

`MOCK_STUDENTS` (10 alunos):

| Campo         | Tipo                                                       |
| ------------- | ---------------------------------------------------------- |
| `id`          | string (`"p1"` … `"p10"`)                                  |
| `name`        | string                                                     |
| `email`       | string                                                     |
| `progress`    | number (0–100)                                             |
| `status`      | `"concluiu" \| "em_andamento" \| "parou" \| "nao_acessou"` |
| `lastAccess?` | string (data formatada)                                    |
| `stoppedAt?`  | string (nome do módulo onde parou)                         |

`MOCK_PROVA_RESPONSES` (keyed por módulo ID `"m1"`, `"m2"`): cada entrada tem `total` (qtd respondentes), `avgPct` (%), `questions[]` com `{ id, text, options[{ label, text, pct, correct }] }`.

`STATUS_META` — mapa de cores/labels por status:

| Status           | Label        | Text Color | Background |
| ---------------- | ------------ | ---------- | ---------- |
| `"concluiu"`     | Concluiu     | `#155724`  | `#e6f9ee`  |
| `"em_andamento"` | Em andamento | `#021b59`  | `#c5d6ff`  |
| `"parou"`        | Parou        | `#801436`  | `#fde8ef`  |
| `"nao_acessou"`  | Não acessou  | `#606060`  | `#f0f0f0`  |

**Relação com `courseService.ts`:** as 5 funções da service layer (`fetchCourses`, `fetchCourseById`, `createCourse`, `updateCourse`, `deleteCourse`) estão implementadas e tipadas com `@ava-poc/types`, mas **nenhuma delas é chamada por nenhuma das três páginas**. Toda a UI opera sobre os arrays/objetos hardcoded acima.

---

### 3. Gerenciamento de Estado

**Estado por página:**

`CoursesPage`:

- Sem `useState` — componente puramente derivado de leitura de store

`CreateCoursePage`:

| Variável          | Tipo                          | Valor inicial | Propósito                                  |
| ----------------- | ----------------------------- | ------------- | ------------------------------------------ |
| `imagePreview`    | `string \| null`              | `null`        | URL base64 para preview da capa            |
| `error`           | `string`                      | `""`          | Erro local de validação de imagem          |
| `showFieldErrors` | `boolean`                     | `false`       | Ativa exibição de erros no submit inválido |
| `imageInputRef`   | `RefObject<HTMLInputElement>` | —             | Trigger programático do file input         |
| `form`            | `react-hook-form`             | —             | Estado completo dos campos via `watch()`   |

`ManageCoursePage`:

| Variável           | Tipo                          | Valor inicial    | Propósito                                     |
| ------------------ | ----------------------------- | ---------------- | --------------------------------------------- |
| `modules`          | `Module[]`                    | `course.modules` | Lista local mutável de módulos                |
| `editingLesson`    | `{ modId, lessonId } \| null` | `null`           | Controla modal de edição de aula              |
| `showParticipants` | `boolean`                     | `false`          | Toggle do painel de participantes             |
| `provaModId`       | `string \| null`              | `null`           | ID do módulo cujo painel de prova está aberto |
| `generatingPDF`    | `boolean`                     | `false`          | Loading state do "gerador" de relatório       |
| `activeTab`        | `"dashboard" \| "modulos"`    | `"dashboard"`    | Tab ativa                                     |

**`useCourseStore` — uso indireto:**
As três páginas do slice **não chamam** `useCourseStore` diretamente. As interações com a store ocorrem em páginas adjacentes:

- `enrollInCourse("power-bi")` → chamado em `EnrollmentPage.tsx`
- `isEnrolledInCourse("power-bi")` + `unenrollFromCourse()` → chamados em `CourseDetailPage.tsx`
- `isEnrolledInCourse` + `hasCourseStudentRole` → lidos em `useEnrollmentGuard.ts`

**Loading e erros por página:**

| Página             | loading state                                           | error state                                    |
| ------------------ | ------------------------------------------------------- | ---------------------------------------------- |
| `CoursesPage`      | —                                                       | —                                              |
| `CreateCoursePage` | —                                                       | `error: string` local para imagem; sem loading |
| `ManageCoursePage` | `generatingPDF: boolean` (1,8s delay simulado, sem API) | —                                              |

---

### 4. Contratos de Dados e Validação

**Contratos da API** (em `@ava-poc/types`):

`ICreateCoursePayload` (campos obrigatórios): `title`, `description`, `thumbnail`, `creatorId`

`IUpdateCoursePayload` (campos opcionais): `title?`, `description?`, `thumbnail?`

> **Gap de mapeamento:** o form `createCourseSchema` coleta `category`, `hours` e `requiredFields` — campos que **não existem** em `ICreateCoursePayload`. Ao integrar com o backend, será necessário decidir se esses campos são adicionados ao payload ou descartados.

**`createCourseSchema` — campos e regras:**

| Campo            | Tipo Zod               | Regra               | Mensagem de erro                |
| ---------------- | ---------------------- | ------------------- | ------------------------------- |
| `title`          | `string.trim().min(1)` | Obrigatório         | "O título é obrigatório"        |
| `description`    | `string.trim().min(1)` | Obrigatório         | "A descrição é obrigatória"     |
| `category`       | `string.trim().min(1)` | Obrigatório         | "A categoria é obrigatória"     |
| `hours`          | `string.trim().min(1)` | Obrigatório         | "A carga horária é obrigatória" |
| `requiredFields` | `z.array(z.string())`  | —                   | —                               |
| `coverFile`      | `imageFileSchema`      | File jpeg/png ≤ 5MB | Ver fileSchema                  |

Opções hardcoded de `requiredFields`: `["Endereço", "Gênero", "Idade"]` — toggle controlado por `toggleRequired(field)`.

**`createModulesSchema` — campos e regras:**

| Campo     | Tipo Zod                          | Regra             | Mensagem de erro              |
| --------- | --------------------------------- | ----------------- | ----------------------------- |
| `modules` | `array(moduleImageSchema).min(1)` | Ao menos 1 módulo | "Adicione ao menos um módulo" |

`superRefine`: itera cada módulo; se `!moduleItem.imageFile` → `ZodIssueCode.custom` com path `[index, "imageFile"]` e mensagem `"Imagem obrigatória"`.

**`fileSchema.ts` — schemas e regras:**

| Schema                     | Instância                    | MIME Types permitidos                        | Tamanho máx | Erros                                                                                               |
| -------------------------- | ---------------------------- | -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `imageFileSchema`          | `File` (obrigatório)         | `image/jpeg`, `image/png`                    | 5 MB        | "A imagem é obrigatória" / "Formato inválido. Envie JPG ou PNG" / "O arquivo deve ter menos de 5MB" |
| `uploadFileSchema`         | `File` (obrigatório)         | `image/jpeg`, `image/png`, `application/pdf` | 5 MB        | "Arquivo inválido" / "Formato inválido. Envie JPG, PNG ou PDF" / "O arquivo deve ter menos de 5MB"  |
| `optionalUploadFileSchema` | `File` (nullable + optional) | mesmos de `uploadFileSchema`                 | 5 MB        | mesmos de `uploadFileSchema`                                                                        |

Constantes: `MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024`, `SAFE_IMAGE_MIME_TYPES`, `SAFE_DOCUMENT_MIME_TYPES`, `SAFE_UPLOAD_MIME_TYPES` (union das duas anteriores).

---

### 5. Lógica Acoplada e Helpers

**`CoursesPage` — lógica condicional:**

- Branch professor/aluno por `currentUser.role === "professor"` — sem enum, comparação por string literal
- Navegação de aluno suporta apenas 2 IDs (`"power-bi"`, `"python"`); qualquer outro curso não navega
- `archivedCourses` e `designCourses` têm `onClickCourse` vazio — comportamento no-op intencional ou não documentado
- SVG paths `editPath`, `chartPath`, `closeSm` declarados mas não usados (lint warning com `@typescript-eslint/no-unused-vars`)

**`CreateCoursePage` — lógica de imagem:**

- `handleImageChange`: validação via `imageFileSchema.safeParse(file)` fora do fluxo `react-hook-form` — separação entre validação do schema e do form
- Se inválido: `reset("coverFile")`, `setImagePreview(null)`, `setError(msg)`, `setShowFieldErrors(true)`
- Se válido: `setValue("coverFile", file)` + `FileReader` para preview base64 + `setError("")`
- `handleNext`: chama `trigger()` para forçar validação de todos os campos antes de navegar

**`ManageCoursePage` — lógica de operações:**

| Função                            | Lógica                                                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `removeLesson(modId, lessonId)`   | `filter()` sobre lessons do módulo; atualiza `modules` via `setModules` imutável                                      |
| `removeModule(modId)`             | `filter()` sobre `modules`; atualiza state                                                                            |
| `openEditLesson(modId, lessonId)` | Seta `editingLesson` state                                                                                            |
| `saveLesson(name)`                | Mapeia `modules`, encontra `modId`, mapeia `lessons`, atualiza nome; `setEditingLesson(null)`                         |
| `getEditingLesson()`              | Lookup em `modules` + `lessons` via `editingLesson` state; retorna objeto ou `null`                                   |
| `handleGeneratePDF()`             | `setGeneratingPDF(true)` → `setTimeout(1800ms)` → `setGeneratingPDF(false)` → `toast.success(...)` → `window.print()` |

**Formatação de dados embutida em componentes:**

- Percentuais: `Math.round(value)` + template string `"${value}%"` em `StatCard` e tooltips do dashboard
- Datas: usadas diretamente como strings formatadas vindas de `MOCK_STUDENTS.lastAccess` (ex: `"12/03/2026"`)

---

### 6. Componentes Locais e Dependências de UI

**Componentes locais em `CoursesPage`:**

| Componente   | Props                                   | Responsabilidade                                                      |
| ------------ | --------------------------------------- | --------------------------------------------------------------------- |
| `CourseCard` | `id, title, hours?, onClick, isActive?` | Card de curso com imagem e badge "Ativo"                              |
| `CourseGrid` | `courses[], onClickCourse, showHours?`  | Grid responsivo de cards (scroll horizontal mobile / 3–4 col desktop) |

**Componentes locais em `ManageCoursePage`:**

| Componente            | Props                                                       | Responsabilidade                                                   |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| `StatCard`            | `value, label, sub?, color, bg`                             | Caixa de estatística com número grande                             |
| `EditLessonModal`     | `lessonName, onSave(name, replaceFile, fileName?), onClose` | Modal de edição de aula; aceita `application/pdf,video/*,image/*`  |
| `ParticipantsPanel`   | `onClose`                                                   | Painel lateral com filtro de status e lista de alunos              |
| `ProvaResponsesPanel` | `modId, modName, onClose`                                   | Painel de respostas com distribuição de opções por questão         |
| `CourseDashboard`     | `course, totalStudents`                                     | Dashboard de métricas com stat cards e lista de alunos que pararam |

**Componente local em `CreateCoursePage`:**

| Componente   | Props                                                | Responsabilidade                                                       |
| ------------ | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `FieldInput` | `label, placeholder, id, value, onChange, hasError?` | Input de texto com borda de erro e outline de foco `3px solid #021b59` |

**Componentes compartilhados usados e props passadas:**

| Página             | Componente          | Props                                                                                                                    |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `CoursesPage`      | `ImageWithFallback` | `alt`, `src` (de `COURSE_IMAGES[id]` ou fallback), `className`                                                           |
| `CreateCoursePage` | `PageHeader`        | `title="Criar Curso"`, `backPath="/courses"`, `crumbs=[{ label: "Cursos", path: "/courses" }, { label: "Criar Curso" }]` |
| `ManageCoursePage` | `ImageWithFallback` | `alt`, `src` (de `COURSE_DATA[id].image`), `className`                                                                   |
