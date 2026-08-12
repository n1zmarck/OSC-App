import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  type NodeTypes,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphStore } from '../stores/useGraphStore';
import { InputNode } from './Nodes/InputNode';
import { MathNode } from './Nodes/MathNode';
import { ExpressionNode } from './Nodes/ExpressionNode';
import { MacroNode } from './Nodes/MacroNode';
import { OutputNode } from './Nodes/OutputNode';
import { LogicNode } from './Nodes/LogicNode';

export const Canvas: React.FC = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    setSelectedNodeId,
    backgroundStyle,
    customBgType,
    customBgValue,
    matcapTarget
  } = useGraphStore();

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      inputNode: InputNode,
      oscInNode: InputNode,
      mathNode: MathNode,
      expressionNode: ExpressionNode,
      macroNode: MacroNode,
      outputNode: OutputNode,
      oscOutNode: OutputNode,
      logicNode: LogicNode,
    }),
    []
  );

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const handlePaneClick = () => {
    setSelectedNodeId(null);
  };

  // Canvas background rendering logic
  const customCanvasStyle: React.CSSProperties = useMemo(() => {
    // Only apply wallpaper to canvas if matcapTarget is 'canvas' or 'both', or type is 'color' / 'image'
    if (matcapTarget === 'canvas' || matcapTarget === 'both') {
      if (customBgType === 'color') {
        return { backgroundColor: customBgValue };
      }
      if (customBgType === 'matcap') {
        return { background: customBgValue };
      }
      if (customBgType === 'image' && customBgValue) {
        return {
          backgroundImage: `url("${customBgValue}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      }
    }
    return {};
  }, [customBgType, customBgValue, matcapTarget]);

  return (
    <div
      className="flex-1 h-[calc(100vh-6rem)] relative overflow-hidden rounded-3xl mx-4 my-3 glass-panel border border-white/15 shadow-2xl transition-all duration-300"
      style={customCanvasStyle}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="w-full h-full"
      >
        {(backgroundStyle === 'dots' && (matcapTarget === 'nodes' || customBgType === 'preset')) && (
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="rgba(255, 255, 255, 0.15)"
          />
        )}
        {(backgroundStyle === 'grid' && (matcapTarget === 'nodes' || customBgType === 'preset')) && (
          <Background
            variant={BackgroundVariant.Lines}
            gap={32}
            color="rgba(255, 255, 255, 0.08)"
          />
        )}
        {(backgroundStyle === 'nebula' && (matcapTarget === 'nodes' || customBgType === 'preset')) && (
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-purple-500/10 to-emerald-500/10 pointer-events-none" />
        )}
        
        <Controls position="bottom-right" className="m-4" />
        <MiniMap
          position="bottom-left"
          className="m-4"
          nodeColor="#38bdf8"
          maskColor="rgba(9, 13, 22, 0.85)"
        />
      </ReactFlow>
    </div>
  );
};
