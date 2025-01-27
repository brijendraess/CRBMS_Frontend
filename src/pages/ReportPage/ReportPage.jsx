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
  const [selectedOption, setSelectedOption] = useState("Today");
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

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    try {
      let queryParam = "";
      switch (option) {
        case "Today":
          queryParam = "?filter=Today";
          break;
        case "This Week":
          queryParam = "?filter=This Week";
          break;
        case "This Month":
          queryParam = "?filter=This Month";
          break;
        default:
          queryParam = "?filter=Today";
      }

      const response = await axios.get(
        `/api/v1/report/meeting-count${queryParam}`
      );
      setMeetingCount(response?.data?.data?.meetingCount || 0);
    } catch (error) {
      console.error("Error fetching meeting count:", error);
    }
  };
  useEffect(() => {
    fetchCounts();
    handleOptionSelect(selectedOption);
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
            onOptionSelect={handleOptionSelect}
            subHeading={selectedOption}
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
