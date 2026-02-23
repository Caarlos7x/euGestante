import styled from 'styled-components';
import { useState } from 'react';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'time' | 'date';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  autoComplete?: string;
}

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 0.166rem solid /* 2px baseado em 12px */
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error.main : theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: text;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg}; /* Aumentar padding em mobile */
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Manter legível */
    min-height: 3.5rem; /* 42px - melhor para toque */
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.hint};
  }

  &:focus:not(:disabled) {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error.main : theme.colors.primary.main};
    box-shadow: 0 0 0 0.25rem /* 3px baseado em 12px */
      ${({ theme, $hasError }) =>
        $hasError
          ? `${theme.colors.error.light}40`
          : `${theme.colors.primary.light}40`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.light};
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error.main};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  fullWidth = true,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && (
        <Label>
          {label}
          {required && <span style={{ color: '#DC3545' }}> *</span>}
        </Label>
      )}
      <InputWrapper>
        <StyledInput
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (e && e.target && e.target.value !== undefined) {
              onChange(e.target.value);
            }
          }}
          $hasError={!!error}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </PasswordToggle>
        )}
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};
