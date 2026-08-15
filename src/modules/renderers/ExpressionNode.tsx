import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Code2, Play } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const ExpressionNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const formula = (data.formula as string) || 'in1 * 2';
  const variables = (data.variables as string[]) || ['in1'];

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="purple"
      icon={Code2}
      title={data.label as string || 'Custom Script'}
      subtitle="Evaluator"
      badgeText="Expr Engine"
      minWidth={300}
      minHeight={200}
      handles={[
        ...variables.map((v, i) => ({
          id: v,
          position: Position.Left,
          type: 'target' as const,
          style: { top: `${35 + (i * 25)}%` },
          className: 'handle-float !-left-2.5',
        })),
        { id: 'out-value', position: Position.Right, type: 'source', className: 'handle-float !-right-2.5' },
      ]}
    >
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-200 font-bold mb-1.5 block">Formula Expression</label>
          <div className="relative">
            <input
              type="text"
              value={formula}
              onChange={(e) => updateNodeData(id, { formula: e.target.value })}
              className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs text-purple-300 font-mono font-bold focus:ring-2 focus:ring-purple-400 bg-[#090d16]"
              placeholder="e.g. sin(time * 2) + in1"
            />
            <Play className="w-3.5 h-3.5 text-purple-400 absolute right-3 top-2.5 opacity-60" />
          </div>
        </div>

        <div className="bg-[#090d16] rounded-2xl p-2.5 border border-white/15">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
            <span>Input Handles</span>
            <span className="text-[10px] text-purple-400">{variables.length} Connected</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {variables.map((v) => (
              <span key={v} className="glass-pill px-2 py-0.5 text-[10px] font-mono text-purple-300">
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </BaseNodeContainer>
  );
});

ExpressionNode.displayName = 'ExpressionNode';
