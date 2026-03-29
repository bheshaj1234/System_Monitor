import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading } = useContext(AuthContext);
  const location = useLocation();

  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh', 
          background: 'radial-gradient(circle at center, #0a0a0f 0%, #000000 100%)',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          color: '#38bdf8'
        }}
      >
        <div 
          style={{
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(56,189,248,0.1)',
            borderTopColor: '#38bdf8', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}
        ></div>
        <p style={{color: '#94a3b8', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase'}}>Authenticating Session...</p>
        <style>
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}