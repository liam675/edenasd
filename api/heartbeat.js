// api/heartbeat.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { key, hwid } = req.body;
    // You can update last_seen timestamp here if you want
    await kv.set(`lastseen:${key}`, Date.now());
    return res.status(200).json({ status: 'alive' });
  }
  res.status(200).json({ status: 'ok' });
}

export const config = { api: { bodyParser: true } };
