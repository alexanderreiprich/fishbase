import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PersonalProfilePage from "./pages/PersonalProfilePage";
import theme from "./theme";
import Home from "./pages/Home";
import Header from "./components/Header";
import SearchPage from "./pages/SearchPage";
import ListPage from "./pages/ListPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import CreateAquariumForm from "./components/CreateAquariumForm";
import AquariumPage from "./pages/AquariumPage";
import AddInhabitantsPage from "./pages/AddInhabitantsPage";
import AquariumEditForm from "./components/AquariumEditForm";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/profile/:userId"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PersonalProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <AquariumPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddInhabitantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit"
              element={
                <ProtectedRoute>
                  <AquariumEditForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <ListPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
