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
  { path: "cadastrar", Component: CadastrarPage },
  { path: "esqueceu-senha", Component: EsqueceuSenhaPage },
  {
    path: "cursos",
    Component: AuthLayout,
    children: [
      { index: true, Component: CursosPage },
      { path: ":id/gerenciar", Component: ProfessorCursoGerenciarPage },
      // ── Power BI ──────────────────────────────────────────────────────────────
      { path: "power-bi", Component: CursoDetailPage },
      { path: "power-bi/inscricao", Component: InscricaoPage },
      { path: "power-bi/modulos", Component: ModulosPage },
      { path: "power-bi/modulos/:modId", Component: AulasPage },
      { path: "power-bi/prova/instrucoes", Component: ProvaInstrucoesPage },
      { path: "power-bi/prova", Component: ProvaPage },
      { path: "power-bi/prova/resultado", Component: ProvaResultadoPage },
      { path: "power-bi/gerenciar", Component: ProfessorCursoGerenciarPage },
      // ── Python (visão de aluno — disponível para professor com papel de aluno) ─
      { path: "python", Component: PythonDetailPage },
      { path: "python/inscricao", Component: PythonInscricaoPage },
      { path: "python/modulos", Component: PythonModulosPage },
      { path: "python/modulos/:modId", Component: PythonAulasPage },
      { path: "python/prova/instrucoes", Component: PythonProvaInstrucoesPage },
      { path: "python/prova", Component: PythonProvaPage },
      { path: "python/prova/resultado", Component: PythonProvaResultadoPage },
    ],
  },
  {
    path: "perfil",
    Component: AuthLayout,
    children: [{ index: true, Component: ProfilePage }],
  },
  {
    path: "meus-cursos",
    Component: AuthLayout,
    children: [{ index: true, Component: MeusCursosPage }],
  },
  {
    path: "criar-curso",
    Component: AuthLayout,
    children: [
      { index: true, Component: CriarCursoPage },
      { path: "modulos", Component: CriarModulosPage },
      { path: "prova", Component: CriarProvaPage },
    ],
  },
  {
    path: "mensagem",
    Component: AuthLayout,
    children: [{ index: true, Component: MensagemPage }],
  },
  {
    path: "mensagens",
    Component: AuthLayout,
    children: [{ index: true, Component: MensagensPage }],
  },
  {
    path: "mensagens-recebidas",
    Component: AuthLayout,
    children: [{ index: true, Component: MensagensEstudantePage }],
  },
]);
