import { useEffect, useState } from 'react';

export function useBusData() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/buses');
        const result = await response.json();
        // Handle both direct array and {buses: [...]} response formats
        const busesData = Array.isArray(result) ? result : (result.buses || []);
        setBuses(busesData);
      } catch (error) {
        console.error('Failed to fetch buses:', error);
        // Use mock data on error
        setBuses([
          { id: '1', route: 'Route A', latitude: 24.8607, longitude: 67.0011, speed: 32, passengers: 24, delay: 2 },
          { id: '2', route: 'Route B', latitude: 24.8671, longitude: 67.0328, speed: 27, passengers: 18, delay: 4 },
          { id: '3', route: 'Route C', latitude: 24.8800, longitude: 67.0100, speed: 22, passengers: 35, delay: 6 },
        ]);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return buses;
}