import React, { useEffect, useState } from "react";
import { PaperWrapper, RightContent } from "../../Style";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-hot-toast";

const MeetingLogs = () => {
  const { user } = useSelector((state) => state.user);

  const [events, setEvents] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "meetingDate", headerName: "Meeting Date", width: 150 },
    { field: "roomLocation", headerName: "Room Location", width: 200 },
    { field: "organizerName", headerName: "Organizer", width: 200 },
  ];

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const endpoint = user?.isAdmin
          ? "/api/v1/meeting/get-all-meeting"
          : "/api/v1/meeting/get-all-my-meeting";

        const response = await axios.get(endpoint, { withCredentials: true });

        const meetings =
          response.data.data.myMeetings || response.data.data.meetings;

        // Format the data for DataGrid
        const formattedMeetings = meetings.map((meeting) => ({
          id: meeting.meetingId,
          title: meeting.title,
          description: meeting.description || "",
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          meetingDate: meeting.meetingDate,
          roomLocation: meeting.roomLocation || "N/A",
          organizerName: meeting.organizerName || "N/A",
        }));

        setEvents(formattedMeetings);
      } catch (error) {
        toast.error("Failed to fetch meetings");
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [user?.isAdmin]);

  return (
    <RightContent>
      <PaperWrapper>
        <h2>Meeting Logs</h2>
        <DataGrid
          rows={events}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          rowHeight={50}
        />
      </PaperWrapper>
    </RightContent>
  );
};

export default MeetingLogs;
