import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  styled,
  Button,
  Typography,
  Switch,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BlockIcon from "@mui/icons-material/Block";
import toast from "react-hot-toast";
import axios from "axios";
import DeleteModal from "../../components/Common Components/Modals/Delete/DeleteModal";
import "./MembersPage.css";
import { CircleRounded, PersonAddAlt1Rounded } from "@mui/icons-material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import AddMemberForm from "./AddMemberForm";
import UpdateMemberForm from "./UpdateMemberForm";
import ViewMember from "./ViewMember";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";
import { checkFileExists } from "../../utils/utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { PaperWrapper, RightContent } from "../../Style";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

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
  const filteredUsers = users.filter((user) =>
    showDeleted ? true : !user.deletedAt
  );

  const fetchUsers = async () => {
    try {
      showLoading();
      const response = await axios.get(`/api/v1/user/users?page=1&limit=10`);

      if (response.data.success) {
        setUsers(response.data.data.users.rows);
      }
      hideLoading();
    } catch (error) {
      console.error("Error fetching users:", error);
      hideLoading();
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
      showLoading();
      const response = await axios.delete(
        `/api/v1/user/soft-delete/${deleteId}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("User deleted successfully");
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== deleteId)
        );
      }
      showLoading();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      hideLoading();
    } finally {
      setLoading(false);
      handleClose(); // Close modal after delete
      hideLoading();
    }
  };

  // Block/unblock user
  const handleBlockStatusChange = async (id, isBlocked) => {
    try {
      showLoading();
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
      hideLoading();
    } catch (error) {
      console.error("Failed to update block status:", error);
      toast.error("An error occurred while updating the block status");
      hideLoading();
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "avatarPath",
      headerName: "Avatar",
      flex: 0.25,
      renderCell: (params) =>
        params.value ? (
          <>
            <img
              src={`${import.meta.env.VITE_API_URL}/${params.value}`}
              alt="avatar"
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            />
          </>
        ) : (
          <AccountCircleRoundedIcon
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />
        ),
    },
    { field: "fullname", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    {
      field: "action",
      flex: 0.5,
      headerName: "Action",
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Edit">
            <EditOutlinedIcon
              className="cursor"
              color="success"
              title="Edit"
              onClick={() => handleEdit(params.id)}
            />
          </Tooltip>
          <Tooltip title="View">
            <VisibilityOutlinedIcon
              color="secondary"
              className="cursor"
              onClick={() => handleView(params.id)}
            />
          </Tooltip>
          <div className="delete">
            <Tooltip title="Delete">
              <DeleteOutlineOutlinedIcon
                color="error"
                onClick={() => handleOpen(params.id)}
              />
            </Tooltip>
          </div>
          <div className="delete">
            <Tooltip title="Change Status">
              <Switch
                checked={params.row.isBlocked}
                onChange={() =>
                  handleBlockStatusChange(params.row.id, params.row.isBlocked)
                }
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
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
            Users
          </Typography>
          <div className="buttonWrapper">
            <CustomButton
              onClick={() => setShowDeleted(!showDeleted)}
              title={
                showDeleted
                  ? "Hide All Deleted Users"
                  : "Show All Deleted Users"
              }
              Icon={showDeleted ? VisibilityIcon : VisibilityOffIcon}
              fontSize="medium"
              background={"#1976d291"}
              placement={"left"}
            />
            <CustomButton
              onClick={() => setIsOpen(true)}
              title={"Add New User"}
              Icon={PersonAddAlt1Rounded}
              fontSize="medium"
              background={"rgba(3, 176, 48, 0.68)"}
              placement={"bottom"}
            />
          </div>
        </Box>
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
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            height="100%"
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
            getRowClassName={(params) => {
              if (params.row.deletedAt) {
                return "delete-row";
              }
              if (params.row.isAdmin) {
                return "admin-row";
              }
              return "";
            }}
          />
        </Box>
        <div className="legends">
          <div className="legendAdmin">
            <CircleRounded color="success" />
            <p className="legendText">Admins</p>
          </div>
          <div className="legendDeleted">
            <CircleRounded color="error" />
            <p className="legendText">Deleted Members</p>
          </div>
        </div>
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
