import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const MinMaxMathNodeDef = {
  id: 'math.minmax',
  type: 'mathNode',
  label: 'Min / Max Gate',
  description: 'Finds minimum or maximum between two input signals',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Input A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Input B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Gated Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'operation', label: 'Gate Mode', type: 'string' as const, default: 'min' },
      { id: 'operandB', label: 'Operand B Default', type: 'number' as const, default: 1.0 }
    ]
  },
  data: {
    label: 'Min / Max Gate',
    operation: 'min',
    operandB: 1.0
  }
};
