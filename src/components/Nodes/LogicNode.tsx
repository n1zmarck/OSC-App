import React, { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { GitBranch, ChevronDown } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { BaseNodeContainer } from './BaseNodeContainer';

export const LogicNode = memo(({ id, data, selected, height }: NodeProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);

  const gateType = (data.gateType as string) || 'threshold';
  const threshold = data.threshold !== undefined ? Number(data.threshold) : 0.5;
  const lowerThreshold = data.lowerThreshold !== undefined ? Number(data.lowerThreshold) : 0.2;
  const operandB = data.operandB !== undefined ? Number(data.operandB) : 0.5;

  const isUnaryGate = ['not', 'threshold'].includes(gateType);

  return (
    <BaseNodeContainer
      id={id}
      data={data}
      selected={selected}
      height={height}
      variant="amber"
      icon={GitBranch}
      title={data.label as string || 'Logic Gate'}
      subtitle={`${gateType.toUpperCase()} gate`}
      badgeText="Bool Output"
      minWidth={290}
      minHeight={210}
      handles={
        isUnaryGate
          ? [
              { id: 'in-a', position: Position.Left, type: 'target', style: { top: '50%' }, className: 'handle-float !-left-2.5' },
              { id: 'out-value', position: Position.Right, type: 'source', className: 'handle-bool !-right-2.5' },
            ]
          : [
              { id: 'in-a', position: Position.Left, type: 'target', style: { top: '40%' }, className: 'handle-float !-left-2.5' },
              { id: 'in-b', position: Position.Left, type: 'target', style: { top: '70%' }, className: 'handle-bool !-left-2.5' },
              { id: 'out-value', position: Position.Right, type: 'source', className: 'handle-bool !-right-2.5' },
            ]
      }
    >
      <div className="space-y-3">
        {/* Logic Mode Select */}
        <div>
          <label className="text-xs text-slate-200 font-bold mb-1 block">Logic & Gate Mode</label>
          <div className="relative">
            <select
              value={gateType}
              onChange={(e) => updateNodeData(id, { gateType: e.target.value })}
              className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs text-white font-bold focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer pr-9 bg-[#090d16]"
            >
              <optgroup label="Boolean Logic Gates" className="bg-slate-900 text-amber-300 font-bold">
                <option value="and" className="bg-slate-900 text-white font-semibold">AND (A & B)</option>
                <option value="or" className="bg-slate-900 text-white font-semibold">OR (A | B)</option>
                <option value="xor" className="bg-slate-900 text-white font-semibold">XOR (Exclusive OR)</option>
                <option value="not" className="bg-slate-900 text-white font-semibold">NOT (!A Inverter)</option>
                <option value="nand" className="bg-slate-900 text-white font-semibold">NAND (!(A & B))</option>
                <option value="nor" className="bg-slate-900 text-white font-semibold">NOR (!(A | B))</option>
                <option value="xnor" className="bg-slate-900 text-white font-semibold">XNOR (Equivalence)</option>
              </optgroup>

              <optgroup label="Comparison Operators" className="bg-slate-900 text-sky-300 font-bold">
                <option value="greater" className="bg-slate-900 text-white font-semibold">Greater Than (A {'>'} B)</option>
                <option value="greater_equal" className="bg-slate-900 text-white font-semibold">Greater or Equal (A ≥ B)</option>
                <option value="less" className="bg-slate-900 text-white font-semibold">Less Than (A {'<'} B)</option>
                <option value="less_equal" className="bg-slate-900 text-white font-semibold">Less or Equal (A ≤ B)</option>
                <option value="equal" className="bg-slate-900 text-white font-semibold">Equal (A == B)</option>
                <option value="not_equal" className="bg-slate-900 text-white font-semibold">Not Equal (A != B)</option>
                <option value="threshold" className="bg-slate-900 text-white font-semibold">Single Threshold (Val {'>'} Limit)</option>
              </optgroup>

              <optgroup label="Latches & Triggers" className="bg-slate-900 text-emerald-300 font-bold">
                <option value="toggle" className="bg-slate-900 text-white font-semibold">SR Flip-Flop Latch (Set A / Reset B)</option>
                <option value="hysteresis" className="bg-slate-900 text-white font-semibold">Schmitt Hysteresis Trigger</option>
              </optgroup>
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Threshold Limit Control */}
        {gateType === 'threshold' && (
          <div className="bg-[#090d16] rounded-2xl p-3 border border-white/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-200 font-extrabold">
              <span>Threshold Limit</span>
              <span className="text-amber-300 font-mono">{threshold}</span>
            </div>
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

        {/* Hysteresis Dual Limit Controls */}
        {gateType === 'hysteresis' && (
          <div className="bg-[#090d16] rounded-2xl p-3 border border-white/15 space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                <span>Upper ON Limit</span>
                <span className="font-mono">{threshold}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={threshold}
                onChange={(e) => updateNodeData(id, { threshold: parseFloat(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] text-rose-300 font-bold">
                <span>Lower OFF Limit</span>
                <span className="font-mono">{lowerThreshold}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={lowerThreshold}
                onChange={(e) => updateNodeData(id, { lowerThreshold: parseFloat(e.target.value) })}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Constant B Fallback Input for Comparison Gates */}
        {!isUnaryGate && gateType !== 'hysteresis' && gateType !== 'toggle' && (
          <div className="bg-[#090d16] rounded-2xl p-2.5 border border-white/15 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-bold">Operand B Constant</span>
            <input
              type="number"
              value={operandB}
              onChange={(e) => updateNodeData(id, { operandB: parseFloat(e.target.value) || 0 })}
              className="w-20 glass-input rounded-xl px-2 py-1 text-center font-mono text-xs font-bold text-amber-300"
            />
          </div>
        )}
      </div>
    </BaseNodeContainer>
  );
});

LogicNode.displayName = 'LogicNode';
