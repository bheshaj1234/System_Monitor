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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

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
    <div className="metrics-page">
      {/* Animated Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-3"></div>

      <div className={`metrics-container ${mounted ? 'visible' : ''}`}>
        <div className="metrics-header-area">
          <h2><span className="logo-icon">📊</span> Analytics & Metrics</h2>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Aggregating Telemetry...</p>
          </div>
        )}
        
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && (
          <>
            {/* Summary */}
            <div className="stats-grid">
              <StatBox title="Total Trackers" value={summary.totalServices} />
              <StatBox title="Healthy" value={summary.up} color="#4ade80" />
              <StatBox title="Down" value={summary.down} color="#f87171" />
            </div>

            <div className="metrics-card">
              <h3 className="section-title">Individual Node performance</h3>
              
              {services.length === 0 ? (
                <div className="empty-state">
                  <p>No nodes found to analyze.</p>
                </div>
              ) : (
                <div className="service-list">
                  {services.map((service, index) => {
                    const isUp = service.currentStatus === "UP";
                    return (
                      <div 
                        className="service-metric-card animate-stagger" 
                        key={service.serviceId}
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <div className="metric-header">
                          <h3 className="truncate" title={service.serviceName}>{service.serviceName}</h3>
                          <div className={`status-pill ${isUp ? 'status-up' : 'status-down'}`}>
                            <span className="status-dot"></span>
                            {service.currentStatus}
                          </div>
                        </div>
                        
                        <div className="metric-body">
                          <div className="metric-stat">
                            <span className="stat-label">Total Validations</span>
                            <span className="stat-val">{service.totalChecks}</span>
                          </div>
                          <div className="metric-stat">
                            <span className="stat-label">Avg Latency</span>
                            <span className="stat-val user-accent">{service.averageResponseTime} ms</span>
                          </div>
                          <div className="metric-stat">
                            <span className="stat-label">System Uptime</span>
                            <span className={`stat-val ${service.uptimePercent > 99 ? 'up-text' : service.uptimePercent < 90 ? 'down-text' : ''}`}>
                              {service.uptimePercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}