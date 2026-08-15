import React, { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { ChevronDown, ChevronUp, MoveDiagonal } from 'lucide-react';
import { useGraphStore } from '../../stores/useGraphStore';
import { type NodeColorVariant, VARIANT_STYLES, isCompactNode } from '../../utils/nodeUtils';
import { MatcapShaderSurface } from '../../components/Common/MatcapShaderSurface';

export interface HandleConfig {
  id: string;
  position: Position;
  type?: 'target' | 'source';
  style?: React.CSSProperties;
  className?: string;
}

export interface BaseNodeContainerProps {
  id: string;
  data: Record<string, any>;
  selected?: boolean;
  height?: number;
  variant?: NodeColorVariant;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  badgeText?: string;
  minWidth?: number;
  minHeight?: number;
  handles?: HandleConfig[];
  children?: React.ReactNode;
}

export const BaseNodeContainer = memo(({
  id,
  data,
  selected = false,
  height,
  variant = 'sky',
  icon: Icon,
  title,
  subtitle,
  badgeText,
  minWidth = 280,
  minHeight = 170,
  handles = [],
  children,
}: BaseNodeContainerProps) => {
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const customBgType = useGraphStore((s) => s.customBgType);
  const customBgValue = useGraphStore((s) => s.customBgValue);
  const matcapTarget = useGraphStore((s) => s.matcapTarget);

  // lilToon Shader Pipeline State
  const lilRenderMode = useGraphStore((s) => s.lilRenderMode);
  const lilBlendMode = useGraphStore((s) => s.lilBlendMode);
  const hueShift = useGraphStore((s) => s.hueShift);
  const saturation = useGraphStore((s) => s.saturation);
  const brightness = useGraphStore((s) => s.brightness);
  const rimEnable = useGraphStore((s) => s.rimEnable);
  const rimColor = useGraphStore((s) => s.rimColor);
  const glitterEnable = useGraphStore((s) => s.glitterEnable);

  // Extended Unity lilToon Inspector State
  const smoothness = useGraphStore((s) => s.smoothness);
  const metallic = useGraphStore((s) => s.metallic);
  const reflectance = useGraphStore((s) => s.reflectance);
  const lightMinLimit = useGraphStore((s) => s.lightMinLimit);
  const lightMaxLimit = useGraphStore((s) => s.lightMaxLimit);
  const asUnlit = useGraphStore((s) => s.asUnlit);
  const rimFresnelPower = useGraphStore((s) => s.rimFresnelPower);

  const [isManualCollapsed, setIsManualCollapsed] = useState(!!data.collapsed);

  const styleConfig = VARIANT_STYLES[variant] || VARIANT_STYLES.sky;
  const isCompactMode = isCompactNode(height, isManualCollapsed, 110);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isManualCollapsed;
    setIsManualCollapsed(nextState);
    updateNodeData(id, { collapsed: nextState });
  };

  // Per-node custom color overrides (from node inspector)
  const customBgColor = data.customBgColor as string | undefined;
  const customBorderColor = data.customBorderColor as string | undefined;
  const customTextColor = data.customTextColor as string | undefined;

  // Check if WebGL GLSL Shader Surface should render for nodes
  const isMatcapShaderActive = (matcapTarget === 'nodes' || matcapTarget === 'both') && customBgValue && customBgType !== 'preset';

  const combinedNodeInlineStyle: React.CSSProperties = {
    minWidth,
    minHeight: isCompactMode ? 65 : minHeight,
    ...(isMatcapShaderActive ? {
      backgroundColor: lilRenderMode === 'transparent' ? 'rgba(15, 23, 42, 0.15)' : lilRenderMode === 'refraction' ? 'rgba(15, 23, 42, 0.35)' : 'rgba(15, 23, 42, 0.65)',
    } : {}),
    ...(customBgColor ? { backgroundColor: customBgColor, backgroundImage: 'none' } : {}),
    ...(customBorderColor ? { borderColor: customBorderColor } : {}),
  };

  return (
    <div
      className={`glass-node rounded-3xl p-4 w-full h-full relative transition-all shadow-2xl flex flex-col justify-between overflow-visible ${
        selected ? 'glass-node-selected' : ''
      }`}
      style={combinedNodeInlineStyle}
    >
      {/* Real WebGL GLSL 3D lilToon Shader Surface */}
      {isMatcapShaderActive && (
        <MatcapShaderSurface
          matcapUrl={customBgValue}
          cornerRadius={24}
          bezelWidth={40}
          renderMode={lilRenderMode}
          blendMode={lilBlendMode}
          hueShift={hueShift}
          saturation={saturation}
          brightness={brightness}
          rimEnable={rimEnable}
          rimColor={rimColor}
          glitterEnable={glitterEnable}
          smoothness={smoothness}
          metallic={metallic}
          reflectance={reflectance}
          lightMinLimit={lightMinLimit}
          lightMaxLimit={lightMaxLimit}
          asUnlit={asUnlit}
          rimFresnelPower={rimFresnelPower}
        />
      )}

      {/* Generous 28px Corner Resizer Handle */}
      <NodeResizer
        minWidth={minWidth}
        minHeight={65}
        isVisible={selected}
        lineClassName={styleConfig.resizerBorder}
        handleClassName={`${styleConfig.resizerHandleBg} !w-7 !h-7 !rounded-xl hover:!scale-125 transition-transform cursor-se-resize shadow-xl !-right-3 !-bottom-3 flex items-center justify-center z-20`}
      />

      {/* Visual Corner Grip Indicator */}
      {selected && (
        <div className={`absolute right-1.5 bottom-1.5 pointer-events-none ${styleConfig.gripText} z-30 opacity-90`}>
          <MoveDiagonal className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Socket Handles */}
      {handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type || (h.position === Position.Left ? 'target' : 'source')}
          position={h.position}
          style={h.style}
          isConnectable={true}
          className={`z-50 ${h.className || (h.position === Position.Left ? 'handle-float !-left-2.5' : 'handle-float !-right-2.5')}`}
        />
      ))}

      {/* Node Header Skeleton */}
      <div className={`flex items-center justify-between relative z-10 ${isCompactMode ? '' : 'border-b border-white/15 pb-3 mb-3'}`}>
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl ${styleConfig.iconBg} ${styleConfig.iconText} border ${styleConfig.iconBorder} shadow-sm backdrop-blur-md bg-black/40`}
            style={customBorderColor ? { borderColor: customBorderColor } : {}}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3
              className="font-extrabold text-sm text-white tracking-tight leading-tight drop-shadow-md"
              style={customTextColor ? { color: customTextColor } : {}}
            >
              {title}
            </h3>
            {subtitle && (
              <span className={`text-[11px] font-semibold capitalize flex items-center gap-1 ${styleConfig.accentText}`}>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-xl hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer bg-black/30 backdrop-blur-md"
            title={isCompactMode ? 'Expand Details' : 'Collapse to Title'}
          >
            {isCompactMode ? (
              <ChevronDown className={`w-4 h-4 ${styleConfig.accentText}`} />
            ) : (
              <ChevronUp className={`w-4 h-4 ${styleConfig.accentText}`} />
            )}
          </button>
          {badgeText && (
            <span
              className={`glass-pill px-2.5 py-1 text-xs font-bold ${styleConfig.badgeText} border ${styleConfig.badgeBorder} ${styleConfig.badgeBg} backdrop-blur-md`}
              style={customBorderColor ? { borderColor: customBorderColor } : {}}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {/* Node Body Slot (Hidden in Compact Mode) */}
      {!isCompactMode && (
        <div className="space-y-3.5 flex-1 overflow-hidden relative z-10">
          {children}
        </div>
      )}
    </div>
  );
});

BaseNodeContainer.displayName = 'BaseNodeContainer';
