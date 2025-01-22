import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { dayjsLocalizer, Calendar } from "react-big-calendar";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Box,
  Paper,
  styled,
} from "@mui/material";
import "./CalendarPage.css";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import MeetingFormPostPone from "../MeetingPage/MeetingFormPostPone";
import CancelMeetingModal from "../../components/Common/Modals/Delete/CancelMeetingModal";
import MeetingFormEdit from "../MeetingPage/MeetingFormEdit";

const CalederComponent = ({ height }) => {
  const CalenderWrapper = styled(Paper)(({ theme }) => ({
    color: theme.palette.text.secondary,
    borderRadius: "10px",
    padding: "10px",
    marginTop: "10px",
    width: "100%",
    overflow: "scroll",
    height: height,
    backgroundImage: `linear-gradient(45deg, var(--body-color), var(--body-color-2))`,
    [theme.breakpoints.down("md")]: {
      height: "100vh",
      marginTop: "0px",
    },
  }));

  const localizer = dayjsLocalizer(dayjs);

  const { user } = useSelector((state) => state.user);
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );
  const [events, setEvents] = useState([]);
  const [isPostponeBookingOpen, setIsPostponeBookingOpen] = useState(false);
  const [isCancelBookingOpen, setIsCancelBookingOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updatedBookingId, setUpdatedBookingId] = useState("");
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [updatedRoomId, setUpdatedRoomId] = useState("");
  const [refreshPage, setRefreshPage] = useState(0);
  const [room, setRoom] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        if (updatedBookingId) {
          const response = await axios.get(
            `/api/v1/meeting/get-single-meeting/${updatedBookingId}`,
            { withCredentials: true }
          );
          const meetings = response.data.data.meetings;
          setRoom(meetings);
        }
        // Format the data for DataGrid
      } catch (error) {
        toast.error("Failed to fetch meetings");
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [updatedBookingId, refreshPage]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        showLoading();
        const endpoint =
          user?.UserType?.isAdmin === "admin"
            ? "/api/v1/meeting/get-all-admin-meeting"
            : "/api/v1/meeting/get-all-my-meeting";

        const response = await axios.get(endpoint, {
          withCredentials: true,
        });
        const meetings =
          response.data.data.myMeetings || response.data.data.meetings;
        const formattedEvents = meetings.map((meeting) => {
          const startDateTime = new Date(
            `${meeting.meetingDate}T${meeting.startTime}`
          );
          const endDateTime = new Date(
            `${meeting.meetingDate}T${meeting.endTime}`
          );

          return {
            title: meeting?.subject,
            start: startDateTime,
            end: endDateTime,
            description: meeting?.notes || "",
            location: meeting?.Room?.Location?.locationName || "",
            organizer: meeting?.User?.fullname || "N/A",
            organizerId: meeting?.organizerId,
            roomId: meeting?.roomId,
            bookingId: meeting?.id,
            isCanceled: meeting?.status,
          };
        });

        setEvents(formattedEvents);
        hideLoading();
      } catch (error) {
        console.error("Error fetching meetings:", error);
        hideLoading();
      }
    };

    fetchMeetings();
  }, [user?.UserType?.isAdmin]); // Add dependency to re-run when user changes

  const handleViewChange = (view) => {
    setLastView(view);
    localStorage.setItem("lastView", view);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const eventPropGetter = (event) => {
    if (event.isCanceled === "cancelled") {
      return {
        style: {
          backgroundColor: "red",
          textDecoration: "line-through",
          color: "white",
        },
      };
    }
    if (event.isCanceled === "pending") {
      return {
        style: {
          backgroundColor: "#ff9600",
          textDecoration: "none",
          color: "white",
        },
      };
    }
    return {};
  };

  const handleEdit = (roomId, meetingId) => {
    setIsEditBookingOpen(true);
    handleCloseModal();
    setUpdatedRoomId(roomId);
    setUpdatedBookingId(meetingId);
  };

  const handlePostpone = (roomId, meetingId) => {
    setIsPostponeBookingOpen(true);
    handleCloseModal();
    setUpdatedRoomId(roomId);
    setUpdatedBookingId(meetingId);
  };

  const handleCancelMeeting = (roomId, meetingId) => {
    setIsCancelBookingOpen(true);
    handleCloseModal();
    setUpdatedRoomId(roomId);
    setUpdatedBookingId(meetingId);
  };

  const handleCloseMeeting = () => {
    setIsCancelBookingOpen(false);
    setUpdatedRoomId(null);
    setUpdatedBookingId(null);
  };

  const handleCancelMeetingConfirm = async () => {
    try {
      await axios.put(`/api/v1/meeting/cancel-meeting/${updatedBookingId}`);

      handleCloseMeeting(false);
      setRefreshPage(Math.random());
      toast.success("Meeting cancelled successfully!");
    } catch (error) {
      toast.error("Failed to cancelled meeting!");
      console.error("Error cancelled meeting:", error);
    }
  };
  return (
    <CalenderWrapper>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          borderRadius: "10px",
        }}
        view={lastView}
        onView={handleViewChange}
        eventPropGetter={eventPropGetter}
        onSelectEvent={handleEventClick} // Handle event click
        tooltipAccessor={(event) => event.description} // Display description in tooltip
      />
      {selectedEvent && (
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Meeting Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {selectedEvent.title}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong>{" "}
              {dayjs(selectedEvent.start).format("MMMM D, YYYY")}
            </Typography>
            <Typography variant="body1">
              <strong>Time:</strong>{" "}
              {dayjs(selectedEvent.start).format("hh:mm A")} -{" "}
              {dayjs(selectedEvent.end).format("hh:mm A")}
            </Typography>
            {selectedEvent.location && (
              <Typography variant="body1">
                <strong>Location:</strong> {selectedEvent.location}
              </Typography>
            )}
            {selectedEvent.organizer && (
              <Typography variant="body1">
                <strong>Organizer:</strong> {selectedEvent.organizer}
              </Typography>
            )}
            {selectedEvent.isCanceled === "cancelled" && (
              <Typography>
                <strong>Status:</strong>{" "}
                <Typography sx={{ color: "red", fontWeight: "bold" }}>
                  Meeting cancelled.
                </Typography>
              </Typography>
            )}
            {selectedEvent.isCanceled === "pending" && (
              <Typography>
                <strong>Status:</strong>{" "}
                <Typography sx={{ color: "#ff9600", fontWeight: "bold" }}>
                  Meeting is pending now, Please asked admin to approve it.
                </Typography>
              </Typography>
            )}
            {selectedEvent.description && (
              <Typography variant="body1">
                <strong>Description:</strong> {selectedEvent.description}
              </Typography>
            )}

            {!selectedEvent.isCanceled === "cancelled" ||
              (!selectedEvent.isCanceled === "pending" && (
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <Button
                    onClick={() =>
                      handleCancelMeeting(
                        selectedEvent.roomId,
                        selectedEvent.bookingId
                      )
                    }
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handlePostpone(
                        selectedEvent.roomId,
                        selectedEvent.bookingId
                      )
                    }
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Postpone
                  </Button>
                  {user?.UserType?.isAdmin === "admin" && (
                    <Button
                      onClick={() =>
                        handleEdit(
                          selectedEvent.roomId,
                          selectedEvent.bookingId
                        )
                      }
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              ))}
          </DialogContent>
        </Dialog>
      )}
      <PopupModals
        isOpen={isEditBookingOpen}
        setIsOpen={setIsEditBookingOpen}
        title={"Edit Meeting"}
        modalBody={
          <MeetingFormEdit updatedBookingId={updatedBookingId} room={room} />
        }
      />
      <PopupModals
        isOpen={isPostponeBookingOpen}
        setIsOpen={setIsPostponeBookingOpen}
        title={"Rescheduled Meeting"}
        modalBody={
          <MeetingFormPostPone
            updatedBookingId={updatedBookingId}
            room={room}
          />
        }
      />
      <CancelMeetingModal
        open={isCancelBookingOpen}
        onClose={handleCloseMeeting}
        onDeleteConfirm={handleCancelMeetingConfirm}
        button={"Cancel meeting"}
        title="meeting"
      />
    </CalenderWrapper>
  );
};

export default CalederComponent;
