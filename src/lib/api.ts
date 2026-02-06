export async function analyzeATS(payload: {
  resumeText: string
  jobKeywords: string[]
}) {
  const res = await fetch(
    'https://project-rs-ats.project-rs-ats.workers.dev/ats/score',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )

  if (!res.ok) {
    throw new Error('ATS analyze failed')
  }

  return res.json()
}
