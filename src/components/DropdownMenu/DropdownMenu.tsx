import { ReactNode, useEffect, useRef, useState, createContext, useContext } from 'react';
import styled from 'styled-components';

const DropdownContext = createContext<{ closeMenu: () => void } | null>(null);

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  onClose?: () => void;
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TriggerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 0.125rem solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 0.25rem;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const MenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.dropdown - 1};
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const MenuContainer = styled.div<{ $isOpen: boolean; $align: 'left' | 'right' }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  ${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
  min-width: 12rem; /* 144px baseado em 12px */
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 0.083rem solid ${({ theme }) => theme.colors.border.medium}; /* 1px */
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0) scale(1)' : 'translateY(-0.5rem) scale(0.95)')};
  transition: opacity ${({ theme }) => theme.transitions.fast},
    visibility ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};
  overflow: hidden;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.25rem 0; /* 3px baseado em 12px */
`;

const MenuItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = 'right',
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fechar menu com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DropdownContainer ref={containerRef}>
      <TriggerButton
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </TriggerButton>
      {isOpen && <MenuOverlay $isOpen={isOpen} onClick={closeMenu} />}
      <MenuContainer $isOpen={isOpen} $align={align}>
        <DropdownContext.Provider value={{ closeMenu }}>
          <MenuList>{children}</MenuList>
        </DropdownContext.Provider>
      </MenuContainer>
    </DropdownContainer>
  );
};

// Componente para itens do menu
interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
}

const MenuItemButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: none;
  border: none;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.default};
  }

  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.background.default};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.default};
  }
`;

const MenuItemLink = styled.a`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.default};
  }

  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.background.default};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.default};
  }
`;

export const DropdownMenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  as = 'button',
  href,
}) => {
  const context = useContext(DropdownContext);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Fechar menu após clicar no item
    if (context?.closeMenu) {
      context.closeMenu();
    }
  };

  if (as === 'a' && href) {
    return (
      <MenuItem>
        <MenuItemLink href={href} onClick={handleClick}>
          {children}
        </MenuItemLink>
      </MenuItem>
    );
  }

  return (
    <MenuItem>
      <MenuItemButton type="button" onClick={handleClick}>
        {children}
      </MenuItemButton>
    </MenuItem>
  );
};
