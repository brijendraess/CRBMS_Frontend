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
import axios from "axios";
import toast from "react-hot-toast";
import { PopContent } from "../../Style";
import "./MembersPage.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  PhotoCameraIcon,
  VisibilityOff,
  Visibility,
} from "../../components/Common/CustomButton/CustomIcon";
import { generateRandomPassword, isPasswordValid } from "../../utils/utils";

const AddMemberForm = ({ setRefreshPage, setIsOpen }) => {
  const [avatarPreview, setAvatarPreview] = useState(null); // Avatar preview
  const [committees, setCommittees] = useState([]); // List of available active committees
  const [strongPassword, setStrongPassword] = useState("");
  const [services, setServices] = useState([]); // List of available active services
  const [showPassword, setShowPassword] = useState(true); // Password visibility toggle
  const [activeRole, setActiveRole] = useState([]); // List of available active role

  const [firstTimeStrongPassword, setFirstTimeStrongPassword] = useState(generateRandomPassword()); // List of available active role
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
    const fetchServices = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/services/active");
        setServices(response?.data?.data?.result || []); // Store services
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to fetch services");
        console.error("Error fetching services:", error);
      }
    };
    const fetchUserRole = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/user-type/active");
        setActiveRole(response.data.data.result || []); // Store committees
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to fetch user type");
        console.error("Error fetching user type:", error);
      }
    };
    fetchServices();
    fetchUserRole();
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

  const handleStrongPassword = () => {
    const strongRandomPassword = generateRandomPassword();
    // setFirstTimeStrongPassword("")
    setStrongPassword(strongRandomPassword);
    formik.setFieldValue("password", strongRandomPassword);
  };

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      user_type: "",
      phoneNumber: "",
      committee: [],
      setServices: [],
      avatar: "",
      password: strongPassword || firstTimeStrongPassword,
      userName: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      user_type: Yup.string().required("Role is required"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .required("Phone number is required")
        .length(10, "Phone number must be 10 digits"),
      password: Yup.string().required("Password is required"),
      userName: Yup.string().required("user name is required"),
      committee: Yup.array()
        .of(Yup.string().required("Committee ID is required"))
        .min(1, "Select at least one committee"),
      services: Yup.array()
        .of(Yup.string().required("services ID is required"))
        .min(1, "Select at least one services"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        console.log("Submitted data : ", values);
        const formData = new FormData();
        formData.append("fullname", values.fullname);
        formData.append("email", values.email);
        formData.append("user_type", values.user_type);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("password", strongPassword ? strongPassword : values.password);
        formData.append("userName", values.userName);
        formData.append("committee", JSON.stringify(values.committee));
         formData.append("services", JSON.stringify(values.services));
        // console.log(formData);
        if (values.avatar) {
          formData.append("avatar", values.avatar);
        }

        if(!isPasswordValid(formData.get("password"))){
          toast.error("Please enter strong password.");
        }
        await axios
          .post("/api/v1/user/register", formData, {
            withCredentials: true,
          })
          .then(() => {
            toast.success(
              "User registered successfully"
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
          <Autocomplete
            disableCloseOnSelect
            multiple
            id="services"
            size="small"
            style={{  flex: 1 }}
            options={services.map((service)=>{return {name:service.servicesName,id:service.id}})}
            value={services.filter((service) =>
              formik.values.services?.includes(service.id)
            )}
            getOptionLabel={(option) => option.name || option.id}
            onChange={(_, selectedOptions) => {
              formik.setFieldValue(
                "services",
                selectedOptions.map((option) => option.id)
              );
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Services"
                error={
                  formik.touched.services && Boolean(formik.errors.services)
                }
                helperText={formik.touched.services && formik.errors.services}
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
          />
        </Box>
        {/* Email and Password */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="User name"
            name="userName"
            value={formik.values.userName}
            onChange={formik.handleChange}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
            style={{ marginRight: 8, flex: 1 }}
            size="small"
          />
          <Box display="flex" justifyContent="space-between" mb={2}>
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
                marginRight: 8
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
              disabled={firstTimeStrongPassword || strongPassword ? true : false}
            />
            <Button variant="contained" color="warning" size="small" sx={{
                fontSize: "10px", // Reduce font size
                padding: "4px 8px", // Reduce padding
                minWidth: "auto", // Allow for smaller width
                lineHeight: 1, // Adjust line height
              }}
              onClick={handleStrongPassword}
            >
              Strong
            </Button>

          </Box>
        </Box>

        {/* Role and Phone Number */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Role"
            name="user_type"
            select
            value={formik.values.user_type}
            onChange={(event) => {
              formik.setFieldValue("user_type", event.target.value);
            }}
            error={formik.touched.user_type && Boolean(formik.errors.user_type)}
            helperText={formik.touched.user_type && formik.errors.user_type}
            style={{ marginRight: 8, flex: 1 }}
            size="small"
          >
            {activeRole?.map((user_type) => (
              <MenuItem value={user_type.id}>{user_type.userTypeName}</MenuItem>
            ))}
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
