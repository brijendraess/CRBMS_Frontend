import React from "react";
import { PaperWrapper } from "../../Style";
import Grid from "@mui/material/Grid2";
import AdminInfoCard from "../../components/InfoCard/AdminInfoCard";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import {
  CalendarMonthOutlinedIcon,
  HourglassTopOutlinedIcon,
  Inventory2OutlinedIcon,
} from "../../components/Common/CustomButton/CustomIcon";
import PendingMeeting from "./PendingMeeting";
import DashboardStock from "./DashboardStock";
import InventoryHistory from "./InventoryHistory";
import CalederComponent from "../CalenderPage/CalederComponent";

const AdminDashboard = () => {
  return (
    <PaperWrapper>
      <PageHeader heading={"Dashboard"} />
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main)",
              "var(--linear-gradient-main-2)",
            ]}
            tittle="Pending Meeting"
            Icons={HourglassTopOutlinedIcon}
            Component={PendingMeeting}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main-2)",
              "var(--linear-gradient-main)",
            ]}
            tittle="Meeting Calendar"
            Component={CalederComponent}
            Icons={CalendarMonthOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main)",
              "var(--linear-gradient-main-2)",
            ]}
            tittle="Inventory History"
            Icons={Inventory2OutlinedIcon}
            Component={InventoryHistory}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
            color={[
              "var(--linear-gradient-main-2)",
              "var(--linear-gradient-main)",
            ]}
            tittle="Inventory"
            Icons={Inventory2OutlinedIcon}
            Component={DashboardStock}
          />
        </Grid>
      </Grid>
    </PaperWrapper>
  );
};

export default AdminDashboard;
