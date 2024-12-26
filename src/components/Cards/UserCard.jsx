import React, { Children } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Switch,
  Typography,
} from "@mui/material";
import { AdminPanelSettingsOutlinedIcon, BadgeOutlinedIcon, DeleteOutlineOutlinedIcon, EditOutlinedIcon, LocalPhoneOutlinedIcon, MailOutlinedIcon, RemoveRedEyeIcon } from "../Common Components/CustomButton/CustomIcon";
import CustomButton from "../Common Components/CustomButton/CustomButton";

const UserCard = ({
  user,
  handleView,
  handleEdit,
  handleDelete,
  handleBlockStatusChange,
  children,
}) => {
  return (
    <Card sx={{ width: 320 }}>
      <CardActionArea>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <CardMedia
            component="img"
            height="150"
            image={
              user.avatarPath
                ? `${import.meta.env.VITE_API_URL}/${user.avatarPath}`
                : "/default-avatar.png"
            }
            alt="User Avatar"
            sx={{
              objectFit: "contain",
              background: "#bfc9c957",
              width: "150px",
              borderRadius: "50%",
            }}
          />
        </Box>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "18px",
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
              fontSize: "14px",
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
              fontSize: "14px",
            }}
          >
            <LocalPhoneOutlinedIcon
              fontSize="small"
              sx={{ marginBottom: "6px" }}
            />
            {user.phoneNumber}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <AdminPanelSettingsOutlinedIcon
            fontSize="small"
            sx={{ marginBottom: "6px" }}
             />
            {user.isAdmin}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px",
          gap: "10px",
        }}
      >
        {handleView && (
          <CustomButton
            title={"View User"}
            placement={"top"}
            onClick={() => handleView(user.id)}
            Icon={RemoveRedEyeIcon}
            fontSize={"small"}
            background={"rgba(3, 176, 48, 0.68)"}
          />
        )}
        {handleEdit && (
          <CustomButton
            title={"Edit User"}
            placement={"top"}
            onClick={() => handleEdit(user.id)}
            Icon={EditOutlinedIcon}
            fontSize={"small"}
            background={"rgba(8, 90, 232, 0.62)"}
          />
        )}
        {handleDelete && (
          <CustomButton
            title={"Delete User"}
            placement={"top"}
            onClick={() => handleDelete(user.id)}
            Icon={DeleteOutlineOutlinedIcon}
            fontSize={"small"}
            background={"rgba(231, 26, 7, 0.77)"}
          />
        )}
        {handleBlockStatusChange && (
          <Switch
            checked={user.isBlocked}
            onChange={() => handleBlockStatusChange(user.id, user.isBlocked)}
          />
        )}
        {children}
      </Box>
    </Card>
  );
};

export default UserCard;
