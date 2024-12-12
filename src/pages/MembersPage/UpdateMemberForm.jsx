import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  styled,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
  //const { id } = useParams();
  const [availableCommittees, setAvailableCommittees] = useState([]);
  const [userCommittees, setUserCommittees] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, committeesResponse] = await Promise.all([
          axios.get(`/api/v1/user/${id}`),
          axios.get("/api/v1/committee/committees"),
        ]);

        const userData = userResponse.data.data;
        const committees = committeesResponse.data.data.committees || [];
        setAvailableCommittees(committees);

        // Find the full committee objects that match the user's committee names
        const userCommitteeObjects = userData.committees
          .map((committeeName) =>
            committees.find((committee) => committee.name === committeeName)
          )
          .filter(Boolean);

        // Set initial values with committee objects
        formik.setValues({
          fullname: userData.fullname,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          committees: userCommitteeObjects,
        });

        setUserCommittees(userCommitteeObjects);
      } catch (error) {
        toast.error("Failed to load data.");
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      phoneNumber: "",
      committees: [],
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .required("Phone number is required")
        .length(10, "Phone number must be 10 digits"),
      committees: Yup.array()
        .of(Yup.object())
        .required("Select at least one committee"),
    }),
    onSubmit: async (values) => {
      try {
        // Extract committee IDs
        const committeeIds = values.committees.map((committee) => committee.id);

        // Create payload object
        const payload = {
          fullname: values.fullname,
          email: values.email,
          phoneNumber: values.phoneNumber,
          committees: committeeIds,
        };

        console.log("Sending payload:", payload);

        const response = await axios.put(
          `/api/v1/user/update-profile/${id}`,
          payload, // Send as JSON
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response:", response.data);
        toast.success("Profile updated successfully!");
        setRefreshPage(Math.random());
        setIsEditOpen(false);
      } catch (error) {
        toast.error("Failed to update profile.");
        console.error("Error updating profile:", error);
      }
    },
  });

  return (
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
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        fullWidth
        size="small"
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
        isOptionEqualToValue={(option, value) => option.id === value.id}
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
            style: { maxHeight: 100, overflowY: "scroll" }, // Scrollable dropdown
          },
        }}
        style={{ marginTop: "1rem" }}
        renderTags={(selected, getTagProps) => (
          <div
            style={{
              maxHeight: "100px",
              overflowY: "auto",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {selected.map((option, index) => (
              <Chip
                key={option.id}
                label={option.name}
                {...getTagProps({ index })}
                size="medium"
              />
            ))}
          </div>
        )}
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

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained" color="primary">
          Update Profile
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateMemberForm;
