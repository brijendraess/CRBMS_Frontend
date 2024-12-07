import React, { useState } from "react";
import "./InfoCard.css";
import { Paper, styled } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "100%",
  width: "100%",
  lineHeight: "60px",
  borderRadius: "20px",
  padding: "15px",
}));

const InfoCard = ({ color, tittle, count }) => {
  const [elevation, setElevation] = useState(2);
  return (
    <div className="homepageCardBox">
      <Item
        elevation={elevation}
        onMouseEnter={() => setElevation(24)}
        onMouseLeave={() => setElevation(6)}
        style={{
          backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
        }}
      >
        <div className="d-flex w-100">
          <div className="col1">
            <h4 className="text-white ">{tittle}</h4>
            <span className="number text-white">{count}</span>
          </div>
          <div className="ms-auto">
            <span className="iconContainer">
              <AccountCircleIcon />
            </span>
          </div>
        </div>
      </Item>
    </div>
  );
};

export default InfoCard;
