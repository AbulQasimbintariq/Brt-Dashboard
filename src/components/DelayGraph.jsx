import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function DelayGraph({ buses }) {
  const data = buses.map(b => ({ name: b.route, delay: b.delay }));
  
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="delay" stroke="#8884d8" />
    </LineChart>
  );
}