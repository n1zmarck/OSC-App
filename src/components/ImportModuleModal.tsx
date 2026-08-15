import React, { useState } from 'react';
import { X, Upload, Package, Check, AlertTriangle, Code2 } from 'lucide-react';
import { useGraphStore } from '../stores/useGraphStore';
import { parseModulePackage, type VRCMModulePackage } from '../utils/modulePackage';

interface ImportModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModuleModal: React.FC<ImportModuleModalProps> = ({ isOpen, onClose }) => {
  const addUserCodeModule = useGraphStore((s) => s.addUserCodeModule);
  const addNode = useGraphStore((s) => s.addNode);

  const [parsedPkg, setParsedPkg] = useState<VRCMModulePackage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileContent = (content: string) => {
    try {
      setErrorMsg(null);
      const pkg = parseModulePackage(content);
      setParsedPkg(pkg);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse module package');
      setParsedPkg(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleFileContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleFileContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportConfirm = () => {
    if (!parsedPkg) return;

    // Register package into store
    addUserCodeModule(parsedPkg);

    // Instantiate new Code Module Node on Canvas
    const newNode = {
      id: `node_module_${Date.now()}`,
      type: 'macroNode',
      position: { x: 350, y: 250 },
      data: {
        label: parsedPkg.name,
        category: parsedPkg.category,
        description: parsedPkg.description,
        inputs: parsedPkg.inputs.map((i) => ({ id: i.id, name: i.name, type: i.type })),
        outputs: parsedPkg.outputs.map((o) => ({ id: o.id, name: o.name, type: o.type })),
        customColor: '#8b5cf6',
        isCodeModule: true,
        codeLanguage: parsedPkg.language,
        code: parsedPkg.code,
      },
    };

    addNode(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Import VRC-Flow Module (.vrcm)</h2>
              <p className="text-xs text-slate-400">Import user TypeScript or Rust signal processing modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!parsedPkg ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer ${
              dragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/20 bg-black/30 hover:border-white/40'
            }`}
          >
            <Upload className="w-10 h-10 text-cyan-400 animate-bounce" />
            <div>
              <p className="text-xs font-bold text-slate-200">Drag & Drop `.vrcm` module file here</p>
              <p className="text-[11px] text-slate-400 mt-1">or click to browse from disk</p>
            </div>
            <input
              type="file"
              accept=".vrcm,.json"
              onChange={handleFileInput}
              className="hidden"
              id="vrcm-file-picker"
            />
            <label
              htmlFor="vrcm-file-picker"
              className="glass-pill px-4 py-2 text-xs text-cyan-300 font-bold hover:bg-cyan-500/20 cursor-pointer mt-2"
            >
              Browse `.vrcm` Package
            </label>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-2xl px-3 py-1.5 mt-2">
                <AlertTriangle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-black/40 rounded-2xl p-4 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  {parsedPkg.name}
                </h3>
                <span className="glass-pill px-2.5 py-0.5 text-[10px] text-cyan-300 font-mono uppercase">
                  {parsedPkg.language}
                </span>
              </div>
              <p className="text-xs text-slate-300">{parsedPkg.description}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/10">
                <span>Inputs: {parsedPkg.inputs.length}</span>
                <span>Outputs: {parsedPkg.outputs.length}</span>
                <span>Version: v{parsedPkg.version}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setParsedPkg(null)}
                className="glass-button rounded-2xl px-4 py-2 text-xs text-slate-300 hover:text-white"
              >
                Choose Another File
              </button>
              <button
                onClick={handleImportConfirm}
                className="glass-pill px-5 py-2 text-xs font-bold text-white bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-500/30 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Import Module to Canvas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
