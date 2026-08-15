import { GitBranch } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const HysteresisTriggerNodeDef = {
  id: 'logic.hysteresis',
  type: 'logicNode',
  label: 'Schmitt Hysteresis Trigger',
  description: 'Dual-threshold noise gate preventing rapid ON/OFF flickering near boundaries',
  category: 'Logic',
  icon: GitBranch,
  color: 'amber',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Sensor Signal In', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Triggered Bool', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'gateType', label: 'Gate Type', type: 'string' as const, default: 'hysteresis' },
      { id: 'threshold', label: 'Upper ON Threshold', type: 'number' as const, default: 0.7 },
      { id: 'lowerThreshold', label: 'Lower OFF Threshold', type: 'number' as const, default: 0.3 }
    ]
  },
  data: {
    label: 'Hysteresis Trigger',
    gateType: 'hysteresis',
    threshold: 0.7,
    lowerThreshold: 0.3
  }
};
