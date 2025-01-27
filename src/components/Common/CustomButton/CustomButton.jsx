import { IconButton, Paper, useMediaQuery } from "@mui/material";

const CustomButton = ({
  onClick,
  disabled,
  iconStyles,
  background,
  Icon,
  fontSize,
  nameOfTheClass,
}) => {
  const isXs = useMediaQuery("(max-width:600px)");
  const isSm = useMediaQuery("(max-width:960px)");
  const isMd = useMediaQuery("(max-width:1280px)");

  const buttonSize = isXs ? "small" : isSm ? "medium" : "large";

  return (
    <Paper
      elevation={24}
      sx={{
        background: "none",
        borderRadius: "50%",
      }}
    >
      <IconButton
        onClick={onClick}
        disabled={disabled}
        style={{
          ...iconStyles,
          cursor: disabled ? "not-allowed" : "pointer",
          borderRadius: "50%",
          background: background,
        }}
        size={buttonSize}
        className={nameOfTheClass}
      >
        {Icon && <Icon fontSize={fontSize} sx={{ color: "white" }} />}
      </IconButton>
    </Paper>
  );
};

export default CustomButton;
