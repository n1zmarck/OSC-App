import { Sparkles } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const EyeDampingNodeDef = {
  id: 'tracking.eye-damping',
  type: 'expressionNode',
  label: 'Eye Damping & Smoothing',
  description: 'Smooths raw eye tracking gaze vectors with exponential damping',
  category: 'Tracking & Face',
  icon: Sparkles,
  color: 'purple',
  meta: {
    inputs: [
      { id: 'eye_in', name: 'Raw Eye Vector', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Smoothed Eye Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'formula', label: 'Damping Formula', type: 'string' as const, default: 'lerp(0, eye_in, deltaTime * 12.0)' }
    ]
  },
  data: {
    label: 'Eye Damping',
    formula: 'lerp(0, eye_in, deltaTime * 12.0)',
    variables: ['eye_in']
  }
};
