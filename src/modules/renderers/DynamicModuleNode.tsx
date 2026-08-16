import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Box, Sparkles, Sliders } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';
import type { ModuleSpec, ModuleHandleDef, ModuleParamDef } from '../../sdk';

export const DynamicModuleNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const spec: ModuleSpec | undefined = data.spec as ModuleSpec | undefined;

  const title = (data.label as string) || spec?.name || 'Custom Module';
  const category = spec?.category || 'Custom';
  const subtitle = spec ? `${spec.version || 'v1.0.0'} • ${category}` : 'Universal Module';

  const inputs: ModuleHandleDef[] = spec?.inputs || (data.inputs as ModuleHandleDef[]) || [
    { id: 'in-1', name: 'Input 1', type: 'float' }
  ];
  const outputs: ModuleHandleDef[] = spec?.outputs || (data.outputs as ModuleHandleDef[]) || [
    { id: 'out-1', name: 'Output 1', type: 'float' }
  ];
  const parameters: ModuleParamDef[] = spec?.parameters || (data.parameters as ModuleParamDef[]) || [];

  const handleParamChange = (paramId: string, val: any) => {
    const nextParams = { ...((data.params as Record<string, any>) || {}), [paramId]: val };
    updateNodeData(id, { params: nextParams });
  };

  const getHandleClass = (type: string, isRight: boolean) => {
    const base = isRight ? '!-right-2.5' : '!-left-2.5';
    switch (type.toLowerCase()) {
      case 'bool': return `handle-bool ${base}`;
      case 'int': return `handle-int ${base}`;
      default: return `handle-float ${base}`;
    }
  };

  const inputHandles = inputs.map((inp, idx) => {
    const step = 100 / (inputs.length + 1);
    return {
      id: inp.id,
      position: Position.Left,
      type: 'target' as const,
      style: { top: `${step * (idx + 1)}%` },
      className: getHandleClass(inp.type, false),
    };
  });

  const outputHandles = outputs.map((out, idx) => {
    const step = 100 / (outputs.length + 1);
    return {
      id: out.id,
      position: Position.Right,
      type: 'source' as const,
      style: { top: `${step * (idx + 1)}%` },
      className: getHandleClass(out.type, true),
    };
  });

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant={spec?.color as any || 'purple'}
      icon={Box}
      title={title}
      subtitle={subtitle}
      badgeText="Dynamic SDK"
      minWidth={310}
      minHeight={220}
      handles={[...inputHandles, ...outputHandles]}
    >
      <div className="space-y-3">
        {/* Module Parameters Section */}
        {parameters.length > 0 && (
          <div className="bg-[#090d16] rounded-2xl p-3 border border-white/15 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold border-b border-white/10 pb-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Module Configuration</span>
            </div>

            {parameters.map((param) => {
              const currentVal = (data.params as Record<string, any>)?.[param.id] ?? param.default;

              if (param.type === 'range') {
                return (
                  <div key={param.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span>{param.label}</span>
                      <span className="font-mono text-sky-300">{currentVal}</span>
                    </div>
                    <input
                      type="range"
                      min={param.min ?? 0}
                      max={param.max ?? 100}
                      step={param.step ?? 0.1}
                      value={currentVal}
                      onChange={(e) => handleParamChange(param.id, parseFloat(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>
                );
              }

              if (param.type === 'toggle') {
                return (
                  <div key={param.id} className="flex items-center justify-between py-1">
                    <span className="text-[11px] font-bold text-slate-300">{param.label}</span>
                    <button
                      onClick={() => handleParamChange(param.id, !currentVal)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentVal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {currentVal ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                );
              }

              if (param.type === 'select' && param.options) {
                return (
                  <div key={param.id} className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-300 block">{param.label}</span>
                    <select
                      value={currentVal}
                      onChange={(e) => handleParamChange(param.id, e.target.value)}
                      className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs font-bold text-white bg-[#090d16]"
                    >
                      {param.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={param.id} className="flex items-center justify-between py-1">
                  <span className="text-[11px] font-bold text-slate-300">{param.label}</span>
                  <input
                    type={param.type === 'number' ? 'number' : 'text'}
                    value={currentVal}
                    onChange={(e) => handleParamChange(param.id, param.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                    className="w-24 glass-input rounded-xl px-2 py-1 text-center font-mono text-xs font-bold text-sky-300 bg-[#090d16]"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Telemetry Status Bar */}
        <div className="bg-[#090d16] rounded-2xl p-2.5 border border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs text-slate-200 font-bold">SDK Runtime</span>
          </div>
          <span className="text-[10px] font-mono font-extrabold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-xl border border-purple-400/40">
            {inputs.length} IN • {outputs.length} OUT
          </span>
        </div>
      </div>
    </BaseNodeContainer>
  );
});

DynamicModuleNode.displayName = 'DynamicModuleNode';
