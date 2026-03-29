import { useEffect, useState, useContext, useCallback } from "react";
import api from "../api/axios";
import { socket } from "../api/socket";
import ServiceCard from "../components/ServiceCard";
import AddServiceModal from "../components/AddServiceModal";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // 🔹 Fetch Services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/service/my");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      setError("Session expired. Please login again.");
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // 🔥 Live Socket Updates (Optimized)
  useEffect(() => {
    const handleServiceUpdate = (data) => {
      console.log("Realtime update:", data);

      setServices((prev) =>
        prev.map((s) =>
          s._id === data.serviceId
            ? {
                ...s,
                lastStatus: data.status
                  ? data.status.toLowerCase()
                  : s.lastStatus,
                lastCheckedAt: data.checkedAt || s.lastCheckedAt,
              }
            : s
        )
      );
    };

    socket.on("serviceStatusUpdate", handleServiceUpdate);

    return () => {
      socket.off("serviceStatusUpdate", handleServiceUpdate);
    };
  }, []);

  // 🔹 Delete handler
  const handleDelete = async (id) => {
    try {
      await api.delete(`/service/delete/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Animated Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className={`dashboard-card ${mounted ? 'visible' : ''}`}>

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">
              <span className="logo-icon">⚡</span> System Operations
            </h2>
            {user && (
              <p className="user-email">
                <span className="text-accent">Authenticated User</span>
              </p>
            )}
          </div>

          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Add Service
            </button>

            <button
              className="btn-danger"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Terminate Session
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Gathering Telemetry...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📡</div>
            <h3>No Services Found</h3>
            <p>Deploy your first tracker to begin monitoring uptime and performance.</p>
            <button className="btn-primary mt-3" onClick={() => setShowModal(true)}>Deploy Tracker</button>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((s, idx) => (
              <ServiceCard
                key={s._id}
                service={s}
                onDelete={handleDelete}
                index={idx}
              />
            ))}
          </div>
        )}

        {showModal && (
          <AddServiceModal
            close={() => setShowModal(false)}
            refreshServices={fetchServices}
          />
        )}
      </div>
    </div>
  );
}