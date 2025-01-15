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
import CustomButton from "../Common/CustomButton/CustomButton";
import { useSelector } from "react-redux";
import {
  RemoveRedEyeIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
  BadgeOutlinedIcon,
  MailOutlinedIcon,
  LocalPhoneOutlinedIcon,
} from "../Common/CustomButton/CustomIcon";

const CommitteeMemberCard = ({
  member,
  handleView,
  handleEdit,
  handleDelete,
  handleBlockStatusChange,
  children,
}) => {
  const { user } = useSelector((state) => state.user);

  return (
    <Card sx={{ width: 320 }}>
      <CardActionArea>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <CardMedia
            component="img"
            height="150"
            image={
              member.avatarPath
                ? `${import.meta.env.VITE_API_URL}/${member.avatarPath}`
                : "/default-avatar.png"
            }
            alt="Member Avatar"
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
            {member.fullname}
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
            {member.email}
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
            {member.phoneNumber}
          </Typography>
        </CardContent>
      </CardActionArea>
      {user?.UserType?.isAdmin ==='admin'? (
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
      ) : null}
    </Card>
  );
};

export default CommitteeMemberCard;
