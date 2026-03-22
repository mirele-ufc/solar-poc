import { createContext, useContext, useState, ReactNode } from "react";

// ⚠️ PROTÓTIPO APENAS — credenciais hardcoded no cliente NÃO são seguras para produção.
// Em produção, toda autenticação DEVE ocorrer no servidor (HTTPS + HttpOnly cookies).
// Nunca exponha senhas ou tokens no bundle JavaScript.

export type UserProfile = {
  name: string;
  cpf: string;
  email: string;
  photoUrl: string | null;
  role: "professor" | "estudante";
  password?: string;
};

export type SentMessage = {
  id: string;
  recipientId: string;
  recipientLabel: string;
  subject: string;
  body: string;
  sentAt: string; // ISO date string
};

// Separação de credenciais do perfil público — apenas usadas internamente no login.
// Em produção isso deve ser uma chamada de API autenticada no servidor.
const CREDENTIALS: Record<string, { password: string; profile: UserProfile }> = {
  professor: {
    password: "professor",
    profile: {
      name: "Prof. Eduardo Silva",
      cpf: "98765432100",
      email: "professor@ufc.br",
      photoUrl: null,
      role: "professor",
    },
  },
  estudante: {
    password: "estudante",
    profile: {
      name: "Eduardo Marinho",
      cpf: "12345678901",
      email: "eduardo.marinho@ufc.br",
      photoUrl: null,
      role: "estudante",
    },
  },
};

type AppContextType = {
  enrolledCourses: string[];
  enroll: (courseId: string) => void;
  unenroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  user: UserProfile;
  updateUser: (partial: Partial<UserProfile>) => void;
  login: (username: string, password: string) => boolean;
  sentMessages: SentMessage[];
  sendMessage: (msg: Omit<SentMessage, "id" | "sentAt">) => void;
  /** Cursos nos quais o usuário possui papel de aluno (mesmo sendo professor no sistema) */
  courseStudentRoles: string[];
  hasCourseStudentRole: (courseId: string) => boolean;
};

const defaultUser: UserProfile = CREDENTIALS.estudante.profile;

// ⚠️ PROTÓTIPO: mensagens mockadas para demonstração.
const MOCK_MESSAGES: SentMessage[] = [
  {
    id: "msg-001",
    recipientId: "power-bi",
    recipientLabel: "Alunos de Power BI - Fundamentos",
    subject: "Bem-vindos ao curso de Power BI!",
    body: "Olá a todos! Seja muito bem-vindos ao curso de Power BI - Fundamentos. Nas próximas semanas exploraremos juntos as principais funcionalidades dessa poderosa ferramenta de Business Intelligence. Qualquer dúvida, estou à disposição.",
    sentAt: "2026-03-10T09:00:00.000Z",
  },
  {
    id: "msg-002",
    recipientId: "all",
    recipientLabel: "Alunos de todos os cursos",
    subject: "Aviso: Manutenção do sistema SOLAR",
    body: "Informamos que o sistema SOLAR passará por manutenção programada neste sábado, das 08h às 12h. Durante esse período o acesso estará temporariamente indisponível. Pedimos desculpas pelo inconveniente.",
    sentAt: "2026-03-08T14:30:00.000Z",
  },
  {
    id: "msg-003",
    recipientId: "power-bi",
    recipientLabel: "Alunos de Power BI - Fundamentos",
    subject: "Material complementar — Módulo 02",
    body: "Disponibilizei na plataforma um material complementar sobre Power Query que irá ajudá-los na prática do Módulo 02. Aproveitem para revisar os conceitos antes da prova. Bons estudos!",
    sentAt: "2026-03-05T11:15:00.000Z",
  },
];

const AppContext = createContext<AppContextType>({
  enrolledCourses: [],
  enroll: () => {},
  unenroll: () => {},
  isEnrolled: () => false,
  user: defaultUser,
  updateUser: () => {},
  login: () => false,
  sentMessages: MOCK_MESSAGES,
  sendMessage: () => {},
  courseStudentRoles: [],
  hasCourseStudentRole: () => false,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [sentMessages, setSentMessages] = useState<SentMessage[]>(MOCK_MESSAGES);

  // Cursos em que o usuário age como aluno (mesmo sendo professor no sistema).
  // Princípio de privilégio mínimo por contexto de curso.
  // ⚠️ PROTÓTIPO: em produção, este mapeamento deve vir do servidor.
  const [courseStudentRoles, setCourseStudentRoles] = useState<string[]>([]);

  const enroll = (courseId: string) =>
    setEnrolledCourses((prev) => prev.includes(courseId) ? prev : [...prev, courseId]);

  const unenroll = (courseId: string) =>
    setEnrolledCourses((prev) => prev.filter((id) => id !== courseId));

  const isEnrolled = (courseId: string) => enrolledCourses.includes(courseId);

  const hasCourseStudentRole = (courseId: string) => courseStudentRoles.includes(courseId);

  const updateUser = (partial: Partial<UserProfile>) =>
    setUser((prev) => ({ ...prev, ...partial }));

  const login = (username: string, password: string): boolean => {
    const entry = CREDENTIALS[username.toLowerCase()];
    if (entry && entry.password === password) {
      setUser({ ...entry.profile });
      // Professor possui papel de aluno no curso Python (por autorização administrativa)
      if (entry.profile.role === "professor") {
        setCourseStudentRoles(["python"]);
      } else {
        setCourseStudentRoles([]);
      }
      return true;
    }
    return false;
  };

  const sendMessage = (msg: Omit<SentMessage, "id" | "sentAt">) => {
    const newMsg: SentMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    setSentMessages((prev) => [newMsg, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      enrolledCourses, enroll, unenroll, isEnrolled,
      user, updateUser, login,
      sentMessages, sendMessage,
      courseStudentRoles, hasCourseStudentRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
