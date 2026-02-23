import { ReactNode, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface CarouselProps {
  children: ReactNode[];
  itemsPerView?: number;
  gap?: string;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const FadeLeft = styled.div<{ $visible: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6rem; /* 72px */
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.background.default} 0%,
    ${({ theme }) => theme.colors.background.default}CC 40%,
    ${({ theme }) => theme.colors.background.default}80 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 5;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity ${({ theme }) => theme.transitions.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none; /* Remover fade em mobile */
  }
`;

const FadeRight = styled.div<{ $visible: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6rem; /* 72px */
  background: linear-gradient(
    to left,
    ${({ theme }) => theme.colors.background.default} 0%,
    ${({ theme }) => theme.colors.background.default}CC 40%,
    ${({ theme }) => theme.colors.background.default}80 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 5;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity ${({ theme }) => theme.transitions.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none; /* Remover fade em mobile */
  }
`;

const CarouselTrack = styled.div<{ $translateX: number; $gap: string }>`
  display: flex;
  gap: ${({ $gap }) => $gap};
  transform: translateX(${({ $translateX }) => $translateX}%);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0; /* Remover gap em mobile para card ocupar toda largura */
  }
`;

const CarouselItem = styled.div<{ $itemsPerView: number }>`
  flex: 0 0 ${({ $itemsPerView }) => 100 / $itemsPerView}%;
  min-width: 0;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 0 0 ${({ $itemsPerView }) => 100 / Math.min($itemsPerView, 2)}%;
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 0 0 100% !important; /* Forçar 100% em mobile */
    padding: 0; /* Remover padding em mobile para card ocupar toda largura */
    min-width: 100%; /* Garantir largura mínima */
  }
`;

const ArrowButton = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $direction }) => ($direction === 'left' ? 'left: 1rem' : 'right: 1rem')};
  transform: translateY(-50%);
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
  border-radius: 50%;
  width: 3rem; /* 36px */
  height: 3rem; /* 36px */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    border-color: ${({ theme }) => theme.colors.primary.main};
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none; /* Esconder setas em mobile */
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 0.75rem; /* 9px */
  height: 0.75rem; /* 9px */
  border-radius: 50%;
  border: none;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary.main : theme.colors.border.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  padding: 0;

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary.dark : theme.colors.border.dark};
    transform: scale(1.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 1rem; /* 12px - aumentar para melhor toque */
    height: 1rem; /* 12px */
  }
`;

export const Carousel: React.FC<CarouselProps> = ({
  children,
  itemsPerView = 3,
  gap = '1rem',
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Função para calcular itemsPerView baseado na largura
  const calculateItemsPerView = (width: number): number => {
    if (width <= 640) return 1; // Mobile: 1 item
    if (width <= 768) return 2; // Tablet: 2 itens
    return itemsPerView; // Desktop: usar o valor passado
  };
  
  const [actualItemsPerView, setActualItemsPerView] = useState(() => {
    // Calcular valor inicial baseado na largura atual
    if (typeof window !== 'undefined') {
      return calculateItemsPerView(window.innerWidth);
    }
    return itemsPerView;
  });
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const items = Array.isArray(children) ? children : [children];
  const totalItems = items.length;

  // Detectar resolução e ajustar itemsPerView automaticamente
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      const newItemsPerView = calculateItemsPerView(width);
      
      setActualItemsPerView((prev) => {
        // Resetar índice quando mudar a resolução
        if (prev !== newItemsPerView) {
          setCurrentIndex(0);
        }
        return newItemsPerView;
      });
    };

    updateItemsPerView();
    const handleResize = () => updateItemsPerView();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const newMaxIndex = Math.max(0, totalItems - actualItemsPerView);
        return prev >= newMaxIndex ? 0 : prev + 1;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, totalItems, actualItemsPerView]);

  // Calcular translateX baseado no índice atual
  // Cada item ocupa 100% / actualItemsPerView, então movemos por essa porcentagem
  const translateX = -(currentIndex * (100 / actualItemsPerView));

  const maxIndex = Math.max(0, totalItems - actualItemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(maxIndex, index)));
  };

  if (totalItems === 0) {
    return null;
  }

  const showFadeLeft = currentIndex > 0;
  const showFadeRight = currentIndex < maxIndex;

  return (
    <CarouselContainer ref={carouselRef}>
      {showArrows && totalItems > actualItemsPerView && (
        <>
          <ArrowButton
            $direction="left"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            aria-label="Anterior"
          >
            ‹
          </ArrowButton>
          <ArrowButton
            $direction="right"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Próximo"
          >
            ›
          </ArrowButton>
        </>
      )}

      <CarouselWrapper>
        <FadeLeft $visible={showFadeLeft} />
        <FadeRight $visible={showFadeRight} />
        <CarouselTrack $translateX={translateX} $gap={gap}>
          {items.map((item, index) => (
            <CarouselItem key={index} $itemsPerView={actualItemsPerView}>
              {item}
            </CarouselItem>
          ))}
        </CarouselTrack>
      </CarouselWrapper>

      {showDots && totalItems > actualItemsPerView && (
        <DotsContainer>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <Dot
              key={index}
              $active={index === currentIndex}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  );
};
