import { Autocomplete, Box, Button, Checkbox, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const AddMembersToCommittee = ({ id, members }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showDeleted, setShowDeleted] = useState(true);

  const filteredUsers = users.filter((user) => !user.deletedAt);

  console.log(filteredUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        showLoading();
        const response = await axios.get(`/api/v1/user/users`);
        if (response.data.success) {
          setUsers(response.data.data.users.rows);
        }
        hideLoading();
      } catch (error) {
        hideLoading();
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      showLoading();
      if (selectedUserIds.length === 0) {
        toast.error("Please select at least one user to add.");
        return;
      }

      // Construct the payload
      const payload = {
        committeeId: id, // `id` is passed as a prop for the committee ID
        userIds: selectedUserIds, // Array of selected user IDs
      };

      const response = await axios.post(
        `/api/v1/committee/committees/${id}/members`,
        payload
      );

      if (response.data.success) {
        toast.success("Members added to the committee successfully!");
      } else {
        toast.error("Failed to add members to the committee.");
      }
      hideLoading();
      console.log("Response:", response.data.data);
    } catch (error) {
      hideLoading();
      console.error("Error adding members:", error);
      toast.error("Failed to add members. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        margin: "auto",
        borderRadius: 3,
        maxHeight: 600,
      }}
    >
      <Autocomplete
        multiple
        options={filteredUsers}
        getOptionLabel={(user) => user.fullname}
        disableCloseOnSelect
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, value) => {
          setSelectedUserIds(value.map((user) => user.id));
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox checked={selected} sx={{ marginRight: 1 }} />
            {option.fullname}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Select Users" placeholder="Users" />
        )}
      />

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Add Members
      </Button>
    </Box>
  );
};

export default AddMembersToCommittee;
