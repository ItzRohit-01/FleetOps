// FleetOps AI Full-Stack API Client
// Connects to FastAPI backend and Supabase persistence

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('fleetops_auth_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorDetail = 'API request failed'
    try {
      const errJson = await response.json()
      errorDetail = errJson.detail || errJson.message || errorDetail
    } catch {
      errorDetail = `${response.status} ${response.statusText}`
    }
    throw new Error(errorDetail)
  }

  return response.json()
}

export const api = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    login: async (identifier: string, password = 'demo1234') => {
      const res = await request<{
        access_token: string
        token_type: string
        user: any
        role: string
        name: string
        organization: string
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      })
      if (res.access_token) {
        localStorage.setItem('fleetops_auth_token', res.access_token)
        localStorage.setItem('fleetops_user', JSON.stringify({
          role: res.role,
          name: res.name,
          organization: res.organization,
        }))
      }
      return res
    },
    demoAccounts: async () => {
      return request<{ demo_accounts: any[] }>('/auth/demo-accounts')
    },
    logout: () => {
      localStorage.removeItem('fleetops_auth_token')
      localStorage.removeItem('fleetops_user')
    },
  },

  // ─── Vehicles ──────────────────────────────────────────────────────────────
  vehicles: {
    list: async () => request<{ data: any[] }>('/vehicles'),
    updateStatus: async (id: string, status: string, notes?: string) =>
      request<{ success: boolean; data: any }>(`/vehicles/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
  },

  // ─── Drivers ───────────────────────────────────────────────────────────────
  drivers: {
    list: async () => request<{ data: any[] }>('/drivers'),
    updateStatus: async (id: string, status: string) =>
      request<{ success: boolean; data: any }>(`/drivers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // ─── Jobs ──────────────────────────────────────────────────────────────────
  jobs: {
    list: async (status?: string) =>
      request<{ data: any[] }>(status ? `/jobs?status=${status}` : '/jobs'),
    create: async (jobData: any) =>
      request<{ success: boolean; data: any }>('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      }),
  },

  // ─── Trips ─────────────────────────────────────────────────────────────────
  trips: {
    list: async () => request<{ data: any[] }>('/trips'),
    updateProgress: async (id: string, progress: number, current_lat?: number, current_lng?: number) =>
      request<{ success: boolean; data: any }>(`/trips/${id}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ progress, current_lat, current_lng }),
      }),
    complete: async (id: string) =>
      request<{ success: boolean; data: any }>(`/trips/${id}/complete`, {
        method: 'POST',
      }),
  },

  // ─── Dispatch & Recommendations ────────────────────────────────────────────
  // Backend routes: GET /api/dispatch/recommendations, POST /api/dispatch/generate,
  //                 POST /api/dispatch/approve, POST /api/dispatch/reject
  dispatch: {
    list: async () => request<{ data: any[] }>('/dispatch/recommendations'),
    generate: async (jobId: string) =>
      request<{ data: any; message: string }>('/dispatch/generate', {
        method: 'POST',
        body: JSON.stringify({ job_id: jobId }),
      }),
    approve: async (recommendationId: string, approvedBy = 'Dispatcher') =>
      request<{ message: string; trip_id: string }>('/dispatch/approve', {
        method: 'POST',
        body: JSON.stringify({ recommendation_id: recommendationId, approved_by: approvedBy }),
      }),
    reject: async (recommendationId: string, reason: string) =>
      request<{ message: string }>('/dispatch/reject', {
        method: 'POST',
        body: JSON.stringify({ recommendation_id: recommendationId, reason }),
      }),
  },

  // ─── Return Loads (Backhaul) ────────────────────────────────────────────────
  // Backend routes: GET /api/return-loads/matches, POST /api/return-loads/approve
  returnLoads: {
    list: async () => request<{ data: any[] }>('/return-loads/matches'),
    approve: async (matchId: string, approvedBy = 'Dispatcher') =>
      request<{ message: string; trip_id: string }>('/return-loads/approve', {
        method: 'POST',
        body: JSON.stringify({ match_id: matchId, approved_by: approvedBy }),
      }),
    reject: async (matchId: string, reason: string) =>
      request<{ message: string }>('/return-loads/reject', {
        method: 'POST',
        body: JSON.stringify({ match_id: matchId, reason }),
      }),
  },

  // ─── Digital Twin ──────────────────────────────────────────────────────────
  digitalTwin: {
    state: async () => request<{
      fleet_status: any
      active_trips: any[]
      vehicles: any[]
      corridors: any[]
    }>('/digital-twin/state'),
    stepSimulation: async () => request<{
      message: string
      active_trips: number
      completed_count: number
      updates: any[]
    }>('/digital-twin/step-simulation', {
      method: 'POST',
    }),
  },

  // ─── Safety & Incidents ────────────────────────────────────────────────────
  // Backend routes: GET /api/safety/incidents, PATCH /api/safety/incidents/{id}/status
  safety: {
    incidents: async () => request<{ data: any[] }>('/safety/incidents'),
    updateIncidentStatus: async (id: string, status: string, notes?: string) =>
      request<{ message: string; data: any }>(`/safety/incidents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, resolution_note: notes }),
      }),
  },

  // ─── Analytics ─────────────────────────────────────────────────────────────
  analytics: {
    kpis: async () => request<{ kpis: any }>('/analytics/kpis'),
    corridors: async () => request<{ corridors: any[] }>('/analytics/corridors'),
  },

  // ─── Events / Audit Log ────────────────────────────────────────────────────
  events: {
    list: async () => request<{ data: any[] }>('/events'),
  },

  // ─── Maintenance ───────────────────────────────────────────────────────────
  maintenance: {
    list: async (status?: string, vehicleId?: string) => {
      let q = ''
      if (status) q += `?status=${status}`
      if (vehicleId) q += `${q ? '&' : '?'}vehicle_id=${vehicleId}`
      return request<{ data: any[]; count: number }>(`/maintenance${q}`)
    },
    create: async (data: { vehicle_id: string; issue: string; estimated_return?: string; cost_inr?: number }) =>
      request<{ data: any; message: string }>('/maintenance', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: async (recordId: string, status: string, notes?: string, by?: string) =>
      request<{ data: any; message: string; vehicle_returned_to_available: boolean }>(`/maintenance/${recordId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes, by }),
      }),
  },
}
