import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Admin from "./Admin";
import Staff from "./Staff";
import ProductManagement from "./ProductManagement";
import Customer from "./Customer";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: redirect to /Login */}
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Customer" element={<Customer />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Staff" element={<Staff />} />
        <Route path="/ProductManagement" element={<ProductManagement />} />

        {/* Optional: fallback route to catch undefined URLs */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
