import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import CustomButton from "../Common/Buttons/CustomButton";
import PopupModals from "../Common/Modals/Popup/PopupModals";
import AddRoomAmenities from "./AddRoomAmenities";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DeleteModal from "../Common/Modals/Delete/DeleteModal";
import EditRoomAmenities from "./EditRoomAmenities";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  DeleteOutlineOutlinedIcon,
  EditOutlinedIcon,
  AddOutlinedIcon,
} from "../Common/Buttons/CustomIcon";
import { PopContent } from "../../Style";
import NewPopUpModal from "../Common/Modals/Popup/NewPopUpModal";

const RoomAmenities = ({ room }) => {
  const [rows, setRows] = useState([]);
  const [isAmenityQuantityOpen, setIsAmenityQuantityOpen] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editInfo, setEditInfo] = useState({});
  const dispatch = useDispatch();

  const handleEdit = (id) => {
    setEditId(id);
    setOpenEdit(true);
    setEditInfo(rows.filter((row) => row.uid === id)[0]);
  };

  useEffect(() => {
    const fetchAmenityQuantity = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(
          `/api/v1/rooms/amenity-quantity-all/${room.id}`
        );
        const amenityWithSerial = response.data.data.result.map(
          (amenity, index) => ({
            id: index + 1,
            uid: amenity.id,
            name: amenity.RoomAmenity.name,
            amenityId: amenity.RoomAmenity.id,
            quantity: Number(amenity.quantity),
          })
        );
        setRows(amenityWithSerial);
        dispatch(hideLoading());
      } catch (error) {
        console.error("Error fetching locations:", error);
        dispatch(hideLoading());
      }
    };

    fetchAmenityQuantity();
  }, [refreshPage]);

  const handleRoomAmenities = () => {
    setIsAmenityQuantityOpen(true);
    // setIsAmenitiesOpen(false);
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
      dispatch(showLoading());
      await axios.delete(`/api/v1/rooms/delete-amenity-quantity/${deleteId}`);

      handleClose(false);
      setRefreshPage(Math.random());
      toast.success("Amenity quantity deleted successfully!");
      dispatch(hideLoading());
    } catch (error) {
      toast.error("Failed to delete amenity quantity!");
      console.error("Error deleting amenity quantity:", error);
      dispatch(hideLoading());
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
    { field: "name", headerName: "Name", width: 100 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 150,
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
          title={"Add New Amenity Quantity"}
          placement={"left"}
          onClick={handleRoomAmenities}
          Icon={AddOutlinedIcon}
          fontSize={"medium"}
          background={'var(--linear-gradient-main)'}
        />
      </Box>
      <Box sx={{ minHeight: 400, width: "100%", height: '75vh', }}>
        <DataGrid rows={rows} columns={columns} pageSize={20} />
      </Box>
      <NewPopUpModal
        isOpen={isAmenityQuantityOpen}
        setIsOpen={setIsAmenityQuantityOpen}
        title={"Add New Room Amenity"}
        modalBody={
          <AddRoomAmenities
            room={room}
            setRefreshPage={setRefreshPage}
            setIsAmenityQuantityOpen={setIsAmenityQuantityOpen}
          />
        }
      />
      <NewPopUpModal
        isOpen={openEdit}
        setIsOpen={setOpenEdit}
        title={"Edit Room Amenity"}
        modalBody={
          <EditRoomAmenities
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
    </PopContent>
  );
};

export default RoomAmenities;
