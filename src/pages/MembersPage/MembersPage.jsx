import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Tooltip,
  Grid2,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import axios from "axios";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import "./MembersPage.css";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import AddMemberForm from "./AddMemberForm";
import UpdateMemberForm from "./UpdateMemberForm";
import ViewMember from "./ViewMember";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { PaperWrapper } from "../../Style";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import UserCard from "../../components/Cards/UserCard";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CheckAndShowImage from "../../components/Common/CustomImage/showImage";
import {
  DeleteOutlineOutlinedIcon,
  EditOutlinedIcon,
  PersonAddAlt1Rounded,
  VisibilityIcon,
  VisibilityOffIcon,
  VisibilityOutlinedIcon,
} from "../../components/Common/CustomButton/CustomIcon";

const MembersPage = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updatedId, setUpdatedId] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewId, setViewId] = useState("");
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const filteredUsers = users
    .filter((user) => (showDeleted ? true : !user.deletedAt))
    .map((user) => ({ ...user, userType: user?.UserType?.userTypeName }));
  const dispatch = useDispatch();

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const fetchUsers = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/v1/user/users?page=1&limit=10`);
      if (response.data.success) {
        setUsers(response.data.data.users.rows);
      }
      dispatch(hideLoading());
    } catch (error) {
      console.error("Error fetching users:", error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshPage]);

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleEdit = (id) => {
    setUpdatedId(id);
    setIsEditOpen(true);
  };

  const handleView = (id) => {
    setViewId(id);
    setIsViewOpen(true);
  };

  const handleDelete = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `/api/v1/user/soft-delete/${deleteId}`
      );
      if (response.status === 200) {
        toast.success("User deleted successfully");
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== deleteId)
        );
      }
      handleClose(false);
      dispatch(hideLoading());
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      dispatch(hideLoading());
    } finally {
      setLoading(false);
      handleClose(); // Close modal after delete
      dispatch(hideLoading());
    }
  };

  // Block/unblock user
  const handleBlockStatusChange = async (id, isBlocked) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/v1/user/block-status`,
        { userId: id, isBlocked: !isBlocked },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success(
          `User ${isBlocked ? "unblocked" : "blocked"} successfully`
        );
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, isBlocked: !isBlocked } : user
          )
        );
      }
      dispatch(hideLoading());
    } catch (error) {
      console.error("Failed to update block status:", error);
      toast.error("An error occurred while updating the block status");
      dispatch(hideLoading());
    } finally {
      setLoading(false);
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      field: "avatarPath",
      headerName: "Avatar",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 0.25,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CheckAndShowImage
          imageUrl={`${import.meta.env.VITE_API_URL}/${params.value}`}
        />
      ),
    },
    {
      field: "fullname",
      headerName: "Full Name",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userName",
      headerName: "User name",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "userType",
      headerName: "Role",
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      flex: 1,
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {user.UserType.userModule&&user.UserType.userModule.split(",").includes("edit")&&<Tooltip title="Update">
            <EditOutlinedIcon
              className="tour-edit"
              color="success"
              onClick={() => handleEdit(params.id)}
            />
          </Tooltip>}
          {user.UserType.userModule&&user.UserType.userModule.split(",").includes("view")&&<Tooltip title="View">
            <VisibilityOutlinedIcon
              color="secondary"
              className="tour-view"
              onClick={() => handleView(params.id)}
            />
          </Tooltip>}
          {user.UserType.userModule&&user.UserType.userModule.split(",").includes("delete")&&<div className="delete">
            <Tooltip title="Delete">
              <DeleteOutlineOutlinedIcon
              className="tour-delete"
                color="error"
                onClick={() => handleOpen(params.id)}
              />
            </Tooltip>
          </div>}
          {user.UserType.userModule&&user.UserType.userModule.split(",").includes("changeStatus")&&<div className="delete">
            <Tooltip title="Change Status">
              <Switch
              className="tour-block"
                checked={params.row.isBlocked}
                onChange={() =>
                  handleBlockStatusChange(params.row.id, params.row.isBlocked)
                }
              />
            </Tooltip>
          </div>}
        </div>
      ),
    },
  ];

  return (
    <>
      <PaperWrapper>
        <PageHeader
          heading="Users"
          icon={PersonAddAlt1Rounded}
          func={setIsOpen}
          nameOfTheClass="add-user"
          statusIcon={user.UserType.userModule&&user.UserType.userModule.split(",").includes("add")}
        >
         {user.UserType.userModule&&user.UserType.userModule.split(",").includes("changeStatus")&& <CustomButton
            onClick={() => setShowDeleted(!showDeleted)}
            title={
              showDeleted ? "Hide All Deleted Users" : "Show All Deleted Users"
            }
            Icon={showDeleted ? VisibilityIcon : VisibilityOffIcon}
            fontSize={isSmallScreen ? "small" : "medium"}
            background={"#1976d291"}
            nameOfTheClass="deleted-user"
            placement={"left"}
          />}
        </PageHeader>

        {isSmallScreen ? (
          <Grid2
            container
            spacing={2}
            sx={{
              position: "relative",
              top: "10px",
              alignItems: "center",
              justifyContent: "center",
              // maxHeight: "100%",
              overflowY: "auto",
            }}
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  handleView={handleView}
                  handleEdit={handleEdit}
                  handleDelete={handleOpen}
                  handleBlockStatusChange={handleBlockStatusChange}
                />
              ))
            ) : (
              <Grid2 item xs={12}>
                <Box display="flex" justifyContent="center" width="100%" p={3}>
                  <Typography variant="h6" color="textSecondary">
                    No User found.
                  </Typography>
                </Box>
              </Grid2>
            )}
          </Grid2>
        ) : (
          <Box sx={{ width: "100%", height: "70vh" }}>
            <DataGrid
              autoPageSize
              showCellVerticalBorder
              showColumnVerticalBorder
              rows={filteredUsers}
              rowHeight={40}
              columns={[...columns]} 
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 12,
                  },
                },
              }}
              pageSizeOptions={[12]}
              height="100%"
              sx={{
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .super-app-theme--header": {
                  backgroundColor: "#006400",
                  // backgroundColor: "rgba(255, 223, 0, 1)",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "16px",
                },
              }}
              getRowClassName={(params) => {
                if (params.row.deletedAt) {
                  return "delete-row";
                }
                return "";
              }}
            />
          </Box>
        )}
      </PaperWrapper>

      <DeleteModal
        open={open}
        onClose={handleClose}
        onDeleteConfirm={handleDelete}
        title="user"
        button="Delete"
      />
      <PopupModals
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={"Add New Member"}
        modalBody={
          <AddMemberForm
            setRefreshPage={setRefreshPage}
            setIsOpen={setIsOpen}
          />
        }
      />
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Update Member Profile"}
        modalBody={
          <UpdateMemberForm
            id={updatedId}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
          />
        }
      />

      <PopupModals
        isOpen={isViewOpen}
        setIsOpen={setIsViewOpen}
        title={"View Member Profile"}
        modalBody={<ViewMember id={viewId} />}
      />
    </>
  );
};

export default MembersPage;
