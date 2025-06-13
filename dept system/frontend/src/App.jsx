import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Admin from "./Admin";
import Staff from "./staff";
import ProductManagement from "./ProductManagement";
import Customer from "./Customer";
import Customercart from "./Customercart"; // Make sure this matches the filename (Customercart.jsx)

// Role-based wrappers
const RequireRole = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role")?.toLowerCase();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RequireAdmin = ({ children }) => (
  <RequireRole allowedRoles={["admin", "manager"]}>{children}</RequireRole>
);

const RequireStaff = ({ children }) => (
  <RequireRole allowedRoles={["staff", "employee"]}>{children}</RequireRole>
);

const RequireCustomer = ({ children }) => (
  <RequireRole allowedRoles={["customer"]}>{children}</RequireRole>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

        <Route
          path="/staff"
          element={
            <RequireStaff>
              <Staff />
            </RequireStaff>
          }
        />

        <Route
          path="/customer"
          element={
            <RequireCustomer>
              <Customer />
            </RequireCustomer>
          }
        />

        <Route
          path="/customer/cart"
          element={
            <RequireCustomer>
              <Customercart />
            </RequireCustomer>
          }
        />

        <Route
          path="/ProductManagement"
          element={
            <RequireAdmin>
              <ProductManagement />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
