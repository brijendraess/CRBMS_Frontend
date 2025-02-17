import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { DeleteOutlineOutlinedIcon, Visibility, VisibilityOff } from "../../components/Common/Buttons/CustomIcon";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";
import CustomButton from "../../components/Common/Buttons/CustomButton";

const SyncZimbraCalendar = ({user, isOpen}) => {

  const [localUser, setLocalUser] = useState(user);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/v1/user/${localUser?.id}`);
      setLocalUser(response.data?.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserData(); // Fetch user data when the modal is open
    }
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      zimbraUsername: "",
      zimbraPassword: "",
    },
    validationSchema: Yup.object({
      zimbraPassword: Yup.string().required("Zimbra username is required."),
      zimbraUsername: Yup.string().required("Zimbra password is required."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const formData = new FormData();
      formData.append("zimbraUsername", values.zimbraUsername);
        formData.append("zimbraPassword", values.zimbraPassword);

      try {
        const response = await axios.put(
          "api/v1/user/zimbra/sync/" + localUser?.id,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        toast.success("Synced Successfully");
        resetForm();
        await fetchUserData();
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const unsyncZimbra = async () => {
    try {
      const response = await axios.put(
        "api/v1/user/zimbra/unsync/" + localUser?.id,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Unsynced Successfully");
      await fetchUserData();
    } catch (error) {
      console.error(error);
    }
  }

  
  return (
    <PopContent>
      {localUser?.zimbraUsername != null && localUser?.zimbraPassword != null ? 
        
        <>
          <h5>Zimbra Calendar already synced.</h5>
          <Button variant="outlined" onClick={unsyncZimbra}>
            Unsync
          </Button>
        </> 
      : 
        <>
          <form onSubmit={formik.handleSubmit}>
            {/* Old Password */}
            <TextField
              label="Zimbra Username"
              name="zimbraUsername"
              value={formik.values.zimbraUsername}
              onChange={formik.handleChange}
              error={formik.touched.zimbraUsername && Boolean(formik.errors.zimbraUsername)}
              helperText={formik.touched.zimbraUsername && formik.errors.zimbraUsername}
              // style={{ flex: 1 }}
              fullWidth
              size="small"
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Zimbra Password"
              name="zimbraPassword"
              value={formik.values.zimbraPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.zimbraPassword && Boolean(formik.errors.zimbraPassword)
              }
              fullWidth
              helperText={formik.touched.zimbraPassword && formik.errors.zimbraPassword}
              size="small"
              sx={{ marginTop: 2, marginBottom: 2 }}
            // style={{ flex: 1 }}
            />
            {/* Submit Button */}

            <FormButton type='submit' btnName='Sync Zimbra Calendar' />

          </form>
        </>  
      }

    </PopContent>
  );
};

export default SyncZimbraCalendar;
