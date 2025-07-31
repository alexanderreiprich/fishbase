import { Box, Divider } from "@mui/material";
import CreateAquariumForm from "../components/CreateAquariumForm";
import UpdateAquariumForm from "../components/UpdateAquariumForm";
import "../style/theme.css";

const AquariumPage: React.FC = () => {
  return (
    <Box sx={{ borderColor: "var(--primary-main)", p: 2 }}>
      <CreateAquariumForm />
      <Divider sx={{ padding: 2 }} />
      <UpdateAquariumForm />
    </Box>
  );
};

export default AquariumPage;
