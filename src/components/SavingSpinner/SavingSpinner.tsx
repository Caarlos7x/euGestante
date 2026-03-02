import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerRing = styled.div`
  width: 2rem;
  height: 2rem;
  border: 0.2rem solid ${({ theme }) => theme.colors.border.medium};
  border-top-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.5s;
  }
`;

const SavingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SavingMessage = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface SavingSpinnerProps {
  isSaving: boolean;
  /** Mensagem exibida após ~2,5 s se ainda estiver salvando */
  longWaitMessage?: string;
  /** Atraso em ms para mostrar a mensagem (default 2500) */
  longWaitDelayMs?: number;
}

export const SavingSpinner: React.FC<SavingSpinnerProps> = ({
  isSaving,
  longWaitMessage = 'Salvando dados, aguarde mais um momento.',
  longWaitDelayMs = 2500,
}) => {
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isSaving) {
      setShowLongWaitMessage(false);
      timeoutRef.current = setTimeout(() => {
        setShowLongWaitMessage(true);
      }, longWaitDelayMs);
    } else {
      setShowLongWaitMessage(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isSaving, longWaitDelayMs]);

  if (!isSaving) return null;

  return (
    <SavingWrap role="status" aria-live="polite" aria-label="Salvando">
      <SpinnerRing aria-hidden />
      <SavingMessage>
        {showLongWaitMessage ? longWaitMessage : 'Salvando…'}
      </SavingMessage>
    </SavingWrap>
  );
};
