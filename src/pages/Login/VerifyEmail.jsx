import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import ebizLogo from "../../assets/Images/ebizlogo.png";
import "./Login.css";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const VerifyEmail = () => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const verifyLoginEmail = useSelector(
    (state) => state.verifyLoginEmail.verifyLoginEmail
  );

  // If email is not in Redux, try to get it from localStorage
  useEffect(() => {
    dispatch(showLoading());
    if (!verifyLoginEmail) {
      const savedEmail = localStorage.getItem("verifyLoginEmail");
      if (savedEmail) {
        dispatch(setLoginEmail(savedEmail));
      } else {
        navigate("/dashboard");
        toast.error("Please login first");
      }
    }
    dispatch(hideLoading());
  }, [verifyLoginEmail, dispatch, navigate]);

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d+$/.test(pastedData)) {
      const pastedArray = pastedData.slice(0, 6).split("");
      const newOTP = Array(6).fill("");
      pastedArray.forEach((digit, index) => {
        if (index < 6) newOTP[index] = digit;
      });
      setOTP(newOTP);
      // Focus the next empty input or the last input
      const lastFilledIndex = newOTP.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    console.log(verifyLoginEmail);

    if (e) e.preventDefault();
    const verificationCode = otp.join("");

    if (!verifyLoginEmail) {
      toast.error("Email not found. Please login again");
      navigate("/login");
      return;
    }

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/user/verify-otp",
        { verifyLoginEmail, verificationCode },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const fullname = response.data.data?.user?.fullname || "User";
        navigate("/home", {
          state: response.data?.data?.user?.UserType?.isAdmin,
        });
        toast.success(`Welcome Back, ${fullname}`);
        // toast.success(`${fullname}, You Have 4 New Meeting Notifications`);
        // Clear stored email after successful verification
        localStorage.removeItem("verifyLoginEmail");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);

      toast.error(error.response?.data?.message || "Wrong OTP");
    }
  };

  const handleResendOTP = async () => {
    if (!verifyLoginEmail) {
      toast.error("Email not found. Please login again");
      navigate("/login");
      return;
    }

    console.log(verifyLoginEmail);

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/user/resend-otp",
        { email: verifyLoginEmail },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("OTP resent successfully");
        setIsResendDisabled(true);
        setTimer(60);
        setOTP(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      setIsResendDisabled(false);
    }
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [otp]);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(intervalId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  return (
    <div className="authWrapper">
      <motion.div
        className="userLogin"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="heading">Verify Your Email</h2>
          <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
            <div className="d-flex justify-content-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="otpInput"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <div className="loginButtonBox" style={{ margin: "20px 0px" }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }}
                className="loginButton"
                type="submit"
              >
                Verify OTP
              </motion.button>
            </div>
          </form>
        </div>
        <div className="roomLoginMessage">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            className="loginButton"
            onClick={handleResendOTP}
            disabled={isResendDisabled}
            style={{ width: "200px", fontWeight: "500" }}
          >
            {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
