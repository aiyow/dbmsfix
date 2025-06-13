import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

const Customer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!username || !role || role.toLowerCase() !== "customer") {
      localStorage.clear();
      navigate("/login");
    } else {
      loadCustomerData(username);
      loadProducts();
    }
  }, [navigate]);

  const loadCustomerData = async (username) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${username}`);
      setUser(res.data.first_name);
    } catch (err) {
      console.error("Failed to load customer info:", err);
      setUser(username); // fallback
    }
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    { label: "Menu / Products", icon: <RestaurantMenuIcon />, path: "/customer" },
    { label: "Cart", icon: <ShoppingCartIcon />, path: "/customer/cart" },
    { label: "Order", icon: <ListAltIcon />, path: "/customer/orders" },
  ];

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box
        width="250px"
        bgcolor="#1a202c"
        color="white"
        p={3}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        borderRight="2px solid rgba(0,0,0,0.1)"
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={4}>
            CUSTOMER PAGE
          </Typography>
          <List>
            {sidebarItems.map(({ label, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <ListItemButton
                  key={label}
                  component={Link}
                  to={path}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    color: "white",
                    backgroundColor: isActive ? "#4c51bf" : "transparent",
                    fontWeight: isActive ? "bold" : "normal",
                    "&:hover": { backgroundColor: "#4a5568" },
                  }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: "35px" }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              );
            })}
            {/* Logout button */}
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mt: 4,
                borderRadius: 2,
                color: "#f56565",
                "&:hover": { backgroundColor: "#4a5568" },
              }}
            >
              <ListItemIcon sx={{ color: "#f56565", minWidth: "35px" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4} bgcolor="#f0f2f5">
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Hello, {user || "Customer"}!
        </Typography>

        {/* Product Section */}
        <Box
          p={3}
          borderRadius="16px"
          bgcolor="#ffffff"
          boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Products
            </Typography>
            <TextField
              placeholder="Search Products"
              size="small"
              sx={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                width: "250px",
              }}
              InputProps={{
                endAdornment: <span role="img" aria-label="search">🔍</span>,
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ textAlign: "center", p: 1 }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={
                      product.product_image
                        ? `data:image/jpeg;base64,${product.product_image}`
                        : "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={product.name}
                    sx={{ objectFit: "contain", my: 1 }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body1" fontWeight="500">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ₱{product.price}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 1,
                        backgroundColor: "#4c51bf",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#434190" },
                      }}
                    >
                      ADD TO CART
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Customer;
