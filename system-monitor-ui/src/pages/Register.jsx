import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

export default function Register() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  const handleRegister = async (e)=>{

    e.preventDefault();

    if(password !== confirmPassword){
      return setError("Passwords do not match");
    }

    try{

      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post("/auth/register",{
        email,
        password
      });

      setSuccess(
        "Account created successfully. Please verify your email before logging in."
      );

      setTimeout(()=>{
        navigate("/verify-email");
      },3000);

    }catch(err){

      setError(
        err.response?.data?.message || "Registration failed"
      );

    }finally{
      setLoading(false);
    }

  };

  return(

    <div className="login-container">

      <div className="login-card">

        <div className="logo">⚡</div>

        <h2>Create Account</h2>

        <p className="subtitle">
          Start monitoring your services
        </p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleRegister}>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

          </div>

          <div className="input-group">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />

          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        <p
          style={{marginTop:"15px",cursor:"pointer"}}
          onClick={()=>navigate("/login")}
        >
          Already have an account? Login
        </p>

      </div>

    </div>

  );

}
