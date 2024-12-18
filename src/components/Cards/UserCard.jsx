import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Switch,
  Typography,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import CustomButton from "../Common Components/CustomButton/CustomButton";

const UserCard = ({
  user,
  handleView,
  handleEdit,
  handleDelete,
  handleBlockStatusChange,
}) => {
  return (
    <Card sx={{ width: 320 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={
            user.avatarPath
              ? `${import.meta.env.VITE_API_URL}/${user.avatarPath}`
              : "/default-avatar.png"
          }
          alt="User Avatar"
          sx={{ objectFit: "contain", background: "#0af3ff0a" }}
        />
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <BadgeOutlinedIcon fontSize="small" sx={{ marginBottom: "6px" }} />
            {user.fullname}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MailOutlinedIcon fontSize="small" sx={{ marginBottom: "6px" }} />
            {user.email}
          </Typography>
          <Typography
            gutterBottom
            variant="body2"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <LocalPhoneOutlinedIcon
              fontSize="small"
              sx={{ marginBottom: "6px" }}
            />
            {user.phoneNumber}
          </Typography>
        </CardContent>
      </CardActionArea>
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
          title={"View User"}
          placement={"top"}
          onClick={() => handleView(user.id)}
          Icon={RemoveRedEyeIcon}
          fontSize={"small"}
          background={"rgba(3, 176, 48, 0.68)"}
        />
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
        <Switch
          checked={user.isBlocked}
          onChange={() => handleBlockStatusChange(user.id, user.isBlocked)}
        />
      </Box>
    </Card>
  );
};

export default UserCard;
