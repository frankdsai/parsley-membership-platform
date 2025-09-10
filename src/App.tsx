import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Modern blue
    },
    secondary: {
      main: '#10b981', // Modern green
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  shape: {
    borderRadius: 12,
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