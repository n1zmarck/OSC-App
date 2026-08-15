import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const DivideMathNodeDef = {
  id: 'math.divide',
  type: 'mathNode',
  label: 'Divide Node (A / B)',
  description: 'Divides input A by input B with zero-divide safety protection',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Numerator A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Denominator B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Quotient Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'operandB', label: 'Operand B Default', type: 'number' as const, default: 2.0 }
    ]
  },
  data: {
    label: 'Divide (A / B)',
    operation: 'divide',
    operandB: 2.0
  }
};
