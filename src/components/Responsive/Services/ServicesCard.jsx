import { Box, Card, Switch, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../Common/Buttons/CustomButton";
import {
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../Common/Buttons/CustomIcon";

const ServicesCard = ({
  user,
  services,
  handleEdit,
  handleDelete,
  handleStatusChange,
}) => {
  return (
    <Card sx={{ width: 320 }}>
      <Typography
        sx={{
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        {services.servicesName}
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
        {user.UserType.servicesModule &&
            user.UserType.servicesModule.split(",").includes("edit") && <CustomButton
          title={"Edit Services"}
          placement={"top"}
          onClick={() => handleEdit(services.id)}
          Icon={EditOutlinedIcon}
          fontSize={"small"}
          background={"rgba(8, 90, 232, 0.62)"}
        />}
        {user.UserType.servicesModule &&
            user.UserType.servicesModule.split(",").includes("delete") && <CustomButton
          title={"Delete Services"}
          placement={"top"}
          onClick={() => handleDelete(services.id)}
          Icon={DeleteOutlineOutlinedIcon}
          fontSize={"small"}
          background={"rgba(231, 26, 7, 0.77)"}
        />}

        {user.UserType.servicesModule &&
            user.UserType.servicesModule
              .split(",")
              .includes("changeStatus") && <Switch
          checked={services.status}
          onChange={() => handleStatusChange(services.id)}
        />}
      </Box>
    </Card>
  );
};

export default ServicesCard;
