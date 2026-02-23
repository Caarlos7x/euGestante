import { ReactNode } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  children: ReactNode;
  message: string;
  show: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipContainer = styled.div<{ $show: boolean; $position: 'top' | 'bottom' | 'left' | 'right' }>`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const TooltipMessage = styled.div<{ $show: boolean; $position: 'top' | 'bottom' | 'left' | 'right' }>`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transition: opacity ${({ theme }) => theme.transitions.fast},
    visibility ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};
  transform: ${({ $show, $position }) => {
    if (!$show) return 'translateY(0) scale(0.95)';
    switch ($position) {
      case 'top':
        return 'translateY(-100%) translateX(-50%) scale(1)';
      case 'bottom':
        return 'translateY(0) translateX(-50%) scale(1)';
      case 'left':
        return 'translateX(-100%) translateY(-50%) scale(1)';
      case 'right':
        return 'translateX(0) translateY(-50%) scale(1)';
      default:
        return 'translateY(-100%) translateX(-50%) scale(1)';
    }
  }};
  
  ${({ $position, theme }) => {
    switch ($position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          margin-bottom: ${theme.spacing.xs};
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          margin-top: ${theme.spacing.xs};
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          margin-right: ${theme.spacing.xs};
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          margin-left: ${theme.spacing.xs};
        `;
      default:
        return `
          bottom: 100%;
          left: 50%;
          margin-bottom: ${theme.spacing.xs};
        `;
    }
  }}

  &::before {
    content: '';
    position: absolute;
    border: 0.25rem solid transparent;
    ${({ $position, theme }) => {
      switch ($position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${theme.colors.text.primary};
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: ${theme.colors.text.primary};
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: ${theme.colors.text.primary};
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: ${theme.colors.text.primary};
          `;
        default:
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${theme.colors.text.primary};
          `;
      }
    }}
  }
`;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  message,
  show,
  position = 'top',
}) => {
  return (
    <TooltipContainer $show={show} $position={position}>
      {children}
      <TooltipMessage $show={show} $position={position}>
        {message}
      </TooltipMessage>
    </TooltipContainer>
  );
};
