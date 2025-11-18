import apiClient from './apiClient';

// Função para solicitar o link de redefinição de senha
const forgotPassword = (email) => {
  return apiClient.post('auth/forgot-password/consultant', { email });
};

// Função para redefinir a senha usando o código
const resetPassword = (code, newPassword) => {
  return apiClient.post('auth/reset-password/consultant', { code, newPassword });
};

const authService = {
  forgotPassword,
  resetPassword,
};

export default authService;