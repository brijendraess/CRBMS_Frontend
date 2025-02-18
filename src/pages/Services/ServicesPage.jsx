import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import {
  Box,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
  Grid2,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import ServicesAdd from "./ServicesAdd";
import axios from "axios";
import toast from "react-hot-toast";
import ServicesEdit from "./ServicesEdit";
import CustomButton from "../../components/Common/Buttons/CustomButton";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import ServicesCard from "../../components/Responsive/Services/ServicesCard";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch, useSelector } from "react-redux";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";
import { handleStartGuide } from "../../utils/utils";
import { useLocation } from "react-router-dom";

const ServicesPage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width:768px)");
  const dispatch = useDispatch();

  const location = useLocation();
  const isAdmin = user?.UserType?.isAdmin === 'admin';  

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenServices");
      if(user && !user.lastLoggedIn && (hasSeenTour === "false" || hasSeenTour === null)){
        handleStartGuide(location, isSmallScreen, isAdmin);
        localStorage.setItem("hasSeenServices", "true");
      }
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/services/all");
        const servicesWithSerial = response.data.data.result.map(
          (services, index) => ({
            ...services,
            serialNo: index + 1,
          })
        );
        setServices(servicesWithSerial);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        // toast.error("Something Went Wrong");
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
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
      await axios.delete(`/api/v1/services/delete/${deleteId}`);

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Services deleted successfully!");
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to delete services!");
      console.error("Error deleting services:", error);
    }
  };

  const handleUpdateSuccess = (updatedServices) => {
    setServices((prev) =>
      prev.map((loc) => (loc.id === updatedServices.id ? updatedServices : loc))
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
      const response = await axios.patch(`/api/v1/services/changeStatus/${id}`);
      const updatedServices = response.data.data.result;

      setServices((prev) =>
        prev.map((loc) =>
          loc.id === id ? { ...loc, status: updatedServices.status } : loc
        )
      );

      toast.success(
        `Services status changed to ${
          updatedServices.status ? "Active" : "Inactive"
        }`
      );
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing status:", error);
      toast.error("Failed to change services status!");
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
      field: "servicesName",
      headerName: "Name",
      flex: 3,
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
          {user.UserType.servicesModule &&
            user.UserType.servicesModule.split(",").includes("edit") && (
              <Tooltip title="Edit">
                <EditOutlinedIcon
                  color="success"
                  onClick={() => handleEdit(params.row.id)}
                  style={{ cursor: "pointer" }}
                  className="edit-service"
                />
              </Tooltip>
            )}
          {user.UserType.servicesModule &&
            user.UserType.servicesModule.split(",").includes("delete") && (
              <Tooltip title="Delete">
                <DeleteOutlineOutlinedIcon
                  color="error"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpen(params.row.id)}
                  className="delete-service"
                />
              </Tooltip>
            )}
          {user.UserType.servicesModule &&
            user.UserType.servicesModule
              .split(",")
              .includes("changeStatus") && (
              <Tooltip title="Change Status">
                <Switch
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
        heading="Services"
        icon={AddOutlinedIcon}
        func={setIsAddOpen}
        nameOfTheClass="add-new-service"
        statusIcon={
          user.UserType.servicesModule &&
          user.UserType.servicesModule.split(",").includes("add")
        }
      />
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
          {services.map((services) => (
            <ServicesCard
              user={user}
              key={services.id}
              services={services}
              handleEdit={handleEdit}
              handleDelete={handleOpen}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </Grid2>
      )}
      {!isSmallScreen && (
        <div
          style={{ display: "flex", flexDirection: "column", height: "75vh" }}
        >
          <DataGrid
            rows={services}
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
        title={"Add Services"}
        modalBody={
          <ServicesAdd
            setRefreshPage={setRefreshPage}
            setIsAddOpen={setIsAddOpen}
          />
        }
      />
      <NewPopUpModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Services"}
        modalBody={
          <ServicesEdit
            id={updatedId}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
            servicesName={
              services.find((loc) => loc.id === updatedId)?.servicesName || ""
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

export default ServicesPage;
