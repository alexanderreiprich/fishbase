import React from "react";
import "../style/Home.css";
import { useNavigate } from "react-router-dom";
import StyledButton from "../components/StyledButton";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>fishbase</h1>
      <h3>blubb blubb</h3>
      <div className="home-buttons">
        <StyledButton
          variant="contained"
          onClick={() => navigate("/create")}
          color="primary"
        >
          Aquarium erstellen
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={() => navigate("/profile")}
          color="primary"
        >
          Dein Profil
        </StyledButton>
      </div>
    </div>
  );
};

export default Home;
