import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { Grid2, Tooltip, useMediaQuery } from "@mui/material";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import AddMembersToCommittee from "./AddMembersToCommittee";
import unknownUser from "../../assets/Images/unknownUser.png";
import { PaperWrapper } from "../../Style";
import PageHeader from "../../components/Common Components/PageHeader/PageHeader";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch, useSelector } from "react-redux";
import CommitteeMemberCard from "../../components/CommitteeCard/CommitteeMemberCard";

const CommitteeMemberList = () => {
  const [data, setData] = useState([]);
  const { committeeId } = useParams();
  const location = useLocation();
  const { committee, heading } = location.state || {};
  console.log(location);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        dispatch(showLoading());
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
          committeeName: member.Committee?.name,
        }));

        setData(formattedData);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to fetch members. Please try again.");
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [committeeId]);

  const removeUserFromCommittee = async (userId) => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `/api/v1/committee/committees/${committeeId}/members/${userId}`
      );
      if (response.status === 200) {
        toast.success("User removed from committee successfully");
        setData((prevData) => prevData.filter((user) => user.id !== userId));
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
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
      width: 150,
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
      headerClassName: "super-app-theme--header",
    },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Actions",
      headerName: "Action",
      width: 200,
      renderCell: (params) =>
        user?.isAdmin ? (
          <Tooltip title="Remove User">
            <DeleteOutlineIcon
              color="error"
              onClick={() => removeUserFromCommittee(params.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        ) : null,
      headerClassName: "super-app-theme--header",
    },
  ];

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <PaperWrapper>
      <PageHeader
        heading={heading}
        icon={PersonAddOutlinedIcon}
        func={setIsAddMemberOpen}
        title={"Add User to Committee"}
      />
      {isSmallScreen ? (
        <Grid2
          container
          spacing={2}
          sx={{
            borderRadius: "20px",
            position: "relative",
            top: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.map((member) => (
            <CommitteeMemberCard key={member.id} member={member}>
              <CustomButton
                title={"Add User To Committee"}
                Icon={DeleteOutlineIcon}
                fontSize="small"
                background="red"
                placement={"right"}
              />
            </CommitteeMemberCard>
          ))}
        </Grid2>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            rowHeight={40}
            disableSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
              "& .super-app-theme--header": {
                backgroundColor: "#006400",
                // backgroundColor: "rgba(255, 223, 0, 1)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "16px",
              },
            }}
          />
        </div>
      )}
      <PopupModals
        modalBody={<AddMembersToCommittee members={data} id={committeeId} />}
        isOpen={isAddMemberOpen}
        title={`Add New Members`}
        setIsOpen={setIsAddMemberOpen}
        width={500}
      />
    </PaperWrapper>
  );
};

export default CommitteeMemberList;
