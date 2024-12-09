import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Function to check password strength
  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;
    return score;
  };

  // Formik form and validation
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password should be at least 8 characters")
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
    onSubmit: (values) => {
      // Handle form submission logic here
      console.log("Form Submitted:", values);
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
        <TextField
          label="Password"
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
        />
        <TextField
          label="Confirm Password"
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
        />
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ marginTop: "10px", height: "8px" }}
          color={getProgressBarColor()}
        />
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: "5px" }}
        >
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "20px" }}
        >
          Submit
        </Button>
      </form>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginTop: "15px" }}
      >
        <ul>
          <li>Password should be at least 8 characters</li>
          <li>It must contain at least one uppercase letter</li>
          <li>It must contain at least one lowercase letter</li>
          <li>It must contain at least one number</li>
          <li>It must contain at least one special character</li>
        </ul>
      </Typography>
    </>
  );
};

export default ResetPassword;
