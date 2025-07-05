import { useAuth } from "../context/AuthContext";
import "../style/ProfilePicture.css";
import { useNavigate } from "react-router-dom";

export default function ProfilePicture(){
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <img
      src={user?.profile_image ? URL.createObjectURL(user?.profile_image) : "/images/default_profile_image.png"}
      alt="Profilbild"
      className="profile-picture"
      onClick={handleClick}
    />
  );
};
