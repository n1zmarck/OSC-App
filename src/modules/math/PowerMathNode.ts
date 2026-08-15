import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const PowerMathNodeDef = {
  id: 'math.power',
  type: 'mathNode',
  label: 'Power Node (A ^ B)',
  description: 'Raises input A to the power of B',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Base A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Exponent B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Power Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'operandB', label: 'Exponent B Default', type: 'number' as const, default: 2.0 }
    ]
  },
  data: {
    label: 'Power (A ^ B)',
    operation: 'power',
    operandB: 2.0
  }
};
