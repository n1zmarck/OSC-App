import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Box, ExternalLink } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const MacroNode = memo(({ id, data, selected, height }: NodeProps) => {
  const customModules = useGraphStore((s) => s.customModules);
  const moduleId = data.moduleId as string;
  const module = customModules.find((m) => m.id === moduleId);

  const moduleName = module ? module.name : (data.label as string || 'Custom Sub-graph');
  const inputs = module ? module.inputs : [{ name: 'in1', dataType: 'Float' }];
  const outputs = module ? module.outputs : [{ name: 'out1', dataType: 'Float' }];

  const handles = [
    ...inputs.map((inp, idx) => ({
      id: inp.name,
      position: Position.Left,
      type: 'target' as const,
      style: { top: `${40 + idx * 25}%` },
      className: 'handle-custom !-left-2.5',
    })),
    ...outputs.map((out, idx) => ({
      id: out.name,
      position: Position.Right,
      type: 'source' as const,
      style: { top: `${40 + idx * 25}%` },
      className: 'handle-custom !-right-2.5',
    })),
  ];

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="fuchsia"
      icon={Box}
      title={moduleName}
      subtitle="Sub-Graph Module"
      badgeText="Custom"
      minWidth={280}
      minHeight={160}
      handles={handles}
    >
      <div className="bg-[#090d16] rounded-2xl p-3 border border-white/15 space-y-2">
        <p className="text-xs text-slate-200 font-semibold leading-relaxed">
          {module?.description || 'Custom encapsulated node graph pipeline module'}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-bold pt-2 border-t border-white/10">
          <span>Ports: {inputs.length} In / {outputs.length} Out</span>
          <button className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 transition-colors">
            <span>Inspect</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </BaseNodeContainer>
  );
});

MacroNode.displayName = 'MacroNode';
