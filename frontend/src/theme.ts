import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f6f7ff',
      paper: '#ffffff',
    },
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#a855f7',
    },
    divider: 'rgba(11,16,32,0.12)',
    text: {
      primary: '#0b1020',
      secondary: 'rgba(11,16,32,0.70)',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'].join(','),
    fontSize: 14,
    h5: {
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: 0.3,
    },
    h6: {
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: 1.2,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 600,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: 0.2,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeArg) => ({
        ':root': {
          /* Layout tokens */
          '--fare-radius-sm': '10px',
          '--fare-radius-md': '14px',
          '--fare-radius-lg': '20px',
          '--fare-radius-pill': '999px',

          /* ------------------------------------------------------------
           * Light mode (default): vibrant gradient + glass glows
           * ---------------------------------------------------------- */
          '--bg-base': '#f6f7ff',
          '--bg-surface': 'rgba(255,255,255,0.72)',
          '--bg-elevated': 'rgba(255,255,255,0.55)',
          '--text-primary': '#070a18',
          '--text-secondary': 'rgba(7,10,24,0.82)',
          '--text-tertiary': 'rgba(7,10,24,0.66)',
          '--border': 'rgba(11,16,32,0.12)',
          '--border-strong': 'rgba(11,16,32,0.18)',

          /* Accents */
          '--accent': '#2563eb', /* electric blue */
          '--accent-2': '#a855f7', /* neon purple */
          '--accent-3': '#22d3ee', /* cyan */
          '--accent-4': '#fb7185', /* coral */
          '--accent-hover': '#1d4ed8',
          '--accent-gradient':
            'linear-gradient(135deg, #a855f7 0%, #2563eb 45%, #22d3ee 100%)',
          '--on-accent': '#ffffff',

          /* Status colors */
          '--success': '#16a34a',
          '--success-bg': 'rgba(22,163,74,0.12)',
          '--success-border': 'rgba(22,163,74,0.30)',
          '--info': '#38bdf8',
          '--info-glow': 'rgba(56,189,248,0.40)',
          '--warning': '#f59e0b',
          '--warning-bg': 'rgba(245,158,11,0.14)',
          '--warning-border': 'rgba(245,158,11,0.32)',
          '--danger': '#ef4444',
          '--danger-bg': 'rgba(239,68,68,0.14)',
          '--danger-border': 'rgba(239,68,68,0.32)',

          /* Code viewer */
          '--code-fg': 'rgba(11,16,32,0.88)',
          '--code-muted': 'rgba(11,16,32,0.52)',
          '--code-bg':
            'radial-gradient(circle at 0 0, rgba(168,85,247,0.10), transparent 55%), radial-gradient(circle at 100% 100%, rgba(37,99,235,0.10), transparent 55%)',

          /* Glass layer tokens */
          '--glass-bg': 'rgba(255,255,255,0.44)',
          '--glass-hover-bg': 'rgba(255,255,255,0.56)',
          '--glass-border': 'rgba(255,255,255,0.55)',
          '--glass-border-strong': 'rgba(255,255,255,0.70)',
          '--glass-blur': 'blur(12px) saturate(160%)',
          '--glass-shadow':
            '0 14px 44px rgba(16,24,40,0.10), 0 10px 30px rgba(37,99,235,0.12), 0 18px 60px rgba(168,85,247,0.10)',
          '--glass-glow':
            '0 0 0 1px rgba(255,255,255,0.25), 0 0 28px rgba(168,85,247,0.16), 0 0 48px rgba(34,211,238,0.12)',
          '--glass-inset-highlight': 'inset 0 1px 0 rgba(255,255,255,0.10)',
          '--glass-inset-highlight-subtle': 'inset 0 1px 0 rgba(255,255,255,0.06)',

          /* Focus ring */
          '--focus-ring': '0 0 0 3px rgba(37,99,235,0.22)',

          /* Overlays */
          '--scrim': 'rgba(11,16,32,0.40)',
          '--scrim-strong': 'rgba(11,16,32,0.55)',

          /* Background gradients / glows */
          '--bg-gradient':
            'linear-gradient(135deg, #f7f7ff 0%, #eef6ff 38%, #fff0fb 100%)',
          '--bg-glow-1':
            'radial-gradient(900px 520px at 10% 10%, rgba(168,85,247,0.22) 0%, transparent 60%)',
          '--bg-glow-2':
            'radial-gradient(820px 520px at 92% 16%, rgba(37,99,235,0.22) 0%, transparent 62%)',
          '--bg-glow-3':
            'radial-gradient(900px 620px at 55% 92%, rgba(34,211,238,0.18) 0%, transparent 58%)',

          /* Smooth transitions on theme switch */
          transition:
            'background-color 0.3s ease, color 0.2s ease, border-color 0.2s ease',
        },

        /* Dark mode overrides — applied when <html data-theme="dark"> or .dark */
        'html[data-theme="dark"], .dark': {
          '--bg-base': '#070815',
          '--bg-surface': 'rgba(14, 16, 35, 0.72)',
          '--bg-elevated': 'rgba(12, 14, 30, 0.62)',
          '--text-primary': 'rgba(244,246,255,0.92)',
          '--text-secondary': 'rgba(244,246,255,0.70)',
          '--text-tertiary': 'rgba(244,246,255,0.52)',
          '--border': 'rgba(255,255,255,0.12)',
          '--border-strong': 'rgba(255,255,255,0.18)',

          '--accent': '#38bdf8', /* electric cyan-blue */
          '--accent-2': '#c084fc', /* violet */
          '--accent-3': '#22d3ee', /* cyan */
          '--accent-4': '#fb7185', /* coral */
          '--accent-hover': '#60a5fa',
          '--accent-gradient':
            'linear-gradient(135deg, #c084fc 0%, #38bdf8 45%, #22d3ee 100%)',
          '--on-accent': '#ffffff',

          '--success': '#22c55e',
          '--success-bg': 'rgba(34,197,94,0.12)',
          '--success-border': 'rgba(34,197,94,0.28)',
          '--info': '#38bdf8',
          '--info-glow': 'rgba(56,189,248,0.40)',
          '--warning': '#fbbf24',
          '--warning-bg': 'rgba(251,191,36,0.14)',
          '--warning-border': 'rgba(251,191,36,0.30)',
          '--danger': '#fb7185',
          '--danger-bg': 'rgba(251,113,133,0.16)',
          '--danger-border': 'rgba(251,113,133,0.32)',

          '--code-fg': 'rgba(230,233,255,0.92)',
          '--code-muted': 'rgba(230,233,255,0.55)',
          '--code-bg':
            'radial-gradient(circle at 0 0, rgba(192,132,252,0.14), transparent 55%), radial-gradient(circle at 100% 100%, rgba(56,189,248,0.14), transparent 55%)',

          '--glass-bg': 'rgba(16, 18, 40, 0.42)',
          '--glass-hover-bg': 'rgba(20, 24, 56, 0.52)',
          '--glass-border': 'rgba(255,255,255,0.16)',
          '--glass-border-strong': 'rgba(255,255,255,0.22)',
          '--glass-blur': 'blur(12px) saturate(150%)',
          '--glass-shadow':
            '0 18px 70px rgba(0,0,0,0.50), 0 0 44px rgba(56,189,248,0.10), 0 0 64px rgba(192,132,252,0.10)',
          '--glass-glow':
            '0 0 0 1px rgba(255,255,255,0.10), 0 0 34px rgba(56,189,248,0.16), 0 0 58px rgba(192,132,252,0.14)',
          '--glass-inset-highlight': 'inset 0 1px 0 rgba(255,255,255,0.10)',
          '--glass-inset-highlight-subtle': 'inset 0 1px 0 rgba(255,255,255,0.06)',

          '--focus-ring': '0 0 0 3px rgba(56,189,248,0.28)',

          '--scrim': 'rgba(0,0,0,0.40)',
          '--scrim-strong': 'rgba(0,0,0,0.55)',

          '--bg-gradient':
            'linear-gradient(135deg, #070815 0%, #0a0b1f 45%, #060617 100%)',
          '--bg-glow-1':
            'radial-gradient(900px 520px at 10% 10%, rgba(192,132,252,0.22) 0%, transparent 62%)',
          '--bg-glow-2':
            'radial-gradient(820px 520px at 92% 14%, rgba(56,189,248,0.22) 0%, transparent 64%)',
          '--bg-glow-3':
            'radial-gradient(900px 620px at 55% 92%, rgba(34,211,238,0.14) 0%, transparent 60%)',
        },

        'body.workbench-no-scroll': {
          overflowY: 'hidden',
        },

        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: 'var(--bg-base)',
          backgroundImage: 'var(--bg-gradient)',
          color: 'var(--text-primary)',
          fontFamily: themeArg.typography.fontFamily,
          WebkitFontSmoothing: 'antialiased',
          backgroundAttachment: 'fixed',
          position: 'relative',
          overflowX: 'hidden',
          transition: 'background-color 0.3s ease, color 0.2s ease',
        },

        /* Subtle noise texture — monochromatic, very low opacity */
        'body::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 160 160\\" width=\\"160\\" height=\\"160\\"%3E%3Cfilter id=\\"n\\" x=\\"0\\" y=\\"0\\" width=\\"1\\" height=\\"1\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"1.2\\" numOctaves=\\"3\\" stitchTiles=\\"noStitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23n)\\" opacity=\\"0.45\\"/%3E%3C/svg%3E")',
          opacity: 0.04,
          mixBlendMode: 'soft-light',
          zIndex: -1,
        },

        /* Color glow layers behind glass surfaces */
        'body::after': {
          content: '""',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'var(--bg-glow-1), var(--bg-glow-2), var(--bg-glow-3)',
          opacity: 0.95,
          mixBlendMode: 'normal',
          filter: 'saturate(115%)',
          zIndex: -2,
        },

        '.glass-surface': {
          backgroundColor: 'var(--glass-bg)',
          borderRadius: 'var(--fare-radius-lg)',
          border: '1px solid var(--glass-border)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.10), var(--glass-shadow), var(--glass-glow)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          transition:
            'background-color 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        },

        '.glass-card': {
          backgroundColor: 'var(--glass-bg)',
          borderRadius: 'var(--fare-radius-md)',
          border: '1px solid var(--glass-border)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.10), var(--glass-shadow), var(--glass-glow)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          transition: 'background-color 0.3s ease, border-color 0.2s ease',
        },

        '.glass-card-bright': {
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--fare-radius-md)',
          border: '1px solid var(--glass-border)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.10), var(--glass-shadow)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          transition: 'background-color 0.3s ease, border-color 0.2s ease',
        },

        '.glass-pill': {
          borderRadius: 'var(--fare-radius-pill)',
          border: '1px solid var(--glass-border)',
          backgroundColor: 'var(--glass-bg)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.10), var(--glass-shadow), var(--glass-glow)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          transition: 'background-color 0.3s ease, border-color 0.2s ease',
        },

        '.glass-nav': {
          backgroundColor: 'var(--glass-bg)',
          borderBottom: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow), var(--glass-glow)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          transition: 'background-color 0.3s ease, border-color 0.2s ease',
        },

        '.glass-inset': {
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'var(--accent)',
          },
          '&:focus-within': {
            borderColor: 'var(--accent)',
            boxShadow: 'var(--focus-ring)',
          },
        },

        '@keyframes pulse-dot': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.85)' },
        },

        '@keyframes glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 14px rgba(56,189,248,0.22)' },
          '50%': { boxShadow: '0 0 26px rgba(192,132,252,0.28)' },
        },

        '@keyframes page-slide-fade': {
          '0%': {
            opacity: 0,
            transform: 'translateY(8px) scale(0.995)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },

        '.reveal': {
          opacity: 0,
          transform: 'translateY(14px)',
          transition:
            'opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        },

        '.reveal.is-visible': {
          opacity: 1,
          transform: 'translateY(0)',
        },

        '@media (prefers-reduced-motion: reduce)': {
          '.reveal': {
            transition: 'none',
            opacity: 1,
            transform: 'none',
          },
        },

        '::-webkit-scrollbar': {
          width: 4,
          height: 4,
        },

        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },

        '::-webkit-scrollbar-thumb': {
          background: 'var(--border)',
          borderRadius: 999,
        },

        '::-webkit-scrollbar-thumb:hover': {
          background: 'var(--accent)',
        },
      }),
    },

    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          transition: 'background-color 0.3s ease, border-color 0.2s ease',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 14,
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          transition: 'all 0.18s ease',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: 11,
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--glass-shadow)',
          color: 'var(--text-primary)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
          '&:active': { transform: 'translateY(1px)' },
        },
        contained: {
          backgroundImage: 'var(--accent-gradient)',
          color: 'var(--bg-base)',
          boxShadow: 'var(--glass-shadow)',
          '&:hover': {
            backgroundImage: 'var(--accent-gradient)',
            boxShadow: 'var(--glass-shadow), var(--glass-glow)',
          },
        },
        outlined: {
          borderColor: 'var(--border-strong)',
          color: 'var(--text-primary)',
          '&:hover': {
            borderColor: 'var(--accent)',
            backgroundColor: 'var(--glass-hover-bg)',
          },
        },
        text: {
          color: 'var(--text-primary)',
          '&:hover': {
            backgroundColor: 'var(--glass-hover-bg)',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--glass-border)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-strong)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--accent)',
            boxShadow: 'var(--focus-ring)',
          },
        },
        input: {
          color: 'var(--text-primary)',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 13,
          color: 'var(--text-primary)',
          '&:hover': {
            backgroundColor: 'var(--glass-hover-bg)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--glass-bg)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'var(--glass-hover-bg)',
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.18s ease',
        },
      },
    },
  },
})
