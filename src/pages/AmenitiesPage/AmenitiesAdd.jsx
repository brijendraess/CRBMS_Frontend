import React from "react";
import axios from "axios";
import { TextField, Button, Box } from "@mui/material";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const AmenitiesAdd = ({ setIsAddOpen, setIsRefreshed }) => {
  const dispatch = useDispatch();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Amenity name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be at most 500 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        await axios.post("api/v1/amenity/add-amenity", values);
        toast.success("Amenity added successfully!");
        resetForm(); // Reset form fields
        setIsRefreshed((prev) => prev + 1); // Trigger parent component refresh
        setIsAddOpen(false); // Close modal
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        // toast.error(err.response?.data?.message || "Failed to add amenity!");
        console.error("Error adding amenity:", err);
      }
    },
  });

  return (
    <div className="pop-content w-100">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
      >
        {/* Amenity Name */}
        <TextField
          label="Amenity Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />

        {/* Submit Button */}
        <FormButton
          type="submit"
          btnName={"Add Amenity"}
        />
      </Box>
    </div>
  );
};

export default AmenitiesAdd;
