import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword(){

const {token}=useParams();

const navigate=useNavigate();

const [password,setPassword]=useState("");
const [msg,setMsg]=useState("");

const handleSubmit=async(e)=>{

e.preventDefault();

const res=await api.post(
`/auth/reset-password/${token}`,
{password}
);

setMsg(res.data.message);

setTimeout(()=>{
navigate("/login");
},2000);

};

return(

<div className="login-container">

<div className="login-card">

<h2>Reset Password</h2>

{msg && <div className="success">{msg}</div>}

<form onSubmit={handleSubmit}>

<input
type="password"
placeholder="New password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">Reset Password</button>

</form>

</div>

</div>

);

}