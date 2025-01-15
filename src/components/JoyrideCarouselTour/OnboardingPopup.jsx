import React from "react";
import { Modal, Box, Button, IconButton, useMediaQuery } from "@mui/material";
import JoyrideResponsiveCarousel from "./JoyrideResponsiveCarousel";
import { CloseOutlinedIcon } from "../Common/CustomButton/CustomIcon";

const OnboardingPopup = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          maxWidth: "1024px",
          bgcolor: "transparent",
          //   padding: "5px",
        }}
      >
        <IconButton
          onClick={onClose}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            display: "block",
            marginLeft: "auto",
            // background: "#fff",
            marginBottom: "10px",
            // position: "absolute",
          }}
          size="small"
        >
          <CloseOutlinedIcon fontSize="large" sx={{ color: "#fff" }} />
        </IconButton>
        <JoyrideResponsiveCarousel />
      </Box>
    </Modal>
  );
};

export default OnboardingPopup;
