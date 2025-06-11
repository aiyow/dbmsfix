import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    reenterPassword: "",
    role: "customer",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    const { username, password, reenterPassword, role } = form;

    if (!username || !password || !role) {
      return alert("Please fill in all required fields.");
    }

    if (password !== reenterPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        { ...form },
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
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
        maxWidth="sm"
        sx={{
          backgroundColor: "#a3a8f0",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: 6,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Create a new account.
        </Typography>

        {form.role === "customer" && (
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                size="small"
                margin="dense"
                value={form.firstName}
                onChange={handleChange}
                InputProps={{
                  style: {
                    backgroundColor: "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                size="small"
                margin="dense"
                value={form.lastName}
                onChange={handleChange}
                InputProps={{
                  style: {
                    backgroundColor: "#ffffff",
                  },
                }}
              />
            </Grid>
          </Grid>
        )}

        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="dense"
          size="small"
          value={form.username}
          onChange={handleChange}
          InputProps={{
            style: {
              backgroundColor: "#ffffff",
            },
          }}
        />

        {form.role === "customer" && (
          <>
            <TextField
              label="Address"
              name="address"
              fullWidth
              margin="dense"
              size="small"
              value={form.address}
              onChange={handleChange}
              InputProps={{
                style: {
                  backgroundColor: "#ffffff",
                },
              }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              margin="dense"
              size="small"
              value={form.phone}
              onChange={handleChange}
              InputProps={{
                style: {
                  backgroundColor: "#ffffff",
                },
              }}
            />
          </>
        )}

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="dense"
          size="small"
          value={form.password}
          onChange={handleChange}
          InputProps={{
            style: {
              backgroundColor: "#ffffff",
            },
          }}
        />
        <TextField
          label="Re-enter Password"
          name="reenterPassword"
          type="password"
          fullWidth
          margin="dense"
          size="small"
          value={form.reenterPassword}
          onChange={handleChange}
          InputProps={{
            style: {
              backgroundColor: "#ffffff",
            },
          }}
        />

        <TextField
          select
          label="Roles"
          name="role"
          fullWidth
          margin="dense"
          size="small"
          value={form.role}
          onChange={handleChange}
          InputProps={{
            style: {
              backgroundColor: "#ffffff",
            },
          }}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{
            mt: 2,
            backgroundColor: "#3e3c3c",
            color: "#fff",
            fontSize: "18px",
            "&:hover": { backgroundColor: "#2d2b2b" },
          }}
        >
          Sign Up
        </Button>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ marginTop: 2 }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ fontWeight: "bold", color: "#2d2ee3", cursor: "pointer" }}
          >
            Sign in
          </span>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;
