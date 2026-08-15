import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const OutputNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const port = data.port || 9000;
  const address = (data.address as string) || '/avatar/parameters/PulseRate';
  const targetIp = (data.targetIp as string) || '127.0.0.1';
  const dataType = (data.dataType as string) || 'Float';

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="emerald"
      icon={Send}
      title={data.label as string || 'OSC Transmitter'}
      subtitle={`${targetIp}:${port}`}
      badgeText={dataType}
      minWidth={280}
      minHeight={170}
      handles={[
        { id: 'in-value', position: Position.Left, type: 'target' },
      ]}
    >
      <div>
        <label className="text-xs text-slate-200 font-bold mb-1.5 block">Target OSC Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => updateNodeData(id, { address: e.target.value })}
          className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs text-emerald-300 font-mono font-bold focus:ring-2 focus:ring-emerald-400 bg-[#090d16]"
          placeholder="/avatar/parameters/MyParam"
        />
      </div>

      <div className="bg-[#090d16] rounded-2xl p-3 border border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-200 font-bold">Socket Status</span>
        </div>
        <span className="text-xs font-extrabold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-400/40">
          TX Active
        </span>
      </div>
    </BaseNodeContainer>
  );
});

OutputNode.displayName = 'OutputNode';
