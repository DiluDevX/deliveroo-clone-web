import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { Colors } from "../../theme";
import { store } from "../../store/store";
import { useState } from "react";

const AdminSettingsPage = () => {
  const [copied, setCopied] = useState(false);
  const [isApiChanged, setIsApiChanged] = useState(false);
  const [isCommissionChanged, setIsCommissionChanged] = useState(false);
  const [isMinOrderValueChanged, setIsMinOrderValueChanged] = useState(false);
  const [isSmtpServerChanged, setIsSmtpServerChanged] = useState(false);
  const [isFromEmailChanged, setIsFromEmailChanged] = useState(false);
  const [isFromNameChanged, setIsFromNameChanged] = useState(false);
  const apiKey = "•••••••••••••••••";

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Box sx={{ maxWidth: "800px" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Manage platform configuration and policies
        </Typography>
      </Box>

      {/* Commission Settings */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Commission Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Platform Commission (%)"
            defaultValue="10"
            onChange={() => setIsCommissionChanged(true)}
            type="number"
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Min Order Value"
            defaultValue="100"
            type="number"
            size="small"
            onChange={() => setIsMinOrderValueChanged(true)}
            sx={{ flex: 1 }}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ bgcolor: Colors.background.brand }}
          disabled={!isCommissionChanged && !isMinOrderValueChanged}
        >
          Save Changes
        </Button>
      </Card>

      {/* Feature Toggles */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Feature Toggles
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: Colors.background.brand,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: Colors.background.brand,
                  },
                }}
              />
            }
            label="Allow new restaurant registrations"
          />
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: Colors.background.brand,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: Colors.background.brand,
                  },
                }}
              />
            }
            label="Enable user referral program"
          />
          <FormControlLabel
            control={
              <Switch
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: Colors.background.brand,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: Colors.background.brand,
                  },
                }}
              />
            }
            label="Maintenance mode"
          />
        </Box>
      </Card>

      {/* Email Settings */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Email Configuration
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TextField
          fullWidth
          label="SMTP Server"
          onChange={() => setIsSmtpServerChanged(true)}
          defaultValue="smtp.gmail.com"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="From Email"
          onChange={() => setIsFromEmailChanged(true)}
          defaultValue="noreply@deliveroo.com"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="From Name"
          onChange={() => setIsFromNameChanged(true)}
          defaultValue="Deliveroo"
          size="small"
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          sx={{ bgcolor: Colors.background.brand }}
          disabled={
            !isSmtpServerChanged && !isFromEmailChanged && !isFromNameChanged
          }
        >
          Save Email Settings
        </Button>
      </Card>

      <Card
        sx={{
          p: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          API Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TextField
          fullWidth
          label="API Base URL"
          defaultValue="https://localhost:4000/api"
          onChange={() => setIsApiChanged(true)}
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="API Key"
          defaultValue={apiKey}
          size="small"
          disabled={store.getState().auth.user?.role !== "platform_admin"}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <Tooltip title={copied ? "Copied!" : "Copy API Key"}>
                <IconButton
                  size="small"
                  onClick={handleCopyApiKey}
                  sx={{
                    color: Colors.background.brand,
                    mr: -1,
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            ),
          }}
        />

        <Button
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={() => {
            setIsApiChanged(true);
          }}
        >
          Regenerate Key
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: Colors.background.brand }}
          disabled={!isApiChanged}
        >
          Save API Settings
        </Button>
      </Card>
    </Box>
  );
};

export default AdminSettingsPage;
