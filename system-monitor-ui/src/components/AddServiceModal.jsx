import { useState } from "react";
import api from "../api/axios";
import "./AddServiceModal.css";

export default function AddServiceModal({ close, refreshServices }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(5);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!name || !url) {
      return setError("All fields are required");
    }

    try {
      await api.post("/service/add", {
        name,
        url,
        interval,
      });

      refreshServices();
      close();
    } catch (err) {
      setError("Failed to add service");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Service</h3>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Service URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Interval (minutes)"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleAdd}>Add</button>
          <button onClick={close} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}