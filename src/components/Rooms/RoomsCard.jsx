import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CardActions,
  Chip,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PopupModals from "../Common/Modals/Popup/PopupModals";
import RoomGallery from "./RoomGallery";
import RoomAmenities from "./RoomAmenities";
import toast from "react-hot-toast";
import EditRoomForm from "./EditRoom";
import MeetingForm from "../../pages/MeetingPage/MeetingForm";
import DeleteModal from "../Common/Modals/Delete/DeleteModal";
import axios from "axios";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  CleaningServicesIcon,
  CollectionsIcon,
  DeleteIcon,
  EditOutlinedIcon,
  ExtensionIcon,
  FoodBankOutlinedIcon,
  Groups2OutlinedIcon,
  GroupsOutlinedIcon,
  LocationOnOutlinedIcon,
  QrCodeOutlinedIcon,
  VisibilityOutlinedIcon,
  AirlineSeatLegroomExtraOutlinedIcon,
  DesignServicesOutlinedIcon,
} from "../Common/Buttons/CustomIcon";
import RoomFoodBeverages from "./RoomFoodBeverages";
import BarCode from "../../pages/BarCodePage/BarCode";
import StatusSymbol from "../Common/Buttons/StatusSymbol";
import DeleteNotAllowModel from "../Common/Modals/Delete/DeleteNotAllowModel";
import NewPopUpModal from "../Common/Modals/Popup/NewPopUpModal";

