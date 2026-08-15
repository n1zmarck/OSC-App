import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';

export type ThemeScheme = 'cyberpunk' | 'oled' | 'amethyst' | 'emerald' | 'frost';
export type CanvasBgStyle = 'dots' | 'grid' | 'cross' | 'custom';
export type CustomBgType = 'preset' | 'gradient' | 'image' | 'matcap';
export type MatcapTarget = 'canvas' | 'nodes' | 'both';

export interface VRChatParameter {
  name: string;
  type: 'float' | 'int' | 'bool';
  value: number | boolean;
}

export interface CustomMacroModule {
  id: string;
  name: string;
  description: string;
  category: string;
  inputs: { id: string; name: string; type: string }[];
  outputs: { id: string; name: string; type: string }[];
  internalNodes: Node[];
  internalEdges: Edge[];
}

export interface UserMatCap {
  id: string;
  name: string;
  dataUrl: string;
  category?: string;
}

export type LilToonRenderMode = 'opaque' | 'transparent' | 'refraction' | 'gem' | 'glitter';

export interface GraphStoreState {
  // Canvas State
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  // Global Themes & Custom Colors
  currentTheme: ThemeScheme;
  customThemeColors: {
    primary: string;
    panel: string;
    accent: string;
  };
  
  // Custom Background & MatCap Options
  backgroundStyle: CanvasBgStyle;
  customBgType: CustomBgType;
  customBgValue: string;
  matcapTarget: MatcapTarget;
  matcapScale: number;
  globalNodeScale: number;

  // lilToon Shader Pipeline State (jp.lilxyzw.liltoon-2.3.4)
  lilRenderMode: LilToonRenderMode; // 'opaque' | 'transparent' | 'refraction' | 'gem' | 'glitter'
  lilBlendMode: 0 | 1 | 2 | 3; // 0: Normal, 1: Add, 2: Screen (lilToon), 3: Multiply
  hueShift: number;
  saturation: number;
  brightness: number;
  rimEnable: boolean;
  rimColor: string;
  glitterEnable: boolean;

  // Extended Authentic Unity lilToon Inspector Options (from attached Unity screenshots)
  cullMode: 'off' | 'back' | 'front';
  zWrite: boolean;
  lightMinLimit: number;
  lightMaxLimit: number;
  asUnlit: number;
  smoothness: number;
  metallic: number;
  reflectance: number;
  specularMode: 'off' | 'realistic' | 'toon';
  rimFresnelPower: number;
  rimBorder: number;
  rimBlur: number;
  glitterParticleSize: number;
  glitterDensity: number;
  glitterBlinkSpeed: number;
  glitterSensitivity: number;
  glitterPostContrast: number;

  // User Imported MatCaps Library
  userMatcaps: UserMatCap[];

  // Engine & Router State
  isRunning: boolean;
  rxPort: number;
  txPort: number;
  targetIp: string;
  packetsReceived: number;
  packetsSent: number;
  activePresetName: string;

  // VRChat Data
  currentAvatarName: string;
  avatarParameters: VRChatParameter[];

  // Custom Modules State
  customModules: CustomMacroModule[];
  userCodeModules: any[];
  addUserCodeModule: (pkg: any) => void;

  // Live Telemetry Values
  telemetryValues: Record<string, any>;

  // Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Record<string, any>) => void;
  
  // Theme & Appearance Actions
  setTheme: (theme: ThemeScheme) => void;
  setCustomThemeColors: (colors: { primary: string; panel: string; accent: string }) => void;
  setBackgroundStyle: (style: CanvasBgStyle) => void;
  setCustomBg: (type: CustomBgType, value: string) => void;
  setMatcapTarget: (target: MatcapTarget) => void;
  setGlobalNodeScale: (scale: number) => void;
  
  // lilToon Shader Pipeline Actions
  setLilRenderMode: (mode: LilToonRenderMode) => void;
  setLilBlendMode: (mode: 0 | 1 | 2 | 3) => void;
  setToneCorrection: (hue: number, sat: number, val: number) => void;
  setRimEnable: (enable: boolean, color?: string) => void;
  setGlitterEnable: (enable: boolean) => void;
  setLilExtendedParams: (params: Partial<{
    cullMode: 'off' | 'back' | 'front';
    zWrite: boolean;
    lightMinLimit: number;
    lightMaxLimit: number;
    asUnlit: number;
    smoothness: number;
    metallic: number;
    reflectance: number;
    specularMode: 'off' | 'realistic' | 'toon';
    rimFresnelPower: number;
    rimBorder: number;
    rimBlur: number;
    glitterParticleSize: number;
    glitterDensity: number;
    glitterBlinkSpeed: number;
    glitterSensitivity: number;
    glitterPostContrast: number;
  }>) => void;

