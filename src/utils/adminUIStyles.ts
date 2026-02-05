/**
 * Professional admin UI styling constants
 * Ensures consistent, polished look across all admin pages
 */

import { Colors } from "../theme";

export const adminModalStyles = {
  dialogTitle: {
    fontWeight: 600,
    fontSize: "1.5rem",
    color: Colors.text.default,
    borderBottom: `1px solid ${Colors.border.default}`,
    paddingBottom: 2,
  },
  dialogContent: {
    paddingTop: 3,
    paddingBottom: 2,
  },
  dialogActions: {
    padding: "1.5rem",
    gap: 1,
    borderTop: `1px solid ${Colors.border.default}`,
  },
};

export const adminButtonStyles = {
  primary: {
    bgcolor: Colors.background.brand,
    color: Colors.text.inverse,
    fontWeight: 600,
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: Colors.background.brand,
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.1)`,
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  secondary: {
    bgcolor: "transparent",
    color: Colors.background.brand,
    border: `2px solid ${Colors.background.brand}`,
    fontWeight: 600,
    padding: "0.65rem 1.4rem",
    borderRadius: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: `rgba(${Colors.background.brand}, 0.05)`,
      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
    },
    "&:active": {
      bgcolor: `rgba(${Colors.background.brand}, 0.1)`,
    },
  },
  danger: {
    bgcolor: "#EF4444",
    color: Colors.text.inverse,
    fontWeight: 600,
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "#DC2626",
      boxShadow: `0 4px 12px rgba(239, 68, 68, 0.3)`,
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: `0 2px 6px rgba(239, 68, 68, 0.2)`,
    },
  },
  ghost: {
    bgcolor: "transparent",
    color: Colors.background.brand,
    fontWeight: 500,
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(0, 0, 0, 0.05)",
    },
  },
};

export const adminCardStyles = {
  elevated: {
    bgcolor: Colors.background.light,
    border: `1px solid ${Colors.border.default}`,
    borderRadius: "0.75rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
  },
};

export const adminTableRowStyles = {
  hover: {
    bgcolor: Colors.background.light,
    transition: "background-color 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      bgcolor: `rgba(${Colors.background.brand}, 0.05)`,
    },
  },
};

export const adminActionCellStyles = {
  display: "flex",
  gap: 1,
  justifyContent: "flex-end",
  alignItems: "center",
};

export const adminIconButtonStyles = {
  padding: "0.5rem",
  borderRadius: "0.375rem",
  transition: "all 0.2s ease",
  "&:hover": {
    bgcolor: "rgba(0, 0, 0, 0.05)",
  },
};

export const adminBadgeStyles = {
  success: {
    bgcolor: "rgba(34, 197, 94, 0.1)",
    color: "#16a34a",
  },
  warning: {
    bgcolor: "rgba(251, 146, 60, 0.1)",
    color: "#ea580c",
  },
  error: {
    bgcolor: "rgba(239, 68, 68, 0.1)",
    color: "#dc2626",
  },
  info: {
    bgcolor: `rgba(${Colors.background.brand}, 0.1)`,
    color: Colors.background.brand,
  },
};
