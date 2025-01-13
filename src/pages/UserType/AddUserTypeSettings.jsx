import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { userRoleStringManipulation, userRoleStringMeetingManipulation, userRoleStringRoomManipulation } from "../../utils/utils";

const AddUserTypeSettings = ({ setRefreshPage, setIsAddOpen }) => {
  const { user } = useSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      userTypeName: "",
      calendarView: "",
      userAdd: "",
      userEdit: "",
      userDelete: "",
      userView: "",
      userChangeStatus:"",
      committeeAdd: "",
      committeeEdit: "",
      committeeDelete: "",
      committeeView: "",
      committeeChangeStatus:"",

      committeeMemberDelete: "",
      committeeMemberView: "",

      amenitiesAdd: "",
      amenitiesEdit: "",
      amenitiesDelete: "",
      amenitiesView: "",
      amenitiesChangeStatus: "",
      roomAdd: "",
      roomEdit: "",
      roomDelete: "",
      roomView: "",
      roomGallery: "",
      roomAmenities: "",
      roomFoodBeverage: "",
      roomBarcode: "",
      roomSanitization: "",

      locationAdd: "",
      locationEdit: "",
      locationDelete: "",
      locationView: "",
      locationChangeStatus:"",

      meetingLogsEdit: "",
      meetingLogsView:"",
      meetingLogsPostpone: "",
      meetingLogsCancel: "",
      meetingLogsApproval:"",

      foodBeverageAdd: "",
      foodBeverageEdit: "",
      foodBeverageDelete: "",
      foodBeverageView: "",
      foodBeverageChangeStatus: "",

      reportView: "",

      userRoleAdd: "",
      userRoleEdit: "",
      userRoleDelete: "",
      userRoleView: "",
      userRoleChangeStatus: "",
      isAdmin: "",
      status: true,
      createdBy: user.id,
    },
    validationSchema: Yup.object({
      userTypeName: Yup.string()
        .required("user roll name is required")
        .min(3, "Roll name must be at least 3 characters")
        .max(50, "Roll name must be at most 50 characters"),
      calendarView: Yup.boolean().optional(),
      userAdd: Yup.boolean().optional(),
      userEdit: Yup.boolean().optional(),
      userDelete: Yup.boolean().optional(),
      userView: Yup.boolean().optional(),
      userChangeStatus:Yup.boolean().optional(),
      committeeAdd: Yup.boolean().optional(),
      committeeEdit: Yup.boolean().optional(),
      committeeDelete: Yup.boolean().optional(),
      committeeView: Yup.boolean().optional(),
      committeeChangeStatus: Yup.boolean().optional(),

      committeeMemberDelete: Yup.boolean().optional(),
      committeeMemberView: Yup.boolean().optional(),

      amenitiesAdd: Yup.boolean().optional(),
      amenitiesEdit: Yup.boolean().optional(),
      amenitiesDelete: Yup.boolean().optional(),
      amenitiesView: Yup.boolean().optional(),
      amenitiesChangeStatus: Yup.boolean().optional(),
      roomAdd: Yup.boolean().optional(),
      roomEdit: Yup.boolean().optional(),
      roomDelete: Yup.boolean().optional(),
      roomView: Yup.boolean().optional(),
      roomGallery: Yup.boolean().optional(),
      roomAmenities: Yup.boolean().optional(),
      roomFoodBeverage: Yup.boolean().optional(),
      roomBarcode: Yup.boolean().optional(),
      roomSanitization: Yup.boolean().optional(),
      locationAdd: Yup.boolean().optional(),
      locationEdit: Yup.boolean().optional(),
      locationDelete: Yup.boolean().optional(),
      locationView: Yup.boolean().optional(),
      locationChangeStatus: Yup.boolean().optional(),

      meetingLogsEdit: Yup.boolean().optional(),
      meetingLogsView: Yup.boolean().optional(),
      meetingLogsPostpone: Yup.boolean().optional(),
      meetingLogsCancel: Yup.boolean().optional(),
      meetingLogsApproval:Yup.boolean().optional(),

      foodBeverageAdd: Yup.boolean().optional(),
      foodBeverageEdit: Yup.boolean().optional(),
      foodBeverageDelete: Yup.boolean().optional(),
      foodBeverageView: Yup.boolean().optional(),
      foodBeverageChangeStatus: Yup.boolean().optional(),
      reportView: Yup.boolean().optional(),

      userRoleAdd: Yup.boolean().optional(),
      userRoleEdit: Yup.boolean().optional(),
      userRoleDelete: Yup.boolean().optional(),
      userRoleView: Yup.boolean().optional(),
      userRoleChangeStatus: Yup.boolean().optional(),
      isAdmin: Yup.string().optional(),
    }),
    onSubmit: async (values, { resetForm }) => {
      //console.log("Submitted values:", values);
      try {
        const submittedData = {
          userTypeName: values.userTypeName,
          calendarModule: userRoleStringManipulation(
            false,false,false,values.calendarView,false
          ),
          userModule: userRoleStringManipulation(
            values.userAdd,
            values.userEdit,
            values.userDelete,
            values.userView,
            values.userChangeStatus,
          ),
          committeeModule: userRoleStringManipulation(
            values.committeeAdd,
            values.committeeEdit,
            values.committeeDelete,
            values.committeeView,
            values.committeeChangeStatus,
          ),
          committeeMemberModule: userRoleStringManipulation(
            false,
            false,
            values.committeeMemberDelete,
            values.committeeMemberView,
            false,
          ),
          amenitiesModule: userRoleStringManipulation(
            values.amenitiesAdd,
            values.amenitiesEdit,
            values.amenitiesDelete,
            values.amenitiesView,
            values.amenitiesChangeStatus
          ),
          roomModule: userRoleStringRoomManipulation(
            values.roomAdd,
            values.roomEdit,
            values.roomDelete,
            values.roomView,
            values.roomGallery,
            values.roomAmenities,
            values.roomFoodBeverage,
            values.roomBarcode,
            values.roomSanitization
           
          ),
          locationModule: userRoleStringManipulation(
            values.locationAdd,
            values.locationEdit,
            values.locationDelete,
            values.locationView,
            values.locationChangeStatus
          ),
          meetingLogsModule: userRoleStringMeetingManipulation(
            values.meetingLogsEdit,
            values.meetingLogsView,
            values.meetingLogsPostpone,
            values.meetingLogsCancel,
            values.meetingLogsApproval,
          ),
          foodBeverageModule: userRoleStringManipulation(
            values.foodBeverageAdd,
            values.foodBeverageEdit,
            values.foodBeverageDelete,
            values.foodBeverageView,
            values.foodBeverageChangeStatus,
          ),
          reportModule: userRoleStringManipulation(
            false,false,false,values.reportView,false
          ),
          userRoleModule: userRoleStringManipulation(
            values.userRoleAdd,
            values.userRoleEdit,
            values.userRoleDelete,
            values.userRoleView,
            values.userRoleChangeStatus,
          ),
          status: values.status,
          createdBy: values.createdBy,
          isAdmin: values.isAdmin,
        };
        showLoading();
        await axios.post("api/v1/user-type/add-user-type", submittedData);
        toast.success("User role added Successfully");
        resetForm(); // Reset form after successful submission
        setRefreshPage(Math.random());
        setIsAddOpen(false);
        hideLoading();
      } catch (err) {
        hideLoading();
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding user role:", err);
      }
    },
  });
  return (
    <div className="pop-content w-100">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          margin: "auto",
          borderRadius: 3,
        }}
      >
        <Box display="flex" gap={2}>
          <TextField
            label="User Roll Name"
            name="userTypeName"
            value={formik.values.userTypeName} 
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur} 
            error={
              formik.touched.userTypeName && Boolean(formik.errors.userTypeName)
            } // Show error if touched and invalid
            helperText={
              formik.touched.userTypeName && formik.errors.userTypeName
            } // Display validation error
            fullWidth
            required
            margin="normal"
            size="small"
          />

          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(formik.touched.isAdmin && formik.errors.isAdmin)}
          >
            <InputLabel id="admin-label">User Role</InputLabel>
            <Select
              labelId="admin-label"
              id="isAdmin"
              name="isAdmin"
              value={formik.values.isAdmin} // Bind value to Formik's state
              onChange={(e) => {
                formik.handleChange(e);

                if (e.target.value === "normal") {
                  formik.setFieldValue("calendarView", true);             
                  formik.setFieldValue("roomView", true);
                  formik.setFieldValue("userAdd", "");
                  formik.setFieldValue("userEdit", "");
                  formik.setFieldValue("userDelete", "");
                  formik.setFieldValue("userView", "");
                  formik.setFieldValue("userChangeStatus", "");
                  formik.setFieldValue("committeeAdd", "");
                  formik.setFieldValue("committeeEdit", "");
                  formik.setFieldValue("committeeDelete", "");
                  formik.setFieldValue("committeeView", true);
                  formik.setFieldValue("committeeChangeStatus", true);
                  
                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", true);

                  formik.setFieldValue("amenitiesAdd", "");
                  formik.setFieldValue("amenitiesEdit", "");
                  formik.setFieldValue("amenitiesDelete", "");
                  formik.setFieldValue("amenitiesView", "");
                  formik.setFieldValue("amenitiesChangeStatus", "");
                  formik.setFieldValue("roomAdd", "");
                  formik.setFieldValue("roomEdit", "");
                  formik.setFieldValue("roomDelete", "");
                  formik.setFieldValue("roomGallery", "");
                  formik.setFieldValue("roomAmenities", "");
                  formik.setFieldValue("roomFoodBeverage", "");
                  formik.setFieldValue("roomBarcode", "");
                  formik.setFieldValue("roomSanitization", "");
               
                  formik.setFieldValue("locationAdd", "");
                  formik.setFieldValue("locationEdit", "");
                  formik.setFieldValue("locationDelete", "");
                  formik.setFieldValue("locationView", "");
                  formik.setFieldValue("locationChangeStatus", "");
                 
                  formik.setFieldValue("meetingLogsEdit", "");
                  formik.setFieldValue("meetingLogsView", "");
                  formik.setFieldValue("meetingLogsPostpone", "");
                  formik.setFieldValue("meetingLogsCancel", "");
                  formik.setFieldValue("meetingLogsApproval", "");
                  
                  formik.setFieldValue("foodBeverageAdd", "");
                  formik.setFieldValue("foodBeverageEdit", "");
                  formik.setFieldValue("foodBeverageDelete", "");
                  formik.setFieldValue("foodBeverageView", "");
                  formik.setFieldValue("foodBeverageChangeStatus", "");
                  formik.setFieldValue("reportView", "");

                  formik.setFieldValue("userRoleAdd", "");
                  formik.setFieldValue("userRoleEdit", "");
                  formik.setFieldValue("userRoleDelete", "");
                  formik.setFieldValue("userRoleView", "");
                  formik.setFieldValue("userRoleChangeStatus", "");
                }else  if (e.target.value === "admin") {
                  formik.setFieldValue("calendarView", true);
                  formik.setFieldValue("userAdd", true);
                  formik.setFieldValue("userEdit", true);
                  formik.setFieldValue("userDelete", true);
                  formik.setFieldValue("userView", true);
                  formik.setFieldValue("userChangeStatus", true);
                  formik.setFieldValue("committeeAdd", true);
                  formik.setFieldValue("committeeEdit", true);
                  formik.setFieldValue("committeeDelete", true);
                  formik.setFieldValue("committeeView", true);
                  formik.setFieldValue("committeeChangeStatus", true);

                  formik.setFieldValue("committeeMemberDelete", true);
                  formik.setFieldValue("committeeMemberView", true);

                  formik.setFieldValue("amenitiesAdd", true);
                  formik.setFieldValue("amenitiesEdit", true);
                  formik.setFieldValue("amenitiesDelete", true);
                  formik.setFieldValue("amenitiesView", true);
                  formik.setFieldValue("amenitiesChangeStatus", true);
                  formik.setFieldValue("roomAdd", true);
                  formik.setFieldValue("roomEdit", true);
                  formik.setFieldValue("roomDelete", true);
                  formik.setFieldValue("roomView", true);
                  formik.setFieldValue("roomGallery", true);
                  formik.setFieldValue("roomAmenities", true);
                  formik.setFieldValue("roomFoodBeverage", true);
                  formik.setFieldValue("roomBarcode", true);
                  formik.setFieldValue("roomSanitization", true);
                  formik.setFieldValue("gallery", true);
                  formik.setFieldValue("roomEdit", true);
                  formik.setFieldValue("roomDelete", true);
                  formik.setFieldValue("roomView", true);
                  values.gallery,
                  values.amenities,
                  values.foodBeverage,
                  values.barcode,
                  values.sanitization

                  formik.setFieldValue("locationAdd", true);
                  formik.setFieldValue("locationEdit", true);
                  formik.setFieldValue("locationDelete", true);
                  formik.setFieldValue("locationView", true);
                  formik.setFieldValue("locationChangeStatus", true);
                 
                  formik.setFieldValue("meetingLogsEdit", true);
                  formik.setFieldValue("meetingLogsView", true);
                  formik.setFieldValue("meetingLogsPostpone", true);
                  formik.setFieldValue("meetingLogsCancel", true);
                  formik.setFieldValue("meetingLogsApproval", true);

                  formik.setFieldValue("foodBeverageAdd", true);
                  formik.setFieldValue("foodBeverageEdit", true);
                  formik.setFieldValue("foodBeverageDelete", true);
                  formik.setFieldValue("foodBeverageView", true);
                  formik.setFieldValue("foodBeverageChangeStatus", true);
                  formik.setFieldValue("reportView", true);

                  formik.setFieldValue("userRoleAdd", true);
                  formik.setFieldValue("userRoleEdit", true);
                  formik.setFieldValue("userRoleDelete", true);
                  formik.setFieldValue("userRoleView", true);
                  formik.setFieldValue("userRoleChangeStatus", true);
                }else  if (e.target.value === "visitor") {
                  formik.setFieldValue("calendarView", true);             
                 
                  formik.setFieldValue("roomView", true);
                  formik.setFieldValue("userAdd", "");
                  formik.setFieldValue("userEdit", "");
                  formik.setFieldValue("userDelete", "");
                  formik.setFieldValue("userView", "");
                  formik.setFieldValue("userChangeStatus", "");
                  formik.setFieldValue("committeeAdd", "");
                  formik.setFieldValue("committeeEdit", "");
                  formik.setFieldValue("committeeDelete", "");
                  formik.setFieldValue("committeeView", true);
                  formik.setFieldValue("committeeChangeStatus", true);

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", true);

                  formik.setFieldValue("amenitiesAdd", "");
                  formik.setFieldValue("amenitiesEdit", "");
                  formik.setFieldValue("amenitiesDelete", "");
                  formik.setFieldValue("amenitiesView", "");
                  formik.setFieldValue("amenitiesChangeStatus", "");
                  formik.setFieldValue("roomAdd", "");
                  formik.setFieldValue("roomEdit", "");
                  formik.setFieldValue("roomDelete", "");
                  formik.setFieldValue("roomGallery", "");
                  formik.setFieldValue("roomAmenities", "");
                  formik.setFieldValue("roomFoodBeverage", "");
                  formik.setFieldValue("roomBarcode", "");
                  formik.setFieldValue("roomSanitization", "");
                 

                  formik.setFieldValue("locationAdd", "");
                  formik.setFieldValue("locationEdit", "");
                  formik.setFieldValue("locationDelete", "");
                  formik.setFieldValue("locationView", "");
                  formik.setFieldValue("locationChangeStatus", "");
                  
                  formik.setFieldValue("meetingLogsEdit", "");
                  formik.setFieldValue("meetingLogsView", "");
                  formik.setFieldValue("meetingLogsPostpone", "");
                  formik.setFieldValue("meetingLogsCancel", "");
                  formik.setFieldValue("meetingLogsApproval", "");

                  formik.setFieldValue("foodBeverageAdd", "");
                  formik.setFieldValue("foodBeverageEdit", "");
                  formik.setFieldValue("foodBeverageDelete", "");
                  formik.setFieldValue("foodBeverageView", "");
                  formik.setFieldValue("foodBeverageChangeStatus", "");
                  formik.setFieldValue("reportView", "");

                  formik.setFieldValue("userRoleAdd", "");
                  formik.setFieldValue("userRoleEdit", "");
                  formik.setFieldValue("userRoleDelete", "");
                  formik.setFieldValue("userRoleView", "");
                  formik.setFieldValue("userRoleChangeStatus", "");
                } else {
                  formik.setFieldValue("calendarView", "");
                  formik.setFieldValue("userAdd", "");
                  formik.setFieldValue("userEdit", "");
                  formik.setFieldValue("userDelete", "");
                  formik.setFieldValue("userView", "");
                  formik.setFieldValue("userChangeStatus", "");
                  formik.setFieldValue("committeeAdd", "");
                  formik.setFieldValue("committeeEdit", "");
                  formik.setFieldValue("committeeDelete", "");
                  formik.setFieldValue("committeeView", "");
                  formik.setFieldValue("committeeChangeStatus", "");

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", "");

                  formik.setFieldValue("amenitiesAdd", "");
                  formik.setFieldValue("amenitiesEdit", "");
                  formik.setFieldValue("amenitiesDelete", "");
                  formik.setFieldValue("amenitiesView", "");
                  formik.setFieldValue("amenitiesChangeStatus", "");
                  formik.setFieldValue("roomAdd", "");
                  formik.setFieldValue("roomEdit", "");
                  formik.setFieldValue("roomDelete", "");
                  formik.setFieldValue("roomView", "");
                  formik.setFieldValue("roomGallery", "");
                  formik.setFieldValue("roomAmenities", "");
                  formik.setFieldValue("roomFoodBeverage", "");
                  formik.setFieldValue("roomBarcode", "");
                  formik.setFieldValue("roomSanitization", "");

                  formik.setFieldValue("locationAdd", "");
                  formik.setFieldValue("locationEdit", "");
                  formik.setFieldValue("locationDelete", "");
                  formik.setFieldValue("locationView", "");
                  formik.setFieldValue("locationChangeStatus", "");
                 
                  formik.setFieldValue("meetingLogsEdit", "");
                  formik.setFieldValue("meetingLogsView", "");
                  formik.setFieldValue("meetingLogsPostpone", "");
                  formik.setFieldValue("meetingLogsCancel", "");
                  formik.setFieldValue("meetingLogsApproval", "");

                  formik.setFieldValue("foodBeverageAdd", "");
                  formik.setFieldValue("foodBeverageEdit", "");
                  formik.setFieldValue("foodBeverageDelete", "");
                  formik.setFieldValue("foodBeverageView", "");
                  formik.setFieldValue("foodBeverageChangeStatus", "");
                  formik.setFieldValue("reportView", "");

                  formik.setFieldValue("userRoleAdd", "");
                  formik.setFieldValue("userRoleEdit", "");
                  formik.setFieldValue("userRoleDelete", "");
                  formik.setFieldValue("userRoleView", "");
                  formik.setFieldValue("userRoleChangeStatus", "");
                }
              }}
              onBlur={formik.handleBlur} // Formik's onBlur handler
              margin="normal"
              size="small"
              required
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="normal">Normal End User</MenuItem>
              <MenuItem value="visitor">Visitor</MenuItem>
            </Select>
            {formik.touched.isAdmin && formik.errors.isAdmin && (
              <FormHelperText>{formik.errors.isAdmin}</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "10.5%" }}
          >
            Calendar
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="calendarView"
                checked={formik.values.calendarView} 
                 onChange={(e) => {
                  formik.setFieldValue("calendarView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "18%" }}
          >
            User
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userAdd"
                checked={formik.values.userAdd} 
                 onChange={(e) => {
                  formik.setFieldValue("userAdd", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Add"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userEdit"
                checked={formik.values.userEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("userEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userDelete"
                checked={formik.values.userDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("userDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userView"
                checked={formik.values.userView} 
                 onChange={(e) => {
                  formik.setFieldValue("userView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userChangeStatus"
                checked={formik.values.userChangeStatus} 
                 onChange={(e) => {
                  formik.setFieldValue("userChangeStatus", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Status"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "8%" }}
          >
            Committee
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="committeeAdd"
                checked={formik.values.committeeAdd} 
                 onChange={(e) => {
                  formik.setFieldValue("committeeAdd", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Add"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="committeeEdit"
                checked={formik.values.committeeEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("committeeEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="committeeDelete"
                checked={formik.values.committeeDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("committeeDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="committeeView"
                checked={formik.values.committeeView} 
                 onChange={(e) => {
                  formik.setFieldValue("committeeView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
         <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="committeeChangeStatus"
                checked={formik.values.committeeChangeStatus} 
                 onChange={(e) => {
                  formik.setFieldValue("committeeChangeStatus", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Status"
          /> 
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "8%" }}
          >
            Committee member
          </Typography>
         
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="committeeMemberDelete"
                checked={formik.values.committeeMemberDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("committeeMemberDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="committeeMemberView"
                checked={formik.values.committeeMemberView} 
                 onChange={(e) => {
                  formik.setFieldValue("committeeMemberView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "10%" }}
          >
            Amenities
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="amenitiesAdd"
                checked={formik.values.amenitiesAdd} 
                 onChange={(e) => {
                  formik.setFieldValue("amenitiesAdd", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Add"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="amenitiesEdit"
                checked={formik.values.amenitiesEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("amenitiesEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="amenitiesDelete"
                checked={formik.values.amenitiesDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("amenitiesDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="amenitiesView"
                checked={formik.values.amenitiesView} 
                 onChange={(e) => {
                  formik.setFieldValue("amenitiesView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
         <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="amenitiesChangeStatus"
                checked={formik.values.amenitiesChangeStatus} 
                 onChange={(e) => {
                  formik.setFieldValue("amenitiesChangeStatus", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Status"
          /> 
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "17%" }}
          >
            Room
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomAdd"
                checked={formik.values.roomAdd} 
                 onChange={(e) => {
                  formik.setFieldValue("roomAdd", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Add"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomEdit"
                checked={formik.values.roomEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("roomEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomDelete"
                checked={formik.values.roomDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("roomDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomView"
                checked={formik.values.roomView} 
                 onChange={(e) => {
                  formik.setFieldValue("roomView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomGallery"
                checked={formik.values.roomGallery} 
                 onChange={(e) => {
                  formik.setFieldValue("roomGallery", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Gallery"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomAmenities"
                checked={formik.values.roomAmenities} 
                 onChange={(e) => {
                  formik.setFieldValue("roomAmenities", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Amenities"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomFoodBeverage"
                checked={formik.values.roomFoodBeverage} 
                 onChange={(e) => {
                  formik.setFieldValue("roomFoodBeverage", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Food Beverage"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomBarcode"
                checked={formik.values.roomBarcode} 
                 onChange={(e) => {
                  formik.setFieldValue("roomBarcode", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="BarCode"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="roomSanitization"
                checked={formik.values.roomSanitization} 
                 onChange={(e) => {
                  formik.setFieldValue("roomSanitization", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Sanitization"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "12.75%" }}
          >
            Location
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="locationAdd"
                checked={formik.values.locationAdd} 
                 onChange={(e) => {
                  formik.setFieldValue("locationAdd", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Add"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="locationEdit"
                checked={formik.values.locationEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("locationEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="locationDelete"
                checked={formik.values.locationDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("locationDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="locationView"
                checked={formik.values.locationView} 
                 onChange={(e) => {
                  formik.setFieldValue("locationView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
        <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="locationChangeStatus"
                checked={formik.values.locationChangeStatus} 
                 onChange={(e) => {
                  formik.setFieldValue("locationChangeStatus", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Status"
          />  
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "12.75%" }}
          > Meeting Logs
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="meetingLogsEdit"
                checked={formik.values.meetingLogsEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("meetingLogsEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
           <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="meetingLogsView"
                checked={formik.values.meetingLogsView} 
                 onChange={(e) => {
                  formik.setFieldValue("meetingLogsView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="meetingLogsPostpone"
                checked={formik.values.meetingLogsPostpone} 
                 onChange={(e) => {
                  formik.setFieldValue("meetingLogsPostpone", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Postpone"
          /> 
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="meetingLogsCancel"
                checked={formik.values.meetingLogsCancel} 
                 onChange={(e) => {
                  formik.setFieldValue("meetingLogsCancel", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Cancel"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="meetingLogsApproval"
                checked={formik.values.meetingLogsApproval} 
                 onChange={(e) => {
                  formik.setFieldValue("meetingLogsApproval", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Approval"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Typography component={"h6"} sx={{ fontWeight: "bold" }}>
            Food & Beverage
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="foodBeverageAdd"
                checked={formik.values.foodBeverageAdd} 
                 onChange={(e) => {
                  formik.setFieldValue("foodBeverageAdd", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Add"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="foodBeverageEdit"
                checked={formik.values.foodBeverageEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("foodBeverageEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="foodBeverageDelete"
                checked={formik.values.foodBeverageDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("foodBeverageDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="foodBeverageView"
                checked={formik.values.foodBeverageView} 
                 onChange={(e) => {
                  formik.setFieldValue("foodBeverageView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="foodBeverageChangeStatus"
                checked={formik.values.foodBeverageChangeStatus} 
                 onChange={(e) => {
                  formik.setFieldValue("foodBeverageChangeStatus", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Status"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "16%" }}
          >
            Report
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="reportView"
                checked={formik.values.reportView} 
                 onChange={(e) => {
                  formik.setFieldValue("reportView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Typography
            component={"h6"}
            sx={{ fontWeight: "bold", marginRight: "18%" }}
          >
            User Role
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userRoleAdd"
                checked={formik.values.userRoleAdd} 
                 onChange={(e) => {
                  formik.setFieldValue("userRoleAdd", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Add"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userRoleEdit"
                checked={formik.values.userRoleEdit} 
                 onChange={(e) => {
                  formik.setFieldValue("userRoleEdit", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userRoleDelete"
                checked={formik.values.userRoleDelete} 
                 onChange={(e) => {
                  formik.setFieldValue("userRoleDelete", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Delete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userRoleView"
                checked={formik.values.userRoleView} 
                 onChange={(e) => {
                  formik.setFieldValue("userRoleView", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="View"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="userRoleChangeStatus"
                checked={formik.values.userRoleChangeStatus} 
                 onChange={(e) => {
                  formik.setFieldValue("userRoleChangeStatus", e.target.checked);
                }} 
                onBlur={formik.handleBlur} 
              />
            }
            label="Status"
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add User Role
        </Button>
      </Box>
    </div>
  );
};

export default AddUserTypeSettings;
