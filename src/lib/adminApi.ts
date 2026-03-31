const API_BASE = 'https://project-rs-ats.project-rs-ats.workers.dev/api/admin'
// NOTE: To test with local wrangler, you might want to switch to 'http://localhost:8787/api/admin'

function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (typeof window !== 'undefined') {
    const storage = localStorage.getItem('auth-storage')
    if (storage) {
      try {
        const parsed = JSON.parse(storage)
        const userId = parsed?.state?.user?.id
        if (userId) {
          headers['x-user-id'] = String(userId)
        }
      } catch (e) {}
    }
  }
  return headers
}

export async function fetchAdminDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Failed to load stats')
  return res.json()
}

// Users
export async function fetchAdminUsers() {
  const res = await fetch(`${API_BASE}/users`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Failed to load users')
  return res.json()
}

export async function updateAdminUserRole(id: number, role: string) {
  const res = await fetch(`${API_BASE}/users/${id}/role`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ role })
  })
  if (!res.ok) throw new Error('Failed to update role')
  return res.json()
}

export async function updateAdminUserStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE}/users/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json()
}

// Resumes
export async function fetchAdminResumes() {
  const res = await fetch(`${API_BASE}/resumes`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Failed to load resumes')
  return res.json()
}

export async function deleteAdminResume(id: number) {
  const res = await fetch(`${API_BASE}/resumes/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Failed to delete resume')
  return res.json()
}

// Templates
export async function fetchAdminTemplates() {
  const res = await fetch(`${API_BASE}/templates`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Failed to load templates')
  return res.json()
}

export async function updateAdminTemplateStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE}/templates/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json()
}

// Logs
export async function fetchAdminLogs() {
  const res = await fetch(`${API_BASE}/logs`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Failed to load logs')
  return res.json()
}

export async function logAdminAction(action: string, description: string) {
    const headers = getHeaders()
    const userId = headers['x-user-id'] ? parseInt(headers['x-user-id']) : null
    const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, action, description })
    })
    return res.json()
}

// Settings
export async function fetchAdminSettings() {
  const res = await fetch(`${API_BASE}/settings`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Failed to load settings')
  return res.json()
}

export async function updateAdminSetting(key: string, value: string) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ setting_key: key, setting_value: value })
  })
  if (!res.ok) throw new Error('Failed to update settings')
  return res.json()
}

// Skills
export async function fetchAdminSkills() {
    const res = await fetch(`${API_BASE}/skills`, { headers: getHeaders() })
    if (!res.ok) throw new Error('Failed to load skills')
    return res.json()
}

// Universities
export async function fetchAdminUniversities() {
    const res = await fetch(`${API_BASE}/universities`, { headers: getHeaders() })
    if (!res.ok) throw new Error('Failed to load universities')
    return res.json()
}
