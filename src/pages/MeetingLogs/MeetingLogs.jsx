import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-hot-toast";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { Box, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  ApprovalOutlinedIcon,
  EditOutlinedIcon,
  EventBusyOutlinedIcon,
  HistoryOutlinedIcon,
} from "../../components/Common/CustomButton/CustomIcon";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import MeetingFormEdit from "../MeetingPage/MeetingFormEdit";
import MeetingFormPostPone from "../MeetingPage/MeetingFormPostPone";
import CancelMeetingModal from "../../components/Common/Modals/Delete/CancelMeetingModal";
import MeetingApproval from "../MeetingPage/MeetingApproval";

const MeetingLogs = () => {
  const { user } = useSelector((state) => state.user);

  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [isPostponeBookingOpen, setIsPostponeBookingOpen] = useState(false);
  const [isApprovalBookingOpen, setIsApprovalBookingOpen] = useState(false);
  const [isCancelBookingOpen, setIsCancelBookingOpen] = useState(false);
  const [updatedRoomId, setUpdatedRoomId] = useState("");
  const [room, setRoom] = useState([]);
  const [updatedBookingId, setUpdatedBookingId] = useState("");
  const [meetingUpdatedStatus, setMeetingUpdatedStatus] = useState("");
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

  const handleApproval = (roomId, meetingId, meetingUpdatedStatus) => {
    setIsApprovalBookingOpen(true);
    setMeetingUpdatedStatus(meetingUpdatedStatus);
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
      await axios.put(
        `/api/v1/meeting/update-meeting-status/${updatedBookingId}`,
        { meetingStatus: "cancelled" },
        {
          withCredentials: true,
        }
      );

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
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "agenda",
      headerName: "Agenda",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "notes",
      headerName: "Notes",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "meetingDate",
      headerName: "Meeting Date",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomLocation",
      headerName: "Room Location",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "organizerName",
      headerName: "Organizer",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box
          alignItems="center"
          sx={{
            display: params.row.status !== "cancelled" ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          gap={"10px"}
        >
          {user.UserType.meetingLogsModule&&user.UserType.meetingLogsModule.split(",").includes("edit")&&<Tooltip title="Edit meeting">
            <EditOutlinedIcon
              className="meeting-logs-edit"
              color="success"
              onClick={() => handleEdit(params.row.roomId, params.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>}
          {user.UserType.meetingLogsModule&&user.UserType.meetingLogsModule.split(",").includes("postpone")&&
          <Tooltip title="Postpone meeting">
            <HistoryOutlinedIcon
              className="meeting-logs-postpone"
              color="message"
              style={{ cursor: "pointer" }}
              onClick={() => handlePostpone(params.row.roomId, params.row.id)}
            />
          </Tooltip>}
          {user.UserType.meetingLogsModule&&user.UserType.meetingLogsModule.split(",").includes("cancel")&&
          <Tooltip title="Cancel meeting">
            <EventBusyOutlinedIcon
              className="meeting-logs-cancel"
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleCancelMeeting(params.row.roomId, params.row.id)
              }
            />
          </Tooltip>}
          {user.UserType.isAdmin==='admin' &&user.UserType.meetingLogsModule&&user.UserType.meetingLogsModule.split(",").includes("approval") && (
            <Tooltip title="Change the status of meeting">
              <ApprovalOutlinedIcon
                className="meeting-logs-approve"
                color="success"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleApproval(
                    params.row.roomId,
                    params.row.id,
                    params.row.status
                  )
                }
              />
            </Tooltip>
          )}
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
  }, [updatedBookingId, refreshPage]);

  useEffect(() => {
    if (updatedRoomId) fetchRoomsData();
  }, [updatedRoomId, updatedBookingId, refreshPage]);
console.log(user)
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const endpoint = user?.UserType?.isAdmin==='admin'
          ? "/api/v1/meeting/get-all-admin-meeting"
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
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to fetch meetings");
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [user?.UserType?.isAdmin, refreshPage]);

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
    <PaperWrapper>
      <PageHeader heading={"Meeting Logs"} />
      <div style={{ display: "flex", flexDirection: "column" }}>
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
          sx={{
            "& .super-app-theme--header": {
              backgroundColor: "#006400",
              // backgroundColor: "rgba(255, 223, 0, 1)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
            },
          }}
        />
      </div>

      <PopupModals
        isOpen={isEditBookingOpen}
        setIsOpen={setIsEditBookingOpen}
        title={"Edit Meeting"}
        modalBody={
          <MeetingFormEdit
            updatedBookingId={updatedBookingId}
            room={room}
            setRefreshPage={setRefreshPage}
          />
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
      <PopupModals
        isOpen={isApprovalBookingOpen}
        setIsOpen={setIsApprovalBookingOpen}
        title={"Meeting Change Status"}
        modalBody={
          <MeetingApproval
            updatedBookingId={updatedBookingId}
            meetingUpdatedStatus={meetingUpdatedStatus}
            setRefreshPage={setRefreshPage}
            setIsApprovalBookingOpen={setIsApprovalBookingOpen}
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
    </PaperWrapper>
  );
};

export default MeetingLogs;
