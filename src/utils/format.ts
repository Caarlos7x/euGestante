/**
 * Formata o nome do usuário de "carlos.frei" para "Carlos Frei"
 * @param name - Nome do usuário (pode ser email, nome completo, etc)
 * @returns Nome formatado
 */
export const formatUserName = (name: string | null | undefined): string => {
  if (!name) {
    return 'Usuário';
  }

  // Se for um email, pegar a parte antes do @
  const namePart = name.includes('@') ? name.split('@')[0] : name;

  // Remover pontos, underscores e outros separadores
  const cleaned = namePart.replace(/[._-]/g, ' ');

  // Capitalizar primeira letra de cada palavra
  const formatted = cleaned
    .split(' ')
    .map((word) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .filter((word) => word.length > 0)
    .join(' ');

  return formatted || 'Usuário';
};

/**
 * Formata email para exibição
 * @param email - Email do usuário
 * @returns Email formatado ou string vazia
 */
export const formatEmail = (email: string | null | undefined): string => {
  if (!email) return '';
  return email.toLowerCase().trim();
};
