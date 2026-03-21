import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function UptimeGraph({ serviceId }) {

  const [data,setData] = useState([]);

  useEffect(()=>{

    const fetchHistory = async()=>{

      try{

        const res = await api.get(`/logs/history/${serviceId}`);

        const formatted = res.data.map(log=>({
          time: new Date(log.checkedAt).toLocaleTimeString(),
          status: log.status === "UP" ? 1 : 0
        }));

        setData(formatted);

      }catch(err){

        console.error(err);

      }

    };

    fetchHistory();

  },[serviceId]);

  return(

    <div className="uptime-graph">

      <h3>Last 24 Hours Status</h3>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={data}>

          <XAxis dataKey="time" />

          <YAxis
            domain={[0,1]}
            ticks={[0,1]}
            tickFormatter={(v)=> v===1 ? "UP":"DOWN"}
          />

          <Tooltip
            formatter={(v)=> v===1 ? "UP":"DOWN"}
          />

          <Line
            type="monotone"
            dataKey="status"
            stroke="#00ff88"
            strokeWidth={2}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}