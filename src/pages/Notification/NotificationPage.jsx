import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Box, Switch, Tooltip } from "@mui/material";
import { DeleteIcon } from "../../components/Common/CustomButton/CustomIcon";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";

const Notification = () => {
  const { user } = useSelector((state) => state.user);

  const [events, setEvents] = useState([]);
  const [refreshPage, setRefreshPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isRead, setIsRead] = useState(null);
  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `/api/v1/notification/delete-single-notification/${deleteId}`
      );

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Notification deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete notification!");
      console.error("Error deleting notification:", error);
    }
  };

  const handleStatusChange = async (id) => {
    try {
      const response = await axios.put(
        `/api/v1/notification/change-read-status-notification/${id}`
      );
      const updatedReadStatus = response.data.data.notification;
      setRefreshPage(Math.random());
      toast.success(
        `Read status changed to ${updatedReadStatus.status ? "Active" : "Inactive"}`
      );
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to change Read status!");
    }
  };

  const columns = [
    {
      field: "type",
      headerName: "Type",
      width: 90,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "message",
      headerName: "Message",
      width: 280,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "room",
      headerName: "Room",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "subject",
      headerName: "Subject",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "agenda",
      headerName: "Agenda",
      width: 140,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "meetingDate",
      headerName: "Date",
      width: 140,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "meetingTime",
      headerName: "Meeting Time",
      width: 140,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => handleOpen(params.row.id)}
            />
          </Tooltip>
          <Tooltip title="Change the read Status">
            <Switch
              checked={params.row.isRead}
              onChange={() => handleStatusChange(params.row.id)}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const endpoint = user?.isAdmin
          ? `/api/v1/notification/all-notification`
          : `/api/v1/notification/all-notification`;
        const response = await axios.get(endpoint, { withCredentials: true });
        const notifications = response.data.data;
        // Format the data for DataGrid
        const formattedNotifications = notifications.map((notify) => ({
          id: notify?.id,
          type: notify?.type,
          message: notify?.message,
          location: notify?.Meeting?.Room?.Location?.locationName,
          room: notify?.Meeting?.Room?.name,
          subject: notify?.Meeting?.subject,
          agenda: notify?.Meeting?.agenda || "",
          meetingDate: notify?.Meeting?.meetingDate || "",
          isRead: notify?.isRead || false,
          meetingTime:
            `${notify?.Meeting?.startTime} - ${notify?.Meeting?.endTime}` || "",
        }));

        setEvents(formattedNotifications);
      } catch (error) {
        toast.error("Failed to fetch Notification");
        console.error("Error fetching Notification:", error);
      }
    };

    fetchNotification();
  }, [refreshPage]);
  return (
    <>
      <PaperWrapper>
        <h2>Meeting Notification</h2>
        <DataGrid
          rows={events}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          rowHeight={50}
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
      </PaperWrapper>
      <DeleteModal
        open={open}
        onClose={handleClose}
        onDeleteConfirm={handleDelete}
        button={"Delete"}
      />
    </>
  );
};

export default Notification;
