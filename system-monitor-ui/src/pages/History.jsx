import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import HistoryTable from "../components/HistoryTable";
import "./History.css";

export default function History() {

  const { id } = useParams();

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {

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
      setError("Failed to load service history.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchHistory();

  }, [page]);

  return (

    <div className="history-page">

      <h2>Service History</h2>

      <div className="history-card">

        {error && <p className="error-text">{error}</p>}

        {loading ? (

          <p className="loading-text">Loading history...</p>

        ) : logs.length === 0 ? (

          <p className="empty-text">No logs available.</p>

        ) : (

          <div className="history-table-wrapper">
            <HistoryTable logs={logs} />
          </div>

        )}

        {/* Pagination */}

        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );
}