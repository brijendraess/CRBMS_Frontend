import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const AddStock = ({ setRefreshPage, setIsAddOpen }) => {
  const { user } = useSelector((state) => state.user);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const dispatch = useDispatch();

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      stockType: "amenity",
      stock: "",
      itemId: "",
    },
    validationSchema: Yup.object({
      itemId: Yup.string().required("Please select an amenity"),
      stock: Yup.number()
        .required("Stock is required")
        .min(1, "Stock must be at least 1")
        .typeError("Stock must be a number"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        const formData = {
          ...values,
          createdBy: user.id,
        };
        const result = await axios.post("api/v1/stock/add", formData);
        toast.success("Stock added successfully");
        setRefreshPage(Math.random());
        resetForm();
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding amenity stock:", err);
      } finally {
        setIsAddOpen(false);
        dispatch(hideLoading());
      }
    },
  });

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        showLoading();
        const response = await axios.get(
          "api/v1/amenity/get-all-active-amenities"
        );
        const amenities = response.data.data.result.map((amenity) => ({
          id: amenity.id,
          label: amenity.name,
        }));
        setAmenitiesList(amenities);
      } catch (error) {
        console.error("Error fetching amenities:", error);
      } finally {
        hideLoading();
      }
    };

    fetchAmenities();
  }, []);

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <FormControl
          error={!!formik.errors.itemId && formik.touched.itemId}
          fullWidth
          size="small"
        >
          <InputLabel id="amenity-select-label">Amenity Name</InputLabel>
          <Select
            label="Amenity Name"
            labelId="amenity-select-label"
            id="itemId"
            name="itemId"
            value={formik.values.itemId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="small"
            required
          >
            {amenitiesList.map((amenity) => (
              <MenuItem key={amenity.id} value={amenity.id}>
                {amenity.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.itemId && formik.errors.itemId && (
            <p style={{ color: "red", fontSize: "0.875rem" }}>
              {formik.errors.itemId}
            </p>
          )}
        </FormControl>
        <TextField
          label="Stock"
          type="number"
          name="stock"
          value={formik.values.stock}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          margin="normal"
          size="small"
          error={!!formik.errors.stock && formik.touched.stock}
          helperText={formik.touched.stock && formik.errors.stock}
        />
        <FormButton type='submit' btnName='Add Stock' />
      </Box>
    </PopContent>
  );
};

export default AddStock;
