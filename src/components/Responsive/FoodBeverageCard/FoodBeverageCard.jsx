import { Box, Card, Switch, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../Common/CustomButton/CustomButton";
import {
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../Common/CustomButton/CustomIcon";

const FoodBeverageCard = ({ food, handleEdit, handleDelete }) => {
  return (
    <Card sx={{ width: 320 }}>
      <Typography
        sx={{
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        {food.foodBeverageName}
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
        <CustomButton
          title={"Edit Food"}
          placement={"top"}
          onClick={() => handleEdit(food.id)}
          Icon={EditOutlinedIcon}
          fontSize={"small"}
          background={"rgba(8, 90, 232, 0.62)"}
        />
        <CustomButton
          title={"Delete Food"}
          placement={"top"}
          onClick={() => handleDelete(food.id)}
          Icon={DeleteOutlineOutlinedIcon}
          fontSize={"small"}
          background={"rgba(231, 26, 7, 0.77)"}
        />
        <Switch />
      </Box>
    </Card>
  );
};

export default FoodBeverageCard;
