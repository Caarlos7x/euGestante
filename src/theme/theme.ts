export const theme = {
  colors: {
    primary: {
      main: '#0891B2',   // Design system: Primary (calm cyan)
      light: '#22D3EE',
      dark: '#0e7490',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#22D3EE',   // Design system: Secondary (light cyan)
      light: '#A5F3FC',
      dark: '#0891B2',
      contrast: '#164E63',
    },
    cta: {
      main: '#059669',   // Design system: CTA (health green)
      light: '#34d399',
      dark: '#047857',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#ECFEFF', // Design system: Background
      paper: '#FFFFFF',
      light: '#CFFAFE',
    },
    text: {
      primary: '#164E63',   // Design system: Text
      secondary: '#0e7490',
      disabled: '#94a3b8',
      hint: '#64748b',
    },
    error: {
      main: '#dc2626',
      light: '#fef2f2',
      dark: '#b91c1c',
    },
    success: {
      main: '#059669',   // Alinhado ao CTA
      light: '#d1fae5',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#fffbeb',
      dark: '#b45309',
    },
    info: {
      main: '#0891B2',
      light: '#CFFAFE',
      dark: '#0e7490',
    },
    border: {
      light: '#A5F3FC',
      medium: '#22D3EE',
      dark: '#0891B2',
    },
  },
  typography: {
    fontFamily: {
      primary: "'Raleway', 'Segoe UI', Tahoma, sans-serif",   // Body - Design system
      secondary: "'Lora', 'Georgia', serif",                 // Heading - Design system
    },
    fontSize: {
      xs: '0.875rem',   // 14px - Design system: large text 16px+; mínimo legível
      sm: '0.9375rem',  // 15px
      base: '1rem',     // 16px - Design system: minimum 16px body
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
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
