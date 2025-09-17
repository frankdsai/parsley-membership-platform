import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B5CF6', // Purple from your palette
    },
    secondary: {
      main: '#14B8A6', // Teal from your palette
    },
    background: {
      default: '#F8FAFC',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Auth />
    </ThemeProvider>
  );
}

export default App;