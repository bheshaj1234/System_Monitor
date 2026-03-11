import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ServiceCard.css";

export default function ServiceCard({ service, onDelete }) {

  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const isUp = service.lastStatus?.toLowerCase() === "up";

  // DELETE SERVICE
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
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
    <div className={`service-card ${isUp ? "up" : "down"}`}>

      {/* HEADER */}
      <div className="service-header">
        <h3>{service.name}</h3>

        <span className={`status-badge ${isUp ? "up" : "down"}`}>
          {service.lastStatus || "UNKNOWN"}
        </span>
      </div>

      {/* SERVICE INFO */}
      <div className="service-info">

        <p>
          <strong>URL:</strong>{" "}
          <a href={service.url} target="_blank" rel="noopener noreferrer">
            {service.url}
          </a>
        </p>

        <p>
          <strong>Last Checked:</strong>{" "}
          {service.lastCheckedAt
            ? new Date(service.lastCheckedAt).toLocaleString()
            : "N/A"}
        </p>

        {/* PUBLIC STATUS PAGE */}
        <p>
          <strong>Public Status:</strong>{" "}
          {service.slug ? (
            <a
              href={`/status/${service.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Status Page
            </a>
          ) : (
            <span style={{ color: "#888" }}>Not Available</span>
          )}
        </p>

      </div>

      {/* ACTION BUTTONS */}
      <div className="service-actions">

        <button
          className="check-btn"
          onClick={handleCheckNow}
          disabled={checking}
        >
          {checking ? "Checking..." : "Check Now"}
        </button>

        <button
          className="history-btn"
          onClick={handleViewHistory}
        >
          View History
        </button>

        <button
          className="delete-btn"
          onClick={handleDelete}
        >
          Delete
        </button>

      </div>

    </div>
  );
}