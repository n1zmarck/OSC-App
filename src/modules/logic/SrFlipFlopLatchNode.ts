import { GitBranch } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const SrFlipFlopLatchNodeDef = {
  id: 'logic.toggle-latch',
  type: 'logicNode',
  label: 'SR Flip-Flop Toggle Latch',
  description: 'Latches state on Set input A pulse, resets on Reset input B pulse',
  category: 'Logic',
  icon: GitBranch,
  color: 'amber',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Set Input A', type: 'bool' as SignalType, direction: 'input' as const },
      { id: 'in-b', name: 'Reset Input B', type: 'bool' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Latched Bool Output', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'gateType', label: 'Gate Type', type: 'string' as const, default: 'toggle' }
    ]
  },
  data: {
    label: 'SR Flip-Flop Latch',
    gateType: 'toggle'
  }
};
