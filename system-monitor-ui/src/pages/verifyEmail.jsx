import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./VerifyEmail.css";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === "verifying" && (
          <div className="verify-content">
            <div className="verify-spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we secure your account.</p>
          </div>
        )}

        {status === "success" && (
          <div className="verify-content">
            <div className="verify-icon success-icon">✓</div>
            <h2>Email verified successfully</h2>
            <p>Your account is now active and ready.</p>
            <Link to="/login" className="verify-btn">
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="verify-content">
            <div className="verify-icon error-icon">✕</div>
            <h2>Verification failed</h2>
            <p>The verification link is invalid or has expired.</p>
            <Link to="/register" className="verify-btn secondary-btn">
              Back to Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
