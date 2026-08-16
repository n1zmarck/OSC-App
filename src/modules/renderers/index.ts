import { DynamicModuleNode } from './DynamicModuleNode';
import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';
import { MathNode } from './MathNode';
import { LogicNode } from './LogicNode';
import { ExpressionNode } from './ExpressionNode';
import { MacroNode } from './MacroNode';

export { BaseNodeContainer } from './BaseNodeContainer';
export { InputNode, OutputNode, MathNode, LogicNode, ExpressionNode, MacroNode, DynamicModuleNode };

export const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  mathNode: MathNode,
  logicNode: LogicNode,
  expressionNode: ExpressionNode,
  macroNode: MacroNode,
  dynamicNode: DynamicModuleNode,
  universalNode: DynamicModuleNode,
};
