import React, { useState } from "react";
import "./Login.css";
import { motion } from "framer-motion";
import ebizLogo from "../../assets/Images/ebizlogo.png";
import Input from "../../components/Common/Input/Input";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { ArrowLeft, Mail} from "../../components/Common/Buttons/CustomIcon";
import {
  Button,
} from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/user/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(`Link Sent Successfully`);
        setIsSubmitted(true);
      } else {
        setIsSubmitted(false);
        toast.error("Failed to send reset link.");
      }
    } catch (error) {
      setIsSubmitted(false);
      dispatch(hideLoading());
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.log(errorMessage);
    }
  };

  return (
    <div className="authWrapper">
      <motion.div
        className="userLogin"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ padding: 10 }}>
          <h2 className="heading">Forgot Password</h2>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="loginButtonBox">
              <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, width:"50%" }}
          >
             Send Reset Link
          </Button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: "center" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  display: "flex",
                  borderRadius: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Mail fontSize="large" sx={{ color: "#fff" }} />
              </motion.div>
              <p>
                If an account exists for <u>{email}</u>, you will receive a
                password reset link shortly.
              </p>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "16px 32px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            to="/login"
            underline="hover"
            style={{
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowLeft /> Back to Login
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            height: "100%",
            alignItems: "center",
            gap: 5,
          }}
        >
          <i>powered by</i>
          <div style={{ objectFit: "cover", width: "75px", height: "40px" }}>
            <img src={ebizLogo} style={{ mixBlendMode: "color-burn" }} alt="Ebiz logo" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
