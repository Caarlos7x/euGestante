import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from '@/components/Card';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { formatUserName } from '@/utils/format';

const DashboardContainer = styled.div`
  max-width: 100rem; /* 1200px baseado em 12px */
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const userName = profile?.nome || formatUserName(user.email || null);

  return (
    <Layout>
      <DashboardContainer>
        <Title>Bem-vinda, {userName}!</Title>
        <WelcomeText>
          Acompanhe sua gestação com cuidado e carinho
        </WelcomeText>

        <Card padding="lg" elevation="md">
          <h2>Informações do Perfil</h2>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Email:</strong> {user.email}</p>
            {profile?.nome && <p><strong>Nome:</strong> {profile.nome}</p>}
            {profile?.dataGestacaoInicio && (
              <p><strong>Início da Gestação:</strong> {new Date(profile.dataGestacaoInicio).toLocaleDateString('pt-BR')}</p>
            )}
            {profile?.dataPrevistaParto && (
              <p><strong>Data Prevista do Parto:</strong> {new Date(profile.dataPrevistaParto).toLocaleDateString('pt-BR')}</p>
            )}
            {profile?.idadeGestacionalAtual && (
              <p><strong>Idade Gestacional:</strong> {profile.idadeGestacionalAtual} semanas</p>
            )}
            {profile?.telefone && <p><strong>Telefone:</strong> {profile.telefone}</p>}
          </div>
        </Card>

        <Card padding="lg" elevation="md" style={{ marginTop: '1.5rem' }}>
          <h2>Funcionalidades</h2>
          <p style={{ marginTop: '1rem', color: '#6C757D' }}>
            Em breve você poderá acessar todas as funcionalidades do euGestante aqui.
          </p>
        </Card>
      </DashboardContainer>
    </Layout>
  );
};
