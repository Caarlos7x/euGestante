import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    /* Base: 12px (75% de 16px padrão do navegador) */
    font-size: 0.75rem; /* 12px baseado em 16px padrão */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.default};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  #root {
    min-height: 100vh;
    width: 100%;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${({ theme }) => theme.transitions.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Anti-aliasing global para todos os elementos */
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 0.666rem; /* 8px baseado em 12px */
    height: 0.666rem; /* 8px baseado em 12px */
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.light};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.medium};
    border-radius: ${({ theme }) => theme.borderRadius.full};

    &:hover {
      background: ${({ theme }) => theme.colors.border.dark};
    }
  }

  /* Focus styles */
  *:focus-visible {
    outline: 0.166rem solid ${({ theme }) => theme.colors.primary.main}; /* 2px baseado em 12px */
    outline-offset: 0.166rem; /* 2px baseado em 12px */
  }

  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.primary.contrast};
  }

  /* Leaflet Map Styles */
  .leaflet-container {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  }

  .leaflet-popup-content-wrapper {
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  .leaflet-popup-content {
    margin: 0;
  }
`;
