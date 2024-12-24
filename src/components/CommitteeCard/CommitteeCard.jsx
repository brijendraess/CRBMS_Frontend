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
import toast from "react-hot-toast";
import axios from "axios";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const CommitteeCard = ({ committee, onDelete, setRefreshPage, heading }) => {
  const [hover, setHover] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    onDelete(committee.id);
  };

  const handleView = () => {
    navigate(`/view-committee/${committee.id}`, {
      state: { committee, heading },
    });
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    const payload = { committeeId: id, status: updatedStatus };

    try {
      showLoading();
      const response = await axios.put(
        `/api/v1/committee/change-status`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        setRefreshPage((prev) => prev + 1);
        hideLoading();
        toast.success("Committee status changed successfully!");
      } else {
        toast.error("Failed to change committee status. Please try again.");
      }
    } catch (error) {
      console.error("Error changing committee status:", error);
      toast.error("Failed to change committee status. Please try again.");
      hideLoading();
    }
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
                  <Switch
                    size="small"
                    checked={!!committee.status}
                    onChange={() =>
                      handleChangeStatus(committee.id, !!committee.status)
                    }
                  />
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
              // justifyContent: "space-between",
              justifyContent: "flex-end",
            }}
          >
            {/* <AvatarGroup
              max={4}
              sx={{
                "& .MuiAvatar-root": {
                  width: "30px",
                  height: "30px",
                },
              }}
            >
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
            </AvatarGroup> */}
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
