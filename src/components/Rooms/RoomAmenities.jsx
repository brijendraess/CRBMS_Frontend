import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DeleteOutlineOutlined as DeleteIcon } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton/CustomButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PopupModals from "../Common/Modals/Popup/PopupModals";
import AddRoomAmenities from "./AddRoomAmenities";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DeleteModal from "../Common/Modals/Delete/DeleteModal";
import EditRoomAmenities from "./EditRoomAmenities";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const RoomAmenities = ({ room }) => {
  const [rows, setRows] = useState([]);
  const [isAmenityQuantityOpen, setIsAmenityQuantityOpen] = useState(false);
  const [refreshPage, setRefreshPage] = useState(0);
  const [updatedId, setUpdatedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editInfo, setEditInfo] = useState({});
  const { user } = useSelector((state) => state.user);
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
        toast.success("Something Went Wrong");
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
    { field: "id", headerName: "S No.",disableColumnMenu: true,
      hideSortIcons: true, width: 60 },
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
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
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
          background={"rgba(3, 176, 48, 0.68)"}
        />
      </Box>
      <Box sx={{ minHeight: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={20} />
      </Box>
      <PopupModals
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
      <PopupModals
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
    </>
  );
};

export default RoomAmenities;
