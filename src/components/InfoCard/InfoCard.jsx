import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Paper, styled } from "@mui/material";
import "./InfoCard.css";
import {
  AccountCircleIcon,
  MoreVertIcon,
} from "../Common/Buttons/CustomIcon";

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

const InfoCard = ({
  color,
  title,
  count,
  show,
  options = [],
  onOptionSelect,
  subHeading,
  nameOfTheClass
}) => {
  const [elevation, setElevation] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  console.log(nameOfTheClass)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    setAnchorEl(null);
    if (onOptionSelect) {
      onOptionSelect(option); // Call the passed function with the selected option
    }
  };

  return (
    <Item
      elevation={elevation}
      onMouseEnter={() => setElevation(24)}
      onMouseLeave={() => setElevation(6)}
      style={{
        backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
      }}
      className={nameOfTheClass || ""}
    >

      <Box display="flex" width="100%">
        <Box className="col1">
          <h4 className="text-white">
            {title} {subHeading && <span>|| {subHeading}</span>}
          </h4>
          <span className="number text-white">{count}</span>
        </Box>
        <Box className="ms-auto">
          <span className="iconContainer">
            <AccountCircleIcon />
          </span>
        </Box>
        <div style={{ display: show ? "block" : "none" }} >
          <IconButton
            aria-label="more"
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
              <MenuItem key={option} onClick={() => handleOptionClick(option)}>
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
