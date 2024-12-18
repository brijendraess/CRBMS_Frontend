import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Switch, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PopupModals from "../../components/Common Components/Modals/Popup/PopupModals";
import FoodBeverageAdd from "./FoodBeveragesAdd";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DeleteOutlineOutlined as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import FoodBeverageEdit from "./FoodBeveragesEdit";
import CustomButton from "../../components/Common Components/CustomButton/CustomButton";
import DeleteModal from "../../components/Common Components/Modals/Delete/DeleteModal";

const FoodBeveragePage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [foodBeverage, setFoodBeverage] = useState([]);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);

  useEffect(() => {
    const fetchFoodBeverages = async () => {
      try {
        const response = await axios.get("/api/v1/food-beverages/food-beverage");
        const foodBeverageWithSerial = response.data.data.foodBeverages.map(
          (foodBeverage, index) => ({
            ...foodBeverage,
            serialNo: index + 1,
          })
        );
        setFoodBeverage(foodBeverageWithSerial);
      } catch (error) {
        toast.success("Something Went Wrong");
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
      await axios.delete(`/api/v1/food-beverages/food-beverage/delete/${deleteId}`);

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Food beverage deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete foodBeverage!");
      console.error("Error deleting foodBeverage:", error);
    }
  };

  const handleUpdateSuccess = (updatedFoodBeverage) => {
    setFoodBeverage((prev) =>
      prev.map((loc) => (loc.id === updatedFoodBeverage.id ? updatedFoodBeverage : loc))
    );
    setIsEditOpen(false);
  };

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleStatusChange = async (id) => {
    try {
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
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to change foodBeverage status!");
    }
  };

  const columns = [
    { field: "serialNo", headerName: "#", width: 150 },
    {
      field: "foodBeverageName",
      headerName: "Name",
      width: 900,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,

      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Edit">
            <EditOutlinedIcon
              className="cursor"
              color="success"
              onClick={() => handleEdit(params.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => handleOpen(params.row.id)}
            />
          </Tooltip>
          <Tooltip title="Change Status">
            <Switch
              checked={params.row.status}
              onChange={() => handleStatusChange(params.row.id)}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <PaperWrapper>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            marginRight: "20px",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#2E2E2E",
          }}
        >
          Food beverage
        </Typography>
        <CustomButton
          onClick={() => setIsAddOpen(true)}
          title={"Add New Room"}
          placement={"left"}
          Icon={AddOutlinedIcon}
          fontSize={"medium"}
          background={"rgba(3, 176, 48, 0.68)"}
        />
      </Box>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataGrid
          rows={foodBeverage}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          rowHeight={40}
        />
      </div>
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
              foodBeverage.find((loc) => loc.id === updatedId)?.foodBeverageName || ""
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
