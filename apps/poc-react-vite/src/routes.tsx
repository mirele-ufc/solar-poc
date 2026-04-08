import { createBrowserRouter } from "react-router-dom";
import { createElement } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
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
import { CreateCoursePage } from "./pages/CreateCoursePage";
import { CreateModulesPage } from "./pages/CreateModulesPage";
import { CreateExamPage } from "./pages/CreateExamPage";
import { ManageCoursePage } from "./pages/ManageCoursePage";
import { MyCoursesPage } from "./pages/MyCoursesPage";
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

          { path: ":id", Component: CourseDetailPage },
          { path: ":id/enrollment", Component: EnrollmentPage },
          { path: ":id/modules", Component: ModulesPage },
          { path: ":id/modules/:modId", Component: LessonsPage },
          {
            path: ":id/exam/instructions",
            Component: ExamInstructionsPage,
          },
          { path: ":id/exam", Component: ExamPage },
          { path: ":id/exam/results", Component: ExamResultPage },
        ],
      },

    ],
  },
  {
    element: createElement(ProtectedRoute, {
      allowedRoles: STUDENT_ONLY_ROLES,
    }),
    children: [

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

    ],
  },
]);
