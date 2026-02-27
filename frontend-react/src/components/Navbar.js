import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={navStyle}>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        🛡️ ResumeGuard AI
      </div>
      <div>
        <Link style={linkStyle} to="/">Home</Link>
        <Link style={linkStyle} to="/upload">Upload</Link>
        <Link style={linkStyle} to="/admin">Admin</Link>
      </div>
    </div>
  );
}

const navStyle = {
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(10px)",
  padding: "15px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white"
};

const linkStyle = {
  color: "white",
  marginLeft: "20px",
  textDecoration: "none",
  fontWeight: "500"
};

export default Navbar;