import React, { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import RegisterForm from "./RegisterForm";
import StyledButton from "./StyledButton";

export default function RegisterButton(){
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <StyledButton onClick={handleClickOpen} color="secondary">
        Register
      </StyledButton>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogContent>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};