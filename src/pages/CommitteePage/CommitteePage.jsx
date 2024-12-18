import React, { useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  Paper,
  styled,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";
import CommitteeCard from "../../components/CommitteeCard/CommitteeCard";
import { PaperWrapper } from "../../Style";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import AddCommitteeForm from "./AddCommitteeForm";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const CommitteeManagementMUI = () => {
  const [committeeData, setCommitteeData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isAddCommittee, setIsAddCommittee] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);

  const fetchCommittee = async () => {
    try {
      const response = await axios.get("/api/v1/committee/committees");
      if (response.data?.data?.committees) {
        setCommitteeData(response.data.data.committees);
      } else {
        console.error("Unexpected data structure:", response.data);
        setError("Invalid data structure received from server");
      }
    } catch (err) {
      console.error("Error fetching committees:", err);
      setError(err.message || "Failed to fetch committees");
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, [refreshPage]);

  const filteredCommittees = committeeData.filter((committee) => {
    if (filter === "active") return committee.status === "active";
    if (filter === "inactive") return committee.status === "inactive";
    return true;
  });

  const handleDeleteCommittee = (id) => {
    setCommitteeData((prev) => prev.filter((committee) => committee.id !== id));
  };

  const handleAddCommittee = (newCommittee) => {
    setCommitteeData((prev) => [...prev, newCommittee]); // Add new committee to the state
    setIsAddCommittee(false); // Close the modal
  };

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
              fontSize: {
                xs: "16px",
                sm: "18px",
                md: "20px",
                lg: "22px",
                xl: "24px",
              },
              fontWeight: 500,
              lineHeight: 1.5,
              color: "#2E2E2E",
            }}
          >
            Committee
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <FormControl style={{ marginRight: "5 px", width: "100px" }}>
              <InputLabel id="filter-select-label">Show</InputLabel>
              <Select
                labelId="filter-select-label"
                id="filter-select"
                value={filter} // Controlled filter state
                label="Show"
                onChange={(e) => setFilter(e.target.value)} // Update filter state
                size="small"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <CustomButton
              onClick={() => setIsAddCommittee(true)}
              title={"Add New Committee"}
              placement={"bottom"}
              Icon={AddOutlinedIcon}
              fontSize={"medium"}
              background={"rgba(3, 176, 48, 0.68)"}
            />
          </Box>
        </Box>
        <Grid2
          container
          columnSpacing={3}
          rowSpacing={3}
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