const RoomsCard = ({
  room,
  setDeleteUpdateStatus,
  setRefreshPage,
  meetingCurrentData,
}) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isBookNowOpen, setIsBookNowOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isFoodBeverageOpen, setIsFoodBeverageOpen] = useState(false);
  const [isBarCodeOpen, setIsBarCodeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isNotDeleteOpen, setIsNotDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sanitationStatus, setSanitationStatus] = useState(
    room.sanitationStatus
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [urlData, setUrlData] = React.useState("Not Found");
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

  const handleFoodBeverage = () => {
    setIsFoodBeverageOpen(true);
  };

  const handleBarCode = () => {
    setIsBarCodeOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const handleNotDeleteClose = () => {
    setIsNotDeleteOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (room?.Meetings?.length > 0) {
      setIsNotDeleteOpen(true);
    } else {
      setIsDeleteOpen(true);
      setDeleteId(id);
    }
  };

  const handleSanitationStatusChange = async (event, roomId) => {
    // formik.setFieldValue("sanitationStatus", event.target.checked);
    if (user?.UserType?.isAdmin === "admin") {
      setSanitationStatus(event.target.checked);
      const response = await axios.put(
        `api/v1/rooms/update-sanitation-status/${roomId}`,
        {
          status: event.target.checked,
        }
      );
      toast.success("Sanitation status updated Successfully");
    }
  };

  const dispatch = useDispatch();
  const handleDeleteRoom = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(`/api/v1/rooms/${deleteId}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("Room deleted successfully");
      }
      dispatch(hideLoading());
    } catch (error) {
      console.error("Error deleting user:", error);
      // toast.error("Failed to delete user");
    } finally {
      setDeleteUpdateStatus(Math.random());
      handleDeleteClose();
      dispatch(hideLoading());
    }
  };

  const handleRoomEdit = () => {
    setIsEditOpen(true);
  };

  useEffect(() => {
    setUrlData(`${import.meta.env.VITE_BARCODE_URL}/rooms/${room?.id}`);
  }, [room]);

  return (
    <>
      <Paper
        className="room-card"
        elevation={hover ? 20 : 4}
        sx={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#fff",
          transformOrigin: "center",
          width: {
            xs: "100%",
            sm: 320,
            md: 320,
            xl: 320,
            lg: 320,
          },
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
            onClick={handleCardClick}
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              transformOrigin: "center",
              transform: "scale(1.001)",
              transition: "transform 0.4s ease-in-out",
              borderRadius: "8px 8px 0 0",

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
            minHeight: "200px",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            className="title"
            onClick={handleCardClick}
            sx={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "1.2rem",
              color: "black",
              cursor: "pointer",
              transition: "color 0.3s ease-out",
            }}
          >
            {room.name}
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
            <Tooltip title="Location">
              <LocationOnOutlinedIcon />
            </Tooltip>
            {room.Location?.locationName || "Unknown Location"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Tooltip title="Capacity">
                <GroupsOutlinedIcon />
              </Tooltip>
              {room.capacity} People
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Tooltip title="Sanitation Status">
                <CleaningServicesIcon />
              </Tooltip>{" "}
              {user.UserType.roomModule &&
                user.UserType.roomModule.split(",").includes("sanitization") ? (
                <FormControlLabel
                  className="room-sanitation"
                  control={
                    <Switch
                      checked={sanitationStatus}
                      name="sanitationStatus"
                      onChange={(event) =>
                        handleSanitationStatusChange(event, room?.id)
                      }
                    />
                  }
                />
              ) : (
                <FormControlLabel
                  control={
                    <Switch
                      checked={sanitationStatus}
                      name="sanitationStatus"
                    />
                  }
                />
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "capitalize",
              }}
            >
              <Tooltip title="Tolerance Period">
                <ExtensionIcon />
              </Tooltip>{" "}
              {room.tolerancePeriod} minutes
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Tooltip title="Room Status">
                <AirlineSeatLegroomExtraOutlinedIcon />
              </Tooltip>{" "}
              <StatusSymbol meetingCurrentData={meetingCurrentData} />
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "capitalize",
              }}
            >
              <Tooltip title="Tolerance Period">
                <DesignServicesOutlinedIcon />
              </Tooltip>{" "}
              {room.Service?.servicesName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
            </Typography>
          </Box>
        </Box>
        <CardActions sx={{ p: 0 }}>
          {user?.UserType?.isAdmin === "admin" ? (
            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              {user.UserType.roomModule &&
                user.UserType.roomModule.split(",").includes("view") && (
                  <Button
                    className="room-view"
                    fullWidth
                    variant="contained"
                    onClick={handleCardClick}
                    title="View Room"
                    sx={{
                      borderRadius: "0 0 0px 10px",
                      flex: 1,
                      minWidth: "40px",
                    }}
                    size="small"
                  >
                    <VisibilityOutlinedIcon color="white" className="cursor" />
                  </Button>
                )}
              {user.UserType.roomModule &&
                user.UserType.roomModule.split(",").includes("gallery") && (
                  <Button
                    className="room-gallery"
                    fullWidth
                    variant="contained"
                    title="Room Gallery"
                    onClick={handleGallery}
                    sx={{
                      background: "white",
                      color: "black",
                      flex: 1,
                      minWidth: "40px",
                    }}
                    size="small"
                  >
                    <CollectionsIcon color="white" className="cursor" />
                  </Button>
                )}
              {user.UserType.roomModule &&
                user.UserType.roomModule.split(",").includes("amenities") && (
                  <Button
                    className="room-amenities"
                    fullWidth
                    variant="contained"
                    title="Room Amenities"
                    onClick={handleAmenities}
                    sx={{
                      background: "white",
                      color: "black",
                      flex: 1,
                      minWidth: "40px",
                    }}
                    size="small"
                  >
                    <Groups2OutlinedIcon color="white" className="cursor" />
                  </Button>
                )}
              {user.UserType.roomModule &&
                user.UserType.roomModule
                  .split(",")
                  .includes("foodbeverage") && (
                  <Button
                    className="room-food"
                    fullWidth
                    variant="contained"
                    title="Room Food & Beverages"
                    onClick={handleFoodBeverage}
                    sx={{
                      background: "white",
                      color: "black",
                      flex: 1,
                      minWidth: "40px",
                    }}
                    size="small"
                  >
                    <FoodBankOutlinedIcon color="white" className="cursor" />
                  </Button>
                )}
              {user.UserType.roomModule &&
                user.UserType.roomModule.split(",").includes("barcode") && (
                  <Button
                    className="room-barcode"
                    fullWidth
                    variant="contained"
                    title="Barcode"
                    onClick={handleBarCode}
                    sx={{
                      background: "white",
                      color: "black",
                      flex: 1,
                      minWidth: "40px",
                    }}
                    size="small"
                  >
                    <QrCodeOutlinedIcon color="white" className="cursor" />
                  </Button>
                )}
              {user.UserType.roomModule &&
                user.UserType.roomModule.split(",").includes("edit") && (
                  <Button
                    className="room-edit"
                    variant="contained"
                    title="Edit Room"
                    onClick={handleRoomEdit}
                    sx={{
                      background: "white",
                      color: "black",
                      flex: 1,
                      minWidth: "40px",
                    }}
                    size="small"
                  >
                    <EditOutlinedIcon color="white" className="cursor" />
                  </Button>
                )}
              {user.UserType.roomModule &&
                user.UserType.roomModule.split(",").includes("delete") && (
                  <Button
                    className="room-delete"
                    fullWidth
                    title="Delete Room"
                    variant="contained"
                    onClick={() => handleDeleteClick(room.id)}
                    sx={{
                      borderRadius: "0 0 10px 0px",
                      background: "red",
                      flex: 1,
                      minWidth: "40px",
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </Button>
                )}
            </Box>
          ) : (
            <Box
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={handleCardClick}
                sx={{
                  borderRadius: "0",
                }}
                className="room-user-view"
              >
                View More
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleBookNowClick}
                sx={{
                  borderRadius: "0",
                  bgcolor: "red",
                }}
                className="room-user-book-now"
              >
                Book Now
              </Button>
            </Box>
          )}
        </CardActions>
      </Paper>


      <NewPopUpModal
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        title={"Room Gallery"}
        modalBody={<RoomGallery room={room} />}
      />
      <NewPopUpModal
        isOpen={isAmenitiesOpen}
        setIsOpen={setIsAmenitiesOpen}
        title={"Room Amenities"}
        modalBody={<RoomAmenities room={room} />}
      />
      <NewPopUpModal
        isOpen={isFoodBeverageOpen}
        setIsOpen={setIsFoodBeverageOpen}
        title={"Room Food & Beverage"}
        modalBody={<RoomFoodBeverages room={room} />}
      />

      <NewPopUpModal
        isOpen={isBarCodeOpen}
        setIsOpen={setIsBarCodeOpen}
        title={"Room Barcode"}
        modalBody={<BarCode urlData={urlData} />}
      />
      <NewPopUpModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Room Edit"}
        modalBody={
          <EditRoomForm
            room={room}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
          />
        }
      />
      <NewPopUpModal
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
      <DeleteNotAllowModel
        open={isNotDeleteOpen}
        onClose={handleNotDeleteClose}
        title="Room deletion confirmation"
      />
    </>
  );
};

export default RoomsCard;
