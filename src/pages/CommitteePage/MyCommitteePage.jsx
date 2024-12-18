import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
} from "@mui/material";
import axios from "axios";
import CommitteeCard from "../../components/CommitteeCard/CommitteeCard";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { PaperWrapper } from "../../Style";

const MyCommitteePage = () => {
  const [committeeData, setCommitteeData] = useState([]);
  const [filter, setFilter] = useState("all");
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMyCommittee = async () => {
      try {
        const response = await axios.get("/api/v1/committee/my-committee", {
          withCredentials: true,
        });
        setCommitteeData(response.data.data.committees || []);
        console.log(response.data.data.committees);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch data");
      }
    };

    fetchMyCommittee();
  }, []);

  const filteredCommittees = committeeData?.filter((committee) => {
    if (filter === "active") return committee.status.toLowerCase() === "active";
    if (filter === "inactive")
      return committee.status.toLowerCase() === "inactive";
    return true;
  });

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
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#2E2E2E",
          }}
        >
          Committee
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <FormControl style={{ marginRight: "5px", width: "100px" }}>
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
        }}
      >
        {filteredCommittees.map((committee) => (
          <CommitteeCard key={committee.id} committee={committee} />
        ))}
      </Grid2>
    </PaperWrapper>
  );
};

export default MyCommitteePage;
