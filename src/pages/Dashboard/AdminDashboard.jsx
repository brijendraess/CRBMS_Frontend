import React, { useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useSelector } from "react-redux";
import AdminInfoCard from "../../components/InfoCard/AdminInfoCard";
import {
  CalendarMonthOutlinedIcon,
  HourglassTopOutlinedIcon,
  Inventory2OutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import PendingMeeting from "./PendingMeeting";
import DashboardStock from "./DashboardStock";
import InventoryHistory from "./InventoryHistory";
import ReportComponent from "../ReportPage/ReportComponent";
import CalendarComponent from "../CalendarPage/CalendarComponent";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import PageHeader from "../../components/Common/PageHeader/PageHeader";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.user);

  const sections = [
    { title: "Meeting Calendar", Component: CalendarComponent, Icons: CalendarMonthOutlinedIcon },
    { title: "Report", Component: ReportComponent },
    { title: "Inventory", Component: DashboardStock, Icons: Inventory2OutlinedIcon },
    { title: "Inventory History", Component: InventoryHistory, Icons: Inventory2OutlinedIcon },
    { title: "Pending Meeting", Component: PendingMeeting, Icons: HourglassTopOutlinedIcon },
  ];

  return (
    <Box Component={'div'}
      style={{
        height: "calc(100vh - 10px - 70px)",
        overflow: "hidden",
        position: "relative",
        marginTop: '10px',
        borderRadius: '12px',
        backgroundImage: "url('./public/meeting-room.jpg')", // Change this path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Fixes the background while scrolling
      }}
    >

      <Box
        Component={'div'}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        <motion.div
          style={{
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            willChange: "opacity, transform",
          }}
        >
          <PageHeader
            heading={`Welcome, ${user.fullname}`}
            headingFontColor="#ffffff"
          />
        </motion.div>
        <Grid container  md={12}>
  {sections.map((item, index) => (
    <Grid key={index} sx={index === 2 &&{paddingRight: "20px"}} item xs={12} md={index === 2 || index === 3 ? 6 : 12}>
      <Section {...item} />
    </Grid>
  ))}
</Grid>
      </Box>
    </Box>
  );
};

const Section = ({ title, Component, Icons }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, scale: 1, transition: { duration: 0.5 } });
    } else {
      controls.start({ opacity: 0.5, scale: 0.85, transition: { duration: 0.5 } });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      style={{
        marginBottom: "50px",
        padding: "20px",
        background: "rgba(255, 255, 255, 0.9)", // Light background for readability
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        willChange: "opacity, transform",
      }}
    >
      <AdminInfoCard
        color={["var(--linear-gradient-main-2)", "var(--linear-gradient-main)"]}
        title={title}
        Component={Component}
        Icons={Icons}
      />
    </motion.div>
  );
};

export default AdminDashboard;