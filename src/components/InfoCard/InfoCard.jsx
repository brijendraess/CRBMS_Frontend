import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Paper, styled } from "@mui/material";
import "./InfoCard.css";
// import "./FlipCard.css"; // Import our flip animation CSS
import {
  AccountCircleIcon,
  MoreVertIcon,
} from "../Common/Buttons/CustomIcon";

// Adjusted Paper styling so it fits inside our flip container.

const InfoCard = ({
  color,
  title,
  count,
  show,
  options = [],
  onOptionSelect,
  subHeading,
  nameOfTheClass,
}) => {
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
    width: "100%",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "none",
    backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
  }));
  const [elevation, setElevation] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    setAnchorEl(null);
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  // Define custom title mappings
  const defaultMeetingTitles = {
    Today: "Today's Meetings",
    "This Week": "This Week's Meetings",
    "This Month": "This Month's Meetings",
  };

  const cancelledMeetingTitles = {
    Today: "Today's Cancelled Meetings",
    "This Week": "This Week's Cancelled Meetings",
    "This Month": "This Month's Cancelled Meetings",
  };

  const completedMeetingTitles = {
    Today: "Today's Completed Meetings",
    "This Week": "This Week's Completed Meetings",
    "This Month": "This Month's Completed Meetings",
  };

  let meetingMapping = defaultMeetingTitles;
  if (title === "Cancelled Meetings") {
    meetingMapping = cancelledMeetingTitles;
  } else if (title === "Completed Meetings") {
    meetingMapping = completedMeetingTitles;
  }

  const formattedTitle = subHeading
    ? meetingMapping[subHeading] || `${subHeading} Meetings`
    : title;

  return (
    <div className={`flip ${nameOfTheClass || ""}`}>
      <div
        className="front"
        onMouseEnter={() => setElevation(24)}
        onMouseLeave={() => setElevation(6)}
      >
        <Item elevation={elevation}>
          <Box display="flex" width="100%" justifyContent="space-between">
            <Box className="col1">
              <h4 className="text-white">{formattedTitle}</h4>
              <span className="number text-white">{count}</span>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box className="ms-auto">
                <span className="iconContainer">
                  <AccountCircleIcon />
                </span>
              </Box>
            </Box>
          </Box>
        </Item>
      </div>

      {/* Back Side */}
      <div className="back">
        <Item elevation={elevation}>
          <div style={{ display: show ? "block" : "none" }}>
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
                <MenuItem
                  key={option}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <h2>Text</h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </Item>
      </div>
    </div>
  );
};

export default InfoCard;
