import { createBrowserRouter } from "react-router-dom";
import { createElement, lazy, Suspense } from "react";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import type { UserRole } from "./routes/types";

// Lazy-loaded pages (code-split por rota)
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const UnauthorizedPage = lazy(() =>
  import("./pages/UnauthorizedPage").then((m) => ({
    default: m.UnauthorizedPage,
  })),
);
const AuthLayout = lazy(() =>
  import("./components/shared/AuthLayout").then((m) => ({
    default: m.AuthLayout,
  })),
);
const CoursesPage = lazy(() =>
  import("./pages/CoursesPage").then((m) => ({ default: m.CoursesPage })),
);
const CourseDetailPage = lazy(() =>
  import("./pages/CourseDetailPage").then((m) => ({
    default: m.CourseDetailPage,
  })),
);
const EnrollmentPage = lazy(() =>
  import("./pages/EnrollmentPage").then((m) => ({
    default: m.EnrollmentPage,
  })),
);
const ModulesPage = lazy(() =>
  import("./pages/ModulesPage").then((m) => ({ default: m.ModulesPage })),
);
const LessonsPage = lazy(() =>
  import("./pages/LessonsPage").then((m) => ({ default: m.LessonsPage })),
);
const ExamInstructionsPage = lazy(() =>
  import("./pages/ExamInstructionsPage").then((m) => ({
    default: m.ExamInstructionsPage,
  })),
);
const ExamPage = lazy(() =>
  import("./pages/ExamPage").then((m) => ({ default: m.ExamPage })),
);
const ExamResultPage = lazy(() =>
  import("./pages/ExamResultPage").then((m) => ({
    default: m.ExamResultPage,
  })),
);
const CreateCoursePage = lazy(() =>
  import("./pages/CreateCoursePage").then((m) => ({
    default: m.CreateCoursePage,
  })),
);
const CreateModulesPage = lazy(() =>
  import("./pages/CreateModulesPage").then((m) => ({
    default: m.CreateModulesPage,
  })),
);
const CreateExamPage = lazy(() =>
  import("./pages/CreateExamPage").then((m) => ({
    default: m.CreateExamPage,
  })),
);
const ManageCoursePage = lazy(() =>
  import("./pages/ManageCoursePage").then((m) => ({
    default: m.ManageCoursePage,
  })),
);
const MyCoursesPage = lazy(() =>
  import("./pages/MyCoursesPage").then((m) => ({ default: m.MyCoursesPage })),
);

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

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
  {
    path: "register",
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "unauthorized",
    element: (
      <SuspenseWrapper>
        <UnauthorizedPage />
      </SuspenseWrapper>
    ),
  },
  {
    element: createElement(ProtectedRoute, {
      allowedRoles: STUDENT_AND_PROFESSOR_ROLES,
    }),
    children: [
      {
        path: "courses",
        element: (
          <SuspenseWrapper>
            <AuthLayout />
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <CoursesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ":id",
            element: (
              <SuspenseWrapper>
                <CourseDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ":id/enrollment",
            element: (
              <SuspenseWrapper>
                <EnrollmentPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ":id/modules",
            element: (
              <SuspenseWrapper>
                <ModulesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ":id/modules/:modId",
            element: (
              <SuspenseWrapper>
                <LessonsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ":id/exam/instructions",
            element: (
              <SuspenseWrapper>
                <ExamInstructionsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ":id/exam",
            element: (
              <SuspenseWrapper>
                <ExamPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ":id/exam/results",
            element: (
              <SuspenseWrapper>
                <ExamResultPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    element: createElement(ProtectedRoute, {
      allowedRoles: STUDENT_ONLY_ROLES,
    }),
    children: [],
  },
  {
    element: createElement(ProtectedRoute, {
      allowedRoles: PROFESSOR_ONLY_ROLES,
    }),
    children: [
      {
        path: "courses",
        element: (
          <SuspenseWrapper>
            <AuthLayout />
          </SuspenseWrapper>
        ),
        children: [
          {
            path: ":id/manage",
            element: (
              <SuspenseWrapper>
                <ManageCoursePage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: "my-courses",
        element: (
          <SuspenseWrapper>
            <AuthLayout />
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <MyCoursesPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: "create-course",
        element: (
          <SuspenseWrapper>
            <AuthLayout />
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <CreateCoursePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "modules",
            element: (
              <SuspenseWrapper>
                <CreateModulesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "exam",
            element: (
              <SuspenseWrapper>
                <CreateExamPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);
