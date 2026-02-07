// OSC 协议模拟服务
// 在实际应用中，这里会调用真实的 OSC 库

export interface OSCMessage {
  address: string
  args: (string | number | boolean)[]
  timestamp?: Date
}

export interface OSCConnection {
  deviceId: string
  ip: string
  port: number
  connected: boolean
  lastMessage?: OSCMessage
  messageCount: number
}

class OSCService {
  private connections: Map<string, OSCConnection> = new Map()
  private listeners: Map<string, ((msg: OSCMessage) => void)[]> = new Map()

  /**
   * 建立 OSC 连接
   */
  async connect(deviceId: string, ip: string, port: number): Promise<boolean> {
    try {
      console.log(`[OSC] 正在连接到 ${ip}:${port}`)

      // 模拟连接延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      const connection: OSCConnection = {
        deviceId,
        ip,
        port,
        connected: true,
        messageCount: 0,
      }

      this.connections.set(deviceId, connection)
      console.log(`[OSC] 已连接到 ${ip}:${port}`)

      return true
    } catch (error) {
      console.error(`[OSC] 连接失败: ${error}`)
      return false
    }
  }

  /**
   * 断开 OSC 连接
   */
  disconnect(deviceId: string): boolean {
    const connection = this.connections.get(deviceId)
    if (connection) {
      connection.connected = false
      console.log(`[OSC] 已断开连接: ${deviceId}`)
      return true
    }
    return false
  }

  /**
   * 发送 OSC 消息
   */
  async sendMessage(deviceId: string, message: OSCMessage): Promise<boolean> {
    const connection = this.connections.get(deviceId)

    if (!connection || !connection.connected) {
      console.warn(`[OSC] 设备未连接: ${deviceId}`)
      return false
    }

    try {
      // 模拟消息发送
      connection.lastMessage = {
        ...message,
        timestamp: new Date(),
      }
      connection.messageCount++

      console.log(`[OSC] 消息已发送`)
      console.log(`  地址: ${message.address}`)
      console.log(`  参数: ${message.args.join(', ')}`)
      console.log(`  目标: ${connection.ip}:${connection.port}`)

      // 触发监听器
      this.notifyListeners(message.address, message)

      return true
    } catch (error) {
      console.error(`[OSC] 发送失败: ${error}`)
      return false
    }
  }

  /**
   * 批量发送消息
   */
  async sendBatch(deviceId: string, messages: OSCMessage[]): Promise<boolean> {
    const results = await Promise.all(
      messages.map((msg) => this.sendMessage(deviceId, msg))
    )
    return results.every((r) => r === true)
  }

  /**
   * 订阅 OSC 地址
   */
  subscribe(address: string, callback: (message: OSCMessage) => void): () => void {
    if (!this.listeners.has(address)) {
      this.listeners.set(address, [])
    }

    this.listeners.get(address)!.push(callback)

    // 返回取消订阅函数
    return () => {
      const callbacks = this.listeners.get(address)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  /**
   * 触发监听器
   */
  private notifyListeners(address: string, message: OSCMessage): void {
    const callbacks = this.listeners.get(address) || []
    callbacks.forEach((callback) => {
      try {
        callback(message)
      } catch (error) {
        console.error(`[OSC] 监听器错误: ${error}`)
      }
    })
  }

  /**
   * 获取连接状态
   */
  getConnection(deviceId: string): OSCConnection | undefined {
    return this.connections.get(deviceId)
  }

  /**
   * 获取所有连接
   */
  getAllConnections(): OSCConnection[] {
    return Array.from(this.connections.values())
  }

  /**
   * 清空所有连接
   */
  disconnectAll(): void {
    this.connections.forEach((connection) => {
      connection.connected = false
    })
    this.connections.clear()
    console.log('[OSC] 已断开所有连接')
  }
}

export const oscService = new OSCService()
