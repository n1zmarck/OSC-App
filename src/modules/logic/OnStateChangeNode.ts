import { Sparkles } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const OnStateChangeNodeDef = {
  id: 'logic.on-state-change',
  type: 'logicNode',
  label: 'On State Change Detector',
  description: 'Triggers pulse outputs on rising edge, falling edge, or delta value changes',
  category: 'Logic',
  icon: Sparkles,
  color: 'amber',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Parameter Signal In', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Pulse Trigger Output', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'gateType', label: 'Gate Type', type: 'string' as const, default: 'on_state_change' },
      { id: 'edgeMode', label: 'Transition Direction', type: 'string' as const, default: 'any' },
      { id: 'pulseDuration', label: 'Pulse Duration', type: 'number' as const, default: 0.1 }
    ]
  },
  data: {
    label: 'On State Change',
    gateType: 'on_state_change',
    edgeMode: 'any',
    pulseDuration: 0.1
  }
};
