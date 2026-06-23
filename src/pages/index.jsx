import { useState } from 'react';
import { useBusData } from '../hooks/useBusData';
import useLocale from '../hooks/useLocale';
import StatsCard from '../components/StatsCard';
import BusMap from '../components/BusMap';
import DelayGraph from '../components/DelayGraph';
import { exportToPDF } from '../lib/exportPDF';

export default function Dashboard() {
  const buses = useBusData();
  const [showBusDetails, setShowBusDetails] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationSearch, setStationSearch] = useState('');
  const [stationSort, setStationSort] = useState('count');
  const { locale, setLocale, dir, t, formatNumber, formatDateTime } = useLocale();
  const totalPassengers = buses.reduce((a, b) => a + b.passengers, 0);
  const avgSpeed = buses.length > 0 ? buses.reduce((a, b) => a + b.speed, 0) / buses.length : 0;

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
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  };

  const headerLeftStyle = {
    flex: '1 1 320px',
    minWidth: 0,
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    maxWidth: '420px',
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

  const stationList = [
    { name: 'Surjani Terminal', lat: 24.8945, lng: 67.0844 },
    { name: 'Orangi Town', lat: 24.8854, lng: 67.0789 },
    { name: 'Gulshan-e-Iqbal', lat: 24.8714, lng: 67.0657 },
    { name: 'Nazimabad', lat: 24.8594, lng: 67.0564 },
    { name: 'Gulberg', lat: 24.8485, lng: 67.0491 },
    { name: 'Liaquatabad', lat: 24.8356, lng: 67.0428 },
    { name: 'Sohrab Goth', lat: 24.8267, lng: 67.0365 },
    { name: 'Maripur', lat: 24.8178, lng: 67.0302 },
    { name: 'North Karachi', lat: 24.8089, lng: 67.0239 },
    { name: 'Federal B Area', lat: 24.8000, lng: 67.0176 },
    { name: 'Malir City', lat: 24.7911, lng: 67.0113 },
    { name: 'Bin Qasim', lat: 24.7822, lng: 67.0050 },
    { name: 'Numaish Terminal', lat: 24.7733, lng: 66.9987 },
  ];

  const stationMetrics = buses.reduce((acc, bus) => {
    const match = String(bus.route).match(/\(([^)]+)\)$/);
    if (match) {
      const station = match[1];
      if (!acc[station]) acc[station] = { count: 0, delay: 0, speed: 0 };
      acc[station].count += 1;
      acc[station].delay += Number(bus.delay || 0);
      acc[station].speed += Number(bus.speed || 0);
    }
    return acc;
  }, {});

  const stationCards = stationList.map((station) => {
    const metrics = stationMetrics[station.name] || { count: 0, delay: 0, speed: 0 };
    const averageDelay = metrics.count ? metrics.delay / metrics.count : 0;
    const averageSpeed = metrics.count ? metrics.speed / metrics.count : 0;
    let status = 'Stable';
    let statusColor = '#22c55e';
    if (averageDelay >= 8) {
      status = 'Delayed';
      statusColor = '#f97316';
    } else if (averageDelay >= 4) {
      status = 'Moderate';
      statusColor = '#fbbf24';
    }
    return {
      ...station,
      count: metrics.count,
      averageDelay,
      averageSpeed,
      status,
      statusColor,
    };
  });

  const filteredStations = stationCards
    .filter((station) => station.name.toLowerCase().includes(stationSearch.toLowerCase()))
    .sort((a, b) => {
      if (stationSort === 'count') return b.count - a.count;
      if (stationSort === 'delay') return b.averageDelay - a.averageDelay;
      return a.name.localeCompare(b.name);
    });

  const selectedStationCoordinates = selectedStation
    ? stationCards.find((station) => station.name === selectedStation)
    : null;

  const mainContentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    alignItems: 'flex-start',
  };

  const sidebarStyle = {
    flex: '0 0 280px',
    minWidth: '240px',
    backgroundColor: '#0f1823',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #2d3e50',
  };

  const sidebarHeaderStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#aa3bff',
    marginBottom: '16px',
  };

  const stationSearchStyle = {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #2d3e50',
    backgroundColor: '#0b1320',
    color: '#e2e8f0',
  };

  const stationSortStyle = {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '16px',
    borderRadius: '10px',
    border: '1px solid #2d3e50',
    backgroundColor: '#0b1320',
    color: '#e2e8f0',
  };

  const stationSummaryStyle = {
    fontSize: '13px',
    color: '#cbd5e1',
    marginBottom: '16px',
    lineHeight: 1.5,
  };

  const stationBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    backgroundColor: '#111827',
    color: '#e2e8f0',
    fontSize: '12px',
    fontWeight: '700',
  };

  const stationStatusStyle = {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  };

  const stationItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '10px',
    backgroundColor: '#0b1320',
    marginBottom: '10px',
    border: '1px solid #18223a',
  };

  const stationNameStyle = {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
  };

  const stationCountStyle = {
    minWidth: '28px',
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#1f2937',
    color: '#94a3b8',
    fontSize: '12px',
    textAlign: 'center',
  };

  const busMapColumnStyle = {
    flex: '1 1 420px',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const timestampStyle = {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '16px',
  };

  return (
    <div style={dashboardStyle} dir={dir} lang={locale}>
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <h1 style={titleStyle}>{t('title')}</h1>
          <p style={{ margin: '0', color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>{t('subtitle')}</p>
        </div>
        <div style={buttonGroupStyle}>
          <select value={locale} onChange={(e) => setLocale(e.target.value)} style={{ padding: '8px', borderRadius: 8, border: '1px solid #2d3e50', background: '#0f1823', color: '#e2e8f0', minWidth: '150px' }} aria-label="Language">
            <option value="en">English</option>
            <option value="ur">اردو</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
          </select>
          <div className="action-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%' }}>
            <button
              className="action-button secondary"
              onClick={() => setShowBusDetails(true)}
              aria-label={t('completeInfo')}
              style={{ flex: '1 1 150px', minWidth: 150 }}
            >
              📊 {t('completeInfo')}
            </button>
            <button
              className="action-button primary"
              onClick={() => exportToPDF(buses, 'brt-dashboard')}
              aria-label={t('exportPDF')}
              style={{ flex: '1 1 150px', minWidth: 150 }}
            >
              📥 {t('exportPDF')}
            </button>
          </div>
        </div>
      </div>
      
      <div style={gridStyle}>
        <StatsCard title={t('totalBuses')} value={formatNumber(buses.length)} />
        <StatsCard title={t('avgSpeed')} value={`${formatNumber(avgSpeed, { maximumFractionDigits: 1 })} km/h`} />
        <StatsCard title={t('passengers')} value={formatNumber(totalPassengers)} />
      </div>

      <div style={mainContentStyle}>
        <div style={sidebarStyle}>
          <div style={sidebarHeaderStyle}>Station List</div>
          <div style={stationSummaryStyle}>
            {filteredStations.length} stations found · {formatNumber(buses.length)} active buses
          </div>
          <input
            type="search"
            placeholder="Search stations"
            value={stationSearch}
            onChange={(e) => setStationSearch(e.target.value)}
            style={stationSearchStyle}
            aria-label="Search stations"
          />
          <select
            value={stationSort}
            onChange={(e) => setStationSort(e.target.value)}
            style={stationSortStyle}
            aria-label="Sort stations"
          >
            <option value="count">Most buses</option>
            <option value="delay">Highest delay</option>
            <option value="name">Alphabetical</option>
          </select>
          {filteredStations.length === 0 ? (
            <div style={{ color: '#94a3b8', padding: '12px 0' }}>No stations match your search.</div>
          ) : (
            filteredStations.map((station) => (
              <button
                key={station.name}
                type="button"
                onClick={() => setSelectedStation(selectedStation === station.name ? null : station.name)}
                style={{
                  ...stationItemStyle,
                  width: '100%',
                  backgroundColor: selectedStation === station.name ? '#1f2937' : stationItemStyle.backgroundColor,
                  borderColor: selectedStation === station.name ? '#5b21b6' : stationItemStyle.border,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                aria-pressed={selectedStation === station.name}
              >
                <div>
                  <div style={stationNameStyle}>{station.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px' }}>
                    {station.count} buses · {formatNumber(station.averageDelay, { maximumFractionDigits: 1 })} min avg delay
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ ...stationBadgeStyle, marginBottom: '8px' }}>
                    {station.count}
                  </span>
                  <div style={{ ...stationStatusStyle, color: station.statusColor }}>
                    {station.status}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div style={busMapColumnStyle}>
          <BusMap buses={buses} selectedStation={selectedStationCoordinates} />
          <DelayGraph buses={buses} />
        </div>
      </div>
      
      <p style={timestampStyle}>
        {t('lastUpdated')}: {formatDateTime(new Date())}
      </p>

      {/* Complete Bus Information Modal */}
      <div style={modalOverlayStyle} onClick={() => setShowBusDetails(false)}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
            {t('completeInfo')}
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
                  <span style={{ ...busValueStyle, color: '#00d4ff' }}>{formatNumber(bus.speed, { maximumFractionDigits: 1 })} km/h</span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Passengers:</span>
                  <span style={{ ...busValueStyle, color: '#aa3bff' }}>{formatNumber(bus.passengers)}</span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Delay:</span>
                  <span style={{ ...busValueStyle, color: bus.delay > 5 ? '#ff006e' : '#4ade80' }}>
                    {formatNumber(bus.delay)} min
                  </span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>ETA to Numaish:</span>
                  <span style={{ ...busValueStyle, color: '#facc15' }}>
                    {bus.etaToNumaishLabel}
                  </span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Latitude:</span>
                  <span style={busValueStyle}>{formatNumber(bus.latitude, { maximumFractionDigits: 6 })}</span>
                </div>

                <div style={busCardRowStyle}>
                  <span style={buslabelStyle}>Longitude:</span>
                  <span style={busValueStyle}>{formatNumber(bus.longitude, { maximumFractionDigits: 6 })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}