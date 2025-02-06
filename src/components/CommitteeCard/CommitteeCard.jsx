import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../Common/Modals/Delete/DeleteModal";
import toast from "react-hot-toast";
import axios from "axios";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  DeleteOutlineIcon,
  EditOutlinedIcon,
  PeopleIcon,
} from "../Common/Buttons/CustomIcon";
import { useDispatch } from "react-redux";

const CommitteeCard = ({ committee, setRefreshPage }) => {
  const [hover, setHover] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      dispatch(showLoading());
      await axios.delete(`/api/v1/committee/committees/${committee.id}`, {
        withCredentials: true,
      });
      toast.success("Committee deleted successfully!");
      setRefreshPage((prev) => prev + 1);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error deleting committee:", error);
      toast.error("Failed to delete committee. Please try again.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleView = () => {
    navigate(`/view-committee/${committee.id}`, {
      state: { committee },
    });
  };

  const handleChangeStatus = async () => {
    const updatedStatus = !committee.status;
    const payload = { committeeId: committee.id, status: updatedStatus };

    try {
      dispatch(showLoading());
      const response = await axios.put(
        `/api/v1/committee/change-status`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        setRefreshPage((prev) => prev + 1);
        toast.success("Committee status changed successfully!");
      } else {
        toast.error("Failed to change committee status. Please try again.");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing committee status:", error);
      toast.error("Failed to change committee status. Please try again.");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Card
      elevation={hover ? 2 : 1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 400,
        minHeight: 300,
        background: "#fafafa80",
        justifyContent: "space-between",
        m: 1,
      }}
      className="committee-card"
    >
      <CardActionArea>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 260,
            p: { xs: 1.5, sm: 2 },
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: { xs: 1, sm: 2 },
              gap: "10px",
            }}
          >
            <Typography
              variant="h5"
              component="h5"
              sx={{
                fontSize: { xs: "16px", sm: "18px" },
                fontWeight: 400,
                lineHeight: 1.3,
                color: "#2E2E2E",
              }}
            >
              {committee.name}
            </Typography>

            <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
              <Tooltip title="Delete">
                <DeleteOutlineIcon
                  onClick={handleOpen}
                  sx={{ cursor: "pointer", fontSize: { xs: "20px", sm: "24px" } }}
                  fontSize="medium"
                  color="error"
                  className="committee-delete"
                />
              </Tooltip>
              <Tooltip title="Edit">
                <EditOutlinedIcon
                  color="success"
                  onClick={() => setIsEditOpen(true)}
                  sx={{ cursor: "pointer", fontSize: { xs: "20px", sm: "24px" } }}
                  className="committee-edit"
                />
              </Tooltip>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "0.875rem", sm: "0.9rem" },
              lineHeight: 1.4,
              flexGrow: 1,
            }}
          >
            {committee.description}
          </Typography>

          {/* Avatar Group and Member Count */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: { xs: 1, sm: 2 },
            }}
          >
            <Tooltip title="View all members">
              <Chip
                label={`${committee.CommitteeMembers?.length || 0}`}
                size="large"
                color="success"
                variant="outlined"
                icon={<PeopleIcon />}
                onClick={handleView}
                sx={{
                  cursor: "pointer",
                  padding: { xs: "4px", sm: "5px" },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
                className="committee-view"
              />
            </Tooltip>
            <Tooltip title="Change Status">
              <Switch
                size="small"
                checked={!!committee.status}
                onChange={handleChangeStatus}
                sx={{
                  transform: { xs: "scale(0.8)", sm: "scale(1)" },
                }}
                className="committee-switch"
              />
            </Tooltip>
          </Box>
        </CardContent>
      </CardActionArea>

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