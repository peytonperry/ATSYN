import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import { createTheme, MantineProvider, DEFAULT_THEME } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  ...DEFAULT_THEME,
  /** Put your mantine theme override here */
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>
);