import { create } from 'zustand'
import type { UserRole, DispatchRecommendation, Job, Vehicle, Driver, Incident } from '../types'
import {
  recommendations as initRecs,
  jobs as initJobs,
  vehicles as initVehicles,
  drivers as initDrivers,
  incidents as initIncidents,
} from '../data/mockData'
import { api } from '../lib/api'

// Adapters to map snake_case Supabase fields to frontend TypeScript camelCase types
function adaptVehicle(raw: any): Vehicle {
  return {
    id: raw.id,
    regNumber: raw.reg_number || raw.regNumber || raw.id,
    type: raw.type || 'heavy-truck',
    make: raw.make || 'Tata',
    model: raw.model || 'Prima',
    year: raw.year || 2022,
    status: raw.status || 'available',
    currentDriverId: raw.current_driver_id || raw.currentDriverId,
    currentJobId: raw.current_job_id || raw.currentJobId,
    location: typeof raw.location === 'object' && raw.location !== null ? raw.location : { lat: 13.08, lng: 80.27, city: 'Chennai' },
    capacityKg: raw.capacity_kg ?? raw.capacityKg ?? 25000,
    fuelType: raw.fuel_type || raw.fuelType || 'diesel',
    lastServiceDate: raw.last_service_date || raw.lastServiceDate || '2026-09-01',
    nextServiceDate: raw.next_service_date || raw.nextServiceDate || '2026-12-01',
    mileageKm: raw.mileage_km ?? raw.mileageKm ?? 50000,
    complianceStatus: raw.compliance_status || raw.complianceStatus || 'valid',
    depot: raw.depot || 'Chennai Central Depot',
  }
}

function adaptJob(raw: any): Job {
  return {
    id: raw.id,
    jobNumber: raw.job_number || raw.jobNumber || raw.id,
    customer: raw.customer || 'Tamil Nadu Logistics',
    origin: raw.origin || 'Chennai',
    destination: raw.destination || 'Bengaluru',
    scheduledPickup: raw.scheduled_pickup || raw.scheduledPickup || '2026-10-12T06:00:00Z',
    scheduledDelivery: raw.scheduled_delivery || raw.scheduledDelivery || '2026-10-12T14:00:00Z',
    actualPickup: raw.actual_pickup || raw.actualPickup,
    actualDelivery: raw.actual_delivery || raw.actualDelivery,
    priority: raw.priority || 'high',
    status: raw.status || 'unassigned',
    cargoType: raw.cargo_type || raw.cargoType || 'Automotive Components',
    requiredCapacityKg: raw.required_capacity_kg ?? raw.requiredCapacityKg ?? 15000,
    estimatedDistanceKm: raw.estimated_distance_km ?? raw.estimatedDistanceKm ?? 330,
    estimatedCostINR: raw.estimated_cost_inr ?? raw.estimatedCostINR ?? 32000,
    assignedVehicleId: raw.assigned_vehicle_id || raw.assignedVehicleId,
    assignedDriverId: raw.assigned_driver_id || raw.assignedDriverId,
    notes: raw.notes,
    delayMinutes: raw.delay_minutes ?? raw.delayMinutes ?? 0,
  }
}

function adaptDriver(raw: any): Driver {
  return {
    id: raw.id,
    name: raw.name || 'Driver',
    licenseNumber: raw.license_number || raw.licenseNumber || 'IND-DL-001',
    licenseExpiry: raw.license_expiry || raw.licenseExpiry || '2028-01-01',
    status: raw.status || 'available',
    currentVehicleId: raw.current_vehicle_id || raw.currentVehicleId,
    currentJobId: raw.current_job_id || raw.currentJobId,
    riskScore: raw.risk_score || raw.riskScore || 'low',
    hoursThisWeek: raw.hours_this_week ?? raw.hoursThisWeek ?? 32,
    phone: raw.phone || '+91 98401 23456',
    joinDate: raw.join_date || raw.joinDate || '2023-01-15',
    violations: raw.violations ?? 0,
    depot: raw.depot || 'Chennai Central Depot',
    rating: raw.rating ?? 4.8,
  }
}

function adaptIncident(raw: any): Incident {
  return {
    id: raw.id,
    type: raw.type || 'breakdown',
    severity: raw.severity || 'medium',
    vehicleId: raw.vehicle_id || raw.vehicleId,
    driverId: raw.driver_id || raw.driverId,
    timestamp: raw.created_at || raw.timestamp || new Date().toISOString(),
    description: raw.description || '',
    status: raw.status || 'open',
    location: raw.location || 'NH 48',
    assignedTo: raw.assigned_to || raw.assignedTo,
    resolution: raw.resolution,
    actionHistory: raw.action_history || raw.actionHistory || [],
  }
}

function adaptRecommendation(raw: any): DispatchRecommendation {
  return {
    id: raw.id,
    jobId: raw.job_id || raw.jobId,
    recommendedVehicleId: raw.recommended_vehicle_id || raw.recommendedVehicleId,
    recommendedDriverId: raw.recommended_driver_id || raw.recommendedDriverId,
    alternativeVehicleId: raw.alternative_vehicle_id || raw.alternativeVehicleId,
    alternativeDriverId: raw.alternative_driver_id || raw.alternativeDriverId,
    estimatedDistanceKm: raw.estimated_distance_km ?? raw.estimatedDistanceKm ?? 330,
    estimatedTimeMin: raw.estimated_time_min ?? raw.estimatedTimeMin ?? 360,
    estimatedCostINR: raw.estimated_cost_inr ?? raw.estimatedCostINR ?? 28000,
    reasons: raw.reasons || ['Optimal payload fit', 'Driver within legal HOS'],
    warnings: raw.warnings || [],
    status: raw.status || 'pending',
    approvedBy: raw.approved_by || raw.approvedBy,
    overrideReason: raw.override_reason || raw.overrideReason,
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    score: raw.score ?? 92,
  }
}

