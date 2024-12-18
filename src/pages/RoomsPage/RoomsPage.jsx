import React, { useState, useEffect } from "react";
import RoomsCard from "../../components/Rooms/RoomsCard";
import { Box, styled, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";
import "./RoomsPage.css";
import { MainContainer, PaperWrapper } from "../../Style";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import AddRoomForm from "./AddRoomForm";
import RoomFilter from "./RoomFilter";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";

import { useSelector } from "react-redux";
import { AddOutlinedIcon } from "../../components/Common Components/CustomButton/CustomIcon";

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

  const fetchRoomsData = async () => {
    try {
      const response = await axios.get(`api/v1/rooms/all-rooms`, {
        params: {
          filterDate: selectedDate,
          filterStartTime:meetingStartTime,
          filterEndingTime: meetingEndingTime,
          filterAmenities:selectedAmenities,
          filterCapacity:capacity,
        },
      });
      setRoomsData(response.data.data.rooms);
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error("Error fetching room data:", error);
    }
  };
  
  // Handle Start Time Change
  const handleStartTimeChange = (newStartTime) => {
    setMeetingStartTime(newStartTime);

    // Auto-select one hour later for ending time
   // const autoEndTime = newStartTime.add(1, "hour");
   // setMeetingEndingTime(autoEndTime);
  };

  // Fetch amenities data
  const fetchAmenitiesData = async () => {
    try {
      const response = await axios.get("/api/v1/amenity/get-all-amenities");
      const names = response.data.data.roomAmenities.map((item) => item.name);
      setAmenitiesList(names);
    } catch (error) {
      console.error("Error fetching amenities data:", error);
    }
  };

  useEffect(() => {
    fetchAmenitiesData();
  },[])

  useEffect(() => {
    fetchRoomsData();
  }, [deleteUpdateStatus,refreshPage,selectedDate,meetingStartTime,selectedAmenities,capacity]);

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

  return (
    <>
      <PaperWrapper>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              marginRight: "20px",
              fontSize: "22px",
              fontWeight: 500,
              lineHeight: 1.5,
              color: "#2E2E2E",
            }}
          >
            Conference Rooms
          </Typography>
          {user?.isAdmin ? (
            <CustomButton
              onClick={() => setIsAddOpen(true)}
              title={"Add New Room"}
              placement={"left"}
              Icon={AddOutlinedIcon}
              fontSize={"medium"}
              background={"rgba(3, 176, 48, 0.68)"}
            />
          ) : (
            ""
          )}
        </Box>
        <MainContainer>
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
          <div className="cardBox row w-100">
            {
            roomsData&& roomsData.map((room, index) => (
              <div
                className="col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 mb-4"
                key={index}
              >
                <RoomsCard
                  room={room}
                  setRefreshPage={setRefreshPage}
                  setDeleteUpdateStatus={setDeleteUpdateStatus}
                />
              </div>
            ))}
            {roomsData.length===0 &&(<div
                className="col-xs-12 col-sm-6 col-md-12 col-lg-12 col-xl-12 text-center mb-4" >
            <p>No Room Found</p>
            </div>)}
          </div>
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
