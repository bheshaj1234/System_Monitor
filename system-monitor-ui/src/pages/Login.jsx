import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // For trigger entry animation
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password
      });

      login(res.data.token);

      navigate("/dashboard");

    } catch (err) {

      setError(err.response?.data?.msg || "Invalid email or password");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {/* Animated Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className={`login-card ${mounted ? 'visible' : ''}`}>

        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">⚡</span>
          </div>
          <div className="logo-glow"></div>
        </div>

        <h2>System Monitor</h2>

        <p className="subtitle">
          Monitor uptime, performance & reliability
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>

          <div className="input-group">

            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
            <label>Email</label>
            <div className="input-highlight"></div>

          </div>

          <div className="input-group">

            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
            <label>Password</label>
            <div className="input-highlight"></div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className={`login-btn ${loading ? 'loading' : ''}`}
          >
            <span className="btn-text">{loading ? "Authenticating..." : "Log In"}</span>
            <div className="btn-glow"></div>
          </button>

        </form>

      </div>

    </div>
  );
}