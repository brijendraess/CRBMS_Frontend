import React from "react";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { ErrorOutlineIcon } from "../../Buttons/CustomIcon";

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

const DeleteNotAllowModel = ({ open, onClose, title }) => {
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
         <ErrorOutlineIcon color="error" fontSize="large" />Not allowed
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
          Deletion of room is not allowed, due to having meeting.
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Box component={'div'}></Box>
            <Box component={'div'}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteNotAllowModel;
