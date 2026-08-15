import { GitBranch } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const VisemeDecoderNodeDef = {
  id: 'tracking.viseme-decoder',
  type: 'logicNode',
  label: 'Viseme & Gesture Decoder',
  description: 'Decodes VRChat 15-viseme integer parameters into shapekey triggers',
  category: 'Tracking & Face',
  icon: GitBranch,
  color: 'amber',
  meta: {
    inputs: [
      { id: 'in-a', name: 'Viseme Int In', type: 'int' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Mouth Shape Trigger', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'gateType', label: 'Gate Type', type: 'string' as const, default: 'threshold' },
      { id: 'threshold', label: 'Sensitivity Threshold', type: 'number' as const, default: 0.2 }
    ]
  },
  data: {
    label: 'Viseme Decoder',
    gateType: 'threshold',
    threshold: 0.2
  }
};
