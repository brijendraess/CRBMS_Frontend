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
  Paper,
} from "@mui/material";
import axios from "axios";
import CommitteeCard from "../../components/CommitteeCard/CommitteeCard";
import { PaperWrapper } from "../../Style";
import AddCommitteeForm from "./AddCommitteeForm";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
  PeopleIcon,
  CategoryOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";
import CustomButton from "../../components/Common/Buttons/CustomButton";
import BackupTableOutlinedIcon from "@mui/icons-material/BackupTableOutlined";
import { handleStartGuide } from "../../utils/utils";

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
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation  ();
  const isAdmin = user?.UserType?.isAdmin === 'admin';
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenCommittee");
    console.log(hasSeenTour, "hass")
    console.log(user, "userData")
    console.log(user.lastLoggedIn, "userDatalastLoggedIn")
    if(user && !user.lastLoggedIn && (hasSeenTour === "false" || hasSeenTour === null)){
      console.log("in if")
      handleStartGuide(location, isSmallScreen, isAdmin);
      localStorage.setItem("hasSeenCommittee", "true");
    }
}, [])

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

  let filteredCommitteesMediate = committeeData.filter((committee) => {
    if (filter === "active") return committee.status === true;
    if (filter === "inactive") return committee.status === false;
    return true;
  });
  const filteredCommittees = filteredCommitteesMediate.map((data) =>
    Object.assign({}, data, { committeeTypeName: data?.CommitteeType?.name })
  );

  const handleDeleteCommittee = async (id) => {
    try {
      dispatch(showLoading());
      await axios.delete(`/api/v1/committee/committees/${id}`, {
        withCredentials: true,
      });
      toast.success("Committee deleted successfully!");
      setDeleteModalOpen(false);
      setRefreshPage((prev) => prev + 1);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setDeleteModalOpen(false);
      console.error("Error deleting committee:", error);
      // toast.error("Failed to delete committee. Please try again.");
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
        // toast.error("Failed to change committee status. Please try again.");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing committee status:", error);
      // toast.error("Failed to change committee status. Please try again.");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleNavigateToMemberList = (id) => {
    const committeeId = id;
    navigate(`/view-committee/${committeeId}`, {
      state: { committeeData },
    });
  };

  const handleAddCommittee = (newCommittee) => {
    setCommitteeData((prev) => [...prev, newCommittee]);
    setIsAddCommittee(false);
  };

  const handleNavigateToCommitteeTypeList = () => {
    navigate(`/committee-type`);
  };

  const columns = [
    {
      field: "name",
      headerName: "Committee Name",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "committeeTypeName",
      headerName: "Committee Type",
      flex: 0.5,
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
      flex: 0.5,
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
          {user.UserType.committeeModule &&
            user.UserType.committeeModule.split(",").includes("delete") && (
              <Tooltip title="Delete">
                <DeleteOutlineOutlinedIcon
                  onClick={() => {
                    setDeleteId(params.row.id);
                    setDeleteModalOpen(true);
                  }}
                  sx={{ cursor: "pointer" }}
                  fontSize="medium"
                  color="error"
                  className="committee-delete"
                />
              </Tooltip>
            )}
          {user.UserType.committeeModule &&
            user.UserType.committeeModule.split(",").includes("edit") && (
              <Tooltip title="Edit">
                <EditOutlinedIcon
                  color="success"
                  onClick={() => {
                    setSelectedCommitteeId(params.row.id);
                    setIsEditOpen(true);
                  }}
                  sx={{ cursor: "pointer" }}
                  className="committee-edit"
                />
              </Tooltip>
            )}
          {user.UserType.committeeModule &&
            user.UserType.committeeModule
              .split(",")
              .includes("changeStatus") && (
              <Tooltip title="Change Status">
                <Switch
                  size="small"
                  checked={!!params.row.status}
                  onChange={() =>
                    handleChangeStatus(params.row.id, !!params.row.status)
                  }
                  className="committee-switch"
                />
              </Tooltip>
            )}
          {user.UserType.committeeMemberModule &&
            user.UserType.committeeMemberModule
              .split(",")
              .includes("view") &&<Tooltip title="View all members">
            <Chip
              label={`${params.row.CommitteeMembers?.length}`}
              size="large"
              variant="outlined"
              icon={<PeopleIcon color="var(--linear-gradient-main)" />}
              onClick={() => handleNavigateToMemberList(params.row.id)}
              sx={{
                cursor: "pointer",
                padding: "5px",
                borderColor: `var(--linear-gradient-main)`,
                color: `var(--linear-gradient-main)`,
              }}
              className="committee-view"
              disabled={params.row.CommitteeMembers?.length === 0}
            />
          </Tooltip>}
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
          nameOfTheClass="add-committee"
          statusIcon={
            user.UserType.committeeModule &&
            user.UserType.committeeModule.split(",").includes("add")
          }
        >
          <FormControl
            className="committee-filter"
            style={{ width: "80px" }}
            size="small"
          >
            <InputLabel size="small" id="filter-select-label">
              Show
            </InputLabel>
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
          {user.UserType.committeeTypeModule &&
            user.UserType.committeeTypeModule.split(",").includes("view") && (
              <CustomButton
                onClick={handleNavigateToCommitteeTypeList}
                iconStyles
                fontSize={"medium"}
                background={"var(--linear-gradient-main)"}
                Icon={BackupTableOutlinedIcon}
                // fontSize
                nameOfTheClass="go-to-committee-type"
                title="Committee Type"
              />
            )}
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
                user={user}
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
          <Box sx={{ width: "100%", height: "75vh" }}>
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
                  backgroundColor: `var(--linear-gradient-main)`,
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "16px",
                },
              }}
            />
          </Box>
        )}

        <NewPopUpModal
          modalBody={
            <AddCommitteeForm
              onAddCommittee={handleAddCommittee}
              setRefreshPage={setRefreshPage}
            />
          }
          isOpen={isAddCommittee}
          title={"Add Committee"}
          setIsOpen={setIsAddCommittee}
          // width={600}
        />

        <NewPopUpModal
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
          // width={500}
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
