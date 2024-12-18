import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const EditRoomFoodBeverage = ({ room ,setRefreshPage,setOpenEdit,editId,editInfo}) => {
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    foodBeverageId: editInfo?.foodBeverageId, 
    quantity: editInfo?.quantity,
    roomId:room.id,
    status:true,
    updatedBy:user.id
  });
  const [amenitiesList, setAmenitiesList] = useState([]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the correct key
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`api/v1/rooms/edit-food-beverage/${editId}`, formData);
      toast.success("Food beverage updated Successfully");
      setRefreshPage(Math.random());
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
      console.error("Error adding Food beverage:", err);
    }
    finally{
        setOpenEdit(false);
    }
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get("api/v1/food-beverages/active-food-beverage");
        const foodBeverage = response.data.data.result.map(
          (foodBeverage) =>{
            return {id:foodBeverage.id,label:foodBeverage.foodBeverageName}
          }
        );
        setAmenitiesList(foodBeverage);
      } catch (error) {
        toast.error("Failed to load food beverage");
        console.error("Error fetching food beverage:", error);
      }
    };

    fetchAmenities();
  }, []);

  return (
    <div className="pop-content w-100">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
      >
        <FormControl sx={{ m: 1, width: "100%" }}>
        <InputLabel id="demo-multiple-name-label">Amenity Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="foodBeverageId"
          name="foodBeverageId"
          value={formData.foodBeverageId}
          label="Amenity Name"
          required
          size="small"
          onChange={handleChange}
        >
          {amenitiesList.map((foodBeverage)=><MenuItem value={foodBeverage.id}>{foodBeverage.label}</MenuItem>)}
        </Select>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={()=>handleSubmit()}
          fullWidth
          sx={{ mt: 2 }}
        >
          Save
        </Button>
        </FormControl>
      </Box>
    </div>
  );
};

export default EditRoomFoodBeverage;
