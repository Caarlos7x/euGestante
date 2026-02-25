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
  /* Área de toque mínima 44px (responsive-design) */
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.spacing.xs} 0;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  /* Cor do projeto: verde CTA #059669 (design system) */
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(98%) contrast(92%);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 4rem;
    height: 4rem;
    filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(98%) contrast(92%);
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
  /* Touch target mínimo 44x44px (responsive-design / HIG) */
  min-height: 2.75rem;
  min-width: 2.75rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    opacity: 0.8;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 2.75rem;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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
