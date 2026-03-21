import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { CadastrarPage } from "./components/CadastrarPage";
import { EsqueceuSenhaPage } from "./components/EsqueceuSenhaPage";
import { AuthLayout } from "./components/AuthLayout";
import { CursosPage } from "./components/CursosPage";
import { CursoDetailPage } from "./components/CursoDetailPage";
import { InscricaoPage } from "./components/InscricaoPage";
import { ModulosPage } from "./components/ModulosPage";
import { AulasPage } from "./components/AulasPage";
import { ProvaInstrucoesPage } from "./components/ProvaInstrucoesPage";
import { ProvaPage } from "./components/ProvaPage";
import { ProvaResultadoPage } from "./components/ProvaResultadoPage";
import { ProfilePage } from "./components/ProfilePage";
import { CriarCursoPage } from "./components/CriarCursoPage";
import { CriarModulosPage } from "./components/CriarModulosPage";
import { CriarProvaPage } from "./components/CriarProvaPage";
import { ProfessorCursoPage } from "./components/ProfessorCursoPage";
import { ProfessorCursoGerenciarPage } from "./components/ProfessorCursoGerenciarPage";
import { MeusCursosPage } from "./components/MeusCursosPage";
import { MensagemPage } from "./components/MensagemPage";
import { MensagensPage } from "./components/MensagensPage";
import { MensagensEstudantePage } from "./components/MensagensEstudantePage";
// ── Python student-side pages ──────────────────────────────────────────────────
import { PythonDetailPage } from "./components/PythonDetailPage";
import { PythonInscricaoPage } from "./components/PythonInscricaoPage";
import { PythonModulosPage } from "./components/PythonModulosPage";
import { PythonAulasPage } from "./components/PythonAulasPage";
import { PythonProvaInstrucoesPage } from "./components/PythonProvaInstrucoesPage";
import { PythonProvaPage } from "./components/PythonProvaPage";
import { PythonProvaResultadoPage } from "./components/PythonProvaResultadoPage";

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