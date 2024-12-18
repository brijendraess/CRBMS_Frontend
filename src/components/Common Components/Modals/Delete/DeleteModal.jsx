import React from "react";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const DeleteModal = ({ open, onClose, onDeleteConfirm, title, button }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style, width: 320 }}>
        <Typography
          variant="h4"
          component="h4"
          id="child-modal-title"
          sx={{
            fontSize: "22px",
            fontWeight: "500",
            lineHeight: "1.4",
            color: "#2e2e2e",
          }}
        >
          Confirm Deletion
        </Typography>
        <Divider sx={{ mb: 2, background: "black" }} variant="fullWidth" />
        <Typography
          variant="p"
          component="p"
          id="child-modal-description"
          sx={{
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "1.6",
            color: "#4F4F4F",
            mb: 5,
          }}
        >
          Are you sure you want to delete this {title}?
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="error" onClick={onDeleteConfirm}>
            {button}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
