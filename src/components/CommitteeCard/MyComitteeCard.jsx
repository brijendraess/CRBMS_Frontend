import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { DeleteOutline, People as PeopleIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MyComitteeCard = ({ committee, onDelete, setRefreshPage, heading }) => {
  const [hover, setHover] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleView = () => {
    navigate(`/view-committee/${committee.committeeId}`, {
      state: { committee, heading },
    });
  };

  return (
    <Card
      elevation={hover ? 2 : 1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        height: {
          xs: "350px",
          sm: "300px",
          md: "300px",
          lg: "300px",
          xl: "300px",
        },
        display: "flex",
        flexDirection: "column",
        width: 320,
        background: "#fafafa80",
        justifyContent: "space-between",
      }}
    >
      <CardActionArea
        sx={{
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <Typography
              variant="h5"
              component="h5"
              sx={{
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "1.5",
                color: "#2E2E2E",
              }}
            >
              {committee.committeeName}
            </Typography>
          </Box>

          {/* Description */}
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            {committee.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="View all members">
              <Chip
                label={`${committee.memberCount || 0}`}
                size="large"
                color="success"
                variant="outlined"
                icon={<PeopleIcon />}
                onClick={handleView}
                sx={{ cursor: "pointer", padding: "5px" }}
              />
            </Tooltip>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MyComitteeCard;
