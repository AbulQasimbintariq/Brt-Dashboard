export default function StatsCard({ title, value }) {
  const cardStyle = {
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const valueStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#f8fafc',
    margin: '0',
  };

  return (
    <div style={cardStyle}>
      <p style={valueStyle}>{value}</p>
      <p style={titleStyle}>{title}</p>
    </div>
  );
}