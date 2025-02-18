import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";
import CustomButton from "../../components/Common/Buttons/CustomButton";
import {
  DeleteOutlineOutlinedIcon,
  EditOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";

const LocationCard = ({ user,location, onEdit, onDelete, onStatusChange }) => {
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
      className="location-card"
    >
      <CardMedia
        component="img"
        src={`${import.meta.env.VITE_API_URL}/${location.locationImagePath}`}
        alt={location.locationName || "Location"}
        sx={{ width: "100px", height: "100%" }}
      />
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
            {location.locationName || "Unnamed Location"}
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
            {user.UserType.locationModule &&
            user.UserType.locationModule.split(",").includes("edit") && <CustomButton
              title="Edit Location"
              placement="top"
              onClick={() => onEdit(location.id)} // Use location.id for editing
              Icon={EditOutlinedIcon}
              fontSize="small"
              background="rgba(8, 90, 232, 0.62)"
              nameOfTheClass="location-edit"
            />}
            {user.UserType.locationModule &&
            user.UserType.locationModule.split(",").includes("delete") && <CustomButton
              title="Delete Location"
              placement="top"
              onClick={() => onDelete(location.id)} // Use location.id for deletion
              Icon={DeleteOutlineOutlinedIcon}
              fontSize="small"
              background="rgba(231, 26, 7, 0.77)"
              nameOfTheClass="location-delete"
            />}
            {user.UserType.locationModule &&
            user.UserType.locationModule
              .split(",")
              .includes("changeStatus") && <Switch
              checked={location.status || false}
              onChange={() => onStatusChange(location.id)} // Handle status change
              className="location-switch"
            />}
          </Box>
        </CardActions>
      </Box>
    </Card>
  );
};

export default LocationCard;
