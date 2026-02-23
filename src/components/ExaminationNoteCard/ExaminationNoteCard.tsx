import styled from 'styled-components';
import { Card } from '@/components/Card';

interface ExaminationNoteCardProps {
  title: string;
  date: string;
  notes?: string;
  type?: 'exame' | 'consulta';
}

const NoteCardContainer = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.normal},
    box-shadow ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-0.25rem); /* -3px */
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoteType = styled.span<{ $type: 'exame' | 'consulta' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, $type }) =>
    $type === 'exame' ? theme.colors.primary.main : theme.colors.secondary.main};
  background-color: ${({ theme, $type }) =>
    $type === 'exame' ? theme.colors.primary.light : theme.colors.secondary.light};
  padding: 0.166rem 0.5rem; /* 2px 6px */
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const NoteDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const NoteTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const NoteDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ExaminationNoteCard: React.FC<ExaminationNoteCardProps> = ({
  title,
  date,
  notes,
  type = 'exame',
}) => {
  return (
    <NoteCardContainer padding="md" elevation="sm">
      <NoteHeader>
        <NoteType $type={type}>{type === 'exame' ? 'Exame' : 'Consulta'}</NoteType>
        <NoteDate>{date}</NoteDate>
      </NoteHeader>
      <NoteTitle>{title}</NoteTitle>
      {notes && <NoteDescription>{notes}</NoteDescription>}
    </NoteCardContainer>
  );
};
