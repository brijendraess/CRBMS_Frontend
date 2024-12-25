import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const EditRoomAmenities = ({
  room,
  setRefreshPage,
  setOpenEdit,
  editId,
  editInfo,
}) => {
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    amenityId: editInfo?.amenityId,
    quantity: editInfo?.quantity,
    roomId: room.id,
    status: true,
    updatedBy: user.id,
  });
  const [amenitiesList, setAmenitiesList] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the correct key
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoading();
      const response = await axios.put(
        `api/v1/rooms/edit-amenity-quantity/${editId}`,
        formData
      );
      toast.success("Quantity updated Successfully");
      setRefreshPage(Math.random());
      hideLoading();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
      console.error("Error adding location:", err);
      hideLoading();
    } finally {
      setOpenEdit(false);
      hideLoading();
    }
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        showLoading();
        const response = await axios.get("api/v1/amenity/get-all-active-amenities");
        const amenities = response.data.data.result.map((amenity) => {
          return { id: amenity.id, label: amenity.name };
        });
        setAmenitiesList(amenities);
        hideLoading();
      } catch (error) {
        toast.error("Failed to load amenities");
        console.error("Error fetching amenities:", error);
        hideLoading();
      }
    };

    fetchAmenities();
  }, []);

  return (
    <div className="pop-content w-100">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
      >
        <FormControl sx={{ m: 1, width: "100%" }}>
          <InputLabel id="demo-multiple-name-label">Amenity Name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="amenityId"
            name="amenityId"
            value={formData.amenityId}
            label="Amenity Name"
            required
            size="small"
            onChange={handleChange}
          >
            {amenitiesList.map((amenity) => (
              <MenuItem value={amenity.id}>{amenity.label}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Quantity"
            type="number"
            name="quantity" // Match the key in formData
            value={formData.quantity} // Access the correct value
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
            fullWidth
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </FormControl>
      </Box>
    </div>
  );
};

export default EditRoomAmenities;
