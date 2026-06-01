import { useBusData } from '../hooks/useBusData';
import StatsCard from '../components/StatsCard';
import BusMap from '../components/BusMap';
import DelayGraph from '../components/DelayGraph';
import { exportToPDF } from '../lib/exportPDF';

export default function Dashboard() {
  const buses = useBusData();
  const totalPassengers = buses.reduce((a, b) => a + b.passengers, 0);
  const avgSpeed = buses.length > 0 ? (buses.reduce((a, b) => a + b.speed, 0) / buses.length).toFixed(1) : 0;

  const dashboardStyle = {
    padding: '24px',
    backgroundColor: '#07101e',
    minHeight: '100vh',
    color: '#e2e8f0',
  };

  const headerStyle = {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  };

  const headerLeftStyle = {
    flex: 1,
  };

  const exportButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#aa3bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const titleStyle = {
    fontSize: '30px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  };

  const contentStyle = {
    display: 'grid',
    gap: '24px',
  };

  const timestampStyle = {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '16px',
  };

  return (
    <div style={dashboardStyle}>
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <h1 style={titleStyle}>BRT Dashboard - Live</h1>
          <p style={{ margin: '0', color: '#94a3b8' }}>Real-time transit intelligence for BRT routes</p>
        </div>
        <button 
          style={exportButtonStyle}
          onClick={() => exportToPDF(buses, 'brt-dashboard')}
          onMouseOver={(e) => e.target.style.backgroundColor = '#8b2ccc'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#aa3bff'}
        >
          📥 Export PDF
        </button>
      </div>
      
      <div style={gridStyle}>
        <StatsCard title="Total Buses" value={buses.length} />
        <StatsCard title="Avg Speed" value={`${avgSpeed} km/h`} />
        <StatsCard title="Passengers" value={totalPassengers} />
      </div>

      <div style={contentStyle}>
        <BusMap buses={buses} />
        <DelayGraph buses={buses} />
      </div>
      
      <p style={timestampStyle}>
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}