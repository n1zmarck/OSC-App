import { GitBranch } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const NotLogicNodeDef = {
  id: 'logic.not',
  type: 'logicNode',
  label: 'NOT Gate (!A Inverter)',
  description: 'Inverts boolean signal state (true -> false, false -> true)',
  category: 'Logic',
  icon: GitBranch,
  color: 'amber',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Input Signal A', type: 'bool' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Inverted Bool', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'gateType', label: 'Gate Type', type: 'string' as const, default: 'not' }
    ]
  },
  data: {
    label: 'NOT Inverter',
    gateType: 'not'
  }
};
