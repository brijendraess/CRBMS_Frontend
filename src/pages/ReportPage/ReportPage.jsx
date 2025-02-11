import React, { useEffect, useState } from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import { PaperWrapper } from "../../Style";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import PageHeader from "../../components/Common/PageHeader/PageHeader";

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
  const [mostUsedRoom, setMostUsedRoom] = useState(0);
  const [mostActiveOrganizer, setMostActiveOrganizer] = useState(0);

  const [meetingFilter, setMeetingFilter] = useState("Today");
  const [cancelledMeetingFilter, setCancelledMeetingFilter] = useState("Today");
  const [completedMeetingFilter, setCompletedMeetingFilter] = useState("Today");
  const [mostUsedRoomFilter, setMostUsedRoomFilter] = useState("This Week");
  const [mostActiveOrganizerFilter, setMostActiveOrganizerFilter] = useState("This Week");

  // const [selectedOption, setSelectedOption] = useState("Today");
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

  const handleMostUsedRoomSelect = async (option) => {
    setMostUsedRoomFilter(option);
    await fetchMostUsedRoom(option, setMostUsedRoom, "/api/v1/report/stats");
  };

  const handleMostActiveOrganizerSelect = async (option) => {
    setMostActiveOrganizerFilter(option);
    await fetchMostActiveOrganizer(option, setMostActiveOrganizer, "/api/v1/report/stats");
  };

  
  // const handleOptionSelect = async (option) => {
  //   setSelectedOption(option);
  //   try {
  //     let queryParam = "";
  //     switch (option) {
  //       case "Today":
  //         queryParam = "?filter=Today";
  //         break;
  //       case "This Week":
  //         queryParam = "?filter=This Week";
  //         break;
  //       case "This Month":
  //         queryParam = "?filter=This Month";
  //         break;
  //       default:
  //         queryParam = "?filter=Today";
  //     }

  //     const response = await axios.get(
  //       `/api/v1/report/meeting-count${queryParam}`
  //     );
  //     setMeetingCount(response?.data?.data?.meetingCount || 0);
  //     setCancelledMeetingCount(response?.data?.data?.cancelledMeetingCount || 0);
  //     setCompletedMeetingCount(response?.data?.data?.completedMeetingCount || 0);
  //   } catch (error) {
  //     console.error("Error fetching meeting count:", error);
  //   }
  // };

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

  const fetchMostUsedRoom = async (option, setCount) => {
    try {
      let queryParam = `?filter=${option}`;
      const response = await axios.get(`/api/v1/report/stats${queryParam}`);
      setCount(response?.data?.data?.mostUsedRoom?.roomData?.name || "--");
    } catch (error) {
      console.error("Error fetching meeting count:", error);
    }
  };

  const fetchMostActiveOrganizer = async (option, setCount) => {
    try {
      let queryParam = `?filter=${option}`;
      const response = await axios.get(`/api/v1/report/stats${queryParam}`);
      setCount(response?.data?.data?.mostMeetingsOrganizedByUser?.userData?.fullname || "--");
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

  useEffect(() => {
    fetchCounts();
    fetchMeetingCounts(meetingFilter, setMeetingCount);
    fetchCancelledMeetingCounts(cancelledMeetingFilter, setCancelledMeetingCount);
    fetchCompletedMeetingCounts(completedMeetingFilter, setCompletedMeetingCount);
    fetchMostUsedRoom(mostUsedRoomFilter, setMostUsedRoom);
    fetchMostActiveOrganizer(mostActiveOrganizerFilter, setMostActiveOrganizer);
    // handleOptionSelect(selectedOption);
  }, []);

  return (
    <PaperWrapper>
      <PageHeader heading={"Reports"} />
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#1da256", "#48d483"]}
            tittle="Users"
            count={counts.users}
            show={false}
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            tittle="Amenities"
            count={counts.amenities}
            show={false}
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#e1950e", "#f3cd29"]}
            tittle="Meetings"
            count={meetingCount}
            show={true}
            options={["Today", "This Week", "This Month"]}
            onOptionSelect={handleMeetingSelect}
            subHeading={meetingFilter}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#1da256", "#48d483"]}
            tittle="Cancelled Meetings"
            count={cancelledMeetingCount}
            show={true}
            options={["Today", "This Week", "This Month"]}
            onOptionSelect={handleCancelledMeetingSelect}
            subHeading={cancelledMeetingFilter}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            tittle="Completed Meetings"
            count={completedMeetingCount}
            show={true}
            options={["Today", "This Week", "This Month"]}
            onOptionSelect={handleCompletedMeetingSelect}
            subHeading={completedMeetingFilter}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#d30d56", "#ff478b"]}
            tittle="Visitors"
            count="80"
          />
        </Grid> */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2dd2a6", "#88f2d5"]}
            tittle="Committee"
            options={["Active", "Inactive"]}
            count={counts.activeCommittees + counts.inactiveCommittees}
            show={false}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#c012e2", "#eb64fe"]}
            tittle="Rooms"
            count={counts.rooms}
            options={[]}
            show={false}
          />
        </Grid>
      </Grid>
    </PaperWrapper>
  );
};

export default ReportPage;
