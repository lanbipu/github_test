import React from 'react'

interface SyncStatusIndicatorProps {
  status: 'idle' | 'syncing' | 'synced' | 'error'
  lastSyncTime?: Date
}

export function SyncStatusIndicator({ status, lastSyncTime }: SyncStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: '⟳',
          label: '同步中...',
          animated: true,
        }
      case 'synced':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: '✓',
          label: '已同步',
          animated: false,
        }
      case 'error':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: '✕',
          label: '同步失败',
          animated: false,
        }
      default:
        return {
          color: 'bg-muted/20 text-muted-foreground border-muted/30',
          icon: '○',
          label: '待同步',
          animated: false,
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs ${config.color}`}>
      <span className={config.animated ? 'animate-spin' : ''}>{config.icon}</span>
      <span>{config.label}</span>
      {lastSyncTime && (
        <span className="text-xs opacity-60">
          {new Date(lastSyncTime).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      )}
    </div>
  )
}

interface ParameterSyncPanelProps {
  parameters: Array<{
    id: string
    name: string
    address: string
    value: number
    syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
    lastSyncTime?: Date
  }>
  onRetrySync?: (parameterId: string) => void
}

export function ParameterSyncPanel({ parameters, onRetrySync }: ParameterSyncPanelProps) {
  const syncedCount = parameters.filter((p) => p.syncStatus === 'synced').length
  const errorCount = parameters.filter((p) => p.syncStatus === 'error').length
  const syncingCount = parameters.filter((p) => p.syncStatus === 'syncing').length

  return (
    <div className="space-y-4">
      {/* 同步统计 */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">已同步</p>
          <p className="text-lg font-bold text-green-400">{syncedCount}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">同步中</p>
          <p className="text-lg font-bold text-yellow-400">{syncingCount}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">错误</p>
          <p className="text-lg font-bold text-red-400">{errorCount}</p>
        </div>
        <div className="bg-muted/10 border border-muted/30 rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">总数</p>
          <p className="text-lg font-bold text-primary">{parameters.length}</p>
        </div>
      </div>

      {/* 参数列表 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {parameters.map((param) => (
          <div
            key={param.id}
            className="bg-input-bg border border-border rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{param.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{param.address}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-primary">{param.value}</span>

              <SyncStatusIndicator status={param.syncStatus} lastSyncTime={param.lastSyncTime} />

              {param.syncStatus === 'error' && (
                <button
                  onClick={() => onRetrySync?.(param.id)}
                  className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  type="button"
                >
                  重试
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
