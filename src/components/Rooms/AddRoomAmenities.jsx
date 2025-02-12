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
import FormButton from "../Common/Buttons/FormButton/FormButton";

const AddRoomAmenities = ({
  room,
  setRefreshPage,
  setIsAmenityQuantityOpen,
}) => {
  const { user } = useSelector((state) => state.user);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [amenitiesStockCount, setAmenitiesStockCount] = useState(0);
  const dispatch = useDispatch();

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      amenityId: "",
      quantity: "",
    },
    validationSchema: Yup.object({
      amenityId: Yup.string().required("Please select an amenity"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1")
        .max(amenitiesStockCount, `Quantity must be below from stock(${amenitiesStockCount})`)
        .typeError("Quantity must be a number"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        const formData = {
          ...values,
          roomId: room.id,
          status: false,
          createdBy: user.id,
        };
        await axios.post("api/v1/rooms/add-amenity-quantity", formData).then(async () => {
          await axios.post("api/v1/stock/increment", {
            stock: -Number(values.quantity),
            id: "",
            amenityId: values.amenityId,
            roomId: room.id,
            createdBy: user.id,
          })
        })
        toast.success("Quantity added successfully");
        setRefreshPage(Math.random());
        resetForm();
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        // toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding amenity quantity:", err);
      } finally {
        setIsAmenityQuantityOpen(false);
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

    const fetchStockAmenities = async () => {
      try {
        showLoading();
        if (formik.values.amenityId) {
          const response = await axios.get(
            `api/v1/stock/checkStock/${formik.values.amenityId}`
          );
          const amenities = response?.data?.data?.result[0]?.stock
          setAmenitiesStockCount(amenities ? amenities : 0);
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      } finally {
        hideLoading();
      }
    };

    fetchAmenities();
    fetchStockAmenities()
  }, [formik.values.amenityId, formik.values.quantity]);

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <FormControl
          error={!!formik.errors.amenityId && formik.touched.amenityId}
          fullWidth
          size="small"
        >
          <InputLabel id="amenity-select-label">Amenity Name</InputLabel>
          <Select
            label="Amenity Name"
            labelId="amenity-select-label"
            id="amenityId"
            name="amenityId"
            value={formik.values.amenityId}
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
          {formik.touched.amenityId && formik.errors.amenityId && (
            <p style={{ color: "red", fontSize: "0.875rem" }}>
              {formik.errors.amenityId}
            </p>
          )}
        </FormControl>
        <TextField
          label="Quantity"
          type="number"
          name="quantity"
          value={formik.values.quantity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          margin="normal"
          size="small"
          error={!!formik.errors.quantity && formik.touched.quantity}
          helperText={formik.touched.quantity && formik.errors.quantity}
        />
        <FormButton type='submit' btnName={"Add Quantity"} />
      </Box>
    </PopContent>
  );
};

export default AddRoomAmenities;
