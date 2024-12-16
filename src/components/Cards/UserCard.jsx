import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Icon,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import CustomButton from "../Common Components/CustomButton/CustomButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

const UserCard = ({ user }) => {
  console.log(user);
  return (
    <Card sx={{ width: 320 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={`${import.meta.env.VITE_API_URL}/${user.avatarPath}`}
          alt="green iguana"
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
            <BadgeOutlinedIcon fontSize="medium" sx={{ marginBottom: "6px" }} />
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
            <MailOutlinedIcon fontSize="medium" sx={{ marginBottom: "6px" }} />
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
              fontSize="medium"
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
        }}
      >
        <CustomButton
          title={"View User"}
          placement={"top"}
          onClick={""}
          Icon={RemoveRedEyeIcon}
          fontSize={"medium"}
          background={"rgba(3, 176, 48, 0.68)"}
        />
        <CustomButton />
        <CustomButton
          title={"Edit User"}
          placement={"top"}
          onClick={""}
          Icon={EditOutlinedIcon}
          fontSize={"medium"}
          background={"rgba(8, 90, 232, 0.62)"}
        />
        <CustomButton />
        <CustomButton
          title={"Delete User"}
          placement={"top"}
          onClick={""}
          Icon={DeleteOutlineOutlinedIcon}
          fontSize={"medium"}
          background={"rgba(231, 26, 7, 0.77)"}
        />
        <CustomButton />
        <CustomButton />
        <Switch />
      </Box>
    </Card>
  );
};

export default UserCard;
