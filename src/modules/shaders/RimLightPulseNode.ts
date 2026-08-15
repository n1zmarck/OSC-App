import { Sparkles } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const RimLightPulseNodeDef = {
  id: 'shaders.rim-light-pulse',
  type: 'expressionNode',
  label: 'Rim Light Pulse Modulator',
  description: 'Modulates lilToon rimFresnelPower in response to audio or avatar parameters',
  category: 'Shaders & lilToon',
  icon: Sparkles,
  color: 'purple',
  meta: {
    inputs: [],
    outputs: [
      { id: 'out-value', name: 'Fresnel Power Modulated', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'formula', label: 'Pulse Formula', type: 'string' as const, default: '1.5 + (sin(time * 4) * 0.8)' }
    ]
  },
  data: {
    label: 'Rim Light Pulse',
    formula: '1.5 + (sin(time * 4) * 0.8)',
    variables: []
  }
};
