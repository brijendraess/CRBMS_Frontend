import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const ServicesAdd = ({ setRefreshPage, setIsAddOpen }) => {
  const formik = useFormik({
    initialValues: {
      servicesName: "", // Initial value for the field
      status: true
    },
    validationSchema: Yup.object({
      servicesName: Yup.string()
        .required("Services name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
    }),
    status: Yup.boolean().optional(),
    onSubmit: async (values, { resetForm }) => {
      try {
        showLoading();
        await axios.post("api/v1/services/add-services", values);
        toast.success("Services added Successfully");
        resetForm(); // Reset form after successful submission
        setRefreshPage(Math.random());
        setIsAddOpen(false);
        hideLoading();
      } catch (err) {
        hideLoading();
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding services:", err);
      }
    },
  });

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
      >
        <TextField
          label="Services Name"
          name="servicesName" // Field name must match Formik's initialValues
          value={formik.values.servicesName} // Managed by Formik
          onChange={formik.handleChange} // Managed by Formik
          onBlur={formik.handleBlur} // Tracks field's touch state
          error={formik.touched.servicesName && Boolean(formik.errors.servicesName)} // Show error if touched and invalid
          helperText={formik.touched.servicesName && formik.errors.servicesName} // Display validation error
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <FormButton type='submit' btnName='Add Services' />
      </Box>
    </PopContent>
  );
};

export default ServicesAdd;
