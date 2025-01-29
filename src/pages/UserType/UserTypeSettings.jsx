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
import CustomButton from "../../components/Common/Buttons/CustomButton";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import EditUserTypeSettings from "./EditUserTypeSettings";
import AddUserTypeSettings from "./AddUserTypeSettings";
import UserTypeCard from "../../components/Responsive/UserType/UserTypeCard";
import { useNavigate } from "react-router-dom";
import { replaceAndUppercase } from "../../utils/utils";
import PageHeader from "../../components/Common/PageHeader/PageHeader";

const UserTypeSettings = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  // const [isAddOpen, setIsAddOpen] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [userRoleDB, setUserRoleDB] = useState([]);
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
        // console.log(response.data.data.result);
        const userType = response?.data?.data?.result?.map((type, index) => {
          const permissionArray = [];

          type.calendarModule &&
            permissionArray.push({
              name: `<b>Calendar:</b> ${replaceAndUppercase(
                type.calendarModule
              )}`,
            });
          type.userModule &&
            permissionArray.push({
              name: `<b>User:</b> ${replaceAndUppercase(type.userModule)}`,
            });
          type.committeeModule &&
            permissionArray.push({
              name: `<b>Committee:</b> ${replaceAndUppercase(
                type.committeeModule
              )}`,
            });
          type.notificationModule &&
            permissionArray.push({
              name: `<b>Notification:</b> ${replaceAndUppercase(
                type.notificationModule
              )}`,
            });

          type.inventoryModule &&
            permissionArray.push({
              name: `<b>Inventory:</b> ${replaceAndUppercase(
                type.inventoryModule
              )}`,
            });
          type.committeeMemberModule &&
            permissionArray.push({
              name: `<b>Committee Member:</b> ${replaceAndUppercase(
                type.committeeMemberModule
              )}`,
            });
          type.meetingLogsModule &&
            permissionArray.push({
              name: `<b>Meeting Logs:</b> ${replaceAndUppercase(
                type.meetingLogsModule
              )}`,
            });
          type.amenitiesModule &&
            permissionArray.push({
              name: `<b>Amenities:</b> ${replaceAndUppercase(
                type.amenitiesModule
              )}`,
            });

          type.roomModule &&
            permissionArray.push({
              name: `<b>Room:</b> ${replaceAndUppercase(type.roomModule)}`,
            });
          type.locationModule &&
            permissionArray.push({
              name: `<b>Location:</b> ${replaceAndUppercase(
                type.locationModule
              )}`,
            });
          type.foodBeverageModule &&
            permissionArray.push({
              name: `<b>Food and Beverage:</b> ${replaceAndUppercase(
                type.foodBeverageModule
              )}`,
            });
          type.reportModule &&
            permissionArray.push({
              name: `<b>Report:</b> ${replaceAndUppercase(type.reportModule)}`,
            });
          type.userRoleModule &&
            permissionArray.push({
              name: `<b>User Role:</b> ${replaceAndUppercase(
                type.userRoleModule
              )}`,
            });

          return {
            id: index + 1,
            serialNo: index + 1,
            uid: type.id,
            userTypeName: type.userTypeName,
            permission: permissionArray.map((item) => item.name).join("<br />"), // String with newlines
            isAdmin: type.isAdmin,
            status: type.status,
          };
        });
        // console.log("SDASDA",response.data.data.result)
        const userTypeDB = response.data.data.result.map((type, index) => ({
          id: index + 1,
          serialNo: index + 1,
          uid: type.id,
          userTypeName: type.userTypeName,
          calendarModule: type.calendarModule,
          userModule: type.userModule,
          committeeModule: type.committeeModule,
          notificationModule: type.notificationModule,
          inventoryModule: type.inventoryModule,
          committeeMemberModule: type.committeeMemberModule,
          meetingLogsModule: type.meetingLogsModule,
          amenitiesModule: type.amenitiesModule,
          servicesModule: type.servicesModule,
          roomModule: type.roomModule,
          locationModule: type.locationModule,
          foodBeverageModule: type.foodBeverageModule,
          reportModule: type.reportModule,
          userRoleModule: type.userRoleModule,
          isAdmin: type.isAdmin,
          status: type.status,
        }));
        setUserRoleDB(userTypeDB);
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
    const selectedRole = userRoleDB.find((role) => role.uid === id);
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
        `User role status changed to ${updatedUserRole.status ? "Active" : "Inactive"
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
      field: "permission",
      headerName: "Permission",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div
          dangerouslySetInnerHTML={{ __html: params.value }}
          style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
        />
      ),
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
      <PageHeader
        heading="User Role"
        icon={AddOutlinedIcon}
        func={handleAdd}
        nameOfTheClass="add-user-role"
        statusIcon={
          user.UserType.userRoleModule &&
          user.UserType.userRoleModule.split(",").includes("add")
        }
      />
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
          getRowHeight={() => "auto"} // Automatically adjusts the row height
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
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
