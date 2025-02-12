import { Box, Card, Switch, Typography } from "@mui/material";
import React from "react";

const PendingFoodBeverageCard = ({ foodBeverage,handleStatusChange }) => {
  return (
    <Card sx={{ width: 320 }}>
      <Typography
        sx={{
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        {foodBeverage.foodBeverageName}
      </Typography>
      <Typography
        sx={{
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        Room :{foodBeverage.roomName}
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
         checked={foodBeverage.status}
         onChange={() => handleStatusChange(foodBeverage.id)}
          />
      </Box>
    </Card>
  );
};

export default PendingFoodBeverageCard;
