import {
  Box,
  Button,
  Checkbox,
  Divider,
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
import { useDispatch, useSelector } from "react-redux";
import {
  notificationStringManipulation,
  userRoleStringManipulation,
  userRoleStringMeetingManipulation,
  userRoleStringRoomManipulation,
} from "../../utils/utils";
import { Grid2 } from "@mui/material";
import { PaperWrapper } from "../../Style";
import { useNavigate } from "react-router-dom";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const AddUserTypeSettings = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const formik = useFormik({
    initialValues: {
      userTypeName: "",
      calendarView: "",
      userAdd: "",
      userEdit: "",
      userDelete: "",
      userView: "",
      userChangeStatus: "",
      committeeAdd: "",
      committeeEdit: "",
      committeeDelete: "",
      committeeView: "",
      committeeChangeStatus: "",

      notificationRead: "",
      notificationDelete: "",
      notificationView: "",

      inventoryAdd: "",
      inventoryIncrease: "",
      inventoryDecrease: "",
      inventoryView: "",

      committeeMemberDelete: "",
      committeeMemberView: "",

      amenitiesAdd: "",
      amenitiesEdit: "",
      amenitiesDelete: "",
      amenitiesView: "",
      amenitiesChangeStatus: "",

      servicesAdd: "",
      servicesEdit: "",
      servicesDelete: "",
      servicesView: "",
      servicesChangeStatus: "",

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
      locationChangeStatus: "",

      meetingLogsEdit: "",
      meetingLogsView: "",
      meetingLogsPostpone: "",
      meetingLogsCancel: "",
      meetingLogsApproval: "",

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
        .required("User Role Name is required")
        .min(3, "Role name must be at least 3 characters")
        .max(50, "Role name must be at most 50 characters"),
      // Calendar
      calendarView: Yup.boolean().optional(),
      // user
      userAdd: Yup.boolean().optional(),
      userEdit: Yup.boolean().optional(),
      userDelete: Yup.boolean().optional(),
      userView: Yup.boolean().optional(),
      userChangeStatus: Yup.boolean().optional(),
      // Committee
      committeeAdd: Yup.boolean().optional(),
      committeeEdit: Yup.boolean().optional(),
      committeeDelete: Yup.boolean().optional(),
      committeeView: Yup.boolean().optional(),
      committeeChangeStatus: Yup.boolean().optional(),

      notificationRead: Yup.boolean().optional(),
      notificationDelete: Yup.boolean().optional(),
      notificationView: Yup.boolean().optional(),

      inventoryAdd: Yup.boolean().optional(),
      inventoryIncrease: Yup.boolean().optional(),
      inventoryDecrease: Yup.boolean().optional(),
      inventoryView: Yup.boolean().optional(),

      committeeMemberDelete: Yup.boolean().optional(),
      committeeMemberView: Yup.boolean().optional(),
      // Amenities
      amenitiesAdd: Yup.boolean().optional(),
      amenitiesEdit: Yup.boolean().optional(),
      amenitiesDelete: Yup.boolean().optional(),
      amenitiesView: Yup.boolean().optional(),
      amenitiesChangeStatus: Yup.boolean().optional(),
      // serivces
      servicesAdd: Yup.boolean().optional(),
      servicesEdit: Yup.boolean().optional(),
      servicesDelete: Yup.boolean().optional(),
      servicesView: Yup.boolean().optional(),
      servicesChangeStatus: Yup.boolean().optional(),
      // Room
      roomAdd: Yup.boolean().optional(),
      roomEdit: Yup.boolean().optional(),
      roomDelete: Yup.boolean().optional(),
      roomView: Yup.boolean().optional(),
      roomGallery: Yup.boolean().optional(),
      roomAmenities: Yup.boolean().optional(),
      roomFoodBeverage: Yup.boolean().optional(),
      roomBarcode: Yup.boolean().optional(),
      roomSanitization: Yup.boolean().optional(),
      // Location
      locationAdd: Yup.boolean().optional(),
      locationEdit: Yup.boolean().optional(),
      locationDelete: Yup.boolean().optional(),
      locationView: Yup.boolean().optional(),
      locationChangeStatus: Yup.boolean().optional(),
      //Meeting Logs
      meetingLogsEdit: Yup.boolean().optional(),
      meetingLogsView: Yup.boolean().optional(),
      meetingLogsPostpone: Yup.boolean().optional(),
      meetingLogsCancel: Yup.boolean().optional(),
      meetingLogsApproval: Yup.boolean().optional(),
      //Food & Beverages
      foodBeverageAdd: Yup.boolean().optional(),
      foodBeverageEdit: Yup.boolean().optional(),
      foodBeverageDelete: Yup.boolean().optional(),
      foodBeverageView: Yup.boolean().optional(),
      foodBeverageChangeStatus: Yup.boolean().optional(),
      // Report
      reportView: Yup.boolean().optional(),
      // User Role
      userRoleAdd: Yup.boolean().optional(),
      userRoleEdit: Yup.boolean().optional(),
      userRoleDelete: Yup.boolean().optional(),
      userRoleView: Yup.boolean().optional(),
      userRoleChangeStatus: Yup.boolean().optional(),
      // Admin
      isAdmin: Yup.string().optional(),
    }),
    onSubmit: async (values, { resetForm }) => {
      //console.log("Submitted values:", values);
      dispatch(showLoading());

      try {
        const submittedData = {
          userTypeName: values.userTypeName,
          calendarModule: userRoleStringManipulation(
            false,
            false,
            false,
            values.calendarView,
            false
          ),
          userModule: userRoleStringManipulation(
            values.userAdd,
            values.userEdit,
            values.userDelete,
            values.userView,
            values.userChangeStatus
          ),
          committeeModule: userRoleStringManipulation(
            values.committeeAdd,
            values.committeeEdit,
            values.committeeDelete,
            values.committeeView,
            values.committeeChangeStatus
          ),
          notificationModule: notificationStringManipulation(
            false,
            values.notificationRead,
            values.notificationDelete,
            values.notificationView,
            false,
            false
          ),
          inventoryModule: notificationStringManipulation(
            values.inventoryAdd,
            false,
            false,
            values.inventoryView,
            values.inventoryIncrease,
            values.inventoryDecrease
          ),
          committeeMemberModule: notificationStringManipulation(
            false,
            false,
            values.committeeMemberDelete,
            values.committeeMemberView,
            false
          ),
          amenitiesModule: userRoleStringManipulation(
            values.amenitiesAdd,
            values.amenitiesEdit,
            values.amenitiesDelete,
            values.amenitiesView,
            values.amenitiesChangeStatus
          ),
          servicesModule: userRoleStringManipulation(
            values.servicesAdd,
            values.servicesEdit,
            values.servicesDelete,
            values.servicesView,
            values.servicesChangeStatus
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
            values.meetingLogsApproval
          ),
          foodBeverageModule: userRoleStringManipulation(
            values.foodBeverageAdd,
            values.foodBeverageEdit,
            values.foodBeverageDelete,
            values.foodBeverageView,
            values.foodBeverageChangeStatus
          ),
          reportModule: userRoleStringManipulation(
            false,
            false,
            false,
            values.reportView,
            false
          ),
          userRoleModule: userRoleStringManipulation(
            values.userRoleAdd,
            values.userRoleEdit,
            values.userRoleDelete,
            values.userRoleView,
            values.userRoleChangeStatus
          ),
          status: values.status,
          createdBy: values.createdBy,
          isAdmin: values.isAdmin,
        };
        showLoading();
        await axios.post("api/v1/user-type/add-user-type", submittedData);
        toast.success("User role added Successfully");
        resetForm();
        dispatch(hideLoading());
        goBack();
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding user role:", err);
      }
    },
  });
  return (
    <PaperWrapper>
      <Typography variant="h6" component="h6">
        Create New User Role
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        {/* TextField */}
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="User Role Name"
            name="userTypeName"
            value={formik.values.userTypeName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.userTypeName && Boolean(formik.errors.userTypeName)
            }
            placeholder={
              formik.touched.userTypeName && formik.errors.userTypeName
                ? formik.errors.userTypeName
                : "Enter Role Name"
            }
            fullWidth
            required
            margin="normal"
            size="small"
          />

          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(formik.touched.isAdmin && formik.errors.isAdmin)}
            placeholder={
              formik.touched.userTypeName && formik.errors.userTypeName
                ? formik.errors.userTypeName
                : "Enter Role Name"
            }
            size="small"
          >
            <InputLabel id="admin-label">User Role</InputLabel>
            <Select
              label="User Role"
              labelId="admin-label"
              id="isAdmin"
              name="isAdmin"
              value={formik.values.isAdmin}
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

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", true);

                  formik.setFieldValue("amenitiesAdd", "");
                  formik.setFieldValue("amenitiesEdit", "");
                  formik.setFieldValue("amenitiesDelete", "");
                  formik.setFieldValue("amenitiesView", "");
                  formik.setFieldValue("amenitiesChangeStatus", "");

                  formik.setFieldValue("servicesAdd", "");
                  formik.setFieldValue("servicesEdit", "");
                  formik.setFieldValue("servicesDelete", "");
                  formik.setFieldValue("servicesView", "");
                  formik.setFieldValue("servicesChangeStatus", "");

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
                } else if (e.target.value === "admin") {
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

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("inventoryAdd", true);
                  formik.setFieldValue("inventoryView", true);
                  formik.setFieldValue("inventoryIncrease", true);
                  formik.setFieldValue("inventoryDecrease", true);

                  formik.setFieldValue("committeeMemberDelete", true);
                  formik.setFieldValue("committeeMemberView", true);

                  formik.setFieldValue("amenitiesAdd", true);
                  formik.setFieldValue("amenitiesEdit", true);
                  formik.setFieldValue("amenitiesDelete", true);
                  formik.setFieldValue("amenitiesView", true);

                  formik.setFieldValue("servicesAdd", true);
                  formik.setFieldValue("servicesEdit", true);
                  formik.setFieldValue("servicesDelete", true);
                  formik.setFieldValue("servicesView", true);

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
                    values.sanitization;

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
                } else if (e.target.value === "visitor") {
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

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", true);

                  formik.setFieldValue("amenitiesAdd", "");
                  formik.setFieldValue("amenitiesEdit", "");
                  formik.setFieldValue("amenitiesDelete", "");
                  formik.setFieldValue("amenitiesView", "");
                  formik.setFieldValue("amenitiesChangeStatus", "");

                  formik.setFieldValue("servicesAdd", "");
                  formik.setFieldValue("servicesEdit", "");
                  formik.setFieldValue("servicesDelete", "");
                  formik.setFieldValue("servicesView", "");
                  formik.setFieldValue("servicesChangeStatus", "");

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

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("inventoryAdd", true);
                  formik.setFieldValue("inventoryView", true);
                  formik.setFieldValue("inventoryIncrease", true);
                  formik.setFieldValue("inventoryDecrease", true);

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", "");

                  formik.setFieldValue("amenitiesAdd", "");
                  formik.setFieldValue("amenitiesEdit", "");
                  formik.setFieldValue("amenitiesDelete", "");
                  formik.setFieldValue("amenitiesView", "");
                  formik.setFieldValue("amenitiesChangeStatus", "");

                  formik.setFieldValue("servicesAdd", "");
                  formik.setFieldValue("servicesEdit", "");
                  formik.setFieldValue("servicesDelete", "");
                  formik.setFieldValue("servicesView", "");
                  formik.setFieldValue("servicesChangeStatus", "");

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
              onBlur={formik.handleBlur}
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
        {[
          {
            title: "Report",
            permissions: [{ name: "reportView", label: "View" }],
          },
          {
            title: "Calendar",
            permissions: [{ name: "calendarView", label: "View" }],
          },
          {
            title: "Committee Member",
            permissions: [
              { name: "committeeMemberView", label: "View" },
              { name: "committeeMemberDelete", label: "Delete" },
            ],
          },
          {
            title: "Meeting Notification",
            permissions: [
              { name: "notificationView", label: "View" },
              { name: "committeeDelete", label: "Delete" },
              { name: "notificationRead", label: "Read" },
            ],
          },
          {
            title: "User",
            permissions: [
              { name: "userView", label: "View" },
              { name: "userDelete", label: "Delete" },
              { name: "userAdd", label: "Add" },
              { name: "userEdit", label: "Edit" },
              { name: "userChangeStatus", label: "Status" },
            ],
          },
          {
            title: "Committee",
            permissions: [
              { name: "committeeView", label: "View" },
              { name: "committeeDelete", label: "Delete" },
              { name: "committeeAdd", label: "Add" },
              { name: "committeeEdit", label: "Edit" },
              { name: "committeeChangeStatus", label: "Status" },
            ],
          },

          {
            title: "Amenities",
            permissions: [
              { name: "amenitiesView", label: "View" },
              { name: "amenitiesDelete", label: "Delete" },
              { name: "amenitiesAdd", label: "Add" },
              { name: "amenitiesEdit", label: "Edit" },
              { name: "amenitiesChangeStatus", label: "Status" },
            ],
          },
          {
            title: "Services",
            permissions: [
              { name: "servicesView", label: "View" },
              { name: "servicesDelete", label: "Delete" },
              { name: "servicesAdd", label: "Add" },
              { name: "servicesEdit", label: "Edit" },
              { name: "servicesChangeStatus", label: "Status" },
            ],
          },
          {
            title: "Location",
            permissions: [
              { name: "locationView", label: "View" },
              { name: "locationDelete", label: "Delete" },
              { name: "locationAdd", label: "Add" },
              { name: "locationEdit", label: "Edit" },
              { name: "locationChangeStatus", label: "Status" },
            ],
          },
          {
            title: "User Role",
            permissions: [
              { name: "userRoleView", label: "View" },
              { name: "userRoleDelete", label: "Delete" },
              { name: "userRoleAdd", label: "Add" },
              { name: "userRoleEdit", label: "Edit" },
              { name: "userRoleChangeStatus", label: "Status" },
            ],
          },
          {
            title: "Food & Beverages",
            permissions: [
              { name: "foodBeverageView", label: "View" },
              { name: "foodBeverageDelete", label: "Delete" },
              { name: "foodBeverageAdd", label: "Add" },
              { name: "foodBeverageEdit", label: "Edit" },
              { name: "foodBeverageChangeStatus", label: "Status" },
            ],
          },
          {
            title: "Inventory",
            permissions: [
              { name: "inventoryView", label: "View" },
              {
                name: "inventoryAdd",
                label: <span>Add&nbsp;&nbsp;&nbsp;&nbsp;</span>,
              },
              {
                name: "inventoryIncrease",
                label: (
                  <span>
                    Increase&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                ),
              },
              { name: "inventoryDecrease", label: "Decrease" },
            ],
          },
          {
            title: "Meeting Logs",
            permissions: [
              { name: "meetingLogsView", label: "View" },
              { name: "meetingLogsCancel", label: "Cancel" },
              { name: "meetingLogsEdit", label: "Edit" },
              { name: "meetingLogsApproval", label: "Approval" },
              { name: "meetingLogsPostpone", label: "Postpone" },
            ],
          },
          {
            title: "Room",
            permissions: [
              { name: "roomView", label: "View" },
              { name: "roomDelete", label: "Delete" },
              { name: "roomAdd", label: "Add" },
              { name: "roomEdit", label: "Edit" },
              { name: "roomGallery", label: "Gallery" },
              { name: "roomAmenities", label: "Amenities" },
              { name: "roomBarcode", label: "BarCode" },
              { name: "roomSanitization", label: "Sanitization" },
              { name: "roomFoodBeverage", label: "Food Beverage" },
            ],
          },
        ].map((section) => (
          <>
            <Grid2
              container
              columnSpacing={2}
              rowSpacing={1}
              alignItems="center"
            >
              <Grid2 item xs={12} md={3} sx={{ minWidth: "200px" }}>
                <Typography component="h6" sx={{ fontWeight: "bold" }}>
                  {section.title}
                </Typography>
              </Grid2>
              {section.permissions.map((permission) => (
                <Grid2 item xs={6} sm={4} md={2} key={permission.name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        color="primary"
                        name={permission.name}
                        checked={formik.values[permission.name]}
                        onChange={(e) =>
                          formik.setFieldValue(
                            permission.name,
                            e.target.checked
                          )
                        }
                        onBlur={formik.handleBlur}
                      />
                    }
                    label={permission.label}
                  />
                </Grid2>
              ))}
            </Grid2>
            <Divider sx={{ opacity: 1, color: "#000" }} />
          </>
        ))}
        <br />
        <FormButton type='submit' btnName='Add User Role' />
      </Box>
    </PaperWrapper>
  );
};

export default AddUserTypeSettings;
