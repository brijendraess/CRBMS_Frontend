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
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
} from "@mui/icons-material";

const AmenitiesCard = ({
  amenity,
  handleEdit,
  handleDelete,
  handleStatusChange,
}) => {
  return (
    <Card sx={{ width: 320 }}>
      <CardActionArea>
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            style={{
              fontSize: {
                xs: "16px",
                sm: "18px",
                md: "20px",
                lg: "24px",
              },
            }}
          >
            {amenity.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {amenity.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px",
            gap: "10px",
          }}
        >
          <CustomButton
            title={"Edit Amenity"}
            placement={"top"}
            onClick={() => handleEdit(amenity.id)} // Pass the amenity.id for editing
            Icon={EditOutlinedIcon}
            fontSize={"small"}
            background={"rgba(8, 90, 232, 0.62)"}
          />
          <CustomButton
            title={"Delete Amenity"}
            placement={"top"}
            onClick={() => handleDelete(amenity.id)} // Pass the amenity.id for deletion
            Icon={DeleteOutlineOutlinedIcon}
            fontSize={"small"}
            background={"rgba(231, 26, 7, 0.77)"}
          />
          <Switch
            checked={amenity.status}
            onChange={() => handleStatusChange(amenity.id)} // Handle status change for this amenity
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default AmenitiesCard;
