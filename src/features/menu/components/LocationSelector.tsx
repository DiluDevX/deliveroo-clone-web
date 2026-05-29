import React, { useEffect, useState } from "react";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import type { DialogProps } from "@mui/material/Dialog";

import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../../../theme";
import { getUserAddresses } from "../../../services/user.service";
import { Address } from "../../../types/user.types";
import { useAppSelector } from "../../../store/hooks/cartHooks";
import {
  clearSelectedDeliveryAddress,
  getSelectedDeliveryAddress,
  SELECTED_DELIVERY_ADDRESS_CHANGED,
  setSelectedDeliveryAddress,
} from "../../../utils/selected-delivery-address";

const LocationSelector = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [selectedAddressLabel, setSelectedAddressLabel] = useState(
    getSelectedDeliveryAddress()?.label ?? null,
  );
  const { isAuthenticated, isAuthInitialized } = useAppSelector(
    (state) => state.auth,
  );

  const handleOnClick = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDialogClose: DialogProps["onClose"] = () => {
    closeDialog();
  };

  const handleCloseClick: React.MouseEventHandler = (event) => {
    closeDialog();
    event?.preventDefault();
    event?.stopPropagation();
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedDeliveryAddress(address);
    setSelectedAddressLabel(address.label);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (isAuthInitialized && !isAuthenticated) {
      clearSelectedDeliveryAddress();
      setSelectedAddressLabel(null);
    }
  }, [isAuthInitialized, isAuthenticated]);

  useEffect(() => {
    const syncSelectedAddress = () => {
      setSelectedAddressLabel(getSelectedDeliveryAddress()?.label ?? null);
    };

    window.addEventListener(
      SELECTED_DELIVERY_ADDRESS_CHANGED,
      syncSelectedAddress,
    );

    return () => {
      window.removeEventListener(
        SELECTED_DELIVERY_ADDRESS_CHANGED,
        syncSelectedAddress,
      );
    };
  }, []);

  useEffect(() => {
    if (!isDialogOpen || !isAuthenticated) {
      return;
    }

    let isActive = true;

    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      const addresses = await getUserAddresses();

      if (!isActive) {
        return;
      }

      setSavedAddresses(addresses);
      setIsLoadingAddresses(false);
    };

    void loadAddresses();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, isDialogOpen]);

  return (
    <Box
      sx={{
        display: "flex",
        cursor: "pointer",
      }}
      onClick={handleOnClick}
    >
      <DirectionsBikeOutlinedIcon sx={{ color: Colors.background.brand }} />
      <Typography
        sx={{
          mx: 2,
        }}
      >
        {selectedAddressLabel ?? "No location selected"}
      </Typography>
      <Typography
        sx={{
          color: Colors.background.brand,
        }}
      >
        Change
      </Typography>

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleDialogClose}
        open={isDialogOpen}
        PaperProps={{
          sx: {
            m: { xs: 1.5, sm: 4 },
            width: { xs: "calc(100vw - 24px)", sm: "100%" },
            maxHeight: { xs: "calc(100dvh - 24px)", sm: "80vh" },
            borderRadius: { xs: "10px", sm: "12px" },
          },
        }}
      >
        <DialogTitle>Your Location</DialogTitle>
        <IconButton
          onClick={handleCloseClick}
          aria-label="delete"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ overflowY: "auto" }}>
          {!isAuthenticated && (
            <Typography sx={{ color: Colors.text.placeholder }}>
              Log in to choose from your saved addresses.
            </Typography>
          )}

          {isAuthenticated && isLoadingAddresses && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} />
              <Typography sx={{ color: Colors.text.placeholder }}>
                Loading saved addresses...
              </Typography>
            </Box>
          )}

          {isAuthenticated &&
            !isLoadingAddresses &&
            savedAddresses.length === 0 && (
              <Typography sx={{ color: Colors.text.placeholder }}>
                No saved addresses yet.
              </Typography>
            )}

          {isAuthenticated &&
            !isLoadingAddresses &&
            savedAddresses.length > 0 && (
              <List disablePadding>
                {savedAddresses.map((address) => (
                  <ListItemButton
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    sx={{
                      border: `1px solid ${Colors.border.subtle}`,
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 600,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {address.label}
                          {address.isDefault ? " · Default" : ""}
                        </Typography>
                      }
                      secondaryTypographyProps={{
                        sx: { overflowWrap: "anywhere" },
                      }}
                      secondary={`${address.line1}, ${address.city}, ${address.postcode}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LocationSelector;
