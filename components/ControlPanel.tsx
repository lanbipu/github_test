import React from 'react'

export interface Device {
  id: string
  name: string
  ip: string
  port: number
  status: 'connected' | 'disconnected' | 'connecting'
  lastSeen?: Date
}

export interface Parameter {
  id: string
  name: string
  address: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  type: 'slider' | 'knob' | 'number'
}

export interface ControlGroup {
  id: string
  name: string
  category: 'audio' | 'effects' | 'mixer' | 'custom'
  parameters: Parameter[]
  collapsed?: boolean
}

interface ControlPanelProps {
  device: Device
  groups: ControlGroup[]
  onParameterChange: (groupId: string, parameterId: string, value: number) => void
  onGroupToggle?: (groupId: string) => void
}

export function ControlPanel({
  device,
  groups,
  onParameterChange,
  onGroupToggle,
}: ControlPanelProps) {
  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/20 text-green-400'
      case 'connecting':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'disconnected':
        return 'bg-red-500/20 text-red-400'
    }
  }

  const getStatusDot = (status: Device['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'connecting':
        return 'bg-yellow-500'
      case 'disconnected':
        return 'bg-red-500'
    }
  }

  const getCategoryIcon = (category: ControlGroup['category']) => {
    switch (category) {
      case 'audio':
        return '🔊'
      case 'effects':
        return '✨'
      case 'mixer':
        return '🎚️'
      case 'custom':
        return '⚙️'
    }
  }

  const getCategoryLabel = (category: ControlGroup['category']) => {
    const labels: Record<ControlGroup['category'], string> = {
      audio: '音频',
      effects: '效果',
      mixer: '混音器',
      custom: '自定义',
    }
    return labels[category]
  }

  return (
    <div className="space-y-4 flex-1 overflow-y-auto pr-2">
      {/* 设备状态面板 */}
      <div className="bg-card border border-border rounded-lg p-4 sticky top-0 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-foreground">{device.name}</h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
            <div className={`w-2 h-2 rounded-full ${getStatusDot(device.status)} animate-pulse`} />
            {device.status === 'connected' ? '已连接' : device.status === 'connecting' ? '连接中...' : '未连接'}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {device.ip}:{device.port}
        </p>
      </div>

      {/* 控制组 */}
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
        >
          <button
            onClick={() => onGroupToggle?.(group.id)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/20 transition-colors"
            type="button"
          >
            <div className="flex items-center gap-2 text-left flex-1">
              <span className="text-lg">{getCategoryIcon(group.category)}</span>
              <div>
                <p className="font-semibold text-foreground">{group.name}</p>
                <p className="text-xs text-muted-foreground">{getCategoryLabel(group.category)}</p>
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform ${group.collapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
            </svg>
          </button>

          {!group.collapsed && (
            <div className="border-t border-border px-4 py-3 space-y-4 bg-background/50">
              {group.parameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">{param.name}</label>
                    <span className="text-sm font-mono text-primary">
                      {Math.round(param.value * 100) / 100}
                      {param.unit && <span className="text-xs text-muted-foreground ml-1">{param.unit}</span>}
                    </span>
                  </div>

                  {param.type === 'slider' && (
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={param.value}
                      onChange={(e) => onParameterChange(group.id, param.id, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-input-bg rounded-full appearance-none cursor-pointer focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--secondary)) 0%, hsl(var(--secondary)) ${((param.value - param.min) / (param.max - param.min)) * 100}%, hsl(var(--input-bg)) ${((param.value - param.min) / (param.max - param.min)) * 100}%, hsl(var(--input-bg)) 100%)`,
                      }}
                    />
                  )}

                  {param.type === 'number' && (
                    <div className="flex items-center gap-2 bg-input-bg rounded-lg p-2 border border-border">
                      <button
                        onClick={() => onParameterChange(group.id, param.id, Math.max(param.min, param.value - param.step))}
                        className="px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                        type="button"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-mono text-sm text-foreground">{param.value}</span>
                      <button
                        onClick={() => onParameterChange(group.id, param.id, Math.min(param.max, param.value + param.step))}
                        className="px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
