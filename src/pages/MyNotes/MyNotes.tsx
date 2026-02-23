import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { ExaminationNoteCard } from '@/components/ExaminationNoteCard';
import { DextroControlCard } from '@/components/DextroControlCard';
import { BloodPressureControlCard } from '@/components/BloodPressureControlCard';
import { MedicationCard } from '@/components/MedicationCard';
import { Button } from '@/components/Button';

const NotesContainer = styled.div`
  max-width: 100rem; /* 1200px baseado em 12px */
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); /* 240px */
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); /* 216px */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

interface ExaminationNote {
  id: string;
  title: string;
  date: string;
  notes?: string;
  type: 'exame' | 'consulta';
}

export const MyNotes: React.FC = () => {
  const navigate = useNavigate();

  // Dados mockados - em produção viriam de uma API
  const [notes] = useState<ExaminationNote[]>([]);

  return (
    <Layout>
      <NotesContainer>
        <PageHeader>
          <PageTitle>Minhas Anotações</PageTitle>
          <Button variant="primary" onClick={() => navigate('/home')}>
            Voltar
          </Button>
        </PageHeader>

        <NotesGrid>
          <DextroControlCard />
          <BloodPressureControlCard />
          <MedicationCard />
          {notes.length > 0 &&
            notes.map((note) => (
              <ExaminationNoteCard
                key={note.id}
                title={note.title}
                date={note.date}
                notes={note.notes}
                type={note.type}
              />
            ))}
        </NotesGrid>
      </NotesContainer>
    </Layout>
  );
};
