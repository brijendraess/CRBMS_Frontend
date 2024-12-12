import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DeleteOutlineOutlined as DeleteIcon } from "@mui/icons-material";
import CustomButton from "../Common Components/CustomButton/CustomButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PopupModals from "../Common Components/Modals/Popup/PopupModals";
import AddRoomAmenities from "./AddRoomAmenities";

const initialRows = [
  { id: 1, name: "John Doe", quantity: 25 },
  { id: 2, name: "Jane Smith", quantity: 30 },
  { id: 3, name: "Alex Johnson", quantity: 35 },
];

const RoomAmenities = ({room,setIsAmenitiesOpen}) => {
  const [rows, setRows] = useState(initialRows);
  const [isAmenityQuantityOpen, setIsAmenityQuantityOpen] = useState(false);
  const handleEdit = (id) => {
    alert(`Edit row with ID: ${id}`);
    // Add your edit logic here
  };

  const handleRoomAmenities = () => {
    setIsAmenityQuantityOpen(true);
    setIsAmenitiesOpen(false);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this row?");
    if (confirm) {
      setRows(rows.filter((row) => row.id !== id)); // Remove the row
    }
  };

  const columns = [
    { field: "id", headerName: "S No.", width: 60 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "age", headerName: "Quantity", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditOutlinedIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{width:"100%",display:"flex", marginBottom:"5px", justifyContent:"flex-end"}}>
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
        modalBody={<AddRoomAmenities room={room} />}
      />
    </>
  );
};

export default RoomAmenities;
