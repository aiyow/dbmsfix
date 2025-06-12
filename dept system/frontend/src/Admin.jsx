import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [role, setRole] = useState("");

  const [sales, setSales] = useState({});
  const [inventory, setInventory] = useState({});
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    if (!username || !userRole) {
      navigate("/login");
    } else if (userRole.toLowerCase() !== "admin") {
      navigate("/staff");
    } else {
      setUser(username);
      setRole(userRole);
      loadReports();
    }
  }, [navigate]); // ensure useEffect runs properly on mount

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
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Welcome Admin, {user}</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Sales Report</Typography>
              <Typography>Total Sales Today: ₱{sales.total_sales_today || 0}</Typography>
              <Typography>This Week: ₱{sales.total_sales_week || 0}</Typography>
              <Typography>This Month: ₱{sales.total_sales_month || 0}</Typography>
              <Typography>Orders Today: {sales.number_of_orders_today || 0}</Typography>
              <Typography>Orders This Week: {sales.number_of_orders_week || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Inventory Report</Typography>
              <Typography>Total Products: {inventory.total_products || 0}</Typography>
              <Typography>Out of Stocks: {inventory.out_of_stocks || 0}</Typography>
              <Typography>Low Stock: {inventory.low_stock_product || 0}</Typography>
              <Typography>Most Stocked: {inventory.most_stocked_product || "N/A"}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Transaction Report</Typography>
              <Typography>Total Transactions: {transactions.total_transactions || 0}</Typography>
              <Typography>Pending: {transactions.pending_transaction || 0}</Typography>
              <Typography>Completed: {transactions.completed_transaction || 0}</Typography>
              <Typography>Refunded: {transactions.refunded_transaction || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Admin;
