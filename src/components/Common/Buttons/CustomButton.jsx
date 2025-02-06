import { IconButton, Paper, Tooltip, useMediaQuery } from "@mui/material";

const CustomButton = ({
  onClick,
  disabled,
  iconStyles,
  background,
  Icon,
  fontSize,
  nameOfTheClass,
  title
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
      <Tooltip title={title}>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          sx={{
            background: background,
            borderRadius: "50%",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.3s ease-in-out",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            position: "relative",
            "&:hover": {
              background: `${background}`,
              transform: "scale(1.1)",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: `2px solid ${background}`,
              borderRadius: "50%",
              transform: "scale(1)",
              transition: "transform 0.3s ease-in-out",
              opacity: 0,
            },
            "&:hover::after": {
              transform: "scale(1.2)",
              opacity: 1,
            },
          }}
          size={buttonSize}
          className={nameOfTheClass}
        >
          {Icon && <Icon fontSize={fontSize} sx={{ color: "white" }} />}
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default CustomButton;
