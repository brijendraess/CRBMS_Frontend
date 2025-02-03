import React, { useEffect, useState } from "react";
import { TextField, Button, Avatar, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../Redux/alertSlicer";
import { PhotoCameraOutlinedIcon } from "../../components/Common/Buttons/CustomIcon";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import EditProfile from "./EditProfile";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";

const ProfilePage = ({ user, committees = [] }) => {
  const dispatch = useDispatch();
  const [refreshPage, setRefreshPage] = useState(0);
  const [updatedId, setUpdatedId] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    fullname: user?.fullname || "",
    avatarPath: user?.avatarPath || "",
    committees: user?.committees || [],
  });

  const [imagePreview, setImagePreview] = useState(
    user?.avatarPath
      ? `${import.meta.env.VITE_API_URL}/${user?.avatarPath}`
      : null
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(`/api/v1/user/${user?.id}`);
        const result = response.data.data;

        setFormData({
          id: result.id || "",
          email: result.email || "",
          phoneNumber: result.phoneNumber || "",
          fullname: result.fullname || "",
          avatarPath: result.avatarPath || "",
          committees: result.committees || [],
        });

        setImagePreview(
          result.avatarPath
            ? `${import.meta.env.VITE_API_URL}/${result.avatarPath}`
            : null
        );
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        dispatch(hideLoading());
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id, dispatch, refreshPage]);

  const handleEdit = (id) => {
    setUpdatedId(id);
    setIsEditOpen(true);
  };

  return (
    <PopContent>
      <form>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField label="Email" value={formData.email} fullWidth disabled />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              fullWidth
              disabled
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              fullWidth
              disabled
            />
          </Grid>
          <Grid
            size={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <label htmlFor="avatar-upload">
              <IconButton component="span" color="primary">
                <Avatar
                  src={imagePreview}
                  alt="Profile Picture"
                  sx={{ width: 100, height: 100 }}
                >
                  <PhotoCameraOutlinedIcon fontSize="large" />
                </Avatar>
              </IconButton>
            </label>
          </Grid>
          <Grid
            size={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormButton type='button' btnName='Click To Update Your Profile' func={() => handleEdit(formData.id)} />
          </Grid>
        </Grid>
        <NewPopUpModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          title={"Update My Profile"}
          modalBody={
            <EditProfile
              id={updatedId}
              setRefreshPage={setRefreshPage}
              setIsEditOpen={setIsEditOpen}
            />
          }
        />
      </form>
    </PopContent>
  );
};

export default ProfilePage;
