/**
 * Serviço para buscar dicas de saúde para gestação
 * Por enquanto usa dados mockados, mas pode ser facilmente substituído por uma API real
 */

import { IconType } from 'react-icons';
import { 
  FaAppleAlt, 
  FaTint, 
  FaRunning, 
  FaPills, 
  FaBed, 
  FaBan, 
  FaUserMd, 
  FaHeart, 
  FaChair, 
  FaBrain 
} from 'react-icons/fa';

export interface PregnancyTip {
  id: string;
  title: string;
  description: string;
  category: string;
  week?: number;
  icon?: IconType;
  source?: string;
}

// Dados mockados de dicas de gestação
const mockTips: PregnancyTip[] = [
  {
    id: '1',
    title: 'Alimentação Saudável',
    description:
      'Mantenha uma dieta equilibrada rica em ácido fólico, ferro, cálcio e proteínas. Evite alimentos crus e não pasteurizados.',
    category: 'Nutrição',
    week: 1,
    icon: FaAppleAlt,
  },
  {
    id: '2',
    title: 'Hidratação',
    description:
      'Beba pelo menos 2-3 litros de água por dia. A hidratação adequada ajuda a prevenir infecções urinárias e mantém o líquido amniótico saudável.',
    category: 'Saúde',
    week: 2,
    icon: FaTint,
  },
  {
    id: '3',
    title: 'Exercícios Leves',
    description:
      'Pratique exercícios moderados como caminhada, natação ou yoga pré-natal. Sempre consulte seu médico antes de iniciar qualquer atividade física.',
    category: 'Exercício',
    week: 3,
    icon: FaRunning,
  },
  {
    id: '4',
    title: 'Suplementação',
    description:
      'Tome os suplementos recomendados pelo seu médico, especialmente ácido fólico nos primeiros meses e ferro conforme orientação.',
    category: 'Saúde',
    week: 4,
    icon: FaPills,
  },
  {
    id: '5',
    title: 'Descanso Adequado',
    description:
      'Durma pelo menos 8 horas por noite e descanse quando sentir necessidade. O corpo está trabalhando muito para criar uma nova vida.',
    category: 'Bem-estar',
    week: 5,
    icon: FaBed,
  },
  {
    id: '6',
    title: 'Evite Álcool e Tabaco',
    description:
      'Não consuma álcool, tabaco ou drogas durante a gestação. Essas substâncias podem causar sérios problemas ao desenvolvimento do bebê.',
    category: 'Saúde',
    week: 6,
    icon: FaBan,
  },
  {
    id: '7',
    title: 'Consultas Pré-natais',
    description:
      'Mantenha todas as consultas de pré-natal em dia. O acompanhamento médico regular é essencial para uma gestação saudável.',
    category: 'Saúde',
    week: 7,
    icon: FaUserMd,
  },
  {
    id: '8',
    title: 'Cuidados com a Pele',
    description:
      'Use protetor solar diariamente e hidratantes para prevenir estrias. Evite produtos com ácidos e sempre consulte seu médico sobre cosméticos.',
    category: 'Bem-estar',
    week: 8,
    icon: FaHeart,
  },
  {
    id: '9',
    title: 'Postura Correta',
    description:
      'Mantenha uma boa postura ao sentar e levantar. Use travesseiros para apoiar as costas e pernas ao dormir, especialmente no final da gestação.',
    category: 'Bem-estar',
    week: 9,
    icon: FaChair,
  },
  {
    id: '10',
    title: 'Preparação Mental',
    description:
      'Pratique técnicas de relaxamento e respiração. A preparação mental é tão importante quanto a física para uma gestação tranquila.',
    category: 'Bem-estar',
    week: 10,
    icon: FaBrain,
  },
];

/**
 * Busca dicas de gestação
 * Por enquanto retorna dados mockados, mas pode ser facilmente adaptado para uma API real
 */
export const getPregnancyTips = async (
  limit?: number,
  category?: string
): Promise<PregnancyTip[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  let tips = [...mockTips];

  // Filtrar por categoria se fornecida
  if (category) {
    tips = tips.filter((tip) => tip.category === category);
  }

  // Limitar resultados se fornecido
  if (limit) {
    tips = tips.slice(0, limit);
  }

  return tips;
};

/**
 * Busca uma dica específica por ID
 */
export const getPregnancyTipById = async (id: string): Promise<PregnancyTip | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTips.find((tip) => tip.id === id) || null;
};
