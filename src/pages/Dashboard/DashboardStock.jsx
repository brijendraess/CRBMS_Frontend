import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { DataGrid } from "@mui/x-data-grid";
import { Grid2 as Grid, IconButton, Typography, Box } from "@mui/material";
import {
  AddIcon,
  AddOutlinedIcon,
  RemoveIcon,
} from "../../components/Common/Buttons/CustomIcon";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import CustomButton from "../../components/Common/Buttons/CustomButton";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import toast from "react-hot-toast";

// Custom styles
const useStyles = makeStyles({
  lowQuantity: {
    backgroundColor: "#ffcccc !important", // Light red background
  },
});

const DashboardStock = () => {
  const classes = useStyles();

  // State for rows
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [refreshPage, setRefreshPage] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Handle quantity change
  const handleQuantityChange = async (amenityId, uid, id, delta, setData) => {
    try {
      dispatch(showLoading());
      const formData = {
        stock: delta,
        id: uid,
        amenityId,
        createdBy: user.id,
      };
      await axios.post("api/v1/stock/increment", formData);
      setData((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? { ...row, quantity: Math.max(0, row.quantity + delta) }
            : row
        )
      );
      toast.success("Stock updated successfully");
      setRefreshPage(Math.random());
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      // toast.error(err.response?.data?.message || "An error occurred");
      console.error("Error adding amenity stock:", err);
    } finally {
      setIsAddOpen(false);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`/api/v1/stock/all`);

        if (response.data && response.data.data?.result) {
          // Map the API data into the desired format
          const stockData = response.data.data.result
            .filter((item) => item.stock < 5)
            .map((type, index) => ({
              id: index + 1,
              uid: type.id,
              serialNo: index + 1,
              name: type?.RoomAmenity?.name,
              amenityId: type?.RoomAmenity?.id,
              quantity: type.stock,
            }));

          // Update state
          setAmenitiesData(stockData);
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStock();
  }, [refreshPage]);

  // Column Definitions
  const amenitiesColumn = [
    {
      field: "name",
      headerName: "Amenity",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "quantity",
      headerName: "Stock",
      headerClassName: "super-app-theme--header",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <IconButton
            onClick={() =>
              handleQuantityChange(
                params.row.amenityId,
                params.row.uid,
                params.row.id,
                -1,
                setAmenitiesData
              )
            }
            sx={{
              width: "35px",
              height: "35px",
              backgroundColor: "#ff0000c4",
              color: "#000",
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography>{params.row.quantity}</Typography>
          <IconButton
            onClick={() =>
              handleQuantityChange(
                params.row.amenityId,
                params.row.uid,
                params.row.id,
                1,
                setAmenitiesData
              )
            }
            sx={{
              width: "35px",
              height: "35px",
              backgroundColor: "#06642abf",
              color: "#000",
              borderRadius: "50%",
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Conditional Row Styling
  const getRowClassName = (params) =>
    params.row.quantity < 5 ? classes.lowQuantity : "";

  return (
    <Box sx={{ width: "100%", height: "75vh" }}>
      <DataGrid
        rows={amenitiesData}
        columns={amenitiesColumn}
        pageSize={5}
        rowHeight={40}
        rowsPerPageOptions={[7]}
        disableSelectionOnClick
        getRowClassName={getRowClassName}
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .super-app-theme--header": {
            backgroundColor: `var(--linear-gradient-main)`,
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
          },
          background: `linear-gradient(45deg, var(--body-color), var(--body-color-2))`,
        }}
        showCellVerticalBorder
        showColumnVerticalBorder
      />
    </Box>
  );
};

export default DashboardStock;
