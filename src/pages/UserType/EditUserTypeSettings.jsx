import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
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
  inventoryStringManipulation,
  notificationStringManipulation,
  userRoleStringManipulation,
  userRoleStringMeetingManipulation,
  userRoleStringRoomManipulation,
} from "../../utils/utils";
import { PaperWrapper } from "../../Style";
import { useLocation, useNavigate } from "react-router-dom";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const EditUserTypeSettings = () => {
  const { user } = useSelector((state) => state.user);

  const location = useLocation();
  const { userRole } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goBack = () => {
    navigate(-1);
  };
  const formik = useFormik({
    initialValues: {
      userTypeName: userRole?.userTypeName,
      calendarView: userRole?.calendarModule?.split(",").includes("view"),
      userAdd: userRole?.userModule?.split(",").includes("add"),
      userEdit: userRole?.userModule?.split(",").includes("edit"),
      userDelete: userRole?.userModule?.split(",").includes("delete"),
      userView: userRole?.userModule?.split(",").includes("view"),
      userChangeStatus: userRole?.userModule
        ?.split(",")
        .includes("changeStatus"),
      committeeAdd: userRole?.committeeModule?.split(",").includes("add"),
      committeeEdit: userRole?.committeeModule?.split(",").includes("edit"),
      committeeDelete: userRole?.committeeModule?.split(",").includes("delete"),
      committeeView: userRole?.committeeModule?.split(",").includes("view"),
      committeeChangeStatus: userRole?.committeeModule
        ?.split(",")
        .includes("changeStatus"),

      committeeTypeAdd: userRole?.committeeTypeModule
        ?.split(",")
        .includes("add"),
      committeeTypeEdit: userRole?.committeeTypeModule
        ?.split(",")
        .includes("edit"),
      committeeTypeDelete: userRole?.committeeTypeModule
        ?.split(",")
        .includes("delete"),
      committeeTypeView: userRole?.committeeTypeModule
        ?.split(",")
        .includes("view"),
      committeeTypeChangeStatus: userRole?.committeeTypeModule
        ?.split(",")
        .includes("changeStatus"),

      notificationRead: userRole?.notificationModule
        ?.split(",")
        .includes("read"),
      notificationDelete: userRole?.notificationModule
        ?.split(",")
        .includes("delete"),
      notificationView: userRole?.notificationModule
        ?.split(",")
        .includes("view"),

      inventoryAdd: userRole?.inventoryModule?.split(",").includes("add"),
      inventoryIncrease: userRole?.inventoryModule
        ?.split(",")
        .includes("increase"),
      inventoryDecrease: userRole?.inventoryModule
        ?.split(",")
        .includes("decrease"),
      inventoryView: userRole?.inventoryModule?.split(",").includes("view"),
      inventoryPendingAmenityView: userRole?.inventoryModule
        ?.split(",")
        .includes("pendingAmenityView"),
      inventoryPendingFoodBeverageView: userRole?.inventoryModule
        ?.split(",")
        .includes("pendingFoodBeverageView"),
      inventoryPendingAmenityStatus: userRole?.inventoryModule
        ?.split(",")
        .includes("pendingAmenityStatus"),
      inventoryPendingFoodBeverageStatus: userRole?.inventoryModule
        ?.split(",")
        .includes("pendingFoodBeverageStatus"),

      committeeMemberDelete: userRole?.committeeMemberModule
        ?.split(",")
        .includes("delete"),
      committeeMemberView: userRole?.committeeMemberModule
        ?.split(",")
        .includes("view"),
      committeeMemberAdd: userRole?.committeeMemberModule
        ?.split(",")
        .includes("add"),
      amenitiesAdd: userRole?.amenitiesModule?.split(",").includes("add"),
      amenitiesEdit: userRole?.amenitiesModule?.split(",").includes("edit"),
      amenitiesDelete: userRole?.amenitiesModule?.split(",").includes("delete"),
      amenitiesView: userRole?.amenitiesModule?.split(",").includes("view"),
      amenitiesChangeStatus: userRole?.amenitiesModule
        ?.split(",")
        .includes("changeStatus"),

      servicesAdd: userRole?.servicesModule?.split(",").includes("add"),
      servicesEdit: userRole?.servicesModule?.split(",").includes("edit"),
      servicesDelete: userRole?.servicesModule?.split(",").includes("delete"),
      servicesView: userRole?.servicesModule?.split(",").includes("view"),
      servicesChangeStatus: userRole?.servicesModule
        ?.split(",")
        .includes("changeStatus"),

      roomAdd: userRole?.roomModule?.split(",").includes("add"),
      roomEdit: userRole?.roomModule?.split(",").includes("edit"),
      roomDelete: userRole?.roomModule?.split(",").includes("delete"),
      roomView: userRole?.roomModule?.split(",").includes("view"),
      roomGallery: userRole?.roomModule?.split(",").includes("gallery"),
      roomAmenities: userRole?.roomModule?.split(",").includes("amenities"),
      roomFoodBeverage: userRole?.roomModule
        ?.split(",")
        .includes("foodbeverage"),
      roomBarcode: userRole?.roomModule?.split(",").includes("barcode"),
      roomSanitization: userRole?.roomModule
        ?.split(",")
        .includes("sanitization"),
      roomAddMeeting: userRole?.roomModule?.split(",").includes("addMeeting"),

      locationAdd: userRole?.locationModule?.split(",").includes("add"),
      locationEdit: userRole?.locationModule?.split(",").includes("edit"),
      locationDelete: userRole?.locationModule?.split(",").includes("delete"),
      locationView: userRole?.locationModule?.split(",").includes("view"),
      locationChangeStatus: userRole?.locationModule
        ?.split(",")
        .includes("changeStatus"),

      meetingLogsEdit: userRole?.meetingLogsModule?.split(",").includes("edit"),
      meetingLogsView: userRole?.meetingLogsModule?.split(",").includes("view"),
      meetingLogsPostpone: userRole?.meetingLogsModule
        ?.split(",")
        .includes("postpone"),
      meetingLogsCancel: userRole?.meetingLogsModule
        ?.split(",")
        .includes("cancel"),
      meetingLogsApproval: userRole?.meetingLogsModule
        ?.split(",")
        .includes("approval"),

      foodBeverageAdd: userRole?.foodBeverageModule?.split(",").includes("add"),
      foodBeverageEdit: userRole?.foodBeverageModule
        ?.split(",")
        .includes("edit"),
      foodBeverageDelete: userRole?.foodBeverageModule
        ?.split(",")
        .includes("delete"),
      foodBeverageView: userRole?.foodBeverageModule
        ?.split(",")
        .includes("view"),
      foodBeverageChangeStatus: userRole?.foodBeverageModule
        ?.split(",")
        .includes("changeStatus"),
      reportView: userRole?.reportModule?.split(",").includes("view"),

      userRoleAdd: userRole?.userRoleModule?.split(",").includes("add"),
      userRoleEdit: userRole?.userRoleModule?.split(",").includes("edit"),
      userRoleDelete: userRole?.userRoleModule?.split(",").includes("delete"),
      userRoleView: userRole?.userRoleModule?.split(",").includes("view"),
      userRoleChangeStatus: userRole?.userRoleModule
        ?.split(",")
        .includes("changeStatus"),
      isAdmin: userRole?.isAdmin,
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
      userChangeStatus: Yup.boolean().optional(),
      committeeAdd: Yup.boolean().optional(),
      committeeEdit: Yup.boolean().optional(),
      committeeDelete: Yup.boolean().optional(),
      committeeView: Yup.boolean().optional(),
      committeeChangeStatus: Yup.boolean().optional(),

      committeeTypeAdd: Yup.boolean().optional(),
      committeeTypeEdit: Yup.boolean().optional(),
      committeeTypeDelete: Yup.boolean().optional(),
      committeeTypeView: Yup.boolean().optional(),
      committeeTypeChangeStatus: Yup.boolean().optional(),

      notificationRead: Yup.boolean().optional(),
      notificationDelete: Yup.boolean().optional(),
      notificationView: Yup.boolean().optional(),

      inventoryAdd: Yup.boolean().optional(),
      inventoryIncrease: Yup.boolean().optional(),
      inventoryDecrease: Yup.boolean().optional(),
      inventoryView: Yup.boolean().optional(),
      inventoryPendingAmenityView: Yup.boolean().optional(),
      inventoryPendingFoodBeverageView: Yup.boolean().optional(),
      inventoryPendingAmenityStatus: Yup.boolean().optional(),
      inventoryPendingFoodBeverageStatus: Yup.boolean().optional(),

      committeeMemberDelete: Yup.boolean().optional(),
      committeeMemberView: Yup.boolean().optional(),
      committeeMemberAdd: Yup.boolean().optional(),

      amenitiesAdd: Yup.boolean().optional(),
      amenitiesEdit: Yup.boolean().optional(),
      amenitiesDelete: Yup.boolean().optional(),
      amenitiesView: Yup.boolean().optional(),
      amenitiesChangeStatus: Yup.boolean().optional(),

      servicesAdd: Yup.boolean().optional(),
      servicesEdit: Yup.boolean().optional(),
      servicesDelete: Yup.boolean().optional(),
      servicesView: Yup.boolean().optional(),
      servicesChangeStatus: Yup.boolean().optional(),

      roomAdd: Yup.boolean().optional(),
      roomEdit: Yup.boolean().optional(),
      roomDelete: Yup.boolean().optional(),
      roomView: Yup.boolean().optional(),
      roomGallery: Yup.boolean().optional(),
      roomAmenities: Yup.boolean().optional(),
      roomFoodBeverage: Yup.boolean().optional(),
      roomBarcode: Yup.boolean().optional(),
      roomSanitization: Yup.boolean().optional(),
      roomAddMeeting: Yup.boolean().optional(),

      locationAdd: Yup.boolean().optional(),
      locationEdit: Yup.boolean().optional(),
      locationDelete: Yup.boolean().optional(),
      locationView: Yup.boolean().optional(),

      meetingLogsEdit: Yup.boolean().optional(),
      meetingLogsView: Yup.boolean().optional(),
      meetingLogsPostpone: Yup.boolean().optional(),
      meetingLogsCancel: Yup.boolean().optional(),
      meetingLogsApproval: Yup.boolean().optional(),

      locationChangeStatus: Yup.boolean().optional(),
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
          committeeTypeModule: userRoleStringManipulation(
            values.committeeTypeAdd,
            values.committeeTypeEdit,
            values.committeeTypeDelete,
            values.committeeTypeView,
            values.committeeTypeChangeStatus
          ),
          notificationModule: notificationStringManipulation(
            false,
            values.notificationRead,
            values.notificationDelete,
            values.notificationView,
            false,
            false
          ),
          inventoryModule: inventoryStringManipulation(
            values.inventoryAdd,
            values.inventoryView,
            values.inventoryIncrease,
            values.inventoryDecrease,
            values.inventoryPendingAmenityView,
            values.inventoryPendingAmenityStatus,
            values.inventoryPendingFoodBeverageView,
            values.inventoryPendingFoodBeverageStatus
          ),
          committeeMemberModule: userRoleStringManipulation(
            values.committeeMemberAdd,
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
            values.roomSanitization,
            values.roomAddMeeting
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
        dispatch(showLoading());
        await axios.put(`api/v1/user-type/edit/${userRole.uid}`, submittedData);
        toast.success("User role update Successfully");
        resetForm(); // Reset form after successful submission
        goBack();
        dispatch(hideLoading());
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
        Update User Role
      </Typography>
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

                  formik.setFieldValue("committeeTypeAdd", "");
                  formik.setFieldValue("committeeTypeEdit", "");
                  formik.setFieldValue("committeeTypeDelete", "");
                  formik.setFieldValue("committeeTypeView", true);
                  formik.setFieldValue("committeeTypeChangeStatus", true);

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", true);
                  formik.setFieldValue("committeeMemberAdd", true);

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
                  formik.setFieldValue("roomAddMeeting", "");

                  formik.setFieldValue("locationAdd", "");
                  formik.setFieldValue("locationEdit", "");
                  formik.setFieldValue("locationDelete", "");
                  formik.setFieldValue("locationView", "");

                  formik.setFieldValue("meetingLogsEdit", "");
                  formik.setFieldValue("meetingLogsView", "");
                  formik.setFieldValue("meetingLogsPostpone", "");
                  formik.setFieldValue("meetingLogsCancel", "");
                  formik.setFieldValue("meetingLogsApproval", "");

                  formik.setFieldValue("locationChangeStatus", "");
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

                  formik.setFieldValue("committeeTypeAdd", true);
                  formik.setFieldValue("committeeTypeEdit", true);
                  formik.setFieldValue("committeeTypeDelete", true);
                  formik.setFieldValue("committeeTypeView", true);
                  formik.setFieldValue("committeeTypeChangeStatus", true);

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("inventoryAdd", true);
                  formik.setFieldValue("inventoryView", true);
                  formik.setFieldValue("inventoryIncrease", true);
                  formik.setFieldValue("inventoryDecrease", true);
                  formik.setFieldValue("inventoryPendingAmenityView", true);
                  formik.setFieldValue(
                    "inventoryPendingFoodBeverageView",
                    true
                  );
                  formik.setFieldValue("inventoryPendingAmenityStatus", true);
                  formik.setFieldValue(
                    "inventoryPendingFoodBeverageStatus",
                    true
                  );

                  formik.setFieldValue("committeeMemberDelete", true);
                  formik.setFieldValue("committeeMemberView", true);
                  formik.setFieldValue("committeeMemberAdd", true);

                  formik.setFieldValue("amenitiesAdd", true);
                  formik.setFieldValue("amenitiesEdit", true);
                  formik.setFieldValue("amenitiesDelete", true);
                  formik.setFieldValue("amenitiesView", true);
                  formik.setFieldValue("amenitiesChangeStatus", true);

                  formik.setFieldValue("servicesAdd", true);
                  formik.setFieldValue("servicesEdit", true);
                  formik.setFieldValue("servicesDelete", true);
                  formik.setFieldValue("servicesView", true);
                  formik.setFieldValue("servicesChangeStatus", true);

                  formik.setFieldValue("roomAdd", true);
                  formik.setFieldValue("roomEdit", true);
                  formik.setFieldValue("roomDelete", true);
                  formik.setFieldValue("roomView", true);
                  formik.setFieldValue("roomGallery", true);
                  formik.setFieldValue("roomAmenities", true);
                  formik.setFieldValue("roomFoodBeverage", true);
                  formik.setFieldValue("roomBarcode", true);
                  formik.setFieldValue("roomSanitization", true);
                  formik.setFieldValue("roomAddMeeting", true);

                  formik.setFieldValue("locationAdd", true);
                  formik.setFieldValue("locationEdit", true);
                  formik.setFieldValue("locationDelete", true);
                  formik.setFieldValue("locationView", true);

                  formik.setFieldValue("meetingLogsEdit", true);
                  formik.setFieldValue("meetingLogsView", true);
                  formik.setFieldValue("meetingLogsPostpone", true);
                  formik.setFieldValue("meetingLogsCancel", true);
                  formik.setFieldValue("meetingLogsApproval", true);

                  formik.setFieldValue("locationChangeStatus", true);
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

                  formik.setFieldValue("committeeTypeAdd", "");
                  formik.setFieldValue("committeeTypeEdit", "");
                  formik.setFieldValue("committeeTypeDelete", "");
                  formik.setFieldValue("committeeTypeView", true);
                  formik.setFieldValue("committeeTypeChangeStatus", true);

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", true);
                  formik.setFieldValue("committeeMemberAdd", true);

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
                  formik.setFieldValue("roomAddMeeting", "");

                  formik.setFieldValue("locationAdd", "");
                  formik.setFieldValue("locationEdit", "");
                  formik.setFieldValue("locationDelete", "");
                  formik.setFieldValue("locationView", "");

                  formik.setFieldValue("meetingLogsEdit", "");
                  formik.setFieldValue("meetingLogsView", "");
                  formik.setFieldValue("meetingLogsPostpone", "");
                  formik.setFieldValue("meetingLogsCancel", "");
                  formik.setFieldValue("meetingLogsApproval", "");

                  formik.setFieldValue("locationChangeStatus", "");
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

                  formik.setFieldValue("committeeTypeAdd", "");
                  formik.setFieldValue("committeeTypeEdit", "");
                  formik.setFieldValue("committeeTypeDelete", "");
                  formik.setFieldValue("committeeTypeView", "");
                  formik.setFieldValue("committeeTypeChangeStatus", "");

                  formik.setFieldValue("notificationRead", true);
                  formik.setFieldValue("notificationDelete", true);
                  formik.setFieldValue("notificationView", true);

                  formik.setFieldValue("inventoryAdd", true);
                  formik.setFieldValue("inventoryView", true);
                  formik.setFieldValue("inventoryIncrease", true);
                  formik.setFieldValue("inventoryDecrease", true);
                  formik.setFieldValue("inventoryPendingAmenityView", true);
                  formik.setFieldValue(
                    "inventoryPendingFoodBeverageView",
                    true
                  );
                  formik.setFieldValue("inventoryPendingAmenityStatus", true);
                  formik.setFieldValue(
                    "inventoryPendingFoodBeverageStatus",
                    true
                  );

                  formik.setFieldValue("committeeMemberDelete", "");
                  formik.setFieldValue("committeeMemberView", "");
                  formik.setFieldValue("committeeMemberAdd", "");

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
                  formik.setFieldValue("roomAddMeeting", "");

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
              { name: "committeeMemberAdd", label: "Add" },
              { name: "committeeMemberDelete", label: "Delete" },
            ],
          },
          {
            title: "Meeting Notification",
            permissions: [
              { name: "notificationView", label: "View" },
              { name: "notificationDelete", label: "Delete" },
              { name: "notificationRead", label: "Read" },
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
              {
                name: "inventoryPendingAmenityView",
                label: "Pending Amenity View",
              },
              {
                name: "inventoryPendingFoodBeverageView",
                label: "Pending FoodBeverage View",
              },
              {
                name: "inventoryPendingAmenityStatus",
                label: "Pending Amenity Status",
              },
              {
                name: "inventoryPendingFoodBeverageStatus",
                label: "Pending FoodBeverage Status",
              },
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
            title: "CommitteeType",
            permissions: [
              { name: "committeeTypeView", label: "View" },
              { name: "committeeTypeDelete", label: "Delete" },
              { name: "committeeTypeAdd", label: "Add" },
              { name: "committeeTypeEdit", label: "Edit" },
              { name: "committeeTypeChangeStatus", label: "Status" },
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
              { name: "roomAddMeeting", label: "addMeeting" },
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
        <FormButton type="submit" btnName="Update User Role" />
      </Box>
    </PaperWrapper>
  );
};

export default EditUserTypeSettings;
