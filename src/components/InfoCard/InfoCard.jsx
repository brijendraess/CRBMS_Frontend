import React, { useState } from "react";
import { Box, Paper, styled } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./InfoCard.css";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "100px",
  width: "100%",
  lineHeight: "10px",
  borderRadius: "20px",
  padding: "15px",
}));

const InfoCard = ({ color, tittle, count }) => {
  const [elevation, setElevation] = useState(2);

  return (
    <Item
      elevation={elevation}
      onMouseEnter={() => setElevation(24)}
      onMouseLeave={() => setElevation(6)}
      style={{
        backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
      }}
    >
      <Box display="flex" width="100%">
        <Box className="col1">
          <h4 className="text-white">{tittle}</h4>
          <span className="number text-white">{count}</span>
        </Box>
        <Box className="ms-auto">
          <span className="iconContainer">
            <AccountCircleIcon />
          </span>
        </Box>
      </Box>
    </Item>
  );
};

export default InfoCard;
