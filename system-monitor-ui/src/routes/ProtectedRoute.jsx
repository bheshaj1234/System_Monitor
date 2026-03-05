import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  if (loading) return <p>Loading...</p>;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}