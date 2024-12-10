import React, { useEffect, useState } from "react";
import {
  Paper,
  styled,
  Typography,
  CircularProgress,
  Box,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import CommitteeCard from "../../components/CommitteeCard/CommitteeCard";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ContentHeader, RightContent } from "../../Style";

const CardWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  width: "100%",
  height: "100%",
  lineHeight: "60px",
  boxShadow: theme.shadows[1],
  transition: "box-shadow 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    boxShadow: theme.shadows[15],
  },
}));

const MyCommitteePage = () => {
  const [committeeData, setCommitteeData] = useState([]);
  const [filter, setFilter] = useState("all"); // Default to showing all committees
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMyCommittee = async () => {
      try {
        const response = await axios.get("/api/v1/committee/my-committee", {
          withCredentials: true,
        });
        console.log(response.data.data.committees);
        setCommitteeData(response.data.data.committees || []);
        toast.success("Data Fetched Successfully");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        toast.error(err);
      }
    };

    fetchMyCommittee();
  }, []);

  const filteredCommittees = committeeData.filter((committee) => {
    if (filter === "active") return committee.status === "active"; // Show only active committees
    if (filter === "inactive") return committee.status === "inactive"; // Show only inactive committees
    return true; // Show all committees if "All" is selected
  });
  return (
    <RightContent>
      <ContentHeader elevation={20}>
        <Typography variant="h4" component="h2">
          {user?.isAdmin ? "Committee Management" : "My Committee"}
        </Typography>
        <FormControl style={{ width: "150px" }}>
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
      </ContentHeader>

      {
        <Grid2
          container
          spacing={2}
          sx={{
            borderRadius: "20px",
            position: "relative",
            top: "10px",
          }}
        >
          {filteredCommittees.length > 0 ? (
            filteredCommittees.map((committee) => (
              <CardWrapper elevation={12} key={committee.id}>
                <CommitteeCard committee={committee} />
              </CardWrapper>
            ))
          ) : (
            <Grid2 item xs={12}>
              <Box display="flex" justifyContent="center" width="100%" p={3}>
                <Typography variant="h6" color="textSecondary">
                  No committees found.
                </Typography>
              </Box>
            </Grid2>
          )}
        </Grid2>
      }
    </RightContent>
  );
};

export default MyCommitteePage;
