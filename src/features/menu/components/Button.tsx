import React from "react";
import { ButtonBase, ButtonBaseProps, Typography } from "@mui/material";
import { Link, To } from "react-router-dom";
import { Colors } from "../../../theme";

type ButtonProps = ButtonBaseProps & {
  PrefixIcon?: React.ComponentType<{
    style: React.CSSProperties;
  }>;
  PrefixComponent?: React.ReactNode;
  SuffixComponent?: React.ReactNode;
  linkTo?: To;
  variant?: "border" | "filled" | "outlined" | undefined;
};

const getBackgroundColor = (disabled: boolean | undefined, variant: string) => {
  if (disabled) {
    return Colors.background.lighterDark;
  }

  if (variant === "border") {
    return Colors.background.light;
  }

  if (variant === "outlined") {
    return Colors.background.light;
  }

  if (variant === "filled") {
    return Colors.background.brand;
  }

  return Colors.background.default;
};

function Button({
  children,
  PrefixIcon,
  PrefixComponent,
  SuffixComponent,
  sx = {},
  title,
  variant,
  linkTo,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ButtonBase
      {...props}
      disabled={disabled}
      sx={{
        borderRadius: 1,
        fontFamily: "IBM Plex Sans, serif;",
        whiteSpace: "nowrap",
        border: `0.5px solid ${Colors.border.subtle}`,
        "&:hover": {
          border: disabled ? "none" : `0.5px solid ${Colors.border.subtle}`,
        },
        borderColor: variant === "outlined" ? Colors.border.brand : "none",
        "&:active": {
          outline: disabled ? "none" : `2.7px solid rgba(2, 189, 174, 0.5)`,
          outlineOffset: "-2.7px",
        },
        display: { xs: "flex", sm: "flex" },
        fontSize: "1rem",
        minHeight: "42px",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: { xs: "0.5rem", sm: "1rem" },
        paddingLeft: { xs: "0.5rem", sm: "1rem" },
        color: disabled
          ? Colors.text.placeholder
          : variant === "border"
            ? Colors.text.default
            : Colors.text.inverse,
        backgroundColor: getBackgroundColor(disabled, variant ?? "border"),
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
        ...sx,
      }}
    >
      {PrefixIcon && (
        <PrefixIcon
          style={{
            color: Colors.background.brand,
            height: "auto",
            width: "1.6rem",
            aspectRatio: 1,
          }}
        />
      )}
      {PrefixComponent}

      {title && linkTo ? (
        <Typography
          sx={{
            display: { xs: "none", sm: "flex" },
            marginLeft: { md: "1rem", lg: "0.5rem" },
          }}
        >
          <Link
            to={linkTo}
            style={{
              textDecoration: "none",
              color: Colors.text.default,
            }}
          >
            {title}
          </Link>
        </Typography>
      ) : (
        <Typography
          sx={{
            display: { xs: "none", sm: "flex" },
            marginLeft: { md: "1rem", lg: "0.5rem" },
          }}
        >
          {title}
        </Typography>
      )}
      {children}
      {SuffixComponent}
    </ButtonBase>
  );
}

export default Button;
