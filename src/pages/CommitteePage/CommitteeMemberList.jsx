import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { Box, Button, Paper, styled, Typography } from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import AddMembersToCommittee from "./AddMembersToCommittee";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import unknownUser from "../../assets/Images/unknownUser.png";

const DataGridWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  width: "100%",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "20px",
}));

const CommitteeMemberList = () => {
  const [members, setMembers] = useState([]);
  const { committeeId } = useParams();
  const location = useLocation();
  const { committee } = location.state || {};
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `/api/v1/committee/committees/${committeeId}/members`
        );
        setMembers(response.data.data.members);
        console.log(response.data.data.members);
        toast.success("Members loaded successfully!");
      } catch (error) {
        toast.error("Failed to fetch committee members!");
        console.error("Error:", error);
      }
    };

    fetchMembers();
  }, [committeeId]);

  const removeUserFromCommittee = async (id) => {
    try {
      const response = await axios.delete(
        `/api/v1/committee/committees/${committeeId}/members/${id}`
      );
      if (response.status === 200) {
        toast.success("User removed from committee successfully");
        setMembers((prevUsers) =>
          prevUsers.filter((user) => user.committeeId !== committeeId)
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("User is not a member of this committee");
      } else {
        toast.error("Failed to remove user from committee");
      }
      console.error("Error removing user from committee:", error);
    }
  };

  const columns = [
    {
      field: "avatarPath",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => (
        <img
          src={
            params?.value
              ? `http://localhost:9000/${params?.value}`
              : unknownUser
          }
          alt="avatar"
          style={{ width: "35px", height: "35px", borderRadius: "50%" }}
        />
      ),
    },
    {
      field: "fullname",
      headerName: "Full Name",
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.7,
    },
    {
      field: "Actions",
      headerName: "Action",
      flex: 0.3,
      renderCell: (params) => (
        <>
          <RemoveCircleOutlinedIcon
            onClick={() => removeUserFromCommittee(params.row.memberid)}
            sx={{ cursor: "pointer", color: "error.light" }}
            fontSize="medium"
          />
        </>
      ),
    },
  ];

  return (
    <>
      <DataGridWrapper>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h5" component="h5" sx={{ marginRight: "20px" }}>
            {committee.name + " Members" || "Committee Members"}
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => setIsAddMemberOpen(true)}
          >
            <PersonAddAltOutlinedIcon />
          </Button>
        </Box>
        <DataGrid
          rows={members}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          rowHeight={40}
          disableSelectionOnClick
          getRowId={(row) => row.memberid}
        />
      </DataGridWrapper>
      <PopupModals
        modalBody={<AddMembersToCommittee members={members} id={committeeId} />}
        isOpen={isAddMemberOpen}
        // title={`Add Members to ${committee.name || "Committee"}`}
        title={`Add New Members`}
        setIsOpen={setIsAddMemberOpen}
        width={500}
      />
    </>
  );
};

export default CommitteeMemberList;
