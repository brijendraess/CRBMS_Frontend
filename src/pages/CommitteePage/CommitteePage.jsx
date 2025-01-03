import React, { useEffect, useState } from "react";
import {
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Box,
  Tooltip,
  Button,
  Chip,
  Switch,
} from "@mui/material";
import axios from "axios";
import CommitteeCard from "../../components/CommitteeCard/CommitteeCard";
import { PaperWrapper } from "../../Style";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import AddCommitteeForm from "./AddCommitteeForm";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import { useDispatch } from "react-redux";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
  PeopleIcon,
} from "../../components/Common/CustomButton/CustomIcon";

const CommitteeManagementMUI = () => {
  const [committeeData, setCommitteeData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isAddCommittee, setIsAddCommittee] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const dispatch = useDispatch();

  const fetchCommittee = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/committee/committees");
      if (response.data?.data?.committees) {
        setCommitteeData(response.data.data.committees);
      }
      dispatch(hideLoading());
    } catch (err) {
      console.error("Error fetching committees:", err);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, [refreshPage]);

  const filteredCommittees = committeeData.filter((committee) => {
    if (filter === "active") return committee.status === true;
    if (filter === "inactive") return committee.status === false;
    return true;
  });

  const handleDeleteCommittee = async (id) => {
    try {
      dispatch(showLoading());
      await axios.delete(`/api/v1/committee/committees/${id}`, {
        withCredentials: true,
      });
      toast.success("Committee deleted successfully!");
      setRefreshPage((prev) => prev + 1);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error deleting committee:", error);
      toast.error("Failed to delete committee. Please try again.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    const payload = { committeeId: id, status: updatedStatus };

    try {
      dispatch(showLoading());
      const response = await axios.put(
        `/api/v1/committee/change-status`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        setRefreshPage((prev) => prev + 1);
        toast.success("Committee status changed successfully!");
      } else {
        toast.error("Failed to change committee status. Please try again.");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing committee status:", error);
      toast.error("Failed to change committee status. Please try again.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleNavigateToMemberList = (id) => {
    navigate(`/view-committee/${id}`);
  };

  const handleAddCommittee = (newCommittee) => {
    setCommitteeData((prev) => [...prev, newCommittee]);
    setIsAddCommittee(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Committee Name",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Tooltip title="Delete">
            <DeleteOutlineOutlinedIcon
              onClick={() => {
                setDeleteId(params.row.id);
                setDeleteModalOpen(true);
              }}
              sx={{ cursor: "pointer" }}
              fontSize="medium"
              color="error"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlinedIcon
              color="success"
              onClick={() => {
                setSelectedCommitteeId(params.row.id);
                setIsEditOpen(true);
              }}
              sx={{ cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Change Status">
            <Switch
              size="small"
              checked={!!params.row.status}
              onChange={() =>
                handleChangeStatus(params.row.id, !!params.row.status)
              }
            />
          </Tooltip>
          <Tooltip title="View all members">
            <Chip
              label={`${params.row.CommitteeMembers?.length || 0}`}
              size="large"
              color="success"
              variant="outlined"
              icon={<PeopleIcon />}
              onClick={() => handleNavigateToMemberList(params.row.id)}
              sx={{ cursor: "pointer", padding: "5px" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <PaperWrapper>
        <PageHeader
          heading="Committee"
          icon={AddOutlinedIcon}
          func={setIsAddCommittee}
          title="Add New Committee"
        >
          <FormControl style={{ marginRight: "5 px", width: "100px" }}>
            <InputLabel id="filter-select-label">Show</InputLabel>
            <Select
              labelId="filter-select-label"
              id="filter-select"
              value={filter}
              label="Show"
              onChange={(e) => setFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </PageHeader>

        {isSmallScreen ? (
          <Grid2
            container
            spacing={3}
            sx={{
              borderRadius: "20px",
              position: "relative",
              top: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {filteredCommittees.map((committee) => (
              <CommitteeCard
                key={committee.id}
                committee={committee}
                heading={committee.name}
                onDelete={handleDeleteCommittee}
                onEdit={() => {
                  setSelectedCommitteeId(committee.id);
                  setIsEditOpen(true);
                }}
                onChangeStatus={handleChangeStatus}
                onViewMembers={handleNavigateToMemberList}
              />
            ))}
          </Grid2>
        ) : (
          <Box sx={{ width: "100%", height: "70vh" }}>
            <DataGrid
              autoPageSize
              showCellVerticalBorder
              showColumnVerticalBorder
              rows={filteredCommittees}
              columns={columns}
              rowHeight={40}
              pageSizeOptions={[10]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
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
          </Box>
        )}

        <PopupModals
          modalBody={
            <AddCommitteeForm
              onAddCommittee={handleAddCommittee}
              setRefreshPage={setRefreshPage}
            />
          }
          isOpen={isAddCommittee}
          title={"Add Committee"}
          setIsOpen={setIsAddCommittee}
          width={500}
        />

        <PopupModals
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          title={"Edit Committee"}
          modalBody={
            <AddCommitteeForm
              committeeId={selectedCommitteeId}
              setRefreshPage={setRefreshPage}
              setIsEditOpen={setIsEditOpen}
            />
          }
          width={500}
        />

        <DeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDeleteConfirm={() => handleDeleteCommittee(deleteId)}
          title="committee"
          button="Delete"
        />
      </PaperWrapper>
    </>
  );
};

export default CommitteeManagementMUI;
