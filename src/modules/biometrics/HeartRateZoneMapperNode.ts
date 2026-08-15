import { Calculator } from 'lucide-react';
import type { SignalType } from '../../sdk';

export const HeartRateZoneMapperNodeDef = {
  id: 'biometrics.hr-zone-mapper',
  type: 'expressionNode',
  label: 'Heart Rate Zone Color Mapper',
  description: 'Maps Heart Rate BPM to avatar emissive shader color ramps',
  category: 'Biometrics & Health',
  icon: Calculator,
  color: 'indigo',
  meta: {
    inputs: [
      { id: 'hr_bpm', name: 'Smartwatch BPM In', type: 'float' as SignalType, direction: 'input' as const }
    ],
    outputs: [
      { id: 'out-value', name: 'Normalized Zone Intensity', type: 'float' as SignalType, direction: 'output' as const }
    ],
    parameters: [
      { id: 'formula', label: 'Mapper Expression', type: 'string' as const, default: 'clamp((hr_bpm - 60) / 100, 0.0, 1.0)' }
    ]
  },
  data: {
    label: 'HR Zone Mapper',
    formula: 'clamp((hr_bpm - 60) / 100, 0.0, 1.0)',
    variables: ['hr_bpm']
  }
};
