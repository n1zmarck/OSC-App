/**
 * Utility functions for node theme styling, telemetry formatting, and Level of Detail (LOD) calculations.
 * Adheres strictly to DRY principles across all node modules.
 */

export type NodeColorVariant = 'indigo' | 'sky' | 'purple' | 'emerald' | 'amber' | 'fuchsia';

export interface VariantStyleConfig {
  resizerBorder: string;
  resizerHandleBg: string;
  iconBg: string;
  iconText: string;
  iconBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentText: string;
  accentBorder: string;
  gripText: string;
}

export const VARIANT_STYLES: Record<NodeColorVariant, VariantStyleConfig> = {
  indigo: {
    resizerBorder: '!border-indigo-400/80 !border-2',
    resizerHandleBg: '!bg-indigo-500 !border-2 !border-white',
    iconBg: 'bg-indigo-500/30',
    iconText: 'text-indigo-300',
    iconBorder: 'border-indigo-400/40',
    badgeBg: 'bg-indigo-950/40',
    badgeText: 'text-indigo-200',
    badgeBorder: 'border-indigo-400/40',
    accentText: 'text-indigo-300',
    accentBorder: 'border-indigo-400/40',
    gripText: 'text-indigo-300',
  },
  sky: {
    resizerBorder: '!border-sky-400/80 !border-2',
    resizerHandleBg: '!bg-sky-400 !border-2 !border-slate-900',
    iconBg: 'bg-sky-500/30',
    iconText: 'text-sky-300',
    iconBorder: 'border-sky-400/40',
    badgeBg: 'bg-sky-950/40',
    badgeText: 'text-sky-200',
    badgeBorder: 'border-sky-400/40',
    accentText: 'text-sky-300',
    accentBorder: 'border-sky-400/40',
    gripText: 'text-sky-300',
  },
  purple: {
    resizerBorder: '!border-purple-400/80 !border-2',
    resizerHandleBg: '!bg-purple-500 !border-2 !border-slate-900',
    iconBg: 'bg-purple-500/30',
    iconText: 'text-purple-300',
    iconBorder: 'border-purple-400/40',
    badgeBg: 'bg-purple-950/40',
    badgeText: 'text-purple-200',
    badgeBorder: 'border-purple-400/40',
    accentText: 'text-purple-300',
    accentBorder: 'border-purple-400/40',
    gripText: 'text-purple-300',
  },
  emerald: {
    resizerBorder: '!border-emerald-400/80 !border-2',
    resizerHandleBg: '!bg-emerald-500 !border-2 !border-slate-900',
    iconBg: 'bg-emerald-500/30',
    iconText: 'text-emerald-300',
    iconBorder: 'border-emerald-400/40',
    badgeBg: 'bg-emerald-950/40',
    badgeText: 'text-emerald-200',
    badgeBorder: 'border-emerald-400/40',
    accentText: 'text-emerald-300',
    accentBorder: 'border-emerald-400/40',
    gripText: 'text-emerald-300',
  },
  amber: {
    resizerBorder: '!border-amber-400/80 !border-2',
    resizerHandleBg: '!bg-amber-500 !border-2 !border-slate-900',
    iconBg: 'bg-amber-500/30',
    iconText: 'text-amber-300',
    iconBorder: 'border-amber-400/40',
    badgeBg: 'bg-amber-950/40',
    badgeText: 'text-amber-200',
    badgeBorder: 'border-amber-400/40',
    accentText: 'text-amber-300',
    accentBorder: 'border-amber-400/40',
    gripText: 'text-amber-300',
  },
  fuchsia: {
    resizerBorder: '!border-fuchsia-400/80 !border-2',
    resizerHandleBg: '!bg-fuchsia-500 !border-2 !border-slate-900',
    iconBg: 'bg-fuchsia-500/30',
    iconText: 'text-fuchsia-300',
    iconBorder: 'border-fuchsia-400/40',
    badgeBg: 'bg-fuchsia-950/40',
    badgeText: 'text-fuchsia-200',
    badgeBorder: 'border-fuchsia-400/40',
    accentText: 'text-fuchsia-300',
    accentBorder: 'border-fuchsia-400/40',
    gripText: 'text-fuchsia-300',
  },
};

/**
 * Determines whether a node should render in compact title-only mode based on height or collapse toggle.
 */
export function isCompactNode(height?: number, manualCollapsed?: boolean, thresholdHeight: number = 110): boolean {
  if (manualCollapsed) return true;
  return height !== undefined && height < thresholdHeight;
}

/**
 * Format live telemetry numbers with consistent precision.
 */
export function formatTelemetryValue(val: any, precision: number = 2): string {
  if (typeof val === 'number') {
    return val.toFixed(precision);
  }
  return String(val ?? 0);
}
