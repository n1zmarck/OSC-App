import React from 'react';
import { Play, Pause, Radio, Cpu, Plus, Sparkles, FolderOpen, Palette } from 'lucide-react';
import { useGraphStore } from '../stores/useGraphStore';
import { GlassButton } from './Common/GlassButton';

interface HeaderBarProps {
  onOpenLibrary: () => void;
  onCreateMacroModal: () => void;
  onOpenImportModal: () => void;
  onOpenAppearance: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenLibrary,
  onCreateMacroModal,
  onOpenImportModal,
  onOpenAppearance,
}) => {
  const {
    isRunning,
    setIsRunning,
    rxPort,
    txPort,
    packetsReceived,
    packetsSent,
    currentAvatarName,
    activePresetName,
  } = useGraphStore();

  return (
    <header className="glass-panel sticky top-0 z-40 mx-4 mt-3 rounded-3xl px-5 py-3 flex items-center justify-between shadow-2xl backdrop-blur-3xl">
      {/* Brand & App Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/25">
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base text-white tracking-tight">VRC-Flow</h1>
            <span className="glass-pill px-2 py-0.5 text-xs font-extrabold text-sky-300 border border-sky-400/40 bg-sky-950/40">
              v1.0 • Astro + Tauri
            </span>
          </div>
          <p className="text-xs text-slate-300 font-semibold">Node-Based OSC Router Engine</p>
        </div>
      </div>

      {/* Preset & Avatar Indicator */}
      <div className="hidden md:flex items-center gap-3 bg-[#090d16] rounded-2xl p-1.5 border border-white/15">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10">
          <Cpu className="w-4 h-4 text-sky-400" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block leading-tight font-semibold">VRChat Avatar</span>
            <span className="text-xs font-extrabold text-white">{currentAvatarName}</span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-white/15" />

        <div className="flex items-center gap-2 px-3 py-1">
          <FolderOpen className="w-4 h-4 text-purple-400" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block leading-tight font-semibold">Active Preset</span>
            <span className="text-xs font-extrabold text-purple-300">{activePresetName}</span>
          </div>
        </div>
      </div>

      {/* Control Actions (Refactored using GlassButton) */}
      <div className="flex items-center gap-3">
        {/* Appearance Trigger */}
        <button
          onClick={onOpenAppearance}
          className="glass-pill p-2.5 text-slate-200 hover:text-sky-300 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 border-white/15"
          title="Themes & Appearance"
        >
          <Palette className="w-4 h-4 text-sky-400" />
        </button>

        {/* Module Library Drawer Trigger */}
        <GlassButton
          variant="secondary"
          colorRole="sky"
          icon={Plus}
          onClick={onOpenLibrary}
        >
          Add Node / Module
        </GlassButton>

        {/* Create Custom Module Trigger */}
        <GlassButton
          variant="pill"
          colorRole="purple"
          icon={Sparkles}
          onClick={onCreateMacroModal}
        >
          Create Custom Module
        </GlassButton>

        {/* Import .vrcm Module Package Trigger */}
        <GlassButton
          variant="secondary"
          colorRole="sky"
          icon={FolderOpen}
          onClick={onOpenImportModal}
        >
          Import Module
        </GlassButton>

        {/* Engine Live Status Toggle */}
        <GlassButton
          variant={isRunning ? 'accent' : 'danger'}
          icon={isRunning ? Pause : Play}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Router Running' : 'Start Router'}
        </GlassButton>

        {/* Live Packet Telemetry Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-2xl border border-white/15 font-mono text-xs font-bold">
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>RX:{rxPort} ({packetsReceived})</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span>TX:{txPort} ({packetsSent})</span>
          </div>
        </div>
      </div>
    </header>
  );
};
