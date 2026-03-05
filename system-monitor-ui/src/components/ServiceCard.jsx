import { useState } from "react";
import api from "../api/axios";
import "./ServiceCard.css";

export default function ServiceCard({ service, onDelete }) {
  const [checking, setChecking] = useState(false);

  const isUp = service.lastStatus?.toLowerCase() === "up";

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    onDelete(service._id);
  };

  const handleCheckNow = async () => {
    try {
      setChecking(true);
      await api.post(`/service/${service._id}/check`);
      // No alert needed
      // Socket will auto update UI
    } catch (err) {
      console.error("Manual check failed", err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className={`service-card ${isUp ? "up" : "down"}`}>
      <div className="service-header">
        <h3>{service.name}</h3>
        <span className={`status-badge ${isUp ? "up" : "down"}`}>
          {service.lastStatus || "UNKNOWN"}
        </span>
      </div>

      <div className="service-info">
        <p>
          <strong>URL:</strong> {service.url}
        </p>

        <p>
          <strong>Last Checked:</strong>{" "}
          {service.lastCheckedAt
            ? new Date(service.lastCheckedAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      <div className="service-actions">
        <button
          className="check-btn"
          onClick={handleCheckNow}
          disabled={checking}
        >
          {checking ? "Checking..." : "Check Now"}
        </button>

        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}