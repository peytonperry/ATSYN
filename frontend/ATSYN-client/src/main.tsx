import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider, DEFAULT_THEME } from '@mantine/core';
import { Header } from './components/Header';
import '@mantine/carousel/styles.css';



const theme = createTheme({
  ...DEFAULT_THEME,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Header callToActionTitle="Get Started" callToActionUrl="/signup" />
          <App />
    </MantineProvider>
  </StrictMode>,
)
