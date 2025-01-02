import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import CheckAndShowImage from "../Common Components/CustomImage/showImage";

const NotificationsMenu = ({ notifications,unReadCount }) => {

  const navigate = useNavigate();


  const onViewAll=()=>{
    navigate("/notification-all"); 
  }


  return (
    <Box
      sx={{
        width: 320,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.32)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "10px 16px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="p" sx={{ fontWeight: "bold" }}>
          Meetings logs({unReadCount})
        </Typography>
      </Box>

      {/* Notifications List */}
      <List sx={{ maxHeight: 300, overflowY: "auto" }}>
        {notifications?.map((notification, index) => (
          <React.Fragment key={index}>
            <NotificationItem {...notification} />
            {index < notifications.length - 1 && (
              <Divider
                variant="middle"
                component="li"
                sx={{ backgroundColor: "#0000000f" }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onViewAll}
          sx={{ width: "100%" }}
        >
          View All Notifications
        </Button>
      </Box>
    </Box>
  );
};

const NotificationItem = ({ avatar, name, action, item, time }) => {
  return (
    <ListItem alignItems="flex-start" sx={{ padding: "8px 16px" }}>
      <ListItemAvatar>
      <CheckAndShowImage imageUrl={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {name} <span style={{ fontWeight: "normal" }}>{action}</span>{" "}
            <span style={{ fontWeight: "bold", color: "#1976d2" }}>{item}</span>
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="textSecondary">
            {time}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default NotificationsMenu;
