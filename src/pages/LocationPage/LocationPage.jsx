import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
  Grid2,
} from "@mui/material";
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
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LocationCard from "./LocationCard";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import PageHeader from "../../components/Common Components/PageHeader/PageHeader";

const LocationPage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [location, setLocation] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        showLoading();
        const response = await axios.get("/api/v1/location/locations");
        const locationWithSerial = response.data.data.locations.map(
          (location, index) => ({
            ...location,
            serialNo: index + 1,
          })
        );
        setLocation(locationWithSerial);
        hideLoading();
      } catch (error) {
        hideLoading();
        toast.error("Something Went Wrong");
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [refreshPage]);

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
      showLoading();
      await axios.delete(`/api/v1/location/locations/delete/${deleteId}`);
      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Location deleted successfully!");
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error("Failed to delete location!");
      console.error("Error deleting location:", error);
    }
  };

  const handleUpdateSuccess = (updatedLocation) => {
    setLocation((prev) =>
      prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
    );
    setIsEditOpen(false);
  };

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleStatusChange = async (id) => {
    try {
      showLoading();
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
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error("Error changing status:", error);
      toast.error("Failed to change location status!");
    }
  };

  const columns = [
    { field: "serialNo", headerName: "#", width: 100 },
    {
      field: "locationImagePath",
      headerName: "Image",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <>
            <img
              src={`${import.meta.env.VITE_API_URL}/${params.value}`}
              alt="avatar"
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            />
          </>
        ) : (
          <AccountCircleRoundedIcon
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />
        ),
    },
    {
      field: "locationName",
      headerName: "Name",
      width: 500,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,

      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Edit">
            <EditOutlinedIcon
              className="cursor"
              color="success"
              onClick={() => handleEdit(params.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => handleOpen(params.row.id)}
            />
          </Tooltip>
          <Tooltip title="Change Status">
            <Switch
              checked={params.row.status}
              onChange={() => handleStatusChange(params.row.id)}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <PaperWrapper>
      <PageHeader
        heading={"Location"}
        icon={AddOutlinedIcon}
        title={"Add"}
        func={setIsAddOpen}
      />
      {isSmallScreen ? (
        <Grid2
          container
          spacing={2}
          sx={{
            borderRadius: "20px",
            position: "relative",
            top: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {location.map((loc, index) => (
            <LocationCard
              key={loc.id}
              location={loc}
              onEdit={handleEdit}
              onDelete={handleOpen} // Assuming handleOpen manages delete modal
              onStatusChange={handleStatusChange}
            />
          ))}
        </Grid2>
      ) : (
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
      )}

      <PopupModals
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={"Add Location"}
        modalBody={
          <LocationAdd
            setRefreshPage={setRefreshPage}
            setIsAddOpen={setIsAddOpen}
          />
        }
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
