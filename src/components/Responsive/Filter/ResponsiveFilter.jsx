import React, { useState } from "react";
import {
  styled,
  alpha,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import Menu from "@mui/material/Menu";
import MenuItemUI from "@mui/material/MenuItem";
import {
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  FilterAltOffOutlinedIcon,
  FilterAltOutlinedIcon,
} from "../../Common/Buttons/CustomIcon";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 220,
    color: theme.palette.text.secondary,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const ResponsiveFilter = ({
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
  nameOfTheFilterClass
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        className={nameOfTheFilterClass}
        id="filter-button"
        aria-controls={open ? "responsive-filter-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        startIcon={
          open ? <FilterAltOutlinedIcon /> : <FilterAltOffOutlinedIcon />
        }
      >
        {/* Filter */}
      </Button>

      <StyledMenu
        id="responsive-filter-menu"
        MenuListProps={{
          "aria-labelledby": "filter-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ padding: "16px", width: 300 }}>
        <FormControl fullWidth size="small" sx={{ marginBottom: "16px" }}>
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
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            format="DD-MM-YYYY"
            disablePast
            sx={{
              "& .MuiInputBase-root": {
                fontSize: "16px",
                height: "40px",
                marginBottom: "16px",
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
                marginBottom: "16px",
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
                marginBottom: "16px",
              },
            }}
          />
          <FormControl fullWidth size="small" sx={{ marginBottom: "16px" }}>
            <InputLabel id="amenities-label">Amenities</InputLabel>
            <Select
              labelId="amenities-label"
              id="amenities-select"
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
                <MenuItem
                  key={index}
                  value={item}
                  sx={{
                    maxHeight: "200px",
                  }}
                >
                  <Checkbox checked={selectedAmenities.includes(item)} />
                  <ListItemText primary={item} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ marginBottom: "16px" }}>
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
                
                <FormControl fullWidth size="small" sx={{ marginBottom: "16px" }}>
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
          <FormControl fullWidth size="small">
            <InputLabel id="capacity-label">Capacity</InputLabel>
            <Select
              label="Seats"
              labelId="capacity-label"
              id="capacity-select"
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
        </Box>
        <Divider />
        <MenuItemUI
          onClick={handleClose}
          sx={{
            fontWeight: "600",
            textTransform: "uppercase",
            background: "green",
            width: "100px",
            marginLeft: 1,
            borderRadius: "10px",
            color: "white",
          }}
        >
          Apply
        </MenuItemUI>
      </StyledMenu>
    </>
  );
};

export default ResponsiveFilter;
