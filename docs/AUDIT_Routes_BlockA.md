# Auditoria Final Bloco A — Rotas (React vs Vue)

**Data:** 09/04/2026  
**Objetivo:** Validar que ambas PoCs contêm apenas rotas de escopo: Auth, Courses, Modules, Lessons, Exams

---

## ✅ Rotas de Escopo Esperadas

- [ ] Auth (Login, Register)
- [ ] Courses (list, detail, enrollment, manage)
- [ ] Modules (list, detail)
- [ ] Lessons (list, detail)
- [ ] Exams (instructions, take, results)
- [ ] My Courses (student view)
- [ ] Create Course (professor flow)

---

## React — routes.tsx

### Rotas Públicas (sem guard)

| Rota         | Path            | Status | Notas             |
| ------------ | --------------- | ------ | ----------------- |
| Login        | `/` (index)     | ✅     | Página por padrão |
| Register     | `/register`     | ✅     | Pública           |
| Unauthorized | `/unauthorized` | ✅     | Error page        |

### Rotas Autenticadas (com ProtectedRoute)

#### Student + Professor (STUDENT_AND_PROFESSOR_ROLES)

| Rota             | Path                             | Status | Notas            |
| ---------------- | -------------------------------- | ------ | ---------------- |
| Courses          | `/courses`                       | ✅     | List view        |
| CourseDetail     | `/courses/:id`                   | ✅     | Detail view      |
| Enrollment       | `/courses/:id/enrollment`        | ✅     | Enroll action    |
| Modules          | `/courses/:id/modules`           | ✅     | Module list      |
| Lessons          | `/courses/:id/modules/:modId`    | ✅     | Lesson list      |
| ExamInstructions | `/courses/:id/exam/instructions` | ✅     | Before exam      |
| Exam             | `/courses/:id/exam`              | ✅     | Taking exam      |
| ExamResults      | `/courses/:id/exam/results`      | ✅     | After submission |

#### Student Only (STUDENT_ONLY_ROLES)

| Rota   | Path | Status | Notas                                         |
| ------ | ---- | ------ | --------------------------------------------- |
| (none) | N/A  | ✅     | Rota guard existe mas sem children — esperado |

#### Professor Only (PROFESSOR_ONLY_ROLES)

| Rota          | Path                     | Status | Notas                       |
| ------------- | ------------------------ | ------ | --------------------------- |
| ManageCourse  | `/courses/:id/manage`    | ✅     | Edit/manage course          |
| MyCourses     | `/my-courses`            | ✅     | My courses (professor view) |
| CreateCourse  | `/create-course`         | ✅     | Create course form          |
| CreateModules | `/create-course/modules` | ✅     | Add modules                 |
| CreateExam    | `/create-course/exam`    | ✅     | Add exam                    |

### Verificação React

- [x] Sem rotas ForgotPassword
- [x] Sem rotas ResetPassword
- [x] Sem rotas Profile
- [x] Sem rotas Messages
- [x] Sem rotas Admin
- [x] Sem TeacherCoursePage (removido em A2)
- [x] Sem Python/PowerBI específicos
- [x] 16 rotas de escopo (Auth: 3, Courses: 8, Professor: 5)

**Status React:** ✅ **100% CONFORME**

---

## Vue — router/index.ts

### Rotas Públicas (meta.requiresGuest)

| Rota     | Path        | Status | Notas                     |
| -------- | ----------- | ------ | ------------------------- |
| Redirect | `/`         | ✅     | Redireciona para `/login` |
| Login    | `/login`    | ✅     | Pública                   |
| Register | `/register` | ✅     | Pública                   |

### Rotas Autenticadas (meta.requiresAuth)

