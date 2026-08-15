// IO Modules
import { OscReceiverNodeDef } from './io/OscReceiverNode';
import { OscTransmitterNodeDef } from './io/OscTransmitterNode';

// Math Modules
import { AddMathNodeDef } from './math/AddMathNode';
import { SubtractMathNodeDef } from './math/SubtractMathNode';
import { MultiplyMathNodeDef } from './math/MultiplyMathNode';
import { DivideMathNodeDef } from './math/DivideMathNode';
import { ModuloMathNodeDef } from './math/ModuloMathNode';
import { PowerMathNodeDef } from './math/PowerMathNode';
import { MinMaxMathNodeDef } from './math/MinMaxMathNode';
import { RangeRemapNodeDef } from './math/RangeRemapNode';

// Logic & Trigger Modules
import { AndLogicNodeDef } from './logic/AndLogicNode';
import { OrLogicNodeDef } from './logic/OrLogicNode';
import { XorLogicNodeDef } from './logic/XorLogicNode';
import { NotLogicNodeDef } from './logic/NotLogicNode';
import { GreaterComparatorNodeDef } from './logic/GreaterComparatorNode';
import { SrFlipFlopLatchNodeDef } from './logic/SrFlipFlopLatchNode';
import { HysteresisTriggerNodeDef } from './logic/HysteresisTriggerNode';
import { OnStateChangeNodeDef } from './logic/OnStateChangeNode';

// Tracking & Face Modules
import { EyeDampingNodeDef } from './tracking/EyeDampingNode';
import { VisemeDecoderNodeDef } from './tracking/VisemeDecoderNode';

// Biometrics & Health Modules
import { HeartRateZoneMapperNodeDef } from './biometrics/HeartRateZoneMapperNode';
import { HeartbeatPulseGenNodeDef } from './biometrics/HeartbeatPulseGenNode';

// AudioLink Modules
import { AudioLinkSplitterNodeDef } from './audiolink/AudioLinkSplitterNode';

// Shader & lilToon Modules
import { MatCapHueAnimatorNodeDef } from './shaders/MatCapHueAnimatorNode';
import { RimLightPulseNodeDef } from './shaders/RimLightPulseNode';

// Custom Script Modules
import { CustomFormulaNodeDef } from './custom/CustomFormulaNode';

export const standardModules = [
  OscReceiverNodeDef,
  OscTransmitterNodeDef,
  AddMathNodeDef,
  SubtractMathNodeDef,
  MultiplyMathNodeDef,
  DivideMathNodeDef,
  ModuloMathNodeDef,
  PowerMathNodeDef,
  MinMaxMathNodeDef,
  RangeRemapNodeDef,
  CustomFormulaNodeDef,
  EyeDampingNodeDef,
  VisemeDecoderNodeDef,
  HeartRateZoneMapperNodeDef,
  HeartbeatPulseGenNodeDef,
  AudioLinkSplitterNodeDef,
  MatCapHueAnimatorNodeDef,
  RimLightPulseNodeDef,
  OnStateChangeNodeDef,
  AndLogicNodeDef,
  OrLogicNodeDef,
  XorLogicNodeDef,
  NotLogicNodeDef,
  GreaterComparatorNodeDef,
  SrFlipFlopLatchNodeDef,
  HysteresisTriggerNodeDef,
];

export const moduleCategories = [
  'All',
  'IO',
  'Math',
  'Logic',
  'Tracking & Face',
  'Biometrics & Health',
  'AudioLink',
  'Shaders & lilToon',
  'Custom',
  'User Modules'
] as const;
