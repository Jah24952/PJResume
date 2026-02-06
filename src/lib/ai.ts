export async function generateSummary(payload: {
  name: string
  experience: string
  education: string
  skills: string
  jobStyle?: string
}) {
  const res = await fetch(
    'https://project-rs-ats.project-rs-ats.workers.dev/ai/summary',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )

  if (!res.ok) {
    throw new Error('AI summary failed')
  }

  return res.json()
}
