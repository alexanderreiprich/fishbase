import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E09600', // Yellow
    },
    secondary: {
      main: '#119DA4', // Light Blue
    },
    background: {
      default: '#1F2041', // Darkblue Background
      paper: '#2a2b52', // Darkblue Paper
    },
    text: {
      primary: '#FFF8F0', // White Text
    },
  },
});

export default theme; 