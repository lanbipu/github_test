import React from 'react'

export type KeyBindingAction =
  | 'toggle_group'
  | 'increment_param'
  | 'decrement_param'
  | 'reset_param'
  | 'sync_all'
  | 'switch_tab'

export interface KeyBinding {
  keys: string[]
  action: KeyBindingAction
  description: string
}

interface KeyboardControlProps {
  onAction?: (action: KeyBindingAction, payload?: any) => void
  enabled?: boolean
}

const DEFAULT_BINDINGS: KeyBinding[] = [
  {
    keys: ['ArrowUp'],
    action: 'increment_param',
    description: '增加参数值',
  },
  {
    keys: ['ArrowDown'],
    action: 'decrement_param',
    description: '减少参数值',
  },
  {
    keys: ['r'],
    action: 'reset_param',
    description: '重置参数',
  },
  {
    keys: ['Ctrl', 's'],
    action: 'sync_all',
    description: '同步所有参数',
  },
  {
    keys: ['Tab'],
    action: 'switch_tab',
    description: '切换选项卡',
  },
]

export function useKeyboardControl(onAction?: (action: KeyBindingAction, payload?: any) => void) {
  const [pressedKeys, setPressedKeys] = React.useState<Set<string>>(new Set())
  const [bindings] = React.useState<KeyBinding[]>(DEFAULT_BINDINGS)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newPressedKeys = new Set(pressedKeys)
      newPressedKeys.add(e.key)
      setPressedKeys(newPressedKeys)

      // 检查是否匹配任何绑定
      for (const binding of bindings) {
        const allKeysPressed = binding.keys.every((key) => {
          if (key.toLowerCase() === 'ctrl') return e.ctrlKey || e.metaKey
          if (key.toLowerCase() === 'shift') return e.shiftKey
          if (key.toLowerCase() === 'alt') return e.altKey
          return newPressedKeys.has(key)
        })

        if (allKeysPressed) {
          e.preventDefault()
          onAction?.(binding.action, { keys: binding.keys })
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const newPressedKeys = new Set(pressedKeys)
      newPressedKeys.delete(e.key)
      setPressedKeys(newPressedKeys)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [pressedKeys, bindings, onAction])

  return { bindings, pressedKeys }
}

interface KeyboardShortcutRefProps {}

export function KeyboardShortcutRef(_: KeyboardShortcutRefProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">键盘快捷键</h3>

      <div className="space-y-2">
        {DEFAULT_BINDINGS.map((binding) => (
          <div key={binding.action} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{binding.description}</span>
            <div className="flex gap-1">
              {binding.keys.map((key) => (
                <kbd
                  key={key}
                  className="px-2 py-1 bg-input-bg border border-border rounded text-foreground font-mono text-xs"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        <p>使用键盘快捷键快速控制参数</p>
      </div>
    </div>
  )
}
