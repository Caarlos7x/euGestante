import { ReactNode } from 'react';
import styled from 'styled-components';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: 6rem; /* Altura do header fixo - 72px baseado em 12px */
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.default};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg}; /* Manter padding maior em mobile */
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutContainer>
  );
};
