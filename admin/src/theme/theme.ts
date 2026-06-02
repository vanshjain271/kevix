import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#829c65' }, // Light olive green
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: { primary: '#1F2937', secondary: '#6B7280' },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' } },
    },
  },
});

export const SIDEBAR_WIDTH = 250;
export const SIDEBAR_BG = '#FFFFFF';
export const SIDEBAR_HOVER = '#F3F4F6';
export const SIDEBAR_ACTIVE = '#eef3e8'; // Very light olive green for active background
