import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const RangeRemapNodeDef = {
  id: 'math.remap',
  type: 'mathNode',
  label: 'Range Remap',
  description: 'Linearly maps input values from range [InMin, InMax] to [OutMin, OutMax]',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Raw Signal In', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Remapped Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'inMin', label: 'Input Min', type: 'number' as const, default: 0 },
      { id: 'inMax', label: 'Input Max', type: 'number' as const, default: 100 },
      { id: 'outMin', label: 'Output Min', type: 'number' as const, default: 0 },
      { id: 'outMax', label: 'Output Max', type: 'number' as const, default: 1 }
    ]
  },
  data: {
    label: 'Range Remap',
    operation: 'remap',
    inMin: 0,
    inMax: 100,
    outMin: 0,
    outMax: 1
  }
};
