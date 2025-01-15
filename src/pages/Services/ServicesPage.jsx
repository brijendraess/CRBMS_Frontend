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
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import ServicesCard from "../../components/Responsive/Services/ServicesCard";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch,useSelector } from "react-redux";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../components/Common/CustomButton/CustomIcon";

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        showLoading();
        const response = await axios.get(
          "/api/v1/services/all"
        );
        const servicesWithSerial = response.data.data.result.map(
          (services, index) => ({
            ...services,
            serialNo: index + 1,
          })
        );
        setServices(servicesWithSerial);
        hideLoading();
      } catch (error) {
        hideLoading();
        toast.error("Something Went Wrong");
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
      showLoading();
      await axios.delete(
        `/api/v1/services/delete/${deleteId}`
      );

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Services deleted successfully!");
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error("Failed to delete services!");
      console.error("Error deleting services:", error);
    }
  };

  const handleUpdateSuccess = (updatedServices) => {
    setServices((prev) =>
      prev.map((loc) =>
        loc.id === updatedServices.id ? updatedServices : loc
      )
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
        `/api/v1/services/changeStatus/${id}`
      );
      const updatedServices = response.data.data.result;

      setServices((prev) =>
        prev.map((loc) =>
          loc.id === id ? { ...loc, status: updatedServices.status } : loc
        )
      );

      toast.success(
        `Services status changed to ${updatedServices.status ? "Active" : "Inactive"}`
      );
      hideLoading();
    } catch (error) {
      hideLoading();
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
          {user.UserType.servicesModule&&user.UserType.servicesModule.split(",").includes("edit")&&<Tooltip title="Edit">
            <EditOutlinedIcon
              color="success"
              onClick={() => handleEdit(params.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>}
          {user.UserType.servicesModule&&user.UserType.servicesModule.split(",").includes("delete")&&<Tooltip title="Delete">
            <DeleteOutlineOutlinedIcon
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => handleOpen(params.row.id)}
            />
          </Tooltip>}
          {user.UserType.servicesModule&&user.UserType.servicesModule.split(",").includes("changeStatus")&&<Tooltip title="Change Status">
            <Switch
              checked={params.row.status}
              onChange={() => handleStatusChange(params.row.id)}
            />
          </Tooltip>}
        </Box>
      ),
      headerClassName: "super-app-theme--header",
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
            fontSize: {
              xs: "16px",
              sm: "18px",
              md: "22px",
            },
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#2E2E2E",
          }}
        >
          Services
        </Typography>
        {user.UserType.servicesModule&&user.UserType.servicesModule.split(",").includes("add")&&
        <CustomButton
          onClick={() => setIsAddOpen(true)}
          title={"Add Service"}
          placement={"left"}
          Icon={AddOutlinedIcon}
          fontSize={"medium"}
          background={"rgba(3, 176, 48, 0.68)"}
          statusIcon={user.UserType.servicesModule&&user.UserType.servicesModule.split(",").includes("add")}
        />}
      </Box>
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={services}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            rowHeight={40}
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
        </div>
      )}
      <PopupModals
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
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Services"}
        modalBody={
          <ServicesEdit
            id={updatedId}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
            servicesName={
              services.find((loc) => loc.id === updatedId)
                ?.servicesName || ""
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
