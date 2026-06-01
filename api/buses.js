import { supabase } from './utils/db';

export default async function handler(req, res) {
  const { data } = await supabase.from('buses').select('*');
  res.status(200).json(data);
}