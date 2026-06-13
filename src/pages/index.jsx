import { useState } from 'react';
import { useBusData } from '../hooks/useBusData';
import StatsCard from '../components/StatsCard';
import BusMap from '../components/BusMap';
import DelayGraph from '../components/DelayGraph';
import { exportToPDF } from '../lib/exportPDF';

export default function Dashboard() {
  const buses = useBusData();
  const [showBusDetails, setShowBusDetails] = useState(false);
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
    gap: '12px',
  };

  const headerLeftStyle = {
    flex: 1,
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
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

  const detailsButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#00d4ff',
    color: '#07101e',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const modalOverlayStyle = {
    display: showBusDetails ? 'flex' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const modalContentStyle = {
    backgroundColor: '#1a2332',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid #2d3e50',
    color: '#e2e8f0',
  };

  const modalHeaderStyle = {
    fontSize: '28px',
    fontWeight: '900',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #aa3bff 0%, #ff006e 50%, #00d4ff 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    width: '30px',
    height: '30px',
  };

  const busGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  };

  const busSCardStyle = {
    backgroundColor: '#0f1823',
    border: '1px solid #2d3e50',
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.3s',
  };

  const busCardHeaderStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#aa3bff',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #2d3e50',
  };

  const busCardRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    marginBottom: '8px',
  };

  const buslabelStyle = {
    color: '#94a3b8',
    fontWeight: '500',
  };

  const busValueStyle = {
    color: '#e2e8f0',
    fontWeight: '600',
  };

  const titleStyle = {
    fontSize: '48px',
    fontWeight: '900',
    margin: '0 0 16px 0',
    background: 'linear-gradient(135deg, #aa3bff 0%, #ff006e 50%, #00d4ff 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '2px',
    textShadow: 'none',
    filter: 'drop-shadow(0 8px 16px rgba(170, 59, 255, 0.3))',
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
          <h1 style={titleStyle}>BRT DASHBOARD</h1>
          <p style={{ margin: '0', color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>Real-time transit intelligence system</p>
        </div>
        <div style={buttonGroupStyle}>
          <button 
            style={detailsButtonStyle}
            onClick={() => setShowBusDetails(true)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#00b8d4'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00d4ff'}
          >
            📊 Complete Info
          </button>
          <button 
            style={exportButtonStyle}
            onClick={() => exportToPDF(buses, 'brt-dashboard')}
            onMouseOver={(e) => e.target.style.backgroundColor = '#8b2ccc'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#aa3bff'}
          >
            📥 Export PDF
          </button>
        </div>
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

      {/* Complete Bus Information Modal */}
      <div style={modalOverlayStyle} onClick={() => setShowBusDetails(false)}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <div style={modalHeaderStyle}>
            Complete Bus Information
            <button 
              style={closeButtonStyle}
              onClick={() => setShowBusDetails(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div style={busGridStyle}>
            {buses.map(bus => (
              <div key={bus.id} style={busSCardStyle} onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#aa3bff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(170, 59, 255, 0.2)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#2d3e50';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={busCardHeaderStyle}>{bus.id}</div>
                
                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Route:</span>
                  <span style={busValueStyle}>{bus.route}</span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Speed:</span>
                  <span style={{ ...busValueStyle, color: '#00d4ff' }}>{bus.speed} km/h</span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Passengers:</span>
                  <span style={{ ...busValueStyle, color: '#aa3bff' }}>{bus.passengers}</span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Delay:</span>
                  <span style={{ ...busValueStyle, color: bus.delay > 5 ? '#ff006e' : '#4ade80' }}>
                    {bus.delay} min
                  </span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Latitude:</span>
                  <span style={busValueStyle}>{bus.latitude.toFixed(6)}</span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Longitude:</span>
                  <span style={busValueStyle}>{bus.longitude.toFixed(6)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}