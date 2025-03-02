import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-hot-toast";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { Box, Tooltip, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  ApprovalOutlinedIcon,
  EditOutlinedIcon,
  EventBusyOutlinedIcon,
  HistoryOutlinedIcon,
  SwapHorizIcon,
} from "../../components/Common/Buttons/CustomIcon";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import MeetingFormEdit from "../MeetingPage/MeetingFormEdit";
import MeetingFormPostPone from "../MeetingPage/MeetingFormPostPone";
import CancelMeetingModal from "../../components/Common/Modals/Delete/CancelMeetingModal";
import MeetingApproval from "../MeetingPage/MeetingApproval";
import { dateStringFormatting, formatTimeShort, handleStartGuide } from "../../utils/utils";
import MeetingFormSwap from "../MeetingPage/MeetingSwap";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";
import { useLocation } from "react-router-dom";

const MeetingLogs = () => {
  const { user } = useSelector((state) => state.user);

  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [isPostponeBookingOpen, setIsPostponeBookingOpen] = useState(false);
  const [isApprovalBookingOpen, setIsApprovalBookingOpen] = useState(false);
  const [isCancelBookingOpen, setIsCancelBookingOpen] = useState(false);
  const [isSwapMeetingOpen, setIsSwapMeetingOpen] = useState(false);
  const [updatedRoomId, setUpdatedRoomId] = useState("");
  const [room, setRoom] = useState([]);
  const [updatedBookingId, setUpdatedBookingId] = useState("");
  const [meetingUpdatedStatus, setMeetingUpdatedStatus] = useState("");
  const [refreshPage, setRefreshPage] = useState(0);
  const [roomsData, setRoomsData] = useState([]); // State for rooms data

  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const isAdmin = user?.UserType?.isAdmin === 'admin';

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenLogs");
      if(user && !user.lastLoggedIn && (hasSeenTour === "false" || hasSeenTour === null)){
        handleStartGuide(location, isSmallScreen, isAdmin);
        localStorage.setItem("hasSeenLogs", "true");
      }
  }, [])

  const handleEdit = (roomId, meetingId) => {
    setIsEditBookingOpen(true);
    setUpdatedRoomId(roomId);
    setUpdatedBookingId(meetingId);
  };

  const handleSwap = (roomId, meetingId) => {
    setIsSwapMeetingOpen(true);
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
      // toast.error("Failed to cancelled meeting!");
      console.error("Error cancelled meeting:", error);
    }
  };
  const fetchRoomsData = async () => {
    try {
      const response = await axios.get(`api/v1/rooms/${updatedRoomId}`);
      setRoomsData(response.data.data.room[0]);
    } catch (error) {
      // toast.error("Something Went Wrong");
      console.error("Error fetching room data:", error);
    }
  };

  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      width: 400,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomName",
      headerName: "Room Name",
      width: 250,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "startTime",
      headerName: "Start Time",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "meetingDate",
      headerName: "Meeting Date",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomLocation",
      headerName: "Room Location",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "organizerName",
      headerName: "Organizer",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 250,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {

        const [day, month, year] = params.row.meetingDate.split("/").map(Number);

        const timeString = params.row.endTime;
        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        // Construct the correct endDateTime
        const endDateTime = new Date(year, month - 1, day, hours, minutes);
        const currentDateTime = new Date();

        return (
          <Box
            alignItems="center"
            sx={{
              // display: params.row.status !== "cancelled" &&  && params.row.status !== "completed" ? "flex" : "none",
              display: (() => {
                return params.row.status !== "cancelled" &&
                  params.row.status !== "completed" &&
                  endDateTime > currentDateTime
                  ? "flex"
                  : "none";
              })(),
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
            gap={"10px"}
          >
            {user.UserType.meetingLogsModule &&
              user.UserType.meetingLogsModule.split(",").includes("edit") && (
                <Tooltip title="Edit meeting">
                  <EditOutlinedIcon
                    color="success"
                    onClick={() => handleEdit(params.row.roomId, params.row.id)}
                    style={{ cursor: "pointer" }}
                    className="meeting-logs-edit"
                  />
                </Tooltip>
              )}
            {user.UserType.meetingLogsModule &&
              user.UserType.meetingLogsModule.split(",").includes("postpone") && (
                <Tooltip title="Postpone meeting">
                  <HistoryOutlinedIcon
                    color="message"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handlePostpone(params.row.roomId, params.row.id)
                    }
                    className="meeting-logs-postpone"
                  />
                </Tooltip>
              )}
            {user.UserType.meetingLogsModule &&
              user.UserType.meetingLogsModule.split(",").includes("edit") && (
                <Tooltip title="Swap meeting">
                  <SwapHorizIcon
                    color="success"
                    onClick={() => handleSwap(params.row.roomId, params.row.id)}
                    style={{ cursor: "pointer" }}
                    className="meeting-logs-swap"
                  />
                </Tooltip>
              )}
            {user.UserType.meetingLogsModule &&
              user.UserType.meetingLogsModule.split(",").includes("cancel") && (
                <Tooltip title="Cancel meeting">
                  <EventBusyOutlinedIcon
                    className="meeting-logs-cancel"
                    color="error"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleCancelMeeting(params.row.roomId, params.row.id)
                    }
                  />
                </Tooltip>
              )}
            {user.UserType.isAdmin === "admin" &&
              user.UserType.meetingLogsModule &&
              user.UserType.meetingLogsModule.split(",").includes("approval") && (
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
        )
      },
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
        // toast.error("Failed to fetch meetings");
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [updatedBookingId, refreshPage]);

  useEffect(() => {
    if (updatedRoomId) fetchRoomsData();
  }, [updatedRoomId, updatedBookingId, refreshPage]);
  console.log(user);
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const endpoint =
          user?.UserType?.isAdmin === "admin"
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
          startTime: formatTimeShort(meeting?.startTime),
          endTime: formatTimeShort(meeting?.endTime),
          meetingDate: dateStringFormatting(meeting?.meetingDate),
          roomLocation: meeting?.Room?.Location?.locationName || "N/A",
          roomName: meeting?.Room?.name || "N/A",
          organizerName: meeting?.User?.fullname || "N/A",
          status: meeting?.status || "N/A",
        }));

        setEvents(formattedMeetings);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        // toast.error("Failed to fetch meetings");
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
    rowConfirmed: {
      backgroundColor: "#dfd", // Light green for confirmed meetings
      color: "#090", // Dark green text
    },
  });

  const classes = useStyles();

  return (
    <PaperWrapper>
      <PageHeader heading={"Meeting Logs"} />
      <div style={{ display: "flex", flexDirection: "column", height: "75vh" }}>
        <DataGrid
          rows={events}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          rowHeight={50}
          getRowClassName={(params) =>
            params.row.status === "cancelled"
              ? classes.rowCancelled
              : params.row.status === "completed"
                ? classes.rowConfirmed
                : classes.rowActive
          }
          sx={{
            "& .super-app-theme--header": {
              backgroundColor: `var(--linear-gradient-main)`,
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
            },
            '& .MuiDataGrid-columnHeader:first-child, .MuiDataGrid-cell:first-child': {
              position: 'sticky',
              left: 0,
              zIndex: 1,
              background: 'white',
            },
          }}
        />
      </div>

      <NewPopUpModal
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
      <NewPopUpModal
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
      <NewPopUpModal
        isOpen={isSwapMeetingOpen}
        setIsOpen={setIsSwapMeetingOpen}
        title={"Swap Meeting"}
        modalBody={
          <MeetingFormSwap
            updatedBookingId={updatedBookingId}
            // meetingUpdatedStatus={meetingUpdatedStatus}
            room={room}
            setRefreshPage={setRefreshPage}
            isOpen={isSwapMeetingOpen}
          />
        }
      />
      <NewPopUpModal
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
