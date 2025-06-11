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
  const [role, setRole] = useState("Employee");
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
      const response = await axios.post(
        "http://localhost:5000/login",
        { username, password, role }, // Send role too
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, role: userRole, username: userName } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", userName);
      localStorage.setItem("role", userRole);

      const normalizedRole = userRole?.trim();

if (normalizedRole === "admin" || normalizedRole === "manager") {
  navigate("/Admin");
} else if (normalizedRole === "employee" || normalizedRole === "staff") {
  navigate("/staff");
} else if (normalizedRole === "customer") {
  navigate("/customer");
} else {
  alert("Unrecognized role: " + userRole);
}
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

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

        <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
          <InputLabel>Roles</InputLabel>
          <Select
            value={role}
            label="Roles"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
          </Select>
        </FormControl>

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
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
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
