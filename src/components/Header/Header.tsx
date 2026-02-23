import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { formatUserName } from '@/utils/format';
import { DropdownMenu, DropdownMenuItem } from '@/components/DropdownMenu';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 6rem; /* 72px baseado em 12px - aumentado para acomodar logo 80x80 */
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  /* Filtro CSS para aplicar cor roxa #8B4A9C - ajustado para roxo puro */
  filter: brightness(0) saturate(100%) invert(35%) sepia(100%) saturate(2000%) hue-rotate(260deg) brightness(0.9) contrast(1.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 4rem; /* 48px - manter tamanho razoável */
    height: 4rem; /* 48px */
  }
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl}; /* Manter legível */
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const UserNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  user-select: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const UserIcon = styled(FaUserCircle)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.primary.main};
  flex-shrink: 0;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Manter legível */
  }
`;

export const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleViewProfile = () => {
    navigate('/myprofile');
  };

  // Obter nome do usuário (prioridade: profile.nome > email formatado)
  const userName = profile?.nome || formatUserName(user?.email || null);

  return (
    <HeaderContainer>
      <LeftSection>
        <LogoLink to="/home">
          <LogoImage 
            src="/euGestante-logo.png" 
            alt="euGestante" 
          />
          <LogoText>euGestante</LogoText>
        </LogoLink>
      </LeftSection>

      {user && (
        <RightSection>
          <UserInfo>
            <DropdownMenu 
              trigger={
                <UserNameContainer>
                  <UserIcon />
                  <UserName>{userName}</UserName>
                </UserNameContainer>
              } 
              align="right"
            >
              <DropdownMenuItem onClick={handleViewProfile}>
                Ver meu perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenu>
          </UserInfo>
        </RightSection>
      )}
    </HeaderContainer>
  );
};
