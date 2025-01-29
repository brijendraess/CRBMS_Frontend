import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PopContent } from "../../Style";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const AddCommitteeForm = ({
  onAddCommittee,
  committeeId,
  setRefreshPage,
  setIsEditOpen,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Committee name is required")
        .min(3, "Name must be at least 3 characters")
        .max(75, "Name must be at most 75 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be at most 500 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        const formData = { ...values, createdByUserId: user.id };
        if (committeeId) {
          await axios.put(
            `/api/v1/committee/committees/${committeeId}`,
            formData
          );
          toast.success("Committee updated successfully!");
          setIsEditOpen(false);
        } else {
          const response = await axios.post(
            "/api/v1/committee/committees",
            formData
          );
          toast.success("Committee added successfully!");
          onAddCommittee(response.data.data.committee);
        }
        resetForm();
        setRefreshPage(Math.random());
        dispatch(hideLoading());
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to save committee.");
        dispatch(hideLoading());
        console.error("Error saving committee:", err);
      } finally {
        dispatch(hideLoading());
        hideLoading();
      }
    },
  });

  useEffect(() => {
    const fetchCommittee = async () => {
      if (committeeId) {
        try {
          dispatch(showLoading());
          const response = await axios.get(
            `/api/v1/committee/committees/${committeeId}`
          );
          const committee = response.data.data.committee;
          formik.setValues({
            name: committee.name,
            description: committee.description,
          });
          dispatch(hideLoading());
        } catch (err) {
          toast.error("Failed to fetch committee details.");
          console.error("Error fetching committee:", err);
          dispatch(hideLoading());
        } finally {
          dispatch(hideLoading());
        }
      }
    };

    fetchCommittee();
  }, [committeeId]);

  return (
    <PopContent>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Committee Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          margin="normal"
          size="small"
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          margin="normal"
          multiline
          rows={5}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <FormButton type="submit" btnName={committeeId ? "Update Committee" : "Add Committee"} />

      </form>
    </PopContent>
  );
};

export default AddCommitteeForm;
