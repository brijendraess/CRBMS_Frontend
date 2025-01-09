import React, { Children } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettingsOutlinedIcon,
  BadgeOutlinedIcon,
  DeleteOutlineOutlinedIcon,
  EditOutlinedIcon,
  LocalPhoneOutlinedIcon,
  MailOutlinedIcon,
  Person3OutlinedIcon,
  RemoveRedEyeIcon,
} from "../Common/CustomButton/CustomIcon";
import CustomButton from "../Common/CustomButton/CustomButton";

const UserCard = ({
  user,
  handleView,
  handleEdit,
  handleDelete,
  handleBlockStatusChange,
  children,
}) => {
  return (
    <Card
      elevation={2}
      sx={{ width: 300, border: "1px solid #00000021", padding: "5px" }}
    >
      <CardActionArea>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <CardMedia
            component="img"
            height="100"
            image={
              user.avatarPath
                ? `${import.meta.env.VITE_API_URL}/${user.avatarPath}`
                : "/default-avatar.png"
            }
            alt="User Avatar"
            sx={{
              objectFit: "contain",
              background: "#bfc9c957",
              width: "100px",
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
              gap: "10px",
              fontSize: "18px",
            }}
          >
            <BadgeOutlinedIcon fontSize="small" />
            {user.fullname}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{
              display: "flex",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <Person3OutlinedIcon fontSize="small" />
            {user.userName}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              display: "flex",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <MailOutlinedIcon fontSize="small" />
            {user.email}
          </Typography>
          <Typography
            gutterBottom
            variant="body2"
            component="div"
            sx={{
              display: "flex",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <LocalPhoneOutlinedIcon fontSize="small" />
            {user.phoneNumber}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              display: "flex",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <AdminPanelSettingsOutlinedIcon fontSize="small" />
            {user.isAdmin}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Paper
        elevation={4}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          // padding: "8px",
          gap: "10px",
          background: "#6464641f",
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
      </Paper>
    </Card>
  );
};

export default UserCard;
