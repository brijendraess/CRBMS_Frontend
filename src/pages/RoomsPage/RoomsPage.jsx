import React, { useState, useEffect } from "react";
import RoomsCard from "../../components/Rooms/RoomsCard";
import { Box, Grid2, useMediaQuery } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import "./RoomsPage.css";
import { MainContainer, PaperWrapper } from "../../Style";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import AddRoomForm from "./AddRoomForm";
import RoomFilter from "./RoomFilter";

import { useDispatch, useSelector } from "react-redux";
import { AddOutlinedIcon } from "../../components/Common/CustomButton/CustomIcon";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import ResponsiveFilter from "../../components/Responsive/Filter/ResponsiveFilter";

const RoomsPage = () => {
  const [roomsData, setRoomsData] = useState([]); // State for rooms data
  const [capacity, setCapacity] = useState("");
  const [isAvailable, setIsAvailable] = useState("all"); // Default to 'all'
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(); // For date filter
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteUpdateStatus, setDeleteUpdateStatus] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState(null); // For start time filter
  const [meetingEndingTime, setMeetingEndingTime] = useState(null); // For end time filter
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fetchRoomsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`api/v1/rooms/all-rooms`, {
        params: {
          filterDate: selectedDate,
          filterStartTime: meetingStartTime,
          filterEndingTime: meetingEndingTime,
          filterAmenities: selectedAmenities,
          filterCapacity: capacity,
        },
      });
      setRoomsData(response.data.data.rooms);
      dispatch(hideLoading());
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error("Error fetching room data:", error);
    }
  };

  // Handle Start Time Change
  const handleStartTimeChange = (newStartTime) => {
    setMeetingStartTime(newStartTime);
  };

  // Fetch amenities data
  const fetchAmenitiesData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/amenity/get-all-amenities");
      const names = response.data.data.roomAmenities.map((item) => item.name);
      setAmenitiesList(names);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching amenities data:", error);
    }
  };

  useEffect(() => {
    fetchAmenitiesData();
  }, []);

  useEffect(() => {
    fetchRoomsData();
  }, [
    deleteUpdateStatus,
    refreshPage,
    selectedDate,
    meetingStartTime,
    selectedAmenities,
    capacity,
  ]);

  // Handle capacity change
  const handleChangeCapacity = (event) => {
    setCapacity(event.target.value);
  };

  // Handle amenities change
  const handleChangeAmenities = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAmenities(typeof value === "string" ? value.split(",") : value);
  };

  // Handle availability change
  const handleAvailabilityChange = (event) => {
    setIsAvailable(event.target.value);
  };

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <PaperWrapper>
        <PageHeader
          heading={"Rooms"}
          icon={AddOutlinedIcon}
          func={setIsAddOpen}
          title={"Add New Room"}
        >
          {isSmallScreen ? (
            <ResponsiveFilter
              handleChangeAmenities={handleChangeAmenities}
              selectedAmenities={selectedAmenities}
              amenitiesList={amenitiesList}
              handleStartTimeChange={handleStartTimeChange}
              meetingStartTime={meetingStartTime}
              setMeetingEndingTime={setMeetingEndingTime}
              meetingEndingTime={meetingEndingTime}
              handleChangeCapacity={handleChangeCapacity}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              capacity={capacity}
            />
          ) : (
            ""
          )}
        </PageHeader>
        <MainContainer>
          {isSmallScreen ? (
            ""
          ) : (
            <RoomFilter
              handleChangeAmenities={handleChangeAmenities}
              selectedAmenities={selectedAmenities}
              amenitiesList={amenitiesList}
              handleStartTimeChange={handleStartTimeChange}
              meetingStartTime={meetingStartTime}
              setMeetingEndingTime={setMeetingEndingTime}
              meetingEndingTime={meetingEndingTime}
              handleChangeCapacity={handleChangeCapacity}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              capacity={capacity}
            />
          )}

          <Grid2
            container
            columnSpacing={3}
            rowSpacing={3}
            sx={{
              borderRadius: "20px",
              position: "relative",
              alignItems: "center",
              justifyContent: {
                xs: "center",
                sm: "center",
                md: "start",
              },
            }}
          >
            {roomsData &&
              roomsData.map((room, index) => (
                <Grid2 item xs={12} sm={6} md={4} lg={3} key={index}>
                  <RoomsCard
                    room={room}
                    setRefreshPage={setRefreshPage}
                    setDeleteUpdateStatus={setDeleteUpdateStatus}
                  />
                </Grid2>
              ))}
          </Grid2>

          {roomsData.length === 0 && (
            <div className="col-xs-12 col-sm-6 col-md-12 col-lg-12 col-xl-12 text-center mb-4">
              <p>No Room Found</p>
            </div>
          )}
        </MainContainer>
      </PaperWrapper>
      <PopupModals
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={"Add Room"}
        modalBody={
          <AddRoomForm
            setDeleteUpdateStatus={setDeleteUpdateStatus}
            setIsAddOpen={setIsAddOpen}
          />
        }
      />
    </>
  );
};

export default RoomsPage;
