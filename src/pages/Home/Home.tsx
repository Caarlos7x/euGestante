import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { Layout } from '@/components/Layout';
import { Carousel } from '@/components/Carousel';
import { TipCard } from '@/components/TipCard';
import { NotesSummaryCard } from '@/components/NotesSummaryCard';
import { UpcomingAppointmentCard } from '@/components/UpcomingAppointmentCard';
import { HospitalsMap } from '@/components/HospitalsMap';
import { AddAppointmentModal } from '@/components/AddAppointmentModal';
import { Button } from '@/components/Button';
import { getPregnancyTips, PregnancyTip } from '@/services/pregnancyTips';
import { appointmentService, Appointment } from '@/services/appointmentService';
import { useAuth } from '@/contexts/AuthContext';

const HomeContainer = styled.div`
  max-width: 100rem; /* 1200px baseado em 12px */
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const HospitalsSection = styled(Section)`
  margin-top: ${({ theme }) => theme.spacing['4xl']}; /* 72px baseado em 12px */

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: ${({ theme }) => theme.spacing['3xl']}; /* 48px em mobile */
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']}; /* Manter maior em mobile */
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Aumentar em mobile */
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.error.light};
  color: ${({ theme }) => theme.colors.error.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const ColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing['4xl']}; /* 72px baseado em 12px - aumentado */

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing['3xl']}; /* Manter menor em mobile */
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ColumnTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']}; /* Manter maior em mobile */
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

// Função para formatar data de YYYY-MM-DD para DD/MM/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState<PregnancyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Carregar dicas
  useEffect(() => {
    const loadTips = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPregnancyTips(12); // Carregar 12 dicas
        setTips(data);
      } catch (err: any) {
        console.error('Erro ao carregar dicas:', err);
        setError('Erro ao carregar dicas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  // Carregar exames/consultas
  useEffect(() => {
    const loadAppointments = async () => {
      if (!user) return;

      try {
        setLoadingAppointments(true);
        const data = await appointmentService.getUpcomingAppointments(user.uid, 1);
        setAppointments(data);
      } catch (err: any) {
        console.error('Erro ao carregar exames/consultas:', err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    loadAppointments();
  }, [user, isAddModalOpen]);

  const handleAddSuccess = () => {
    // Os appointments serão recarregados automaticamente pelo useEffect
  };

  return (
    <Layout>
      <HomeContainer>
        <Section>
          <SectionTitle>Dicas de Saúde para Gestação</SectionTitle>
          <SectionSubtitle>
            Informações importantes para uma gestação saudável e tranquila
          </SectionSubtitle>

          {loading && <LoadingContainer>Carregando dicas...</LoadingContainer>}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {!loading && !error && tips.length > 0 && (
            <Carousel
              itemsPerView={3}
              gap="1.5rem"
              showArrows={true}
              showDots={true}
              autoPlay={true}
              autoPlayInterval={6000}
            >
              {tips.map((tip) => (
                <TipCard
                  key={tip.id}
                  title={tip.title}
                  description={tip.description}
                  category={tip.category}
                  week={tip.week}
                  icon={tip.icon}
                />
              ))}
            </Carousel>
          )}

          {!loading && !error && tips.length === 0 && (
            <LoadingContainer>
              Nenhuma dica disponível no momento.
            </LoadingContainer>
          )}
        </Section>

        <ColumnsContainer>
          <Column>
            <ColumnTitle>Minhas Anotações</ColumnTitle>
            <NotesSummaryCard />
          </Column>

          <Column>
            <ColumnHeader>
              <ColumnTitle>Próximos Exames / Consultas</ColumnTitle>
              <AddButton
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FaPlus /> Adicionar
              </AddButton>
            </ColumnHeader>
            {loadingAppointments ? (
              <EmptyState>Carregando...</EmptyState>
            ) : appointments.length > 0 ? (
              <UpcomingAppointmentCard
                title={appointments[0].title}
                date={formatDate(appointments[0].date)}
                time={appointments[0].time}
                location={appointments[0].location || appointments[0].hospitalName || appointments[0].address}
                doctor={appointments[0].doctor}
                type={appointments[0].type}
              />
            ) : (
              <EmptyState>
                Nenhum exame ou consulta agendado.
                <br />
                Clique em "Adicionar" para criar um novo.
              </EmptyState>
            )}
          </Column>
        </ColumnsContainer>

        <HospitalsSection>
          <SectionTitle>Hospitais e Maternidades Próximos</SectionTitle>
          <SectionSubtitle>
            Encontre hospitais e maternidades próximos à sua localização
          </SectionSubtitle>
          <HospitalsMap />
        </HospitalsSection>
      </HomeContainer>

      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </Layout>
  );
};
