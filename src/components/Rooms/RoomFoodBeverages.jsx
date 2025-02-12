import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import CustomButton from "../Common/Buttons/CustomButton";
import PopupModals from "../Common/Modals/Popup/PopupModals";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import DeleteModal from "../Common/Modals/Delete/DeleteModal";
import AddRoomFoodBeverage from "./AddRoomFoodBeverage";
import EditRoomFoodBeverage from "./EditRoomFoodBeverage";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  DeleteOutlineOutlinedIcon,
  EditOutlinedIcon,
  AddOutlinedIcon,
} from "../Common/Buttons/CustomIcon";
import { PopContent } from "../../Style";
import NewPopUpModal from "../Common/Modals/Popup/NewPopUpModal";

const RoomFoodBeverages = ({ room }) => {
  const [rows, setRows] = useState([]);
  const [isFoodBeverageOpen, setIsFoodBeverageOpen] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editInfo, setEditInfo] = useState({});
  const { user } = useSelector((state) => state.user);

  const handleEdit = (id) => {
    setEditId(id);
    setOpenEdit(true);
    setEditInfo(rows.filter((row) => row.uid === id)[0]);
  };

  useEffect(() => {
    const fetchFoodBeverage = async () => {
      try {
        showLoading();
        const response = await axios.get(
          `/api/v1/rooms/food-beverage-all/${room.id}`
        );
        const foodBeverageWithSerial = response.data.data.result.map(
          (foodBeverage, index) => ({
            id: index + 1,
            uid: foodBeverage.id,
            foodBeverageName: foodBeverage.FoodBeverage.foodBeverageName,
            status: foodBeverage.status?"Approved":"Pending",
            foodBeverageId: foodBeverage.FoodBeverage.id,
          })
        );
        setRows(foodBeverageWithSerial);
        hideLoading();
      } catch (error) {
        console.error("Error fetching food beverage:", error);
        hideLoading();
      }
    };

    fetchFoodBeverage();
  }, [refreshPage]);

  const handleRoomFoodBeverage = () => {
    setIsFoodBeverageOpen(true);
    // setIsFoodBeverageOpen(false);
  };

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      showLoading();
      await axios.delete(`/api/v1/rooms/delete-food-beverage/${deleteId}`);

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Food beverage deleted successfully!");
      hideLoading();
    } catch (error) {
      // toast.error("Failed to delete food beverage!");
      console.error("Error deleting food beverage:", error);
      hideLoading();
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "S No.",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 60,
    },
    { field: "foodBeverageName", headerName: "Name", width: 250 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row.uid)}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleOpen(params.row.uid)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PopContent>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          marginBottom: "5px",
          justifyContent: "flex-end",
        }}
      >
        <CustomButton
          title={"Add New Food Beverage"}
          placement={"left"}
          onClick={handleRoomFoodBeverage}
          Icon={AddOutlinedIcon}
          fontSize={"medium"}
          background={'var(--linear-gradient-main)'}
        />
      </Box>
      <Box sx={{ minHeight: 400, width: "100%", height: '75vh' }}>
        <DataGrid rows={rows} columns={columns} pageSize={20} />
      </Box>
      <NewPopUpModal
        isOpen={isFoodBeverageOpen}
        setIsOpen={setIsFoodBeverageOpen}
        title={"Add New Food & Beverage"}
        modalBody={
          <AddRoomFoodBeverage
            room={room}
            setRefreshPage={setRefreshPage}
            setIsFoodBeverageOpen={setIsFoodBeverageOpen}
          />
        }
      />
      <NewPopUpModal
        isOpen={openEdit}
        setIsOpen={setOpenEdit}
        title={"Edit Food & Beverage"}
        modalBody={
          <EditRoomFoodBeverage
            room={room}
            setRefreshPage={setRefreshPage}
            setOpenEdit={setOpenEdit}
            editId={editId}
            editInfo={editInfo}
          />
        }
      />
      <DeleteModal
        open={open}
        onClose={handleClose}
        onDeleteConfirm={handleDelete}
        button={"Delete"}
      />
    </PopContent >
  );
};

export default RoomFoodBeverages;
