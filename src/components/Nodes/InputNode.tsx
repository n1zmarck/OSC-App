import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Radio, Activity, Settings2 } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { formatTelemetryValue } from '../../utils/nodeUtils';
import { BaseNodeContainer } from './BaseNodeContainer';

export const InputNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const avatarParameters = useGraphStore((s) => s.avatarParameters);

  const port = data.port || 9001;
  const address = (data.address as string) || '/avatar/parameters/HeartRate';
  const dataType = (data.dataType as string) || 'Float';
  const value = data.value !== undefined ? data.value : 0.0;

  // Handle selecting an auto-synced avatar parameter
  const handleSelectParam = (paramName: string) => {
    const matched = avatarParameters.find((p) => p.name === paramName);
    if (matched) {
      const formattedType = matched.type.charAt(0).toUpperCase() + matched.type.slice(1);
      updateNodeData(id, { address: matched.name, dataType: formattedType });
    } else {
      updateNodeData(id, { address: paramName });
    }
  };

  const handleTypeChange = (newType: string) => {
    updateNodeData(id, { dataType: newType });
  };

  const handleClassName = dataType.toLowerCase() === 'bool'
    ? 'handle-bool !-right-2.5'
    : dataType.toLowerCase() === 'int'
    ? 'handle-int !-right-2.5'
    : 'handle-float !-right-2.5';

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="sky"
      icon={Radio}
      title={data.label as string || 'VRChat OSC In'}
      subtitle={`Port :${port}`}
      badgeText={dataType}
      minWidth={300}
      minHeight={210}
      handles={[
        { id: 'out-value', position: Position.Right, type: 'source', className: handleClassName },
      ]}
    >
      <div className="space-y-3">
        {/* OSC Address Input & Auto-Synced Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-200 font-bold">OSC Address Path</label>
            <span className="text-[10px] text-sky-400 font-extrabold uppercase">Auto-Synced</span>
          </div>

          <div className="space-y-1.5">
            {/* Editable Custom Address Path Input */}
            <input
              type="text"
              value={address}
              onChange={(e) => updateNodeData(id, { address: e.target.value })}
              className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs font-mono text-sky-300 font-bold focus:ring-2 focus:ring-sky-400 bg-[#090d16]"
              placeholder="/avatar/parameters/MyParameter"
            />

            {/* Avatar Preset Selector */}
            <div className="relative">
              <select
                value={address}
                onChange={(e) => handleSelectParam(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-1.5 text-[11px] text-slate-300 font-semibold focus:ring-1 focus:ring-sky-400 appearance-none pr-8 cursor-pointer bg-[#090d16]"
              >
                <option value="" disabled className="bg-slate-900 text-slate-400">
                  -- Select VRChat Avatar Parameter --
                </option>
                {avatarParameters.map((param) => (
                  <option key={param.name} value={param.name} className="bg-slate-900 text-white font-semibold">
                    {param.name} ({param.type})
                  </option>
                ))}
              </select>
              <Settings2 className="w-3.5 h-3.5 text-sky-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Type Selector */}
        <div className="flex items-center justify-between bg-[#090d16] rounded-xl px-3 py-1.5 border border-white/10">
          <span className="text-[11px] text-slate-300 font-bold">Signal Data Type</span>
          <select
            value={dataType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-sky-300 focus:outline-none cursor-pointer"
          >
            <option value="Float" className="bg-slate-900 text-white">Float</option>
            <option value="Int" className="bg-slate-900 text-white">Int</option>
            <option value="Bool" className="bg-slate-900 text-white">Bool</option>
            <option value="String" className="bg-slate-900 text-white">String</option>
          </select>
        </div>

        {/* Live Socket Telemetry Bar */}
        <div className="bg-[#090d16] rounded-2xl p-2.5 border border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-200 font-bold">Live Value</span>
          </div>
          <span className="font-mono text-xs font-extrabold text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-xl border border-sky-400/40">
            {formatTelemetryValue(value)}
          </span>
        </div>
      </div>
    </BaseNodeContainer>
  );
});

InputNode.displayName = 'InputNode';
