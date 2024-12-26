import React, { useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box } from "@mui/material";
import toast from "react-hot-toast";
import { PopContent } from "../../Style";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const AmenitiesEdit = ({
  id,
  setRefreshPage,
  setIsEditOpen,
  setIsRefreshed,
}) => {
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
    onSubmit: async (values) => {
      try {
        dispatch(showLoading());
        await axios.put(`/api/v1/amenity/update-amenity/${id}`, values);
        toast.success("Amenity edited successfully!");
        setIsRefreshed((prev) => prev + 1); // Trigger refresh
        setIsEditOpen(false); // Close modal
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.response?.data?.message || "Failed to edit amenity!");
        console.error("Error editing amenity:", err);
      }
    },
  });

  // Fetch amenity details when component mounts
  useEffect(() => {
    const fetchAmenity = async () => {
      if (id) {
        dispatch(showLoading());
        try {
          const response = await axios.get(
            `/api/v1/amenity/get-single-amenity/${id}`
          );
          const amenity = response.data.data.roomAmenity;
          formik.setValues({
            name: amenity.name,
            description: amenity.description,
            quantity: amenity.quantity || 1,
          });
          dispatch(hideLoading());
        } catch (err) {
          dispatch(hideLoading());
          toast.error("Failed to fetch amenity details.");
          console.error("Error fetching amenity:", err);
        }
      }
    };

    fetchAmenity();
  }, [id, setRefreshPage]);

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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Update Amenity
        </Button>
      </Box>
    </PopContent>
  );
};

export default AmenitiesEdit;
