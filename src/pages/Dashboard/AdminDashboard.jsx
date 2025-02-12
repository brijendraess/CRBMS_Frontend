import React from "react";
import { PaperWrapper } from "../../Style";
import Grid from "@mui/material/Grid2";
import AdminInfoCard from "../../components/InfoCard/AdminInfoCard";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import {
  CalendarMonthOutlinedIcon,
  HourglassTopOutlinedIcon,
  Inventory2OutlinedIcon,
  AssessmentOutlinedIcon
} from "../../components/Common/Buttons/CustomIcon";
import PendingMeeting from "./PendingMeeting";
import DashboardStock from "./DashboardStock";
import InventoryHistory from "./InventoryHistory";
import { useSelector } from "react-redux";
import ReportComponent from "../ReportPage/ReportComponent";
import CalendarComponent from "../CalendarPage/CalendarComponent";

const AdminDashboard = () => {

  const { user } = useSelector((state) => state.user);

  return (
    <PaperWrapper>
      <PageHeader heading={`Welcome, ${user.fullname}`} />
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 8, md: 8 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main-2)",
              "var(--linear-gradient-main)",
            ]}
            title="Meeting Calendar"
            Component={CalendarComponent}
            Icons={CalendarMonthOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }} gap={2} display='flex' flexDirection={'column'}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main-2)",
              "var(--linear-gradient-main)",
            ]}
            // title="Report"
            Component={ReportComponent}
            // Icons={AssessmentOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 5, md: 5 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main-2)",
              "var(--linear-gradient-main)",
            ]}
            title="Inventory"
            Icons={Inventory2OutlinedIcon}
            Component={DashboardStock}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 7 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main)",
              "var(--linear-gradient-main-2)",
            ]}
            title="Inventory History"
            Icons={Inventory2OutlinedIcon}
            Component={InventoryHistory}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main)",
              "var(--linear-gradient-main-2)",
            ]}
            title="Pending Meeting"
            Icons={HourglassTopOutlinedIcon}
            Component={PendingMeeting}
          />
        </Grid>
      </Grid>
    </PaperWrapper>
  );
};

export default AdminDashboard;
