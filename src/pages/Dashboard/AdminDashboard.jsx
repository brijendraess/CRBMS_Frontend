import React from "react";
import Grid2 from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Box } from "@mui/material";

import AdminInfoCard from "../../components/InfoCard/AdminInfoCard";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
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
import { PaperWrapper } from "../../Style";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.user);

  // Framer Motion Variants for Entry Animation
  const fadeInUp = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } },
  };

  return (
    <PaperWrapper>
      <Box
        sx={{
          width: "100%",
          //backgroundImage: "url('/src/assets/Images/meeting-room.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: -1,
        }}
      />

      {/* Page Content */}
      <Box sx={{ padding: "30px" }}>
        {/* Page Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <PageHeader heading={`Welcome, ${user.fullname}`} />
        </motion.div>

        <Grid2 container spacing={3}>

          <Grid2 item xs={12}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeInUp}>
              <AdminInfoCard
                color={["var(--linear-gradient-main-2)", "var(--linear-gradient-main)"]}
                title="Meeting Calendar"
                Component={CalendarComponent}
                Icons={CalendarMonthOutlinedIcon}
              />
            </motion.div>
          </Grid2>
          <Grid2 item xs={12}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeInUp}>
              <AdminInfoCard
                color={["var(--linear-gradient-main-2)", "var(--linear-gradient-main)"]}
                Component={ReportComponent}
              />
            </motion.div>
          </Grid2>

          <Grid2 item xs={12} sm={5}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeInUp}>
              <AdminInfoCard
                color={["var(--linear-gradient-main-2)", "var(--linear-gradient-main)"]}
                title="Inventory"
                Icons={Inventory2OutlinedIcon}
                Component={DashboardStock}
              />
            </motion.div>
          </Grid2>

          <Grid2 item xs={12} sm={7}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeInUp}>
              <AdminInfoCard
                color={["var(--linear-gradient-main)", "var(--linear-gradient-main-2)"]}
                title="Inventory History"
                Icons={Inventory2OutlinedIcon}
                Component={InventoryHistory}
              />
            </motion.div>
          </Grid2>

          <Grid2 item xs={12}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeInUp}>
              <AdminInfoCard
                color={["var(--linear-gradient-main)", "var(--linear-gradient-main-2)"]}
                title="Pending Meeting"
                Icons={HourglassTopOutlinedIcon}
                Component={PendingMeeting}
              />
            </motion.div>
          </Grid2>
        </Grid2>
      </Box>
    </PaperWrapper>
  );
};

export default AdminDashboard;
