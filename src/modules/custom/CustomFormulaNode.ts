import { Code2 } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const CustomFormulaNodeDef = {
  id: 'custom.formula',
  type: 'expressionNode',
  label: 'Custom Formula Script',
  description: 'Evaluates user inline math expressions in real-time (e.g. sin, cos, lerp)',
  category: 'Custom',
  icon: Code2,
  color: 'purple',
  meta: {
    inputs: [
      { id: 'in1', name: 'Input 1', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Formula Result', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'formula', label: 'Math Formula', type: 'string' as const, default: '(in1 * 0.8) + (sin(time) * 0.2)' }
    ]
  },
  data: {
    label: 'Custom Formula',
    formula: '(in1 * 0.8) + (sin(time) * 0.2)',
    variables: ['in1']
  }
};
