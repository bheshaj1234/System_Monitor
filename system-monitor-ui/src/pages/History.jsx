import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import HistoryTable from "../components/HistoryTable";
import HistoryGraph from "../components/HistoryGraph";
import "./History.css";

export default function History() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/service/history/${id}?page=${page}&limit=10`
      );

      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      console.log(err);
      setError("Failed to load service telemetry history.");
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="history-page">
      {/* Animated Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <div className={`history-container ${mounted ? 'visible' : ''}`}>
        <div className="history-header-actions">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        <h2>Telemetry History</h2>

        <div className="history-card">
          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Fetching Logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Logs Available</h3>
              <p>This tracker has not recorded any recent telemetry data.</p>
            </div>
          ) : (
            <>
              <div className="history-graph-wrapper animate-stagger">
                <HistoryGraph logs={logs} />
              </div>
              <div className="history-table-wrapper animate-stagger" style={{ animationDelay: '0.1s' }}>
                <HistoryTable logs={logs} />
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-page"
              >
                Previous
              </button>

              <span className="page-indicator">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}