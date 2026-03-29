import { useState } from "react";
import api from "../api/axios";
import "./AddServiceModal.css";

export default function AddServiceModal({ close, refreshServices }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !url) {
      return setError("Endpoint and Name are required");
    }

    try {
      setLoading(true);
      await api.post("/service/add", {
        name,
        url,
        interval,
      });

      refreshServices();
      close();
    } catch (err) {
      setError("Failed to initialize tracker uplink.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Deploy Tracker</h3>
          <button className="modal-close-icon" onClick={close}>✕</button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleAdd}>
          <div className="modal-input-group">
            <input
              type="text"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Service Identifier</label>
            <div className="input-highlight"></div>
          </div>

          <div className="modal-input-group">
            <input
              type="url"
              placeholder=" "
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <label>Target URL (HTTP/HTTPS)</label>
            <div className="input-highlight"></div>
          </div>

          <div className="modal-input-group">
            <input
              type="number"
              placeholder=" "
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              min="1"
              required
            />
            <label>Polling Interval (minutes)</label>
            <div className="input-highlight"></div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={close} className="btn-modal-cancel">
              Abort
            </button>
            <button type="submit" className="btn-modal-deploy" disabled={loading}>
              {loading ? "Deploying..." : "Initialize"}
              <div className="btn-glow"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}