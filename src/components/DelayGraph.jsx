import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function DelayGraph({ buses }) {
  const data = buses.map(b => ({ name: b.route, delay: b.delay }));

  return (
    <div style={{ width: '100%', minHeight: 280, background: 'transparent' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="delay" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}