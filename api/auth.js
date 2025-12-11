// api/auth.js  ←  FINAL WORKING VERSION
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { key, hwid } = req.body || {};

  if (!key || !hwid) return res.status(400).json({ success: false, message: "missing" });

  const stored = await redis.get(`hwid:${key}`);

  if (!stored) {
    await redis.set(`hwid:${key}`, hwid);
    return res.json({ success: true, registered: true });
  }

  if (stored === hwid) {
    return res.json({ success: true, registered: false });
  }

  return res.status(403).json({ success: false, message: "HWID locked" });
}

export const config = { api: { bodyParser: true } };
