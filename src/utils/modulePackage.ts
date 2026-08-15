// .VRCM Module Package Serializer & Importer for VRC-Flow
import type { ModuleHandleDef, ModuleParamDef } from '../sdk';

export interface VRCMModulePackage {
  manifestVersion: string;
  id: string;
  name: string;
  author: string;
  version: string;
  description: string;
  category: 'Tracking' | 'Sensors' | 'Math & Logic' | 'AudioLink' | 'User Custom';
  language: 'typescript' | 'rust';
  code: string;
  inputs: ModuleHandleDef[];
  outputs: ModuleHandleDef[];
  parameters: ModuleParamDef[];
  matcapPreset?: {
    renderMode: string;
    matcapUrl: string;
    rimEnable: boolean;
    rimColor: string;
    glitterEnable: boolean;
  };
}

export function createModulePackage(
  name: string,
  description: string,
  category: VRCMModulePackage['category'],
  language: 'typescript' | 'rust',
  code: string,
  inputs: ModuleHandleDef[],
  outputs: ModuleHandleDef[],
  parameters: ModuleParamDef[] = []
): VRCMModulePackage {
  const sanitizedId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return {
    manifestVersion: '1.0',
    id: `custom.module.${sanitizedId}.${Date.now()}`,
    name,
    author: 'VRChat Creator',
    version: '1.0.0',
    description: description || 'Custom user VRC-Flow module',
    category: category || 'User Custom',
    language,
    code,
    inputs,
    outputs,
    parameters,
    matcapPreset: {
      renderMode: 'refraction',
      matcapUrl: 'emerald_glass',
      rimEnable: true,
      rimColor: '#38bdf8',
      glitterEnable: false,
    },
  };
}

export function exportModulePackageToFile(pkg: VRCMModulePackage, filename?: string) {
  const jsonStr = JSON.stringify(pkg, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${pkg.name.toLowerCase().replace(/\s+/g, '_')}.vrcm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseModulePackage(fileContent: string): VRCMModulePackage {
  try {
    const data = JSON.parse(fileContent);
    if (!data.id || !data.name || !data.code) {
      throw new Error('Invalid .vrcm module format: Missing required fields (id, name, code)');
    }
    return data as VRCMModulePackage;
  } catch (err: any) {
    throw new Error(`Failed to parse module package: ${err?.message || 'Invalid JSON'}`);
  }
}
