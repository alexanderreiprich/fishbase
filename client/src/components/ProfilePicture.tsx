import { useAuth } from "../context/AuthContext";
import "../style/ProfilePicture.css";
import { useNavigate } from "react-router-dom";

export default function ProfilePicture(){
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };



  // Base64-String zu Blob konvertieren
  const getImageSrc = () => {
    if (!user?.picture) {
      return "/images/default_profile_image.png";
    }
    
    if (typeof user.picture === 'string') {
      // Base64-String zu Blob konvertieren
      const byteCharacters = atob(user.picture);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    }
    
    // Falls es bereits ein Blob ist
    return URL.createObjectURL(user.picture);
  };

  return (
    <img
      src={getImageSrc()}
      alt="Profilbild"
      className="profile-picture"
      onClick={handleClick}
    />
  );
};
