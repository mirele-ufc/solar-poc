import { createBrowserRouter } from "react-router";
import { LoginPage } from "./app/components/LoginPage";
import { CadastrarPage } from "./app/components/CadastrarPage";
import { EsqueceuSenhaPage } from "./app/components/EsqueceuSenhaPage";
import { AuthLayout } from "./app/components/AuthLayout";
import { CursosPage } from "./app/components/CursosPage";
import { CursoDetailPage } from "./app/components/CursoDetailPage";
import { InscricaoPage } from "./app/components/InscricaoPage";
import { ModulosPage } from "./app/components/ModulosPage";
import { AulasPage } from "./app/components/AulasPage";
import { ProvaInstrucoesPage } from "./app/components/ProvaInstrucoesPage";
import { ProvaPage } from "./app/components/ProvaPage";
import { ProvaResultadoPage } from "./app/components/ProvaResultadoPage";
import { ProfilePage } from "./app/components/ProfilePage";
import { CriarCursoPage } from "./app/components/CriarCursoPage";
import { CriarModulosPage } from "./app/components/CriarModulosPage";
import { CriarProvaPage } from "./app/components/CriarProvaPage";
import { ProfessorCursoPage } from "./app/components/ProfessorCursoPage";
import { ProfessorCursoGerenciarPage } from "./app/components/ProfessorCursoGerenciarPage";
import { MeusCursosPage } from "./app/components/MeusCursosPage";
import { MensagemPage } from "./app/components/MensagemPage";
import { MensagensPage } from "./app/components/MensagensPage";
import { MensagensEstudantePage } from "./app/components/MensagensEstudantePage";
// ── Python student-side pages ──────────────────────────────────────────────────
import { PythonDetailPage } from "./app/components/PythonDetailPage";
import { PythonInscricaoPage } from "./app/components/PythonInscricaoPage";
import { PythonModulosPage } from "./app/components/PythonModulosPage";
import { PythonAulasPage } from "./app/components/PythonAulasPage";
import { PythonProvaInstrucoesPage } from "./app/components/PythonProvaInstrucoesPage";
import { PythonProvaPage } from "./app/components/PythonProvaPage";
import { PythonProvaResultadoPage } from "./app/components/PythonProvaResultadoPage";

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
