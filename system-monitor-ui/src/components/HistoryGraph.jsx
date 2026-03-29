import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HistoryGraph({ logs }) {
  if (!logs || logs.length === 0) return null;

  // Reverse logs to show chronological order (oldest -> newest) from left to right
  const chartData = [...logs].reverse().map(log => {
    const date = new Date(log.checkedAt);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      responseTime: log.responseTime || 0,
      status: log.status
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isUp = data.status?.toUpperCase() === 'UP';
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 16px',
          borderRadius: '12px',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: isUp ? '#4ade80' : '#fca5a5',
              boxShadow: `0 0 8px ${isUp ? 'rgba(74,222,128,0.5)' : 'rgba(252,165,165,0.5)'}`
            }}></span>
            <span style={{ fontWeight: '600', fontSize: '15px', color: isUp ? '#4ade80' : '#fca5a5' }}>
              {isUp ? `${data.responseTime} ms` : 'Offline'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="#64748b" 
          fontSize={11} 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={11} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => `${val}ms`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
        <Line 
          type="monotone" 
          dataKey="responseTime" 
          stroke="#38bdf8" 
          strokeWidth={3}
          dot={{ fill: '#0f172a', stroke: '#38bdf8', strokeWidth: 2, r: 4 }}
          activeDot={{ fill: '#38bdf8', stroke: '#fff', strokeWidth: 2, r: 6 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