  // User MatCap Actions
  addUserMatcap: (matcap: UserMatCap) => void;
  removeUserMatcap: (id: string) => void;

  // Per-Node Custom Color Override Action
  setNodeCustomColor: (nodeId: string, colors: { customBgColor?: string; customBorderColor?: string; customTextColor?: string }) => void;

  // Router Controls
  setIsRunning: (running: boolean) => void;
  setPorts: (rx: number, tx: number, ip: string) => void;
  loadPreset: (presetName: string, avatarName: string, nodes: Node[], edges: Edge[]) => void;
  addCustomModule: (module: CustomMacroModule) => void;
}

const DEFAULT_NODES: Node[] = [
  {
    id: 'osc-in-1',
    type: 'inputNode',
    position: { x: 100, y: 150 },
    data: { label: 'VRChat OSC In', address: '/avatar/parameters/Heartrate', valueType: 'float', lastValue: 75.0, port: 9001 },
  },
  {
    id: 'math-remap-1',
    type: 'mathNode',
    position: { x: 480, y: 150 },
    data: { label: 'Heart Rate Remap', operation: 'remap', inputMin: 60, inputMax: 160, outputMin: 0, outputMax: 1, currentOutput: 0.15 },
  },
  {
    id: 'logic-script-1',
    type: 'logicNode',
    position: { x: 860, y: 150 },
    data: { label: 'Smooth Pulsing', operation: 'custom_script', customFormula: '(in1 * 0.8) + (sin(time) * 0.2)', scriptOutput: 0.18 },
  },
  {
    id: 'osc-out-1',
    type: 'outputNode',
    position: { x: 1240, y: 150 },
    data: { label: 'VRChat OSC Out', address: '/avatar/parameters/HeartPulse', valueType: 'float', targetIp: '127.0.0.1', port: 9000 },
  },
];

