import React from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import List from "../../components/List/List";
import LineChartBox from "../../components/Charts/LineChartBox";
import AreaChartBox from "../../components/Charts/AreaChartBox";
import BarChartBox from "../../components/Charts/BarChartBox";
import PieChartBox from "../../components/Charts/PieChartBox";
import RadarChartBox from "../../components/Charts/RadarChartBox";
import { PaperWrapper } from "../../Style";
// LineChartBox

const ReportPage = () => {
  return (
    <PaperWrapper>
      <div className="row homePageWrapperRow">
        <div className="col-md-7">
          <div className="homePageWrapper d-flex">
            <InfoCard
              color={["#1da256", "#48d483"]}
              tittle="Users"
              count="1253"
            />
            <InfoCard
              color={["#c012e2", "#eb64fe"]}
              tittle="Rooms"
              count="59"
            />
            <InfoCard
              color={["#2c78e5", "#60aff5"]}
              tittle="Amenities"
              count="15"
            />
            <InfoCard
              color={["#e1950e", "#f3cd29"]}
              tittle="Meetings"
              count="169"
            />
            <InfoCard
              color={["#d30d56", "#ff478b"]}
              tittle="Visitors"
              count="80"
            />
            <InfoCard
              color={["#2dd2a6", "#88f2d5"]}
              tittle="Committee"
              count="15"
            />
          </div>
        </div>
        <div className="col-md-5 ps-0">
          <div className="box">
            <List color={["#1a50b5", "#2a6ff7"]} />
          </div>
        </div>
      </div>
      <div className="row chartWrapperRow">
        <div className="col-md-5">
          <AreaChartBox color={["#cc2b5e ", "#753a88"]} />
        </div>
        <div className="col-md-7 ps-0">
          <LineChartBox />
        </div>
      </div>
      <div className="row chartWrapperRow">
        <div className="col-md-4">
          <PieChartBox />
        </div>
        <div className="col-md-4">
          <BarChartBox color={["#eb3349  ", "#f45c43"]} />
        </div>
        <div className="col-md-4">
          <RadarChartBox color={["#bdc3c7  ", "#2c3e50"]} />
        </div>
      </div>
    </PaperWrapper>
  );
};

export default ReportPage;
