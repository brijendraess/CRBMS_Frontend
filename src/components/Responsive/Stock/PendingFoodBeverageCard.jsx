import { Box, Card, Switch, Typography } from "@mui/material";
import React from "react";

const PendingFoodBeverageCard = ({user,key, foodBeverage,handleStatusChange }) => {
  return (
    <Card sx={{ width: 320 }} key={key}>
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
        {user.UserType.inventoryModule &&
            user.UserType.inventoryModule
              .split(",")
              .includes("pendingFoodBeverageStatus") &&<Switch
         checked={foodBeverage.status}
         onChange={() => handleStatusChange(foodBeverage.id)}
          />}
      </Box>
    </Card>
  );
};

export default PendingFoodBeverageCard;
