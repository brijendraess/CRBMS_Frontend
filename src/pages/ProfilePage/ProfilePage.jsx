import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../Redux/alertSlicer";
import { PhotoCameraOutlinedIcon } from "../../components/Common/CustomButton/CustomIcon";

const ProfilePage = ({ user, committees = [] }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    fullname: user?.fullname || "",
    avatarPath: user?.avatarPath || "",
    committees: user?.committees || [],
  });

  const [imagePreview, setImagePreview] = useState(
    user?.avatarPath
      ? `${import.meta.env.VITE_API_URL}/${user?.avatarPath}`
      : null
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(`/api/v1/user/${user?.id}`);
        const result = response.data.data;

        setFormData({
          email: result.email || "",
          phoneNumber: result.phoneNumber || "",
          fullname: result.fullname || "",
          avatarPath: result.avatarPath || "",
          committees: result.committees || [],
        });

        setImagePreview(
          result.avatarPath
            ? `${import.meta.env.VITE_API_URL}/${result.avatarPath}`
            : null
        );
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        dispatch(hideLoading());
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatarPath: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("fullname", formData.fullname);
    if (formData.avatarPath instanceof File) {
      form.append("avatar", formData.avatarPath);
    }
    form.append("committees", JSON.stringify(formData.committees));

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
        <Grid size={12}>
          <TextField label="Email" value={formData.email} fullWidth disabled />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Phone Number"
            value={formData.phoneNumber}
            fullWidth
            disabled
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid size={12}>
          {formData.committees.length > 0 ? (
            formData.committees.map((committee, index) => (
              <Chip key={index} label={committee} sx={{ margin: 0.5 }} />
            ))
          ) : (
            <p>No committees assigned.</p>
          )}
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
            <IconButton component="span" color="primary">
              <Avatar
                src={imagePreview}
                alt="Profile Picture"
                sx={{ width: 100, height: 100 }}
              >
                <PhotoCameraOutlinedIcon fontSize="large" />
              </Avatar>
            </IconButton>
          </label>
        </Grid>
        <Grid
          size={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" color="primary" type="submit">
            Update Profile Picture
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProfilePage;
