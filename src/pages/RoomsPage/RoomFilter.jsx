import React from "react";
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
import "./RoomsPage.css";
import { ContentHeader } from "../../Style";

const RoomFilter = ({
  handleChangeAmenities,
  selectedAmenities,
  amenitiesList,
  handleStartTimeChange,
  meetingStartTime,
  setMeetingEndingTime,
  meetingEndingTime,
  handleChangeCapacity,
  selectedDate,
  setSelectedDate,
  capacity,
}) => {
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
        <InputLabel id="demo-select-small-label">Capacity</InputLabel>
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
