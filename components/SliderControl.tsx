import React from 'react'

interface SliderControlProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  unit?: string
  displayValue?: string
}

export function SliderControl({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = '',
  displayValue,
}: SliderControlProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-mono text-primary">
          {displayValue !== undefined ? displayValue : Math.round(value * 100) / 100}
          {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-input-bg rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        style={{
          background: `linear-gradient(to right, hsl(var(--secondary)) 0%, hsl(var(--secondary)) ${percentage}%, hsl(var(--input-bg)) ${percentage}%, hsl(var(--input-bg)) 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
