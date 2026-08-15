import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Box, Sparkles } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const MacroNode = memo(({ id, data, selected, height }: NodeProps) => {
  const customModules = useGraphStore((s) => s.customModules);
  const moduleId = data.moduleId as string | undefined;

  const moduleDef = customModules.find((m) => m.id === moduleId);

  const inputs = moduleDef ? moduleDef.inputs : [{ id: 'in', name: 'Input', type: 'float' as const }];
  const outputs = moduleDef ? moduleDef.outputs : [{ id: 'out', name: 'Output', type: 'float' as const }];

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="purple"
      icon={Box}
      title={data.label as string || moduleDef?.name || 'Macro Module'}
      subtitle={moduleDef ? `v${moduleDef.version} • ${moduleDef.category}` : 'Custom Sub-Graph'}
      badgeText="Sub-Graph"
      minWidth={300}
      minHeight={210}
      handles={[
        ...inputs.map((inp, idx) => ({
          id: inp.id,
          position: Position.Left,
          type: 'target' as const,
          style: { top: `${35 + (idx * 25)}%` },
          className: 'handle-float !-left-2.5',
        })),
        ...outputs.map((out, idx) => ({
          id: out.id,
          position: Position.Right,
          type: 'source' as const,
          style: { top: `${35 + (idx * 25)}%` },
          className: 'handle-float !-right-2.5',
        })),
      ]}
    >
      <div className="space-y-3">
        <div className="bg-[#090d16] rounded-2xl p-3 border border-purple-500/30">
          <div className="flex items-center justify-between text-xs text-purple-300 font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Module Telemetry
            </span>
            <span className="text-[10px] text-slate-400 font-mono">144 Hz Loop</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
            {moduleDef?.description || 'Reusable custom macro node module'}
          </p>
        </div>
      </div>
    </BaseNodeContainer>
  );
});

MacroNode.displayName = 'MacroNode';
