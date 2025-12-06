import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.tsx";
import { PersistGate } from "redux-persist/integration/react";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans", "serif"].join(","),
    allVariants: {
      fontFamily: ["IBM Plex Sans", "serif"].join(","),
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider theme={theme}>
      <StrictMode>
        <SnackbarProvider
          maxSnack={2}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          style={{ marginTop: "4rem", fontFamily: "IBM Plex Sans, serif" }}
        >
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </SnackbarProvider>
      </StrictMode>
    </ThemeProvider>
  </HelmetProvider>,
);
