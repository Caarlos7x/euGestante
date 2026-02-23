export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const getEmailError = (email: string): string | null => {
  if (!email) {
    return 'Email é obrigatório';
  }
  if (!validateEmail(email)) {
    return 'Email inválido';
  }
  return null;
};

export const getPasswordError = (password: string): string | null => {
  if (!password) {
    return 'Senha é obrigatória';
  }
  if (!validatePassword(password)) {
    return 'Senha deve ter no mínimo 6 caracteres';
  }
  return null;
};
