import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Common/Input/Input";
import toast from "react-hot-toast";
import axios from "axios";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch } from "react-redux";
import "./Login.css";
import { Button, Typography } from "@mui/material";
import { Lock } from "../../components/Common/Buttons/CustomIcon";
import { isPasswordValid } from "../../utils/utils";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading());
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      dispatch(hideLoading());
      return;
    }

    if(!isPasswordValid(password)){
      toast.error("Passwords does not match the requirements.");
      dispatch(hideLoading());
      return;
    }
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/v1/user/reset-password/${token}`,
        { password }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(
          "Password reset successfully, redirecting to login page..."
        );
      }

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="authWrapper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="userLogin"
      >
        <div className="p-8">
          <h2 className="heading">Reset Password</h2>
          {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>} */}

          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="loginButtonBox">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2, width: "50%" }}
              >
                Set New Password
              </Button>
            </div>
          </form>
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
        </div>
      </motion.div>
    </div>
  );
};
export default ResetPassword;
