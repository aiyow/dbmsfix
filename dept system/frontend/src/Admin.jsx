import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";

import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState("");
  const [sales, setSales] = useState({});
  const [inventory, setInventory] = useState({});
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!username || role.toLowerCase() !== "admin") {
      localStorage.clear();
      navigate("/login");
    } else {
      setUser(username);
      loadReports();
    }
  }, [navigate]);

  const loadReports = async () => {
    try {
      const [salesRes, inventoryRes, transactionsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reports/sales"),
        axios.get("http://localhost:5000/api/reports/inventory"),
        axios.get("http://localhost:5000/api/reports/transactions"),
      ]);
      setSales(salesRes.data);
      setInventory(inventoryRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error("Failed to load reports", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { label: "Inventory", icon: <InventoryIcon />, path: "/admin/products" },
    { label: "Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
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
            ADMIN PAGE
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
          Hello, {user || "Admin"}!
        </Typography>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          {/* Sales */}
          <Card sx={{ flex: 1, borderRadius: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sales Report
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography>Total Sales Today: ₱{sales.total_sales_today || 0}</Typography>
              <Typography>This Week: ₱{sales.total_sales_week || 0}</Typography>
              <Typography>This Month: ₱{sales.total_sales_month || 0}</Typography>
              <Typography>Orders Today: {sales.number_of_orders_today || 0}</Typography>
              <Typography>Orders This Week: {sales.number_of_orders_week || 0}</Typography>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card sx={{ flex: 1, borderRadius: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Inventory Report
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography>Total Products: {inventory.total_products || 0}</Typography>
              <Typography>Out of Stocks: {inventory.out_of_stocks || 0}</Typography>
              <Typography>Low Stock: {inventory.low_stock_product || 0}</Typography>
              <Typography>Most Stocked: {inventory.most_stocked_product || "N/A"}</Typography>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card sx={{ flex: 1, borderRadius: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Transaction Report
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography>Total Transactions: {transactions.total_transactions || 0}</Typography>
              <Typography>Pending: {transactions.pending_transaction || 0}</Typography>
              <Typography>Completed: {transactions.completed_transaction || 0}</Typography>
              <Typography>Refunded: {transactions.refunded_transaction || 0}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
