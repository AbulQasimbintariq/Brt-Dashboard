import { useEffect, useState } from 'react';

// BRT Green Line stops on Khayaban-e-Sher Shah Suri (Surjani to Numaish, Karachi)
const brtGreenLineStops = [
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

const NUMAISH_TERMINAL = { lat: 24.7733, lng: 66.9987 };

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function calculateEtaToNumaish({ latitude, longitude, speed, delay }) {
  if (!latitude || !longitude) return 0;
  const safeSpeed = Math.max(5, Number(speed) || 5);
  const distanceKm = haversineDistanceKm(latitude, longitude, NUMAISH_TERMINAL.lat, NUMAISH_TERMINAL.lng);
  const travelMinutes = (distanceKm / safeSpeed) * 60;
  return Math.max(1, Math.round(travelMinutes + (Number(delay) || 0)));
}

function normalizeBus(bus) {
  const latitude = Number(bus.latitude ?? bus.lat ?? 0);
  const longitude = Number(bus.longitude ?? bus.lng ?? 0);
  const speed = Number(bus.speed ?? 0);
  const delay = Number(bus.delay ?? 0);
  const etaToNumaish = calculateEtaToNumaish({ latitude, longitude, speed, delay });
  return {
    ...bus,
    latitude,
    longitude,
    speed,
    delay,
    etaToNumaish,
    etaToNumaishLabel: `Numaish ${etaToNumaish} min`,
  };
}

export function useBusData() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/buses');
        const result = await response.json();
        // Handle both direct array and {buses: [...]} response formats
        const busesData = Array.isArray(result) ? result : (result.buses || []);
        setBuses(busesData.map(normalizeBus));
      } catch (error) {
        console.error('Failed to fetch buses:', error);
        // Use random mock data on error to ensure 20 buses with varying values
        const mocks = [];
        for (let i = 1; i <= 20; i++) {
          // Pick bus stop from BRT Green Line
          const stop = brtGreenLineStops[(i - 1) % brtGreenLineStops.length];
          // Add slight variation for buses at same stop
          const latVariation = (Math.random() - 0.5) * 0.0006;
          const lngVariation = (Math.random() - 0.5) * 0.0006;
          mocks.push(normalizeBus({
            id: `BRT-${i.toString().padStart(2, '0')}`,
            route: `Khayaban-e-Sher Shah Suri (${stop.name})`,
            latitude: stop.lat + latVariation,
            longitude: stop.lng + lngVariation,
            speed: Math.floor(Math.random() * 40) + 15, // 15-55 km/h
            passengers: Math.floor(Math.random() * 60) + 5, // 5-65 passengers
            delay: Math.floor(Math.random() * 15), // 0-14 minutes
          }));
        }
        setBuses(mocks);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return buses;
}