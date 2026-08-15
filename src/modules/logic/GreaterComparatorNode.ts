import { GitBranch } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const GreaterComparatorNodeDef = {
  id: 'logic.greater',
  type: 'logicNode',
  label: 'Greater Than Comparator (A > B)',
  description: 'Outputs true when signal A exceeds signal B or threshold constant',
  category: 'Logic',
  icon: GitBranch,
  color: 'amber',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Input A', type: 'float' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Input B', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Comparison Bool', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'gateType', label: 'Gate Type', type: 'string' as const, default: 'greater' },
      { id: 'operandB', label: 'Threshold B Constant', type: 'number' as const, default: 0.5 }
    ]
  },
  data: {
    label: 'Greater Than (A > B)',
    gateType: 'greater',
    operandB: 0.5
  }
};
