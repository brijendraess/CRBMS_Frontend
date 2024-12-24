import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Paper, styled } from "@mui/material";
import toast from "react-hot-toast";
import { PopContent } from "../../Style";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch } from "react-redux";

const AmenitiesEdit = ({
  id,
  setRefreshPage,
  setIsEditOpen,
  setIsRefreshed,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
  });

  const dispatch = useDispatch();
  // Fetch committee data when `committeeId` is available
  useEffect(() => {
    const fetchAmenities = async () => {
      if (id) {
        dispatch(showLoading());
        try {
          const response = await axios.get(
            `/api/v1/amenity/get-single-amenity/${id}`
          );
          const amenity = response.data.data.roomAmenity;
          console.log(amenity);
          setFormData({
            name: amenity.name,
            description: amenity.description,
          });
          dispatch(hideLoading());
        } catch (err) {
          dispatch(hideLoading());
          toast.error("Failed to fetch amenity details.");
          console.error("Error fetching amenity:", err);
        } finally {
          dispatch(hideLoading());
        }
      }
    };

    fetchAmenities();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuantityChange = (amount) => {
    setFormData((prevData) => ({
      ...prevData,
      quantity: Math.max(1, prevData.quantity + amount), // Ensure quantity is at least 1
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.put(
        `api/v1/amenity/update-amenity/${id}`,
        formData
      );
      toast.success("Amenity edited Successfully");
      setFormData({ name: "", description: "", quantity: 1 });
      setIsRefreshed(Math.random());
      setIsEditOpen(false);
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.response?.data?.message);
      console.error("Error adding amenity:", err);
    }
  };

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
      >
        <TextField
          label="Amenity Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <TextField label="Quantity" name="quantity" value={1} hidden={true} />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Amenity
        </Button>
      </Box>
    </PopContent>
  );
};

export default AmenitiesEdit;