const DEFAULT_EDGES: Edge[] = [
  { id: 'e1', source: 'osc-in-1', target: 'math-remap-1', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2.5 } },
  { id: 'e2', source: 'math-remap-1', target: 'logic-script-1', animated: true, style: { stroke: '#34d399', strokeWidth: 2.5 } },
  { id: 'e3', source: 'logic-script-1', target: 'osc-out-1', animated: true, style: { stroke: '#c084fc', strokeWidth: 2.5 } },
];

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  nodes: DEFAULT_NODES,
  edges: DEFAULT_EDGES,
  selectedNodeId: null,

  currentTheme: 'cyberpunk',
  customThemeColors: {
    primary: '#38bdf8',
    panel: 'rgba(15, 23, 42, 0.85)',
    accent: 'rgba(56, 189, 248, 0.4)',
  },

  backgroundStyle: 'dots',
  customBgType: 'matcap',
  customBgValue: 'radial-gradient(circle at 35% 35%, #5eead4 0%, #3b82f6 50%, #090d16 100%)',
  matcapTarget: 'nodes',
  matcapScale: 1.0,
  globalNodeScale: 1.0,

  // lilToon Shader Pipeline Defaults (jp.lilxyzw.liltoon-2.3.4)
  lilRenderMode: 'opaque',
  lilBlendMode: 2, // Screen (lilToon Signature)
  hueShift: 0.0,
  saturation: 1.0,
  brightness: 1.0,
  rimEnable: true,
  rimColor: '#38bdf8',
  glitterEnable: false,

  // Extended Authentic Unity lilToon Inspector Options Defaults
  cullMode: 'off',
  zWrite: true,
  lightMinLimit: 0.05,
  lightMaxLimit: 1.0,
  asUnlit: 0.0,
  smoothness: 1.0,
  metallic: 0.8,
  reflectance: 0.48,
  specularMode: 'realistic',
  rimFresnelPower: 1.0,
  rimBorder: 0.5,
  rimBlur: 0.2,
  glitterParticleSize: 0.4,
  glitterDensity: 0.094,
  glitterBlinkSpeed: 0.25,
  glitterSensitivity: 2.65,
  glitterPostContrast: 1.0,

  userMatcaps: [
    {
      id: 'default-emerald-velvet',
      name: 'Dark Emerald Velvet',
      dataUrl: 'radial-gradient(circle at 35% 35%, #34d399 0%, #059669 45%, #04150e 100%)',
      category: 'Jewel',
    },
    {
      id: 'default-amethyst-gem',
      name: 'Royal Amethyst Gem',
      dataUrl: 'radial-gradient(circle at 35% 35%, #c084fc 0%, #7e22ce 50%, #0f0718 100%)',
      category: 'Jewel',
    },
    {
      id: 'default-neon-cyan',
      name: 'Neon Cyber Cyan',
      dataUrl: 'radial-gradient(circle at 35% 35%, #5eead4 0%, #3b82f6 50%, #090d16 100%)',
      category: 'Cyber',
    },
  ],

  isRunning: true,
  rxPort: 9001,
  txPort: 9000,
  targetIp: '127.0.0.1',
  packetsReceived: 1420,
  packetsSent: 1390,
  activePresetName: 'Heartbeat & Face Sync',

  currentAvatarName: 'Neon Cyberfox v2',
  avatarParameters: [
    { name: '/avatar/parameters/Heartrate', type: 'float', value: 75.0 },
    { name: '/avatar/parameters/AFK', type: 'bool', value: false },
    { name: '/avatar/parameters/MuteSelf', type: 'bool', value: false },
    { name: '/avatar/parameters/VRMode', type: 'int', value: 1 },
    { name: '/avatar/parameters/Viseme', type: 'int', value: 0 },
    { name: '/avatar/parameters/GestureLeft', type: 'int', value: 0 },
    { name: '/avatar/parameters/GestureRight', type: 'int', value: 0 },
  ],

  customModules: [],
  userCodeModules: [],
  telemetryValues: {},

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, animated: true, style: { stroke: '#38bdf8', strokeWidth: 2.5 } }, get().edges) });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  removeNode: (id) => set({ nodes: get().nodes.filter((n) => n.id !== id), edges: get().edges.filter((e) => e.source !== id && e.target !== id) }),
  updateNodeData: (id, data) => set({
    nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
  }),

  setTheme: (theme) => set({ currentTheme: theme }),
  setCustomThemeColors: (colors) => set({ customThemeColors: colors }),
  setBackgroundStyle: (style) => set({ backgroundStyle: style }),
  setCustomBg: (type, value) => set({ customBgType: type, customBgValue: value }),
  setMatcapTarget: (target) => set({ matcapTarget: target }),
  setGlobalNodeScale: (scale) => set({ globalNodeScale: scale }),

  setLilRenderMode: (mode) => set({ lilRenderMode: mode }),
  setLilBlendMode: (mode) => set({ lilBlendMode: mode }),
  setToneCorrection: (hue, sat, val) => set({ hueShift: hue, saturation: sat, brightness: val }),
  setRimEnable: (enable, color) => set({ rimEnable: enable, ...(color ? { rimColor: color } : {}) }),
  setGlitterEnable: (enable) => set({ glitterEnable: enable }),

  setLilExtendedParams: (params) => set((state) => ({ ...state, ...params })),

  addUserMatcap: (matcap) => set({ userMatcaps: [...get().userMatcaps, matcap] }),
  removeUserMatcap: (id) => set({ userMatcaps: get().userMatcaps.filter((m) => m.id !== id) }),

  setNodeCustomColor: (nodeId, colors) => set({
    nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...colors } } : n)),
  }),

  setIsRunning: (running) => set({ isRunning: running }),
  setPorts: (rx, tx, ip) => set({ rxPort: rx, txPort: tx, targetIp: ip }),
  loadPreset: (presetName, avatarName, nodes, edges) => set({
    activePresetName: presetName,
    currentAvatarName: avatarName,
    nodes,
    edges,
  }),
  addCustomModule: (module) => set({ customModules: [...get().customModules, module] }),
  addUserCodeModule: (pkg) => set({ userCodeModules: [...(get().userCodeModules || []), pkg] }),
}));
