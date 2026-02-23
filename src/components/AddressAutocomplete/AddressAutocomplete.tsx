import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { searchAddresses, getPlaceDetails, PlacePrediction } from '@/services/addressService';
import { Input } from '@/components/Input';

interface AddressAutocompleteProps {
  label?: string;
  value: string;
  onChange: (address: string, placeId?: string) => void;
  onPlaceSelect?: (details: {
    formatted_address: string;
    name?: string;
    address: string;
  }) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
}

const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 0.083rem solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  margin-top: 0.25rem;
  max-height: 20rem; /* 240px */
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin-bottom: 0;
`;

const SuggestionItem = styled.li`
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  border-bottom: 0.083rem solid ${({ theme }) => theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg}; /* Aumentar padding em mobile */
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Aumentar fonte */
  }
`;

const SuggestionMainText = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const SuggestionSecondaryText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  value,
  onChange,
  onPlaceSelect,
  error,
  placeholder = 'Digite o endereço ou nome do hospital',
  required = false,
}) => {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  // Buscar sugestões quando o valor mudar
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!value || value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    timeoutRef.current = window.setTimeout(async () => {
      try {
        const results = await searchAddresses(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce de 300ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const handleSelectSuggestion = async (prediction: PlacePrediction) => {
    setShowSuggestions(false);
    onChange(prediction.description, prediction.place_id);

    // Obter detalhes completos do lugar
    if (onPlaceSelect) {
      try {
        const details = await getPlaceDetails(prediction.place_id);
        if (details) {
          onPlaceSelect({
            formatted_address: details.formatted_address,
            name: details.name,
            address: details.formatted_address,
          });
        }
      } catch (error) {
        console.error('Erro ao obter detalhes do lugar:', error);
      }
    }
  };

  return (
    <AutocompleteContainer ref={containerRef}>
      <Input
        label={label}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(newValue) => {
          onChange(newValue);
          setShowSuggestions(true);
        }}
        error={error}
        required={required}
      />
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((prediction) => (
            <SuggestionItem
              key={prediction.place_id}
              onClick={() => handleSelectSuggestion(prediction)}
            >
              <SuggestionMainText>
                {prediction.structured_formatting.main_text}
              </SuggestionMainText>
              <SuggestionSecondaryText>
                {prediction.structured_formatting.secondary_text}
              </SuggestionSecondaryText>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
      {isLoading && value.length >= 3 && (
        <SuggestionsList>
          <SuggestionItem style={{ cursor: 'default', pointerEvents: 'none' }}>
            Buscando endereços...
          </SuggestionItem>
        </SuggestionsList>
      )}
    </AutocompleteContainer>
  );
};
