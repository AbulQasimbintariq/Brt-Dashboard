import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function BusMap({ buses }) {
  const [selectedBus, setSelectedBus] = useState(null);

  const containerStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  };

  const mapStyle = {
    flex: 1,
    height: '400px',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const detailsStyle = {
    width: '300px',
    backgroundColor: '#1a2332',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid #2d3e50',
    color: '#e2e8f0',
  };

  const detailsHeadingStyle = {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #aa3bff, #ff006e)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const detailRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid #2d3e50',
    marginBottom: '12px',
  };

  const labelStyle = {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600',
  };

  const valueStyle = {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500',
  };

  const closeButtonStyle = {
    marginTop: '16px',
    padding: '10px 16px',
    backgroundColor: '#2d3e50',
    color: '#e2e8f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    width: '100%',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={containerStyle}>
      <div style={mapStyle}>
        <MapContainer center={[24.8607, 67.0011]} zoom={12} style={{ width: '100%', height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {buses && buses.map(bus => (
            <Marker 
              key={bus.id} 
              position={[bus.latitude || bus.lat || 0, bus.longitude || bus.lng || 0]}
              eventHandlers={{
                click: () => setSelectedBus(bus),
              }}
            >
              <Popup>
                <div>
                  <strong>{bus.id}</strong><br/>
                  {bus.route}<br/>
                  Speed: {bus.speed} km/h<br/>
                  Passengers: {bus.passengers}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedBus && (
        <div style={detailsStyle}>
          <div style={detailsHeadingStyle}>Bus Details</div>
          
          <div style={detailRowStyle}>
            <span style={labelStyle}>Bus No.</span>
            <span style={valueStyle}>{selectedBus.id}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={labelStyle}>Route</span>
            <span style={valueStyle}>{selectedBus.route}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={labelStyle}>Speed</span>
            <span style={{ ...valueStyle, color: '#00d4ff' }}>{selectedBus.speed} km/h</span>
          </div>

          <div style={detailRowStyle}>
            <span style={labelStyle}>Passengers</span>
            <span style={{ ...valueStyle, color: '#aa3bff' }}>{selectedBus.passengers}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={labelStyle}>Delay</span>
            <span style={{ ...valueStyle, color: selectedBus.delay > 5 ? '#ff006e' : '#4ade80' }}>
              {selectedBus.delay} min
            </span>
          </div>

          <div style={detailRowStyle}>
            <span style={labelStyle}>Latitude</span>
            <span style={valueStyle}>{selectedBus.latitude.toFixed(6)}</span>
          </div>

          <div style={{ ...detailRowStyle, borderBottom: 'none', marginBottom: '0' }}>
            <span style={labelStyle}>Longitude</span>
            <span style={valueStyle}>{selectedBus.longitude.toFixed(6)}</span>
          </div>

          <button 
            style={closeButtonStyle}
            onClick={() => setSelectedBus(null)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3d4e60'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2d3e50'}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}