import {
  Box,
  Button,
  TextField,
  MenuItem,
  Avatar,
  IconButton,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { PopContent } from "../../Style";
import "./MembersPage.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const AddMemberForm = ({ setRefreshPage, setIsOpen }) => {
  const [avatarPreview, setAvatarPreview] = useState(null); // Avatar preview
  const [committees, setCommittees] = useState([]); // List of available committees
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const dispatch = useDispatch();
  // Fetch committees on mount
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/committee/active-committee");
        setCommittees(response.data.data.committees || []); // Store committees
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to fetch committees");
        console.error("Error fetching committees:", error);
      }
    };

    fetchCommittees();
  }, []);

  // Handle avatar change and preview
  const handleAvatarChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("avatar", file); // Update Formik field
      setAvatarPreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      role: true,
      phoneNumber: "",
      committee: [], // Array of committee IDs
      avatar: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      role: Yup.boolean().required("Role is required"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .required("Phone number is required")
        .length(10, "Phone number must be 10 digits"),
      password: Yup.string().required("Password is required"),
      committee: Yup.array()
        .of(Yup.string().required("Committee ID is required"))
        .min(1, "Select at least one committee"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        console.log("Submitted data : ", values);
        const formData = new FormData();
        formData.append("fullname", values.fullname);
        formData.append("email", values.email);
        formData.append("role", values.role);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("password", values.password);
        formData.append("committee", JSON.stringify(values.committee));
        console.log(formData);
        if (values.avatar) {
          formData.append("avatar", values.avatar);
        }
        await axios
          .post("/api/v1/user/register", formData, {
            withCredentials: true,
          })
          .then(() => {
            toast.success(
              "User registered and added to committees successfully"
            );
            setRefreshPage(Math.random());
            setIsOpen(false);
            resetForm();
            setAvatarPreview(null); // Clear avatar preview
          });
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error(error.response?.data?.message || "An error occurred");
        console.error("Error during form submission:", error);
      }
    },
  });

  return (
    <PopContent>
      <Box component="form" onSubmit={formik.handleSubmit}>
        {/*Full Name */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Full Name"
            name="fullname"
            value={formik.values.fullname}
            onChange={formik.handleChange}
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
            style={{ flex: 1 }}
            size="small"
          />
        </Box>

        {/* Email and Password */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            style={{ marginRight: 8, flex: 1 }}
            size="small"
          />
          <TextField
            className="custom-password-field"
            label="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            type={showPassword ? "text" : "password"}
            size="small"
            style={{
              flex: 1,
              "& .MuiOutlinedInputRoot": {
                paddingRight: "0",
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Role and Phone Number */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Role"
            name="role"
            select
            value={formik.values.role}
            onChange={(event) => {
              formik.setFieldValue("role", event.target.value === "true");
            }}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            style={{ marginRight: 8, flex: 1 }}
            size="small"
          >
            <MenuItem value="false">User</MenuItem>
            <MenuItem value="true">Admin</MenuItem>
          </TextField>

          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            size="small"
            style={{ flex: 1 }}
          />
        </Box>

        {/* Committee Selection */}
        <Autocomplete
          disableCloseOnSelect
          multiple
          id="committee"
          options={committees}
          value={committees.filter((committee) =>
            formik.values.committee.includes(committee.id)
          )}
          getOptionLabel={(option) => option.name || option.id}
          onChange={(_, selectedOptions) => {
            formik.setFieldValue(
              "committee",
              selectedOptions.map((option) => option.id)
            );
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Committee"
              error={
                formik.touched.committee && Boolean(formik.errors.committee)
              }
              helperText={formik.touched.committee && formik.errors.committee}
              sx={{ maxHeight: "50px" }}
            />
          )}
          renderTags={(tagValue, getTagProps) => {
            if (tagValue.length === 0) {
              return null;
            }
            return <span>{tagValue.length} selected</span>;
          }}
          renderOption={(props, option, { selected }) => (
            <li
              {...props}
              style={{
                backgroundColor: selected ? "#e0f7fa" : "inherit", // Change the color when selected
                fontWeight: selected ? "bold" : "normal", // Optional: Make text bold when selected
              }}
            >
              {option.name}
            </li>
          )}
          style={{ marginBottom: 16 }}
        />

        {/* Avatar */}
        <Box display="flex" justifyContent="center" mb={3}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <IconButton component="span">
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={avatarPreview}
                alt="Avatar Preview"
              >
                <PhotoCameraIcon fontSize="large" />
              </Avatar>
            </IconButton>
          </label>
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Add Member
          </Button>
        </Box>
      </Box>
    </PopContent>
  );
};

export default AddMemberForm;
