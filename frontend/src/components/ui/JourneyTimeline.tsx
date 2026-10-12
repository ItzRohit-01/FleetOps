import type { Job } from '../../types'
import { CheckCircle2, Clock, MapPin, Truck, AlertTriangle } from 'lucide-react'

interface JourneyTimelineProps {
  job: Job
  className?: string
}

export default function JourneyTimeline({ job, className = '' }: JourneyTimelineProps) {
  const isDelayed = (job.delayMinutes ?? 0) > 0
  const isDelivered = job.status === 'delivered'
  const isInTransit = job.status === 'in-transit'

  const stages = [
    {
      label: 'Scheduled Pickup',
      location: job.origin.split(',')[0],
      time: job.scheduledPickup?.replace('T', ' ').slice(11, 16) || '--:--',
      completed: true,
      current: false,
    },
    {
      label: 'Departed Hub',
      location: job.origin.split(',')[1]?.trim() || job.origin,
      time: job.actualPickup?.replace('T', ' ').slice(11, 16) || 'Pending',
      completed: !!job.actualPickup,
      current: isInTransit && !job.delayMinutes,
    },
    {
      label: 'Transit Corridor',
      location: `${job.estimatedDistanceKm} km corridor`,
      time: isDelayed ? `+${job.delayMinutes}m delay` : 'En route',
      completed: isDelivered,
      current: isInTransit,
      isWarning: isDelayed,
    },
    {
      label: 'Destination Delivery',
      location: job.destination.split(',')[0],
      time: job.actualDelivery
        ? job.actualDelivery.replace('T', ' ').slice(11, 16)
        : job.scheduledDelivery?.replace('T', ' ').slice(11, 16) || '--:--',
      completed: isDelivered,
      current: isDelivered,
    },
  ]

  return (
    <div className={`p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/30">
        <div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Trip Progression
          </span>
          <p className="text-xs font-semibold text-on-surface">
            {job.origin.split(',')[0]} → {job.destination.split(',')[0]}
          </p>
        </div>
        {isDelayed && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/10 text-danger border border-danger/20">
            <AlertTriangle className="w-3 h-3" /> Delayed by {job.delayMinutes} min
          </span>
        )}
      </div>

      {/* Visual Step Rail */}
      <div className="relative flex items-center justify-between">
        {/* Progress connecting line */}
        <div className="absolute left-4 right-4 top-3 h-0.5 bg-outline-variant/60 -z-0" />
        <div
          className="absolute left-4 top-3 h-0.5 bg-primary -z-0 transition-all duration-500"
          style={{
            width: isDelivered ? '92%' : isInTransit ? '55%' : '15%',
          }}
        />

        {stages.map((stage, i) => {
          let nodeBg = 'bg-surface-container border-outline-variant text-on-surface-variant'
          if (stage.completed) {
            nodeBg = 'bg-primary border-primary text-white'
          } else if (stage.current) {
            nodeBg = stage.isWarning
              ? 'bg-danger border-danger text-white ring-4 ring-danger/20'
              : 'bg-primary border-primary text-white ring-4 ring-primary/20'
          }

          return (
            <div key={i} className="flex flex-col items-center text-center relative z-10 max-w-[80px]">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] transition-all ${nodeBg}`}>
                {stage.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : stage.isWarning ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <span className="font-bold">{i + 1}</span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-on-surface mt-2 leading-tight">
                {stage.label}
              </p>
              <p className="text-[10px] text-on-surface-variant leading-tight truncate w-full mt-0.5">
                {stage.location}
              </p>
              <span className={`text-[10px] font-mono mt-0.5 ${stage.isWarning ? 'text-danger font-bold' : 'text-on-surface-variant'}`}>
                {stage.time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
