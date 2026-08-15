import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const HeartbeatPulseGenNodeDef = {
  id: 'biometrics.heartbeat-pulse-gen',
  type: 'expressionNode',
  label: 'Heartbeat Pulse Wave Generator',
  description: 'Synthesizes ECG heartbeat pulse waveforms for lilToon AudioLink',
  category: 'Biometrics & Health',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'bpm', name: 'Heart Rate BPM', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'ECG Pulse Wave Output', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'formula', label: 'ECG Wave Expression', type: 'string' as const, default: 'sin(time * (bpm / 60) * 6.283)' }
    ]
  },
  data: {
    label: 'ECG Pulse Wave',
    formula: 'sin(time * (bpm / 60) * 6.283)',
    variables: ['bpm']
  }
};
