import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { Box, Switch, Tooltip, useMediaQuery, Grid2 } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch, useSelector } from "react-redux";
import { AddOutlinedIcon } from "../../components/Common/Buttons/CustomIcon";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import PendingFoodBeverageCard from "../../components/Responsive/Stock/PendingFoodBeverageCard";

const PendingFoodBeveragePage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [foodBeverage, setFoodBeverage] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width:768px)");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFoodBeverage = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/stock/pending-food-beverage");
        const foodBeverageWithSerial = response.data.data.result.map(
          (foodBeverage, index) => ({
            foodBeverageName: foodBeverage?.FoodBeverage?.foodBeverageName,
            roomName: foodBeverage?.Room?.name,
            status: foodBeverage?.status,
            id: foodBeverage?.id,
            serialNo: index + 1,
          })
        );
        setFoodBeverage(foodBeverageWithSerial);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching foodBeverage:", error);
      }
    };

    fetchFoodBeverage();
  }, [refreshPage]);

  const handleStatusChange = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axios.patch(
        `/api/v1/stock/pending-food-beverage-changeStatus/${id}`
      );
      const updatedFoodBeverage = response.data.data.result;

      setFoodBeverage((prev) =>
        prev.map((foodBeverage) =>
          foodBeverage.id === id
            ? { ...foodBeverage, status: updatedFoodBeverage.status }
            : foodBeverage
        )
      );
      setRefreshPage(Math.random());
      toast.success(
        `FoodBeverage status changed to ${
          updatedFoodBeverage.status ? "Approve" : "Pending"
        }`
      );
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error changing status:", error);
      toast.error("Failed to change foodBeverage status!");
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
      field: "foodBeverageName",
      headerName: "Name",
      flex: 2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomName",
      headerName: "Room",
      flex: 2,
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
              .includes("pendingFoodBeverageStatus") && (
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
        heading="Pending FoodBeverage"
        icon={AddOutlinedIcon}
        func={""}
        nameOfTheClass="add-new-service"
      />
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
          {foodBeverage.map((foodBeverage) => (
            <PendingFoodBeverageCard
              user={user}
              key={foodBeverage.id}
              foodBeverage={foodBeverage}
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
            rows={foodBeverage}
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

export default PendingFoodBeveragePage;
