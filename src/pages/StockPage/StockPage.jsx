import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Typography,
  Box,
  Tooltip,
  Badge,
  Button,
} from "@mui/material";
import {
  AddIcon,
  AddOutlinedIcon,
  FoodBankOutlinedIcon,
  Groups2OutlinedIcon,
  RemoveIcon,
} from "../../components/Common/Buttons/CustomIcon";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import AddStock from "./AddStock";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import toast from "react-hot-toast";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";

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
  const [pendingAmenities, setPendingAmenities] = useState(0);
  const [pendingFoodBeverage, setPendingFoodBeverage] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
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

    const fetchPendingAmenitiesCount = async () => {
      try {
        const response = await axios.get(
          `/api/v1/stock/pending-amenities-count`
        );
        setPendingAmenities(response.data.data?.result);
      } catch (error) {
        console.error("Error fetching amenities data:", error);
      }
    };

    const fetchPendingFoodBeverageCount = async () => {
      try {
        const response = await axios.get(
          `/api/v1/stock/pending-food-beverage-count`
        );
        setPendingFoodBeverage(response.data.data?.result);
      } catch (error) {
        console.error("Error fetching food beverage data:", error);
      }
    };

    fetchStock();
    fetchPendingAmenitiesCount();
    fetchPendingFoodBeverageCount();
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

  const handleNavigatePendingAmenities = () => {
    navigate(`/pending-amenities`);
  };

  const handleNavigatePendingFoodBeverage = () => {
    navigate(`/pending-food-beverage`);
  };

  return (
    <PaperWrapper>
      <PageHeader
        heading="Inventory"
        icon={AddOutlinedIcon}
        func={setIsAddOpen}
        nameOfTheClass="add-new-service"
        statusIcon={
          user.UserType.inventoryModule &&
          user.UserType.inventoryModule.split(",").includes("add")
        }
      />
      <div className="col-lg-12 d-flex align-items-center pb-2 justify-content-end gap-2">
        {user.UserType.inventoryModule &&
            user.UserType.inventoryModule.split(",").includes("pendingAmenityView") &&<Button
          id="amenities-icon"
          className="rounded-circle"
          onClick={handleNavigatePendingAmenities}
        >
          <Tooltip title="Pending Amenities">
            <Badge badgeContent={pendingAmenities} color="error">
              <Groups2OutlinedIcon color="white" className="cursor" />
            </Badge>
          </Tooltip>
        </Button>}
        {user.UserType.inventoryModule &&
            user.UserType.inventoryModule.split(",").includes("pendingFoodBeverageView") &&<Button
          id="notification-icon"
          className="rounded-circle"
          onClick={handleNavigatePendingFoodBeverage}
        >
          <Tooltip title="Pending Food & Beverage">
            <Badge badgeContent={pendingFoodBeverage} color="error">
              <FoodBankOutlinedIcon color="white" className="cursor" />
            </Badge>
          </Tooltip>
        </Button>}
      </div>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "75vh",
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
              backgroundColor: `var(--linear-gradient-main)`,
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
            },
          }}
        />
      </Box>
      <NewPopUpModal
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
