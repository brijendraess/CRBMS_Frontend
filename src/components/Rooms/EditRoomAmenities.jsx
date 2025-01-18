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
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

const EditRoomAmenities = ({
  room,
  setRefreshPage,
  setOpenEdit,
  editId,
  editInfo,
}) => {
  const { user } = useSelector((state) => state.user);
  const [amenitiesStockCount, setAmenitiesStockCount] = useState(0);
  const [amenitiesList, setAmenitiesList] = useState([]);
   const dispatch = useDispatch();

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      amenityId: editInfo.amenityId || "",
      quantity: editInfo.quantity || "",
    },
    validationSchema: Yup.object({
      amenityId: Yup.string().required("Please select an amenity"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1")
        .max(
          amenitiesStockCount,
          `Quantity must be below from stock(${amenitiesStockCount})`
        )
        .typeError("Quantity must be a number"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        const formData = {
          ...values,
          roomId: room.id,
          status: true,
          createdBy: user.id,
        };
        await axios.put(
          `api/v1/rooms/edit-amenity-quantity/${editId}`,
          formData
        ).then(async()=>{
          await axios.post("api/v1/stock/increment", {
            stock: Number(editInfo.quantity)-Number(values.quantity),
            id:"",
            amenityId:values.amenityId,
            roomId:room.id,
            createdBy: user.id,
          })
        })
        toast.success("Quantity updated Successfully");
        setRefreshPage(Math.random());
        resetForm();
      } catch (err) {
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error editing amenities:", err);
      } finally {
        setOpenEdit(false);
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
        const amenities = response.data.data.result.map((amenity) => {
          return { id: amenity.id, label: amenity.name };
        });
        setAmenitiesList(amenities);
        hideLoading();
      } catch (error) {
        toast.error("Failed to load amenities");
        console.error("Error fetching amenities:", error);
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
          const amenities = response?.data?.data?.result[0]?.stock;
          setAmenitiesStockCount(
            amenities ? amenities + Number(editInfo?.quantity) : 0
          );
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      } finally {
        hideLoading();
      }
    };

    fetchAmenities();
    fetchStockAmenities();
  }, [formik.values.amenityId, formik.values.quantity]);

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        maxWidth: 500,
        margin: "auto",
        borderRadius: 3,
      }}
    >
      <FormControl sx={{ m: 1, width: "100%" }}>
        <InputLabel id="demo-multiple-name-label">Amenity Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="amenityId"
          name="amenityId"
          value={formik.values.amenityId}
          label="Amenity Name"
          required
          size="small"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {amenitiesList.map((amenity) => (
            <MenuItem value={amenity.id}>{amenity.label}</MenuItem>
          ))}
        </Select>
        {formik.touched.amenityId && formik.errors.amenityId && (
            <p style={{ color: "red", fontSize: "0.875rem" }}>
              {formik.errors.amenityId}
            </p>
          )}
        <TextField
          label="Quantity"
          type="number"
          name="quantity" // Match the key in formData
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
          fullWidth
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </FormControl>
    </Box>
  );
};

export default EditRoomAmenities;
