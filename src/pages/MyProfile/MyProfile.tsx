import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { formatUserName } from '@/utils/format';

const ProfileContainer = styled.div`
  max-width: 50rem; /* 600px baseado em 12px */
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const Section = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SuccessMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success.light};
  color: ${({ theme }) => theme.colors.success.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error.light};
  color: ${({ theme }) => theme.colors.error.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const MyProfile: React.FC = () => {
  const { user, profile, updateEmail, updatePassword, updateDisplayName } = useAuth();

  // Estados para nome de exibição
  const [displayName, setDisplayName] = useState(profile?.nome || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Estados para email
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Estados para senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Atualizar displayName quando profile mudar
  useEffect(() => {
    if (profile?.nome) {
      setDisplayName(profile.nome);
    } else if (user?.email) {
      setDisplayName(formatUserName(user.email));
    }
  }, [profile, user]);

  const handleUpdateName = async () => {
    if (!displayName.trim()) {
      setNameError('O nome não pode estar vazio');
      return;
    }

    setIsUpdatingName(true);
    setNameError(null);
    setNameSuccess(false);

    try {
      await updateDisplayName(displayName.trim());
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (error: any) {
      setNameError(error.message || 'Erro ao atualizar nome');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      setEmailError('Digite um email válido');
      return;
    }

    if (!emailPassword) {
      setEmailError('Digite sua senha atual para confirmar');
      return;
    }

    setIsUpdatingEmail(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      await updateEmail(newEmail.trim(), emailPassword);
      setEmailSuccess(true);
      setNewEmail('');
      setEmailPassword('');
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (error: any) {
      setEmailError(error.message || 'Erro ao atualizar email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error: any) {
      setPasswordError(error.message || 'Erro ao atualizar senha');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  const currentEmail = user.email || '';
  const currentDisplayName = profile?.nome || formatUserName(currentEmail);

  return (
    <Layout>
      <ProfileContainer>
        <PageTitle>Meu Perfil</PageTitle>

        {/* Seção: Nome de Exibição */}
        <Section padding="lg" elevation="sm">
          <SectionTitle>Nome de Exibição</SectionTitle>
          <InfoText>
            Este nome será exibido no header da aplicação.
          </InfoText>
          
          {nameSuccess && (
            <SuccessMessage>Nome atualizado com sucesso!</SuccessMessage>
          )}
          {nameError && <ErrorMessage>{nameError}</ErrorMessage>}

          <FormGroup>
            <Input
              label="Nome de Exibição"
              type="text"
              placeholder="Digite seu nome"
              value={displayName}
              onChange={(value) => {
                setDisplayName(value);
                setNameError(null);
                setNameSuccess(false);
              }}
              error={nameError}
            />
            <ButtonGroup>
              <Button
                variant="primary"
                onClick={handleUpdateName}
                disabled={isUpdatingName || displayName.trim() === currentDisplayName}
              >
                {isUpdatingName ? 'Salvando...' : 'Salvar Nome'}
              </Button>
            </ButtonGroup>
          </FormGroup>
        </Section>

        {/* Seção: Email */}
        <Section padding="lg" elevation="sm">
          <SectionTitle>Alterar Email</SectionTitle>
          <InfoText>
            Email atual: <strong>{currentEmail}</strong>
          </InfoText>
          
          {emailSuccess && (
            <SuccessMessage>Email atualizado com sucesso!</SuccessMessage>
          )}
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}

          <FormGroup>
            <Input
              label="Novo Email"
              type="email"
              placeholder="novo@email.com"
              value={newEmail}
              onChange={(value) => {
                setNewEmail(value);
                setEmailError(null);
                setEmailSuccess(false);
              }}
              error={emailError}
            />
            <Input
              label="Senha Atual (para confirmar)"
              type="password"
              placeholder="Digite sua senha atual"
              value={emailPassword}
              onChange={(value) => {
                setEmailPassword(value);
                setEmailError(null);
                setEmailSuccess(false);
              }}
              error={emailError}
            />
            <ButtonGroup>
              <Button
                variant="primary"
                onClick={handleUpdateEmail}
                disabled={isUpdatingEmail || !newEmail.trim() || !emailPassword}
              >
                {isUpdatingEmail ? 'Atualizando...' : 'Atualizar Email'}
              </Button>
            </ButtonGroup>
          </FormGroup>
        </Section>

        {/* Seção: Senha */}
        <Section padding="lg" elevation="sm">
          <SectionTitle>Alterar Senha</SectionTitle>
          
          {passwordSuccess && (
            <SuccessMessage>Senha atualizada com sucesso!</SuccessMessage>
          )}
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

          <FormGroup>
            <Input
              label="Senha Atual"
              type="password"
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChange={(value) => {
                setCurrentPassword(value);
                setPasswordError(null);
                setPasswordSuccess(false);
              }}
              error={passwordError}
            />
            <Input
              label="Nova Senha"
              type="password"
              placeholder="Digite a nova senha (mínimo 6 caracteres)"
              value={newPassword}
              onChange={(value) => {
                setNewPassword(value);
                setPasswordError(null);
                setPasswordSuccess(false);
              }}
              error={passwordError}
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              placeholder="Digite a nova senha novamente"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setPasswordError(null);
                setPasswordSuccess(false);
              }}
              error={passwordError}
            />
            <ButtonGroup>
              <Button
                variant="primary"
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {isUpdatingPassword ? 'Atualizando...' : 'Atualizar Senha'}
              </Button>
            </ButtonGroup>
          </FormGroup>
        </Section>
      </ProfileContainer>
    </Layout>
  );
};
