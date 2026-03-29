import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./Login.css"; // Reuse the same premium CSS

export default function Register() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // For trigger entry animation
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/register", {
        email,
        password
      });

      // auto login after signup
      login(res.data.token);

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

        <h2>Create Account</h2>

        <p className="subtitle">
          Start monitoring your services in seconds
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>

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

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
            <div className="input-highlight"></div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`login-btn ${loading ? 'loading' : ''}`}
          >
            <span className="btn-text">{loading ? "Establishing Uplink..." : "Sign Up"}</span>
            <div className="btn-glow"></div>
          </button>

        </form>

        <p
          style={{marginTop:"24px", cursor:"pointer", color: "#94a3b8", fontSize: "14px", fontWeight: "300", transition: "color 0.2s"}}
          onClick={()=>navigate("/login")}
          onMouseEnter={(e) => e.target.style.color = "#38bdf8"}
          onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
        >
          Already have an account? <span style={{color: "#38bdf8", fontWeight: "500"}}>Login</span>
        </p>

      </div>

    </div>
  );
}