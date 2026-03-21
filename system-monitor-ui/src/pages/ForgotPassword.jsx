import { useState } from "react";
import api from "../api/axios";
import "./Login.css";

export default function ForgotPassword(){

const [email,setEmail]=useState("");
const [msg,setMsg]=useState("");
const [error,setError]=useState("");

const handleSubmit=async(e)=>{

e.preventDefault();

try{

const res=await api.post("/auth/forgot-password",{email});

setMsg(res.data.message);

}catch(err){

setError(err.response?.data?.message);

}

};

return(

<div className="login-container">

<div className="login-card">

<h2>Forgot Password</h2>

{msg && <div className="success">{msg}</div>}
{error && <div className="error">{error}</div>}

<form onSubmit={handleSubmit}>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<button type="submit">Send Reset Link</button>

</form>

</div>

</div>

);

}