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
  handleChangeLocation,
  handleChangeServices,
  handleChangeFoodBeverage,
  selectedAmenities,
  selectedLocation,
  selectedServices,
  selectedFoodBeverage,
  amenitiesList,
  locationList,
  servicesList,
  foodBeverageList,
  handleStartTimeChange,
  meetingStartTime,
  setMeetingEndingTime,
  meetingEndingTime,
  handleChangeCapacity,
  selectedDate,
  setSelectedDate,
  capacity,
  nameOfTheFilterClass,
}) => {
  return (
    <ContentHeader
      sx={{
        position: "sticky",
        marginBottom: "20px",
        backgroundColor: "transparent",
        color: "#fff",
      }}
      elevation={8}
      className={nameOfTheFilterClass}
    >
      <DatePicker
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        format="DD-MM-YYYY"
        disablePast
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "16px",
            height: "40px",
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
      <FormControl sx={{ width: 250 }} size="small">
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
      <FormControl sx={{ width: 250 }} size="small">
        <InputLabel id="demo-multiple-checkbox-label">Location</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedLocation}
          onChange={handleChangeLocation}
          input={<OutlinedInput label="Location" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {locationList.map((item, index) => (
            <MenuItem key={index} value={item}>
              <Checkbox checked={selectedLocation.includes(item)} />
              <ListItemText primary={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 250 }} size="small">
        <InputLabel id="demo-multiple-checkbox-label">Services</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedServices}
          onChange={handleChangeServices}
          input={<OutlinedInput label="Services" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {servicesList.map((item, index) => (
            <MenuItem key={index} value={item}>
              <Checkbox checked={selectedServices.includes(item)} />
              <ListItemText primary={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 360 }} size="small">
        <InputLabel id="demo-multiple-checkbox-label">Food & Beverage</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedFoodBeverage}
          onChange={handleChangeFoodBeverage}
          input={<OutlinedInput label="Food & Beverage" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {foodBeverageList.map((item, index) => (
            <MenuItem key={index} value={item}>
              <Checkbox checked={selectedFoodBeverage.includes(item)} />
              <ListItemText primary={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{minWidth: 125 }} size="small">
        <InputLabel id="demo-select-small-label">Capacity</InputLabel>
        <Select
          label="Capacity"
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
