import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./PublicStatus.css";

export default function PublicStatus() {

  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await api.get(`/public/status/${slug}`);

      setData(res.data);

    } catch (err) {

      console.error(err);
      setError("Service not found");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchStatus();
  }, [slug]);

  if (loading) {
    return (
      <div className="status-page">
        <p className="loading-text">Loading status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="status-page">
        <p className="empty-text">No data available</p>
      </div>
    );
  }

  return (

    <div className="status-page">

      <h1 className="service-title">{data.name}</h1>

      <div className="status-card">

        <div className="status-info">

          <p>
            Current Status:
            <span className={data.status === "UP" ? "status-up" : "status-down"}>
              {data.status}
            </span>
          </p>

          <p>
            Last Checked:
            {data.lastChecked
              ? new Date(data.lastChecked).toLocaleString()
              : " N/A"}
          </p>

          <p>
            Uptime:
            <strong> {data.uptime}</strong>
          </p>

        </div>

        <h3 className="recent-title">Recent Checks</h3>

        <div className="table-wrapper">

          <table className="status-table">

            <thead>
              <tr>
                <th>Status</th>
                <th>Checked Time</th>
              </tr>
            </thead>

            <tbody>

              {data.logs?.map((log) => (

                <tr key={log._id}>

                  <td className={log.status === "UP" ? "status-up" : "status-down"}>
                    {log.status}
                  </td>

                  <td>
                    {new Date(log.checkedAt).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}