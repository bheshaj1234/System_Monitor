import { useEffect, useState } from "react";
import api from "../api/axios";
import StatBox from "../components/StatBox";
import "./Metrics.css";

export default function Metrics() {
  const [services, setServices] = useState([]);
  const [summary, setSummary] = useState({
    totalServices: 0,
    up: 0,
    down: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/metrics")
      .then(res => {
        const data = res.data; // expecting array

        setServices(data);

        // calculate summary from array
        const total = data.length;
        const upCount = data.filter(s => s.currentStatus === "UP").length;
        const downCount = data.filter(s => s.currentStatus === "DOWN").length;

        setSummary({
          totalServices: total,
          up: upCount,
          down: downCount
        });

        setLoading(false);
      })
      .catch(err => {
        console.log("METRICS ERROR:", err);
        setError("Failed to load metrics");
        setLoading(false);
      });
  }, []);

  return (
    <div className="metrics-container">
      <div className="metrics-card">
        <h2>System Metrics Overview</h2>

        {loading && <p className="info-text">Loading metrics...</p>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {/* Summary */}
            <div className="stats-grid">
              <StatBox title="Total Services" value={summary.totalServices} />
              <StatBox title="UP" value={summary.up} />
              <StatBox title="DOWN" value={summary.down} />
            </div>

            {/* Detailed List */}
            <div className="service-list">
              {services.map(service => (
                <div className="service-card" key={service.serviceId}>
                  <h3>{service.serviceName}</h3>
                  <p>Status: 
                    <span className={
                      service.currentStatus === "UP" ? "up" : "down"
                    }>
                      {service.currentStatus}
                    </span>
                  </p>
                  <p>Total Checks: {service.totalChecks}</p>
                  <p>Uptime: {service.uptimePercent}%</p>
                  <p>Avg Response: {service.averageResponseTime} ms</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}