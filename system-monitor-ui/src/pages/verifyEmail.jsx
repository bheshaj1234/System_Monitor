import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function VerifyEmail(){

const { token } = useParams();

const [status,setStatus] = useState("verifying");

useEffect(()=>{
const verifyEmail = async()=>{

  try{

    await api.get(`/auth/verify-email/${token}`);

    setStatus("success");

  }
  catch(err){

    setStatus("error");

  }

};

verifyEmail();

},[token]);

return(
<div style={{
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  height:"100vh",
  flexDirection:"column"
}}>

  {status==="verifying" && (
    <h2>Verifying your email...</h2>
  )}

  {status==="success" && (
    <>
      <h2>Email verified successfully</h2>
      <p>You can now login</p>
      <Link to="/login">
        Go to Login
      </Link>
    </>
  )}

  {status==="error" && (
    <>
      <h2>Verification failed</h2>
      <p>Invalid or expired verification link</p>
    </>
  )}

</div>

);
}
