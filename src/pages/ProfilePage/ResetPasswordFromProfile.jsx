import React, { useState } from "react";
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
import { Visibility,VisibilityOff } from "../../components/Common/CustomButton/CustomIcon";

const ResetPasswordFromProfile = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Function to check password strength
  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;
    return score;
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      password: Yup.string()
        .min(10, "Password should be at least 10 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[\W_]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(
          "api/v1/user/profile-reset-password",
          {
            oldPassword: values.oldPassword,
            newPassword: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        toast.success("Password Reset Successfully");
        resetForm();
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const passwordStrength = calculateStrength(formik.values.password);
  const progress = (passwordStrength / 5) * 100;

  // Set the color of the progress bar based on the password strength
  const getProgressBarColor = () => {
    if (passwordStrength <= 1) return "error"; // Red for weak
    if (passwordStrength === 2 || passwordStrength === 3) return "warning"; // Orange for medium
    if (passwordStrength >= 4) return "success"; // Green for strong
    return "primary"; // Default if no strength
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {/* Old Password */}
        <TextField
          label="Old Password"
          name="oldPassword"
          type={showOldPassword ? "text" : "password"}
          fullWidth
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
          }
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowOldPassword}>
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginTop: 2 }}
          size="small"
        />

        {/* New Password */}
        <TextField
          label="New Password"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2, marginTop: 2 }}
          size="small"
        />

        {/* Confirm New Password */}
        <TextField
          label="Confirm New Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowConfirmPassword}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
        />

        {/* Password Strength Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ marginTop: "10px", height: "8px" }}
          color={getProgressBarColor()}
        />
        <Typography variant="body2" color="textSecondary">
          <strong>Password Strength: </strong>
          {passwordStrength === 0
            ? "Too weak"
            : passwordStrength <= 2
              ? "Weak"
              : passwordStrength === 3
                ? "Medium"
                : passwordStrength === 4
                  ? "Strong"
                  : "Very Strong"}
        </Typography>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: "10px" }}
          disabled={formik.isSubmitting}
        >
          Submit
        </Button>
      </form>

      {/* Password Rules */}
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginTop: "13px" }}
      >
        <ul>
          <li>Password should be at least 10 characters</li>
          <li>It must contain at least one uppercase letter</li>
          <li>It must contain at least one lowercase letter</li>
          <li>It must contain at least one number</li>
          <li>It must contain at least one special character</li>
        </ul>
      </Typography>
    </>
  );
};

export default ResetPasswordFromProfile;
