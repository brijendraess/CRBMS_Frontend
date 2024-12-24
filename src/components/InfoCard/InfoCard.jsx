import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Paper, styled } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./InfoCard.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

const InfoCard = ({ color, tittle, count, show, options = [] }) => {
  const [elevation, setElevation] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <div style={{ display: show ? "block" : "none" }}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                style: {
                  maxHeight: "175px",
                  width: "125px",
                },
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Box>
    </Item>
  );
};

export default InfoCard;
