import { useEffect, useState, useContext, useCallback } from "react";
import api from "../api/axios";
import { socket } from "../api/socket";
import ServiceCard from "../components/ServiceCard";
import AddServiceModal from "../components/AddServiceModal";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PlanInfo from "../components/PlanInfo";

export default function Dashboard() {

  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  ////////////////////////////////////////////////////////
  // FETCH SERVICES
  ////////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////
  // REALTIME SOCKET UPDATES
  ////////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////
  // DELETE SERVICE
  ////////////////////////////////////////////////////////

  const handleDelete = async (id) => {

    try {

      await api.delete(`/service/delete/${id}`);

      setServices((prev) => prev.filter((s) => s._id !== id));

    } catch (err) {

      alert("Delete failed");

    }

  };

  ////////////////////////////////////////////////////////
  // ADD SERVICE BUTTON CLICK
  ////////////////////////////////////////////////////////

  const handleAddServiceClick = () => {

    setShowModal(true);

  };

  ////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////

  return (

    <div className="dashboard-container">

      <div className="dashboard-card">

        {/* HEADER */}

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
              onClick={handleAddServiceClick}
            >
              + Add Service
            </button>

            <button
              className="upgrade-btn"
              onClick={() => navigate("/upgrade")}
            >
              Upgrade to PRO
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

        {/* PLAN INFO */}

        <PlanInfo />

        {error && <div className="error">{error}</div>}

        {/* SERVICES LIST */}

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

        {/* ADD SERVICE MODAL */}

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
  