import { Switch, SwitchProps } from "@mui/material";
import { Colors } from "../../../theme/colors";

const ClickableSwitch = (props: SwitchProps) => {
  return (
    <Switch
      {...props}
      sx={{
        "& .MuiSwitch-switchBase": {
          color: Colors.text.placeholder,
        },
        "& .MuiSwitch-switchBase + .MuiSwitch-track": {
          backgroundColor: "rgba(0, 0, 0, 0.26)",
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: Colors.background.brand,
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: Colors.background.brand,
        },
        ...props.sx,
      }}
    />
  );
};

export default ClickableSwitch;
