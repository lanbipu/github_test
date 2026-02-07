import React from 'react'

interface MonitorDisplayProps {
  title: string
  value: number | string
  unit?: string
  min?: number
  max?: number
  status?: 'normal' | 'warning' | 'error'
  trend?: 'up' | 'down' | 'stable'
  history?: number[]
}

export function MonitorDisplay({
  title,
  value,
  unit = '',
  min,
  max,
  status = 'normal',
  trend,
  history = [],
}: MonitorDisplayProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      default:
        return 'bg-primary/10 border-primary/30 text-primary'
    }
  }

  const getTrendIcon = (t?: string) => {
    switch (t) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  // 绘制迷你图表
  const drawChart = () => {
    if (history.length < 2) return null

    const minVal = Math.min(...history)
    const maxVal = Math.max(...history)
    const range = maxVal - minVal || 1

    const points = history.map((v, i) => {
      const x = (i / (history.length - 1)) * 100
      const y = 100 - ((v - minVal) / range) * 80 - 10
      return `${x},${y}`
    })

    return (
      <svg viewBox="0 0 100 30" className="w-full h-8 mb-2 opacity-60">
        <polyline points={points.join(' ')} fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    )
  }

  return (
    <div className={`rounded-lg p-3 border ${getStatusColor(status)}`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        {trend && <span className="text-sm">{getTrendIcon(trend)}</span>}
      </div>

      {drawChart()}

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums">
          {typeof value === 'number' ? (Math.round(value * 100) / 100).toFixed(1) : value}
        </span>
        {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
      </div>

      {min !== undefined && max !== undefined && (
        <div className="text-xs text-muted-foreground mt-2">
          范围: {min} - {max}
        </div>
      )}
    </div>
  )
}

interface RealtimeDataProps {
  parameters: Array<{
    id: string
    name: string
    value: number
    unit?: string
    min?: number
    max?: number
    status?: 'normal' | 'warning' | 'error'
  }>
}

export function RealtimeData({ parameters }: RealtimeDataProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {parameters.map((param) => (
        <MonitorDisplay
          key={param.id}
          title={param.name}
          value={param.value}
          unit={param.unit}
          min={param.min}
          max={param.max}
          status={param.status}
        />
      ))}
    </div>
  )
}
