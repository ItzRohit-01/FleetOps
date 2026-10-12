// ─── Core Entity Types ────────────────────────────────────────────────────────

export type VehicleStatus = 'available' | 'assigned' | 'on-trip' | 'maintenance' | 'offline'
export type VehicleType = 'heavy-truck' | 'medium-truck' | 'light-truck' | 'van' | 'tanker'
export type FuelType = 'diesel' | 'petrol' | 'cng' | 'electric'

export interface Vehicle {
  id: string
  regNumber: string
  type: VehicleType
  make: string
  model: string
  year: number
  status: VehicleStatus
  currentDriverId?: string
  currentJobId?: string
  location: { lat: number; lng: number; city: string }
  capacityKg: number
  fuelType: FuelType
  lastServiceDate: string
  nextServiceDate: string
  mileageKm: number
  complianceStatus: 'valid' | 'expiring-soon' | 'expired'
  depot: string
}

export type DriverStatus = 'available' | 'on-trip' | 'off-duty' | 'on-leave'
export type DriverRisk = 'low' | 'medium' | 'high'

export interface Driver {
  id: string
  name: string
  licenseNumber: string
  licenseExpiry: string
  status: DriverStatus
  currentVehicleId?: string
  currentJobId?: string
  riskScore: DriverRisk
  hoursThisWeek: number
  phone: string
  joinDate: string
  violations: number
  depot: string
  rating: number
}

export type JobStatus = 'unassigned' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled'
export type JobPriority = 'critical' | 'high' | 'medium' | 'low'

export interface Job {
  id: string
  jobNumber: string
  customer: string
  origin: string
  destination: string
  scheduledPickup: string
  scheduledDelivery: string
  actualPickup?: string
  actualDelivery?: string
  priority: JobPriority
  status: JobStatus
  cargoType: string
  requiredCapacityKg: number
  estimatedDistanceKm: number
  estimatedCostINR: number
  assignedVehicleId?: string
  assignedDriverId?: string
  notes?: string
  delayMinutes?: number
}

export type TripStatus = 'planned' | 'in-transit' | 'completed' | 'cancelled'

export interface Trip {
  id: string
  jobId: string
  vehicleId: string
  driverId: string
  startTime: string
  endTime?: string
  origin: string
  destination: string
  status: TripStatus
  distanceKm: number
  actualCostINR?: number
  delayMinutes?: number
  onTime: boolean
}

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed'
export type IncidentType = 'accident' | 'near-miss' | 'breakdown' | 'theft' | 'speeding' | 'fatigue' | 'overload' | 'other'

export interface Incident {
  id: string
  type: IncidentType
  severity: IncidentSeverity
  vehicleId?: string
  driverId?: string
  timestamp: string
  description: string
  status: IncidentStatus
  location: string
  assignedTo?: string
  resolution?: string
  actionHistory: { timestamp: string; action: string; by: string }[]
}

export interface ComplianceRecord {
  id: string
  entityType: 'vehicle' | 'driver'
  entityId: string
  type: 'license' | 'registration' | 'insurance' | 'inspection' | 'permit' | 'fitness'
  expiryDate: string
  status: 'valid' | 'expiring-soon' | 'expired'
}

export type RecommendationStatus = 'pending' | 'approved' | 'rejected' | 'overridden'

export interface DispatchRecommendation {
  id: string
  jobId: string
  recommendedVehicleId: string
  recommendedDriverId: string
  alternativeVehicleId?: string
  alternativeDriverId?: string
  estimatedDistanceKm: number
  estimatedTimeMin: number
  estimatedCostINR: number
  reasons: string[]
  warnings: string[]
  status: RecommendationStatus
  approvedBy?: string
  overrideReason?: string
  createdAt: string
  score: number
}

export interface MetricPoint {
  date: string
  value: number
  label?: string
}

export interface DailyMetric {
  date: string
  onTimeDeliveries: number
  totalDeliveries: number
  onTimeRate: number
  utilization: number
  incidentCount: number
  costPerTripINR: number
  emptyReturnRate: number
}

// ─── Application State Types ─────────────────────────────────────────────────

export type UserRole = 'manager' | 'dispatcher' | 'safety' | 'analyst'

export interface RoleConfig {
  role: UserRole
  displayName: string
  title: string
  email: string
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  manager: {
    role: 'manager',
    displayName: 'Vikramaditya Rao',
    title: 'Fleet Operations Director',
    email: 'manager@fleetops.ai',
  },
  dispatcher: {
    role: 'dispatcher',
    displayName: 'Priya Raman',
    title: 'Senior Dispatcher',
    email: 'dispatcher@fleetops.ai',
  },
  safety: {
    role: 'safety',
    displayName: 'Arjun Kumar',
    title: 'Safety & Compliance Officer',
    email: 'safety@fleetops.ai',
  },
  analyst: {
    role: 'analyst',
    displayName: 'Karthik Subramanian',
    title: 'Operations & Freight Analyst',
    email: 'analyst@fleetops.ai',
  },
}
