import React, { useState } from 'react';
import { X, Sparkles, Box, CheckCircle } from 'lucide-react';
import { useGraphStore } from '../stores/useGraphStore';

interface CustomModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomModuleModal: React.FC<CustomModuleModalProps> = ({ isOpen, onClose }) => {
  const { nodes, createMacroFromSelection } = useGraphStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('User Custom');

  if (!isOpen) return null;

  const selectedNodes = nodes.filter((n) => n.selected);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMacroFromSelection(name || 'Custom Module', description);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Create Custom Module</h2>
              <p className="text-xs text-slate-400">Encapsulate canvas nodes into a reusable macro node</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Selected Nodes ({selectedNodes.length})
            </label>
            {selectedNodes.length === 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-300">
                ⚠️ Select one or more nodes on the canvas first to group them into a Custom Module.
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
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Module Name</label>
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
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full glass-input rounded-2xl px-4 py-2 text-xs text-slate-200 cursor-pointer"
            >
              <option value="Tracking" className="bg-slate-900">Tracking</option>
              <option value="Sensors" className="bg-slate-900">Sensors</option>
              <option value="Math & Logic" className="bg-slate-900">Math & Logic</option>
              <option value="User Custom" className="bg-slate-900">User Custom</option>
            </select>
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

          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="glass-pill px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedNodes.length === 0}
              className={`px-5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                selectedNodes.length > 0
                  ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Save to Module Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
