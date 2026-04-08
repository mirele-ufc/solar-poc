import { createBrowserRouter } from "react-router-dom";
import { createElement } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
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
import { ManageCoursePage } from "./pages/ManageCoursePage";
import { MyCoursesPage } from "./pages/MyCoursesPage";
import { MessagePage } from "./pages/MessagePage";
import { MessagesPage } from "./pages/MessagesPage";
import { StudentMessagesPage } from "./pages/StudentMessagesPage";

import { PythonDetailPage } from "./pages/PythonDetailPage";
import { PythonEnrollmentPage } from "./pages/PythonEnrollmentPage";
import { PythonModulesPage } from "./pages/PythonModulesPage";
import { PythonLessonsPage } from "./pages/PythonLessonsPage";
import { PythonExamInstructionsPage } from "./pages/PythonExamInstructionsPage";
import { PythonExamPage } from "./pages/PythonExamPage";
import { PythonExamResultPage } from "./pages/PythonExamResultPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import type { UserRole } from "./routes/types";

// function createRoleGuard(allowedRoles: ReadonlyArray<UserRole>) {
//   return function RoleGuard() {
//     return createElement(ProtectedRoute, { allowedRoles });
//   };
// }

const STUDENT_AND_PROFESSOR_ROLES: ReadonlyArray<UserRole> = [
  "professor",
  "student",
];
const PROFESSOR_ONLY_ROLES: ReadonlyArray<UserRole> = ["professor"];
const STUDENT_ONLY_ROLES: ReadonlyArray<UserRole> = ["student"];

export const routes = createBrowserRouter([
  { index: true, Component: LoginPage },
  { path: "register", Component: RegisterPage },
  { path: "forgot-password", Component: ForgotPasswordPage },
  { path: "reset-password", Component: ResetPasswordPage },
  { path: "unauthorized", Component: UnauthorizedPage },
  {
    element: createElement(ProtectedRoute, {
      allowedRoles: STUDENT_AND_PROFESSOR_ROLES,
    }),
    children: [
      {
        path: "courses",
        element: <AuthLayout />,
        children: [
          { index: true, Component: CoursesPage },

          { path: "power-bi", Component: CourseDetailPage },
          { path: "power-bi/enrollment", Component: EnrollmentPage },
          { path: "power-bi/modules", Component: ModulesPage },
          { path: "power-bi/modules/:modId", Component: LessonsPage },
          {
            path: "power-bi/exam/instructions",
            Component: ExamInstructionsPage,
          },
          { path: "power-bi/exam", Component: ExamPage },
          { path: "power-bi/exam/results", Component: ExamResultPage },

          { path: "python", Component: PythonDetailPage },
          { path: "python/enrollment", Component: PythonEnrollmentPage },
          { path: "python/modules", Component: PythonModulesPage },
          { path: "python/modules/:modId", Component: PythonLessonsPage },
          {
            path: "python/exam/instructions",
            Component: PythonExamInstructionsPage,
          },
          { path: "python/exam", Component: PythonExamPage },
          { path: "python/exam/results", Component: PythonExamResultPage },
        ],
      },
      {
        path: "profile",
        element: <AuthLayout />,
        children: [{ index: true, element: <ProfilePage /> }],
      },
    ],
  },
  {
    element: createElement(ProtectedRoute, {
      allowedRoles: STUDENT_ONLY_ROLES,
    }),
    children: [
      {
        path: "received-messages",
        element: <AuthLayout />,
        children: [{ index: true, element: <StudentMessagesPage /> }],
      },
    ],
  },
  {
    element: createElement(ProtectedRoute, {
      allowedRoles: PROFESSOR_ONLY_ROLES,
    }),
    children: [
      {
        path: "courses",
        element: <AuthLayout />,
        children: [
          { path: ":id/manage", element: <ManageCoursePage /> },
          { path: "power-bi/manage", element: <ManageCoursePage /> },
        ],
      },
      {
        path: "my-courses",
        element: <AuthLayout />,
        children: [{ index: true, element: <MyCoursesPage /> }],
      },
      {
        path: "create-course",
        element: <AuthLayout />,
        children: [
          { index: true, element: <CreateCoursePage /> },
          { path: "modules", element: <CreateModulesPage /> },
          { path: "exam", element: <CreateExamPage /> },
        ],
      },
      {
        path: "message",
        element: <AuthLayout />,
        children: [{ index: true, element: <MessagePage /> }],
      },
      {
        path: "messages",
        element: <AuthLayout />,
        children: [{ index: true, element: <MessagesPage /> }],
      },
    ],
  },
]);
