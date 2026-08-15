import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const SubtractMathNodeDef = {
  id: 'math.subtract',
  type: 'mathNode',
  label: 'Subtract Node (A - B)',
  description: 'Subtracts input B from input A',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Input A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Input B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Difference Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'operandB', label: 'Operand B Default', type: 'number' as const, default: 1.0 }
    ]
  },
  data: {
    label: 'Subtract (A - B)',
    operation: 'subtract',
    operandB: 1.0
  }
};
