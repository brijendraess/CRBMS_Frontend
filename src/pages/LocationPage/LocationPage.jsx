import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Switch, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import LocationAdd from "./LocationAdd";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DeleteOutlineOutlined as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import LocationEdit from "./LocationEdit";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";
import DeleteModal from "../../components/Common Components/Modals/Delete/DeleteModal";

const LocationPage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [location, setLocation] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);

  // Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/v1/location/locations");

        // Add serial numbers to the fetched data
        const locationsWithSerial = response.data.data.locations.map(
          (location, index) => ({
            ...location,
            serial: index + 1, // Serial number starts at 1
          })
        );

        setLocation(locationsWithSerial);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [refreshPage]);

  // Handle Edit Popup
  const handleEdit = (id) => {
    setUpdatedId(id);
    setIsEditOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/location/locations/delete/${deleteId}`);
     
      handleClose(false)
      setRefreshPage(Math.random())
      toast.success("Location deleted successfully!"); 
    } catch (error) {
      toast.error("Failed to delete location!");
      console.error("Error deleting location:", error);
    }
  };

  // Handle Successful Update
  const handleUpdateSuccess = (updatedLocation) => {
    setLocation((prev) =>
      prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
    );
    setIsEditOpen(false);
  };

  // Handle open 
  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  // Handle Status Change
  const handleStatusChange = async (id) => {
    try {
      const response = await axios.patch(
        `/api/v1/location/locations/${id}/status`
      );
      const updatedLocation = response.data.data.location;

      setLocation((prev) =>
        prev.map((loc) =>
          loc.id === id ? { ...loc, status: updatedLocation.status } : loc
        )
      );

      toast.success(
        `Location status changed to ${updatedLocation.status ? "Active" : "Inactive"}`
      );
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to change location status!");
    }
  };

  // DataGrid Columns
  const columns = [
    {
      field: "serial",
      headerName: "No.",
      width: 70,
    },
    {
      field: "locationName",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,

      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <EditOutlinedIcon
            className="cursor"
            color="success"
            onClick={() => handleEdit(params.row.id)}
            style={{ cursor: "pointer" }}
          />
          <DeleteIcon
            color="error"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpen(params.row.id)}
          />

          <Switch
            checked={params.row.status}
            onChange={() => handleStatusChange(params.row.id)}
          />
        </Box>
      ),
    },
  ];

  return (
    <PaperWrapper>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            marginRight: "20px",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#2E2E2E",
          }}
        >
          Location
        </Typography>
        <CustomButton
          onClick={() => setIsAddOpen(true)}
          title={"Add New Room"}
          placement={"left"}
          Icon={AddOutlinedIcon}
          fontSize={"medium"}
          background={"rgba(3, 176, 48, 0.68)"}
        />
      </Box>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataGrid
          rows={location}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          rowHeight={40}
        />
      </div>
      <PopupModals
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={"Add Location"}
        modalBody={<LocationAdd setRefreshPage={setRefreshPage} setIsAddOpen={setIsAddOpen} />}
      />
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Location"}
        modalBody={
          <LocationEdit
            id={updatedId}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
            locationName={
              location.find((loc) => loc.id === updatedId)?.locationName || ""
            }
            onSuccess={handleUpdateSuccess}
          />
        }
      />
       <DeleteModal 
          open={open}
          onClose={handleClose}
          onDeleteConfirm={handleDelete} 
          button={"Delete"}
        />
    </PaperWrapper>
  );
};

export default LocationPage;
