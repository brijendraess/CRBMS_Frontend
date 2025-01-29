import React, { useState } from "react";
import "./Login.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Input from "../../components/Common/Input/Input";
import { Mail, Lock } from "../../components/Common/Buttons/CustomIcon";

const RoomLogin = () => {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(room, password);
  };
  return (
    <div className="authWrapper">
      <motion.div
        className="userLogin"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ padding: 8 }}>
          <h2 className="heading">Room Login</h2>
          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Room Name"
              value={room}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="loginButtonBox">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="loginButton"
                type="submit"
              >
                Login
              </motion.button>
            </div>
          </form>
        </div>
        <div className="roomLoginMessage">
          <p className="roomLoginText">
            <Link to="/login" className="roomLoginLink">
              User Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomLogin;
