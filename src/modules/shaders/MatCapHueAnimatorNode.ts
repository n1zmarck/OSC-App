import { Sparkles } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const MatCapHueAnimatorNodeDef = {
  id: 'shaders.matcap-hue-animator',
  type: 'expressionNode',
  label: 'MatCap Rainbow Hue Animator',
  description: 'Continuously rotates lilToon MatCap hueShift for animated chrome surfaces',
  category: 'Shaders & lilToon',
  icon: Sparkles,
  color: 'purple',
  meta: {
    inputs: [],
    outputs: [
      { id: 'out-value', name: 'Hue Shift Angle (0-360)', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'formula', label: 'Rotation Speed Expression', type: 'string' as const, default: '(time * 45) % 360' }
    ]
  },
  data: {
    label: 'MatCap Hue Animator',
    formula: '(time * 45) % 360',
    variables: []
  }
};
