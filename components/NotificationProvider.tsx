'use client'

import React from 'react'

interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

interface NotificationContextType {
  notifications: NotificationProps[]
  addNotification: (notification: Omit<NotificationProps, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationProps[]>([])

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const id = `notification-${Date.now()}`
    const fullNotification: NotificationProps = {
      ...notification,
      id,
      duration: notification.duration ?? 3000,
    }

    setNotifications((prev) => [...prev, fullNotification])

    if (fullNotification.duration && fullNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, fullNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification 必须在 NotificationProvider 内使用')
  }
  return context
}

interface NotificationContainerProps {
  notifications: NotificationProps[]
  onRemove: (id: string) => void
}

function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: NotificationProps
  onRemove: () => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-400'
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-400'
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
      default:
        return 'bg-primary/20 border-primary/30 text-primary'
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '!'
      default:
        return 'ℹ'
    }
  }

  return (
    <div
      className={`pointer-events-auto border rounded-lg p-3 flex items-start gap-3 min-w-80 ${getTypeStyles()} animate-in fade-in slide-in-from-right-2 duration-200`}
    >
      <span className="flex-shrink-0 mt-0.5 text-lg">{getIcon()}</span>

      <div className="flex-1 min-w-0">
        <p className="font-medium">{notification.title}</p>
        {notification.message && <p className="text-sm opacity-80 mt-1">{notification.message}</p>}
      </div>

      <button
        onClick={onRemove}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        type="button"
      >
        ✕
      </button>
    </div>
  )
}
