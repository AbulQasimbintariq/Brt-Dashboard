import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function BusMap({ buses }) {
  return (
    <MapContainer center={[24.8607, 67.0011]} zoom={12} className="h-96 rounded w-full" style={{ height: '400px', marginBottom: '20px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {buses && buses.map(bus => (
        <Marker key={bus.id} position={[bus.latitude || bus.lat || 0, bus.longitude || bus.lng || 0]}>
          <Popup>
            <div>
              <strong>{bus.route}</strong><br/>
              Speed: {bus.speed} km/h<br/>
              Passengers: {bus.passengers}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}