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
} from "@mui/material";
import "./CalendarPage.css";
import { PaperWrapper } from "../../Style";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const CalenderPage = () => {
  const localizer = dayjsLocalizer(dayjs);

  const { user } = useSelector((state) => state.user);
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        showLoading();
        // const endpoint = user?.isAdmin
        //   ? "/api/v1/meeting/get-all-meeting"
        //   : "/api/v1/meeting/get-all-my-meeting";

        const endpoint ="/api/v1/meeting/get-all-my-meeting";

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
            title: meeting.subject,
            start: startDateTime,
            end: endDateTime,
            description: meeting.notes || "",
            location: meeting.Room.Location.locationName || "",
            organizer: meeting.User.fullname || "N/A",
            organizerId: meeting.organizerId
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
  }, [user?.isAdmin]); // Add dependency to re-run when user changes

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
  return (
    <PaperWrapper>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: "100%",
          background: "#fff",
          // padding: "5px",
          borderRadius: "10px",
        }}
        view={lastView}
        onView={handleViewChange}
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
          <DialogTitle>Event Details</DialogTitle>
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
            {selectedEvent.description && (
              <Typography variant="body1">
                <strong>Description:</strong> {selectedEvent.description}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: "5px" }}>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Postpone
              </Button>
              {user?.isAdmin &&<Button
                onClick={handleCloseModal}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Edit
              </Button>}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </PaperWrapper>
  );
};

export default CalenderPage;
