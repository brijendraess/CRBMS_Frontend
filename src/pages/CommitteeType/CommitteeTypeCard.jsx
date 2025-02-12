import {
    Box,
    Card,
    CardActions,
    CardContent,
    Switch,
    Typography,
  } from "@mui/material";
  import React from "react";
  import CustomButton from "../../components/Common/Buttons/CustomButton";
  import {
    DeleteOutlineOutlinedIcon,
    EditOutlinedIcon,
  } from "../../components/Common/Buttons/CustomIcon";
  
  const CommitteeTypeCard = ({ user,key,committeeType, onEdit, onDelete, onStatusChange }) => {
    return (
      <Card
        sx={{
          display: "flex",
          width: 320,
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px",
          height: "125px",
          maxHeight: "150px",
        }}
        className="committeeType-card"
        key={key}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent>
            <Typography
              component="h6"
              variant="h6"
              sx={{
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {committeeType.name || "Unnamed Committee Type"}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              padding: 0,
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {user.UserType.committeeTypeModule &&
            user.UserType.committeeTypeModule.split(",").includes("edit") && <CustomButton
                title="Edit Committee Type"
                placement="top"
                onClick={() => onEdit(committeeType.id)} // Use committeeType.id for editing
                Icon={EditOutlinedIcon}
                fontSize="small"
                background="rgba(8, 90, 232, 0.62)"
                nameOfTheClass="committeeType-edit"
              />}
              {user.UserType.committeeTypeModule &&
            user.UserType.committeeTypeModule.split(",").includes("delete") && <CustomButton
                title="Delete CommitteeType"
                placement="top"
                onClick={() => onDelete(committeeType.id)} // Use committeeType.id for deletion
                Icon={DeleteOutlineOutlinedIcon}
                fontSize="small"
                background="rgba(231, 26, 7, 0.77)"
                nameOfTheClass="committeeType-delete"
              />}
              {user.UserType.committeeTypeModule &&
            user.UserType.committeeTypeModule
              .split(",")
              .includes("changeStatus") && <Switch
                checked={committeeType.status || false}
                onChange={() => onStatusChange(committeeType.id)} // Handle status change
                className="committeeType-switch"
              />}
            </Box>
          </CardActions>
        </Box>
      </Card>
    );
  };
  
  export default CommitteeTypeCard;
  