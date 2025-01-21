import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../Style";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Grid2 as Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import toast from "react-hot-toast";
import { getUserByName } from "../../utils/utils";

// Custom styles
const useStyles = makeStyles({
  lowQuantity: {
    backgroundColor: "#ffcccc !important", // Light red background
  },
});

const InventoryHistory = () => {
  const classes = useStyles();

  // State for rows
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [refreshPage, setRefreshPage] = useState(0);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`/api/v1/stock/stock-history`);

        if (response.data && response.data.data?.result) {
          // Map the API data into the desired format
          console.log(response.data.data.result);
          const stockData = response.data.data.result.map((type, index) => ({
            id: index + 1,
            uid: type.id,
            serialNo: index + 1,
            name: type?.RoomAmenity?.name,
            amenityId: type?.RoomAmenity?.id,
            actionType: type?.stockInOut,
            adminName: type?.createdBy,
            quantity: type.stockUsed,
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
      headerName: "Stock (In/Out)",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "actionType",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
    {
      field: "adminName",
      headerName: "Admin By",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },
  ];

  // Conditional Row Styling
  const getRowClassName = (params) => "";

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
          background: `linear-gradient(45deg, var(--body-color), var(--body-color-2))`,
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
        showCellVerticalBorder
        showColumnVerticalBorder
      />
    </Box>
  );
};

export default InventoryHistory;
