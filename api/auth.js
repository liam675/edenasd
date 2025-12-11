// api/auth.js   ←  FINAL – just overwrite everything in this fil
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { key, hwid } = req.body || {}

  if (!key || !hwid) {
    return res.status(400).json({ success: false, message: 'Missing key or hwid' })
  }

  try {
    const stored = await redis.get(`hwid:${key}`)

    if (!stored) {
      await redis.set(`hwid:${key}`, hwid)
      return res.status(200).json({ success: true, registered: true })
    }

    if (stored === hwid) {
      return res.status(200).json({ success: true, registered: false })
    }

    return res.status(403).json({ success: false, message: 'HWID locked to another machine' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database error' })
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
}
