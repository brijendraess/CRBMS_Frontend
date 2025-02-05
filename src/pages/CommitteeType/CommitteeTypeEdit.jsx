import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const CommitteeTypeEdit = ({
  id,
  committeeTypeName,
  onSuccess,
  setRefreshPage,
  setIsEditOpen,
}) => {

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: committeeTypeName || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("CommitteeType name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
    }),
    onSubmit: async (values) => {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", values.name);

      try {
        console.log(values)
        showLoading();
        const response = await axios.put(
          `/api/v1/committeeType/committeeTypes/${id}`,
          { "name": values.name },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Committee Type updated successfully!");
        setRefreshPage(Math.random());
        setIsEditOpen(false);
        if (onSuccess) {
          onSuccess(response.data.data.committeeType);
        }
        hideLoading();
      } catch (error) {
        hideLoading();
        const errorMessage =
          error.response?.data?.message || "Failed to update committee Type!";
        // toast.error(errorMessage);
        console.error("Error updating committee Type:", error);
      }
    },
  });

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <TextField
          label="CommitteeType Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          margin="normal"
          size="small"
        />

        <FormButton type="submit" btnName=" Update Committee Type" />
      </Box>
    </PopContent>
  );
};

export default CommitteeTypeEdit;
