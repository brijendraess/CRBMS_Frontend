import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { fetchActiveCommittee, fetchUsers } from "../../utils/utils";

const MeetingApproval = ({ updatedBookingId, meetingUpdatedStatus, setRefreshPage,setIsApprovalBookingOpen }) => {
  const [emailsList, setEmailsList] = useState([]);
  const [committeeList, setCommitteeList] = useState([]);
  const [initialValueState, setInitialValueState] = useState("");
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchActiveCommittee(toast, setCommitteeList);
    fetchUsers(toast, setEmailsList);
  }, []);

  const formik = useFormik({
    initialValues:{meetingStatus:meetingUpdatedStatus},
    enableReinitialize: true,
    validationSchema: Yup.object({
      meetingStatus: Yup.string().required("Meeting Status is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      //console.log("Form Submitted:", values);

      try {
        const payload = {
          ...values,
          meetingStatus: values.meetingStatus,
        };
        //console.log("payload", payload);
        const response = await axios.put(
          `/api/v1/meeting/update-meeting-status/${updatedBookingId}`,
          payload,
          {
            withCredentials: true,
          }
        );
        setRefreshPage(Math.random());
        setIsApprovalBookingOpen(false);
        toast.success("Meeting status changed successfully");
        resetForm();
      } catch (error) {
        // toast.error(error.response?.data?.message || "An error occurred");
        console.error("Error status meeting:", error);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <InputLabel id="meetingStatus-select-label">Meeting Status</InputLabel>
      <Select
        labelId="meetingStatus-select-label"
        id="meetingStatus"
        value={formik?.values?.meetingStatus}
        label="Meeting Status"
        name="meetingStatus"
        fullWidth
        onChange={formik.handleChange}
        error={
          formik.touched.meetingStatus && Boolean(formik.errors.meetingStatus)
        }
        required
      >
        <MenuItem value={"pending"}>pending</MenuItem>
        <MenuItem value={"scheduled"}>scheduled</MenuItem>
        <MenuItem value={"start"}>Start</MenuItem>
        <MenuItem value={"completed"}>completed</MenuItem>
        <MenuItem value={"cancelled"}>cancelled</MenuItem>
      </Select>
      {/* Submit Button */}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained" color="primary">
          Change Status
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingApproval;
