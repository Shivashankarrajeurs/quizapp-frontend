import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("PrivateRoute token:", token);

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Token found, allowing access");
  return children;
}

export default PrivateRoute;



