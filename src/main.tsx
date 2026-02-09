import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.tsx";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { Colors } from "./theme/colors.ts";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routes/routeTree.tsx";

axios.defaults.withCredentials = true;

const theme = createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans", "serif"].join(","),
    allVariants: {
      fontFamily: ["IBM Plex Sans", "serif"].join(","),
    },
  },
});

const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider theme={theme}>
      <StrictMode>
        <Toaster
          duration={1000}
          visibleToasts={1}
          position="top-right"
          toastOptions={{
            style: {
              backgroundColor: Colors.background.brand,
              color: Colors.text.inverse,
              marginTop: "4rem",
              fontFamily: "IBM Plex Sans, serif",
            },
          }}
        />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
          </PersistGate>
        </Provider>
      </StrictMode>
    </ThemeProvider>
  </HelmetProvider>,
);
