import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { Box, Switch, Tooltip, useMediaQuery, Grid2 } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import LocationAdd from "./LocationAdd";
import axios from "axios";
import toast from "react-hot-toast";
import LocationEdit from "./LocationEdit";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import LocationCard from "./LocationCard";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import CheckAndShowImage from "../../components/Common/CustomImage/showImage";
import {
  AddOutlinedIcon,
  DeleteOutlineOutlinedIcon,
  EditOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";

const LocationPage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [location, setLocation] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/location/locations");
        const locationWithSerial = response.data.data.locations.map(
          (location, index) => ({
            ...location,
            serialNo: index + 1,
          })
        );
        setLocation(locationWithSerial);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        // toast.error("Something Went Wrong");
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
      dispatch(showLoading());
      await axios.delete(`/api/v1/location/locations/delete/${deleteId}`);
      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Location deleted successfully!");
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      // toast.error("Failed to delete location!");
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
      dispatch(showLoading());
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
        `Location status changed to ${updatedLocation.status ? "Active" : "Inactive"
        }`
      );
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing status:", error);
      // toast.error("Failed to change location status!");
    }
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "#",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "locationImagePath",
      headerName: "Image",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 2,
      renderCell: (params) => (
        <CheckAndShowImage
          imageUrl={`${import.meta.env.VITE_API_URL}/${params.value}`}
        />
      ),
      headerClassName: "super-app-theme--header",
    },
    {
      field: "locationName",
      headerName: "Name",
      flex: 5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          {user.UserType.locationModule &&
            user.UserType.locationModule.split(",").includes("edit") && (
              <Tooltip title="Edit">
                <EditOutlinedIcon
                  className="location-edit"
                  color="success"
                  onClick={() => handleEdit(params.row.id)}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}
          {user.UserType.locationModule &&
            user.UserType.locationModule.split(",").includes("delete") && (
              <Tooltip title="Delete">
                <DeleteOutlineOutlinedIcon
                  className="location-delete"
                  color="error"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpen(params.row.id)}
                />
              </Tooltip>
            )}
          {user.UserType.locationModule &&
            user.UserType.locationModule
              .split(",")
              .includes("changeStatus") && (
              <Tooltip title="Change Status">
                <Switch
                  className="location-switch"
                  checked={params.row.status}
                  onChange={() => handleStatusChange(params.row.id)}
                />
              </Tooltip>
            )}
        </Box>
      ),
      headerClassName: "super-app-theme--header",
    },
  ];

  return (
    <PaperWrapper>
      <PageHeader
        heading={"Location"}
        icon={AddOutlinedIcon}
        title={"Add"}
        func={setIsAddOpen}
        nameOfTheClass="add-location"
        statusIcon={
          user.UserType.locationModule &&
          user.UserType.locationModule.split(",").includes("add")
        }
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
        <div
          style={{ display: "flex", flexDirection: "column", height: "75vh" }}
        >
          <DataGrid
            rows={location}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            rowHeight={40}
            sx={{
              "& .super-app-theme--header": {
                backgroundColor: `var(--linear-gradient-main)`,
                color: "#fff",
                fontWeight: "600",
                fontSize: "16px",
              },
            }}
          />
        </div>
      )}

      <NewPopUpModal
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
      <NewPopUpModal
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
            locationImagePath={
              location.find((loc) => loc.id === updatedId)?.locationImagePath ||
              ""
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
