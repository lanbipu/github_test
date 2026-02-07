import React from 'react'

interface KnobControlProps {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  unit?: string
  size?: 'sm' | 'md' | 'lg'
}

export function KnobControl({
  label,
  value,
  min = 0,
  max = 100,
  onChange,
  unit = '',
  size = 'md',
}: KnobControlProps) {
  const radius = size === 'sm' ? 35 : size === 'lg' ? 55 : 45
  const circumference = 2 * Math.PI * radius
  const percentage = ((value - min) / (max - min)) * 100
  const offset = circumference - (percentage / 100) * circumference

  const handleMouseDown = (e: React.MouseEvent) => {
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
      const percentage = (normalizedAngle / angleRange) * 100

      const newValue = min + (percentage / 100) * (max - min)
      onChange(Math.max(min, Math.min(max, newValue)))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={radius * 2.5}
        height={radius * 2.5}
        viewBox={`0 0 ${radius * 2.5} ${radius * 2.5}`}
        className="cursor-grab active:cursor-grabbing drop-shadow-lg"
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
          stroke="hsl(var(--secondary))"
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
            fill="hsl(var(--primary))"
            rx="2"
          />
        </g>

        {/* 中心圆 */}
        <circle
          cx={radius * 1.25}
          cy={radius * 1.25}
          r="8"
          fill="hsl(var(--primary))"
          filter="drop-shadow(0 0 4px hsl(var(--primary)))"
        />
      </svg>

      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-mono font-bold text-primary">
          {Math.round(value * 100) / 100}
          {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  )
}
