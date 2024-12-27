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
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import AddCommitteeForm from "./AddCommitteeForm";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PageHeader from "../../components/Common Components/PageHeader/PageHeader";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useNavigate } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PeopleIcon from "@mui/icons-material/People";

const CommitteeManagementMUI = () => {
  const [committeeData, setCommitteeData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isAddCommittee, setIsAddCommittee] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const fetchCommittee = async () => {
    try {
      showLoading();
      const response = await axios.get("/api/v1/committee/committees");
      console.log(response.data.data);
      if (response.data?.data?.committees) {
        setCommitteeData(response.data.data.committees);
      } else {
        console.error("Unexpected data structure:", response.data);
      }
      hideLoading();
    } catch (err) {
      console.error("Error fetching committees:", err);
      hideLoading();
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

  const handleDeleteCommittee = (id) => {
    try {
      showLoading();
      const response = axios.delete(`/api/v1/committee/committees/${id}`, {
        withCredentials: true,
      });
      toast.success("Committee deleted successfully!");
      setRefreshPage((prev) => prev + 1);
      hideLoading();
    } catch (error) {
      console.error("Error deleting committee:", error);
      toast.error("Failed to delete committee. Please try again.");
    }
  };

  const handleAddCommittee = (newCommittee) => {
    setCommitteeData((prev) => [...prev, newCommittee]); // Add new committee to the state
    setIsAddCommittee(false); // Close the modal
  };

  const columns = [
    { field: "name", headerName: "Committee Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Tooltip title="Delete">
            <DeleteOutlineOutlinedIcon
              onClick={() => handleDeleteCommittee(params.row.id)}
              sx={{ cursor: "pointer" }}
              fontSize="medium"
              color="error"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlinedIcon
              color="success"
              onClick={() => handleEditCommittee(params.row.id)}
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

  const handleStatusChange = async (committeeId, newStatus) => {
    try {
      await axios.put(`/api/v1/committee/${committeeId}/status`, {
        status: newStatus,
      });
      fetchCommittee(); // Refresh the committee list
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleNavigateToMemberList = () => {
    navigate(`/view-committee/${committee.id}`, {
      state: { committee, heading },
    });
  };

  return (
    <>
      <PaperWrapper>
        <PageHeader
          heading={"Committee"}
          icon={AddOutlinedIcon}
          func={setIsAddCommittee}
          title={"Add New Committee"}
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
            columnSpacing={3}
            rowSpacing={3}
            sx={{
              borderRadius: "20px",
              position: "relative",
              top: "10px",
              alignItems: "center",
              justifyContent: {
                xs: "center",
                sm: "center",
                md: "start",
              },
            }}
          >
            {filteredCommittees.map((committee) => (
              <CommitteeCard
                key={committee.id}
                committee={committee}
                heading={committee.name}
                onDelete={handleDeleteCommittee}
                setRefreshPage={setRefreshPage}
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
            />
          </Box>
        )}
      </PaperWrapper>
      <PopupModals
        modalBody={
          <AddCommitteeForm
            onAddCommittee={handleAddCommittee}
            setRefreshPage={setRefreshPage}
          />
        }
        isOpen={isAddCommittee}
        title={`Add Committee`}
        setIsOpen={setIsAddCommittee}
        width={500}
      />
    </>
  );
};

export default CommitteeManagementMUI;
