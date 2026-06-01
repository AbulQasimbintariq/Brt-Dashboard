export async function getBuses() {
  const res = await fetch('/api/buses');
  return res.json();
}