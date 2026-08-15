import React, { useState } from 'react';
import { HeaderBar } from './HeaderBar';
import { Canvas } from './Canvas';
import { InspectorPanel } from './InspectorPanel';
import { ModuleLibraryDrawer } from './ModuleLibraryDrawer';
import { CustomModuleModal } from './CustomModuleModal';
import { ImportModuleModal } from './ImportModuleModal';
import { AppearanceModal } from './AppearanceModal';
import { useGraphStore } from '../stores/useGraphStore';

export const App: React.FC = () => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isMacroModalOpen, setIsMacroModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  const currentTheme = useGraphStore((s) => s.currentTheme);
  const customThemeColors = useGraphStore((s) => s.customThemeColors);

  // Dynamic inline styles for custom theme palette
  const customThemeStyle: React.CSSProperties = currentTheme === 'custom' ? ({
    '--bg-primary': customThemeColors.primary,
    '--bg-surface': customThemeColors.panel,
    '--bg-node': customThemeColors.primary,
    '--bg-input': customThemeColors.primary,
    '--border-glass': customThemeColors.accent,
    '--border-node': customThemeColors.accent,
    '--accent-glow': customThemeColors.accent,
  } as React.CSSProperties) : {};

  return (
    <div
      data-theme={currentTheme}
      style={customThemeStyle}
      className={`theme-${currentTheme} flex flex-col h-screen w-screen bg-[var(--bg-primary)] text-[var(--text-main)] overflow-hidden relative selection:bg-sky-500/30 transition-colors duration-300`}
    >
      {/* Dynamic Background Ambient Light Refractions */}
      {currentTheme === 'cyberpunk' && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />
        </>
      )}
      {currentTheme === 'amethyst' && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-fuchsia-950/20 to-black pointer-events-none" />
      )}
      {currentTheme === 'emerald' && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-teal-950/20 to-black pointer-events-none" />
      )}
      {currentTheme === 'oled' && (
        <div className="absolute inset-0 bg-black pointer-events-none" />
      )}
      {currentTheme === 'frost' && (
        <div className="absolute inset-0 bg-slate-200/50 pointer-events-none" />
      )}

      {/* Header Bar */}
      <HeaderBar
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onCreateMacroModal={() => setIsMacroModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenAppearance={() => setIsAppearanceOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex flex-1 overflow-hidden relative z-10">
        <Canvas />
        <InspectorPanel />
      </main>

      {/* Slide-over Node & Module Library Drawer */}
      <ModuleLibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

      {/* Modal to Create Custom Macro Sub-Graph Module */}
      <CustomModuleModal
        isOpen={isMacroModalOpen}
        onClose={() => setIsMacroModalOpen(false)}
      />

      {/* Modal to Import VRCm Module Packages */}
      <ImportModuleModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Modal for Theme & Appearance Settings */}
      <AppearanceModal
        isOpen={isAppearanceOpen}
        onClose={() => setIsAppearanceOpen(false)}
      />
    </div>
  );
};
