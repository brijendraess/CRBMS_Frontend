import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const ServicesEdit = ({
  id,
  servicesName,
  onSuccess,
  setRefreshPage,
  setIsEditOpen,
}) => {
  const formik = useFormik({
    initialValues: {
      servicesName: servicesName || "",
    },
    enableReinitialize: true, // Allows reinitialization when `servicesName` changes
    validationSchema: Yup.object({
      servicesName: Yup.string()
        .required("Services name is required")
        .min(3, "Services name must be at least 3 characters")
        .max(50, "Services name must be at most 50 characters"),
    }),
    onSubmit: async (values) => {
      try {
        showLoading();
        const response = await axios.put(
          `/api/v1/services/edit/${id}`, values);
        toast.success("Services Updated Successfully");
        setRefreshPage(Math.random());
        setIsEditOpen(false);
        if (onSuccess) {
          onSuccess(response.data.data.result);
        }
        hideLoading();
      } catch (error) {
        hideLoading();
        const errorMessage =
          error.response?.data?.message || "Failed to update services!";
        toast.error(errorMessage);
        console.error("Error updating services:", error);
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
          name="servicesName"
          value={formik.values.servicesName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.servicesName && Boolean(formik.errors.servicesName)}
          helperText={formik.touched.servicesName && formik.errors.servicesName}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <FormButton type='submit' btnName='Update Services' />
      </Box>
    </PopContent>
  );
};

export default ServicesEdit;
