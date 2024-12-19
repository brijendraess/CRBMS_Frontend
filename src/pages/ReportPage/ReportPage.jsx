import React from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import LineChartBox from "../../components/Charts/LineChartBox";
import AreaChartBox from "../../components/Charts/AreaChartBox";
import BarChartBox from "../../components/Charts/BarChartBox";
import PieChartBox from "../../components/Charts/PieChartBox";
import RadarChartBox from "../../components/Charts/RadarChartBox";
import { PaperWrapper } from "../../Style";
import { Box, Grid2 } from "@mui/material";
// LineChartBox
import Grid from "@mui/material/Grid2";

const ReportPage = () => {
  return (
    <PaperWrapper>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#1da256", "#48d483"]}
            tittle="Users"
            count="1253"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2c78e5", "#60aff5"]}
            tittle="Amenities"
            count="15"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#e1950e", "#f3cd29"]}
            tittle="Meetings"
            count="169"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#d30d56", "#ff478b"]}
            tittle="Visitors"
            count="80"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard
            color={["#2dd2a6", "#88f2d5"]}
            tittle="Committee"
            count="15"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InfoCard color={["#c012e2", "#eb64fe"]} tittle="Rooms" count="59" />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 4, md: 5 }}>
          <AreaChartBox color={["#cc2b5e ", "#753a88"]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 7 }}>
          <LineChartBox />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <PieChartBox />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <BarChartBox color={["#eb3349  ", "#f45c43"]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <RadarChartBox color={["#bdc3c7  ", "#2c3e50"]} />
        </Grid>
      </Grid>
    </PaperWrapper>
  );
};

export default ReportPage;
