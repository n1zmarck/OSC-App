import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const MultiplyMathNodeDef = {
  id: 'math.multiply',
  type: 'mathNode',
  label: 'Multiply Node (A × B)',
  description: 'Multiplies input A by input B scale factor',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Input A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Scale B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Product Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'operandB', label: 'Operand B Scale', type: 'number' as const, default: 2.0 }
    ]
  },
  data: {
    label: 'Multiply (A × B)',
    operation: 'multiply',
    operandB: 2.0
  }
};
