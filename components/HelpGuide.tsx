import React from 'react'

interface HelpSectionProps {
  title: string
  content: React.ReactNode
  icon?: string
}

function HelpSection({ title, content, icon }: HelpSectionProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="bg-input-bg border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/20 transition-colors text-left"
        type="button"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
        </svg>
      </button>

      {expanded && <div className="border-t border-border px-4 py-3 bg-background/50 text-sm text-muted-foreground space-y-2">{content}</div>}
    </div>
  )
}

export function HelpGuide() {
  return (
    <div className="space-y-4">
      <HelpSection
        title="OSC 协议介绍"
        icon="📡"
        content={
          <div className="space-y-2">
            <p>OSC (Open Sound Control) 是一个网络协议，用于在计算机、声音合成器、其他多媒体设备之间进行通信。</p>
            <p>本应用允许您通过 OSC 协议实时控制连接的音频设备和合成器。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>支持多个设备同时连接</li>
              <li>实时参数同步和监控</li>
              <li>参数预设保存和加载</li>
              <li>直观的可视化控制界面</li>
            </ul>
          </div>
        }
      />

      <HelpSection
        title="快速开始"
        icon="⚡"
        content={
          <div className="space-y-2">
            <p>1. 进入 "设备" 选项卡，添加您的 OSC 设备（需要输入设备 IP 地址和端口）</p>
            <p>2. 选择设备后，在 "控制" 选项卡中调整参数</p>
            <p>3. 使用滑块、旋钮和数字输入框调整各种参数值</p>
            <p>4. 参数会实时同步到连接的设备</p>
            <p>5. 在 "预设" 选项卡保存您喜爱的配置</p>
          </div>
        }
      />

      <HelpSection
        title="参数控制方式"
        icon="🎛️"
        content={
          <div className="space-y-3">
            <div>
              <p className="font-medium mb-1">滑块 (Slider)</p>
              <p>拖动滑块来调整参数。适合需要精细控制的参数。</p>
            </div>
            <div>
              <p className="font-medium mb-1">旋钮 (Knob)</p>
              <p>点击并拖动旋钮来调整。旋转范围从左下到右下，提供直观的物理控制感受。</p>
            </div>
            <div>
              <p className="font-medium mb-1">数字输入 (Number Input)</p>
              <p>直接输入数值或使用 +/- 按钮调整。适合需要精确值的场景。</p>
            </div>
          </div>
        }
      />

      <HelpSection
        title="同步状态说明"
        icon="🔄"
        content={
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>同步中 - 参数正在发送到设备</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span>已同步 - 参数已成功发送并确认</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              <span>同步失败 - 发送失败，可尝试重新同步</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-500"></span>
              <span>待同步 - 参数已更改，等待同步</span>
            </div>
          </div>
        }
      />

      <HelpSection
        title="预设管理"
        icon="💾"
        content={
          <div className="space-y-2">
            <p>预设允许您保存当前的所有参数设置，以便后续快速调用。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>点击 "新建预设" 保存当前配置</li>
              <li>给预设命名和添加描述（可选）</li>
              <li>标记喜爱的预设以快速访问</li>
              <li>点击预设可恢复其中的所有参数值</li>
              <li>删除不需要的预设以清理空间</li>
            </ul>
          </div>
        }
      />

      <HelpSection
        title="设备管理"
        icon="🔌"
        content={
          <div className="space-y-2">
            <p>管理连接到您系统的多个 OSC 设备。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>每个设备需要唯一的名称、IP 地址和端口号</li>
              <li>您可以启用或禁用任何设备</li>
              <li>应用会记录每个设备的最后同步时间</li>
              <li>选择一个设备后，所有参数控制将针对该设备</li>
              <li>可随时添加或删除设备</li>
            </ul>
          </div>
        }
      />

      <HelpSection
        title="实时监控"
        icon="📊"
        content={
          <div className="space-y-2">
            <p>在 "监控" 选项卡中实时查看所有参数的当前值和状态。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>显示每个参数的当前值和允许的范围</li>
              <li>参数趋势指示（上升、下降或稳定）</li>
              <li>参数历史图表显示最近的变化趋势</li>
              <li>快速识别异常或超出范围的值</li>
            </ul>
          </div>
        }
      />

      <HelpSection
        title="常见问题"
        icon="❓"
        content={
          <div className="space-y-3">
            <div>
              <p className="font-medium mb-1">Q: 如何连接 OSC 设备？</p>
              <p>A: 在 "设备" 选项卡中输入设备的 IP 地址和 OSC 监听端口，然后添加设备。确保您的设备正在监听该端口。</p>
            </div>
            <div>
              <p className="font-medium mb-1">Q: 为什么参数无法同步？</p>
              <p>A: 检查网络连接、设备 IP 地址和端口是否正确，以及设备是否在线并监听该端口。</p>
            </div>
            <div>
              <p className="font-medium mb-1">Q: 可以同时控制多个设备吗？</p>
              <p>A: 是的，应用支持多个设备。但同一时间只能控制一个选定的设备。</p>
            </div>
            <div>
              <p className="font-medium mb-1">Q: 预设会保存到哪里？</p>
              <p>A: 预设保存在浏览器的本地存储中。刷新页面后仍会保留。</p>
            </div>
          </div>
        }
      />

      <HelpSection
        title="快捷键"
        icon="⌨️"
        content={
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>增加参数值</span>
              <kbd className="px-2 py-0.5 bg-input-bg border border-border rounded text-xs">↑</kbd>
            </div>
            <div className="flex justify-between">
              <span>减少参数值</span>
              <kbd className="px-2 py-0.5 bg-input-bg border border-border rounded text-xs">↓</kbd>
            </div>
            <div className="flex justify-between">
              <span>重置参数</span>
              <kbd className="px-2 py-0.5 bg-input-bg border border-border rounded text-xs">R</kbd>
            </div>
            <div className="flex justify-between">
              <span>同步所有参数</span>
              <kbd className="px-2 py-0.5 bg-input-bg border border-border rounded text-xs">Ctrl+S</kbd>
            </div>
          </div>
        }
      />
    </div>
  )
}
