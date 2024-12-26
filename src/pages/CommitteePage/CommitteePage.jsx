import React, { useEffect, useState } from "react";
import {
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const CommitteeManagementMUI = () => {
  const [committeeData, setCommitteeData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isAddCommittee, setIsAddCommittee] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);

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
