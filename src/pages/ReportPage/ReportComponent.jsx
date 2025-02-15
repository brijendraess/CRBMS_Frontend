import React, { useEffect, useState } from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { motion } from "framer-motion";

const ReportComponent = () => {
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

      setCounts({
        users: results[0].status === "fulfilled" ? results[0].value.data.data.count || 0 : 0,
        amenities: results[1].status === "fulfilled" ? results[1].value.data.data.count || 0 : 0,
        food: results[2].status === "fulfilled" ? results[2].value.data.data.count || 0 : 0,
        rooms: results[3].status === "fulfilled" ? results[3].value.data.data.count || 0 : 0,
        activeCommittees: results[4].status === "fulfilled" ? results[4].value.data.data.count || 0 : 0,
        inactiveCommittees: results[5].status === "fulfilled" ? results[5].value.data.data.count || 0 : 0,
      });

      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Unexpected error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  // Variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Reduce delay for faster animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      className="report-component"
    >
      <Grid container spacing={2} justifyContent="center">
        {[
          { title: "Users", count: counts.users, color: ["#1da256", "#48d483"], className: "user-report-card" },
          { title: "Amenities", count: counts.amenities, color: ["#2c78e5", "#60aff5"], className: "amenity-report-card" },
          { title: "Meetings", count: meetingCount, color: ["#e1950e", "#f3cd29"], className: "meeting-report-card", options: ["Today", "This Week", "This Month"] },
          { title: "Committee", count: counts.activeCommittees + counts.inactiveCommittees, color: ["#2dd2a6", "#88f2d5"], className: "committee-report-card", options: ["Active", "Inactive"] },
          { title: "Rooms", count: counts.rooms, color: ["#c012e2", "#eb64fe"], className: "room-report-card" }
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              variants={itemVariants}
              whileInView={() => {
                return "visible";
              }}
              viewport={{ once: false, amount: 0.1 }}
            >
              <InfoCard
                color={card.color}
                title={card.title}
                count={card.count}
                options={card.options || []}
                show={card.options ? true : false}
                nameOfTheClass={card.className}
                onOptionSelect={card.title === "Meetings" ? setSelectedOption : undefined}
                subHeading={card.title === "Meetings" ? selectedOption : undefined}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default ReportComponent;
