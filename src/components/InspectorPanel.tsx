import React from 'react';
import { Sliders, Trash2, Code2, Activity, Info, Maximize2, Palette, RotateCcw } from 'lucide-react';
import { useGraphStore } from '../stores/useGraphStore';

export const InspectorPanel: React.FC = () => {
  const { 
    nodes, 
    selectedNodeId, 
    removeNode, 
    updateNodeData, 
    setSelectedNodeId,
    setNodeCustomColor 
  } = useGraphStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="glass-panel w-76 h-[calc(100vh-6rem)] my-3 mr-4 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-xl">
        <div className="p-4 rounded-full bg-white/10 border border-white/15 text-slate-300 mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-extrabold text-white">No Node Selected</h3>
        <p className="text-xs text-slate-300 mt-1 max-w-[200px] font-medium leading-relaxed">
          Click any node on the canvas to inspect parameters, change node custom colors, or drag its bottom-right corner handle to resize it.
        </p>
      </aside>
    );
  }

  const { id, type, data, width, height } = selectedNode;
  const customBgColor = (data.customBgColor as string) || '';
  const customBorderColor = (data.customBorderColor as string) || '';

  const presetBgSwatches = [
    { name: 'Navy', hex: '#0f172a' },
    { name: 'Black', hex: '#050508' },
    { name: 'Purple', hex: '#1e0c38' },
    { name: 'Emerald', hex: '#072e1e' },
    { name: 'Crimson', hex: '#380c16' },
    { name: 'Amber', hex: '#331d08' },
  ];

  const presetBorderSwatches = [
    '#38bdf8', '#34d399', '#c084fc', '#fbbf24', '#fb7185', '#ffffff'
  ];

  return (
    <aside className="glass-panel w-84 h-[calc(100vh-6rem)] my-3 mr-4 rounded-3xl p-5 flex flex-col justify-between shadow-2xl animate-in fade-in duration-200 overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-sky-500/30 text-sky-300 border border-sky-400/40">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">{data.label as string || 'Node Settings'}</h3>
              <span className="text-xs text-sky-300 font-mono font-bold">{id}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="text-xs font-bold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>

        {/* Display Label */}
        <div>
          <label className="text-xs font-bold text-slate-200 mb-1.5 block">Display Label</label>
          <input
            type="text"
            value={data.label as string || ''}
            onChange={(e) => updateNodeData(id, { label: e.target.value })}
            className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs font-bold text-white bg-[#090d16]"
          />
        </div>

        {/* Per-Node Custom Color Override Panel */}
        <div className="bg-[#090d16] rounded-2xl p-3.5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-sky-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-sky-400" /> Per-Node Custom Colors
            </label>
            {(customBgColor || customBorderColor) && (
              <button
                onClick={() => setNodeCustomColor(id, { customBgColor: undefined, customBorderColor: undefined })}
                className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Node Background Color Swatches */}
          <div>
            <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">Background Color</span>
            <div className="flex items-center gap-1.5">
              {presetBgSwatches.map((sw) => (
                <button
                  key={sw.name}
                  onClick={() => setNodeCustomColor(id, { customBgColor: sw.hex })}
                  style={{ backgroundColor: sw.hex }}
                  className={`w-6 h-6 rounded-lg border border-white/20 transition-transform cursor-pointer hover:scale-115 ${
                    customBgColor === sw.hex ? 'ring-2 ring-sky-400 scale-110' : ''
                  }`}
                  title={sw.name}
                />
              ))}
              <input
                type="color"
                value={customBgColor || '#0f172a'}
                onChange={(e) => setNodeCustomColor(id, { customBgColor: e.target.value })}
                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                title="Custom Hex Picker"
              />
            </div>
          </div>

          {/* Node Accent Border Swatches */}
          <div>
            <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">Border / Accent Color</span>
            <div className="flex items-center gap-1.5">
              {presetBorderSwatches.map((hex) => (
                <button
                  key={hex}
                  onClick={() => setNodeCustomColor(id, { customBorderColor: hex })}
                  style={{ backgroundColor: hex }}
                  className={`w-6 h-6 rounded-lg border border-white/20 transition-transform cursor-pointer hover:scale-115 ${
                    customBorderColor === hex ? 'ring-2 ring-white scale-110' : ''
                  }`}
                />
              ))}
              <input
                type="color"
                value={customBorderColor || '#38bdf8'}
                onChange={(e) => setNodeCustomColor(id, { customBorderColor: e.target.value })}
                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                title="Custom Hex Picker"
              />
            </div>
          </div>
        </div>

        {/* Node Dimensions */}
        <div className="bg-[#090d16] rounded-2xl p-3.5 border border-white/15 space-y-2">
          <label className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-purple-400" /> Node Dimensions
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5 uppercase">Width (px)</span>
              <input
                type="number"
                placeholder="Auto"
                value={width || ''}
                onChange={(e) => updateNodeData(id, { width: parseInt(e.target.value) || undefined })}
                className="w-full glass-input rounded-xl px-2.5 py-1.5 text-center text-purple-300"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5 uppercase">Height (px)</span>
              <input
                type="number"
                placeholder="Auto"
                value={height || ''}
                onChange={(e) => updateNodeData(id, { height: parseInt(e.target.value) || undefined })}
                className="w-full glass-input rounded-xl px-2.5 py-1.5 text-center text-purple-300"
              />
            </div>
          </div>
        </div>

        {type === 'inputNode' && (
          <>
            <div>
              <label className="text-xs font-bold text-slate-200 mb-1.5 block">OSC Port</label>
              <input
                type="number"
                value={Number(data.port) || 9001}
                onChange={(e) => updateNodeData(id, { port: parseInt(e.target.value) || 9001 })}
                className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs font-mono font-bold text-sky-300 bg-[#090d16]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1.5 block">OSC Address Path</label>
              <input
                type="text"
                value={data.address as string || ''}
                onChange={(e) => updateNodeData(id, { address: e.target.value })}
                className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs font-mono font-bold text-sky-300 bg-[#090d16]"
              />
            </div>
          </>
        )}

        {type === 'expressionNode' && (
          <div>
            <label className="text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" /> Formula Expression
            </label>
            <textarea
              rows={4}
              value={data.formula as string || ''}
              onChange={(e) => updateNodeData(id, { formula: e.target.value })}
              className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-purple-200 resize-none bg-[#090d16]"
            />
          </div>
        )}

        {type === 'outputNode' && (
          <>
            <div>
              <label className="text-xs font-bold text-slate-200 mb-1.5 block">Destination IP</label>
              <input
                type="text"
                value={data.targetIp as string || '127.0.0.1'}
                onChange={(e) => updateNodeData(id, { targetIp: e.target.value })}
                className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs font-mono font-bold text-emerald-300 bg-[#090d16]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1.5 block">Destination Port</label>
              <input
                type="number"
                value={Number(data.port) || 9000}
                onChange={(e) => updateNodeData(id, { port: parseInt(e.target.value) || 9000 })}
                className="w-full glass-input rounded-2xl px-3.5 py-2 text-xs font-mono font-bold text-emerald-300 bg-[#090d16]"
              />
            </div>
          </>
        )}

        {/* Node Diagnostics */}
        <div className="bg-[#090d16] rounded-2xl p-3 border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" /> Socket Type
            </span>
            <span className="glass-pill px-2.5 py-0.5 text-xs text-sky-300 font-mono font-bold border border-sky-400/30">
              {(data.dataType as string) || 'Float'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Telemetry Speed
            </span>
            <span className="text-emerald-400 font-mono font-bold text-xs">Sub-ms (Rust)</span>
          </div>
        </div>
      </div>

      {/* Delete Node Action */}
      <div className="border-t border-white/15 pt-4 mt-4">
        <button
          onClick={() => removeNode(id)}
          className="w-full glass-pill py-2.5 text-xs font-extrabold text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer border-rose-500/40"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Node</span>
        </button>
      </div>
    </aside>
  );
};
