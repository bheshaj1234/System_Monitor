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

  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

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
      <div className="dashboard-card">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Live System Dashboard</h2>
            {user && (
              <p className="user-email">
                Logged in as: <strong>{user.email}</strong>
              </p>
            )}
          </div>

          <div className="header-actions">
            <button
              className="add-btn"
              onClick={() => setShowModal(true)}
            >
              + Add Service
            </button>

            <button
              className="logout-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <p className="loading-text">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="empty-text">No services added yet.</p>
        ) : (
          <div className="services-grid">
            {services.map((s) => (
              <ServiceCard
                key={s._id}
                service={s}
                onDelete={handleDelete}
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