import React, { useEffect, useState } from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import { PaperWrapper } from "../../Style";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography } from "@mui/material";

const ReportPage = () => {
  const [counts, setCounts] = useState({
    users: 0,
    amenities: 0,
    food: 0,
    rooms: 0,
    activeCommittees: 0,
    inactiveCommittees: 0,
  });
  const [meetingCount, setMeetingCount] = useState(0);
  const [cancelledMeetingCount, setCancelledMeetingCount] = useState(0);
  const [completedMeetingCount, setCompletedMeetingCount] = useState(0);

  const [meetingFilter, setMeetingFilter] = useState("Today");
  const [cancelledMeetingFilter, setCancelledMeetingFilter] = useState("Today");
  const [completedMeetingFilter, setCompletedMeetingFilter] = useState("Today");

  const [roomData, setRoomData] = useState([]);
  const [organizerData, setOrganizerData] = useState([]);

  const dispatch = useDispatch();
  const fetchCounts = async () => {
    try {
      dispatch(showLoading());
      const results = await Promise.allSettled([
        axios.get("/api/v1/report/user-count"),
        axios.get("/api/v1/report/amenity-count"),
        axios.get("/api/v1/report/food-count"),
        axios.get("/api/v1/report/room-count"),
        axios.get("/api/v1/report/active-committee-count"),
        axios.get("/api/v1/report/inactive-committee-count"),
      ]);
      const [
        userCount,
        amenityCount,
        foodCount,
        roomCount,
        activeCommitteeCount,
        inactiveCommitteeCount,
      ] = results;

      setCounts({
        users:
          userCount.status === "fulfilled"
            ? userCount.value.data.data.count || 0
            : 0,
        amenities:
          amenityCount.status === "fulfilled"
            ? amenityCount.value.data.data.count || 0
            : 0,
        food:
          foodCount.status === "fulfilled"
            ? foodCount.value.data.data.count || 0
            : 0,
        rooms:
          roomCount.status === "fulfilled"
            ? roomCount.value.data.data.count || 0
            : 0,
        activeCommittees:
          activeCommitteeCount.status === "fulfilled"
            ? activeCommitteeCount.value.data.data.count || 0
            : 0,
        inactiveCommittees:
          inactiveCommitteeCount.status === "fulfilled"
            ? inactiveCommitteeCount.value.data.data.count || 0
            : 0,
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
      width: 260,
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
      width: 225,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 225,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 110,
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#1da256", "#48d483"]}
            title="Users"
            count={counts.users}
            show={false}
            options={[]}
            nameOfTheClass={"user-report-card"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            title="Amenities"
            count={counts.amenities}
            show={false}
            options={[]}
            nameOfTheClass={"amenity-report-card"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            title="Food & Beverages"
            count={counts.food}
            show={false}
            options={[]}
            nameOfTheClass={"food-report-card"}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            tittle="Most Used Room"
            count={mostUsedRoom}
            show={true}
            options={["This Week", "This Month"]}
            onOptionSelect={handleMostUsedRoomSelect}
            subHeading={mostUsedRoomFilter}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            tittle="Active Organizer"
            count={mostActiveOrganizer}
            show={true}
            options={["This Week", "This Month"]}
            onOptionSelect={handleMostActiveOrganizerSelect}
            subHeading={mostActiveOrganizerFilter}
          />
        </Grid> */}
        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#d30d56", "#ff478b"]}
            title="Visitors"
            count="80"
          />
        </Grid> */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2dd2a6", "#88f2d5"]}
            title="Committee"
            options={["Active", "Inactive"]}
            count={counts.activeCommittees + counts.inactiveCommittees}
            show={false}
            nameOfTheClass={"committee-report-card"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#c012e2", "#eb64fe"]}
            title="Rooms"
            count={counts.rooms}
            options={[]}
            show={false}
            nameOfTheClass={"room-report-card"}
          />
        </Grid>
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
