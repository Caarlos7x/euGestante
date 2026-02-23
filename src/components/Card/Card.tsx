import styled from 'styled-components';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

const StyledCard = styled.div<{ $padding?: 'sm' | 'md' | 'lg'; $elevation?: 'none' | 'sm' | 'md' | 'lg' }>`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 100%;

  ${({ $padding, theme }) => {
    switch ($padding) {
      case 'sm':
        return `padding: ${theme.spacing.md};`;
      case 'lg':
        return `padding: ${theme.spacing.xl};`;
      default:
        return `padding: ${theme.spacing.lg};`;
    }
  }}

  ${({ $elevation, theme }) => {
    switch ($elevation) {
      case 'sm':
        return `box-shadow: ${theme.shadows.sm};`;
      case 'md':
        return `box-shadow: ${theme.shadows.md};`;
      case 'lg':
        return `box-shadow: ${theme.shadows.lg};`;
      default:
        return '';
    }
  }}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    ${({ $padding, theme }) => {
      // Em mobile, aumentar padding para melhor toque
      switch ($padding) {
        case 'sm':
          return `padding: ${theme.spacing.lg};`;
        case 'lg':
          return `padding: ${theme.spacing['2xl']};`;
        default:
          return `padding: ${theme.spacing.xl};`;
      }
    }}
  }
`;

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  elevation = 'md',
  ...props
}) => {
  return (
    <StyledCard $padding={padding} $elevation={elevation} {...props}>
      {children}
    </StyledCard>
  );
};
