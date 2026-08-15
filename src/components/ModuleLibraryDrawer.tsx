import React, { useState } from 'react';
import { X, Search, Sparkles, Plus, Trash2, Download, Upload, Box } from 'lucide-react';
import { useGraphStore, type CustomMacroModule } from '../stores/useGraphStore';
import { standardModules, moduleCategories } from '../modules';

interface ModuleLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImportModal?: () => void;
}

export const ModuleLibraryDrawer: React.FC<ModuleLibraryDrawerProps> = ({ isOpen, onClose, onOpenImportModal }) => {
  const { addNode, customModules, removeCustomModule } = useGraphStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const handleAddStandardNode = (spec: typeof standardModules[0]) => {
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
              {moduleCategories.map((cat) => (
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
            {/* Standard Built-in Modules */}
            {(selectedCategory === 'All' || selectedCategory !== 'User Modules') && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                  Built-in Processing Modules
                </h3>
                <div className="space-y-2.5">
                  {standardModules
                    .filter((n) => selectedCategory === 'All' || n.category === selectedCategory)
                    .filter((n) => n.label.toLowerCase().includes(searchTerm.toLowerCase()) || n.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((node) => {
                      const IconComponent = node.icon;
                      return (
                        <div
                          key={node.label}
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
          <button
            onClick={() => {
              onClose();
              if (onOpenImportModal) onOpenImportModal();
            }}
            className="glass-pill px-3 py-1.5 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import .vrcm</span>
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
