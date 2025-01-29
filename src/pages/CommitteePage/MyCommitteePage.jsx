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
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { PaperWrapper } from "../../Style";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import MyComitteeCard from "../../components/CommitteeCard/MyComitteeCard";

const MyCommitteePage = () => {
  const [committeeData, setCommitteeData] = useState([]);
  const [filter, setFilter] = useState("all");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyCommittee = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/committee/my-committee", {
          withCredentials: true,
        });
        setCommitteeData(response.data.data.committees);
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        console.error(err.response?.data?.message || "Failed to fetch data");
      }
    };

    fetchMyCommittee();
  }, []);

  const filteredCommittees = committeeData?.filter((committee) => {
    if (filter === "active") return committee.status === true;
    if (filter === "inactive") return committee.status === false;
    return true;
  });

  return (
    <PaperWrapper>
      <PageHeader heading={"My Committees"}>
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
          <MyComitteeCard
            key={committee.id}
            committee={committee}
            heading={committee.committeeName}
          />
        ))}
      </Grid2>
    </PaperWrapper>
  );
};

export default MyCommitteePage;
