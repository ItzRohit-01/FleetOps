import { create } from 'zustand'
import type { UserRole, DispatchRecommendation, Job, Vehicle } from '../types'
import {
  recommendations as initRecs,
  jobs as initJobs,
  vehicles as initVehicles,
  drivers as initDrivers,
  incidents as initIncidents,
} from '../data/mockData'
import type { Driver, Incident } from '../types'

interface AppState {
  // Auth / Role
  currentRole: UserRole | null
  login: (role: UserRole) => void
  logout: () => void

  // Data (mutable for interactions)
  jobs: Job[]
  vehicles: Vehicle[]
  drivers: Driver[]
  incidents: Incident[]
  recommendations: DispatchRecommendation[]

  // Dispatch actions
  approveRecommendation: (recId: string, approvedBy: string) => void
  rejectRecommendation: (recId: string, reason: string) => void
  overrideRecommendation: (recId: string, reason: string) => void

  // Incident actions
  updateIncidentStatus: (incidentId: string, status: Incident['status'], note: string) => void

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: null,
  jobs: initJobs,
  vehicles: initVehicles,
  drivers: initDrivers,
  incidents: initIncidents,
  recommendations: initRecs,
  toast: null,

  login: (role) => set({ currentRole: role }),

  logout: () => set({ currentRole: null }),

  approveRecommendation: (recId, approvedBy) => {
    const rec = get().recommendations.find(r => r.id === recId)
    if (!rec) return

    set(state => ({
      recommendations: state.recommendations.map(r =>
        r.id === recId ? { ...r, status: 'approved', approvedBy } : r
      ),
      jobs: state.jobs.map(j =>
        j.id === rec.jobId
          ? { ...j, status: 'assigned', assignedVehicleId: rec.recommendedVehicleId, assignedDriverId: rec.recommendedDriverId }
          : j
      ),
      vehicles: state.vehicles.map(v =>
        v.id === rec.recommendedVehicleId
          ? { ...v, status: 'assigned', currentJobId: rec.jobId, currentDriverId: rec.recommendedDriverId }
          : v
      ),
    }))
    get().showToast(`Assignment approved. Job dispatched to ${rec.recommendedVehicleId}.`, 'success')
  },

  rejectRecommendation: (recId, reason) => {
    set(state => ({
      recommendations: state.recommendations.map(r =>
        r.id === recId ? { ...r, status: 'rejected', overrideReason: reason } : r
      ),
    }))
    get().showToast('Recommendation rejected.', 'info')
  },

  overrideRecommendation: (recId, reason) => {
    set(state => ({
      recommendations: state.recommendations.map(r =>
        r.id === recId ? { ...r, status: 'overridden', overrideReason: reason } : r
      ),
    }))
    get().showToast('Manual override recorded.', 'info')
  },

  updateIncidentStatus: (incidentId, status, note) => {
    set(state => ({
      incidents: state.incidents.map(i =>
        i.id === incidentId
          ? {
              ...i,
              status,
              actionHistory: [...i.actionHistory, {
                timestamp: new Date().toISOString(),
                action: note,
                by: 'Arjun Mehta',
              }],
            }
          : i
      ),
    }))
    get().showToast(`Incident updated: ${status}`, 'success')
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },

  clearToast: () => set({ toast: null }),
}))
