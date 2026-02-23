import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline' | 'text'; $size?: 'sm' | 'md' | 'lg'; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  opacity: 1;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          min-height: 3rem; /* 36px baseado em 12px */
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          min-height: 4.333rem; /* 52px baseado em 12px */
        `;
      default:
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          min-height: 3.666rem; /* 44px baseado em 12px */
        `;
    }
  }}

  /* Variant styles */
  ${({ $variant, theme }) => {
    if ($variant === 'primary') {
      return `
        background-color: ${theme.colors.primary.main};
        color: ${theme.colors.primary.contrast};
        border: 0.166rem solid ${theme.colors.primary.main}; /* 2px baseado em 12px */

        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary.dark};
          border-color: ${theme.colors.primary.dark};
          transform: translateY(-0.083rem); /* -1px baseado em 12px */
          box-shadow: ${theme.shadows.md};
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    }

    if ($variant === 'secondary') {
      return `
        background-color: ${theme.colors.secondary.main};
        color: ${theme.colors.secondary.contrast};
        border: 0.166rem solid ${theme.colors.secondary.main}; /* 2px baseado em 12px */

        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary.dark};
          border-color: ${theme.colors.secondary.dark};
          transform: translateY(-0.083rem); /* -1px baseado em 12px */
          box-shadow: ${theme.shadows.md};
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    }

    if ($variant === 'outline') {
      return `
        background-color: transparent;
        color: ${theme.colors.primary.main};
        border: 0.166rem solid ${theme.colors.primary.main}; /* 2px baseado em 12px */

        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
        }
      `;
    }

    if ($variant === 'text') {
      return `
        background-color: transparent;
        color: ${theme.colors.primary.main};
        border: 0.166rem solid transparent; /* 2px baseado em 12px */

        &:hover:not(:disabled) {
          background-color: ${theme.colors.background.light};
        }
      `;
    }

    return '';
  }}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }

  /* Aumentar tamanhos em mobile para melhor usabilidade */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    ${({ $size, theme }) => {
      switch ($size) {
        case 'sm':
          return `
            padding: ${theme.spacing.md} ${theme.spacing.lg};
            font-size: ${theme.typography.fontSize.base};
            min-height: 3.5rem; /* 42px */
          `;
        case 'lg':
          return `
            padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
            font-size: ${theme.typography.fontSize.xl};
            min-height: 5rem; /* 60px */
          `;
        default:
          return `
            padding: ${theme.spacing.lg} ${theme.spacing.xl};
            font-size: ${theme.typography.fontSize.lg};
            min-height: 4.5rem; /* 54px */
          `;
      }
    }}
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </StyledButton>
  );
};
