import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import "../style/ProfilePicture.css";
import { User } from "../interfaces/User";
import { useNavigate } from "react-router-dom";

export default function UserCard({ user }: { user: User }) {
  const navigate = useNavigate();

  return (
    <Card variant="outlined">
      <CardMedia
        image={user.profile_image ? URL.createObjectURL(user.profile_image) : "/images/default_profile_image.png"}
        title={user.username}
        sx={{ height: 140 }}
      />
      <CardContent>
				<Typography gutterBottom variant="h5">
          {user.username}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => navigate(`/users/profile/${user.id}`)}>Ansehen</Button>
      </CardActions>
    </Card>
  );
}
