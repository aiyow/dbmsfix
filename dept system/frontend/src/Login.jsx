import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Box,
  InputAdornment,
  IconButton,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/login", {
      username,
      password,
    });

    const { token, role: userRole, username: userName } = response.data;

    if (!token || !userRole) {
      alert("Invalid login response. Please try again.");
      return;
    }

    // Save session
    localStorage.setItem("token", token);
    localStorage.setItem("username", userName);
    localStorage.setItem("role", userRole);

    const normalizedRole = userRole.trim().toLowerCase();
    console.log("Token:", token);
    console.log("User Role (raw):", userRole);
    console.log("User Role (normalized):", normalizedRole);
    console.log("Username:", userName);
    // Role-based redirection
    switch (normalizedRole) {
      case "admin":
      case "manager":
        navigate("/admin");
        break;
      case "staff":
      case "employee":
        navigate("/staff");
        break;
      case "customer":
        navigate("/customer");
        break;
      default:
        alert("Unrecognized role: " + userRole);
        localStorage.clear(); // clear to avoid bad session
        break;
    }
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
    console.error("Login error:", error);
  }
};
// -------------------------THIS IS FOR CSS STYLING
  return (
    <Box
      sx={{
        backgroundColor: "#3c5372",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#a3a8f0",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: 6,
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          SIGN IN
        </Typography>

        <TextField
          label="Email/Username"
          fullWidth
          margin="dense"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 2,
            backgroundColor: "#3e3c3c",
            color: "#fff",
            fontSize: "18px",
            "&:hover": {
              backgroundColor: "#2d2b2b",
            },
          }}
        >
          Log in
        </Button>

        <Typography variant="body2" textAlign="center" sx={{ marginTop: 2 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ fontWeight: "bold", color: "#2d2ee3" }}>
            Register here!
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
