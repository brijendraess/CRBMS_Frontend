import React, { useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Avatar,
  styled,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import toast from "react-hot-toast";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

const Input = styled("input")({
  display: "none",
});

const ProfilePage = ({ user }) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    fullname: user?.fullname || "",
    avatarPath: user?.avatarPath || "",
    committee: user?.committee || null,
  });

  const [imagePreview, setImagePreview] = useState(
    user?.avatarPath
      ? `${import.meta.env.VITE_API_URL}/${user?.avatarPath}`
      : null
  );

  const committees = [
    "Finance Committee",
    "Event Management",
    "HR Committee",
    "IT Support",
  ]; // Replace with your actual committee list

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAutocompleteChange = (event, value) => {
    setFormData({ ...formData, committee: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatarPath: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("fullname", formData.fullname);
    form.append("avatar", formData.avatarPath); // Assuming backend expects this key
    form.append("committee", formData.committee);

    try {
      const response = await axios.post("/api/v1/user/update-profile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while updating"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            label="Email"
            value={formData.email}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            disabled
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Phone Number"
            value={formData.phoneNumber}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            disabled
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid size={12}>
          <Autocomplete
            options={committees}
            getOptionLabel={(option) => option}
            value={formData.committee}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField {...params} label="Committee" fullWidth />
            )}
          />
        </Grid>
        <Grid
          size={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="avatar-upload">
            <Avatar
              src={imagePreview}
              alt="Profile Picture"
              sx={{ width: 100, height: 100 }}
            >
              <IconButton component="span" color="primary">
                <PhotoCameraOutlinedIcon fontSize="large" />
              </IconButton>
            </Avatar>
          </label>
        </Grid>
        <Grid
          size={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "end",
          }}
        >
          <Button variant="contained" color="primary" type="submit">
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProfilePage;
