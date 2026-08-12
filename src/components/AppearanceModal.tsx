import React, { useState } from 'react';
import {
  X,
  Palette,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Sun,
  Shield,
  Eye,
  Zap,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { useGraphStore, type ThemeScheme, type LilToonRenderMode } from '../stores/useGraphStore';

interface CustomMatcapImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomMatcapImporterModal: React.FC<CustomMatcapImporterModalProps> = ({ isOpen, onClose }) => {
  const { setCustomBg, addUserMatcap } = useGraphStore();
  const [matcapName, setMatcapName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMatcapName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!previewUrl) return;
    const name = matcapName || 'Custom MatCap';
    setCustomBg('matcap', previewUrl);
    addUserMatcap({
      id: `matcap-${Date.now()}`,
      name,
      dataUrl: previewUrl,
      category: 'User Custom',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl w-full max-w-md border border-white/20 shadow-2xl p-6 space-y-4 bg-slate-900/90">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-sky-400">
            <Upload className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-100">Import Custom MatCap PNG</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
              MatCap Name
            </label>
            <input
              type="text"
              value={matcapName}
              onChange={(e) => setMatcapName(e.target.value)}
              placeholder="e.g. Velvet Gloss Blue"
              className="w-full glass-input rounded-xl px-3 py-1.5 text-xs text-slate-100 bg-[#090d16] border border-white/15"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
              Select Texture File (.png, .jpg, .webp)
            </label>
            <label className="border-2 border-dashed border-sky-500/40 hover:border-sky-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-sky-500/5 hover:bg-sky-500/10">
              <ImageIcon className="w-8 h-8 text-sky-400 mb-2" />
              <span className="text-xs font-bold text-slate-200">Click to Browse PNG MatCap</span>
              <span className="text-[10px] text-slate-400">512x512 or 1024x1024 Sphere Maps recommended</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {previewUrl && (
            <div className="flex items-center gap-3 p-3 rounded-2xl glass-panel border border-white/15">
              <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-full border border-sky-400 object-cover" />
              <div>
                <span className="text-xs font-bold text-sky-300 block">{matcapName || 'Preview MatCap'}</span>
                <span className="text-[10px] text-emerald-400">Ready to load into lilToon Shader Engine</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!previewUrl}
            className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg ${previewUrl ? 'bg-sky-500 hover:bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
          >
            Load MatCap
          </button>
        </div>
      </div>
    </div>
  );
};

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({ isOpen, onClose }) => {
  const {
    currentTheme,
    setTheme,
    customBgType,
    customBgValue,
    setCustomBg,
    matcapTarget,
    setMatcapTarget,
    lilRenderMode,
    setLilRenderMode,
    lilBlendMode,
    setLilBlendMode,
    hueShift,
    saturation,
    brightness,
    setToneCorrection,
    rimEnable,
    rimColor,
    setRimEnable,
    glitterEnable,
    setGlitterEnable,

    // Extended Unity lilToon Options
    cullMode,
    zWrite,
    lightMinLimit,
    lightMaxLimit,
    asUnlit,
    smoothness,
    metallic,
    reflectance,
    specularMode,
    rimFresnelPower,
    setLilExtendedParams,
  } = useGraphStore();

  const [activeTab, setActiveTab] = useState<'themes' | 'liltoon'>('liltoon');
  const [isImporterOpen, setIsImporterOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="glass-panel rounded-3xl w-full max-w-3xl border border-white/15 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  Appearance & lilToon Inspector Options
                </h2>
                <p className="text-xs text-slate-400">
                  Configure Theme Schemes, MatCap Surfaces & Authentic Unity lilToon (v2.3.4) Shader Engine
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 py-2 border-b border-white/10 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('liltoon')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'liltoon'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              lilToon Inspector Engine (v2.3.4)
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'themes'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <Palette className="w-4 h-4" />
              Theme Schemes & Grid
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {activeTab === 'liltoon' ? (
              <div className="space-y-6">
                {/* 1. Base Setting & Rendering Modes */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 bg-slate-900/40">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-extrabold uppercase text-sky-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-sky-400" /> Base Setting & Rendering Mode
                    </span>
                    <span className="glass-pill px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-400/40">
                      Hidden/lilToon
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                        Rendering Mode
                      </span>
                      <select
                        value={lilRenderMode}
                        onChange={(e) => setLilRenderMode(e.target.value as LilToonRenderMode)}
                        className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs text-emerald-300 bg-[#090d16] font-bold border border-emerald-500/40"
                      >
                        <option value="opaque">Opaque (Standard lilToon)</option>
                        <option value="transparent">Transparent / Glass Mode</option>
                        <option value="refraction">Refraction (Glass IOR Distort)</option>
                        <option value="gem">Gem / Crystal (Facet Speculars)</option>
                        <option value="glitter">Glitter / Sparkle Pass</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                        Cull Mode
                      </span>
                      <select
                        value={cullMode}
                        onChange={(e) => setLilExtendedParams({ cullMode: e.target.value as any })}
                        className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs text-sky-300 bg-[#090d16] font-bold border border-sky-500/40"
                      >
                        <option value="off">Off (Double-sided)</option>
                        <option value="back">Back (Standard 3D Culling)</option>
                        <option value="front">Front (Inverted)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                        ZWrite Depth Buffer
                      </span>
                      <button
                        onClick={() => setLilExtendedParams({ zWrite: !zWrite })}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${zWrite ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400' : 'glass-pill text-slate-400'
                          }`}
                      >
                        ZWrite: {zWrite ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Lighting & Brightness Limits */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 bg-slate-900/40">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-extrabold uppercase text-amber-300 flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-400" /> Lighting & Brightness Limits
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase">Lower Brightness Limit</span>
                        <span className="text-amber-300">{lightMinLimit.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.01"
                        value={lightMinLimit}
                        onChange={(e) => setLilExtendedParams({ lightMinLimit: parseFloat(e.target.value) })}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase">Upper Brightness Limit</span>
                        <span className="text-amber-300">{lightMaxLimit.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={lightMaxLimit}
                        onChange={(e) => setLilExtendedParams({ lightMaxLimit: parseFloat(e.target.value) })}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase">As Unlit Factor</span>
                        <span className="text-amber-300">{asUnlit.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={asUnlit}
                        onChange={(e) => setLilExtendedParams({ asUnlit: parseFloat(e.target.value) })}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Reflections, Specular & Gloss */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 bg-slate-900/40">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-extrabold uppercase text-purple-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-purple-400" /> Reflections, Specular & Metallic Gloss
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase">Smoothness</span>
                        <span className="text-purple-300">{smoothness.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={smoothness}
                        onChange={(e) => setLilExtendedParams({ smoothness: parseFloat(e.target.value) })}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase">Metallic</span>
                        <span className="text-purple-300">{metallic.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={metallic}
                        onChange={(e) => setLilExtendedParams({ metallic: parseFloat(e.target.value) })}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase">Reflectance F0</span>
                        <span className="text-purple-300">{reflectance.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.02"
                        value={reflectance}
                        onChange={(e) => setLilExtendedParams({ reflectance: parseFloat(e.target.value) })}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                        Specular Mode
                      </span>
                      <select
                        value={specularMode}
                        onChange={(e) => setLilExtendedParams({ specularMode: e.target.value as any })}
                        className="w-full glass-input rounded-xl px-2 py-1.5 text-xs text-purple-300 bg-[#090d16] font-bold border border-purple-500/40"
                      >
                        <option value="realistic">Realistic Specular</option>
                        <option value="toon">Stylized Toon Highlight</option>
                        <option value="off">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. MatCap & MatCap 2nd Layer Options */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 bg-slate-900/40">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-extrabold uppercase text-sky-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-sky-400" /> MatCap Engine (1st & 2nd Layer)
                    </span>
                    <button
                      onClick={() => setIsImporterOpen(true)}
                      className="glass-pill px-3 py-1 text-xs font-bold text-sky-300 border border-sky-400/40 hover:bg-sky-500/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Import PNG MatCap
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                        MatCap Blend Mode
                      </span>
                      <select
                        value={lilBlendMode}
                        onChange={(e) => setLilBlendMode(parseInt(e.target.value) as any)}
                        className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs text-sky-300 bg-[#090d16] font-bold border border-sky-500/40"
                      >
                        <option value={2}>Screen Mode (lilToon Signature)</option>
                        <option value={0}>Normal Mode (Raw Texture)</option>
                        <option value={1}>Add Mode (Neon Pulse)</option>
                        <option value={3}>Multiply Mode (Dark Glass)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                        MatCap Application Target
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setMatcapTarget('nodes')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${matcapTarget === 'nodes' ? 'bg-sky-500 text-slate-950 border-sky-400' : 'glass-pill text-slate-300'
                            }`}
                        >
                          Nodes
                        </button>
                        <button
                          onClick={() => setMatcapTarget('canvas')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${matcapTarget === 'canvas' ? 'bg-sky-500 text-slate-950 border-sky-400' : 'glass-pill text-slate-300'
                            }`}
                        >
                          Canvas
                        </button>
                        <button
                          onClick={() => setMatcapTarget('both')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${matcapTarget === 'both' ? 'bg-sky-500 text-slate-950 border-sky-400' : 'glass-pill text-slate-300'
                            }`}
                        >
                          Both
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tone Correction Sliders */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                      HSVG Tone Correction (lilToneCorrection)
                    </span>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1 font-mono">
                          <span className="text-slate-400 text-[10px]">Hue Shift</span>
                          <span className="text-sky-400">{(hueShift * 360).toFixed(0)}°</span>
                        </div>
                        <input
                          type="range"
                          min="-0.5"
                          max="0.5"
                          step="0.01"
                          value={hueShift}
                          onChange={(e) => setToneCorrection(parseFloat(e.target.value), saturation, brightness)}
                          className="w-full accent-sky-400 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1 font-mono">
                          <span className="text-slate-400 text-[10px]">Saturation</span>
                          <span className="text-sky-400">{saturation.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.05"
                          value={saturation}
                          onChange={(e) => setToneCorrection(hueShift, parseFloat(e.target.value), brightness)}
                          className="w-full accent-sky-400 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1 font-mono">
                          <span className="text-slate-400 text-[10px]">Brightness</span>
                          <span className="text-sky-400">{brightness.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="2"
                          step="0.05"
                          value={brightness}
                          onChange={(e) => setToneCorrection(hueShift, saturation, parseFloat(e.target.value))}
                          className="w-full accent-sky-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Rim Light & Glitter Toggles */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 bg-slate-900/40">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-extrabold uppercase text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Pipeline Module Passes (Rim Light & Glitter)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRimEnable(!rimEnable)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-2 ${rimEnable ? 'bg-sky-500/30 text-sky-300 border-sky-400 shadow-lg' : 'glass-pill text-slate-400'
                        }`}
                    >
                      <Eye className="w-4 h-4" /> Fresnel Rim Light: {rimEnable ? 'ENABLED' : 'DISABLED'}
                    </button>

                    <button
                      onClick={() => setGlitterEnable(!glitterEnable)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-2 ${glitterEnable ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-lg' : 'glass-pill text-slate-400'
                        }`}
                    >
                      <Sparkles className="w-4 h-4" /> Glitter Sparkles: {glitterEnable ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Themes Tab */
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Preset Theme Schemes
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Deep Navy & Cyan Glow', color: '#38bdf8' },
                      { id: 'oled', name: 'OLED Pure Black', desc: 'Pitch Black & Emerald Accent', color: '#34d399' },
                      { id: 'amethyst', name: 'Royal Amethyst', desc: 'Violet Glass & Magenta Glow', color: '#c084fc' },
                      { id: 'emerald', name: 'Dark Emerald', desc: 'Emerald Forest Glass', color: '#10b981' },
                      { id: 'frost', name: 'Frost White', desc: 'Light Glass Mode', color: '#2563eb' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id as ThemeScheme)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-24 ${currentTheme === theme.id
                            ? 'bg-sky-500/10 border-sky-400 shadow-lg ring-1 ring-sky-400/50'
                            : 'glass-panel border-white/10 hover:border-white/20'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{theme.name}</span>
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }} />
                        </div>
                        <span className="text-[10px] text-slate-400">{theme.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              Ported lilToon Engine: jp.lilxyzw.liltoon-2.3.4
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all cursor-pointer shadow-lg"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>

      <CustomMatcapImporterModal isOpen={isImporterOpen} onClose={() => setIsImporterOpen(false)} />
    </>
  );
};
