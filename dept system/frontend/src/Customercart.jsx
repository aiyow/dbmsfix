import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  FormControlLabel,
  Card,
  TextField,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentIcon from "@mui/icons-material/Assignment";

const CustomerCartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("creditCard");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!username || !role || role.toLowerCase() !== "customer") {
      localStorage.clear();
      navigate("/login");
    } else {
      fetchCustomerName(username);
      updateTotal();
    }
  }, [navigate]);

  const fetchCustomerName = async (username) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${username}`);
      setUser(res.data.first_name);
    } catch (err) {
      console.error("Failed to load customer name:", err);
      setUser(username); // fallback
    }
  };

  const updateTotal = () => {
    let total = 0;
    const quantityInputs = document.querySelectorAll('input[type="number"]');

    quantityInputs.forEach((input) => {
      const itemContainer = input.closest(".cart-item-card");
      if (itemContainer) {
        const priceText = itemContainer.querySelector("p").textContent;
        const priceMatch = priceText.match(/(\d+)\$/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
        const quantity = parseInt(input.value);
        total += price * quantity;
      }
    });

    const totalPrice = document.getElementById("total-price");
    if (totalPrice) {
      totalPrice.textContent = `$${total.toFixed(2)}`;
    }
  };

  const handleDelete = (e) => {
    const itemCard = e.currentTarget.closest(".cart-item-card");
    if (itemCard) {
      itemCard.remove();
      updateTotal();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    { label: "Menu / Products", icon: <StorefrontIcon />, path: "/customer" },
    { label: "Cart", icon: <ShoppingCartIcon />, path: "/customer/cart" },
    { label: "Order", icon: <AssignmentIcon />, path: "/customer/orders" },
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

        {/* Cart Section */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Your Carts 🛒
          </Typography>

          {[
            { name: "Soccer_Ball", price: 3, size: "M" },
            { name: "Blue-Lock Manga Vol 8", price: 5 },
            { name: "One Piece_Tshirt", price: 10, size: "L" },
          ].map((item, index) => (
            <Box
              key={index}
              className="cart-item-card"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              mb={2}
              border="1px solid #ddd"
              borderRadius={2}
              bgcolor="#f9f9f9"
            >
              <Box>
                <Typography fontWeight="bold">{item.name}</Typography>
                <Typography>
                  {item.price}${item.size && ` (${item.size})`}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  type="number"
                  defaultValue={1}
                  onChange={updateTotal}
                  inputProps={{ min: 1 }}
                  size="small"
                  sx={{ width: "80px", bgcolor: "white", borderRadius: 1 }}
                />
                <Button
                  onClick={handleDelete}
                  variant="text"
                  color="error"
                  sx={{ fontSize: "18px", minWidth: "32px" }}
                >
                  🗑
                </Button>
              </Box>
            </Box>
          ))}
        </Card>

        {/* Order Summary */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Order Summary
          </Typography>
          <Typography>
            Total:{" "}
            <span id="total-price" style={{ fontWeight: "bold" }}>
              $18.00
            </span>
          </Typography>
        </Card>

        {/* Payment Method */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Payment Method
          </Typography>
          {[
            { label: "Credit Card", value: "creditCard" },
            { label: "PayPal", value: "paypal" },
            { label: "Bank Transfer", value: "bankTransfer" },
          ].map((method, index) => (
            <FormControlLabel
              key={index}
              control={
                <Radio
                  checked={selectedPayment === method.value}
                  onChange={() => setSelectedPayment(method.value)}
                  value={method.value}
                  name="paymentMethod"
                />
              }
              label={method.label}
            />
          ))}
        </Card>

        {/* Checkout */}
        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 5, py: 1.5, fontWeight: "bold" }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerCartPage;