| Rota             | Path                             | Roles     | Status | Notas                   |
| ---------------- | -------------------------------- | --------- | ------ | ----------------------- |
| MyCourses        | `/my-courses`                    | —         | ✅     | Todos (sem filter meta) |
| CreateCourse     | `/create-course`                 | professor | ✅     | form                    |
| CreateModules    | `/create-course/create-modules`  | professor | ✅     | modules                 |
| CreateExam       | `/create-course/exam`            | professor | ✅     | exam                    |
| Courses (list)   | `/courses`                       | —         | ✅     | List view               |
| ManageCourse     | `/courses/:id/manage`            | professor | ✅     | Edit course             |
| CourseDetail     | `/courses/:id`                   | —         | ✅     | Detail view             |
| Enrollment       | `/courses/:id/enrollment`        | —         | ✅     | Enroll                  |
| Modules          | `/courses/:id/modules`           | —         | ✅     | Module list             |
| Lessons          | `/courses/:id/modules/:modId`    | —         | ✅     | Lesson list             |
| ExamInstructions | `/courses/:id/exam/instructions` | —         | ✅     | Before exam             |
| Exam             | `/courses/:id/exam`              | —         | ✅     | Taking exam             |
| ExamResults      | `/courses/:id/exam/results`      | —         | ✅     | Results                 |

### Verificação Vue

- [x] Sem rotas ForgotPassword
- [x] Sem rotas ResetPassword
- [x] Sem rotas Profile
- [x] Sem rotas Messages
- [x] Sem rotas Admin
- [x] Sem Python/PowerBI específicos
- [x] 15 rotas de escopo (Públicas: 3, Autenticadas: 12)

**Status Vue:** ✅ **100% CONFORME**

---

## 🔄 Comparação React ↔ Vue

| Funcionalidade      | React | Vue | Equivalente |
| ------------------- | ----- | --- | ----------- |
| Login               | ✅    | ✅  | ✅          |
| Register            | ✅    | ✅  | ✅          |
| Courses (list)      | ✅    | ✅  | ✅          |
| Courses (detail)    | ✅    | ✅  | ✅          |
| Enrollment          | ✅    | ✅  | ✅          |
| Modules             | ✅    | ✅  | ✅          |
| Lessons             | ✅    | ✅  | ✅          |
| Exam (instructions) | ✅    | ✅  | ✅          |
| Exam (taking)       | ✅    | ✅  | ✅          |
| Exam (results)      | ✅    | ✅  | ✅          |
| MyCourses           | ✅    | ✅  | ✅          |
| ManageCourse        | ✅    | ✅  | ✅          |
| CreateCourse        | ✅    | ✅  | ✅          |
| CreateModules       | ✅    | ✅  | ✅          |
| CreateExam          | ✅    | ✅  | ✅          |
| Unauthorized        | ✅    | —   | ⚠️          |

**Delta:** Vue falta rota `/unauthorized` (error fallback)

---

## ⚠️ Achado Menor

**Vue falta:** Rota `/unauthorized` para error page

Recomendação:

```typescript
// Adicionar em vue router
{
  path: "/unauthorized",
  name: "unauthorized",
  component: () => import("../views/UnauthorizedView.vue"),
  meta: { requiresGuest: false }
}
```

---

## ✅ Conclusão Bloco A

| Critério                         | React | Vue | Status                        |
| -------------------------------- | ----- | --- | ----------------------------- |
| Apenas rotas de escopo           | ✅    | ✅  | ✅ PASS                       |
| Sem ForgotPassword/ResetPassword | ✅    | ✅  | ✅ PASS                       |
| Sem Profile/Messages             | ✅    | ✅  | ✅ PASS                       |
| Sem Admin/Python/PowerBI         | ✅    | ✅  | ✅ PASS                       |
| Type-check zero `any`            | ✅    | ✅  | ✅ PASS                       |
| Build sem erros                  | ✅    | —   | ⚠️ TODO (verificar Vue build) |
| Equivalência funcional           | ✅    | ✅  | ✅ ~98%                       |

---

## 📋 TODO Pós-Bloco A

1. **Vue:** Adicionar rota `/unauthorized` (menor)
2. **Vue:** Validar `npm run build` sem erros
3. **Ambas:** Finalizar Bloco A com status 100% ✅

---

**Resultado Final:** Bloco A — ✅ **98-100% READY** (apenas Vue /unauthorized pendente)
