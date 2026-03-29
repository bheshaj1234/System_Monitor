import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ServiceCard.css";

export default function ServiceCard({ service, onDelete, index }) {
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const isUp = service.lastStatus?.toLowerCase() === "up";
  const statusClass = isUp ? "up" : service.lastStatus ? "down" : "unknown";

  // DELETE SERVICE
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this tracker?")) return;
    onDelete(service._id);
  };

  // MANUAL CHECK
  const handleCheckNow = async () => {
    try {
      setChecking(true);
      await api.post(`/service/${service._id}/check`);
    } catch (err) {
      console.error("Manual check failed", err);
    } finally {
      setChecking(false);
    }
  };

  // VIEW HISTORY
  const handleViewHistory = () => {
    navigate(`/history/${service._id}`);
  };

  return (
    <div 
      className={`service-card animate-stagger`} 
      style={{animationDelay: `${index * 0.05}s`}}
    >
      {/* Dynamic Glow Border Effect */}
      <div className={`service-glow-edge status-${statusClass}`}></div>

      {/* HEADER */}
      <div className="service-header">
        <h3 className="truncate" title={service.name}>{service.name}</h3>
        <div className={`status-pill status-${statusClass}`}>
          <span className="status-dot"></span>
          {service.lastStatus ? service.lastStatus.toUpperCase() : "PENDING"}
        </div>
      </div>

      {/* SERVICE INFO */}
      <div className="service-info">
        <div className="info-row">
          <span className="info-label">Endpoint</span>
          <a href={service.url} target="_blank" rel="noopener noreferrer" className="info-val truncate-link" title={service.url}>
            {service.url}
          </a>
        </div>

        <div className="info-row">
          <span className="info-label">Last Polled</span>
          <span className="info-val">
            {service.lastCheckedAt
              ? new Date(service.lastCheckedAt).toLocaleString()
              : "Awaiting Initial Check"}
          </span>
        </div>

        <div className="info-row status-row">
          <span className="info-label">Public Node</span>
          {service.slug ? (
            <a
              href={`/status/${service.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="public-link"
            >
              SystemStatus ↗
            </a>
          ) : (
            <span className="info-val empty">Restricted</span>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="service-actions">
        <button
          className="card-btn action-check"
          onClick={handleCheckNow}
          disabled={checking}
        >
          {checking ? "Polling..." : "Force Check"}
        </button>

        <button
          className="card-btn action-history"
          onClick={handleViewHistory}
        >
          Telemetry
        </button>

        <button
          className="card-btn action-delete"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}