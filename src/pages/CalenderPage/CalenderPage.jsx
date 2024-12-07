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

const CalenderPage = () => {
  const localizer = dayjsLocalizer(dayjs);

  const { user } = useSelector((state) => state.user);
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to hold the selected event

  // Fetch meetings and convert them to calendar events
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);

        // Dynamically set the API endpoint based on user's role
        const endpoint = user?.isAdmin
          ? "/api/v1/meeting/get-all-meeting"
          : "/api/v1/meeting/get-all-my-meeting";

        const response = await axios.get(endpoint, {
          withCredentials: true,
        });

        const meetings =
          response.data.data.myMeetings || response.data.data.meetings;
        console.log(response);

        // Map API response to calendar-compatible event objects
        const formattedEvents = meetings.map((meeting) => {
          const startDateTime = new Date(
            `${meeting.meetingDate}T${meeting.startTime}`
          );
          const endDateTime = new Date(
            `${meeting.meetingDate}T${meeting.endTime}`
          );

          return {
            title: meeting.title,
            start: startDateTime,
            end: endDateTime,
            description: meeting.description || "",
            location: meeting.roomLocation || "",
            organizer: meeting.organizerName || "N/A",
          };
        });

        setEvents(formattedEvents);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch meetings");
        console.error("Error fetching meetings:", error);
        setLoading(false);
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
      {loading ? (
        <div>Loading events...</div>
      ) : (
        <>
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

          {/* Event Details Modal */}
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
                  {/* <Button
                    onClick={handleCloseModal}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Cancel
                  </Button> */}
                </Box>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </PaperWrapper>
  );
};

export default CalenderPage;
