// utils/httpErrorMessages.ts
// Centraliza mensagens amigáveis para erros HTTP, incluindo status code.

export function getFriendlyErrorMessage(status: number, context?: "login" | "perfil"): string {
  switch (status) {
    case 401:
      return context === "login"
        ? "Credenciais inválidas. Por favor, verifique seu e-mail e senha. (Erro 401)"
        : "Sessão expirada ou não autenticada. Faça login novamente. (Erro 401)";
    case 403:
      return context === "login"
        ? "Acesso negado. Seu perfil não possui permissão ou está inativo. (Erro 403)"
        : "Você não tem permissão para acessar este recurso. (Erro 403)";
    case 409:
      return "Conflito de dados. Por favor, tente novamente. (Erro 409)";
    case 422:
      return "Dados inválidos ou incompletos. Corrija os campos destacados. (Erro 422)";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Erro interno do servidor. Tente novamente mais tarde. (Erro " + status + ")";
    default:
      return "Ocorreu um erro inesperado. (Erro " + status + ")";
  }
}
