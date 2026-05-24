import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";
import { Colors } from "../../theme/colors";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
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
          marginTop: "4rem",
          fontFamily: "IBM Plex Sans, serif",
          borderColor: Colors.border.subtle,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
