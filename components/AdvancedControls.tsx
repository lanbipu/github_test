import React from 'react'

interface AdvancedSliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  label?: string
  unit?: string
  onSyncRequest?: () => void
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error'
}

export function AdvancedSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  unit = '',
  onSyncRequest,
  syncStatus = 'idle',
}: AdvancedSliderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(value)

  React.useEffect(() => {
    if (!isDragging) {
      setLocalValue(value)
    }
  }, [value, isDragging])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    setLocalValue(newValue)
    onChange(newValue)
  }

  const percentage = ((localValue - min) / (max - min)) * 100

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'bg-yellow-500'
      case 'synced':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-primary'
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{label}</label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-primary">
              {Math.round(localValue * 100) / 100}
              {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
            </span>
            {onSyncRequest && (
              <button
                onClick={onSyncRequest}
                className={`px-2 py-0.5 text-xs font-medium rounded ${getSyncStatusColor()} text-white hover:opacity-80 transition-opacity`}
                type="button"
              >
                {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? '✓' : syncStatus === 'error' ? 'Retry' : 'Sync'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="w-full h-2 bg-input-bg rounded-full appearance-none cursor-pointer focus:outline-none transition-all"
          style={{
            background: `linear-gradient(to right, hsl(var(--secondary)) 0%, hsl(var(--secondary)) ${percentage}%, hsl(var(--input-bg)) ${percentage}%, hsl(var(--input-bg)) 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span className={isDragging ? 'text-primary' : ''}>{Math.round(percentage)}%</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

interface AdvancedKnobProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label?: string
  unit?: string
  size?: 'sm' | 'md' | 'lg'
  onSyncRequest?: () => void
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error'
}

export function AdvancedKnob({
  value,
  min = 0,
  max = 100,
  onChange,
  label,
  unit = '',
  size = 'md',
  onSyncRequest,
  syncStatus = 'idle',
}: AdvancedKnobProps) {
  const radius = size === 'sm' ? 35 : size === 'lg' ? 55 : 45
  const circumference = 2 * Math.PI * radius
  const percentage = ((value - min) / (max - min)) * 100
  const offset = circumference - (percentage / 100) * circumference

  const [isDragging, setIsDragging] = React.useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.clientX - rect.left - centerX
      const y = moveEvent.clientY - rect.top - centerY

      let angle = Math.atan2(y, x) * (180 / Math.PI) + 90

      if (angle < 0) angle += 360

      const startAngle = 135
      const endAngle = 45

      let normalizedAngle = angle - startAngle
      if (normalizedAngle < 0) normalizedAngle += 360

      const angleRange = endAngle - startAngle + 360
      const percent = (normalizedAngle / angleRange) * 100

      const newValue = min + (percent / 100) * (max - min)
      onChange(Math.max(min, Math.min(max, newValue)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'hsl(45, 93%, 43%)'
      case 'synced':
        return 'hsl(142, 72%, 29%)'
      case 'error':
        return 'hsl(0, 84%, 60%)'
      default:
        return 'hsl(var(--primary))'
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg
          width={radius * 2.5}
          height={radius * 2.5}
          viewBox={`0 0 ${radius * 2.5} ${radius * 2.5}`}
          className={`cursor-grab active:cursor-grabbing drop-shadow-lg ${isDragging ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
        >
          {/* 背景圆环 */}
          <circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />

          {/* 背景圆弧 */}
          <circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius - 8}
            fill="none"
            stroke="hsl(var(--input-bg))"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform={`rotate(-135 ${radius * 1.25} ${radius * 1.25})`}
          />

          {/* 值圆弧 */}
          <circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius - 8}
            fill="none"
            stroke={getSyncStatusColor()}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-135 ${radius * 1.25} ${radius * 1.25})`}
            style={{ transition: 'stroke-dashoffset 0.1s' }}
          />

          {/* 指示针 */}
          <g transform={`rotate(${percentage * 2.7 - 135} ${radius * 1.25} ${radius * 1.25})`}>
            <rect
              x={radius * 1.25 - 2}
              y={radius * 1.25 - radius + 12}
              width="4"
              height={radius - 14}
              fill={getSyncStatusColor()}
              rx="2"
            />
          </g>

          {/* 中心圆 */}
          <circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r="8"
            fill={getSyncStatusColor()}
            filter={`drop-shadow(0 0 4px ${getSyncStatusColor()})`}
          />
        </svg>
      </div>

      <div className="text-center">
        {label && <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>}
        <p className="text-lg font-mono font-bold text-primary">
          {Math.round(value * 100) / 100}
          {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
        </p>
        {onSyncRequest && (
          <button
            onClick={onSyncRequest}
            className={`mt-2 px-2 py-0.5 text-xs font-medium rounded ${getSyncStatusColor()} text-white hover:opacity-80 transition-opacity`}
            type="button"
          >
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : 'Sync'}
          </button>
        )}
      </div>
    </div>
  )
}
