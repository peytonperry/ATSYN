import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider, DEFAULT_THEME } from '@mantine/core';
import { Header } from './components/Header';
import '@mantine/carousel/styles.css';
import NavBar from './components/Navbar.tsx'
import NavBar2 from './components/Navbar2.tsx'



const theme = createTheme({
  ...DEFAULT_THEME,
  /** Put your mantine theme override here */
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Header callToActionTitle="Get Started" callToActionUrl="/signup" />
        <NavBar />
        <NavBar2 />
          <App />
    </MantineProvider>
  </StrictMode>
);
