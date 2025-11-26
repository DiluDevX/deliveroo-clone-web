import { Box, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { Colors } from "../../../theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "./Button";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WorkIcon from "@mui/icons-material/Work";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";

const PartnerWithUs = () => {
  const [partnerMenuAnchor, setPartnerMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const handlePartnerMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPartnerMenuAnchor(event.currentTarget);
  };

  const handlePartnerMenuClose = () => {
    setPartnerMenuAnchor(null);
  };

  return (
    <Box>
      <Button
        variant="border"
        title="Partner with Us"
        sx={{ backgroundColor: Colors.background.light }}
        onClick={handlePartnerMenuOpen}
        PrefixComponent={
          <ExpandMoreIcon
            sx={{
              fontSize: "27px",
              ml: "-8px",
              color: Colors.background.brand,
              transform: partnerMenuAnchor ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        }
      />
      <Menu
        anchorEl={partnerMenuAnchor}
        open={Boolean(partnerMenuAnchor)}
        onClose={handlePartnerMenuClose}
        MenuListProps={{
          sx: {
            padding: 0,
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: `0px 4px 20px ${Colors.boxShadow.default}`,
            border: `1px solid ${Colors.border.subtle}`,
            minWidth: "100px",
            mt: "3px",
          },
        }}
      >
        <MenuItem
          onClick={handlePartnerMenuClose}
          sx={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            "&:hover": {
              backgroundColor: Colors.background.subtleLight,
            },
          }}
        >
          <TwoWheelerIcon
            sx={{ fontSize: "18px", color: Colors.background.brand }}
          />
          <Typography sx={{ fontSize: "14px", color: Colors.text.default }}>
            Riders
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handlePartnerMenuClose}
          sx={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            "&:hover": {
              backgroundColor: Colors.background.subtleLight,
            },
          }}
        >
          <RestaurantIcon
            sx={{ fontSize: "18px", color: Colors.background.brand }}
          />
          <Typography sx={{ fontSize: "14px", color: Colors.text.default }}>
            Partners
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handlePartnerMenuClose}
          sx={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            "&:hover": {
              backgroundColor: Colors.background.subtleLight,
            },
          }}
        >
          <WorkIcon sx={{ fontSize: "18px", color: Colors.background.brand }} />
          <Typography sx={{ fontSize: "14px", color: Colors.text.default }}>
            Careers
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handlePartnerMenuClose}
          sx={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            "&:hover": {
              backgroundColor: Colors.background.subtleLight,
            },
          }}
        >
          <CorporateFareIcon
            sx={{ fontSize: "18px", color: Colors.background.brand }}
          />
          <Typography sx={{ fontSize: "14px", color: Colors.text.default }}>
            Deliveroo for work
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PartnerWithUs;
