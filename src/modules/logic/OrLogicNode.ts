import { GitBranch } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const OrLogicNodeDef = {
  id: 'logic.or',
  type: 'logicNode',
  label: 'OR Logic Gate (A | B)',
  description: 'Outputs true when either input A or input B is true',
  category: 'Logic',
  icon: GitBranch,
  color: 'amber',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Input A', type: 'bool' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Input B', type: 'bool' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Result Bool', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'gateType', label: 'Gate Type', type: 'string' as const, default: 'or' }
    ]
  },
  data: {
    label: 'OR Gate',
    gateType: 'or'
  }
};
