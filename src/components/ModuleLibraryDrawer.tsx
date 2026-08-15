import React, { useState } from 'react';
import { X, Search, Radio, Calculator, Code2, Box, Send, GitBranch, Sparkles, Plus, Trash2, Download, Upload } from 'lucide-react';
import { useGraphStore, type CustomMacroModule } from '../stores/useGraphStore';

interface ModuleLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleLibraryDrawer: React.FC<ModuleLibraryDrawerProps> = ({ isOpen, onClose }) => {
  const { addNode, customModules, removeCustomModule } = useGraphStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const standardNodes = [
    {
      type: 'inputNode',
      label: 'OSC Receiver In',
      description: 'Listens for incoming VRChat OSC or external hardware packets',
      category: 'IO',
      icon: Radio,
      color: 'sky',
      data: { label: 'VRChat OSC In', address: '/avatar/parameters/HeartRate', port: 9001, dataType: 'Float', value: 0.0 }
    },
    {
      type: 'mathNode',
      label: 'Add Node (A + B)',
      description: 'Adds input A and input B together',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Add (A + B)', operation: 'add', operandB: 1.0 }
    },
    {
      type: 'mathNode',
      label: 'Subtract Node (A - B)',
      description: 'Subtracts input B from input A',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Subtract (A - B)', operation: 'subtract', operandB: 1.0 }
    },
    {
      type: 'mathNode',
      label: 'Multiply Node (A × B)',
      description: 'Multiplies input A by input B scale factor',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Multiply (A × B)', operation: 'multiply', operandB: 2.0 }
    },
    {
      type: 'mathNode',
      label: 'Divide Node (A / B)',
      description: 'Divides input A by input B',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Divide (A / B)', operation: 'divide', operandB: 2.0 }
    },
    {
      type: 'mathNode',
      label: 'Modulo Node (A % B)',
      description: 'Computes remainder of input A divided by B',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Modulo (A % B)', operation: 'modulo', operandB: 1.0 }
    },
    {
      type: 'mathNode',
      label: 'Power Node (A ^ B)',
      description: 'Raises input A to the power of B',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Power (A ^ B)', operation: 'power', operandB: 2.0 }
    },
    {
      type: 'mathNode',
      label: 'Min / Max Gate',
      description: 'Finds minimum or maximum between two input signals',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Min / Max Gate', operation: 'min', operandB: 1.0 }
    },
    {
      type: 'mathNode',
      label: 'Range Remap',
      description: 'Linearly maps input values from range [InMin, InMax] to [OutMin, OutMax]',
      category: 'Math',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'Range Remap', operation: 'remap', inMin: 0, inMax: 100, outMin: 0, outMax: 1 }
    },
    {
      type: 'expressionNode',
      label: 'Custom Formula Script',
      description: 'Evaluates user inline math expressions in real-time (e.g. sin, cos, lerp)',
      category: 'Custom',
      icon: Code2,
      color: 'purple',
      data: { label: 'Custom Formula', formula: '(in1 * 0.8) + (sin(time) * 0.2)', variables: ['in1'] }
    },
    {
      type: 'expressionNode',
      label: 'Eye Damping & Smoothing',
      description: 'Smooths raw eye tracking gaze vectors with exponential damping',
      category: 'Tracking & Face',
      icon: Sparkles,
      color: 'purple',
      data: { label: 'Eye Damping', formula: 'lerp(0, eye_in, deltaTime * 12.0)', variables: ['eye_in'] }
    },
    {
      type: 'logicNode',
      label: 'Viseme & Gesture Decoder',
      description: 'Decodes VRChat 15-viseme integer parameters into shapekey triggers',
      category: 'Tracking & Face',
      icon: GitBranch,
      color: 'amber',
      data: { label: 'Viseme Decoder', gateType: 'threshold', threshold: 0.2 }
    },
    {
      type: 'expressionNode',
      label: 'Heart Rate Zone Color Mapper',
      description: 'Maps Heart Rate BPM to avatar emissive shader color ramps',
      category: 'Biometrics & Health',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'HR Zone Mapper', formula: 'clamp((hr_bpm - 60) / 100, 0.0, 1.0)', variables: ['hr_bpm'] }
    },
    {
      type: 'expressionNode',
      label: 'Heartbeat Pulse Wave Generator',
      description: 'Synthesizes ECG heartbeat pulse waveforms for lilToon AudioLink',
      category: 'Biometrics & Health',
      icon: Calculator,
      color: 'indigo',
      data: { label: 'ECG Pulse Wave', formula: 'sin(time * (bpm / 60) * 6.283)', variables: ['bpm'] }
    },
    {
      type: 'expressionNode',
      label: 'AudioLink Bass & Treble Gate',
      description: 'Extracts Bass, Low-Mid, and Treble spectrum pulses from AudioLink',
      category: 'AudioLink',
      icon: Radio,
      color: 'sky',
      data: { label: 'AudioLink Gate', formula: 'audioLinkPulse > 0.6 ? 1.0 : 0.0', variables: ['audioLinkPulse'] }
    },
    {
      type: 'expressionNode',
      label: 'MatCap Rainbow Hue Animator',
      description: 'Continuously rotates lilToon MatCap hueShift for animated chrome surfaces',
      category: 'Shaders & lilToon',
      icon: Sparkles,
      color: 'purple',
      data: { label: 'MatCap Hue Animator', formula: '(time * 45) % 360', variables: [] }
    },
    {
      type: 'expressionNode',
      label: 'Rim Light Pulse Modulator',
      description: 'Modulates lilToon rimFresnelPower in response to audio or avatar parameters',
      category: 'Shaders & lilToon',
      icon: Sparkles,
      color: 'purple',
      data: { label: 'Rim Light Pulse', formula: '1.5 + (sin(time * 4) * 0.8)', variables: [] }
    },
    {
      type: 'logicNode',
      label: 'Logic & Threshold Gate',
      description: 'Converts float triggers into boolean states or logic AND/OR decisions',
      category: 'Logic',
      icon: GitBranch,
      color: 'amber',
      data: { label: 'Logic Gate', gateType: 'threshold', threshold: 0.5 }
    },
    {
      type: 'outputNode',
      label: 'OSC Transmitter Out',
      description: 'Sends computed OSC signals to VRChat port 9000 or remote targets',
      category: 'IO',
      icon: Send,
      color: 'emerald',
      data: { label: 'OSC Out', address: '/avatar/parameters/PulseRate', port: 9000, targetIp: '127.0.0.1' }
    }
  ];

  const handleAddStandardNode = (spec: typeof standardNodes[0]) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: spec.type,
      position: { x: 350 + Math.random() * 80, y: 200 + Math.random() * 80 },
      data: { ...spec.data },
    };
    addNode(newNode);
    onClose();
  };

  const handleAddMacroModuleNode = (module: CustomMacroModule) => {
    const newNode = {
      id: `macro-${Date.now()}`,
      type: 'macroNode',
      position: { x: 350 + Math.random() * 80, y: 200 + Math.random() * 80 },
      data: { label: module.name, moduleId: module.id },
    };
    addNode(newNode);
    onClose();
  };

  const categories = ['All', 'IO', 'Math', 'Logic', 'Tracking & Face', 'Biometrics & Health', 'AudioLink', 'Shaders & lilToon', 'Custom', 'User Modules'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-md transition-opacity">
      <div className="glass-panel w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl border-l border-white/15 backdrop-blur-3xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Node & Module Library</h2>
                <p className="text-xs text-slate-400">Select standard or custom user modules</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search nodes or custom modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input rounded-2xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-sky-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
                      : 'glass-pill text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Node Cards List */}
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
            {/* Standard Built-in Nodes */}
            {(selectedCategory === 'All' || selectedCategory !== 'User Modules') && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                  Built-in Processing Nodes
                </h3>
                <div className="space-y-2.5">
                  {standardNodes
                    .filter((n) => selectedCategory === 'All' || n.category === selectedCategory)
                    .filter((n) => n.label.toLowerCase().includes(searchTerm.toLowerCase()) || n.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((node) => {
                      const IconComponent = node.icon;
                      return (
                        <div
                          key={node.type}
                          onClick={() => handleAddStandardNode(node)}
                          className="glass-node rounded-2xl p-3.5 flex items-center justify-between group cursor-pointer transition-all hover:translate-x-1"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-sky-400/50 group-hover:bg-sky-500/20 text-sky-400 transition-colors">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                                {node.label}
                              </h4>
                              <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">
                                {node.description}
                              </p>
                            </div>
                          </div>
                          <button className="p-1.5 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 group-hover:bg-sky-500 text-sky-300 group-hover:text-slate-950 transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Custom User Macro Modules */}
            {(selectedCategory === 'All' || selectedCategory === 'User Modules' || selectedCategory === 'Custom') && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" /> Saved Custom Modules
                  </h3>
                  <span className="text-[10px] text-slate-500">{customModules.length} Modules</span>
                </div>

                <div className="space-y-2.5">
                  {customModules
                    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((module) => (
                      <div
                        key={module.id}
                        onClick={() => handleAddMacroModuleNode(module)}
                        className="glass-node rounded-2xl p-3.5 flex items-center justify-between group cursor-pointer transition-all hover:translate-x-1 border-purple-500/20 hover:border-purple-400/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            <Box className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
                                {module.name}
                              </h4>
                              <span className="glass-pill px-2 py-0.2 text-[9px] text-purple-300">
                                {module.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomModule(module.id);
                            }}
                            className="p-1.5 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-xl bg-purple-500 text-white transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs">
          <button className="glass-pill px-3 py-1.5 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import Module</span>
          </button>
          <button className="glass-pill px-3 py-1.5 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export Pack</span>
          </button>
        </div>
      </div>
    </div>
  );
};
