import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";

const AmenitiesCard = ({ amenity }) => {
  console.log(amenity);

  return (
    <>
      <Card sx={{ maxWidth: 320 }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {amenity.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {amenity.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Box
            disableSpacing
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px",
              gap: "10px",
            }}
          >
            <CustomButton
              title={"Edit User"}
              placement={"top"}
              onClick={() => handleEdit(user.id)}
              Icon={EditOutlinedIcon}
              fontSize={"small"}
              background={"rgba(8, 90, 232, 0.62)"}
            />
            <CustomButton
              title={"Delete User"}
              placement={"top"}
              onClick={() => handleDelete(user.id)}
              Icon={DeleteOutlineOutlinedIcon}
              fontSize={"small"}
              background={"rgba(231, 26, 7, 0.77)"}
            />
            <Switch />
          </Box>
        </CardActions>
      </Card>
    </>
  );
};

export default AmenitiesCard;
