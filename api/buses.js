import { supabase } from './utils/db';

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

export default async function handler(req, res) {
  const { data } = await supabase.from('buses').select('*');

  // Normalize to an array
  let buses = Array.isArray(data) ? data : [];

  // If more than 20, trim. If fewer, pad with generated mock entries to reach 20.
  const TARGET = 20;
  if (buses.length > TARGET) {
    buses = buses.slice(0, TARGET);
  } else if (buses.length < TARGET) {
    const startIndex = buses.length;
    for (let i = startIndex; i < TARGET; i++) {
      const idx = i + 1;
      // Pick bus stop from BRT Green Line
      const stop = brtGreenLineStops[(idx - 1) % brtGreenLineStops.length];
      // Add slight variation for buses at same stop
      const latVariation = (Math.random() - 0.5) * 0.0006;
      const lngVariation = (Math.random() - 0.5) * 0.0006;
      buses.push({
        id: `BRT-${idx.toString().padStart(2, '0')}`,
        route: `Khayaban-e-Sher Shah Suri (${stop.name})`,
        latitude: stop.lat + latVariation,
        longitude: stop.lng + lngVariation,
        speed: Math.floor(Math.random() * 40) + 15, // 15-55 km/h
        passengers: Math.floor(Math.random() * 60) + 5, // 5-65 passengers
        delay: Math.floor(Math.random() * 15), // 0-14 minutes
      });
    }
  }

  res.status(200).json(buses);
}