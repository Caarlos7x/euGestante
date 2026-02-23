import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-top: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  margin-top: auto;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const FooterContent = styled.div`
  max-width: 100rem; /* 1200px baseado em 12px */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterLogo = styled.img`
  width: 2.5rem; /* 30px baseado em 12px */
  height: 2.5rem; /* 30px baseado em 12px */
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(35%) sepia(100%) saturate(2000%) hue-rotate(260deg) brightness(0.9) contrast(1.1);
`;

const FooterBrandText = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    width: 100%;
  }
`;

const FooterLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FooterDivider = styled.hr`
  border: none;
  border-top: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
  margin: 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const HeartIcon = styled(FaHeart)`
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const FooterVersion = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.hint};
`;

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterBrand>
            <FooterLogo src="/euGestante-logo.png" alt="euGestante" />
            <FooterBrandText to="/home">euGestante</FooterBrandText>
          </FooterBrand>

          <FooterLinks>
            <FooterLink to="/home">Início</FooterLink>
            <FooterLink to="/my-notes">Minhas Anotações</FooterLink>
            <FooterLink to="/myprofile">Meu Perfil</FooterLink>
          </FooterLinks>
        </FooterTop>

        <FooterDivider />

        <FooterBottom>
          <Copyright>
            © {currentYear} euGestante. Feito com <HeartIcon /> para gestantes.
          </Copyright>
          <FooterVersion>v1.0.0</FooterVersion>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};
