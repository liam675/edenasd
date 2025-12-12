import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({success: false})

  const { key, hwid } = req.body || {}
  if (!key || !hwid) return res.status(400).json({success: false})

  const stored = await redis.get(`hwid:${key}`)

  if (!stored) {
    await redis.set(`hwid:${key}`, hwid)
    return res.json({success: true, registered: true})
  }

  return stored === hwid
    ? res.json({success: true, registered: false})
    : res.status(403).json({success: false, message: 'HWID locked'})
}

export const config = { api: { bodyParser: true } }
