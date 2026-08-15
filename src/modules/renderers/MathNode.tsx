import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { Calculator } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const MathNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const operation = (data.operation as string) || 'remap';
  const operandB = data.operandB !== undefined ? Number(data.operandB) : 1.0;
  const inMin = data.inMin !== undefined ? Number(data.inMin) : 0;
  const inMax = data.inMax !== undefined ? Number(data.inMax) : 100;
  const outMin = data.outMin !== undefined ? Number(data.outMin) : 0;
  const outMax = data.outMax !== undefined ? Number(data.outMax) : 1;

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
      subtitle={`${operation.toUpperCase()} Processor`}
      badgeText={operation === 'remap' ? 'Float → Float' : 'Float Math'}
      minWidth={280}
      minHeight={180}
      handles={
        isBinaryOp
          ? [
              { id: 'in-a', position: Position.Left, type: 'target', style: { top: '40%' }, className: 'handle-float !-left-2.5' },
              { id: 'in-b', position: Position.Left, type: 'target', style: { top: '70%' }, className: 'handle-float !-left-2.5' },
              { id: 'out-value', position: Position.Right, type: 'source', className: 'handle-float !-right-2.5' },
            ]
          : [
              { id: 'in-a', position: Position.Left, type: 'target', style: { top: '50%' }, className: 'handle-float !-left-2.5' },
              { id: 'out-value', position: Position.Right, type: 'source', className: 'handle-float !-right-2.5' },
            ]
      }
    >
      <div>
        <label className="text-xs text-slate-200 font-bold mb-1.5 block">Math Function</label>
        <select
          value={operation}
          onChange={(e) => updateNodeData(id, { operation: e.target.value })}
          className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs text-white font-bold focus:ring-2 focus:ring-indigo-400 appearance-none cursor-pointer bg-[#090d16]"
        >
          <optgroup label="Basic Arithmetic (Binary)" className="bg-slate-900 text-indigo-300 font-bold">
            <option value="add" className="bg-slate-900 text-white font-semibold">Addition (A + B)</option>
            <option value="subtract" className="bg-slate-900 text-white font-semibold">Subtraction (A - B)</option>
            <option value="multiply" className="bg-slate-900 text-white font-semibold">Multiplication (A × B)</option>
            <option value="divide" className="bg-slate-900 text-white font-semibold">Division (A / B)</option>
            <option value="modulo" className="bg-slate-900 text-white font-semibold">Modulo Remainder (A % B)</option>
            <option value="power" className="bg-slate-900 text-white font-semibold">Exponentiation (A ^ B)</option>
            <option value="min" className="bg-slate-900 text-white font-semibold">Minimum Value min(A, B)</option>
            <option value="max" className="bg-slate-900 text-white font-semibold">Maximum Value max(A, B)</option>
          </optgroup>
          <optgroup label="Signal Processors & Scaling" className="bg-slate-900 text-sky-300 font-bold">
            <option value="remap" className="bg-slate-900 text-white font-semibold">Range Remap [InMin..InMax → OutMin..OutMax]</option>
            <option value="abs" className="bg-slate-900 text-white font-semibold">Absolute Value (|A|)</option>
            <option value="clamp" className="bg-slate-900 text-white font-semibold">Clamp Bounds [0.0 .. 1.0]</option>
            <option value="lerp" className="bg-slate-900 text-white font-semibold">Exponential Lerp Smoothing</option>
          </optgroup>
        </select>
      </div>

      {isBinaryOp && (
        <div className="bg-[#090d16] rounded-2xl p-2 border border-white/15 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-bold">Operand B Constant</span>
          <input
            type="number"
            value={operandB}
            onChange={(e) => updateNodeData(id, { operandB: parseFloat(e.target.value) || 0 })}
            className="w-20 glass-input rounded-xl px-2 py-1 text-center font-mono text-xs font-bold text-indigo-300"
          />
        </div>
      )}

      {operation === 'remap' && (
        <div className="grid grid-cols-2 gap-2 bg-[#090d16] p-2.5 rounded-2xl border border-white/15">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">In Range</span>
            <div className="flex gap-1 mt-0.5">
              <input
                type="number"
                value={inMin}
                onChange={(e) => updateNodeData(id, { inMin: parseFloat(e.target.value) || 0 })}
                className="w-full glass-input rounded-xl px-2 py-1 text-center font-mono text-xs text-sky-300 font-bold"
              />
              <input
                type="number"
                value={inMax}
                onChange={(e) => updateNodeData(id, { inMax: parseFloat(e.target.value) || 0 })}
                className="w-full glass-input rounded-xl px-2 py-1 text-center font-mono text-xs text-sky-300 font-bold"
              />
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Out Range</span>
            <div className="flex gap-1 mt-0.5">
              <input
                type="number"
                value={outMin}
                onChange={(e) => updateNodeData(id, { outMin: parseFloat(e.target.value) || 0 })}
                className="w-full glass-input rounded-xl px-2 py-1 text-center font-mono text-xs text-emerald-300 font-bold"
              />
              <input
                type="number"
                value={outMax}
                onChange={(e) => updateNodeData(id, { outMax: parseFloat(e.target.value) || 0 })}
                className="w-full glass-input rounded-xl px-2 py-1 text-center font-mono text-xs text-emerald-300 font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </BaseNodeContainer>
  );
});

MathNode.displayName = 'MathNode';
