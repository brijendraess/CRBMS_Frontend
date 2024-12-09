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

const LocationPage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [location, setLocation] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);

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
        toast.success("Locations Fetched Successfully");
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Handle Edit Popup
  const handleEdit = (id) => {
    setUpdatedId(id);
    setIsEditOpen(true);
  };

  // Handle Successful Update
  const handleUpdateSuccess = (updatedLocation) => {
    setLocation((prev) =>
      prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
    );
    setIsEditOpen(false);
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
            onClick={() => console.log("Handle delete here")}
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
        modalBody={<LocationAdd />}
      />
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Location"}
        modalBody={
          <LocationEdit
            id={updatedId}
            locationName={
              location.find((loc) => loc.id === updatedId)?.locationName || ""
            }
            onSuccess={handleUpdateSuccess}
          />
        }
      />
    </PaperWrapper>
  );
};

export default LocationPage;
