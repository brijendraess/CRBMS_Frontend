import { Autocomplete, Box, Button, Checkbox, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch } from "react-redux";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const AddMembersToCommittee = ({ id, members }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showDeleted, setShowDeleted] = useState(true);
  const dispatch = useDispatch();
  const filteredUsers = users.filter((user) => !user.deletedAt);

  console.log(filteredUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(`/api/v1/user/active/users`);
        if (response.data.success) {
          setUsers(response.data.data.users.rows);
        }
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching users:", error);
        // toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(showLoading());
      if (selectedUserIds.length === 0) {
        // toast.error("Please select at least one user to add.");
        return;
      }

      const payload = {
        committeeId: id,
        userIds: selectedUserIds,
      };

      const response = await axios.post(
        `/api/v1/committee/committees/${id}/members`,
        payload
      );

      if (response.data.success) {
        toast.success("Members added to the committee successfully!");
      } else {
        // toast.error("Failed to add members to the committee.");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error adding members:", error);
      // toast.error("Failed to add members. Please try again.");
    }
  };

  return (
    <PopContent>
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
          size="small"
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
            <TextField {...params} label="Select Users" placeholder="Users" size="small" margin="normal" />
          )}
        />

        {/* Submit button */}
        <FormButton type='submit' btnName='Add Members' />
      </Box>
    </PopContent>
  );
};

export default AddMembersToCommittee;
