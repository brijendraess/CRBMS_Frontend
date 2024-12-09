import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CardActions,
  Chip,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CollectionsIcon from "@mui/icons-material/Collections";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import PopupModals from "../Common Components/Modals/Popup/PopupModals";
import RoomGallery from "./RoomGallery";
import RoomAmenities from "./RoomAmenities";
import toast from "react-hot-toast";
import EditRoomForm from "./EditRoom";
import MeetingForm from "../../pages/MeetingPage/MeetingForm";
import DeleteModal from "../Common Components/Modals/Delete/DeleteModal";
import axios from "axios";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const RoomsCard = ({ room, setDeleteUpdateStatus }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isBookNowOpen, setIsBookNowOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const handleCardClick = () => {
    navigate(`/rooms/${room.id}`);
  };

  const handleBookNowClick = () => {
    setIsBookNowOpen(true);
  };

  const handleGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleAmenities = () => {
    setIsAmenitiesOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const handleDeleteClick = (id) => {
    setIsDeleteOpen(true);
    setDeleteId(id);
  };

  const handleDeleteRoom = async () => {
    try {
      showLoading();
      const response = await axios.delete(`/api/v1/rooms/${deleteId}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("Room deleted successfully");
      }
      hideLoading();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteUpdateStatus(Math.random());
      hideLoading();
      handleDeleteClose();
    }
  };

  const handleRoomEdit = () => {
    setIsEditOpen(true);
  };
  return (
    <>
      <Paper
        elevation={hover ? 20 : 4}
        sx={{
          position: "relative",
          borderRadius: "15px",
          overflow: "hidden",
          backgroundColor: "#fff",
          transformOrigin: "center",
          transition: "all 0.4s ease-in-out",
          ":hover": {
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
            "& img": {
              transform: "scale(1.1)",
            },
            "& .title": {
              color: "#28666e",
            },
          },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Image Section */}
        <Box
          component="figure"
          sx={{
            margin: 0,
            padding: 0,
            aspectRatio: "16 / 9",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={`${import.meta.env.VITE_API_URL}/${room.roomImagePath}`}
            alt={room.roomImagePath}
            sx={{
              width: "100%",
              height: "100%",
              transformOrigin: "center",
              transform: "scale(1.001)",
              transition: "transform 0.4s ease-in-out",
            }}
          />
        </Box>

        {/* Card Content */}
        <Box
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between"
            gap: 1,
            height: "250px",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            className="title"
            sx={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "1.2rem",
              color: "black",
              transition: "color 0.3s ease-out",
            }}
          >
            {room.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <GroupsOutlinedIcon />
            {room.capacity} People
          </Typography>

          {/* Room Location */}
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocationOnOutlinedIcon />
            {room.Location.locationName || "Unknown Location"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "capitalize",
            }}
          >
            sanitationStatus:{room.sanitationStatus ? "Yes" : "No"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "capitalize",
            }}
          >
            Capacity:{room.capacity}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "capitalize",
            }}
          >
            Tolerance Period:{room.tolerancePeriod}
          </Typography>
        </Box>
        <CardActions sx={{ p: 0 }}>
          {user?.isAdmin ? (
            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={handleCardClick}
                title="View Room"
                sx={{
                  borderRadius: "0 0 0px 10px",
                  flex: 1,
                }}
                size="small"
              >
                <VisibilityOutlinedIcon color="white" className="cursor" />
              </Button>
              <Button
                fullWidth
                variant="contained"
                title="Room Gallery"
                onClick={handleGallery}
                sx={{
                  background: "white",
                  color: "black",
                  flex: 1,
                  minWidth:"47px",
                }}
                size="small"
              >
                <CollectionsIcon color="white" className="cursor" />
              </Button>
              <Button
                fullWidth
                variant="contained"
                title="Room Amenities"
                onClick={handleAmenities}
                sx={{
                  background: "white",
                  color: "black",
                  flex: 1,
                  minWidth:"47px",
                }}
                size="small"
              >
                <Groups2OutlinedIcon color="white" className="cursor" />
              </Button>
              <Button
                variant="contained"
                title="Edit Room"
                onClick={handleRoomEdit}
                sx={{
                  background: "white",
                  color: "black",
                  flex: 1,
                  minWidth:"47px",
                }}
                size="small"
              >
                <EditOutlinedIcon color="white" className="cursor" />
              </Button>
              <Button
                fullWidth
                title="Delete Room"
                variant="contained"
                onClick={() => handleDeleteClick(room.id)}
                sx={{
                  borderRadius: "0 0 10px 0px",
                  background: "red",
                  flex: 1,
                }}
                size="small"
              >
                <DeleteIcon />
              </Button>
            </Box>
          ) : (
            <>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCardClick}
                sx={{
                  borderRadius: "0 0 12px 12px",
                }}
              >
                View More
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleBookNowClick}
                sx={{
                  borderRadius: "0 0 12px 12px",
                }}
              >
                Book Now
              </Button>
            </>
          )}
        </CardActions>
      </Paper>
      <PopupModals
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        title={"Room Gallery"}
        modalBody={<RoomGallery room={room} />}
      />
      <PopupModals
        isOpen={isAmenitiesOpen}
        setIsOpen={setIsAmenitiesOpen}
        title={"Room Amenities"}
        modalBody={<RoomAmenities room={room} setIsAmenitiesOpen={setIsAmenitiesOpen} />}
      />
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Room Edit"}
        modalBody={<EditRoomForm room={room} />}
      />
      <PopupModals
        isOpen={isBookNowOpen}
        setIsOpen={setIsBookNowOpen}
        title={"Add New Meeting"}
        modalBody={<MeetingForm room={room} />}
      />
      <DeleteModal
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onDeleteConfirm={handleDeleteRoom}
        button={"Delete"}
        title="room"
      />
    </>
  );
};

export default RoomsCard;
