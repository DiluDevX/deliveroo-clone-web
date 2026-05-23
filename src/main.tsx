import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { Colors } from "./theme/colors.ts";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans", "serif"].join(","),
    allVariants: {
      fontFamily: ["IBM Plex Sans", "serif"].join(","),
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: Colors.background.brand,
            },
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: Colors.background.brand,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: Colors.background.brand,
          "&.Mui-checked": {
            color: Colors.background.brand,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: Colors.background.brand,
          "&.Mui-checked": {
            color: Colors.background.brand,
          },
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider theme={theme}>
      <StrictMode>
        <SnackbarProvider
          maxSnack={2}
          autoHideDuration={1000}
          disableWindowBlurListener={true}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          style={{
            pointerEvents: "auto",
            backgroundColor: Colors.background.brand,
            marginTop: "4rem",
            fontFamily: "IBM Plex Sans, serif",
          }}
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
