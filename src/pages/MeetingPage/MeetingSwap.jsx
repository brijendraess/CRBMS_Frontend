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
} from "@mui/material";
import { useSelector } from "react-redux";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { dateStringFormatting, disablePastDates, fetchActiveCommittee, fetchUsers, formatTimeShort } from "../../utils/utils";
import dayjs from "dayjs";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const MeetingFormSwap = ({ updatedBookingId, room, setRefreshPage, isOpen }) => {
    const { user } = useSelector((state) => state.user);
    const [meetings, setMeetings] = useState([]);
    const [myMeetingData, setMeetingData] = useState({});
    const [initialValueState, setInitialValueState] = useState("");
    const now = new Date();

    useEffect(() => {
        if (isOpen) {
            // Only fetch data if the modal is open
            const fetchData = async () => {
                const endpoint = "/api/v1/meeting/get-all-admin-meeting";
                const response = await axios.get(endpoint, { withCredentials: true });
                const meetings = await response?.data?.data?.meetings;

                const formattedMeetings = meetings.map((meeting) => ({
                    id: meeting?.id,
                    subject: meeting?.subject,
                    roomId: meeting?.Room.id,
                    agenda: meeting?.agenda,
                    notes: meeting?.notes || "",
                    startTime: formatTimeShort(meeting?.startTime),
                    endTime: formatTimeShort(meeting?.endTime),
                    meetingDate: dateStringFormatting(meeting?.meetingDate),
                    roomLocation: meeting?.Room?.Location?.locationName || "N/A",
                    roomName: meeting?.Room?.name || "N/A",
                    organizerName: meeting?.User?.fullname || "N/A",
                    status: meeting?.status || "N/A",
                }));

                setMeetings(formattedMeetings);
            };

            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        setTimeout(() => {
            if (room) {
                setInitialValueState({
                    roomId: room?.meetingsOnly ? room?.meetingsOnly[0]?.Room?.id : null,
                    organizerId: user.id,
                    subject: room?.meetingsOnly ? room?.meetingsOnly[0]?.subject : "",
                    agenda: room?.meetingsOnly ? room?.meetingsOnly[0]?.agenda : "",
                    guestUser: room?.meetingsOnly ? room?.meetingsOnly[0]?.guestUser : "",
                    startTime: room?.meetingsOnly
                        ? room?.meetingsOnly[0]?.startTime
                        : null,
                    endTime: room?.meetingsOnly
                        ? room?.meetingsOnly[0]?.endTime
                        : null,
                    date: room?.meetingsOnly
                        ? room?.meetingsOnly[0]?.meetingDate
                        : null,
                    attendees: room?.meetingUser
                        ? room?.meetingUser?.map((data) => ({
                            id: data.id,
                            name: data.fullname,
                        }))
                        : [],
                    committees: room?.meetingsOnly
                        ? room?.meetingsOnly[0]?.Committees
                        : [],
                    notes: room?.meetingsOnly ? room?.meetingsOnly[0]?.notes : "",
                    additionalEquipment: room?.meetingsOnly
                        ? room?.meetingsOnly[0]?.additionalEquipment
                        : "",
                    isPrivate: room?.meetingsOnly
                        ? room?.meetingsOnly[0]?.isPrivate
                        : false,
                });
            }
        }, 500);
    }, [room]);


    const formik = useFormik({
        initialValues: { ...initialValueState, meetingId: null },
        enableReinitialize: true,
        validationSchema: Yup.object({
            meetingId: Yup.string().required("Swap Meeting Id is required"),
        }),
        onSubmit: async (values, { resetForm }) => {

            try {
                const payload = {
                    ...values,
                };
                const response = await axios.put(
                    `/api/v1/meeting/swap-meeting/${updatedBookingId}`,
                    payload,
                    {
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    toast.success("Meeting Swapped successfully");
                    setRefreshPage(Math.random());
                    resetForm();
                }
                else {
                    toast.error("Unable to swap meeting.");
                    setRefreshPage(Math.random());
                    resetForm();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred");
                console.error("Error Swapping meeting:", error);
            }
        },
    });


    return (
        <PopContent>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Box display="flex" justifyContent="space-between" gap={1} mb={2}>
                    <Box>
                        <div>
                            <b>{formik?.values?.subject || ""}
                                {formik?.values?.date ? ` - ${formik?.values?.date}` : ""}{" "}
                                {formik?.values?.startTime && formik?.values?.endTime
                                    ? `(${formik?.values?.startTime} - ${formik?.values?.endTime})`
                                    : ""}</b>
                        </div>
                    </Box>
                </Box>
                <Box mb={2}>
                    <Autocomplete
                        id="meetingId"
                        name="meetingId"
                        size="small"
                        sx={{ width: "100%" }}
                        options={meetings.filter((m) => {
                            const [day, month, year] = m.meetingDate.split("/");
                            const formattedDate = `${year}-${month}-${day}`;
                            
                            const meetingDateTime = new Date(`${formattedDate}T${m.startTime.replace(" AM", "").replace(" PM", "")}`);
                            
                            return m.id !== updatedBookingId && meetingDateTime > now;
                        })} // ✅ List of meetings
                        value={meetings.find(m => m.id === formik.values.meetingId) || null} // ✅ Ensure it holds the selected object
                        onChange={(_, newValue) =>
                            formik.setFieldValue("meetingId", newValue ? newValue.id : null) // ✅ Store only meeting.id
                        }
                        getOptionLabel={(option) =>
                            option ? `${option.subject} ${option.meetingDate} (${option.startTime} - ${option.endTime})` : ""
                        } // ✅ Show subject & timings
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                {option.subject} {option.meetingDate} ({option.startTime} - {option.endTime})
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Meeting for Swap"
                                error={formik.touched?.meetingId && Boolean(formik.errors?.meetingId)}
                                helperText={formik.touched?.meetingId && formik.errors?.meetingId}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value} // ✅ Compare only by id
                    />
                </Box>
                <FormButton type='submit' btnName='Save meeting' />
            </Box>
        </PopContent>
    );
};

export default MeetingFormSwap;
