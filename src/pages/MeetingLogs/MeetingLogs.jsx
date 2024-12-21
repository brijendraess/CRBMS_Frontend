import React, { useEffect, useState } from "react";
import { PaperWrapper, RightContent } from "../../Style";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Box, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  EditOutlinedIcon,
  EventBusyOutlinedIcon,
  HistoryOutlinedIcon,
} from "../../components/Common Components/CustomButton/CustomIcon";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import MeetingFormEdit from "../MeetingPage/MeetingFormEdit";
import MeetingFormPostPone from "../MeetingPage/MeetingFormPostPone";
import CancelMeetingModal from "../../components/Common Components/Modals/Delete/CancelMeetingModal";

const MeetingLogs = () => {
  const { user } = useSelector((state) => state.user);

  const [events, setEvents] = useState([]);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [isPostponeBookingOpen, setIsPostponeBookingOpen] = useState(false);
  const [isCancelBookingOpen, setIsCancelBookingOpen] = useState(false);
  const [updatedRoomId, setUpdatedRoomId] = useState("");
  const [room, setRoom] = useState([]);
  const [updatedBookingId, setUpdatedBookingId] = useState("");
   const [refreshPage, setRefreshPage] = useState(0);
  const [roomsData, setRoomsData] = useState([]); // State for rooms data

  const handleEdit = (roomId, meetingId) => {
    setIsEditBookingOpen(true);
    setUpdatedRoomId(roomId);
    setUpdatedBookingId(meetingId);
  };

  const handlePostpone = (roomId, meetingId) => {
    setIsPostponeBookingOpen(true);
    setUpdatedRoomId(roomId);
    setUpdatedBookingId(meetingId);
  };

  const handleCancelMeeting = (roomId, meetingId) => {
    setIsCancelBookingOpen(true);
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
  const fetchRoomsData = async () => {
    try {
      const response = await axios.get(`api/v1/rooms/${updatedRoomId}`);
      setRoomsData(response.data.data.room[0]);
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error("Error fetching room data:", error);
    }
  };
  const columns = [
    { field: "subject", headerName: "Subject", width: 90 },
    { field: "agenda", headerName: "Agenda", width: 100 },
    { field: "notes", headerName: "Notes", width: 200 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "meetingDate", headerName: "Meeting Date", width: 150 },
    { field: "roomLocation", headerName: "Room Location", width: 140 },
    { field: "organizerName", headerName: "Organizer", width: 130 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,

      renderCell: (params) => (
        <Box display="flex" alignItems="center" sx={{ display: params.row.status!=='cancelled' ? 'block' : 'none' }} gap={1}>
          <Tooltip title="Edit meeting">
            <EditOutlinedIcon
              className="cursor"
              color="success"
              onClick={() => handleEdit(params.row.roomId, params.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Postpone meeting">
            <HistoryOutlinedIcon
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => handlePostpone(params.row.roomId, params.row.id)}
            />
          </Tooltip>
          <Tooltip title="Cancel meeting">
            <EventBusyOutlinedIcon
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleCancelMeeting(params.row.roomId, params.row.id)
              }
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

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
  }, [updatedBookingId,refreshPage]);

  useEffect(() => {
    if (updatedRoomId) fetchRoomsData();
  }, [updatedRoomId, updatedBookingId]);

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
          id: meeting?.id,
          subject: meeting?.subject,
          roomId: meeting?.Room.id,
          agenda: meeting?.agenda,
          notes: meeting?.notes || "",
          startTime: meeting?.startTime,
          endTime: meeting?.endTime,
          meetingDate: meeting?.meetingDate,
          roomLocation: meeting?.Room?.Location?.locationName || "N/A",
          organizerName: meeting?.User?.fullname || "N/A",
          status: meeting?.status || "N/A",
        }));

        setEvents(formattedMeetings);
      } catch (error) {
        toast.error("Failed to fetch meetings");
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [user?.isAdmin]);


  const useStyles = makeStyles({
    rowCancelled: {
      backgroundColor: "#fdd", // Light red for cancelled meetings
      color: "#900", // Dark red text
    },
    rowActive: {
      // backgroundColor: "#dfd", 
      // color: "#090", 
    },
  });

  const classes = useStyles();

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
          getRowClassName={(params) =>
            params.row.status === "cancelled"
              ? classes.rowCancelled
              : classes.rowActive
          }
        />
      </PaperWrapper>
      <PopupModals
        isOpen={isEditBookingOpen}
        setIsOpen={setIsEditBookingOpen}
        title={"Edit Meeting"}
        modalBody={
          <MeetingFormEdit updatedBookingId={updatedBookingId} room={room} setRefreshPage={setRefreshPage} />
        }
      />
      <PopupModals
        isOpen={isPostponeBookingOpen}
        setIsOpen={setIsPostponeBookingOpen}
        title={"Postpone Meeting"}
        modalBody={
          <MeetingFormPostPone
            updatedBookingId={updatedBookingId}
            room={room}
            setRefreshPage={setRefreshPage}
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
    </RightContent>
  );
};

export default MeetingLogs;
