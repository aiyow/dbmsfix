import { Navigate } from "react-router-dom";

const RequireCustomer = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role?.toLowerCase() !== "customer") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireCustomer;
