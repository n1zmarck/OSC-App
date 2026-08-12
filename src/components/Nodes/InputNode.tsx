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

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="sky"
      icon={Radio}
      title={data.label as string || 'OSC Receiver'}
      subtitle={`Port :${port}`}
      badgeText={dataType}
      minWidth={280}
      minHeight={170}
      handles={[
        { id: 'out-value', position: Position.Right, type: 'source' },
      ]}
    >
      <div>
        <label className="text-xs text-slate-200 font-bold mb-1.5 flex items-center justify-between">
          <span>OSC Address Path</span>
          <span className="text-[10px] text-sky-400 font-extrabold uppercase">Auto-Synced</span>
        </label>
        <div className="relative">
          <select
            value={address}
            onChange={(e) => updateNodeData(id, { address: e.target.value })}
            className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:ring-2 focus:ring-sky-400 appearance-none pr-9 cursor-pointer bg-[#090d16]"
          >
            <option value={address} className="bg-slate-900 text-white font-semibold">
              {address}
            </option>
            {avatarParameters.map((param) => (
              <option key={param.name} value={param.address} className="bg-slate-900 text-white font-semibold">
                {param.address} ({param.type})
              </option>
            ))}
          </select>
          <Settings2 className="w-4 h-4 text-sky-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Live Socket Telemetry Bar */}
      <div className="bg-[#090d16] rounded-2xl p-3 border border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-200 font-bold">Live Signal Value</span>
        </div>
        <span className="font-mono text-xs font-extrabold text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-xl border border-sky-400/40">
          {formatTelemetryValue(value)}
        </span>
      </div>
    </BaseNodeContainer>
  );
});

InputNode.displayName = 'InputNode';
