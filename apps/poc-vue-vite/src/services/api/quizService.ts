const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const quizService = {
  async generateAIQuiz(moduleId: string) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/quiz/gerar`, { method: 'POST' });
    
    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.sucesso === false)) {
      throw new Error(data?.mensagem || 'Erro ao gerar a prova com IA.');
    }
    
    return data?.dados || data?.data || ""; 
  },

  async regenerateAIQuiz(moduleId: string) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/quiz/regerar`, { method: 'POST' });
    
    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.sucesso === false)) {
      throw new Error(data?.mensagem || 'Erro ao regerar a prova com IA.');
    }
    
    return data?.dados || data?.data || "";
  },

  async confirmAIQuiz(moduleId: string) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/quiz/confirmar`, { method: 'POST' });
    
    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.sucesso === false)) {
      throw new Error(data?.mensagem || 'Erro ao confirmar a prova.');
    }
    
    return data?.dados || data?.data || "ok";
  }
};