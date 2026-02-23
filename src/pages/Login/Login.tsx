import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { getEmailError, getPasswordError } from '@/utils/validation';
import { LoginFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { isFirebaseConfigured } from '@/firebase/config';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const LoginContent = styled.div`
  width: 100%;
  max-width: 36.666rem; /* 440px baseado em 12px */
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LogoImage = styled.img`
  width: 10rem; /* 120px baseado em 12px */
  height: 10rem; /* 120px baseado em 12px */
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(1234%) hue-rotate(258deg) brightness(95%) contrast(89%);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 12rem; /* 144px em mobile - aumentado */
    height: 12rem; /* 144px em mobile - aumentado */
    filter: brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(1234%) hue-rotate(258deg) brightness(95%) contrast(89%);
  }
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const ForgotPasswordLink = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary.main};
  text-align: right;
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary.dark};
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 0.083rem; /* 1px baseado em 12px */
    background-color: ${({ theme }) => theme.colors.border.medium};
  }
`;

const SignUpLink = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  a {
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error.light};
  color: ${({ theme }) => theme.colors.error.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ConfigMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.info.light};
  color: ${({ theme }) => theme.colors.info.dark};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  text-align: left;

  code {
    background-color: ${({ theme }) => theme.colors.background.paper};
    padding: 0.166rem 0.333rem; /* 2px 4px baseado em 12px */
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: 'Courier New', monospace;
    font-size: 0.916rem; /* 11px baseado em 12px */
  }

  strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const firebaseConfigured = isFirebaseConfigured();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    // No Safari iOS, após redirect do Google, pode levar um tempo para processar
    // Aguardar que o loading termine e o usuário esteja definido
    if (!authLoading && user) {
      // Pequeno delay para garantir que tudo esteja processado corretamente
      const timer = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, navigate]);

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
    setErrors((prev) => ({ ...prev, email: getEmailError(value) }));
    setErrorMessage(null);
  };

  const handlePasswordChange = (value: string) => {
    setFormData((prev) => ({ ...prev, password: value }));
    setErrors((prev) => ({ ...prev, password: getPasswordError(value) }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firebaseConfigured) {
      // Não mostrar erro, apenas o aviso informativo já é suficiente
      return;
    }

    const emailError = getEmailError(formData.email);
    const passwordError = getPasswordError(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(formData.email, formData.password);
      } else {
        await signInWithEmail(formData.email, formData.password);
      }
      // O redirecionamento será feito pelo useEffect quando o user mudar
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);

    if (!firebaseConfigured) {
      setErrorMessage('Firebase não está configurado. Configure o arquivo .env.local com suas credenciais.');
      return;
    }

    setIsLoading(true);

    try {
      // Login com Google iniciado
      
      await signInWithGoogle();
      // O redirecionamento será feito pelo useEffect quando o user mudar
    } catch (error: any) {
      // Erro no login Google (já tratado pelo getAuthErrorMessage)
      
      // Ignorar erro de redirect iniciado (a página será redirecionada)
      if (error.message === 'Redirect iniciado') {
        return;
      }
      
      // Mostrar mensagem de erro amigável
      const errorMessage = error?.message || 'Erro ao fazer login com Google. Tente novamente.';
      setErrorMessage(errorMessage);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <LoginContainer>
        <LoginContent>
          <Card padding="lg" elevation="lg">
            <Title>Carregando...</Title>
          </Card>
        </LoginContent>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginContent>
        <Card padding="lg" elevation="lg">
          <LogoContainer>
            <LogoImage 
              src="/euGestante-logo.png" 
              alt="euGestante" 
            />
            <LogoText>euGestante</LogoText>
            <Subtitle>Acompanhe sua gestação com cuidado e carinho</Subtitle>
          </LogoContainer>

          <Title>Entrar</Title>

          {!firebaseConfigured && (
            <ConfigMessage style={{ marginBottom: '1.5rem' }}>
              <strong>
                <FaExclamationTriangle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Firebase não está configurado
              </strong>
              <br />
              <br />
              Para usar a autenticação, configure o arquivo <code>.env.local</code> com suas credenciais do Firebase.
              <br />
              Consulte <code>CONFIGURACAO_FIREBASE.md</code> para instruções.
            </ConfigMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleEmailChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handlePasswordChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <ForgotPasswordLink href="#forgot-password">
              Esqueceu sua senha?
            </ForgotPasswordLink>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (isSignUp ? 'Criando conta...' : 'Entrando...') : (isSignUp ? 'Criar conta' : 'Entrar')}
            </Button>
          </Form>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <Divider>ou</Divider>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Aguarde...' : 'Continuar com Google'}
          </Button>

          <SignUpLink>
            {isSignUp ? (
              <>
                Já tem uma conta?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignUp(false);
                    setErrorMessage(null);
                  }}
                >
                  Entrar
                </a>
              </>
            ) : (
              <>
                Não tem uma conta?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignUp(true);
                    setErrorMessage(null);
                  }}
                >
                  Cadastre-se
                </a>
              </>
            )}
          </SignUpLink>
        </Card>
      </LoginContent>
    </LoginContainer>
  );
};
