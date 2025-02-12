import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import {
  Box,
  Switch,
  Tooltip,
  useMediaQuery,
  Grid2,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch, useSelector } from "react-redux";
import {
  AddOutlinedIcon,
  KeyboardBackspaceOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import PendingAmenitiesCard from "../../components/Responsive/Stock/PendingAmenitiesCard";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/Common/Buttons/CustomButton";

const PendingAmenitiesPage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width:768px)");
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleBackButton = () => {
    navigate(-1)
  }
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/stock/pending-amenities");
        const amenitiesWithSerial = response.data.data.result.map(
          (amenities, index) => ({
            amenityName: amenities?.RoomAmenity?.name,
            status: amenities.status,
            roomName: amenities.Room.name,
            id: amenities.id,
            serialNo: index + 1,
          })
        );
        setAmenities(amenitiesWithSerial);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching amenities:", error);
      }
    };

    fetchAmenities();
  }, [refreshPage]);

  const handleStatusChange = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axios.patch(`/api/v1/stock/pending-amenities-changeStatus/${id}`);
      const updatedAmenities = response.data.data.result;

      setAmenities((prev) =>
        prev.map((amenities) =>
          amenities.id === id ? { ...amenities, status: updatedAmenities.status } : amenities
        )
      );
      setRefreshPage(Math.random())
      toast.success(
        `Amenities status changed to ${updatedAmenities.status ? "Approve" : "Pending"
        }`
      );
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing status:", error);
      toast.error("Failed to change amenities status!");
    }
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "#",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "amenityName",
      headerName: "Name",
      flex: 4,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomName",
      headerName: "Room",
      flex: 4,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 1,

      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          {user.UserType.inventoryModule &&
            user.UserType.inventoryModule
              .split(",")
              .includes("pendingAmenityStatus") && (
              <Tooltip title="Change Status">
                <Switch
                  checked={params.row.status}
                  onChange={() => handleStatusChange(params.row.id)}
                />
              </Tooltip>
            )}
        </Box>
      ),
      headerClassName: "super-app-theme--header",
    },
  ];

  return (
    <PaperWrapper>
      <PageHeader
        heading="Pending Amenities"
        icon={''}
        func={''}
        nameOfTheClass="add-new-service"
      >
        <CustomButton
          onClick={handleBackButton}
          iconStyles
          fontSize={"medium"}
          background={"var(--linear-gradient-main)"}
          Icon={KeyboardBackspaceOutlinedIcon}
          nameOfTheClass="go-to-inventory"
          title="Back To Inventory"
        />
      </PageHeader>
      {isSmallScreen && (
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
          {amenities.map((amenities) => (
            <PendingAmenitiesCard
              user={user}
              key={amenities.id}
              amenities={amenities}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </Grid2>
      )}
      {!isSmallScreen && (
        <div
          style={{ display: "flex", flexDirection: "column", height: "75vh" }}
        >
          <DataGrid
            rows={amenities}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            rowHeight={40}
            sx={{
              "& .super-app-theme--header": {
                backgroundColor: `var(--linear-gradient-main)`,
                color: "#fff",
                fontWeight: "600",
                fontSize: "16px",
              },
            }}
          />
        </div>
      )}
    </PaperWrapper>
  );
};

export default PendingAmenitiesPage;
