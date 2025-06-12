import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Admin from "./Admin";
import Staff from "./Staff";
import ProductManagement from "./ProductManagement";
import Customer from "./Customer";

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
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/Admin" element={<RequireAdmin><Admin /></RequireAdmin> }/>

        <Route
          path="/Staff"
          element={
            <RequireStaff>
              <Staff />
            </RequireStaff>
          }
        />

        <Route
          path="/Customer"
          element={
            <RequireCustomer>
              <Customer />
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

        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
