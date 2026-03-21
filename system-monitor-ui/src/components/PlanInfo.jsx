import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PlanInfo() {

  const [plan,setPlan] = useState(null);

  useEffect(()=>{

    const fetchPlan = async ()=>{

      try{

        const res = await api.get("/plans/me");

        setPlan(res.data);

      }catch(err){

        console.log(err);

      }

    };

    fetchPlan();

  },[]);

  if(!plan) return null;

  return (

    <div className="plan-card">

      <h3>Your Plan</h3>

      <p>
        Plan: <b>{plan.plan}</b>
      </p>

      <p>
        Services Used: {plan.usedServices} / {plan.serviceLimit}
      </p>

    </div>

  );

}
    