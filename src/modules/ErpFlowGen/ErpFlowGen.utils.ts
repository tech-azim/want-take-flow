import type { FlowNode, Position, SchemaExportData } from './ErpFlowGen.type';
import { NODE_DIMENSIONS } from './ErpFlowGen.config';

/**
 * Generate a unique identifier with a given prefix
 * @param {string} prefix - identifier prefix
 * @returns {string} - unique generated id
 */
export const _generateUniqueId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 7);

  return `${prefix}_${timestamp}_${randomSuffix}`;
};

/**
 * Find node by unique identifier
 * @param {FlowNode[]} nodes - list of flow nodes
 * @param {string} id - target node identifier
 * @returns {FlowNode | null} - matched node or null
 */
export const _findNodeById = (nodes: FlowNode[], id: string): FlowNode | null => {
  const matchedNode = nodes.find((node: FlowNode) => node.id === id);

  if (matchedNode) {
    return matchedNode;
  }

  return null;
};

/**
 * Get dimensions for a node based on its type and custom size
 * @param {FlowNode | string} nodeOrType - node or node type string
 * @returns {{ width: number; height: number }} - dimension box
 */
export const _getNodeDimensions = (nodeOrType: FlowNode | string): { width: number; height: number } => {
  if (typeof nodeOrType === 'object') {
    const defaultDims = NODE_DIMENSIONS[nodeOrType.type] ?? { width: 220, height: 96 };
    return {
      width: nodeOrType.width ?? defaultDims.width,
      height: nodeOrType.height ?? defaultDims.height,
    };
  }
  return NODE_DIMENSIONS[nodeOrType] ?? { width: 220, height: 96 };
};

/**
 * Calculate the bounding box center coordinates of a node
 * @param {FlowNode} node - target flow node
 * @returns {Position} - center position {x, y}
 */
export const _calculateNodeCenter = (node: FlowNode): Position => {
  const dims = _getNodeDimensions(node);

  return {
    x: node.position.x + dims.width / 2,
    y: node.position.y + dims.height / 2,
  };
};

export type EdgeGeometry = {
  pathD: string;
  midX: number;
  midY: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  sourceSide?: AnchorSide;
  targetSide?: AnchorSide;
};

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';

/**
 * Intelligently connects anchors (Horizontal or Vertical) to completely prevent hairpin loops
 * and guarantee perpendicular collinear entry into arrowheads without diagonal clipping
 * @param {FlowNode} sourceNode - origin flow node
 * @param {FlowNode} targetNode - destination flow node
 * @returns {EdgeGeometry} - SVG path string and midpoint
 */
