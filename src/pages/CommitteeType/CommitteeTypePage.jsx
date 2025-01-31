import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { Box, Switch, Tooltip, useMediaQuery, Grid2 } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import CommitteeTypeAdd from "./CommitteeTypeAdd";
import axios from "axios";
import toast from "react-hot-toast";
import CommitteeTypeEdit from "./CommitteeTypeEdit";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import CommitteeTypeCard from "./CommitteeTypeCard";
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

const CommitteeTypePage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [committeeType, setCommitteeType] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCommitteeTypes = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/committeeType/committeeTypes");
        console.log(response)
        const committeeTypeWithSerial = response.data.data.committeeTypes.map(
          (committeeType, index) => ({
            ...committeeType,
            serialNo: index + 1,
          })
        );
        setCommitteeType(committeeTypeWithSerial);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        // toast.error("Something Went Wrong");
        console.error("Error fetching committeeTypes:", error);
      }
    };

    fetchCommitteeTypes();
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
      await axios.delete(`/api/v1/committeeType/committeeTypes/delete/${deleteId}`);
      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("committeeType deleted successfully!");
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to delete committeeType!");
      console.error("Error deleting committeeType:", error);
    }
  };

  const handleUpdateSuccess = (updatedCommitteeType) => {
    setCommitteeType((prev) =>
      prev.map((loc) => (loc.id === updatedCommitteeType.id ? updatedCommitteeType : loc))
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
        `/api/v1/committeeType/committeeTypes/${id}/status`
      );
      const updatedCommitteeType = response.data.data.committeeType;

      setCommitteeType((prev) =>
        prev.map((loc) =>
          loc.id === id ? { ...loc, status: updatedCommitteeType.status } : loc
        )
      );

      toast.success(
        `committeeType status changed to ${updatedCommitteeType.status ? "Active" : "Inactive"
        }`
      );
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing status:", error);
      toast.error("Failed to change committeeType status!");
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
      field: "name",
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
          {user.UserType.committeeTypeModule &&
            user.UserType.committeeTypeModule.split(",").includes("edit") && (
              <Tooltip title="Edit">
                <EditOutlinedIcon
                  className="committeeType-edit"
                  color="success"
                  onClick={() => handleEdit(params.row.id)}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}
          {user.UserType.committeeTypeModule &&
            user.UserType.committeeTypeModule.split(",").includes("delete") && (
              <Tooltip title="Delete">
                <DeleteOutlineOutlinedIcon
                  className="committeeType-delete"
                  color="error"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpen(params.row.id)}
                />
              </Tooltip>
            )}
          {user.UserType.committeeTypeModule &&
            user.UserType.committeeTypeModule
              .split(",")
              .includes("changeStatus") && (
              <Tooltip title="Change Status">
                <Switch
                  className="committeeType-switch"
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
        heading={"Committee Type"}
        icon={AddOutlinedIcon}
        title={"Add"}
        func={setIsAddOpen}
        nameOfTheClass="add-committeeType"
        statusIcon={
          user.UserType.committeeTypeModule &&
          user.UserType.committeeTypeModule.split(",").includes("add")
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
          {committeeType.map((loc, index) => (
            <CommitteeTypeCard
              key={loc.id}
              committeeType={loc}
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
            rows={committeeType}
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
        title={"Add committee Type"}
        modalBody={
          <CommitteeTypeAdd
            setRefreshPage={setRefreshPage}
            setIsAddOpen={setIsAddOpen}
          />
        }
      />
      <NewPopUpModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit committee Type"}
        modalBody={
          <CommitteeTypeEdit
            id={updatedId}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
            committeeTypeName={
              committeeType.find((loc) => loc.id === updatedId)?.name || ""
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

export default CommitteeTypePage;
