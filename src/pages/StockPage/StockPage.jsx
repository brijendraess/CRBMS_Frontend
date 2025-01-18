import React, { useState } from "react";
import { PaperWrapper } from "../../Style";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import { DataGrid } from "@mui/x-data-grid";
import { Grid2 as Grid, IconButton, Typography, Box } from "@mui/material";
import {
  AddIcon,
  RemoveIcon,
} from "../../components/Common/CustomButton/CustomIcon";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  lowQuantity: {
    backgroundColor: "#ffcccc !important",
  },
});

const initialAmenitiesData = [
  { id: 1, serialNo: 1, name: "Chairs", quantity: 10 },
  { id: 2, serialNo: 2, name: "Tables", quantity: 5 },
  { id: 3, serialNo: 3, name: "Projectors", quantity: 2 },
];

const initialFoodData = [
  { id: 1, serialNo: 1, name: "Water Bottles", quantity: 50 },
  { id: 2, serialNo: 2, name: "Coffee Cups", quantity: 30 },
  { id: 3, serialNo: 3, name: "Snacks", quantity: 20 },
];

const StockPage = () => {
  const classes = useStyles();

  // State for rows
  const [amenitiesData, setAmenitiesData] = useState(initialAmenitiesData);
  const [foodData, setFoodData] = useState(initialFoodData);

  // Handle quantity change
  const handleQuantityChange = (id, delta, setData) => {
    setData((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? { ...row, quantity: Math.max(0, row.quantity + delta) }
          : row
      )
    );
  };

  // Column Definitions
  const amenitiesColumn = [
    {
      field: "serialNo",
      headerName: "#",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 50,
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
      headerName: "Quantity",
      headerClassName: "super-app-theme--header",
      width: 200,
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
              handleQuantityChange(params.row.id, -1, setAmenitiesData)
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
              handleQuantityChange(params.row.id, 1, setAmenitiesData)
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

  const foodColumn = [
    {
      field: "serialNo",
      headerName: "#",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 50,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Food & Beverage",
      flex: 2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      headerClassName: "super-app-theme--header",
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
            onClick={() => handleQuantityChange(params.row.id, -1, setFoodData)}
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
            onClick={() => handleQuantityChange(params.row.id, 1, setFoodData)}
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
    params.row.quantity < 10 ? classes.lowQuantity : "";

  return (
    <PaperWrapper>
      <PageHeader heading={"Inventory"} />
      <Grid
        container
        spacing={3}
        sx={{
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
        {/* Amenities DataGrid */}
        <Box
          sx={{
            width: "49%",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Amenities
          </Typography>
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
            // showCellVerticalBorder
            // showColumnVerticalBorder
          />
        </Box>

        {/* Food & Beverages DataGrid */}
        <Box
          sx={{
            width: "49%",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Food & Beverages
          </Typography>
          <DataGrid
            rows={foodData}
            columns={foodColumn}
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
            // showCellVerticalBorder
            // showColumnVerticalBorder
          />
        </Box>
      </Grid>
    </PaperWrapper>
  );
};

export default StockPage;
