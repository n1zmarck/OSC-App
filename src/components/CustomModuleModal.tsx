import React, { useState } from 'react';
import { X, Sparkles, Code2, CheckCircle, Download } from 'lucide-react';
import { useGraphStore } from '../stores/useGraphStore';
import { createModulePackage, exportModulePackageToFile } from '../utils/modulePackage';

interface CustomModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomModuleModal: React.FC<CustomModuleModalProps> = ({ isOpen, onClose }) => {
  const { nodes, createMacroFromSelection, addNode, addUserCodeModule } = useGraphStore();
  const [activeTab, setActiveTab] = useState<'macro' | 'code'>('code');
  const [name, setName] = useState('My Custom Signal Module');
  const [description, setDescription] = useState('Smooths and filters OSC signals');
  const [category, setCategory] = useState<'Tracking' | 'Sensors' | 'Math & Logic' | 'AudioLink' | 'User Custom'>('User Custom');
  const [language, setLanguage] = useState<'typescript' | 'rust'>('typescript');

  const [tsCode, setTsCode] = useState(`// Custom VRC-Flow TypeScript Module (@vrc-flow/sdk)
// Available: ctx.inputs, ctx.outputs, ctx.time, ctx.deltaTime, ctx.audioLinkPulse, VRCMath

function onProcess(ctx) {
  const val = Number(ctx.inputs.in_val) || 0;
  const speed = 8.0;
  
  // Apply VRCMath Exponential Smoothing
  const smoothed = VRCMath.lerp(0, val, ctx.deltaTime * speed);
  
  // Emit to output handle
  ctx.outputs.out_val(smoothed);
}
`);

  if (!isOpen) return null;

  const selectedNodes = nodes.filter((n) => n.selected);

  const handleMacroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMacroFromSelection(name || 'Custom Module', description);
    onClose();
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inputs = [
      { id: 'in_val', name: 'Value Input', type: 'float' as const, direction: 'input' as const },
    ];
    const outputs = [
      { id: 'out_val', name: 'Signal Output', type: 'float' as const, direction: 'output' as const },
    ];

    const pkg = createModulePackage(
      name,
      description,
      category,
      language,
      tsCode,
      inputs,
      outputs
    );

    // Register into store
    addUserCodeModule(pkg);

    // Add node to canvas
    const newNode = {
      id: `node_code_${Date.now()}`,
      type: 'macroNode',
      position: { x: 400, y: 300 },
      data: {
        label: name,
        category,
        description,
        inputs: inputs.map((i) => ({ id: i.id, name: i.name, type: i.type })),
        outputs: outputs.map((o) => ({ id: o.id, name: o.name, type: o.type })),
        customColor: '#a855f7',
        isCodeModule: true,
        codeLanguage: language,
        code: tsCode,
      },
    };

    addNode(newNode);
    onClose();
  };

  const handleExportPkg = () => {
    const inputs = [
      { id: 'in_val', name: 'Value Input', type: 'float' as const, direction: 'input' as const },
    ];
    const outputs = [
      { id: 'out_val', name: 'Signal Output', type: 'float' as const, direction: 'output' as const },
    ];
    const pkg = createModulePackage(name, description, category, language, tsCode, inputs, outputs);
    exportModulePackageToFile(pkg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Custom Module Studio</h2>
              <p className="text-xs text-slate-400">Create reusable canvas macros or TypeScript/Rust code modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/10 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'code' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            TypeScript / Rust Code Module
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('macro')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'macro' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Canvas Selection Macro ({selectedNodes.length})
          </button>
        </div>

        {activeTab === 'macro' ? (
          <form onSubmit={handleMacroSubmit} className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Selected Nodes ({selectedNodes.length})
              </label>
              {selectedNodes.length === 0 ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-300">
                  ⚠️ Select one or more nodes on the canvas first to group them into a Sub-Graph Macro.
                </div>
              ) : (
                <div className="bg-black/30 rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Grouping {selectedNodes.map((n) => (n.data.label as string) || n.id).join(', ')}
                  </span>
                  <span className="glass-pill px-2 py-0.5 text-[10px] text-purple-300">Ready</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Macro Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dual Eye Damping Pipeline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input rounded-2xl px-4 py-2 text-xs focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Description</label>
              <textarea
                rows={3}
                placeholder="Explain what this custom module processes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full glass-input rounded-2xl px-4 py-2 text-xs focus:ring-1 focus:ring-purple-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="glass-button rounded-2xl px-4 py-2 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedNodes.length === 0}
                className="glass-pill px-5 py-2 text-xs font-bold text-white bg-purple-500/20 border border-purple-400/40 hover:bg-purple-500/30 disabled:opacity-50"
              >
                Create Macro Module
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Module Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input rounded-2xl px-4 py-2 text-xs focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full glass-input rounded-2xl px-4 py-2 text-xs text-slate-200 cursor-pointer bg-slate-900"
                >
                  <option value="typescript">TypeScript (@vrc-flow/sdk)</option>
                  <option value="rust">Rust (WASM Core)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Code Editor (`onProcess(ctx)`)</label>
              <textarea
                rows={8}
                value={tsCode}
                onChange={(e) => setTsCode(e.target.value)}
                className="w-full font-mono text-xs glass-input rounded-2xl p-3 focus:ring-1 focus:ring-purple-400 bg-slate-950/80 text-purple-200 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleExportPkg}
                className="glass-pill px-4 py-2 text-xs text-purple-300 font-bold hover:bg-purple-500/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export `.vrcm` Package
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-button rounded-2xl px-4 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-pill px-5 py-2 text-xs font-bold text-white bg-purple-500/20 border border-purple-400/40 hover:bg-purple-500/30"
                >
                  Create & Add to Canvas
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
