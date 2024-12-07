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
import {
  PersonAdd as PersonAddIcon,
  DeleteOutline,
  People as PeopleIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PopupModals from "../Common Components/Modals/Popup/PopupModals";
import AddCommitteeForm from "../../pages/CommitteePage/AddCommitteeForm";
import DeleteModal from "../Common Components/Modals/Delete/DeleteModal";

const CommitteeCard = ({ committee, onDelete }) => {
  const [hover, setHover] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleDelete = async () => {
    try {
      showLoading();
      await axios.delete(`/api/v1/committee/committees/${committee.id}`);
      onDelete(committee.id);
      toast.success("Committee deleted successfully!");
      hideLoading();
    } catch (error) {
      console.error("Error deleting committee:", error);
      toast.error("Failed to delete committee. Please try again.");
    }
  };

  const handleView = () => {
    navigate(`/view-committee/${committee.id}`, { state: { committee } });
  };

  return (
    <Card
      elevation={hover ? 2 : 1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        height: "400",
        display: "flex",
        flexDirection: "column",
        width: "32%",
        background: "#fafafa80",
      }}
    >
      <CardActionArea
        sx={{
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "2px",
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
              {committee.name}
            </Typography>

            {user?.isAdmin && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Change Status">
                  <Switch size="small" defaultChecked />
                </Tooltip>
                <Tooltip title="Delete Committee">
                  <DeleteOutline
                    onClick={handleOpen}
                    sx={{ cursor: "pointer" }}
                    fontSize="medium"
                    color="error"
                  />
                </Tooltip>
                <Tooltip title="Edit Committee">
                  <EditOutlinedIcon
                    color="success"
                    onClick={() => setIsEditOpen(true)}
                  />
                </Tooltip>
              </Box>
            )}
          </Box>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            {committee.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AvatarGroup max={4}>
              {(committee.members || []).map((member, index) => (
                <Tooltip
                  key={index}
                  title={
                    <Box
                      component="img"
                      src={`http://localhost:9000/${member?.avatarPath || "https://icon-library.com/images/no-image-available-icon/no-image-available-icon-2.jpg"}`}
                      alt={member?.fullname || "Unknown"}
                      sx={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
                      }}
                    />
                  }
                  slotProps={{
                    tooltip: {
                      sx: {
                        padding: 0,
                        bgcolor: "transparent",
                        boxShadow: "none",
                      },
                    },
                  }}
                  placement="top"
                  arrow
                >
                  <Avatar
                    alt={member?.fullname || "Unknown"}
                    src={member?.avatar || ""}
                    sx={{
                      bgcolor: "primary.main",
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    {member?.fullname ? member.fullname.charAt(0) : "?"}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            <Tooltip title="View all members">
              <Chip
                label={`${committee.memberCount}`}
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
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Committee"}
        modalBody={<AddCommitteeForm committeeId={committee.id} />}
      />
      <DeleteModal
        open={open}
        onClose={handleClose}
        onDeleteConfirm={handleDelete}
        title="committee"
        button="Delete"
      />
    </Card>
  );
};

export default CommitteeCard;
