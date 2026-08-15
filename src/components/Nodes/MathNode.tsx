import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Calculator, ChevronDown } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const MathNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const operation = (data.operation as string) || 'remap';
  const inMin = data.inMin !== undefined ? Number(data.inMin) : 0;
  const inMax = data.inMax !== undefined ? Number(data.inMax) : 100;
  const outMin = data.outMin !== undefined ? Number(data.outMin) : 0.0;
  const outMax = data.outMax !== undefined ? Number(data.outMax) : 1.0;
  const operandB = data.operandB !== undefined ? Number(data.operandB) : 1.0;

  const isBinaryOp = ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power', 'min', 'max'].includes(operation);

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="indigo"
      icon={Calculator}
      title={data.label as string || 'Math Processor'}
      subtitle={`${operation.toUpperCase()} processor`}
      badgeText="Float → Float"
      minWidth={280}
      minHeight={220}
      handles={
        isBinaryOp
          ? [
              { id: 'in-a', position: Position.Left, type: 'target', style: { top: '40%' }, className: 'handle-float !-left-2.5' },
              { id: 'in-b', position: Position.Left, type: 'target', style: { top: '70%' }, className: 'handle-float !-left-2.5' },
              { id: 'out-value', position: Position.Right, type: 'source', className: 'handle-float !-right-2.5' },
            ]
          : [
              { id: 'in-value', position: Position.Left, type: 'target' },
              { id: 'out-value', position: Position.Right, type: 'source' },
            ]
      }
    >
      {/* Math Operation Mode Select */}
      <div>
        <label className="text-xs text-slate-200 font-bold mb-1 block">Math Processing Mode</label>
        <div className="relative">
          <select
            value={operation}
            onChange={(e) => updateNodeData(id, { operation: e.target.value })}
            className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:ring-2 focus:ring-indigo-400 appearance-none cursor-pointer pr-9 bg-[#090d16]"
          >
            <option value="add" className="bg-slate-900 text-white font-semibold">Add (A + B)</option>
            <option value="subtract" className="bg-slate-900 text-white font-semibold">Subtract (A - B)</option>
            <option value="multiply" className="bg-slate-900 text-white font-semibold">Multiply (A × B)</option>
            <option value="divide" className="bg-slate-900 text-white font-semibold">Divide (A / B)</option>
            <option value="modulo" className="bg-slate-900 text-white font-semibold">Modulo (A % B)</option>
            <option value="power" className="bg-slate-900 text-white font-semibold">Power (A ^ B)</option>
            <option value="min" className="bg-slate-900 text-white font-semibold">Min (min(A, B))</option>
            <option value="max" className="bg-slate-900 text-white font-semibold">Max (max(A, B))</option>
            <option value="abs" className="bg-slate-900 text-white font-semibold">Absolute Value (|A|)</option>
            <option value="remap" className="bg-slate-900 text-white font-semibold">Range Remap [In → Out]</option>
            <option value="clamp" className="bg-slate-900 text-white font-semibold">Clamp Bounds [0.0..1.0]</option>
            <option value="smooth" className="bg-slate-900 text-white font-semibold">Lerp Dampen (Smoothing)</option>
          </select>
          <ChevronDown className="w-4 h-4 text-indigo-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Binary Operand B Slider / Input (if not wired) */}
      {isBinaryOp && (
        <div className="bg-[#090d16] rounded-2xl p-3.5 border border-white/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-extrabold">
            <span>Operand B Constant</span>
            <span className="text-indigo-300 font-mono">{operandB}</span>
          </div>
          <input
            type="number"
            value={operandB}
            onChange={(e) => updateNodeData(id, { operandB: parseFloat(e.target.value) || 0 })}
            className="w-full glass-input rounded-xl px-3 py-1.5 text-center font-mono text-xs font-bold text-indigo-300"
          />
        </div>
      )}

      {/* Remap Controls Grid */}
      {operation === 'remap' && (
        <div className="bg-[#090d16] rounded-2xl p-3.5 border border-white/15 space-y-3.5">
          <div className="grid grid-cols-2 gap-3.5 items-center">
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">Input Range</span>
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <input
                    type="number"
                    value={inMin}
                    onChange={(e) => updateNodeData(id, { inMin: parseFloat(e.target.value) || 0 })}
                    className="w-full glass-input rounded-xl px-2 py-1.5 text-center font-mono text-xs font-bold text-sky-300"
                  />
                  <span className="text-[10px] text-slate-400 font-bold block text-center mt-1 uppercase">Min</span>
                </div>
                <span className="text-slate-400 font-bold text-xs mb-4">-</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={inMax}
                    onChange={(e) => updateNodeData(id, { inMax: parseFloat(e.target.value) || 1 })}
                    className="w-full glass-input rounded-xl px-2 py-1.5 text-center font-mono text-xs font-bold text-sky-300"
                  />
                  <span className="text-[10px] text-slate-400 font-bold block text-center mt-1 uppercase">Max</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">Output Range</span>
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <input
                    type="number"
                    value={outMin}
                    onChange={(e) => updateNodeData(id, { outMin: parseFloat(e.target.value) || 0 })}
                    className="w-full glass-input rounded-xl px-2 py-1.5 text-center font-mono text-xs font-bold text-emerald-300"
                  />
                  <span className="text-[10px] text-slate-400 font-bold block text-center mt-1 uppercase">Min</span>
                </div>
                <span className="text-slate-400 font-bold text-xs mb-4">-</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={outMax}
                    onChange={(e) => updateNodeData(id, { outMax: parseFloat(e.target.value) || 1 })}
                    className="w-full glass-input rounded-xl px-2 py-1.5 text-center font-mono text-xs font-bold text-emerald-300"
                  />
                  <span className="text-[10px] text-slate-400 font-bold block text-center mt-1 uppercase">Max</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseNodeContainer>
  );
});

MathNode.displayName = 'MathNode';
