import React, { forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Box } from "@mui/material";
import CustomButton from "../../Buttons/CustomButton";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const NewPopUpModal = ({
  modalBody,
  isOpen,
  setIsOpen,
  width = "600px" || width,
  height = "auto",
  title = "",
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      sx={{
        "& .MuiDialog-paper": {
          backdropFilter: "blur(10px) saturate(180%)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
      <AppBar
        sx={{
          position: "relative",
          background: `var(--linear-gradient-main)`,
          // background: `transparent`,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{ fontSize: "20px", fontWeight: 400 }}
            variant="h6"
            component="div"
          >
            {title}
          </Typography>
          <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          position: "absolute",
          maxWidth: {
            xs: "300px",
            sm: `${width}`,
          },
          maxHeight: {
            xs: "480px",
            md: "auto",
          },
          height: {
            xs: "auto",
            md: "auto",
          },
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `var(--body-color-2)`,
          borderRadius: "8px",
          zIndex: "10000",
          minWidth: "300px",
          overflowY: "scroll",
          // background: `var(--body-color)`,
        }}
      >
        {modalBody}
      </Box>
    </Dialog>
  );
};

export default NewPopUpModal;
