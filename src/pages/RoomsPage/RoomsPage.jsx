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
import { AddOutlinedIcon } from "../../components/Common/Buttons/CustomIcon";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import ResponsiveFilter from "../../components/Responsive/Filter/ResponsiveFilter";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";
import { useLocation } from "react-router-dom";
import { handleStartGuide } from "../../utils/utils";

const RoomsPage = () => {
  const [roomsData, setRoomsData] = useState([]); // State for rooms data
  const [meetingCurrentData, setMeetingCurrentData] = useState([]); // State for rooms data
  const [capacity, setCapacity] = useState("");
  const [isAvailable, setIsAvailable] = useState("all"); // Default to 'all'
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedFoodBeverage, setSelectedFoodBeverage] = useState([]);
  const [selectedDate, setSelectedDate] = useState(); // For date filter
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [foodBeverageList, setFoodBeverageList] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteUpdateStatus, setDeleteUpdateStatus] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState(null); // For start time filter
  const [meetingEndingTime, setMeetingEndingTime] = useState(null); // For end time filter
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const location = useLocation();
  const isAdmin = user?.UserType?.isAdmin === 'admin';

  const fetchRoomsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`api/v1/rooms/all-rooms`, {
        params: {
          filterDate: selectedDate,
          filterStartTime: meetingStartTime,
          filterEndingTime: meetingEndingTime,
          filterAmenities: selectedAmenities,
          filterLocation: selectedLocation,
          filterServices: selectedServices,
          filterFoodBeverage: selectedFoodBeverage,
          filterCapacity: capacity,
        },
      });
      setRoomsData(response.data.data.rooms);
      dispatch(hideLoading());
    } catch (error) {
      // toast.error("Something Went Wrong");
      console.error("Error fetching room data:", error);
    }
  };

  const fetchMeetingData = async () => {
    try {
      const response = await axios.get(`api/v1/rooms/all-current-meeting`);
      setMeetingCurrentData(response.data.data.result);
    } catch (error) {
      // toast.error("Something Went Wrong");
      console.error("Error fetching current meeting data:", error);
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
      const response = await axios.get("/api/v1/amenity/get-all-active-amenities");
      const names = response.data.data.result.map((item) => item.name);
      setAmenitiesList(names);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching amenities data:", error);
    }
  };

  const fetchLocationData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/location/activeLocations");
      const names = response.data.data.result.map((item) => item.locationName);
      setLocationList(names);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching location data:", error);
    }
  };

  const fetchServicesData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/services/active");
      const names = response.data.data.result.map((item) => item.servicesName);
      setServicesList(names);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching services data:", error);
    }
  };

  const fetchFoodBeverageData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/food-beverages/active-food-beverage");
      const names = response.data.data.result.map((item) => item.foodBeverageName);
      setFoodBeverageList(names);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching food and beverage data:", error);
    }
  };

  useEffect(() => {
    fetchAmenitiesData();
    fetchServicesData();
    fetchFoodBeverageData();
    fetchLocationData();
  }, []);

  useEffect(() => {
    fetchMeetingData();
    const timer = setTimeout(fetchMeetingData, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchRoomsData();
  }, [
    deleteUpdateStatus,
    refreshPage,
    selectedDate,
    meetingStartTime,
    selectedAmenities,
    selectedLocation,
    selectedServices,
    selectedFoodBeverage,
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

  // Handle Location change
  const handleChangeLocation = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLocation(typeof value === "string" ? value.split(",") : value);
  };

  // Handle Location change
  const handleChangeServices = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedServices(typeof value === "string" ? value.split(",") : value);
  };

  // Handle Location change
  const handleChangeFoodBeverage = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFoodBeverage(typeof value === "string" ? value.split(",") : value);
  };

  // Handle availability change
  const handleAvailabilityChange = (event) => {
    setIsAvailable(event.target.value);
  };

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenRooms");
      if(user && !user.lastLoggedIn && (hasSeenTour === "false" || hasSeenTour === null)){
        handleStartGuide(location, isSmallScreen, isAdmin);
        localStorage.setItem("hasSeenRooms", "true");
      }
  }, [])
  
  return (
    <>
      <PaperWrapper>
        <PageHeader
          heading={"Rooms"}
          icon={AddOutlinedIcon}
          func={setIsAddOpen}
          title={"Add New Room"}
          nameOfTheClass="add-room"
          statusIcon={user.UserType.roomModule && user.UserType.roomModule.split(",").includes("add")}
        >
          {isSmallScreen ? (
            <ResponsiveFilter
              handleChangeAmenities={handleChangeAmenities}
              handleChangeLocation={handleChangeLocation}
              handleChangeServices={handleChangeServices}
              handleChangeFoodBeverage={handleChangeFoodBeverage}
              selectedAmenities={selectedAmenities}
              selectedLocation={selectedLocation}
              selectedServices={selectedServices}
              selectedFoodBeverage={selectedFoodBeverage}
              amenitiesList={amenitiesList}
              locationList={locationList}
              servicesList={servicesList}
              foodBeverageList={foodBeverageList}
              handleStartTimeChange={handleStartTimeChange}
              meetingStartTime={meetingStartTime}
              setMeetingEndingTime={setMeetingEndingTime}
              meetingEndingTime={meetingEndingTime}
              handleChangeCapacity={handleChangeCapacity}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              capacity={capacity}
              nameOfTheFilterClass="room-filter-responsive"
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
              handleChangeLocation={handleChangeLocation}
              handleChangeServices={handleChangeServices}
              handleChangeFoodBeverage={handleChangeFoodBeverage}
              selectedAmenities={selectedAmenities}
              selectedLocation={selectedLocation}
              selectedServices={selectedServices}
              selectedFoodBeverage={selectedFoodBeverage}
              amenitiesList={amenitiesList}
              locationList={locationList}
              servicesList={servicesList}
              foodBeverageList={foodBeverageList}
              handleStartTimeChange={handleStartTimeChange}
              meetingStartTime={meetingStartTime}
              setMeetingEndingTime={setMeetingEndingTime}
              meetingEndingTime={meetingEndingTime}
              handleChangeCapacity={handleChangeCapacity}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              capacity={capacity}
              nameOfTheFilterClass="room-filter"
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
                sm: "space-evenly",
                md: "space-evenly",
              },
            }}
          >
            {roomsData &&
              roomsData.map((room, index) => (
                <Grid2 item xs={12} sm={6} md={4} lg={3} key={index}>
                  <RoomsCard
                    room={room}
                    setRefreshPage={setRefreshPage}
                    meetingCurrentData={
                      meetingCurrentData
                        ? meetingCurrentData.filter(
                          (data) => data?.roomId === room?.id
                        )
                        : []
                    }
                    setDeleteUpdateStatus={setDeleteUpdateStatus}
                    selectedFilterMeetingDate={selectedDate ? selectedDate : null}
                    selectedFilterMeetingStartTime={meetingStartTime ? meetingStartTime : null}
                    selectedFilterMeetingEndingTime={meetingEndingTime ? meetingEndingTime : null}
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
      <NewPopUpModal
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
