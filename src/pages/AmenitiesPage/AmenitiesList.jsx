import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Switch, Tooltip, Grid2, useMediaQuery } from "@mui/material";
import "./Amenities.css";
import { PaperWrapper } from "../../Style";
import AmenitiesAdd from "./AmenitiesAdd";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import AmenitiesEdit from "./AmenitiesEdit";
import AmenitiesCard from "./AmenitiesCard";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch, useSelector } from "react-redux";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";
import { handleStartGuide } from "../../utils/utils";
import { useLocation } from "react-router-dom";

const AmenitiesList = () => {
  const [amenities, setAmenities] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updatedId, setUpdatedId] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isRefreshed, setIsRefreshed] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const isAdmin = user?.UserType?.isAdmin === 'admin';

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenAmenities");
      if(user && !user.lastLoggedIn && (hasSeenTour === "false" || hasSeenTour === null)){
        handleStartGuide(location, isSmallScreen, isAdmin);
        localStorage.setItem("hasSeenAmenities", "true");
      }
  }, [])
  // Fetch amenities only when component mounts
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/amenity/get-all-amenities");
        const amenitiesWithSerial = response.data.data.roomAmenities.map(
          (amenity, index) => ({
            ...amenity,
            serialNo: index + 1, // Add serial number to each row
          })
        );
        setAmenities(amenitiesWithSerial);
        dispatch(hideLoading());
      } catch (error) {
        // toast.error("Something went wrong");
        console.error("Error fetching amenities:", error);
        dispatch(hideLoading());
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
      dispatch(showLoading());
      await axios.delete(`/api/v1/amenity/delete/${deleteId}`);
      setAmenities((prevAmenities) =>
        prevAmenities.filter((amenity) => amenity.id !== deleteId)
      );
      handleClose();
      toast.success("Amenity deleted successfully!");
      dispatch(hideLoading());
    } catch (error) {
      // toast.error("Failed to delete amenity!");
      console.error("Error deleting amenity:", error);
      dispatch(hideLoading());
    }
  };

  const handleStatusChange = async (id) => {
    try {
      dispatch(showLoading());
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
      dispatch(hideLoading());
      toast.success(
        `Amenity status changed to ${updatedRoomAmenity.status ? "Active" : "Inactive"
        }`
      );
    } catch (error) {
      console.error("Error changing status:", error);
      dispatch(hideLoading());
      // toast.error("Failed to change Amenity status!");
    }
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "#",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 50,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Amenity Name",
      width: 200,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "description",
      headerName: "Description",
      width: 620,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 300,
      renderCell: (params) => (
        <Box height={"40px"} display="flex" alignItems="center" gap={2}>
          {user.UserType.amenitiesModule &&
            user.UserType.amenitiesModule.split(",").includes("edit") && (
              <Tooltip title="Edit">
                <EditOutlinedIcon
                  style={{ cursor: "pointer" }}
                  color="success"
                  onClick={() => handleEdit(params.id)}
                  className="amenity-edit"
                />
              </Tooltip>
            )}
          {user.UserType.amenitiesModule &&
            user.UserType.amenitiesModule.split(",").includes("delete") && (
              <Tooltip title="Delete">
                <DeleteOutlineOutlinedIcon
                  color="error"
                  onClick={() => handleOpen(params.id)}
                  style={{ cursor: "pointer" }}
                  className="amenity-delete"
                />
              </Tooltip>
            )}
          {user.UserType.amenitiesModule &&
            user.UserType.amenitiesModule
              .split(",")
              .includes("changeStatus") && (
              <Tooltip title="Change Status">
                <Switch
                  checked={params.row.status}
                  onChange={() => handleStatusChange(params.row.id)}
                  className="amenity-switch"
                />
              </Tooltip>
            )}
        </Box>
      ),
      headerClassName: "super-app-theme--header",
    },
  ];

  // Check for small screen using media query
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <PaperWrapper>
      <PageHeader
        heading={"Amenities"}
        icon={AddOutlinedIcon}
        func={setIsAddOpen}
        nameOfTheClass="add-amenity"
        statusIcon={
          user.UserType.amenitiesModule &&
          user.UserType.amenitiesModule.split(",").includes("add")
        }
      />
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
            user={user}
              key={amenity.id}
              amenity={amenity}
              handleEdit={handleEdit}
              handleDelete={handleOpen} // handleOpen is used to trigger deletion modal
              handleStatusChange={handleStatusChange}
            />
          ))}
        </Grid2>
      )}

      <div style={{ display: "flex", flexDirection: "column", height: "75vh" }}>
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
              "& .super-app-theme--header": {
                backgroundColor: `var(--linear-gradient-main)`,
                color: "#fff",
                fontWeight: "600",
                fontSize: "16px",
              },
            }}
            showCellVerticalBorder
            showColumnVerticalBorder
          />
        )}
      </div>

      {/* Modals for Add, Edit, Delete */}
      <NewPopUpModal
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

      <NewPopUpModal
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
