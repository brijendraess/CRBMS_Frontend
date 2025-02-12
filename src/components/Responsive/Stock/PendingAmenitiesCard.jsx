import { Box, Card, Switch, Typography } from "@mui/material";
import React from "react";

const PendingAmenitiesCard = ({ amenities,handleStatusChange }) => {
  return (
    <Card sx={{ width: 320 }}>
      <Typography
        sx={{
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        {amenities.amenityName}
      </Typography>
      <Typography
              sx={{
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              Room :{amenities.roomName}
            </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "5px",
          gap: "10px",
        }}
      >
        <Switch
         checked={amenities.status}
         onChange={() => handleStatusChange(amenities.id)}
          />
      </Box>
    </Card>
  );
};

export default PendingAmenitiesCard;
