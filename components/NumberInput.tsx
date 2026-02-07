import React from 'react'

interface NumberInputProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  unit?: string
}

export function NumberInput({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = '',
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)))
    }
  }

  const handleIncrement = () => {
    onChange(Math.min(max, value + step))
  }

  const handleDecrement = () => {
    onChange(Math.max(min, value - step))
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2 bg-input-bg rounded-lg p-2 border border-border focus-within:border-primary transition-colors">
        <button
          onClick={handleDecrement}
          className="px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
          type="button"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="flex-1 bg-transparent text-center text-foreground font-mono outline-none"
        />
        <button
          onClick={handleIncrement}
          className="px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
          type="button"
        >
          +
        </button>
        {unit && <span className="text-xs text-muted-foreground ml-1 px-2">{unit}</span>}
      </div>
    </div>
  )
}
