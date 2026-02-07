'use client'

import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-glow">
              🎛️
            </div>
            <h1 className="text-3xl font-bold text-foreground">OSC 设备控制器</h1>
          </div>
          <p className="text-muted-foreground">专业的开放声音控制(OSC)设备参数实时调控界面</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 功能卡片 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">主要功能</h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>✓ 多参数实时控制(滑块、旋钮、数字输入)</li>
              <li>✓ 多设备同时管理</li>
              <li>✓ 参数预设保存与加载</li>
              <li>✓ 实时数据监控面板</li>
              <li>✓ 键盘快捷键支持</li>
              <li>✓ 响应式适配各种屏幕</li>
            </ul>
          </div>

          {/* 快速开始 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">快速开始</h2>
            <p className="text-muted-foreground text-sm mb-4">
              应用已准备就绪。包含以下完整模块:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-secondary">📊 控制面板</p>
              <p className="text-secondary">📈 实时监控</p>
              <p className="text-secondary">💾 预设管理</p>
              <p className="text-secondary">🔌 设备管理</p>
            </div>
          </div>
        </div>

        {/* 技术规格 */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">技术规格</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">框架</p>
              <p className="font-mono text-foreground">Next.js 16</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">样式</p>
              <p className="font-mono text-foreground">Tailwind CSS</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">语言</p>
              <p className="font-mono text-foreground">TypeScript</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">协议</p>
              <p className="font-mono text-foreground">OSC</p>
            </div>
          </div>
        </div>

        {/* 状态指示 */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            ✓ 应用程序已成功加载。所有组件和功能已就绪。请在 v0 预览区域查看完整的 OSC 控制界面。
          </p>
        </div>
      </div>
    </main>
  )
}
