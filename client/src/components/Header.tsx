import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfilePicture from "./ProfilePicture";
import "../style/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          className="logo"
          onClick={() => navigate("/")}
        >
          fishbase
        </Typography>

        <Box className="navigation-container">
          <Button color="inherit" onClick={() => navigate("/search")}>
            Suche
          </Button>
          <Button color="inherit" onClick={() => navigate("/community")}>
            Community
          </Button>
          <Button color="inherit" onClick={() => navigate("/create")}>
            Aquarien
          </Button>
        </Box>

        {user && (
          <Box 
            className="user-container"
            onClick={handleProfileClick}
          >
            <Typography variant="body1">{user.username}</Typography>
            <ProfilePicture />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
