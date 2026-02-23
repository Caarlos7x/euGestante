import styled from 'styled-components';
import { IconType } from 'react-icons';
import { Card } from '@/components/Card';

interface TipCardProps {
  title: string;
  description: string;
  category?: string;
  week?: number;
  icon?: IconType;
}

const TipCardContainer = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.normal},
    box-shadow ${({ theme }) => theme.transitions.normal};
  height: auto; /* Altura automática para mostrar todo o conteúdo */
  min-height: auto;

  &:hover {
    transform: translateY(-0.25rem); /* -3px */
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column; /* Empilhar verticalmente em mobile */
    align-items: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const TipContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    align-items: center;
  }
`;

const TipHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const TipCategory = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary.main};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm}; /* Aumentar em mobile */
  }
`;

const TipWeek = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary.contrast}; /* Texto branco para melhor contraste */
  background-color: ${({ theme }) => theme.colors.secondary.main}; /* Rosa mais forte */
  padding: 0.333rem 0.833rem; /* 4px 10px - aumentar padding */
  border-radius: ${({ theme }) => theme.borderRadius.full};
  box-shadow: 0 0.166rem 0.333rem ${({ theme }) => theme.colors.secondary.main}40; /* Sombra rosa suave */
  display: inline-block;
  white-space: nowrap;
  letter-spacing: 0.02em;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Aumentar ainda mais em mobile */
    padding: 0.5rem 1rem; /* 6px 12px - padding maior em mobile */
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

const TipTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl}; /* Aumentar em mobile */
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const TipDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  flex: 1;
  display: block; /* Sempre mostrar texto completo */
  overflow: visible;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const TipIcon = styled.div`
  flex-shrink: 0;
  line-height: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  svg {
    width: 2rem; /* 24px */
    height: 2rem; /* 24px */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    svg {
      width: 2.5rem; /* 30px - aumentar em mobile */
      height: 2.5rem; /* 30px */
    }
  }
`;

export const TipCard: React.FC<TipCardProps> = ({
  title,
  description,
  category,
  week,
  icon: Icon,
}) => {
  return (
    <TipCardContainer padding="md" elevation="sm">
      {Icon && (
        <TipIcon>
          <Icon />
        </TipIcon>
      )}
      <TipContent>
        <TipHeader>
          {category && <TipCategory>{category}</TipCategory>}
          {week && <TipWeek>Semana {week}</TipWeek>}
        </TipHeader>
        <TipTitle>{title}</TipTitle>
        <TipDescription>{description}</TipDescription>
      </TipContent>
    </TipCardContainer>
  );
};
