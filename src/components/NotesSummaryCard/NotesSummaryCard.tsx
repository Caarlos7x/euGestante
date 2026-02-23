import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaStickyNote } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { Card } from '@/components/Card';

const SummaryCardContainer = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.normal},
    box-shadow ${({ theme }) => theme.transitions.normal};
  position: relative;
  min-height: 12rem; /* 144px */

  &:hover {
    transform: translateY(-0.25rem); /* -3px */
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CardIcon = styled.div`
  font-size: 3rem; /* 36px */
  color: ${({ theme }) => theme.colors.primary.main};
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 4rem; /* 48px - aumentar em mobile */
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']}; /* Aumentar em mobile */
  }
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Manter legível */
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const ArrowIcon = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.primary.main};
  transition: transform ${({ theme }) => theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }

  ${SummaryCardContainer}:hover & {
    transform: translateX(0.25rem); /* 3px */
  }
`;

export const NotesSummaryCard: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/my-notes');
  };

  return (
    <SummaryCardContainer padding="lg" elevation="sm" onClick={handleClick}>
      <CardContent>
        <CardIcon>
          <FaStickyNote />
        </CardIcon>
        <CardTitle>Minhas Anotações</CardTitle>
        <CardDescription>
          Visualize e gerencie todas as suas anotações de exames e consultas
        </CardDescription>
      </CardContent>
      <ArrowIcon>
        <HiArrowRight />
      </ArrowIcon>
    </SummaryCardContainer>
  );
};
