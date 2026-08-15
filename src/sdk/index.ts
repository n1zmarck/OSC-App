// VRC-Flow Standard Library SDK (@vrc-flow/sdk)

export type SignalType = 'float' | 'bool' | 'int' | 'string' | 'vector3' | 'osc';

export interface ModuleHandleDef {
  id: string;
  name: string;
  type: SignalType;
  direction: 'input' | 'output';
  defaultValue?: number | boolean | string | number[];
}

export interface ModuleParamDef {
  id: string;
  label: string;
  type: 'range' | 'toggle' | 'select' | 'text';
  default: number | boolean | string;
  min?: number;
  max?: number;
  options?: string[];
}

export interface ModuleContext {
  time: number;          // Total elapsed time in seconds
  deltaTime: number;     // Delta time since last frame
  audioLinkPulse: number;// Real-time AudioLink reactivity pulse (0.0 to 1.0)
  inputs: Record<string, number | boolean | string | number[]>;
  params: Record<string, number | boolean | string>;
  outputs: Record<string, (val: number | boolean | string | number[]) => void>;
  log: (msg: string) => void;
}

export abstract class VRCModule {
  abstract readonly meta: {
    id: string;
    name: string;
    version: string;
    category: 'Tracking' | 'Sensors' | 'Math & Logic' | 'AudioLink' | 'User Custom';
    inputs: ModuleHandleDef[];
    outputs: ModuleHandleDef[];
    parameters?: ModuleParamDef[];
  };

  onInit?(ctx: ModuleContext): void;
  abstract onProcess(ctx: ModuleContext): void;
}

// Built-in VRC-Flow Math & Signal Helpers
export const VRCMath = {
  // Basic Arithmetic
  add: (a: number, b: number): number => a + b,
  sub: (a: number, b: number): number => a - b,
  mul: (a: number, b: number): number => a * b,
  div: (a: number, b: number): number => (b === 0 ? 0 : a / b),
  mod: (a: number, b: number): number => (b === 0 ? 0 : a % b),
  pow: (a: number, b: number): number => Math.pow(a, b),
  min: (a: number, b: number): number => Math.min(a, b),
  max: (a: number, b: number): number => Math.max(a, b),
  abs: (val: number): number => Math.abs(val),

  // Advanced Signal Processing
  clamp: (val: number, min: number, max: number): number => Math.max(min, Math.min(max, val)),
  lerp: (a: number, b: number, t: number): number => a + (b - a) * Math.max(0, Math.min(1, t)),
  smoothStep: (min: number, max: number, value: number): number => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  },
  deadzone: (val: number, threshold: number): number => (Math.abs(val) < threshold ? 0 : val),
  remap: (val: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    if (inMax === inMin) return outMin;
    const norm = (val - inMin) / (inMax - inMin);
    return outMin + norm * (outMax - outMin);
  },
  quantize: (val: number, step: number): number => (step <= 0 ? val : Math.round(val / step) * step),
};
