const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rw3ijsof42.execute-api.us-east-1.amazonaws.com';

export async function getPredictions() {
  const res = await fetch(`${API_URL}/predictions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch predictions');
  return res.json();
}

export async function getDisease(name: string) {
  const res = await fetch(`${API_URL}/diseases/${name}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${name}`);
  return res.json();
}

export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
