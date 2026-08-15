// Module Runtime Evaluator for VRC-Flow Custom Code Modules
import { VRCMath, type ModuleContext } from '../sdk';

export interface ModuleRunResult {
  outputs: Record<string, number | boolean | string | number[]>;
  logs: string[];
  error?: string;
}

export function runTSModuleCode(
  code: string,
  inputs: Record<string, number | boolean | string | number[]>,
  params: Record<string, number | boolean | string>,
  time: number,
  deltaTime: number,
  audioLinkPulse: number
): ModuleRunResult {
  const outputs: Record<string, number | boolean | string | number[]> = {};
  const logs: string[] = [];

  const ctx: ModuleContext = {
    time,
    deltaTime,
    audioLinkPulse,
    inputs: inputs || {},
    params: params || {},
    outputs: {
      emit: (id: string, val: number | boolean | string | number[]) => {
        outputs[id] = val;
      },
    },
    log: (msg: string) => {
      logs.push(msg);
    },
  };

  // Provide direct helper output setters (e.g. outputs.out_val(1.23))
  const outputProxy = new Proxy(outputs, {
    get: (_, prop: string) => {
      return (val: number | boolean | string | number[]) => {
        outputs[prop] = val;
      };
    },
  });
  ctx.outputs = outputProxy as any;

  try {
    // Create sandboxed evaluation scope with VRCMath and ModuleContext
    const runner = new Function(
      'ctx',
      'VRCMath',
      `
      'use strict';
      try {
        ${code}
        if (typeof onProcess === 'function') {
          onProcess(ctx);
        }
      } catch (err) {
        ctx.log('Runtime Error: ' + err.message);
      }
      `
    );

    runner(ctx, VRCMath);
    return { outputs, logs };
  } catch (err: any) {
    return {
      outputs: {},
      logs,
      error: err?.message || 'Module evaluation failed',
    };
  }
}
