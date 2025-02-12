import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Grid2, Tooltip, useMediaQuery } from "@mui/material";
import AddMembersToCommittee from "./AddMembersToCommittee";
import unknownUser from "../../assets/Images/unknownUser.png";
import { PaperWrapper } from "../../Style";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import CustomButton from "../../components/Common/Buttons/CustomButton";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch, useSelector } from "react-redux";
import CommitteeMemberCard from "../../components/CommitteeCard/CommitteeMemberCard";
import {
  DeleteOutlineIcon,
  PersonAddOutlinedIcon,
  KeyboardBackspaceOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";

const CommitteeMemberList = () => {
  const [data, setData] = useState([]);
  const { committeeId } = useParams();
  const location = useLocation();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [heading, setHeading] = useState();
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };

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

        console.log(members);
        setHeading(response.data?.data?.members[0]?.Committee?.name);
        // console.log(response.data?.data?.members[0]?.Committee?.name);
        setData(formattedData);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        // toast.error("Failed to fetch members. Please try again.");
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
        // toast.error("User is not a member of this committee");
      } else {
        // toast.error("Failed to remove user from committee");
      }
      console.error("Error removing user from committee:", error);
    }
  };

  const columns = [
    {
      field: "avatarPath",
      headerName: "Avatar",
      disableColumnMenu: true,
      hideSortIcons: true,
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
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 200,
      renderCell: (params) =>
        user.UserType.committeeMemberModule &&
        user.UserType.committeeMemberModule.split(",").includes("delete") ? (
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
        statusIcon={
          user.UserType.committeeMemberModule &&
          user.UserType.committeeMemberModule.split(",").includes("add")
        }
      >
        <CustomButton
          onClick={handleBackButton}
          iconStyles
          fontSize={"medium"}
          background={"var(--linear-gradient-main)"}
          Icon={KeyboardBackspaceOutlinedIcon}
          nameOfTheClass="go-to-committee-type"
          title="Back To Committee"
        />
      </PageHeader>
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
            <CommitteeMemberCard key={member.id} member={member} />
          ))}
        </Grid2>
      ) : (
        <Box sx={{ width: "100%", height: "75vh" }}>
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
                backgroundColor: `var(--linear-gradient-main)`,
                color: "#fff",
                fontWeight: "600",
                fontSize: "16px",
              },
            }}
          />
        </Box>
      )}
      <NewPopUpModal
        modalBody={<AddMembersToCommittee members={data} id={committeeId} />}
        isOpen={isAddMemberOpen}
        title={`Add Members To ${heading}`}
        setIsOpen={setIsAddMemberOpen}
        width={500}
      />
    </PaperWrapper>
  );
};

export default CommitteeMemberList;
