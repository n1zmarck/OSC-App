import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const AddMathNodeDef = {
  id: 'math.add',
  type: 'mathNode',
  label: 'Add Node (A + B)',
  description: 'Adds input A and input B together',
  category: 'Math',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Input A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Input B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Sum Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'operandB', label: 'Operand B Default', type: 'number' as const, default: 1.0 }
    ]
  },
  data: {
    label: 'Add (A + B)',
    operation: 'add',
    operandB: 1.0
  }
};
