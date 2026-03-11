    export default function HistoryTable({ logs }){

    return(

    <table className="history-table">

    <thead>
        <tr>
        <th>Status</th>
        <th>Response Time</th>
        <th>Checked At</th>
        </tr>
    </thead>

    <tbody>

        {logs.map(log => (

        <tr key={log._id}>

        <td className={log.status==="UP" ? "up" : "down"}>
        {log.status}
        </td>

        <td>{log.responseTime} ms</td>

        <td>
        {new Date(log.checkedAt).toLocaleString()}
        </td>

        </tr>

        ))}

    </tbody>

    </table>

    );

    }