import { Radio } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const AudioLinkSplitterNodeDef = {
  id: 'audiolink.splitter',
  type: 'expressionNode',
  label: 'AudioLink Bass & Treble Gate',
  description: 'Extracts Bass, Low-Mid, and Treble spectrum pulses from AudioLink',
  category: 'AudioLink',
  icon: Radio,
  color: 'sky',
  meta: {
    inputs: [
      { id: 'audioLinkPulse', name: 'AudioLink Pulse Buffer', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Strobe Gate Output', type: 'bool' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'formula', label: 'Strobe Gate Threshold', type: 'string' as const, default: 'audioLinkPulse > 0.6 ? 1.0 : 0.0' }
    ]
  },
  data: {
    label: 'AudioLink Gate',
    formula: 'audioLinkPulse > 0.6 ? 1.0 : 0.0',
    variables: ['audioLinkPulse']
  }
};
