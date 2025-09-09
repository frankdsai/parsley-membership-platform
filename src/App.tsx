import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green theme for Parsley
    },
    secondary: {
      main: '#81c784',
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