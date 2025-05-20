import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StyledButton from "./StyledButton";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <StyledButton
      onClick={handleLogout}
      className="logout-button"
    >
      Logout
    </StyledButton>
  );
};

