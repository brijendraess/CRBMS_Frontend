import { Box, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const CommitteeTypeAdd = ({ setRefreshPage, setIsAddOpen }) => {
    const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
        committeeTypeName: "",
    },
    validationSchema: Yup.object({
        committeeTypeName: Yup.string()
        .required("Committee Type name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("committeeTypeName", values.committeeTypeName);
      try {
        dispatch(showLoading());
        const response = await axios.post(
          "api/v1/committeeType/committeeTypes",
          {"committeeTypeName": values.committeeTypeName}, {
            withCredentials: true,
          }
        );
        toast.success("Committee Type added successfully!");
        resetForm();
        setRefreshPage(Math.random());
        setIsAddOpen(false);
        hideLoading();
      } catch (err) {
        hideLoading();
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding Committee Type:", err);
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
          label="Committee Type Name"
          name="committeeTypeName"
          value={formik.values.committeeTypeName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.committeeTypeName && Boolean(formik.errors.committeeTypeName)}
          helperText={formik.touched.committeeTypeName && formik.errors.committeeTypeName}
          fullWidth
          margin="normal"
          size="small"
        />
        <FormButton type='submit' btnName='Add Committee Type' />
      </Box>
    </PopContent>
  );
};

export default CommitteeTypeAdd;
