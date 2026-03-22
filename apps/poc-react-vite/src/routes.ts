import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { CadastrarPage } from "./pages/CadastrarPage";
import { EsqueceuSenhaPage } from "./pages/EsqueceuSenhaPage";
import { AuthLayout } from "./components/shared/AuthLayout";
import { CursosPage } from "./pages/CursosPage";
import { CursoDetailPage } from "./pages/CursoDetailPage";
import { InscricaoPage } from "./pages/InscricaoPage";
import { ModulosPage } from "./pages/ModulosPage";
import { AulasPage } from "./pages/AulasPage";
import { ProvaInstrucoesPage } from "./pages/ProvaInstrucoesPage";
import { ProvaPage } from "./pages/ProvaPage";
import { ProvaResultadoPage } from "./pages/ProvaResultadoPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CriarCursoPage } from "./pages/CriarCursoPage";
import { CriarModulosPage } from "./pages/CriarModulosPage";
import { CriarProvaPage } from "./pages/CriarProvaPage";
import { ProfessorCursoPage } from "./pages/ProfessorCursoPage";
import { ProfessorCursoGerenciarPage } from "./pages/ProfessorCursoGerenciarPage";
import { MeusCursosPage } from "./pages/MeusCursosPage";
import { MensagemPage } from "./pages/MensagemPage";
import { MensagensPage } from "./pages/MensagensPage";
import { MensagensEstudantePage } from "./pages/MensagensEstudantePage";
// ── Python student-side pages ──────────────────────────────────────────────────
import { PythonDetailPage } from "./pages/PythonDetailPage";
import { PythonInscricaoPage } from "./pages/PythonInscricaoPage";
import { PythonModulosPage } from "./pages/PythonModulosPage";
import { PythonAulasPage } from "./pages/PythonAulasPage";
import { PythonProvaInstrucoesPage } from "./pages/PythonProvaInstrucoesPage";
import { PythonProvaPage } from "./pages/PythonProvaPage";
import { PythonProvaResultadoPage } from "./pages/PythonProvaResultadoPage";

export const router = createBrowserRouter([
  { index: true, Component: LoginPage },
  { path: "register", Component: CadastrarPage },
  { path: "forgot-password", Component: EsqueceuSenhaPage },
  {
    path: "courses",
    Component: AuthLayout,
    children: [
      { index: true, Component: CursosPage },
      { path: ":id/manage", Component: ProfessorCursoGerenciarPage },
      // ── Power BI ──────────────────────────────────────────────────────────────
      { path: "power-bi", Component: CursoDetailPage },
      { path: "power-bi/enrollment", Component: InscricaoPage },
      { path: "power-bi/modules", Component: ModulosPage },
      { path: "power-bi/modules/:modId", Component: AulasPage },
      { path: "power-bi/exam/instructions", Component: ProvaInstrucoesPage },
      { path: "power-bi/exam", Component: ProvaPage },
      { path: "power-bi/exam/results", Component: ProvaResultadoPage },
      { path: "power-bi/manage", Component: ProfessorCursoGerenciarPage },
      // ── Python (visão de aluno — disponível para professor com papel de aluno) ─
      { path: "python", Component: PythonDetailPage },
      { path: "python/enrollment", Component: PythonInscricaoPage },
      { path: "python/modules", Component: PythonModulosPage },
      { path: "python/modules/:modId", Component: PythonAulasPage },
      { path: "python/exam/instructions", Component: PythonProvaInstrucoesPage },
      { path: "python/exam", Component: PythonProvaPage },
      { path: "python/exam/results", Component: PythonProvaResultadoPage },
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
    children: [{ index: true, Component: MeusCursosPage }],
  },
  {
    path: "create-course",
    Component: AuthLayout,
    children: [
      { index: true, Component: CriarCursoPage },
      { path: "modules", Component: CriarModulosPage },
      { path: "exam", Component: CriarProvaPage },
    ],
  },
  {
    path: "message",
    Component: AuthLayout,
    children: [{ index: true, Component: MensagemPage }],
  },
  {
    path: "messages",
    Component: AuthLayout,
    children: [{ index: true, Component: MensagensPage }],
  },
  {
    path: "received-messages",
    Component: AuthLayout,
    children: [{ index: true, Component: MensagensEstudantePage }],
  },
]);
