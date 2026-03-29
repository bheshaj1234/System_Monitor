import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./PublicStatus.css";

export default function PublicStatus() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/public/status/${slug}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Public service endpoint not found or restricted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [slug]);

  if (loading) {
    return (
      <div className="status-page">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Verifying Public Uplink...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-page">
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="status-page">
        <div className="empty-state">
          <p>No telemetry data found for this endpoint.</p>
        </div>
      </div>
    );
  }
  const getFaviconUrl = (urlString) => {
    try {
      if (!urlString) return null;
      const domain = new URL(urlString).hostname;
      return `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      return null;
    }
  };

  const isUp = data.status === "UP";
  const faviconUrl = getFaviconUrl(data.url);

  return (
    <div className="status-page">
      {/* Animated Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2" style={{background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent)'}}></div>

      <div className={`status-container ${mounted ? 'visible' : ''}`}>
        
        <div className="status-header">
          {faviconUrl && !imgError ? (
            <img 
              src={faviconUrl} 
              alt={`${data.name} Logo`}
              className="power-icon"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '8px' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="power-icon">⚡</div>
          )}
          <h1 className="service-title" title={data.name}>{data.name}</h1>
          <div className="endpoint-badge">Public Node Status</div>
        </div>

        <div className="status-card">
          <div className="status-hero">
            <div className={`hero-status-pill ${isUp ? 'status-down' : 'status-up'}`}>
              <span className="status-dot"></span>
              {data.status}
              <span className="pulse-ring"></span>
            </div>
            <div className="hero-uptime">
              <span className="uptime-val">{data.uptime}</span>
              <span className="uptime-label">Uptime</span>
            </div>
          </div>

          <div className="status-info-row">
            <span className="info-label">Last Synchronization</span>
            <span className="info-val">
              {data.lastChecked
                ? new Date(data.lastChecked).toLocaleString()
                : "Awaiting Data"}
            </span>
          </div>

          <h3 className="recent-title">Recent Event Log</h3>

          <div className="table-wrapper">
            <table className="status-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Timestamp (Local)</th>
                </tr>
              </thead>
              <tbody>
                {data.logs?.map((log) => {
                  const logUp = log.status === "UP";
                  return (
                    <tr key={log._id}>
                      <td>
                        <span className={`status-pill ${logUp ? 'status-up' : 'status-down'}`}>
                          <span className="status-dot"></span>
                          {log.status}
                        </span>
                      </td>
                      <td>
                        {new Date(log.checkedAt).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}