// Initial stored user role
function getInitialRole(): UserRole | null {
  try {
    const raw = localStorage.getItem('fleetops_user')
    if (raw) {
      const parsed = JSON.parse(raw)
      return (parsed.role as UserRole) || null
    }
  } catch {
    // Ignore parse error
  }
  return null
}

interface AppState {
  // Auth / Role
  currentRole: UserRole | null
  login: (role: UserRole) => void
  logout: () => void

  // Data
  jobs: Job[]
  vehicles: Vehicle[]
  drivers: Driver[]
  incidents: Incident[]
  recommendations: DispatchRecommendation[]
  isLoadingData: boolean

  // Lifecycle & data fetching
  fetchData: () => Promise<void>

  // Dispatch actions
  approveRecommendation: (recId: string, approvedBy: string) => Promise<void>
  rejectRecommendation: (recId: string, reason: string) => Promise<void>
  overrideRecommendation: (recId: string, reason: string) => void

  // Incident actions
  updateIncidentStatus: (incidentId: string, status: Incident['status'], note: string) => Promise<void>

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: getInitialRole(),
  jobs: initJobs,
  vehicles: initVehicles,
  drivers: initDrivers,
  incidents: initIncidents,
  recommendations: initRecs,
  isLoadingData: false,
  toast: null,

  fetchData: async () => {
    set({ isLoadingData: true })
    try {
      const [vRes, jRes, dRes, rRes, iRes] = await Promise.allSettled([
        api.vehicles.list(),
        api.jobs.list(),
        api.drivers.list(),
        api.dispatch.list(),
        api.safety.incidents(),
      ])

      const updates: Partial<AppState> = {}

      if (vRes.status === 'fulfilled' && vRes.value?.data?.length) {
        updates.vehicles = vRes.value.data.map(adaptVehicle)
      }
      if (jRes.status === 'fulfilled' && jRes.value?.data?.length) {
        updates.jobs = jRes.value.data.map(adaptJob)
      }
      if (dRes.status === 'fulfilled' && dRes.value?.data?.length) {
        updates.drivers = dRes.value.data.map(adaptDriver)
      }
      if (rRes.status === 'fulfilled' && rRes.value?.data?.length) {
        updates.recommendations = rRes.value.data.map(adaptRecommendation)
      }
      if (iRes.status === 'fulfilled' && iRes.value?.data?.length) {
        updates.incidents = iRes.value.data.map(adaptIncident)
      }

      set(updates)
    } catch (err) {
      console.warn('Backend API sync fallback to active dataset', err)
    } finally {
      set({ isLoadingData: false })
    }
  },

  login: (role) => {
    localStorage.setItem('fleetops_user', JSON.stringify({ role, name: role.toUpperCase() }))
    set({ currentRole: role })
    get().fetchData()
  },

  logout: () => {
    api.auth.logout()
    set({ currentRole: null })
  },

  approveRecommendation: async (recId, approvedBy) => {
    const rec = get().recommendations.find(r => r.id === recId)
    if (!rec) return

    // Optimistic / local update first
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

    try {
      await api.dispatch.approve(recId, approvedBy)
      get().showToast(`Assignment approved. Dispatched to ${rec.recommendedVehicleId}.`, 'success')
      // Refresh live server state
      get().fetchData()
    } catch (err: any) {
      get().showToast(`Dispatched locally (${err.message})`, 'info')
    }
  },

  rejectRecommendation: async (recId, reason) => {
    set(state => ({
      recommendations: state.recommendations.map(r =>
        r.id === recId ? { ...r, status: 'rejected', overrideReason: reason } : r
      ),
    }))

    try {
      await api.dispatch.reject(recId, reason)
      get().showToast('Recommendation rejected and logged.', 'info')
      get().fetchData()
    } catch (err: any) {
      get().showToast('Recommendation rejected.', 'info')
    }
  },

  overrideRecommendation: (recId, reason) => {
    set(state => ({
      recommendations: state.recommendations.map(r =>
        r.id === recId ? { ...r, status: 'overridden', overrideReason: reason } : r
      ),
    }))
    get().showToast('Manual override recorded.', 'info')
  },

  updateIncidentStatus: async (incidentId, status, note) => {
    set(state => ({
      incidents: state.incidents.map(i =>
        i.id === incidentId
          ? {
              ...i,
              status,
              actionHistory: [
                ...i.actionHistory,
                {
                  timestamp: new Date().toISOString(),
                  action: note,
                  by: 'Safety Officer',
                },
              ],
            }
          : i
      ),
    }))

    try {
      await api.safety.updateIncidentStatus(incidentId, status, note)
      get().showToast(`Incident updated to ${status}`, 'success')
      get().fetchData()
    } catch (err: any) {
      get().showToast(`Incident updated locally (${err.message})`, 'info')
    }
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },

  clearToast: () => set({ toast: null }),
}))

// Auto-trigger data fetch on startup
useAppStore.getState().fetchData()
