import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  styled,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import AddMembersToCommittee from "./AddMembersToCommittee";
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
  const [data, setData] = useState([]);
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
        const members = response.data?.data?.members || [];

        const formattedData = members.map((member) => ({
          id: member.id,
          avatarPath: member.User?.avatarPath,
          fullname: member.User?.fullname,
          email: member.User?.email,
          phoneNumber: member.User?.phoneNumber,
          committeeId: member.committeeId,
        }));

        setData(formattedData);
      } catch (error) {
        toast.error("Failed to fetch members. Please try again.");
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [committeeId]);

  const removeUserFromCommittee = async (userId) => {
    try {
      const response = await axios.delete(
        `/api/v1/committee/committees/${committeeId}/members/${userId}`
      );
      if (response.status === 200) {
        toast.success("User removed from committee successfully");
        setData((prevData) => prevData.filter((user) => user.id !== userId));
      }
    } catch (error) {
      if (error.response?.status === 404) {
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
              ? `${import.meta.env.VITE_API_URL}/${params?.value}`
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
        <Tooltip title="Remove User">
          <Switch
            checked={params.row.id}
            onChange={() => removeUserFromCommittee(params.row.id)}
          />
        </Tooltip>
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
            {committee?.name
              ? `${committee.name} Members`
              : "Committee Members"}
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
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          rowHeight={40}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </DataGridWrapper>
      <PopupModals
        modalBody={<AddMembersToCommittee members={data} id={committeeId} />}
        isOpen={isAddMemberOpen}
        title={`Add New Members`}
        setIsOpen={setIsAddMemberOpen}
        width={500}
      />
    </>
  );
};

export default CommitteeMemberList;
