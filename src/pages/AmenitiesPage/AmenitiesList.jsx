import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Material UI Imports
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Typography,
  Switch,
  Tooltip,
  Grid2,
  useMediaQuery,
} from "@mui/material";
import {
  DeleteOutlineOutlined as DeleteIcon,
  VisibilityOutlined as ViewIcon,
} from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

// Style Imports
import "./Amenities.css";
import { PaperWrapper, RightContent } from "../../Style";

// Component Imports
import AmenitiesAdd from "./AmenitiesAdd";
import DeleteModal from "../../components/Common Components/Modals/Delete/DeleteModal";
import AmenitiesEdit from "./AmenitiesEdit";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";
import AmenitiesCard from "./AmenitiesCard";

const AmenitiesList = () => {
  const [amenities, setAmenities] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updatedId, setUpdatedId] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isRefreshed, setIsRefreshed] = useState(0);

  // Fetch amenities only when component mounts
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get("/api/v1/amenity/get-all-amenities");
        const amenitiesWithSerial = response.data.data.roomAmenities.map(
          (amenity, index) => ({
            ...amenity,
            serialNo: index + 1, // Add serial number to each row
          })
        );
        setAmenities(amenitiesWithSerial);
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Error fetching amenities:", error);
      }
    };

    fetchAmenities();
  }, [isRefreshed]);

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleEdit = (id) => {
    setUpdatedId(id);
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/amenity/delete/${deleteId}`);
      setAmenities((prevAmenities) =>
        prevAmenities.filter((amenity) => amenity.id !== deleteId)
      );
      handleClose();
      toast.success("Amenity deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete amenity!");
      console.error("Error deleting amenity:", error);
    }
  };

  const handleStatusChange = async (id) => {
    try {
      const response = await axios.patch(
        `/api/v1/amenity/amenities/${id}/status`
      );
      const updatedRoomAmenity = response.data.data.roomAmenity;

      setAmenities((prev) =>
        prev.map((amenity) =>
          amenity.id === id
            ? { ...amenity, status: updatedRoomAmenity.status }
            : amenity
        )
      );

      toast.success(
        `Amenity status changed to ${updatedRoomAmenity.status ? "Active" : "Inactive"}`
      );
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to change Amenity status!");
    }
  };

  const columns = [
    { field: "serialNo", headerName: "#", width: 50 },
    { field: "name", headerName: "Amenity Name", width: 300 },
    { field: "description", headerName: "Description", width: 700 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Box height={"40px"} display="flex" alignItems="center" gap={2}>
          <Tooltip title="Edit">
            <EditOutlinedIcon
              style={{ cursor: "pointer" }}
              color="success"
              onClick={() => handleEdit(params.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              onClick={() => handleOpen(params.id)}
              style={{ cursor: "pointer" }}
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

  // Check for small screen using media query
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

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
          Amenities
        </Typography>
        <CustomButton
          onClick={() => setIsAddOpen(true)}
          title={"Add New Amenity"}
          placement={"left"}
          Icon={AddOutlinedIcon}
          fontSize={"medium"}
          background={"rgba(3, 176, 48, 0.68)"}
        />
      </Box>

      {/* Render AmenitiesCard only on small screens */}
      {isSmallScreen && (
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
          {amenities.map((amenity) => (
            <AmenitiesCard
              key={amenity.id}
              amenity={amenity}
              handleEdit={handleEdit}
              handleDelete={handleOpen} // handleOpen is used to trigger deletion modal
              handleStatusChange={handleStatusChange}
            />
          ))}
        </Grid2>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {!isSmallScreen && (
          <DataGrid
            rows={amenities}
            columns={columns}
            pageSize={5}
            rowHeight={40}
            rowsPerPageOptions={[7]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
            showCellVerticalBorder
            showColumnVerticalBorder
          />
        )}
      </div>

      {/* Modals for Add, Edit, Delete */}
      <PopupModals
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={"Add Amenity"}
        modalBody={
          <AmenitiesAdd
            setIsAddOpen={setIsAddOpen}
            setAmenities={setAmenities}
            setIsRefreshed={setIsRefreshed}
          />
        }
      />

      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Amenities"}
        modalBody={
          <AmenitiesEdit
            id={updatedId}
            setIsEditOpen={setIsEditOpen}
            setAmenities={setAmenities}
            setIsRefreshed={setIsRefreshed}
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

export default AmenitiesList;
