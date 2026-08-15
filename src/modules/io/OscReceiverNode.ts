import { Radio } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const OscReceiverNodeDef = {
  id: 'io.osc-receiver',
  type: 'inputNode',
  label: 'VRChat OSC Receiver In',
  description: 'Listens for incoming VRChat OSC or external hardware signal packets',
  category: 'IO',
  icon: Radio,
  color: 'sky',
  meta: {
    inputs: [],
    outputs: [
      { id: 'out-value', name: 'Received Value', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'address', label: 'OSC Address Path', type: 'string' as const, default: '/avatar/parameters/HeartRate' },
      { id: 'port', label: 'OSC Receiver Port', type: 'number' as const, default: 9001 },
      { id: 'dataType', label: 'Data Type', type: 'string' as const, default: 'Float' }
    ]
  },
  data: {
    label: 'VRChat OSC In',
    address: '/avatar/parameters/HeartRate',
    port: 9001,
    dataType: 'Float',
    value: 0.0
  }
};
