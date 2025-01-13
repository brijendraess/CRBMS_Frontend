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
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../components/Common/CustomButton/CustomIcon";
import EditUserTypeSettings from "./EditUserTypeSettings";
import AddUserTypeSettings from "./AddUserTypeSettings";
import UserTypeCard from "../../components/Responsive/UserType/UserTypeCard";

const UserTypeSettings = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get(`/api/v1/user-type/all`);
        const userType = response.data.data.result.map((type, index) => ({
          id: index + 1,
          serialNo: index + 1,
          uid: type.id,
          userTypeName: type.userTypeName,
          calendarModule: type.calendarModule,
          userModule: type.userModule,
          committeeModule: type.committeeModule,
          committeeMemberModule: type.committeeMemberModule,
          meetingLogsModule:type.meetingLogsModule,
          amenitiesModule: type.amenitiesModule,
          roomModule: type.roomModule,
          locationModule: type.locationModule,
          foodBeverageModule: type.foodBeverageModule,
          reportModule: type.reportModule,
          userRoleModule: type.userRoleModule,
          isAdmin: type.isAdmin,
          status: type.status,
        }));
        setUserRole(userType);
      } catch (error) {
        toast.success("Something Went Wrong");
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
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
      await axios.delete(`/api/v1/user-type/delete/${deleteId}`);

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("user role deleted successfully!");
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error("Failed to delete user role!");
      console.error("Error deleting user role:", error);
    }
  };

  const handleUpdateSuccess = (updatedUserRole) => {
    setUserRole((prev) =>
      prev.map((role) =>
        role.id === updatedUserRole.id ? updatedUserRole : role
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
        `/api/v1/user-type/changeStatus/${id}`
      );
      const updatedUserRole = response.data.data.result;

      setUserRole((prev) =>
        prev.map((role) =>
          role.uid === id ? { ...role, status: updatedUserRole.status } : role
        )
      );

      toast.success(
        `User role status changed to ${updatedUserRole.status ? "Active" : "Inactive"}`
      );
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error("Error changing status:", error);
      toast.error("Failed to change user role status!");
    }
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "#",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 0.3,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userTypeName",
      headerName: "User Type",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "calendarModule",
      headerName: "Calendar",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userModule",
      headerName: "User",
      flex: 0.75,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "committeeModule",
      headerName: "Committee",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "amenitiesModule",
      headerName: "Amenities",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomModule",
      headerName: "Room",
      flex: 0.75,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "locationModule",
      headerName: "Location",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "foodBeverageModule",
      headerName: "foodBeverage",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "reportModule",
      headerName: "report",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userRoleModule",
      headerName: "userRole",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 1.3,

      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          {user.UserType?.userRoleModule &&
            user.UserType.userRoleModule.split(",").includes("edit") && (
              <Tooltip title="Edit">
                <EditOutlinedIcon
                  color="success"
                  onClick={() => handleEdit(params.row.uid)}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}
          {user.UserType?.userRoleModule &&
            user.UserType.userRoleModule.split(",").includes("delete") && (
              <Tooltip title="Delete">
                <DeleteOutlineOutlinedIcon
                  color="error"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpen(params.row.uid)}
                />
              </Tooltip>
            )}
          {user.UserType?.userRoleModule &&
            user.UserType.userRoleModule
              .split(",")
              .includes("changeStatus") && (
              <Tooltip title="Change Status">
                <Switch
                  checked={params.row.status}
                  onChange={() => handleStatusChange(params.row.uid)}
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
          User Role
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
          {userRole.map((food) => (
            <UserTypeCard
              key={food.id}
              food={food}
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
            rows={userRole}
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
        title={"Add User Role"}
        modalBody={
          <AddUserTypeSettings
            setRefreshPage={setRefreshPage}
            setIsAddOpen={setIsAddOpen}
          />
        }
      />
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit User Role"}
        modalBody={
          <EditUserTypeSettings
            id={updatedId}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
            userRole={userRole.find((role) => role.uid === updatedId)}
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

export default UserTypeSettings;
