import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { PopContent } from "../../Style";

const AddCommitteeForm = ({
  onAddCommittee,
  committeeId,
  setRefreshPage,
  setIsEditOpen,
}) => {
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    createdByUserId: user.id, // Prefill creator ID
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch committee data when `committeeId` is available
  useEffect(() => {
    const fetchCommittee = async () => {
      if (committeeId) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `/api/v1/committee/committees/${committeeId}`
          );
          const committee = response.data.data.committee;
          // console.log(response.data.data.committee);

          setFormData({
            name: committee.name,
            description: committee.description,
            createdByUserId: committee.createdByUserId || user.id,
          });
        } catch (err) {
          toast.error("Failed to fetch committee details.");
          console.error("Error fetching committee:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCommittee();
  }, [committeeId, user.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (committeeId) {
        // Update existing committee
        const response = await axios.put(
          `/api/v1/committee/committees/${committeeId}`,
          formData
        );
        toast.success("Committee updated successfully!");
        setIsEditOpen(false);
        // onAddCommittee(response.data.data.committee); // Pass updated committee data
      } else {
        // Create new committee
        const response = await axios.post(
          "/api/v1/committee/committees",
          formData
        );
        toast.success("Committee added successfully!");
        onAddCommittee(response.data.data.committee); // Pass newly added committee data
      }
      // Reset form after submission
      setFormData({ name: "", description: "", createdByUserId: user.id });
      setRefreshPage(Math.random());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save committee.");
      console.error("Error saving committee:", err);
    }
  };

  return (
    <PopContent>
      <>
        <TextField
          label="Committee Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          {committeeId ? "Update Committee" : "Add Committee"}
        </Button>
      </>
    </PopContent>
  );
};

export default AddCommitteeForm;
