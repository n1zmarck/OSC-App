import { Send } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const OscTransmitterNodeDef = {
  id: 'io.osc-transmitter',
  type: 'outputNode',
  label: 'VRChat OSC Transmitter Out',
  description: 'Sends computed OSC signals to VRChat port 9000 or remote targets',
  category: 'IO',
  icon: Send,
  color: 'emerald',
  meta: {
    inputs: [
      { id: 'in-value', name: 'Transmit Value', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [],
    parameters: [
      { id: 'address', label: 'Target OSC Address', type: 'string' as const, default: '/avatar/parameters/PulseRate' },
      { id: 'port', label: 'Target Port', type: 'number' as const, default: 9000 },
      { id: 'targetIp', label: 'Target IP Address', type: 'string' as const, default: '127.0.0.1' }
    ]
  },
  data: {
    label: 'VRChat OSC Out',
    address: '/avatar/parameters/PulseRate',
    port: 9000,
    targetIp: '127.0.0.1',
    dataType: 'Float'
  }
};
