// 参数状态管理和同步

import { oscService, type OSCMessage } from './oscService'

export interface ParameterState {
  id: string
  address: string
  value: number
  lastSyncTime?: Date
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
}

export interface GroupParameterState {
  groupId: string
  parameters: ParameterState[]
}

class ParameterManager {
  private states: Map<string, ParameterState> = new Map()
  private subscribers: Map<string, ((state: ParameterState) => void)[]> = new Map()

  /**
   * 更新参数值
   */
  updateParameter(
    parameterId: string,
    address: string,
    value: number
  ): ParameterState {
    const state = this.states.get(parameterId) || {
      id: parameterId,
      address,
      value,
      syncStatus: 'idle' as const,
    }

    state.value = value
    state.syncStatus = 'syncing'

    this.states.set(parameterId, state)
    this.notifySubscribers(parameterId, state)

    return state
  }

  /**
   * 标记参数为已同步
   */
  markSynced(parameterId: string): ParameterState | undefined {
    const state = this.states.get(parameterId)
    if (state) {
      state.syncStatus = 'synced'
      state.lastSyncTime = new Date()
      this.notifySubscribers(parameterId, state)
    }
    return state
  }

  /**
   * 标记参数为同步错误
   */
  markError(parameterId: string): ParameterState | undefined {
    const state = this.states.get(parameterId)
    if (state) {
      state.syncStatus = 'error'
      this.notifySubscribers(parameterId, state)
    }
    return state
  }

  /**
   * 获取参数状态
   */
  getParameter(parameterId: string): ParameterState | undefined {
    return this.states.get(parameterId)
  }

  /**
   * 订阅参数更新
   */
  subscribe(parameterId: string, callback: (state: ParameterState) => void): () => void {
    if (!this.subscribers.has(parameterId)) {
      this.subscribers.set(parameterId, [])
    }

    this.subscribers.get(parameterId)!.push(callback)

    return () => {
      const callbacks = this.subscribers.get(parameterId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  /**
   * 触发订阅者
   */
  private notifySubscribers(parameterId: string, state: ParameterState): void {
    const callbacks = this.subscribers.get(parameterId) || []
    callbacks.forEach((callback) => {
      try {
        callback(state)
      } catch (error) {
        console.error(`[ParameterManager] 订阅者错误: ${error}`)
      }
    })
  }

  /**
   * 同步参数到设备
   */
  async syncToDevice(
    deviceId: string,
    parameterId: string,
    address: string,
    value: number
  ): Promise<boolean> {
    try {
      this.updateParameter(parameterId, address, value)

      // 创建 OSC 消息
      const message: OSCMessage = {
        address,
        args: [value],
        timestamp: new Date(),
      }

      // 发送消息
      const result = await oscService.sendMessage(deviceId, message)

      if (result) {
        this.markSynced(parameterId)
      } else {
        this.markError(parameterId)
      }

      return result
    } catch (error) {
      console.error(`[ParameterManager] 同步失败: ${error}`)
      this.markError(parameterId)
      return false
    }
  }

  /**
   * 批量同步参数
   */
  async syncBatch(
    deviceId: string,
    parameters: Array<{ id: string; address: string; value: number }>
  ): Promise<boolean> {
    const messages: OSCMessage[] = parameters.map((p) => ({
      address: p.address,
      args: [p.value],
    }))

    parameters.forEach((p) => {
      this.updateParameter(p.id, p.address, p.value)
    })

    const result = await oscService.sendBatch(deviceId, messages)

    if (result) {
      parameters.forEach((p) => {
        this.markSynced(p.id)
      })
    } else {
      parameters.forEach((p) => {
        this.markError(p.id)
      })
    }

    return result
  }

  /**
   * 清空所有状态
   */
  clear(): void {
    this.states.clear()
    this.subscribers.clear()
  }
}

export const parameterManager = new ParameterManager()
