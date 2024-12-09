import React, { useState } from "react";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Box,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "./RoomsPage.css";
import { ContentHeader } from "../../Style";
const RoomFilter = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // For date filter
  const [meetingStartTime, setMeetingStartTime] = useState(null); // For start time filter
  const [meetingEndingTime, setMeetingEndingTime] = useState(null); // For end time filter
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [capacity, setCapacity] = useState("");

  // Handle Start Time Change
  const handleStartTimeChange = (newStartTime) => {
    setMeetingStartTime(newStartTime);

    // Auto-select one hour later for ending time
    const autoEndTime = newStartTime.add(1, "hour");
    setMeetingEndingTime(autoEndTime);
  };

  // Handle amenities change
  const handleChangeAmenities = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAmenities(typeof value === "string" ? value.split(",") : value);
  };

  // Handle capacity change
  const handleChangeCapacity = (event) => {
    setCapacity(event.target.value);
  };

  return (
    <ContentHeader
      sx={{ position: "sticky", marginBottom: "20px" }}
      elevation={8}
    >
      <DatePicker
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        format="DD-MM-YYYY"
        disablePast
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "16px", // Adjust font size
            height: "40px", // Adjust input height
          },
        }}
      />
      <TimePicker
        value={meetingStartTime}
        onChange={handleStartTimeChange}
        defaultValue={dayjs(Date.now())}
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "16px",
            height: "40px",
          },
        }}
      />
      <TimePicker
        value={meetingEndingTime}
        onChange={(newValue) => setMeetingEndingTime(newValue)}
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "16px",
            height: "40px",
          },
        }}
      />
      <FormControl sx={{ width: 300 }} size="small">
        <InputLabel id="demo-multiple-checkbox-label">Amenities</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedAmenities}
          onChange={handleChangeAmenities}
          input={<OutlinedInput label="Amenities" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {amenitiesList.map((item, index) => (
            <MenuItem key={index} value={item}>
              <Checkbox checked={selectedAmenities.includes(item)} />
              <ListItemText primary={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ marginRight: "10px", minWidth: 100 }} size="small">
        <InputLabel id="demo-select-small-label">Seats</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={capacity}
          onChange={handleChangeCapacity}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>10+</MenuItem>
          <MenuItem value={20}>20+</MenuItem>
          <MenuItem value={30}>30+</MenuItem>
        </Select>
      </FormControl>
    </ContentHeader>
  );
};

export default RoomFilter;
