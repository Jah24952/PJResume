export async function generateSummary(payload: {
  name: string
  experience: string
  education: string
  skills: string
  jobStyle?: string
  tone?: string
  language?: string
}) {
  const res = await fetch(
    'https://project-rs-ats.project-rs-ats.workers.dev/ai/summary',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  )
  if (!res.ok) throw new Error('AI summary failed')
  return res.json()
}

export async function rewriteText(payload: {
  text: string
  jobStyle?: string
  language?: string
}) {
  const res = await fetch(
    'https://project-rs-ats.project-rs-ats.workers.dev/ai/rewrite',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  )
  if (!res.ok) throw new Error('AI rewrite failed')
  return res.json()
}

export async function translateText(payload: {
  text: string
  targetLang: 'th' | 'en'
}) {
  const res = await fetch(
    'https://project-rs-ats.project-rs-ats.workers.dev/ai/translate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  )
  if (!res.ok) throw new Error('AI translate failed')
  return res.json()
}
