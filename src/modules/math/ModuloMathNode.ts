import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const ModuloMathNodeDef = {
  id: 'math.modulo',
  type: 'mathNode',
  label: 'Modulo Node (A % B)',
  description: 'Computes remainder of input A divided by B',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Dividend A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Divisor B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Remainder Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'operandB', label: 'Divisor B Default', type: 'number' as const, default: 1.0 }
    ]
  },
  data: {
    label: 'Modulo (A % B)',
    operation: 'modulo',
    operandB: 1.0
  }
};
