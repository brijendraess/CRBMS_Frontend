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
} from "../Common/Buttons/CustomIcon";
import CustomButton from "../Common/Buttons/CustomButton";

const UserCard = ({
  users,
  user,
  key,
  handleView,
  handleEdit,
  handleDelete,
  handleBlockStatusChange,
  children,
}) => {
  return (
    <Card
      className="user-card"
      elevation={2}
      sx={{ width: 300, border: "1px solid #00000021", padding: "5px" }}
      key={key}
    >
      <CardActionArea>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <CardMedia
            component="img"
            height="100"
            image={
              users.avatarPath
                ? `${import.meta.env.VITE_API_URL}/${users.avatarPath}`
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
            {users.fullname}
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
            {users.userName}
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
            {users.email}
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
            {users.phoneNumber}
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
            <AdminPanelSettingsOutlinedIcon
              fontSize="small"
              sx={{ marginBottom: "6px" }}
            />
            {users?.UserType?.userTypeName}
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
        {handleView && user.UserType.userModule &&
            user.UserType.userModule.split(",").includes("view") && (
          <CustomButton
            nameOfTheClass="view-button"
            title={"View User"}
            placement={"top"}
            onClick={() => handleView(users.id)}
            Icon={RemoveRedEyeIcon}
            fontSize={"small"}
            background={"rgba(3, 176, 48, 0.68)"}
          />
        )}
        {handleEdit && user.UserType.userModule &&
            user.UserType.userModule.split(",").includes("edit") && (
          <CustomButton
            nameOfTheClass="edit-button"
            title={"Edit User"}
            placement={"top"}
            onClick={() => handleEdit(users.id)}
            Icon={EditOutlinedIcon}
            fontSize={"small"}
            background={"rgba(8, 90, 232, 0.62)"}
          />
        )}
        {handleDelete && user.UserType.userModule &&
            user.UserType.userModule.split(",").includes("delete") && (
          <CustomButton
            nameOfTheClass="delete-button"
            title={"Delete User"}
            placement={"top"}
            onClick={() => handleDelete(users.id)}
            Icon={DeleteOutlineOutlinedIcon}
            fontSize={"small"}
            background={"rgba(231, 26, 7, 0.77)"}
          />
        )}
        {handleBlockStatusChange && user.UserType.userModule &&
            user.UserType.userModule.split(",").includes("changeStatus") && (
          <Switch
            className="switch-button"
            checked={users.isBlocked}
            onChange={() => handleBlockStatusChange(users.id, users.isBlocked)}
          />
        )}
        {children}
      </Paper>
    </Card>
  );
};

export default UserCard;
