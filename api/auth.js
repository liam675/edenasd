// api/auth.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { key, hwid } = req.body;

  if (!key || !hwid) {
    return res.status(400).json({ success: false, message: 'Missing key or hwid' });
  }

  const storedHwid = await kv.get(`hwid:${key}`);

  // First time using this key → lock the HWID
  if (!storedHwid) {
    return res.status(200).json({ success: true, registered: true });
  }

  // Already registered → check if HWID matches
  if (storedHwid === hwid) {
    return res.status(200).json({ success: true, registered: false });
  } else {
    return res.status(403).json({ success: false, message: 'HWID locked to another machine' });
  }
}

// Needed so Vercel parses JSON body correctly
export const config = {
  api: {
    bodyParser: true,
  },
};
