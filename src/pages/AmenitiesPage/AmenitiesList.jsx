import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Material UI IMPORTS
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Switch } from "@mui/material";
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

const AmenitiesList = () => {
  const [amenities, setAmenities] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updatedId, setUpdatedId] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [status, setStatus] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get("/api/v1/amenity/get-all-amenities");

        const amenitiesWithSerial = response.data.data.roomAmenities.map(
          (amenity, index) => ({
            ...amenity,
            serial: index + 1, // Serial number starts at 1
          })
        );
        setAmenities(amenitiesWithSerial); //
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Error fetching amenities:", error);
      }
    };

    fetchAmenities();
  }, [refreshPage]);

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
      handleClose(false);
      toast.success("Amenity deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete amenity!");
      console.error("Error deleting amenity:", error);
    }
  };

  const handleStatusChange = async(id) => {
    try {
      const response = await axios.patch(
        `/api/v1/amenity/amenities/${id}/status`
      );
      const updatedRoomAmenity = response.data.data.roomAmenity;
      setRefreshPage(Math.random())
      setAmenities((prev) =>
        prev.map((amenity) =>
          amenity.id === id ? { ...amenity, status: updatedRoomAmenity.status } : amenity
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
    { field: "serial", headerName: "#", flex: 0.3 },
    { field: "name", headerName: "Amenity Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => (
        <Box height={"40px"} display="flex" alignItems="center" gap={2}>
          <EditOutlinedIcon
            style={{ cursor: "pointer" }}
            color="success"
            onClick={() => handleEdit(params.id)}
          />
          <DeleteIcon
            color="error"
            onClick={() => handleOpen(params.id)}
            style={{ cursor: "pointer" }}
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
    <RightContent>
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
        <div style={{ display: "flex", flexDirection: "column" }}>
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
        </div>
        <PopupModals
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          title={"Add Amenity"}
          modalBody={
            <AmenitiesAdd
              setRefreshPage={setRefreshPage}
              setIsAddOpen={setIsAddOpen}
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
              setRefreshPage={setRefreshPage}
              setIsEditOpen={setIsEditOpen}
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
    </RightContent>
  );
};

export default AmenitiesList;
