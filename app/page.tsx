'use client'

import React, { useState } from 'react'
import { SliderControl } from '@/components/SliderControl'
import { KnobControl } from '@/components/KnobControl'
import { NumberInput } from '@/components/NumberInput'
import { ControlPanel, type Device, type ControlGroup } from '@/components/ControlPanel'
import { PresetManager, type Preset } from '@/components/PresetManager'
import { DeviceManager, type OSCDevice } from '@/components/DeviceManager'
import { RealtimeData } from '@/components/MonitorDisplay'

export default function OSCController() {
  const [activeTab, setActiveTab] = useState<'control' | 'monitor' | 'preset' | 'device'>('control')

  // 示例设备
  const [device] = useState<Device>({
    id: 'device-1',
    name: 'Audio Synthesizer Pro',
    ip: '192.168.1.100',
    port: 9000,
    status: 'connected',
    lastSeen: new Date(),
  })

  // 设备列表
  const [devices, setDevices] = useState<OSCDevice[]>([
    {
      id: 'device-1',
      name: 'Audio Synthesizer Pro',
      ip: '192.168.1.100',
      port: 9000,
      enabled: true,
      lastSync: new Date(),
    },
  ])

  const [selectedDeviceId, setSelectedDeviceId] = useState('device-1')

  // 预设列表
  const [presets, setPresets] = useState<Preset[]>([
    {
      id: 'preset-1',
      name: '柔和电子乐',
      description: '适合低频混响效果',
      parameters: {},
      createdAt: new Date(),
      favorite: true,
    },
    {
      id: 'preset-2',
      name: '清晰高音',
      description: '突出高频',
      parameters: {},
      createdAt: new Date(),
      favorite: false,
    },
  ])
  const [groups, setGroups] = useState<ControlGroup[]>([
    {
      id: 'audio-1',
      name: '音量控制',
      category: 'audio',
      parameters: [
        {
          id: 'master-vol',
          name: '主音量',
          address: '/master/volume',
          value: 75,
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
          type: 'slider',
        },
        {
          id: 'osc1-vol',
          name: '振荡器1音量',
          address: '/osc1/volume',
          value: 60,
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
          type: 'knob',
        },
        {
          id: 'osc2-vol',
          name: '振荡器2音量',
          address: '/osc2/volume',
          value: 45,
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
          type: 'knob',
        },
      ],
      collapsed: false,
    },
    {
      id: 'freq-1',
      name: '频率设置',
      category: 'audio',
      parameters: [
        {
          id: 'freq-1-value',
          name: '频率1',
          address: '/freq/1',
          value: 440,
          min: 20,
          max: 20000,
          step: 10,
          unit: 'Hz',
          type: 'slider',
        },
        {
          id: 'freq-2-value',
          name: '频率2',
          address: '/freq/2',
          value: 880,
          min: 20,
          max: 20000,
          step: 10,
          unit: 'Hz',
          type: 'slider',
        },
      ],
      collapsed: false,
    },
    {
      id: 'effects-1',
      name: '混响效果',
      category: 'effects',
      parameters: [
        {
          id: 'reverb-amount',
          name: '混响量',
          address: '/reverb/amount',
          value: 35,
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
          type: 'knob',
        },
        {
          id: 'reverb-decay',
          name: '混响衰减',
          address: '/reverb/decay',
          value: 2.5,
          min: 0.1,
          max: 10,
          step: 0.1,
          unit: 's',
          type: 'slider',
        },
      ],
      collapsed: false,
    },
    {
      id: 'effects-2',
      name: '延迟效果',
      category: 'effects',
      parameters: [
        {
          id: 'delay-time',
          name: '延迟时间',
          address: '/delay/time',
          value: 500,
          min: 10,
          max: 2000,
          step: 10,
          unit: 'ms',
          type: 'number',
        },
        {
          id: 'delay-feedback',
          name: '延迟反馈',
          address: '/delay/feedback',
          value: 0.6,
          min: 0,
          max: 0.99,
          step: 0.01,
          unit: '',
          type: 'slider',
        },
      ],
      collapsed: false,
    },
  ])

  const handleParameterChange = (groupId: string, parameterId: string, value: number) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              parameters: group.parameters.map((param) =>
                param.id === parameterId ? { ...param, value } : param
              ),
            }
          : group
      )
    )

    // 实际应用中这里会发送OSC消息
    console.log(`[v0] OSC 消息已发送到 ${device.ip}:${device.port}`)
    const targetParam = groups
      .find((g) => g.id === groupId)
      ?.parameters.find((p) => p.id === parameterId)
    if (targetParam) {
      console.log(`[v0] 地址: ${targetParam.address}, 值: ${value}`)
    }
  }

  const handleGroupToggle = (groupId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
      )
    )
  }

  const handleAddDevice = (device: OSCDevice) => {
    setDevices([...devices, device])
  }

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter((d) => d.id !== deviceId))
    if (selectedDeviceId === deviceId) {
      setSelectedDeviceId(devices[0]?.id || '')
    }
  }

  const handleToggleDevice = (deviceId: string) => {
    setDevices(
      devices.map((d) => (d.id === deviceId ? { ...d, enabled: !d.enabled } : d))
    )
  }

  const handleAddPreset = (preset: Preset) => {
    setPresets([...presets, preset])
  }

  const handleDeletePreset = (presetId: string) => {
    setPresets(presets.filter((p) => p.id !== presetId))
  }

  const handleToggleFavorite = (presetId: string) => {
    setPresets(
      presets.map((p) => (p.id === presetId ? { ...p, favorite: !p.favorite } : p))
    )
  }

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

        {/* 选项卡导航 */}
        <div className="mb-6 flex gap-2 border-b border-border">
          {[
            { id: 'control', label: '🎛️ 控制', icon: '🎛️' },
            { id: 'monitor', label: '📊 监控', icon: '📊' },
            { id: 'preset', label: '💾 预设', icon: '💾' },
            { id: 'device', label: '🔌 设备', icon: '🔌' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 控制选项卡 */}
        {activeTab === 'control' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧: 快速访问控制 */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  快速控制
                </h2>

                <div className="space-y-6">
                  <SliderControl
                    label="主音量"
                    value={groups[0]?.parameters[0]?.value || 0}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(value) => handleParameterChange('audio-1', 'master-vol', value)}
                  />

                  <KnobControl
                    label="混响"
                    value={groups[2]?.parameters[0]?.value || 0}
                    min={0}
                    max={100}
                    onChange={(value) => handleParameterChange('effects-1', 'reverb-amount', value)}
                    size="md"
                  />

                  <NumberInput
                    label="延迟 (ms)"
                    value={groups[3]?.parameters[0]?.value || 0}
                    min={10}
                    max={2000}
                    step={10}
                    unit="ms"
                    onChange={(value) => handleParameterChange('effects-2', 'delay-time', value)}
                  />
                </div>
              </div>
            </div>

            {/* 右侧: 完整控制面板 */}
            <div className="lg:col-span-2">
              <ControlPanel
                device={device}
                groups={groups}
                onParameterChange={handleParameterChange}
                onGroupToggle={handleGroupToggle}
              />
            </div>
          </div>
        )}

        {/* 监控选项卡 */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">实时参数监控</h2>
              <RealtimeData
                parameters={groups
                  .flatMap((g) => g.parameters)
                  .slice(0, 8)
                  .map((p) => ({
                    id: p.id,
                    name: p.name,
                    value: p.value,
                    unit: p.unit,
                    min: p.min,
                    max: p.max,
                    status: Math.random() > 0.8 ? 'warning' : 'normal',
                  }))}
              />
            </div>
          </div>
        )}

        {/* 预设选项卡 */}
        {activeTab === 'preset' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PresetManager
                presets={presets}
                onPresetSave={handleAddPreset}
                onPresetDelete={handleDeletePreset}
                onPresetFavorite={handleToggleFavorite}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">预设详情</h3>
                <p className="text-muted-foreground">选择一个预设来查看详细信息</p>
              </div>
            </div>
          </div>
        )}

        {/* 设备选项卡 */}
        {activeTab === 'device' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DeviceManager
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                onDeviceAdd={handleAddDevice}
                onDeviceRemove={handleRemoveDevice}
                onDeviceSelect={setSelectedDeviceId}
                onDeviceToggle={handleToggleDevice}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">设备配置</h3>
                {selectedDeviceId && devices.find((d) => d.id === selectedDeviceId) && (
                  <div className="space-y-3">
                    {(() => {
                      const dev = devices.find((d) => d.id === selectedDeviceId)
                      return (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">设备名称</p>
                            <p className="text-foreground font-medium">{dev?.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">IP 地址</p>
                            <p className="text-foreground font-mono">{dev?.ip}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">端口</p>
                            <p className="text-foreground font-mono">{dev?.port}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">状态</p>
                            <p className={`font-medium ${dev?.enabled ? 'text-green-400' : 'text-muted-foreground'}`}>
                              {dev?.enabled ? '已启用' : '已禁用'}
                            </p>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 底部统计信息 */}
        <div className="mt-8 bg-card border border-border rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">设备</p>
            <p className="text-lg font-bold text-primary mt-1">{devices.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">参数</p>
            <p className="text-lg font-bold text-primary mt-1">
              {groups.reduce((acc, g) => acc + g.parameters.length, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">预设</p>
            <p className="text-lg font-bold text-primary mt-1">{presets.length}</p>
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
