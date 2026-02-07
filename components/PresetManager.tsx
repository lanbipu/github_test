import React from 'react'

export interface Preset {
  id: string
  name: string
  description?: string
  parameters: Record<string, Record<string, number>>
  createdAt: Date
  favorite?: boolean
}

interface PresetManagerProps {
  presets: Preset[]
  onPresetLoad?: (preset: Preset) => void
  onPresetSave?: (preset: Preset) => void
  onPresetDelete?: (presetId: string) => void
  onPresetFavorite?: (presetId: string) => void
}

export function PresetManager({
  presets,
  onPresetLoad,
  onPresetSave,
  onPresetDelete,
  onPresetFavorite,
}: PresetManagerProps) {
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [presetName, setPresetName] = React.useState('')
  const [presetDesc, setPresetDesc] = React.useState('')

  const favoritePresets = presets.filter((p) => p.favorite)
  const otherPresets = presets.filter((p) => !p.favorite)

  const handleSave = () => {
    if (presetName.trim()) {
      onPresetSave?.({
        id: `preset-${Date.now()}`,
        name: presetName,
        description: presetDesc,
        parameters: {},
        createdAt: new Date(),
      })
      setPresetName('')
      setPresetDesc('')
      setShowSaveDialog(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">预设管理</h3>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          type="button"
        >
          + 新建预设
        </button>
      </div>

      {showSaveDialog && (
        <div className="bg-input-bg border border-border rounded-lg p-3 space-y-2">
          <input
            type="text"
            placeholder="预设名称"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded text-foreground outline-none focus:border-primary"
          />
          <textarea
            placeholder="描述（可选）"
            value={presetDesc}
            onChange={(e) => setPresetDesc(e.target.value)}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded text-foreground outline-none focus:border-primary resize-none h-16"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
              type="button"
            >
              保存
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false)
                setPresetName('')
                setPresetDesc('')
              }}
              className="flex-1 px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
              type="button"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 收藏的预设 */}
      {favoritePresets.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase">⭐ 收藏</p>
          <div className="space-y-2">
            {favoritePresets.map((preset) => (
              <PresetItem
                key={preset.id}
                preset={preset}
                onLoad={() => onPresetLoad?.(preset)}
                onDelete={() => onPresetDelete?.(preset.id)}
                onToggleFavorite={() => onPresetFavorite?.(preset.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 其他预设 */}
      {otherPresets.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase">所有预设</p>
          <div className="space-y-2">
            {otherPresets.map((preset) => (
              <PresetItem
                key={preset.id}
                preset={preset}
                onLoad={() => onPresetLoad?.(preset)}
                onDelete={() => onPresetDelete?.(preset.id)}
                onToggleFavorite={() => onPresetFavorite?.(preset.id)}
              />
            ))}
          </div>
        </div>
      )}

      {presets.length === 0 && !showSaveDialog && (
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">暂无预设</p>
        </div>
      )}
    </div>
  )
}

interface PresetItemProps {
  preset: Preset
  onLoad: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}

function PresetItem({ preset, onLoad, onDelete, onToggleFavorite }: PresetItemProps) {
  return (
    <div className="bg-input-bg border border-border rounded-lg p-2 hover:border-primary/50 transition-colors flex items-center gap-2 group">
      <button
        onClick={onToggleFavorite}
        className="text-muted-foreground hover:text-accent transition-colors flex-shrink-0"
        type="button"
        title={preset.favorite ? '取消收藏' : '加入收藏'}
      >
        {preset.favorite ? '⭐' : '☆'}
      </button>

      <button
        onClick={onLoad}
        className="flex-1 text-left hover:text-primary transition-colors"
        type="button"
      >
        <p className="text-sm font-medium text-foreground">{preset.name}</p>
        {preset.description && <p className="text-xs text-muted-foreground">{preset.description}</p>}
      </button>

      <button
        onClick={onDelete}
        className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
        type="button"
        title="删除预设"
      >
        ✕
      </button>
    </div>
  )
}
