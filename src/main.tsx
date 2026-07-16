import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createTheme, GlobalStyles, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { Colors } from "./theme/colors.ts";
import { Toaster } from "./components/ui/sonner.tsx";

const appFontFamily = ["IBM Plex Sans", "sans-serif"].join(",");

const theme = createTheme({
  palette: {
    primary: {
      main: Colors.background.brand,
      dark: Colors.background.brandHover,
      contrastText: Colors.text.inverse,
    },
  },
  typography: {
    fontFamily: appFontFamily,
    allVariants: {
      fontFamily: appFontFamily,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: Colors.background.brand,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: Colors.background.brand,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: Colors.background.brandHover,
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
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: Colors.background.brand,
            "& + .MuiSwitch-track": {
              backgroundColor: Colors.background.brand,
              opacity: 1,
            },
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: Colors.background.brand,
            color: Colors.text.inverse,
            "&:hover": {
              backgroundColor: Colors.background.brandHover,
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: Colors.background.brand,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          ".recharts-text, .recharts-legend-item-text, .recharts-default-tooltip":
            {
              fontFamily: `${appFontFamily} !important`,
            },
        }}
      />
      <StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
            <Toaster />
          </PersistGate>
        </Provider>
      </StrictMode>
    </ThemeProvider>
  </HelmetProvider>,
);
