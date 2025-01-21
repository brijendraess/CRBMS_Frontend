import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { DataGrid } from "@mui/x-data-grid";
import { Grid2 as Grid, IconButton, Typography, Box } from "@mui/material";
import {
  AddIcon,
  AddOutlinedIcon,
  RemoveIcon,
} from "../../components/Common/CustomButton/CustomIcon";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import AddStock from "./AddStock";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import toast from "react-hot-toast";

const useStyles = makeStyles({
  lowQuantity: {
    backgroundColor: "#ffcccc !important",
  },
});

const StockPage = () => {
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
      toast.error(err.response?.data?.message || "An error occurred");
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
          const stockData = response.data.data.result.map((type, index) => ({
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
      field: "serialNo",
      headerName: "#",
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
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
          {user.UserType.inventoryModule &&
            user.UserType.inventoryModule.split(",").includes("decrease") && (
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
            )}
          <Typography>{params.row.quantity}</Typography>
          {user.UserType.inventoryModule &&
            user.UserType.inventoryModule.split(",").includes("increase") && (
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
            )}
        </Box>
      ),
    },
  ];

  // Conditional Row Styling
  const getRowClassName = (params) =>
    params.row.quantity < 5 ? classes.lowQuantity : "";

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
            fontSize: {
              xs: "16px",
              sm: "18px",
              md: "22px",
            },
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#2E2E2E",
          }}
        >
          Inventory
        </Typography>

        {user.UserType.inventoryModule &&
          user.UserType.inventoryModule.split(",").includes("add") && (
            <CustomButton
              onClick={() => setIsAddOpen(true)}
              title={"Add New Stock"}
              placement={"left"}
              Icon={AddOutlinedIcon}
              fontSize={"medium"}
              background={"rgba(3, 176, 48, 0.68)"}
            />
          )}
      </Box>
      <Grid
        container
        spacing={3}
        display={"flex"}
        sx={{
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
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
              backgroundColor: "#006400",
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
            },
          }}
        />
      </Grid>
      <PopupModals
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={"Add Stock"}
        modalBody={
          <AddStock
            setRefreshPage={setRefreshPage}
            setIsAddOpen={setIsAddOpen}
          />
        }
      />
    </PaperWrapper>
  );
};

export default StockPage;
