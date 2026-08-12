import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Code2 } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const ExpressionNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const formula = (data.formula as string) || '(in1 * 0.8) + (sin(time) * 0.2)';
  const variables = (data.variables as string[]) || ['in1'];

  const handles = variables.map((v, index) => ({
    id: v,
    position: Position.Left,
    type: 'target' as const,
    style: { top: `${45 + index * 26}%` },
    className: 'handle-float !-left-2.5',
  }));

  handles.push({
    id: 'out-value',
    position: Position.Right,
    type: 'source' as const,
    style: undefined,
    className: 'handle-float !-right-2.5',
  });

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="purple"
      icon={Code2}
      title={data.label as string || 'Custom Expression'}
      subtitle="Formula Engine"
      badgeText="User Script"
      minWidth={280}
      minHeight={190}
      handles={handles}
    >
      <div>
        <label className="text-xs text-slate-200 font-bold mb-1.5 flex items-center justify-between">
          <span>Formula Expression</span>
          <span className="text-[10px] text-purple-300 font-mono font-bold">in1, time, sin, cos</span>
        </label>
        <textarea
          value={formula}
          onChange={(e) => updateNodeData(id, { formula: e.target.value })}
          rows={2}
          className="w-full glass-input rounded-2xl px-3 py-2 text-xs font-mono font-bold text-purple-200 focus:ring-2 focus:ring-purple-400 resize-none bg-[#090d16]"
          placeholder="(in1 * scale) + sin(time)"
        />
      </div>

      <div className="bg-[#090d16] rounded-2xl p-2.5 border border-white/15 flex items-center justify-between text-xs text-slate-300 font-bold font-mono">
        <span>Active Variable:</span>
        <span className="text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-xl border border-purple-400/40">
          {variables.join(', ')}
        </span>
      </div>
    </BaseNodeContainer>
  );
});

ExpressionNode.displayName = 'ExpressionNode';
