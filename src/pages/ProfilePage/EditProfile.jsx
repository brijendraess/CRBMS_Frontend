import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { PopContent } from "../../Style";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { PhotoCameraIcon } from "../../components/Common/Buttons/CustomIcon";
import { validateImage } from "../../utils/utils";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const EditProfile = ({ id, setRefreshPage, setIsEditOpen }) => {
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageError, setProfileImageError] = useState("");
  const [userDataList, setUserDataList] = useState([]);
  const [formDataList, setFormDataList] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoading());
        const [userResponse] = await Promise.all([
          axios.get(`/api/v1/user/${id}`),
        ]);
        const userData = userResponse.data.data;
        setUserDataList(userData);

        // Set initial values with committee objects
        setFormDataList({
          fullname: userData.fullname,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });

        setProfileImagePreview(
          `${import.meta.env.VITE_API_URL}/${userData?.avatarPath}`
        );
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to load data.");
        console.error("Error fetching data:", error);
      }
    };
    if (id) fetchUserData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      fullname: formDataList?.fullname || "",
      email: formDataList?.email || "",
      phoneNumber: formDataList?.phoneNumber || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullname: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .required("Phone number is required")
        .length(10, "Phone number must be 10 digits"),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(showLoading());
        // Create payload object
        const formData = new FormData();
        formData.append("fullname", values.fullname);
        formData.append("email", values.email);
        formData.append("phoneNumber", values.phoneNumber);
        if (values.profileImage)
          formData.append("profileImage", values.profileImage);
        await axios.put(
          `/api/v1/user/update-single-profile/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Profile updated successfully!");
        setRefreshPage(Math.random());
        setIsEditOpen(false);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to update profile.");
        console.error("Error updating profile:", error);
      }
    },
  });

  const handleProfileImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      // Reset previous error
      setProfileImageError("");

      // Validate image
      const validationError = validateImage(file);

      if (validationError) {
        // Set error and clear image
        setProfileImageError(validationError);
        setProfileImagePreview(null);
        formik.setFieldValue("profileImage", "");
        return;
      }
      // If validation passes
      formik.setFieldValue("profileImage", file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <PopContent>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          label="Full Name"
          name="fullname"
          margin="normal"
          value={formik.values.fullname}
          onChange={formik.handleChange}
          error={formik.touched.fullname && Boolean(formik.errors.fullname)}
          helperText={formik.touched.fullname && formik.errors.fullname}
          fullWidth
          size="small"
        />

        <TextField
          label="Email"
          name="email"
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          size="small"
        />

        <TextField
          label="Phone Number"
          name="phoneNumber"
          margin="normal"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
          }
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          fullWidth
          size="small"
        />

        {/* AVatar */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          mt={2}
          mb={2}
        >
          <Avatar
            sx={{ width: 75, height: 75 }}
            src={profileImagePreview}
            alt="Profile Image Preview"
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-image-upload"
            type="file"
            onChange={handleProfileImageChange}
          />
          <label htmlFor="profile-image-upload">
            <IconButton component="span" color="primary">
              <PhotoCameraIcon fontSize="medium" />
            </IconButton>
          </label>
        </Box>

        {profileImageError && (
          <Typography
            color="error"
            variant="body2"
            align="center"
            style={{ marginBottom: 16 }}
          >
            {profileImageError}
          </Typography>
        )}
        <FormButton type="submit" btnName="Save Changes" />
      </Box>
    </PopContent>
  );
};

export default EditProfile;
