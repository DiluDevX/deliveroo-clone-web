import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";
import { Colors } from "../../theme/colors";
import { GlobalStyles } from "@mui/material";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <>
      <GlobalStyles
        styles={{
          "@media (max-width: 600px)": {
            '[data-sonner-toaster][data-x-position="right"]': {
              left: "auto !important",
              right: "1rem !important",
              width: "min(360px, calc(100vw - 32px)) !important",
            },
            '[data-sonner-toaster][data-x-position="right"] [data-sonner-toast]':
              {
                left: "auto !important",
                right: "0 !important",
                width: "min(360px, calc(100vw - 32px)) !important",
              },
          },
        }}
      />
      <Sonner
        position="top-right"
        offset={{ top: "4rem", right: "1rem" }}
        mobileOffset={{ top: "4rem", right: "1rem", left: "1rem" }}
        richColors
        closeButton
        style={
          {
            "--success-bg": Colors.background.brand,
            "--success-border": Colors.border.brand,
            "--success-text": Colors.text.inverse,
          } as React.CSSProperties
        }
        toastOptions={{
          duration: 2000,
          style: {
            fontFamily: "IBM Plex Sans, serif",
            borderColor: Colors.border.subtle,
            width: "min(360px, calc(100vw - 32px))",
          },
        }}
        {...props}
      />
    </>
  );
};

export { Toaster };
