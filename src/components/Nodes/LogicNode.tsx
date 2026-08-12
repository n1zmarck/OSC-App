import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const LogicNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const gateType = (data.gateType as string) || 'threshold';
  const threshold = data.threshold !== undefined ? Number(data.threshold) : 0.5;

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="amber"
      icon={GitBranch}
      title={data.label as string || 'Logic Gate'}
      subtitle={`${gateType} gate`}
      badgeText="Bool Output"
      minWidth={280}
      minHeight={170}
      handles={[
        { id: 'in-a', position: Position.Left, type: 'target', style: { top: '40%' }, className: 'handle-float !-left-2.5' },
        { id: 'in-b', position: Position.Left, type: 'target', style: { top: '70%' }, className: 'handle-bool !-left-2.5' },
        { id: 'out-value', position: Position.Right, type: 'source', className: 'handle-bool !-right-2.5' },
      ]}
    >
      <div>
        <label className="text-xs text-slate-200 font-bold mb-1.5 block">Logic Mode</label>
        <select
          value={gateType}
          onChange={(e) => updateNodeData(id, { gateType: e.target.value })}
          className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs text-white font-bold focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer bg-[#090d16]"
        >
          <option value="threshold" className="bg-slate-900 text-white font-semibold">Threshold Trigger (val {'>'} limit)</option>
          <option value="and" className="bg-slate-900 text-white font-semibold">AND (A & B)</option>
          <option value="or" className="bg-slate-900 text-white font-semibold">OR (A | B)</option>
          <option value="toggle" className="bg-slate-900 text-white font-semibold">Toggle Latch</option>
        </select>
      </div>

      {gateType === 'threshold' && (
        <div>
          <label className="text-xs text-slate-200 font-bold mb-1.5 block">Threshold Limit ({threshold})</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={threshold}
            onChange={(e) => updateNodeData(id, { threshold: parseFloat(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      )}
    </BaseNodeContainer>
  );
});

LogicNode.displayName = 'LogicNode';
