'use client'

import React, { useState } from 'react'
import { SliderControl } from '@/components/SliderControl'
import { KnobControl } from '@/components/KnobControl'
import { NumberInput } from '@/components/NumberInput'

export default function OSCController() {
  const [volume, setVolume] = useState(75)
  const [reverb, setReverb] = useState(35)
  const [delayTime, setDelayTime] = useState(500)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题栏 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-glow">
              🎛️
            </div>
            <h1 className="text-3xl font-bold text-foreground">OSC 设备控制器</h1>
          </div>
          <p className="text-muted-foreground text-sm">实时控制连接的OSC设备参数</p>
        </div>

        {/* 主控制面板 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧: 快速访问控制 */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="text-xl">⚡</span>
                快速控制
              </h2>

              <div className="space-y-8">
                <SliderControl
                  label="主音量"
                  value={volume}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={setVolume}
                />

                <KnobControl
                  label="混响"
                  value={reverb}
                  min={0}
                  max={100}
                  onChange={setReverb}
                  size="md"
                />

                <NumberInput
                  label="延迟 (ms)"
                  value={delayTime}
                  min={10}
                  max={2000}
                  step={10}
                  unit="ms"
                  onChange={setDelayTime}
                />
              </div>
            </div>
          </div>

          {/* 右侧: 信息和统计 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 设备信息 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">连接设备</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">设备名称</span>
                  <span className="text-foreground font-medium">Audio Synthesizer Pro</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IP 地址</span>
                  <span className="font-mono text-primary">192.168.1.100:9000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">连接状态</span>
                  <span className="text-green-400 font-medium">已连接</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">协议</span>
                  <span className="text-secondary font-medium">OSC 1.0</span>
                </div>
              </div>
            </div>

            {/* 功能特性 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">主要功能</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-secondary">✓ 滑块控制</p>
                  <p className="text-sm text-secondary">✓ 旋钮控制</p>
                  <p className="text-sm text-secondary">✓ 数字输入</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-secondary">✓ 多设备支持</p>
                  <p className="text-sm text-secondary">✓ 预设管理</p>
                  <p className="text-sm text-secondary">✓ 实时监控</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 参数显示区 */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">参数实时显示</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-input-bg rounded p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-2">主音量</p>
              <p className="text-2xl font-bold text-primary">{volume}%</p>
            </div>
            <div className="bg-input-bg rounded p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-2">混响</p>
              <p className="text-2xl font-bold text-secondary">{reverb}%</p>
            </div>
            <div className="bg-input-bg rounded p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-2">延迟</p>
              <p className="text-2xl font-bold text-accent">{delayTime} ms</p>
            </div>
          </div>
        </div>

        {/* 底部统计信息 */}
        <div className="mt-8 bg-card border border-border rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">设备</p>
            <p className="text-lg font-bold text-primary mt-1">1</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">参数</p>
            <p className="text-lg font-bold text-primary mt-1">3</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">状态</p>
            <p className="text-lg font-bold text-green-400 mt-1">正常</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">协议</p>
            <p className="text-lg font-bold text-secondary mt-1">OSC</p>
          </div>
        </div>
      </div>
    </main>
  )
}

