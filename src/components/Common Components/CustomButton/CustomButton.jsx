import React from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";

const CustomButton = ({
  onClick,
  title,
  Icon,
  fontSize,
  iconStyles = {},
  disabled = false,
  background,
  placement,
}) => {
  return (
    <Tooltip title={title} placement={placement}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        style={{
          ...iconStyles,
          cursor: disabled ? "not-allowed" : "pointer",
          borderRadius: "50%",
          background: background,
        }}
      >
        {Icon && <Icon fontSize={fontSize} sx={{ color: "black" }} />}
      </IconButton>
    </Tooltip>
  );
};

// Define PropTypes for type checking
CustomButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  Icon: PropTypes.elementType.isRequired,
  background: PropTypes.string,
  placement: PropTypes.string,
  fontSize: PropTypes.oneOf(["small", "medium", "large"]),
  iconStyles: PropTypes.object,
  disabled: PropTypes.bool,
};

export default CustomButton;
