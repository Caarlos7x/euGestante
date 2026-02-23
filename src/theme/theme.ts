export const theme = {
  colors: {
    primary: {
      main: '#8B4A9C',
      light: '#B57BC5',
      dark: '#6B3578',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B9D',
      light: '#FF9FC4',
      dark: '#E6396B',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
      light: '#FAFBFC',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6C757D',
      disabled: '#ADB5BD',
      hint: '#868E96',
    },
    error: {
      main: '#DC3545',
      light: '#F8D7DA',
      dark: '#C82333',
    },
    success: {
      main: '#28A745',
      light: '#D4EDDA',
      dark: '#1E7E34',
    },
    warning: {
      main: '#FFC107',
      light: '#FFF3CD',
      dark: '#E0A800',
    },
    info: {
      main: '#17A2B8',
      light: '#D1ECF1',
      dark: '#138496',
    },
    border: {
      light: '#E9ECEF',
      medium: '#DEE2E6',
      dark: '#CED4DA',
    },
  },
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      secondary: "'Poppins', sans-serif",
    },
    fontSize: {
      xs: '0.75rem',    // 9px (base 12px)
      sm: '0.875rem',   // 10.5px (base 12px)
      base: '1rem',     // 12px (base 12px)
      lg: '1.125rem',   // 13.5px (base 12px)
      xl: '1.25rem',    // 15px (base 12px)
      '2xl': '1.5rem',  // 18px (base 12px)
      '3xl': '1.875rem', // 22.5px (base 12px)
      '4xl': '2.25rem',  // 27px (base 12px)
      '5xl': '3rem',     // 36px (base 12px)
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.25rem',   // 3px (base 12px)
    sm: '0.5rem',    // 6px (base 12px)
    md: '1rem',      // 12px (base 12px)
    lg: '1.5rem',    // 18px (base 12px)
    xl: '2rem',      // 24px (base 12px)
    '2xl': '3rem',   // 36px (base 12px)
    '3xl': '4rem',   // 48px (base 12px)
    '4xl': '6rem',   // 72px (base 12px)
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 3px (base 12px)
    md: '0.5rem',    // 6px (base 12px)
    lg: '0.75rem',   // 9px (base 12px)
    xl: '1rem',      // 12px (base 12px)
    '2xl': '1.5rem', // 18px (base 12px)
    full: '833.333rem', // Valor muito grande para border-radius completo (equivalente a 9999px)
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof theme;
