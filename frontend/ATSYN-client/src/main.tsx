import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider, DEFAULT_THEME } from "@mantine/core";
import "@mantine/carousel/styles.css";

const theme = createTheme({
  ...DEFAULT_THEME,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>
);
