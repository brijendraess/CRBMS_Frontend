import { Autocomplete, Box, Button, Checkbox, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddMembersToCommittee = ({ id, members }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showDeleted, setShowDeleted] = useState(true);

  const filteredUsers = users
    .filter((user) => showDeleted || !user.deletedAt)
    .filter((user) => !members.some((member) => member.userid === user.id));

  console.log("filter", filteredUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/api/v1/user/users`);
        console.log(response.data.data.users.rows);

        if (response.data.success) {
          setUsers(response.data.data.users.rows);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    toast.success("Check Console");
    console.log(selectedUserIds);
  };

  return (
    <div className="pop-content w-100">
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
    </div>
  );
};

export default AddMembersToCommittee;
