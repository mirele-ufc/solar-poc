import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AuthLayout } from "./components/shared/AuthLayout";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { EnrollmentPage } from "./pages/EnrollmentPage";
import { ModulesPage } from "./pages/ModulesPage";
import { LessonsPage } from "./pages/LessonsPage";
import { ExamInstructionsPage } from "./pages/ExamInstructionsPage";
import { ExamPage } from "./pages/ExamPage";
import { ExamResultPage } from "./pages/ExamResultPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CreateCoursePage } from "./pages/CreateCoursePage";
import { CreateModulesPage } from "./pages/CreateModulesPage";
import { CreateExamPage } from "./pages/CreateExamPage";
import { TeacherCoursePage } from "./pages/TeacherCoursePage";
import { ManageCoursePage } from "./pages/ManageCoursePage";
import { MyCoursesPage } from "./pages/MyCoursesPage";
import { MessagePage } from "./pages/MessagePage";
import { MessagesPage } from "./pages/MessagesPage";
import { StudentMessagesPage } from "./pages/StudentMessagesPage";
// ── Python student-side pages ──────────────────────────────────────────────────
import { PythonDetailPage } from "./pages/PythonDetailPage";
import { PythonEnrollmentPage } from "./pages/PythonEnrollmentPage";
import { PythonModulesPage } from "./pages/PythonModulesPage";
import { PythonLessonsPage } from "./pages/PythonLessonsPage";
import { PythonExamInstructionsPage } from "./pages/PythonExamInstructionsPage";
import { PythonExamPage } from "./pages/PythonExamPage";
import { PythonExamResultPage } from "./pages/PythonExamResultPage";

export const router = createBrowserRouter([
  { index: true, Component: LoginPage },
  { path: "register", Component: RegisterPage },
  { path: "forgot-password", Component: ForgotPasswordPage },
  {
    path: "courses",
    Component: AuthLayout,
    children: [
      { index: true, Component: CoursesPage },
      { path: ":id/manage", Component: ManageCoursePage },
      // ── Power BI ──────────────────────────────────────────────────────────────
      { path: "power-bi", Component: CourseDetailPage },
      { path: "power-bi/enrollment", Component: EnrollmentPage },
      { path: "power-bi/modules", Component: ModulesPage },
      { path: "power-bi/modules/:modId", Component: LessonsPage },
      { path: "power-bi/exam/instructions", Component: ExamInstructionsPage },
      { path: "power-bi/exam", Component: ExamPage },
      { path: "power-bi/exam/results", Component: ExamResultPage },
      { path: "power-bi/manage", Component: ManageCoursePage },
      // ── Python (visão de aluno — disponível para professor com papel de aluno) ─
      { path: "python", Component: PythonDetailPage },
      { path: "python/enrollment", Component: PythonEnrollmentPage },
      { path: "python/modules", Component: PythonModulesPage },
      { path: "python/modules/:modId", Component: PythonLessonsPage },
      { path: "python/exam/instructions", Component: PythonExamInstructionsPage },
      { path: "python/exam", Component: PythonExamPage },
      { path: "python/exam/results", Component: PythonExamResultPage },
    ],
  },
  {
    path: "profile",
    Component: AuthLayout,
    children: [{ index: true, Component: ProfilePage }],
  },
  {
    path: "my-courses",
    Component: AuthLayout,
    children: [{ index: true, Component: MyCoursesPage }],
  },
  {
    path: "create-course",
    Component: AuthLayout,
    children: [
      { index: true, Component: CreateCoursePage },
      { path: "modules", Component: CreateModulesPage },
      { path: "exam", Component: CreateExamPage },
    ],
  },
  {
    path: "message",
    Component: AuthLayout,
    children: [{ index: true, Component: MessagePage }],
  },
  {
    path: "messages",
    Component: AuthLayout,
    children: [{ index: true, Component: MessagesPage }],
  },
  {
    path: "received-messages",
    Component: AuthLayout,
    children: [{ index: true, Component: StudentMessagesPage }],
  },
]);
