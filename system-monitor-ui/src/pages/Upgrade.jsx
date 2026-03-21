import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Upgrade.css";


export default function Upgrade(){

const navigate = useNavigate();

const upgradePlan = async ()=>{

  try{

    await api.post("/plans/upgrade");

    alert("Plan upgraded to PRO. Please login again");
    navigate("/login");

  }catch(err){

    alert("Upgrade failed");

  }

};

return(

<div className="upgrade-container">

  <div className="upgrade-box">

    <h1>Upgrade to PRO</h1>

    <p>PRO Plan gives you:</p>

    <ul>
      <li>Monitor up to 20 services</li>
      <li>Faster monitoring</li>
      <li>Better uptime insights</li>
    </ul>

    <button
      className="upgrade-btn"
      onClick={upgradePlan}
    >
      Upgrade Now
    </button>

  </div>

</div>

);

}
