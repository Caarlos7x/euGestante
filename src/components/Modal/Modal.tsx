import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerActions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  padding: ${({ theme }) => theme.spacing.md};
  animation: ${({ $isOpen }) => ($isOpen ? 'fadeIn' : 'none')} 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div<{ $size?: 'sm' | 'md' | 'lg' | 'xl' }>`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '24rem'; /* 288px */
      case 'lg':
        return '48rem'; /* 576px */
      case 'xl':
        return '64rem'; /* 768px */
      default:
        return '32rem'; /* 384px */
    }
  }};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(1.5rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  line-height: 1;
  transition: color ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem; /* 24px */
  height: 2rem; /* 24px */
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.light};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  headerActions,
  size = 'md',
  showCloseButton = true,
}) => {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer $size={size} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton || headerActions) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {!title && <div />}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {headerActions}
              {showCloseButton && (
                <CloseButton onClick={onClose} aria-label="Fechar modal">
                  ×
                </CloseButton>
              )}
            </div>
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </Overlay>
  );
};
