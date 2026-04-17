export interface IRegisterPayload {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  perfil?: "PROFESSOR" | "ALUNO";
}

export interface IChangePasswordPayload {
  senhaAtual: string;
  novaSenha: string;
}

export interface IMessageResponse {
  message: string;
}

export interface IRefreshResponse {
  accessToken: string;
}
