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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PopupModals from "../Common Components/Modals/Popup/PopupModals";
import AddCommitteeForm from "../../pages/CommitteePage/AddCommitteeForm";
import DeleteModal from "../Common Components/Modals/Delete/DeleteModal";

const CommitteeCard = ({ committee, onDelete, setRefreshPage }) => {
  const [hover, setHover] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Delete confirmation modal handlers
  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  // Delete request
  const handleDelete = async () => {
    try {
      // Call API to delete committee
      onDelete(committee.id);
      toast.success("Committee deleted successfully!");
    } catch (error) {
      console.error("Error deleting committee:", error);
      toast.error("Failed to delete committee. Please try again.");
    }
  };

  // Navigate to view committee
  const handleView = () => {
    navigate(`/view-committee/${committee.id}`, { state: { committee } });
  };

  return (
    <Card
      elevation={hover ? 2 : 1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        height: "auto",
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
                <Tooltip title="Delete">
                  <DeleteOutline
                    onClick={() => handleOpen(committee.id)}
                    sx={{ cursor: "pointer" }}
                    fontSize="medium"
                    color="error"
                  />
                </Tooltip>
                <Tooltip title="Edit">
                  <EditOutlinedIcon
                    color="success"
                    onClick={() => setIsEditOpen(true)}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* Description */}
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            {committee.description}
          </Typography>

          {/* Avatar Group and Member Count */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AvatarGroup max={4}>
              {(committee.CommitteeMembers || []).map((member, index) => (
                <Tooltip
                  key={index}
                  title={member.User?.fullname || "Unknown"}
                  arrow
                >
                  <Avatar
                    alt={member.User?.fullname || "Unknown"}
                    src={
                      member.User?.avatarPath
                        ? `${import.meta.env.VITE_API_URL}/${member.User.avatarPath}`
                        : "https://icon-library.com/images/no-image-available-icon/no-image-available-icon-2.jpg"
                    }
                    sx={{
                      bgcolor: "primary.main",
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    {member.User?.fullname
                      ? member.User.fullname.charAt(0)
                      : "?"}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>

            {/* View All Members Button */}
            <Tooltip title="View all members">
              <Chip
                label={`${committee.CommitteeMembers?.length || 0}`}
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

      {/* Edit Modal */}
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Committee"}
        modalBody={
          <AddCommitteeForm
            committeeId={committee.id}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
          />
        }
      />

      {/* Delete Modal */}
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
