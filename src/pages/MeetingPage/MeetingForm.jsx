import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { disablePastDates, fetchActiveCommittee, fetchAttendeesType, fetchUsers } from "../../utils/utils";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const MeetingForm = ({ room, selectedFilterMeetingDate,
  selectedFilterMeetingStartTime,
  selectedFilterMeetingEndingTime }) => {
  const [emailsList, setEmailsList] = useState([]);
  const [attendeesTypeList, setAttendeesTypeList] = useState([]);
  const [committeeMembersList, setCommitteeMembersList] = useState([]);
  const [committeeList, setCommitteeList] = useState([]);
  const [startTime, setStartTime] = useState(""); // Example start time
  const [endTime, setEndTime] = useState(""); // Example end time
  const [difference, setDifference] = useState("0h 0m");
  const [originalEmailsList, setOriginalEmailsList] = useState([]);
  const [originalCommitteeList, setOriginalCommitteeList] = useState([]);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    fetchActiveCommittee(toast, (users) => {
      setOriginalCommitteeList(users);
      setCommitteeList(users);
    });
    // fetchUsers(toast, setEmailsList);
    fetchUsers(toast, (users) => {
      setOriginalEmailsList(users);
      setEmailsList(users);
    });
    fetchAttendeesType(toast, setAttendeesTypeList);
  }, []);

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      roomId: room.id,
      organizerId: user.id,
      subject: "",
      agenda: "",
      guestUser: "",
      startTime: selectedFilterMeetingStartTime ? selectedFilterMeetingStartTime : null,
      endTime: selectedFilterMeetingEndingTime ? selectedFilterMeetingEndingTime : null,
      date: selectedFilterMeetingDate ? selectedFilterMeetingDate : null,
      attendees: [],
      committees: [],
      attendeesType: [],
      notes: "",
      additionalEquipment: "",
      isPrivate: false,
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Meeting Title is required"),
      agenda: Yup.string().required("Agenda is required"),
      startTime: Yup.date().required("Start Time is required"),
      endTime: Yup.date()
        .required("End Time is required")
        .min(Yup.ref("startTime"), "End Time must be after Start Time"),
      date: Yup.date().required("Meeting Date is required"),
      attendees: Yup.array().optional(),
      attendeesType: Yup.array().optional(),
      committees: Yup.array().min(1, "At least one committee must be selected"),
      notes: Yup.string(),
      guestUser: Yup.string(),
      additionalEquipment: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("Form Submitted:", values);

      try {
        dispatch(showLoading());
        const payload = {
          ...values,
          attendees: values.attendees.map((attendee) => attendee.id),
          committees: values.committees.map((committee) => committee.id),
          attendeesType: values.attendeesType.map((attendeeType) => attendeeType.id),
        };
        console.log("payload", payload);
        const response = await axios.post(
          "/api/v1/meeting/add-meeting",
          payload,
          {
            withCredentials: true,
          }
        );

        toast.success("Meeting added successfully");
        resetForm();
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        // toast.error(error.response?.data?.message || "An error occurred");
        console.error("Error adding meeting:", error);
      }
    },
  });

  const fetchIsAvailable = async () => {
    if (!formik.values.startTime || !formik.values.endTime || !formik.values.date) return;

    try {
      const response = await axios.post(`/api/v1/user/isAvailable`, {
        attendees: originalEmailsList.map((attendee) => attendee.id),
        startTime: formik.values.startTime,
        endTime: formik.values.endTime,
        meetingDate: formik.values.date,
      });

      const notAvailableAttendees = response?.data?.data?.notAvailableAttendees;
      let finalEmails = [];
      if (notAvailableAttendees.length == 0) {
        const formattedEmailList = originalEmailsList.map((emailData) => {
          return {
            ...emailData,
            isAvailable: true
          }
        });

        if(formik.values.attendeesType.length > 0){
          for(let attendeeType of formik.values.attendeesType){
            for(let email of formattedEmailList){
              if(email.userType === attendeeType.id){
                finalEmails.push(email)
              }
            }
          }
          setEmailsList(finalEmails);
        }
        else{
          setEmailsList(formattedEmailList)
        }
      }

      if (notAvailableAttendees.length > 0) {
        let formattedEmails = [];
        for (let email of originalEmailsList) {
          let isAvailable = true;

          const notAvailable = notAvailableAttendees.find((attendee) => attendee.attendeeId === email.id);
          if (notAvailable) {
            isAvailable = false
          }

          formattedEmails.push({ ...email, isAvailable: isAvailable })
        }
        if(formik.values.attendeesType.length > 0){
          for(let attendeeType of formik.values.attendeesType){
            for(let email of formattedEmails){
              if(email.userType === attendeeType.id){
                finalEmails.push(email)
              }
            }
          }
          setEmailsList(finalEmails)
        }
        else{
          setEmailsList(formattedEmails)
        }
       
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  const fetchCommitteeIsAvailable = async () => {
    if (!formik.values.startTime || !formik.values.endTime || !formik.values.date) return;

    try {
      const response = await axios.post(`/api/v1/committee/isAvailable`, {
        committees: originalCommitteeList.map((committee) => committee.id),
        startTime: formik.values.startTime,
        endTime: formik.values.endTime,
        meetingDate: formik.values.date,
      });

      const notAvailableCommittees = response?.data?.data?.notAvailableCommittees;
      if (notAvailableCommittees.length == 0) {
        const formattedCommitteeList = await originalCommitteeList.map((committeeData) => {
          return {
            ...committeeData,
            isAvailable: true,
            CommitteeType: {
              name: committeeData?.CommitteeType?.name
            },
            committeeMembers: committeeData?.CommitteeMembers
          }
        });
        setCommitteeList(formattedCommitteeList)
      }

      if (notAvailableCommittees.length > 0) {
        let formattedCommittees = [];
        for (let committee of originalCommitteeList) {
          let isAvailable = true;

          const notAvailable = await notAvailableCommittees.find((committeeData) => committeeData.committeeId === committee.id);
          if (notAvailable) {
            isAvailable = false
          }

          formattedCommittees.push({ ...committee, isAvailable: isAvailable,
            CommitteeType: {
              name: committee?.CommitteeType?.name
            },
            committeeMembers: committee?.CommitteeMembers
           })
        }

        setCommitteeList(formattedCommittees)
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  // const fetchSelectedCommitteeMembers = async () => {
  //   if(formik.values.committees.length > 0){
  //     let committeeMembersData = [];
  //     for(let committeeData of formik.values.committees){
  //       committeeMembersData.push({
  //         committeeeName: committeeData.name,
  //         id: committeeData.id,
  //         committeeTypeName: committeeData.CommitteeType.name,
  //         committeeMembers: committeeData.committeeMembers
  //       })
  //     }
  //     setCommitteeMembersList(committeeMembersData)
  //   }
  // }

  useEffect(() => {

    // if (committeeList.length > 0) {
    //   fetchCommitteeIsAvailable(committeeList);
    // }
    if (formik.values.date && formik.values.startTime && formik.values.endTime && originalCommitteeList.length > 0) {
      fetchCommitteeIsAvailable();
    }
  }, [
    formik.values.startTime,
    formik.values.endTime,
    formik.values.date,
    originalCommitteeList
  ]);

  useEffect(() => {
      fetchIsAvailable();
  }, [
    formik.values.attendeesType,
  ]);

  useEffect(() => {
      if (formik.values.date && formik.values.startTime && formik.values.endTime && originalEmailsList.length > 0) {
        fetchIsAvailable();
      }
  }, [formik.values.date, formik.values.startTime, formik.values.endTime, originalEmailsList]);

//   useEffect(() => {
//     fetchSelectedCommitteeMembers();
// }, [
//   formik.values.committees,
// ]);


  const calculateDifference = () => {
    // Parse times into Date objects (using today's date)
    const today = new Date()?.toISOString()?.split("T")[0]; // Get today's date in YYYY-MM-DD
    const start = new Date(`${today}T${startTime}`);
    const end = new Date(`${today}T${endTime}`);

    // Calculate the difference in milliseconds
    const diffMs = end - start;

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    if (formik.values.startTime && formik.values.endTime)
      setDifference(`${hours}h ${minutes}m`);
  };

  useEffect(() => {
    setStartTime(
      new Date(formik.values.startTime)?.toTimeString()?.split(" ")[0]
    );
    setEndTime(new Date(formik.values.endTime)?.toTimeString()?.split(" ")[0]);
    calculateDifference();
  }, [formik]);

  return (
    <PopContent>
      <Box component="form" onSubmit={formik.handleSubmit}>
        {/* Date */}
        {formik.values.date && formik.values.startTime && formik.values.endTime ? 
            <></>
          :
          <Typography variant="subtitle1" component="p" mb={0} size='small' style={{color: "orange", fontSize: "small"}}>
            Fill meeting timings to get availability of Attendees and Committees.
          </Typography>
        }
        <Box display="flex" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              size='small'
              label="Date"
              value={formik.values.date}
              onChange={(value) => formik.setFieldValue("date", value)}
              shouldDisableDate={disablePastDates}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  fullWidth
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  size="small"
                />
              )}
            />
          </LocalizationProvider>

          {/* Start Time & End Time */}
          <Box display="flex" justifyContent="space-around" gap={1}>
            <TimePicker
              label="Start Time"
              value={formik.values.startTime}
              onChange={(value) => formik.setFieldValue("startTime", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  size="small"
                  style={{ marginRight: 8, flex: 1 }}
                  error={
                    formik.touched.startTime && Boolean(formik.errors.startTime)
                  }
                  helperText={formik.touched.startTime && formik.errors.startTime}
                />
              )}
            />

            <TimePicker
              label="End Time"
              value={formik.values.endTime}
              onChange={(value) => formik.setFieldValue("endTime", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  size="small"
                  style={{ flex: 1 }}
                  error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                  helperText={formik.touched.endTime && formik.errors.endTime}
                />
              )}
            />
          </Box>
          <Paper
            gap={1}
            sx={{
              background: "#fd7e14",
              color: "#fff",
              display: 'flex',
              borderRadius: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1,
              flexDirection: {
                xs: 'row',
                sm: 'column'
              }
            }}
          >
            <Typography variant="subtitle2" component="p" textAlign={'center'}>
              Duration
            </Typography>
            <Typography variant="body2" component="p" textAlign={'center'}>
              {difference}
            </Typography>
          </Paper>
        </Box>

        <Box display="flex" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'column' }} gap={1} mt={1} >
          {/* Meeting Title */}
          <TextField
            label="Subject"
            name="subject"
            // margin="normal"
            fullWidth
            value={formik.values.subject}
            onChange={formik.handleChange}
            error={formik.touched.subject && Boolean(formik.errors.subject)}
            helperText={formik.touched.subject && formik.errors.subject}
            size="small"
            required
          />
          {/* Agenda */}
          <TextField
            label="Agenda"
            name="agenda"
            // margin="normal"
            fullWidth
            value={formik.values.agenda}
            onChange={formik.handleChange}
            error={formik.touched.agenda && Boolean(formik.errors.agenda)}
            helperText={formik.touched.agenda && formik.errors.agenda}
            required
            size="small"
          />
        </Box>
        <Box display="flex" gap={1} justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} mt={1}>
          <Autocomplete
            multiple
            id="attendeesType"
            name="attendeesType"
            size="small"
            sx={{
              width: "100%",
            }}
            options={attendeesTypeList}
            value={formik.values.attendeesType}
            onChange={(_, newValue) => formik.setFieldValue("attendeesType", newValue)}
            getOptionLabel={(option) => option?.userTypeName}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span>{option?.userTypeName}</span>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Attendees Type"
                error={formik.touched.attendeesType && Boolean(formik.errors.attendeesType)}
                helperText={formik.touched.attendeesType && formik.errors.attendeesType}
              />
            )}
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Box>
        <Box display="flex" gap={1} justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} mt={1}>
          <Autocomplete
            multiple
            id="attendees"
            name="attendees"
            size="small"
            sx={{
              width: "100%",
            }}
            options={emailsList}
            value={formik.values.attendees}
            onChange={(_, newValue) => formik.setFieldValue("attendees", newValue)}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span>{option.name}</span>
                <Chip
                  label={option.isAvailable ? "Available" : "Unavailable"}
                  color={option.isAvailable ? "success" : "error"}
                  size="small"
                />
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Attendees"
                error={formik.touched.attendees && Boolean(formik.errors.attendees)}
                helperText={formik.touched.attendees && formik.errors.attendees}
              />
            )}
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            multiple
            id="committees"
            name="committees"
            size="small"
            sx={{
              width: "100%", // Adjust the width as needed
            }}
            options={committeeList}
            value={formik.values.committees}
            onChange={(_, newValue) =>
              formik.setFieldValue("committees", newValue)
            }
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <>
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>
                    {/* Render the attendee's name */}
                    <span>{option.name + " (" + option?.CommitteeType?.name + ")"}</span>
                  </div>
                  <div sx={{ width: "100%", float: "right" }}>
                    {/* Render a hardcoded Chip for availability */}
                    <Chip
                      label={option.isAvailable ? "Available" : "Unavailable"}
                      color={option.isAvailable ? "success" : "error"}
                      size="small"
                    />
                  </div>
                </Box>
                <Divider variant = "middle" component="li" sx={{ background: "black" }} />
              </>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Committee"
                error={
                  formik.touched.committees && Boolean(formik.errors.committees)
                }
                helperText={formik.touched.committees && formik.errors.committees}
              />
            )}
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Box>
        {formik.values.committees.length > 0 && (
          <Box mt={1} p={2} sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="subtitle2">Selected Committee Members:</Typography>

            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                backgroundColor: "#fff",
                maxHeight: "200px", // Set a max height for scrolling
                overflowY: "auto",
                paddingRight: "8px",
                "&::-webkit-scrollbar": {
                  width: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bbb",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              {formik.values.committees.map((committee) => (
                <Box key={committee.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {committee.name} ({committee?.CommitteeType?.name})
                  </Typography>

                  {committee.CommitteeMembers?.length > 0 ? (
                    committee.CommitteeMembers.map((member) => (
                      <Typography key={member?.User?.id} variant="body2">
                        - {member?.User?.fullname} ({member?.User?.email})
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No members assigned.
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}



        <Box display="flex" gap={1} justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} mt={1}>
          {/* Description */}
          <TextField
            label="Notes"
            name="notes"
            // margin="normal"
            fullWidth
            multiline
            rows={3}
            value={formik.values.notes}
            onChange={formik.handleChange}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
            size="small"
          />

          {/* Description */}
          <TextField
            label="Additional Equipment Needed"
            name="additionalEquipment"
            // margin="normal"
            fullWidth
            multiline
            rows={3}
            value={formik.values.additionalEquipment}
            onChange={formik.handleChange}
            error={
              formik.touched.additionalEquipment &&
              Boolean(formik.errors.additionalEquipment)
            }
            helperText={
              formik.touched.additionalEquipment &&
              formik.errors.additionalEquipment
            }
            size="small"
          />
        </Box>
        {/* Private Meeting */}
        <Box display="flex" gap={1} justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} mt={1}>
          <Box component="p">
            <Typography variant="subtitle1" component="p" mb={0}>
              Is this a private meeting?
            </Typography>
            <RadioGroup
              name="isPrivate"
              value={formik.values.isPrivate}
              onChange={(e) =>
                formik.setFieldValue("isPrivate", e.target.value === "true")
              }
              row
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
          <Box component="p" mb={2}>
            <Typography variant="subtitle1" component="p">
              Guest user(Comma separate email Id)
            </Typography>
            <TextField
              label="guestUser"
              name="guestUser"
              // margin="normal"
              fullWidth
              sx={{ width: "100%" }}
              value={formik.values.guestUser}
              onChange={formik.handleChange}
              error={formik.touched.guestUser && Boolean(formik.errors.guestUser)}
              helperText={formik.touched.guestUser && formik.errors.guestUser}
              size="small"
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <FormButton type='submit' btnName="Book" />
      </Box>
    </PopContent >
  );
};

export default MeetingForm;
