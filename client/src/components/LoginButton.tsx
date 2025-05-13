import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import LoginForm from "./LoginForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StyledButton from "./StyledButton";

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledButton variant="contained" onClick={handleClick} color="primary">
        {isAuthenticated ? "Your Profile" : "Login"}
      </StyledButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            },
        }}
      >
        <DialogContent>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
