import React from "react";
import './Input.css'
const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="inputWrapper">
      <div className="iconWrapper">
        <Icon className="inputIcon" style={{ color: "#fff", width:'20px', height:'20px' }} />
      </div>
      <input {...props} className="inputField" />
    </div>
  );
};

export default Input;