export const _calculateEdgePath = (
  sourceNode: FlowNode,
  targetNode: FlowNode,
  style: 'curved' | 'orthogonal' | 'straight' = 'curved',
  waypointOffset?: { x: number; y: number },
  sourceAnchor?: 'auto' | 'top' | 'bottom' | 'left' | 'right',
  targetAnchor?: 'auto' | 'top' | 'bottom' | 'left' | 'right',
): EdgeGeometry => {
  const sourceDims = _getNodeDimensions(sourceNode);
  const targetDims = _getNodeDimensions(targetNode);

  const sourceCenter = _calculateNodeCenter(sourceNode);
  const targetCenter = _calculateNodeCenter(targetNode);

  const deltaX = targetCenter.x - sourceCenter.x;

  const sourceBottom = sourceNode.position.y + sourceDims.height;
  const sourceTop = sourceNode.position.y;
  const sourceRight = sourceNode.position.x + sourceDims.width;
  const sourceLeft = sourceNode.position.x;

  const targetBottom = targetNode.position.y + targetDims.height;
  const targetTop = targetNode.position.y;
  const targetRight = targetNode.position.x + targetDims.width;
  const targetLeft = targetNode.position.x;

  // Determine optimal source and target anchor sides based on geometric layout
  let sourceSide: AnchorSide;
  let targetSide: AnchorSide;

  // Clear vertical separation checks
  const isTargetBelow = targetTop >= sourceBottom - 15;
  const isTargetAbove = targetBottom <= sourceTop + 15;
  // Clear horizontal separation checks
  const isTargetRight = targetLeft >= sourceRight - 20;
  const isTargetLeft = targetRight <= sourceLeft + 20;

  if (isTargetBelow) {
    if (Math.abs(deltaX) < 40) {
      // Direct downward column
      sourceSide = 'bottom';
      targetSide = 'top';
    } else if (isTargetRight) {
      // Below and to the right
      if (deltaX > (targetTop - sourceBottom) * 1.5) {
        sourceSide = 'right';
        targetSide = 'top';
      } else {
        sourceSide = 'bottom';
        targetSide = 'top';
      }
    } else if (isTargetLeft) {
      // Below and to the left
      if (-deltaX > (targetTop - sourceBottom) * 1.5) {
        sourceSide = 'left';
        targetSide = 'top';
      } else {
        sourceSide = 'bottom';
        targetSide = 'top';
      }
    } else {
      sourceSide = 'bottom';
      targetSide = 'top';
    }
  } else if (isTargetAbove) {
    if (Math.abs(deltaX) < 40) {
      // Direct upward column (loopback)
      sourceSide = 'top';
      targetSide = 'bottom';
    } else if (isTargetRight) {
      if (deltaX > 60) {
        sourceSide = 'top';
        targetSide = 'left';
      } else {
        sourceSide = 'right';
        targetSide = 'bottom';
      }
    } else if (isTargetLeft) {
      if (-deltaX > 60) {
        sourceSide = 'top';
        targetSide = 'right';
      } else {
        sourceSide = 'left';
        targetSide = 'bottom';
      }
    } else {
      sourceSide = 'top';
      targetSide = 'bottom';
    }
  } else {
    // Horizontally adjacent or overlapping in Y
    if (deltaX >= 0) {
      sourceSide = 'right';
      targetSide = 'left';
    } else {
      sourceSide = 'left';
      targetSide = 'right';
    }
  }

  // Explicit user override for anchor ports (e.g. left, right, top, bottom)
  if (sourceAnchor && sourceAnchor !== 'auto') {
    sourceSide = sourceAnchor;
  }
  if (targetAnchor && targetAnchor !== 'auto') {
    targetSide = targetAnchor;
  }

  // Calculate actual coordinates for selected anchors
  let startX: number;
  let startY: number;

  switch (sourceSide) {
    case 'top':
      startX = sourceCenter.x;
      startY = sourceTop;
      break;
    case 'bottom':
      startX = sourceCenter.x;
      startY = sourceBottom;
      break;
    case 'left':
      startX = sourceLeft;
      startY = sourceCenter.y;
      break;
    case 'right':
    default:
      startX = sourceRight;
      startY = sourceCenter.y;
      break;
  }

  let endX: number;
  let endY: number;

  switch (targetSide) {
    case 'top':
      endX = targetCenter.x;
      endY = targetTop;
      break;
    case 'bottom':
      endX = targetCenter.x;
      endY = targetBottom;
      break;
    case 'left':
      endX = targetLeft;
      endY = targetCenter.y;
      break;
    case 'right':
    default:
      endX = targetRight;
      endY = targetCenter.y;
      break;
  }

  const offX = waypointOffset?.x ?? 0;
  const offY = waypointOffset?.y ?? 0;

  if (style === 'straight') {
    if (offX !== 0 || offY !== 0) {
      const wpX = (startX + endX) / 2 + offX;
      const wpY = (startY + endY) / 2 + offY;
      return {
        pathD: `M ${startX} ${startY} L ${wpX} ${wpY} L ${endX} ${endY}`,
        midX: wpX,
        midY: wpY,
        startX,
        startY,
        endX,
        endY,
      };
    }
    return {
      pathD: `M ${startX} ${startY} L ${endX} ${endY}`,
      midX: (startX + endX) / 2,
      midY: (startY + endY) / 2,
      startX,
      startY,
      endX,
      endY,
      sourceSide,
      targetSide,
    };
  }

  if (style === 'orthogonal') {
    let pathD = '';
    let midX = (startX + endX) / 2;
    let midY = (startY + endY) / 2;

    if (sourceSide === 'bottom' && targetSide === 'top') {
      if (endY > startY + 15) {
        const stepY = startY + (endY - startY) / 2 + offY;
        if (offX !== 0) {
          const wpX = (startX + endX) / 2 + offX;
          pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${wpX} ${stepY} L ${wpX} ${endY - 15} L ${endX} ${endY - 15} L ${endX} ${endY}`;
          midX = wpX;
          midY = stepY;
        } else {
          pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${endX} ${stepY} L ${endX} ${endY}`;
          midX = (startX + endX) / 2;
          midY = stepY;
        }
      } else {
        const downY = startY + 25 + offY;
        const upY = endY - 25;
        const bypassX = (startX >= endX ? Math.min(startX, endX) - 80 : Math.max(startX, endX) + 80) + offX;
        pathD = `M ${startX} ${startY} L ${startX} ${downY} L ${bypassX} ${downY} L ${bypassX} ${upY} L ${endX} ${upY} L ${endX} ${endY}`;
        midX = bypassX;
        midY = (downY + upY) / 2;
      }
    } else if (sourceSide === 'bottom' && targetSide === 'left') {
      const stepY = startY + Math.max(20, (endY - startY) / 2) + offY;
      if (endX > startX + 25 && offX === 0) {
        pathD = `M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`;
        midX = (startX + endX) / 2;
        midY = endY;
      } else {
        const approachX = Math.min(startX - 25, endX - 35) + offX;
        pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${approachX} ${stepY} L ${approachX} ${endY} L ${endX} ${endY}`;
        midX = approachX;
        midY = (stepY + endY) / 2;
      }
    } else if (sourceSide === 'bottom' && targetSide === 'right') {
      const stepY = startY + Math.max(20, (endY - startY) / 2) + offY;
      if (endX < startX - 25 && offX === 0) {
        pathD = `M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`;
        midX = (startX + endX) / 2;
        midY = endY;
      } else {
        const approachX = Math.max(startX + 25, endX + 35) + offX;
        pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${approachX} ${stepY} L ${approachX} ${endY} L ${endX} ${endY}`;
        midX = approachX;
        midY = (stepY + endY) / 2;
      }
    } else if (sourceSide === 'bottom' && targetSide === 'bottom') {
      const dropY = Math.max(startY, endY) + 35 + offY;
      pathD = `M ${startX} ${startY} L ${startX} ${dropY} L ${endX} ${dropY} L ${endX} ${endY}`;
      midX = (startX + endX) / 2 + offX;
      midY = dropY;
    } else if (sourceSide === 'top' && targetSide === 'bottom') {
      if (endY < startY - 15) {
        const stepY = startY + (endY - startY) / 2 + offY;
        if (offX !== 0) {
          const wpX = (startX + endX) / 2 + offX;
          pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${wpX} ${stepY} L ${wpX} ${endY + 15} L ${endX} ${endY + 15} L ${endX} ${endY}`;
          midX = wpX;
          midY = stepY;
        } else {
          pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${endX} ${stepY} L ${endX} ${endY}`;
          midX = (startX + endX) / 2;
          midY = stepY;
        }
      } else {
        const upY = startY - 25 + offY;
        const downY = endY + 25;
        const bypassX = (startX >= endX ? Math.min(startX, endX) - 80 : Math.max(startX, endX) + 80) + offX;
        pathD = `M ${startX} ${startY} L ${startX} ${upY} L ${bypassX} ${upY} L ${bypassX} ${downY} L ${endX} ${downY} L ${endX} ${endY}`;
        midX = bypassX;
        midY = (upY + downY) / 2;
      }
    } else if (sourceSide === 'top' && targetSide === 'top') {
      const liftY = Math.min(startY, endY) - 35 + offY;
      pathD = `M ${startX} ${startY} L ${startX} ${liftY} L ${endX} ${liftY} L ${endX} ${endY}`;
      midX = (startX + endX) / 2 + offX;
      midY = liftY;
    } else if (sourceSide === 'top' && targetSide === 'left') {
      const stepY = startY - 25 + offY;
      const approachX = Math.min(startX - 25, endX - 35) + offX;
      pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${approachX} ${stepY} L ${approachX} ${endY} L ${endX} ${endY}`;
      midX = approachX;
      midY = (stepY + endY) / 2;
    } else if (sourceSide === 'top' && targetSide === 'right') {
      const stepY = startY - 25 + offY;
      const approachX = Math.max(startX + 25, endX + 35) + offX;
      pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${approachX} ${stepY} L ${approachX} ${endY} L ${endX} ${endY}`;
      midX = approachX;
      midY = (stepY + endY) / 2;
    } else if (sourceSide === 'right' && targetSide === 'left') {
      if (endX > startX + 15) {
        const stepX = startX + (endX - startX) / 2 + offX;
        if (offY !== 0) {
          const wpY = (startY + endY) / 2 + offY;
          pathD = `M ${startX} ${startY} L ${stepX} ${startY} L ${stepX} ${wpY} L ${endX - 15} ${wpY} L ${endX - 15} ${endY} L ${endX} ${endY}`;
          midX = stepX;
          midY = wpY;
        } else {
          pathD = `M ${startX} ${startY} L ${stepX} ${startY} L ${stepX} ${endY} L ${endX} ${endY}`;
          midX = stepX;
          midY = (startY + endY) / 2;
        }
      } else {
        const rightX = startX + 35 + offX;
        const leftX = endX - 35;
        const bypassY = Math.min(startY, endY) - 50 + offY;
        pathD = `M ${startX} ${startY} L ${rightX} ${startY} L ${rightX} ${bypassY} L ${leftX} ${bypassY} L ${leftX} ${endY} L ${endX} ${endY}`;
        midX = (rightX + leftX) / 2;
        midY = bypassY;
      }
    } else if (sourceSide === 'right' && targetSide === 'top') {
      const cornerX = endX + offX;
      const cornerY = startY + offY;
      if (offX !== 0 || offY !== 0) {
        pathD = `M ${startX} ${startY} L ${cornerX} ${startY} L ${cornerX} ${cornerY} L ${endX} ${cornerY} L ${endX} ${endY}`;
        midX = cornerX;
        midY = cornerY;
      } else {
        pathD = `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY}`;
        midX = (startX + endX) / 2;
        midY = startY;
      }
    } else if (sourceSide === 'right' && targetSide === 'bottom') {
      const cornerX = endX + offX;
      const cornerY = startY + offY;
      if (offX !== 0 || offY !== 0) {
        pathD = `M ${startX} ${startY} L ${cornerX} ${startY} L ${cornerX} ${cornerY} L ${endX} ${cornerY} L ${endX} ${endY}`;
        midX = cornerX;
        midY = cornerY;
      } else {
        pathD = `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY}`;
        midX = (startX + endX) / 2;
        midY = startY;
      }
    } else if (sourceSide === 'right' && targetSide === 'right') {
      const farX = Math.max(startX, endX) + 35 + offX;
      pathD = `M ${startX} ${startY} L ${farX} ${startY} L ${farX} ${endY} L ${endX} ${endY}`;
      midX = farX;
      midY = (startY + endY) / 2 + offY;
    } else if (sourceSide === 'left' && targetSide === 'right') {
      if (endX < startX - 15) {
        const stepX = startX + (endX - startX) / 2 + offX;
        if (offY !== 0) {
          const wpY = (startY + endY) / 2 + offY;
          pathD = `M ${startX} ${startY} L ${stepX} ${startY} L ${stepX} ${wpY} L ${endX + 15} ${wpY} L ${endX + 15} ${endY} L ${endX} ${endY}`;
          midX = stepX;
          midY = wpY;
        } else {
          pathD = `M ${startX} ${startY} L ${stepX} ${startY} L ${stepX} ${endY} L ${endX} ${endY}`;
          midX = stepX;
          midY = (startY + endY) / 2;
        }
      } else {
        const leftX = startX - 35 + offX;
        const rightX = endX + 35;
        const bypassY = Math.min(startY, endY) - 50 + offY;
        pathD = `M ${startX} ${startY} L ${leftX} ${startY} L ${leftX} ${bypassY} L ${rightX} ${bypassY} L ${rightX} ${endY} L ${endX} ${endY}`;
        midX = (leftX + rightX) / 2;
        midY = bypassY;
      }
    } else if (sourceSide === 'left' && targetSide === 'top') {
      const cornerX = endX + offX;
      const cornerY = startY + offY;
      if (offX !== 0 || offY !== 0) {
        pathD = `M ${startX} ${startY} L ${cornerX} ${startY} L ${cornerX} ${cornerY} L ${endX} ${cornerY} L ${endX} ${endY}`;
        midX = cornerX;
        midY = cornerY;
      } else {
        pathD = `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY}`;
        midX = (startX + endX) / 2;
        midY = startY;
      }
    } else if (sourceSide === 'left' && targetSide === 'bottom') {
      const cornerX = endX + offX;
      const cornerY = startY + offY;
      if (offX !== 0 || offY !== 0) {
        pathD = `M ${startX} ${startY} L ${cornerX} ${startY} L ${cornerX} ${cornerY} L ${endX} ${cornerY} L ${endX} ${endY}`;
        midX = cornerX;
        midY = cornerY;
      } else {
        pathD = `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY}`;
        midX = (startX + endX) / 2;
        midY = startY;
      }
    } else if (sourceSide === 'left' && targetSide === 'left') {
      const farX = Math.min(startX, endX) - 35 + offX;
      pathD = `M ${startX} ${startY} L ${farX} ${startY} L ${farX} ${endY} L ${endX} ${endY}`;
      midX = farX;
      midY = (startY + endY) / 2 + offY;
    } else {
      if (Math.abs(endY - startY) > Math.abs(endX - startX)) {
        const stepY = startY + (endY - startY) / 2 + offY;
        pathD = `M ${startX} ${startY} L ${startX} ${stepY} L ${endX} ${stepY} L ${endX} ${endY}`;
        midX = (startX + endX) / 2 + offX;
        midY = stepY;
      } else {
        const stepX = startX + (endX - startX) / 2 + offX;
        pathD = `M ${startX} ${startY} L ${stepX} ${startY} L ${stepX} ${endY} L ${endX} ${endY}`;
        midX = stepX;
        midY = (startY + endY) / 2 + offY;
      }
    }

    return {
      pathD,
      midX,
      midY,
      startX,
      startY,
      endX,
      endY,
      sourceSide,
      targetSide,
    };
  }

  // Calculate robust cubic Bezier control points with guaranteed collinear entry/exit tangents
  const distance = Math.hypot(endX - startX, endY - startY);
  const tangentOffset = Math.max(35, Math.min(distance * 0.4, 120));

  let controlPoint1X = startX;
  let controlPoint1Y = startY;

  switch (sourceSide) {
    case 'top':
      controlPoint1Y = startY - tangentOffset;
      break;
    case 'bottom':
      controlPoint1Y = startY + tangentOffset;
      break;
    case 'left':
      controlPoint1X = startX - tangentOffset;
      break;
    case 'right':
    default:
      controlPoint1X = startX + tangentOffset;
      break;
  }

  let controlPoint2X = endX;
  let controlPoint2Y = endY;

  switch (targetSide) {
    case 'top':
      controlPoint2Y = endY - tangentOffset;
      break;
    case 'bottom':
      controlPoint2Y = endY + tangentOffset;
      break;
    case 'left':
      controlPoint2X = endX - tangentOffset;
      break;
    case 'right':
    default:
      controlPoint2X = endX + tangentOffset;
      break;
  }

  // Special refinement for same-column vertical flow: keep control points purely vertical
  if (sourceSide === 'bottom' && targetSide === 'top') {
    const verticalGap = Math.max(20, endY - startY);
    const vOffset = Math.max(25, Math.min(verticalGap * 0.45, 90));
    controlPoint1X = startX;
    controlPoint1Y = startY + vOffset;
    controlPoint2X = endX;
    controlPoint2Y = endY - vOffset;
  } else if (sourceSide === 'right' && targetSide === 'left') {
    const horizontalGap = Math.max(20, endX - startX);
    const hOffset = Math.max(25, Math.min(horizontalGap * 0.45, 90));
    controlPoint1X = startX + hOffset;
    controlPoint1Y = startY;
    controlPoint2X = endX - hOffset;
    controlPoint2Y = endY;
  }

  // Apply waypoint offset to Bezier control points
  if (offX !== 0 || offY !== 0) {
    const cpShiftX = offX / 0.75;
    const cpShiftY = offY / 0.75;
    controlPoint1X += cpShiftX;
    controlPoint1Y += cpShiftY;
    controlPoint2X += cpShiftX;
    controlPoint2Y += cpShiftY;
  }

  const pathD = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;

  // Mathematical midpoint on cubic Bezier at t = 0.5 for perfect edge label pill alignment
  const midX = 0.125 * startX + 0.375 * controlPoint1X + 0.375 * controlPoint2X + 0.125 * endX;
  const midY = 0.125 * startY + 0.375 * controlPoint1Y + 0.375 * controlPoint2Y + 0.125 * endY;

  return {
    pathD,
    midX,
    midY,
    startX,
    startY,
    endX,
    endY,
    sourceSide,
    targetSide,
  };
};

/**
 * Validate imported JSON schema content
 * @param {string} rawContent - raw json string
 * @returns {SchemaExportData | null} - parsed schema data or null if invalid
 */
export const _validateSchemaJson = (rawContent: string): SchemaExportData | null => {
  try {
    const parsedData = JSON.parse(rawContent) as SchemaExportData;

    const hasNodes = Boolean(parsedData && Array.isArray(parsedData.nodes));
    const hasEdges = Boolean(parsedData && Array.isArray(parsedData.edges));

    if (hasNodes && hasEdges) {
      return parsedData;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Download raw data as a formatted JSON file in client browser
 * @param {SchemaExportData} data - json schema data
 * @param {string} fileName - file name for download
 * @returns {void}
 */
export const _downloadJsonFile = (data: SchemaExportData, fileName: string): void => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
