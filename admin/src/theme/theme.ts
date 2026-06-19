import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const theme = createTheme({
  palette: {
    primary: { main: '#7C3AED' }, // Violet 600
    secondary: { main: '#2563EB' }, // Blue 600
    background: { default: '#F8FAFC', paper: '#FFFFFF' }, // Slate 50
    text: { primary: '#0F172A', secondary: '#64748B' }, // Slate 900 & Slate 500
    success: { main: '#22C55E' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
    divider: '#E2E8F0', // Slate 200
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 }, // Global radius
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#6D28D9',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
          border: '1px solid #E2E8F0',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#F8FAFC',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E2E8F0',
          },
          '&:hover': {
            backgroundColor: '#FFFFFF',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1',
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7C3AED',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8FAFC',
          '& .MuiTableCell-root': {
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderBottom: '1px solid #E2E8F0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F1F5F9',
          padding: '16px',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #F1F5F9',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            color: '#475569',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #E2E8F0',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#F8FAFC',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
        outlined: {
          backgroundColor: '#FFFFFF',
        }
      }
    }
  },
});

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_BG = '#F8FAFC';
export const SIDEBAR_HOVER = '#F1F5F9';
export const SIDEBAR_ACTIVE = '#FFFFFF';
export const SIDEBAR_ACTIVE_TEXT = '#0F172A';
