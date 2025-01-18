import React, {  } from "react";
import { PaperWrapper } from "../../Style";
import Grid from "@mui/material/Grid2";
import CalenderPage from '../CalenderPage/CalenderPage'
import AdminInfoCard from '../../components/InfoCard/AdminInfoCard'
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { CalendarMonthOutlinedIcon, HourglassBottomOutlinedIcon, Inventory2OutlinedIcon } from "../../components/Common/CustomButton/CustomIcon";
import PendingMeeting from "./PendingMeeting";
import DashboardStock from "./DashboardStock";
import InventoryHistory from "./InventoryHistory";

const AdminDashboard = () => {
  return (
    <PaperWrapper>
      <PageHeader heading={"Dashboard"} />
      <Grid container spacing={2} mb={2}>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
            color={["#e1950e", "#f3cd29"]}
            tittle="Pending Meeting"
            Icons={HourglassBottomOutlinedIcon }
            Component={PendingMeeting}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
           color={["#c012e2", "#eb64fe"]}
            tittle="Inventory History"
            Icons={Inventory2OutlinedIcon }
            Component={InventoryHistory}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
            color={["#2c78e5", "#60aff5"]}
            tittle="Inventory"
            Icons={Inventory2OutlinedIcon }
            Component={DashboardStock}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <AdminInfoCard
            color={["#1da256", "#48d483"]}
            tittle="Meeting Calendar"
            Component={CalenderPage}
            Icons={CalendarMonthOutlinedIcon }
          />
        </Grid>
      </Grid>
    </PaperWrapper>
   
  )
}

export default AdminDashboard