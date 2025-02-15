import React, { useEffect, useState } from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import { PaperWrapper } from "../../Style";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import { handleStartGuide } from "../../utils/utils";

import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import { GroupsOutlinedIcon, Groups2OutlinedIcon, DesignServicesOutlinedIcon } from "../../components/Common/Buttons/CustomIcon";
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import PersonIcon from '@mui/icons-material/Person';
import { GpsFixedOutlined } from "@mui/icons-material";



const ReportPage = () => {
  const [counts, setCounts] = useState({
    users: 0,
    amenities: 0,
    food: 0,
    rooms: 0,
    committee: 0,
    locations: 0,
    services: 0,
    allMeeting: 0,
  });
  const [latest, setLatest] = useState({
    users: "",
    amenities: "",
    food: "",
    rooms: "",
    committee: "",
    locations: "",
    services: "",
    allMeeting: "",
  });

  const [meetingCount, setMeetingCount] = useState(0);
  const [cancelledMeetingCount, setCancelledMeetingCount] = useState(0);
  const [completedMeetingCount, setCompletedMeetingCount] = useState(0);

  const [meetingFilter, setMeetingFilter] = useState("Today");
  const [cancelledMeetingFilter, setCancelledMeetingFilter] = useState("Today");
  const [completedMeetingFilter, setCompletedMeetingFilter] = useState("Today");

  const [roomData, setRoomData] = useState([]);
  const [organizerData, setOrganizerData] = useState([]);
  const { user } = useSelector((state) => state.user);

  const location = useLocation();
  const isAdmin = user?.UserType?.isAdmin === 'admin';
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenReports");
      if(user && !user.lastLoggedIn && (hasSeenTour === "false" || hasSeenTour === null)){
        handleStartGuide(location, isSmallScreen, isAdmin);
        localStorage.setItem("hasSeenReports", "true");
      }
  }, [])

  const dispatch = useDispatch();

  const fetchCounts = async () => {
    try {
      dispatch(showLoading());
      const results = await Promise.allSettled([
        axios.get("/api/v1/report/user-count"),
        axios.get("/api/v1/report/amenity-count"),
        axios.get("/api/v1/report/food-count"),
        axios.get("/api/v1/report/room-count"),
        axios.get("/api/v1/report/committee-count"),
        axios.get("/api/v1/report/location-count"),
        axios.get("/api/v1/report/service-count"),
        axios.get("/api/v1/report/all-meeting-count"),
      ]);
      const [
        userData,
        amenityData,
        foodData,
        roomData,
        committeeData,
        locationData,
        serviceData,
        allMeetingData
      ] = results;
      console.log(results);

      setLatest({
        users:
          userData.status === "fulfilled"
            ? userData.value.data.data.latestUser.fullname
            || ""
            : "",
        amenities:
          amenityData.status === "fulfilled"
            ? amenityData.value.data.data.latestAmenity.name || ""
            : "",
        food:
          foodData.status === "fulfilled"
            ? foodData.value.data.data.latestFoodBeverage.foodBeverageName
            || ""
            : "",
        rooms:
          roomData.status === "fulfilled"
            ? roomData.value.data.data.latestRoom.name || ""
            : "",
        committee:
          committeeData.status === "fulfilled"
            ? committeeData.value.data.data.latestCommittee.name || ""
            : "",
        locations:
          locationData.status === "fulfilled"
            ? locationData.value.data.data.latestLocation.locationName || ""
            : "",
        services:
          serviceData.status === "fulfilled"
            ? serviceData.value.data.data.latestServices.servicesName || ""
            : "",
        allMeeting:
          allMeetingData.status === "fulfilled"
            ? allMeetingData.value.data.data.latestMeeting.subject || ""
            : "",
      })
      setCounts({
        users:
          userData.status === "fulfilled"
            ? userData.value.data.data.count || 0
            : 0,
        amenities:
          amenityData.status === "fulfilled"
            ? amenityData.value.data.data.count || 0
            : 0,
        foods:
          foodData.status === "fulfilled"
            ? foodData.value.data.data.count || 0
            : 0,
        rooms:
          roomData.status === "fulfilled"
            ? roomData.value.data.data.count || 0
            : 0,
        committee:
          committeeData.status === "fulfilled"
            ? committeeData.value.data.data.count || 0
            : "",
        locations:
          locationData.status === "fulfilled"
            ? locationData.value.data.data.count || 0
            : "",
        services:
          serviceData.status === "fulfilled"
            ? serviceData.value.data.data.count || 0
            : "",
        allMeeting:
          allMeetingData.status === "fulfilled"
            ? allMeetingData.value.data.data.count || 0
            : "",

      });
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Unexpected error fetching counts:", error);
    }
  };

  const handleMeetingSelect = async (option) => {
    setMeetingFilter(option);
    await fetchMeetingCounts(option, setMeetingCount, "/api/v1/report/meeting-count");
  };

  const handleCancelledMeetingSelect = async (option) => {
    setCancelledMeetingFilter(option);
    await fetchCancelledMeetingCounts(option, setCancelledMeetingCount, "/api/v1/report/meeting-count");
  };

  const handleCompletedMeetingSelect = async (option) => {
    setCompletedMeetingFilter(option);
    await fetchCompletedMeetingCounts(option, setCompletedMeetingCount, "/api/v1/report/meeting-count");
  };

  const fetchRoomAndOrganizerData = async () => {
    try {
      const response = await axios.get(`/api/v1/report/stats`);

      const rooms = response?.data?.data?.roomCount;
      const organizers = response?.data?.data?.organizerCount;

      const formatedRooms = rooms.map((room) => ({
        id: room?.roomData?.id,
        roomName: room?.roomData?.name,
        capacity: room?.roomData?.capacity,
        count: room?.count,
        percentage: room?.roomPercentage
      }))

      const formatedOrganizers = organizers.map((organizer) => ({
        id: organizer?.userData?.id,
        name: organizer?.userData?.fullname,
        email: organizer?.userData?.email,
        username: organizer?.userData?.userName,
        percentage: organizer?.organizerPercentage,
        count: organizer?.count
      }))

      setRoomData(formatedRooms);
      setOrganizerData(formatedOrganizers);
    }
    catch (error) {
      console.error("Error fetching:", error);
    }
  }

  const fetchMeetingCounts = async (option, setCount) => {
    try {
      let queryParam = `?filter=${option}`;
      const response = await axios.get(`/api/v1/report/meeting-count${queryParam}`);
      console.log(response);

      setCount(response?.data?.data?.meetingCount || 0);
    } catch (error) {
      console.error("Error fetching meeting count:", error);
    }
  };

  const fetchCompletedMeetingCounts = async (option, setCount) => {
    try {
      let queryParam = `?filter=${option}`;
      const response = await axios.get(`/api/v1/report/meeting-count${queryParam}`);
      setCount(response?.data?.data?.completedMeetingCount || 0);
    } catch (error) {
      console.error("Error fetching meeting count:", error);
    }
  };


  const fetchCancelledMeetingCounts = async (option, setCount) => {
    try {
      let queryParam = `?filter=${option}`;
      const response = await axios.get(`/api/v1/report/meeting-count${queryParam}`);
      setCount(response?.data?.data?.cancelledMeetingCount || 0);
    } catch (error) {
      console.error("Error fetching meeting count:", error);
    }
  };

  const roomColumns = [
    {
      field: "roomName",
      headerName: "Most Used Room",
      // width: 260,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "count",
      headerName: "Used Count",
      width: 150,

      headerClassName: "super-app-theme--header",
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
  ];

  const organizerColumns = [
    {
      field: "name",
      headerName: "Most Frequent Organizer",
      // width: 225,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 120,
      headerClassName: "super-app-theme--header",
    },
  ];

  useEffect(() => {
    fetchCounts();
    fetchMeetingCounts(meetingFilter, setMeetingCount);
    fetchCancelledMeetingCounts(cancelledMeetingFilter, setCancelledMeetingCount);
    fetchCompletedMeetingCounts(completedMeetingFilter, setCompletedMeetingCount);
    fetchRoomAndOrganizerData()
    // fetchMostUsedRoom(mostUsedRoomFilter, setMostUsedRoom);
    // fetchMostActiveOrganizer(mostActiveOrganizerFilter, setMostActiveOrganizer);
    // handleOptionSelect(selectedOption);
  }, []);

  return (
    <PaperWrapper>
      <PageHeader heading={"Reports"} />
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#1da256", "#48d483"]}
            title="Users"
            count={counts.users}
            latest={latest.users}
            show={false}
            options={[]}
            nameOfTheClass={"user-report-card"}
            backSideHeading="Recently Registerd User"
            Icon={PersonIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#ff9800", "#ffc107"]}
            title="Meetings"
            count={counts.allMeeting}
            latest={latest.allMeeting}
            show={false}
            options={[]}
            nameOfTheClass={"user-report-card"}
            backSideHeading="Recent Meeting"
            Icon={AvTimerIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            title="Amenities"
            count={counts.amenities}
            latest={latest.amenities}
            show={false}
            options={[]}
            nameOfTheClass={"amenity-report-card"}
            backSideHeading="Recently Added Amenity"
            Icon={WifiOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#e1950e", "#f3cd29"]}
            title="Food & Beverages"
            count={counts.food}
            latest={latest.food}
            show={false}
            options={[]}
            nameOfTheClass={"food-report-card"}
            backSideHeading="Recently Added Beverage"
            Icon={RestaurantOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#2dd2a6", "#88f2d5"]}
            title="Committee"
            options={["Active", "Inactive"]}
            count={counts.committee}
            show={false}
            nameOfTheClass={"committee-report-card"}
            latest={latest.committee}
            backSideHeading="Recently Registerd Committee"
            Icon={GroupsOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#d32f2f", "#ef5350"]}
            title="Rooms"
            count={counts.rooms}
            latest={latest.rooms}
            options={[]}
            show={false}
            nameOfTheClass={"room-report-card"}
            backSideHeading="Recently Added Room"
            Icon={MeetingRoomOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#00acc1", "#26c6da"]}
            title="Locations"
            count={counts.locations}
            latest={latest.locations}
            options={[]}
            show={false}
            nameOfTheClass={"room-report-card"}
            backSideHeading="Recently Added Location"
            Icon={LocationOnOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#c012e2", "#eb64fe"]}
            title="Services"
            count={counts.services}
            latest={latest.services}
            options={[]}
            show={false}
            nameOfTheClass={"room-report-card"}
            backSideHeading="Recently Added Service"
            Icon={DesignServicesOutlinedIcon}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#e1950e", "#f3cd29"]}
            title="Meetings"
            count={meetingCount}
            show={true}
            options={["Today", "This Week", "This Month"]}
            onOptionSelect={handleMeetingSelect}
            subHeading={meetingFilter}
            nameOfTheClass={"meetings-report-card"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#1da256", "#48d483"]}
            title="Cancelled Meetings"
            count={cancelledMeetingCount}
            show={true}
            options={["Today", "This Week", "This Month"]}
            onOptionSelect={handleCancelledMeetingSelect}
            subHeading={cancelledMeetingFilter}
            nameOfTheClass={"cancelled-meetings-report-card"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            title="Completed Meetings"
            count={completedMeetingCount}
            show={true}
            options={["Today", "This Week", "This Month"]}
            onOptionSelect={handleCompletedMeetingSelect}
            subHeading={completedMeetingFilter}
            nameOfTheClass={"completed-meetings-report-card"}
          />
        </Grid> */}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <PaperWrapper elevation={12}>
            <DataGrid
              rows={roomData}
              columns={roomColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              rowHeight={50}
              sx={{
                "& .super-app-theme--header": {
                  backgroundColor: `var(--linear-gradient-main)`,
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "16px",
                },
                '& .MuiDataGrid-columnHeader:first-child, .MuiDataGrid-cell:first-child': {
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  background: 'white',
                },
              }}
              className="most-used-room"
            />
          </PaperWrapper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <PaperWrapper elevation={12}>
            <DataGrid
              rows={organizerData}
              columns={organizerColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              rowHeight={50}
              sx={{
                "& .super-app-theme--header": {
                  backgroundColor: `var(--linear-gradient-main)`,
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "16px",
                },
                '& .MuiDataGrid-columnHeader:first-child, .MuiDataGrid-cell:first-child': {
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  background: 'white',
                },
              }}
              className="most-frequent-organizer"
            />
          </PaperWrapper>
        </Grid>
      </Grid>
    </PaperWrapper>
  );
};

export default ReportPage;
