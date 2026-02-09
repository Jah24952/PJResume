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

export async function saveResume(payload: any) {
  const res = await fetch(
    'https://project-rs-ats.project-rs-ats.workers.dev/resume',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to save resume')
  }

  return res.json()
}

export async function fetchResumes(userId: number) {
  const res = await fetch(
    `https://project-rs-ats.project-rs-ats.workers.dev/resumes?userId=${userId}`
  )
  if (!res.ok) throw new Error('Failed to fetch resumes')
  return res.json()
}

export async function fetchResumeById(id: string) {
  const res = await fetch(
    `https://project-rs-ats.project-rs-ats.workers.dev/resume/${id}`
  )
  if (!res.ok) throw new Error('Failed to fetch resume')
  return res.json()
}

export async function fetchAdminStats() {
  const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/admin/stats')
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function fetchUsers() {
  const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/admin/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function changePassword(payload: any) {
  const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to change password')
  }
  return res.json()
}
