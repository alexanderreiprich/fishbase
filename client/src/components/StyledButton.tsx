import React from "react";
import { Button, styled } from "@mui/material";

type ButtonColor = "primary" | "secondary" | "error" | "info" | "success" | "warning";

interface StyledButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: ButtonColor;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const StyledButton = styled(Button)<{ buttonColor: ButtonColor }>(({ theme, buttonColor }) => ({
  backgroundColor: theme.palette[buttonColor].main,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette[buttonColor].dark,
  },
}));

const StyledButtonComponent: React.FC<StyledButtonProps> = ({
  variant = "contained",
  color = "primary",
  onClick,
  children,
  className,
}) => {
  return (
    <StyledButton
      variant={variant}
      buttonColor={color}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

export default StyledButtonComponent;
