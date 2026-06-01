import { supabase } from './utils/db';

export default async function handler(req, res) {
  // BRT API hit کرو، mock data ڈال رہا ہوں
  const mockData = Array.from({length: 15}, (_, i) => ({
    id: i+1,
    route: `BRT-${i+1}`,
    lat: 33.6844 + Math.random()*0.05,
    lng: 73.0479 + Math.random()*0.05,
    speed: 30 + Math.floor(Math.random()*25),
    passengers: 50 + Math.floor(Math.random()*100),
    delay: Math.floor(Math.random()*10),
    updated_at: new Date().toISOString()
  }));

  await supabase.from('buses').upsert(mockData);
  res.status(200).json({updated: mockData.length});
}