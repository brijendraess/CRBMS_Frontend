import React, { useState } from "react";
import { Box, Paper, styled } from "@mui/material";
import "./InfoCard.css";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "auto",
  width: "100%",
  lineHeight: "10px",
  borderRadius: "20px",
  padding: "15px",
}));

const AdminInfoCard = ({ color, tittle, Component, Icons }) => {
  const [elevation, setElevation] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <Item
      elevation={elevation}
      onMouseEnter={() => setElevation(24)}
      onMouseLeave={() => setElevation(6)}
      style={{
        // backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
        // background: "rgb(136, 125, 125)",
        color: "black",
      }}
    >
      <Box display="flex" width="100%">
        <Box className="col1">
          <h4 className="text-black">{tittle}</h4>
        </Box>
        <Box className="ms-auto">
          <span className="iconContainer">{Icons && <Icons />}</span>
        </Box>
      </Box>
      <Box className="scrollingBar">
        {Component && <Component height="75vh" />}
      </Box>
    </Item>
  );
};

export default AdminInfoCard;
