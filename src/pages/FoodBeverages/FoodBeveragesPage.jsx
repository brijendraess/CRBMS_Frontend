import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import {
  Box,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
  Grid2,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import FoodBeverageAdd from "./FoodBeveragesAdd";
import axios from "axios";
import toast from "react-hot-toast";
import FoodBeverageEdit from "./FoodBeveragesEdit";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import DeleteModal from "../../components/Common/Modals/Delete/DeleteModal";
import FoodBeverageCard from "../../components/Responsive/FoodBeverageCard/FoodBeverageCard";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  AddOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineOutlinedIcon,
} from "../../components/Common/CustomButton/CustomIcon";
import PageHeader from "../../components/Common/PageHeader/PageHeader";

const FoodBeveragePage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [foodBeverage, setFoodBeverage] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchFoodBeverages = async () => {
      try {
        showLoading();
        const response = await axios.get(
          "/api/v1/food-beverages/food-beverage"
        );
        const foodBeverageWithSerial = response.data.data.foodBeverages.map(
          (foodBeverage, index) => ({
            ...foodBeverage,
            serialNo: index + 1,
          })
        );
        setFoodBeverage(foodBeverageWithSerial);
        hideLoading();
      } catch (error) {
        hideLoading();
        toast.error("Something Went Wrong");
        console.error("Error fetching foodBeverages:", error);
      }
    };

    fetchFoodBeverages();
  }, [refreshPage]);

  const handleEdit = (id) => {
    setUpdatedId(id);
    setIsEditOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      showLoading();
      await axios.delete(
        `/api/v1/food-beverages/food-beverage/delete/${deleteId}`
      );

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Food beverage deleted successfully!");
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error("Failed to delete foodBeverage!");
      console.error("Error deleting foodBeverage:", error);
    }
  };

  const handleUpdateSuccess = (updatedFoodBeverage) => {
    setFoodBeverage((prev) =>
      prev.map((loc) =>
        loc.id === updatedFoodBeverage.id ? updatedFoodBeverage : loc
      )
    );
    setIsEditOpen(false);
  };

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleStatusChange = async (id) => {
    try {
      showLoading();
      const response = await axios.patch(
        `/api/v1/food-beverages/food-beverage/${id}/status`
      );
      const updatedFoodBeverage = response.data.data.foodBeverage;

      setFoodBeverage((prev) =>
        prev.map((loc) =>
          loc.id === id ? { ...loc, status: updatedFoodBeverage.status } : loc
        )
      );

      toast.success(
        `Food beverage status changed to ${updatedFoodBeverage.status ? "Active" : "Inactive"}`
      );
      hideLoading();
    } catch (error) {
      hideLoading();
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
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "foodBeverageName",
      headerName: "Name",
      flex: 3,
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
          <Tooltip title="Edit">
            <EditOutlinedIcon
              color="success"
              onClick={() => handleEdit(params.row.id)}
              style={{ cursor: "pointer" }}
              className="food-edit"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlineOutlinedIcon
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => handleOpen(params.row.id)}
              className="food-delete"
            />
          </Tooltip>
          <Tooltip title="Change Status">
            <Switch
              checked={params.row.status}
              onChange={() => handleStatusChange(params.row.id)}
              className="food-switch"
            />
          </Tooltip>
        </Box>
      ),
      headerClassName: "super-app-theme--header",
    },
  ];

  return (
    <PaperWrapper>
      <PageHeader
        heading={"Food & Beverages"}
        icon={AddOutlinedIcon}
        func={setIsAddOpen}
        nameOfTheClass="add-food"
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
          {foodBeverage.map((food) => (
            <FoodBeverageCard
              key={food.id}
              food={food}
              handleEdit={handleEdit}
              handleDelete={handleOpen}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </Grid2>
      )}
      {!isSmallScreen && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={foodBeverage}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            rowHeight={40}
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
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={"Add Food beverage"}
        modalBody={
          <FoodBeverageAdd
            setRefreshPage={setRefreshPage}
            setIsAddOpen={setIsAddOpen}
          />
        }
      />
      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Edit Food beverage"}
        modalBody={
          <FoodBeverageEdit
            id={updatedId}
            setRefreshPage={setRefreshPage}
            setIsEditOpen={setIsEditOpen}
            foodBeverageName={
              foodBeverage.find((loc) => loc.id === updatedId)
                ?.foodBeverageName || ""
            }
            onSuccess={handleUpdateSuccess}
          />
        }
      />
      <DeleteModal
        open={open}
        onClose={handleClose}
        onDeleteConfirm={handleDelete}
        button={"Delete"}
      />
    </PaperWrapper>
  );
};

export default FoodBeveragePage;
