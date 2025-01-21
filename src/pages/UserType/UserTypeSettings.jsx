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
import { useNavigate } from "react-router-dom";
import { replaceAndUppercase } from "../../utils/utils";

const UserTypeSettings = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  // const [isAddOpen, setIsAddOpen] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get(`/api/v1/user-type/all`);
        const userType = response.data.data.result.map((type, index) => ({
          id: index + 1,
          serialNo: index + 1,
          uid: type.id,
          userTypeName: type.userTypeName,
          calendarModule: replaceAndUppercase(type.calendarModule),
          userModule: replaceAndUppercase(type.userModule),
          committeeModule: replaceAndUppercase(type.committeeModule),
          committeeMemberModule: replaceAndUppercase(
            type.committeeMemberModule
          ),
          meetingLogsModule: replaceAndUppercase(type.meetingLogsModule),
          amenitiesModule: replaceAndUppercase(type.amenitiesModule),
          roomModule: replaceAndUppercase(type.roomModule),
          locationModule: replaceAndUppercase(type.locationModule),
          foodBeverageModule: replaceAndUppercase(type.foodBeverageModule),
          reportModule: replaceAndUppercase(type.reportModule),
          userRoleModule: replaceAndUppercase(type.userRoleModule),
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

  const handleAdd = () => {
    navigate("/user-role/add-new-role");
  };

  const handleEdit = (id) => {
    const selectedRole = userRole.find((role) => role.uid === id);
    console.log("Selected Role:", selectedRole);

    if (selectedRole) {
      navigate(`/user-role/edit-role/${id}`, {
        state: { userRole: selectedRole },
      });
    } else {
      toast.error("Failed to find the selected role");
    }
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

  // const handleUpdateSuccess = (updatedUserRole) => {
  //   setUserRole((prev) =>
  //     prev.map((role) =>
  //       role.id === updatedUserRole.id ? updatedUserRole : role
  //     )
  //   );
  //   setIsEditOpen(false);
  // };

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
        `User role status changed to ${
          updatedUserRole.status ? "Active" : "Inactive"
        }`
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
      width: 50,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userTypeName",
      headerName: "User Type",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "calendarModule",
      headerName: "Calendar",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userModule",
      headerName: "User",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "committeeModule",
      headerName: "Committee",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "amenitiesModule",
      headerName: "Amenities",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomModule",
      headerName: "Room",
      width: 600,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "locationModule",
      headerName: "Location",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "foodBeverageModule",
      headerName: "foodBeverage",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "reportModule",
      headerName: "report",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userRoleModule",
      headerName: "userRole",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 200,

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
          onClick={handleAdd}
          title={"Add New Room"}
          placement={"left"}
          Icon={AddOutlinedIcon}
          fontSize={"medium"}
          background={"rgba(3, 176, 48, 0.68)"}
        />
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "75vh",
        }}
      >
        <DataGrid
          rows={userRole}
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
      </Box>
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
