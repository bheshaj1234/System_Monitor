import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function CheckEmail(){

  const navigate = useNavigate();

  return(

    <div className="login-container">

      <div className="login-card">

        <div className="logo">📧</div>

        <h2>Verify your Email</h2>

        <p className="subtitle">
          We sent a verification link to your email.
          Please check your inbox and click the link.
        </p>

        <button onClick={()=>navigate("/login")}>
          Go to Login
        </button>

      </div>

    </div>

  );

}
