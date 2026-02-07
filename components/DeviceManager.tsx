import React from 'react'

export interface OSCDevice {
  id: string
  name: string
  ip: string
  port: number
  enabled: boolean
  lastSync?: Date
}

interface DeviceManagerProps {
  devices: OSCDevice[]
  selectedDeviceId?: string
  onDeviceAdd?: (device: OSCDevice) => void
  onDeviceRemove?: (deviceId: string) => void
  onDeviceSelect?: (deviceId: string) => void
  onDeviceToggle?: (deviceId: string) => void
}

export function DeviceManager({
  devices,
  selectedDeviceId,
  onDeviceAdd,
  onDeviceRemove,
  onDeviceSelect,
  onDeviceToggle,
}: DeviceManagerProps) {
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    ip: '192.168.1.100',
    port: 9000,
  })

  const handleAddDevice = () => {
    if (formData.name.trim() && formData.ip.trim()) {
      onDeviceAdd?.({
        id: `device-${Date.now()}`,
        name: formData.name,
        ip: formData.ip,
        port: formData.port,
        enabled: true,
        lastSync: new Date(),
      })
      setFormData({ name: '', ip: '192.168.1.100', port: 9000 })
      setShowAddForm(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">设备列表</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          type="button"
        >
          + 添加设备
        </button>
      </div>

      {showAddForm && (
        <div className="bg-input-bg border border-border rounded-lg p-3 space-y-2">
          <input
            type="text"
            placeholder="设备名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded text-foreground outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="IP地址"
              value={formData.ip}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded text-foreground outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="端口"
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
              className="w-20 px-2 py-1 text-sm bg-background border border-border rounded text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddDevice}
              className="flex-1 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
              type="button"
            >
              添加
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setFormData({ name: '', ip: '192.168.1.100', port: 9000 })
              }}
              className="flex-1 px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
              type="button"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {devices.length === 0 && !showAddForm && (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">暂无设备</p>
          </div>
        )}

        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => onDeviceSelect?.(device.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all group ${
              selectedDeviceId === device.id
                ? 'bg-primary/10 border-primary'
                : 'bg-input-bg border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeviceToggle?.(device.id)
                }}
                className="flex-shrink-0"
                type="button"
              >
                {device.enabled ? (
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-glow" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-muted" />
                )}
              </button>
              <p className="text-sm font-medium text-foreground flex-1">{device.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeviceRemove?.(device.id)
                }}
                className="text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                type="button"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground ml-5">
              {device.ip}:{device.port}
            </p>
            {device.lastSync && (
              <p className="text-xs text-muted-foreground/60 ml-5">
                最后同步: {new Date(device.lastSync).toLocaleTimeString('zh-CN')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
