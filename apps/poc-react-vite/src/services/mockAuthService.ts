import type { IRegisterPayload } from "./types/authService.types";

type MockRegisteredUser = {
  nome: string;
  cpf: string;
  email: string;
  perfil: "PROFESSOR" | "ALUNO";
};

const registeredUsers: MockRegisteredUser[] = [
  {
    nome: "Prof. Eduardo Silva",
    cpf: "98765432100",
    email: "professor@ufc.br",
    perfil: "PROFESSOR",
  },
  {
    nome: "Eduardo Marinho",
    cpf: "12345678901",
    email: "aluno@ufc.br",
    perfil: "ALUNO",
  },
];

function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export const mockAuthService = {
  async register(payload: IRegisterPayload): Promise<void> {
    const normalizedCpf = normalizeCpf(payload.cpf);
    const normalizedEmail = payload.email.trim().toLowerCase();

    const conflict = registeredUsers.some(
      (user) =>
        normalizeCpf(user.cpf) === normalizedCpf ||
        user.email.trim().toLowerCase() === normalizedEmail,
    );

    if (conflict) {
      throw {
        status: 409,
        message: "CPF ou email já cadastrados no sistema.",
      };
    }

    registeredUsers.push({
      nome: payload.nome,
      cpf: payload.cpf,
      email: payload.email,
      perfil: payload.perfil ?? "ALUNO",
    });
  },
};
