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
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const MeetingApproval = ({ updatedBookingId, meetingUpdatedStatus, setRefreshPage, setIsApprovalBookingOpen }) => {
  const [emailsList, setEmailsList] = useState([]);
  const [committeeList, setCommitteeList] = useState([]);
  const [initialValueState, setInitialValueState] = useState("");
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchActiveCommittee(toast, setCommitteeList);
    fetchUsers(toast, setEmailsList);
  }, []);

  const formik = useFormik({
    initialValues: { meetingStatus: meetingUpdatedStatus },
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
    <PopContent>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="meetingStatus-select-label">Meeting Status</InputLabel>
          <Select
            size="small"
            label="Meeting Status"
            labelId="meetingStatus-select-label"
            id="meetingStatus"
            value={formik?.values?.meetingStatus}
            // label="Meeting Status"
            name="meetingStatus"
            fullWidth
            onChange={formik.handleChange}
            error={
              formik.touched.meetingStatus && Boolean(formik.errors.meetingStatus)
            }
            required
          >
            <MenuItem value={"pending"}>Pending</MenuItem>
            <MenuItem value={"scheduled"}>Scheduled</MenuItem>
            <MenuItem value={"start"}>Start</MenuItem>
            <MenuItem value={"completed"}>Completed</MenuItem>
            <MenuItem value={"cancelled"}>Cancelled</MenuItem>
          </Select>
        </FormControl>
        {/* Submit Button */}
        <FormButton type="submit" btnName="Change Status" />
      </Box>
    </PopContent >
  );
};

export default MeetingApproval;
