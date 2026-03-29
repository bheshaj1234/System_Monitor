export default function HistoryTable({ logs }) {
  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>System Status</th>
          <th>Response Time</th>
          <th>Timestamp (Local)</th>
        </tr>
      </thead>

      <tbody>
        {logs.map((log) => {
          const isUp = log.status?.toUpperCase() === "UP";
          
          return (
            <tr key={log._id}>
              <td>
                <span className={`status-pill ${isUp ? "status-up" : "status-down"}`}>
                  <span className="status-dot"></span>
                  {log.status?.toUpperCase() || "UNKNOWN"}
                </span>
              </td>

              <td>
                {log.responseTime ? (
                  <span style={{color: log.responseTime > 1000 ? '#fca5a5' : '#cbd5e1'}}>
                    {log.responseTime} ms
                  </span>
                ) : (
                  <span style={{color: '#64748b'}}>-</span>
                )}
              </td>

              <td>
                {new Date(log.checkedAt).toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}