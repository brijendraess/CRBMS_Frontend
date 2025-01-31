import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  styled,
  Autocomplete,
  Avatar,
  IconButton,
  MenuItem,
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

const FormWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: "100%",
  width: "100%",
  lineHeight: "60px",
  borderRadius: "20px",
  padding: "15px",
  marginTop: "10px",
}));

const UpdateMemberForm = ({ id, setRefreshPage, setIsEditOpen }) => {
  const [availableCommittees, setAvailableCommittees] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageError, setProfileImageError] = useState("");
  const [userCommittees, setUserCommittees] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [formDataList, setFormDataList] = useState({});
  const [userServices, setUserServices] = useState([]);
  const [activeRole, setActiveRole] = useState([]); // List of available active role
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoading());
        const [
          userResponse,
          committeesResponse,
          userRoleResponse,
          servicesResponse,
        ] = await Promise.all([
          axios.get(`/api/v1/user/${id}`),
          axios.get("/api/v1/committee/active-committee"),
          axios.get("/api/v1/user-type/active"),
          await axios.get("/api/v1/services/active"),
        ]);
        const userData = userResponse.data.data;
        const committees = committeesResponse.data.data.committees || [];
        const services = servicesResponse.data.data.result || [];
        const userRole = userRoleResponse.data.data.result || [];
        setAvailableCommittees(committees);
        setAvailableServices(services);
        setActiveRole(userRole);
        setUserDataList(userData);

        // Find the full committee objects that match the user's committee names
        const userCommitteeObjects = userData.committees
          ?.map((committeeName) =>
            committees?.find((committee) => committee.name === committeeName)
          )
          ?.filter(Boolean);

        // Find the full services objects that match the user's committee names
        const userServicesObjects = userData.services
          ?.map((servicesName) =>
            services?.find((service) => service.servicesName === servicesName)
          )
          ?.filter(Boolean);
          console.log(userData)
        // Set initial values with committee objects
        setFormDataList({
          fullname: userData.fullname,
          email: userData.email,
          userDescription: userData.userDescription,
          phoneNumber: userData.phoneNumber,
          user_type: userData.user_type.id,
          committees: userCommitteeObjects,
          services: userServicesObjects,
        });

        setUserCommittees(userCommitteeObjects);
        setUserServices(userServicesObjects);
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
    if (id) 
    fetchUserData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      fullname: formDataList?.fullname||"",
          email: formDataList?.email||"",
          userDescription: formDataList?.userDescription||"",
          phoneNumber: formDataList?.phoneNumber||"",
          user_type: formDataList?.user_type||"",
          committees: formDataList?.committees||[],
          services: formDataList?.services||[],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullname: Yup.string().required("Name is required"),
      userDescription: Yup.string().optional(),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .required("Phone number is required")
        .length(10, "Phone number must be 10 digits"),
      committees: Yup.array()
        .of(Yup.object())
        .required("Select at least one service"),
      services: Yup.array()
        .of(Yup.object())
        .required("Select at least one service"),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted:", values);
      try {
        dispatch(showLoading());
        // Extract committee IDs
        const committeeIds = values.committees.map((committee) => committee.id);
        const servicesIds = values.services.map((service) => service.id);

        // Create payload object
        const formData = new FormData();
        formData.append("fullname", values.fullname);
        formData.append("email", values.email);
        formData.append("userDescription", values.userDescription);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("user_type", values.user_type);
        formData.append("committees", committeeIds);
        formData.append("services", servicesIds);
        if (values.profileImage)
          formData.append("profileImage", values.profileImage);
        const response = await axios.put(
          `/api/v1/user/update-profile/${id}`,
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

        <TextField
          label="Role"
          name="user_type"
          fullWidth
          select
          value={formik.values?.user_type|| ""}
          onChange={(event) => {
            formik.setFieldValue("user_type", event.target.value);
          }}
          error={formik.touched.user_type && Boolean(formik.errors.user_type)}
          helperText={formik.touched.user_type && formik.errors.user_type}
          style={{ marginRight: 8, flex: 1 }}
          size="small"
        >
          {activeRole?.map((user_type) => (
            <MenuItem key={user_type.id} value={user_type.id}>{user_type.userTypeName}</MenuItem>
          ))}
        </TextField>

        <Autocomplete
          disableCloseOnSelect
          multiple
          id="services"
          options={availableServices}
          value={formik.values.services}
          getOptionLabel={(option) => option.servicesName || ""}
          onChange={(_, selectedServices) => {
            formik.setFieldValue("services", selectedServices);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              marginTop={2}
              {...params}
              label="Select Services"
              error={formik.touched.services && Boolean(formik.errors.services)}
              helperText={formik.touched.services && formik.errors.services}
            />
          )}
          slotProps={{
            listbox: {
              style: { maxHeight: 150, overflowY: "scroll" },
            },
          }}
          style={{ marginTop: "1rem" }}
          renderTags={(selected) => {
            return selected.length > 0 ? (
              <span>{selected.length} selected</span>
            ) : null;
          }}
          renderOption={(props, option, { selected }) => (
            <li
              {...props}
              style={{
                backgroundColor: selected ? "#e0f7fa" : "inherit",
                fontWeight: selected ? "bold" : "normal",
                fontSize: "14px",
              }}
            >
              {option.servicesName}
            </li>
          )}
        />

        <Autocomplete
          disableCloseOnSelect
          multiple
          id="committees"
          options={availableCommittees}
          value={formik.values.committees}
          getOptionLabel={(option) => option.name || ""}
          onChange={(_, selectedCommittees) => {
            formik.setFieldValue("committees", selectedCommittees);
          }}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              marginTop={2}
              {...params}
              label="Select Committees"
              error={
                formik.touched.committees && Boolean(formik.errors.committees)
              }
              helperText={formik.touched.committees && formik.errors.committees}
            />
          )}
          slotProps={{
            listbox: {
              style: { maxHeight: 150, overflowY: "scroll" },
            },
          }}
          style={{ marginTop: "1rem" }}
          renderTags={(selected) => {
            return selected.length > 0 ? (
              <span>{selected.length} selected</span>
            ) : null;
          }}
          renderOption={(props, option, { selected }) => (
            <li
              {...props}
              style={{
                backgroundColor: selected ? "#e0f7fa" : "inherit",
                fontWeight: selected ? "bold" : "normal",
                fontSize: "14px",
              }}
            >
              {option.name}
            </li>
          )}
        />
        <Box display="flex" justifyContent="space-between" mb={2}>
                  <TextField
                    label="User Description"
                    name="userDescription"
                    value={formik.values.userDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={5}
                    error={
                      formik.touched.userDescription && Boolean(formik.errors.userDescription)
                    }
                    helperText={formik.touched.userDescription && formik.errors.userDescription}
                  />
                </Box>
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
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Update Profile
          </Button>
        </Box>
      </Box>
    </PopContent>
  );
};

export default UpdateMemberForm;
