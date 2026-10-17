import * as React from 'react';
import {
  PlayCircle,
  SquareCode,
  GitFork,
  Database,
  FileSpreadsheet,
  Workflow,
  Columns,
  CheckCircle2,
  Layers,
  Search,
  Clock,
  FileText,
  Files,
  Circle,
  Archive,
  UserCheck,
  Plus,
  Trash2,
  GripHorizontal,
} from 'lucide-react';
import type { FlowNode, FlowEdge, Position, FlowProjectTab, SwimlaneLane, EdgeEndpointDragState } from './ErpFlowGen.type';
import type { GhostSkeletonTemplate } from './ErpFlowGen.config';
import { _calculateEdgePath, _getNodeDimensions } from './ErpFlowGen.utils';

/**
 * Render dynamic Lucide icon by shape name
 * @param {string} iconName - identifier of icon
 * @param {string} [className] - optional css class name
 * @returns {React.ReactElement} - rendered icon element
 */
export const _renderShapeIcon = (
  iconName: string,
  className = 'w-4 h-4',
): React.ReactElement => {
  switch (iconName) {
    case 'PlayCircle':
      return <PlayCircle className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'SquareCode':
      return <SquareCode className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'GitFork':
      return <GitFork className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Files':
      return <Files className={className} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Circle':
      return <Circle className={className} />;
    case 'Archive':
      return <Archive className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Columns':
      return <Columns className={className} />;
    default:
      return <Workflow className={className} />;
  }
};

/**
 * Render badge pill for category/department
 * @param {string} category - department or module category name
 * @returns {React.ReactElement} - badge element
 */
export const _renderCategoryBadge = (category: string): React.ReactElement => {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200">
      {category}
    </span>
  );
};

/**
 * Render temporary SVG connecting line while user is dragging connector
 * @param {FlowNode} sourceNode - origin node
 * @param {Position} currentMouse - current mouse coordinates in canvas space
 * @returns {React.ReactElement} - SVG path element
 */
export const _renderConnectingPath = (
  sourceNode: FlowNode,
  currentMouse: Position,
  sourceAnchor?: 'top' | 'bottom' | 'left' | 'right',
): React.ReactElement => {
  const dims = _getNodeDimensions(sourceNode);
  const ports = {
    top: { x: sourceNode.position.x + dims.width / 2, y: sourceNode.position.y },
    bottom: { x: sourceNode.position.x + dims.width / 2, y: sourceNode.position.y + dims.height },
    left: { x: sourceNode.position.x, y: sourceNode.position.y + dims.height / 2 },
    right: { x: sourceNode.position.x + dims.width, y: sourceNode.position.y + dims.height / 2 },
  };

  let startX: number;
  let startY: number;

  if (sourceAnchor && ports[sourceAnchor]) {
    startX = ports[sourceAnchor].x;
    startY = ports[sourceAnchor].y;
  } else {
    let bestDist = Infinity;
    startX = ports.bottom.x;
    startY = ports.bottom.y;
    Object.values(ports).forEach((p) => {
      const d = Math.hypot(p.x - currentMouse.x, p.y - currentMouse.y);
      if (d < bestDist) {
        bestDist = d;
        startX = p.x;
        startY = p.y;
      }
    });
  }

  const pathD = `M ${startX} ${startY} L ${currentMouse.x} ${currentMouse.y}`;

  return (
    <g className="pointer-events-none">
      <path
        d={pathD}
        stroke="#4f46e5"
        strokeWidth={3}
        strokeDasharray="6 4"
        fill="none"
        markerEnd="url(#erp-arrow-marker)"
      />
      <circle cx={startX} cy={startY} r={5} fill="#4f46e5" />
      <circle cx={currentMouse.x} cy={currentMouse.y} r={5} fill="#4f46e5" />
    </g>
  );
};

/**
 * Render individual SVG directional connection edge in light theme
 * @param {FlowEdge} edge - flow edge descriptor
 * @param {FlowNode[]} nodes - list of all flow nodes
 * @param {boolean} isSelected - selection state of edge
 * @returns {React.ReactElement | null} - rendered edge element or null if nodes not found
 */
export const _renderEdgeCurve = (
  edge: FlowEdge,
  nodes: FlowNode[],
  isSelected: boolean,
  onSelectEdge?: (edgeId: string) => void,
  _onOpenEditEdge?: (edgeId: string) => void,
  _onDeleteEdge?: (edgeId: string) => void,
  connectorStyle: 'orthogonal' | 'curved' | 'straight' = 'orthogonal',
  onStartEdgeWaypointDrag?: (e: React.MouseEvent, edgeId: string) => void,
  onResetEdgeWaypoint?: (edgeId: string) => void,
  _onSetEdgeTargetAnchor?: (edgeId: string, anchor: 'auto' | 'top' | 'bottom' | 'left' | 'right') => void,
  onStartEdgeEndpointDrag?: (e: React.MouseEvent, edgeId: string, endpointType?: 'source' | 'target' | 'auto') => void,
  _edgeEndpointDragState?: EdgeEndpointDragState,
  onUpdateEdgeLabel?: (edgeId: string, label: string) => void,
  onClickEdgeLabel?: (edgeId: string) => void,
  onHoverEdge?: (edgeId: string) => void,
): React.ReactElement | null => {
  const sourceNode = nodes.find((node) => node.id === edge.sourceNodeId);
  const targetNode = nodes.find((node) => node.id === edge.targetNodeId);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const geometry = _calculateEdgePath(
    sourceNode,
    targetNode,
    connectorStyle,
    edge.waypointOffset,
    edge.sourceAnchor,
    edge.targetAnchor,
  );
  const labelLower = edge.label.toLowerCase();
  const isBranchYes =
    labelLower.includes('yes') ||
    labelLower.includes('ya') ||
    labelLower.includes('true') ||
    labelLower.includes('pass') ||
    labelLower.includes('stock') ||
    labelLower.includes('valid') ||
    labelLower.includes('setuju') ||
    labelLower.includes('sukses') ||
    labelLower.includes('positif');

  const isBranchNo =
    labelLower.includes('no') ||
    labelLower.includes('tidak') ||
    labelLower.includes('false') ||
    labelLower.includes('reject') ||
    labelLower.includes('fail') ||
    labelLower.includes('tolak') ||
    labelLower.includes('batal') ||
    labelLower.includes('gagal') ||
    labelLower.includes('negatif');

  const strokeColor = isSelected
    ? '#4f46e5'
    : edge.color
      ? edge.color
      : isBranchYes
        ? '#10b981'
        : isBranchNo
          ? '#f43f5e'
          : '#64748b';

  const markerColor = isSelected
    ? '#4f46e5'
    : edge.color
      ? edge.color
      : isBranchYes
        ? '#10b981'
        : isBranchNo
          ? '#f43f5e'
          : '#64748b';

  const getMarkerId = (color: string) => {
    switch (color) {
      case '#4f46e5':
        return 'url(#erp-arrow-marker-indigo)';
      case '#10b981':
        return 'url(#erp-arrow-marker-emerald)';
      case '#f43f5e':
        return 'url(#erp-arrow-marker-rose)';
      case '#f59e0b':
        return 'url(#erp-arrow-marker-amber)';
      case '#8b5cf6':
        return 'url(#erp-arrow-marker-purple)';
      default:
        return 'url(#erp-arrow-marker)';
    }
  };
  const markerId = getMarkerId(markerColor);

  const hasCustomWaypoint = Boolean(
    edge.waypointOffset && (edge.waypointOffset.x !== 0 || edge.waypointOffset.y !== 0),
  );

  return (
    <g
      key={edge.id}
      data-edge-id={edge.id}
      className="cursor-pointer group"
      onMouseEnter={() => onHoverEdge?.(edge.id)}
      onMouseLeave={() => onHoverEdge?.('')}
      onClick={(e) => {
        e.stopPropagation();
        onSelectEdge?.(edge.id);
      }}
    >
      {/* Background hover path for easy clicking to select edge AND dragging to bend/reposition */}
      <path
        d={geometry.pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={22}
        data-edge-id={edge.id}
        className="pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ pointerEvents: 'stroke' }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onSelectEdge?.(edge.id);
          onStartEdgeWaypointDrag?.(e, edge.id);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectEdge?.(edge.id);
        }}
      />

      {/* Selection outer glow */}
      {isSelected && (
        <path
          d={geometry.pathD}
          fill="none"
          stroke="#6366f1"
          strokeWidth={8}
          opacity={0.3}
          className="pointer-events-none"
        />
      )}

      {/* Visual visible path */}
      <path
        d={geometry.pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isSelected ? 3.5 : 2}
        markerEnd={markerId}
        className="transition-colors group-hover:stroke-indigo-600 pointer-events-none"
      />

      {/* Interactive Arrowhead Endpoint Drag Handle (Reconnecting target node) */}
      {geometry.endX !== undefined && geometry.endY !== undefined && (
        <g
          data-edge-id={edge.id}
          data-edge-handle="target"
          className={`cursor-grab active:cursor-grabbing group/target-handle pointer-events-auto transition-opacity duration-150 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelectEdge?.(edge.id);
            onStartEdgeEndpointDrag?.(e, edge.id, 'target');
          }}
        >
          <title>Tarik ujung panah untuk menyambungkan ke node lain</title>
          {/* Generous hit area for easy grabbing */}
          <circle
            cx={geometry.endX}
            cy={geometry.endY}
            r={22}
            fill="transparent"
            className="cursor-grab active:cursor-grabbing pointer-events-auto"
          />
          {/* Subtle outer glow ring with pulse */}
          <circle
            cx={geometry.endX}
            cy={geometry.endY}
            r={14}
            fill="#4f46e5"
            className="transition-all duration-150 pointer-events-none opacity-30 group-hover/target-handle:opacity-50"
          />
          {/* Circular handle ("buletin") */}
          <circle
            cx={geometry.endX}
            cy={geometry.endY}
            r={7}
            fill="#ffffff"
            stroke="#4f46e5"
            strokeWidth={3}
            className="transition-all duration-150 filter drop-shadow-md pointer-events-none opacity-100"
          />
          {/* Center bullet dot */}
          <circle
            cx={geometry.endX}
            cy={geometry.endY}
            r={2.5}
            fill="#4f46e5"
            className="transition-opacity duration-150 pointer-events-none opacity-100"
          />
        </g>
      )}

      {/* Interactive Source Origin Drag Handle (Reconnecting source node) */}
      {geometry.startX !== undefined && geometry.startY !== undefined && (
        <g
          data-edge-id={edge.id}
          data-edge-handle="source"
          className={`cursor-grab active:cursor-grabbing group/source-handle pointer-events-auto transition-opacity duration-150 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelectEdge?.(edge.id);
            onStartEdgeEndpointDrag?.(e, edge.id, 'source');
          }}
        >
          <title>Tarik titik awal garis untuk memindah ke node lain</title>
          {/* Generous hit area */}
          <circle
            cx={geometry.startX}
            cy={geometry.startY}
            r={22}
            fill="transparent"
            className="cursor-grab active:cursor-grabbing pointer-events-auto"
          />
          {/* Subtle outer glow ring */}
          <circle
            cx={geometry.startX}
            cy={geometry.startY}
            r={14}
            fill="#6366f1"
            className="transition-all duration-150 pointer-events-none opacity-30 group-hover/source-handle:opacity-50"
          />
          {/* Circular handle */}
          <circle
            cx={geometry.startX}
            cy={geometry.startY}
            r={7}
            fill="#ffffff"
            stroke="#6366f1"
            strokeWidth={3}
            className="transition-all duration-150 filter drop-shadow-md pointer-events-none opacity-100"
          />
          {/* Center bullet dot */}
          <circle
            cx={geometry.startX}
            cy={geometry.startY}
            r={2.5}
            fill="#6366f1"
            className="transition-opacity duration-150 pointer-events-none opacity-100"
          />
        </g>
      )}

      {/* Interactive Waypoint Drag Handle on the bend/midpoint */}
      <g
        data-edge-id={edge.id}
        data-edge-handle="waypoint"
        className="cursor-grab active:cursor-grabbing pointer-events-auto"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelectEdge?.(edge.id);
          onStartEdgeWaypointDrag?.(e, edge.id);
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onResetEdgeWaypoint?.(edge.id);
        }}
      >
        {/* Invisible wider hit target */}
        <circle
          cx={geometry.midX}
          cy={geometry.midY}
          r={20}
          fill="transparent"
        />

        {/* Outer subtle glow */}
        <circle
          cx={geometry.midX}
          cy={geometry.midY}
          r={isSelected ? 10 : 8}
          fill={isSelected ? '#6366f1' : '#3b82f6'}
          className={`transition-opacity duration-150 ${isSelected || hasCustomWaypoint ? 'opacity-35' : 'opacity-0 group-hover:opacity-30'
            }`}
        />

        {/* Drag handle diamond */}
        <rect
          x={geometry.midX - (isSelected ? 5 : 4)}
          y={geometry.midY - (isSelected ? 5 : 4)}
          width={isSelected ? 10 : 8}
          height={isSelected ? 10 : 8}
          rx={2}
          transform={`rotate(45, ${geometry.midX}, ${geometry.midY})`}
          fill={hasCustomWaypoint ? '#4f46e5' : '#ffffff'}
          stroke={isSelected ? '#4338ca' : '#64748b'}
          strokeWidth={1.5}
          className={`filter drop-shadow-md transition-opacity duration-150 ${isSelected || hasCustomWaypoint ? 'opacity-100' : 'opacity-40 group-hover:opacity-90'
            }`}
        />
      </g>

      {/* Edge label pill - Direct Inline Editable (Like Group Frame Title) */}
      {(Boolean(edge.label) || isSelected) && (
        <foreignObject
          x={geometry.midX - 90}
          y={geometry.midY - 15}
          width={180}
          height={30}
          className="overflow-visible pointer-events-none"
        >
          <div className="flex items-center justify-center w-full h-full pointer-events-none">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs transition-all select-none pointer-events-auto ${edge.color === '#10b981' || (!edge.color && isBranchYes)
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : edge.color === '#f43f5e' || (!edge.color && isBranchNo)
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : edge.color === '#f59e0b'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : edge.color === '#8b5cf6'
                      ? 'bg-purple-50 border-purple-300 text-purple-800'
                      : edge.color === '#4f46e5'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400'
                } ${isSelected ? 'ring-2 ring-indigo-400 border-indigo-500 shadow-md' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEdge?.(edge.id);
                onClickEdgeLabel?.(edge.id);
              }}
            >
              {isBranchYes ? (
                <span className="text-xs font-bold text-emerald-600 select-none shrink-0">✓</span>
              ) : isBranchNo ? (
                <span className="text-xs font-bold text-rose-600 select-none shrink-0">✕</span>
              ) : null}

              <input
                type="text"
                value={edge.label}
                onChange={(e) => onUpdateEdgeLabel?.(edge.id, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEdge?.(edge.id);
                  onClickEdgeLabel?.(edge.id);
                }}
                placeholder="Label..."
                className="bg-transparent border-none outline-none text-xs font-bold text-center transition-all cursor-text placeholder:text-slate-400 placeholder:font-normal placeholder:text-[10px]"
                title="Click to edit edge label"
                style={{ width: `${Math.max(48, Math.min(130, (edge.label ? edge.label.length * 8 + 8 : 64)))}px` }}
              />

              {isSelected && _onDeleteEdge && (
                <button
                  type="button"
                  title="Delete Line"
                  onClick={(e) => {
                    e.stopPropagation();
                    _onDeleteEdge(edge.id);
                  }}
                  className="w-4 h-4 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-0.5"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

/**
 * Render Interactive Grouping Table for Swimlane Process Flowcharts
 * Features:
 * - Left vertical Master Title strip (e.g. XXX Company Business Process Diagram)
 * - Department headers with dedicated background colors
 * - Solid horizontal dividing grid lines
 * - Add/delete department lane controls
 */
export const _renderSwimlaneTable = (
  tab: FlowProjectTab,
  onAddLane?: () => void,
  onDeleteLane?: (laneId: string) => void,
  _onUpdateTableWidth?: (newWidth: number) => void,
  _onUpdateLaneHeight?: (laneId: string, newHeight: number) => void,
  onStartTableResize?: (event: React.MouseEvent) => void,
  onStartLaneResize?: (event: React.MouseEvent, laneId: string, initialHeight: number) => void,
  onUpdateSwimlaneName?: (laneId: string, name: string) => void,
  onUpdateMasterTitle?: (title: string) => void,
): React.ReactElement | null => {
  if (tab.type !== 'swimlane') return null;

  const swimlanes: SwimlaneLane[] = tab.swimlanes && tab.swimlanes.length > 0
    ? tab.swimlanes
    : [
      { id: 'lane_sales', name: 'Sales Department', color: '#6366f1', height: 180 },
      { id: 'lane_purchasing', name: 'Purchasing Department', color: '#ec4899', height: 180 },
      { id: 'lane_production', name: 'Production Department', color: '#f59e0b', height: 180 },
      { id: 'lane_finance', name: 'Finance Department', color: '#ef4444', height: 180 },
    ];

  const masterTitle = tab.masterTitle || tab.title || 'Business Process Flow Diagram';
  const tableWidth = tab.tableWidth || 1400;

  return (
    <div className="absolute left-6 top-6 z-0 select-none pointer-events-none">
      {/* Outer Table Frame */}
      <div
        style={{ width: `${tableWidth}px` }}
        className="rounded-2xl border-2 border-slate-300 bg-white/70 shadow-xs flex relative group/table transition-none"
      >
        {/* Leftmost Master Title Vertical Column (Purple strip) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onUpdateMasterTitle) {
              const newTitle = window.prompt('Edit Master Swimlane Diagram Title:', masterTitle);
              if (newTitle !== null && newTitle.trim()) {
                onUpdateMasterTitle(newTitle.trim());
              }
            }
          }}
          title={onUpdateMasterTitle ? 'Click to edit master process diagram title' : undefined}
          className="w-14 bg-purple-100 hover:bg-purple-200/80 transition-colors border-r-2 border-purple-200 flex flex-col items-center justify-center py-6 shrink-0 pointer-events-auto cursor-pointer group/master"
        >
          <span className="font-extrabold text-[12px] uppercase tracking-widest text-purple-800 -rotate-90 whitespace-nowrap group-hover/master:underline">
            {masterTitle}
          </span>
        </div>

        {/* Lanes Body */}
        <div className="flex-1 flex flex-col">
          {swimlanes.map((lane, index) => {
            return (
              <div
                key={lane.id}
                style={{ height: `${lane.height}px` }}
                className={`relative flex items-stretch border-slate-200/90 ${index !== swimlanes.length - 1 ? 'border-b-2' : ''
                  }`}
              >
                {/* Department Header Box */}
                <div
                  style={{
                    backgroundColor: `${lane.color}15`,
                    borderColor: lane.color,
                  }}
                  className="w-56 border-r-2 flex flex-col items-center justify-center p-3 text-center shrink-0 group relative pointer-events-auto"
                >
                  <div className="relative w-full flex items-center justify-center px-1">
                    {onUpdateSwimlaneName ? (
                      <textarea
                        value={lane.name}
                        onChange={(e) => onUpdateSwimlaneName(lane.id, e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            (e.target as HTMLTextAreaElement).blur();
                          }
                        }}
                        rows={Math.min(4, Math.max(1, Math.ceil(lane.name.length / 18)))}
                        placeholder="Department Name..."
                        title="Click to edit department name"
                        style={{ color: lane.color }}
                        className={`w-full bg-transparent hover:bg-white/40 focus:bg-white/95 focus:ring-1 focus:ring-indigo-400 outline-none text-center font-bold uppercase tracking-wider leading-snug rounded-md px-1.5 py-1 transition-all cursor-text resize-none overflow-hidden break-words whitespace-pre-wrap ${lane.name.length > 22 ? 'text-[11px]' : 'text-xs'
                          }`}
                      />
                    ) : (
                      <span
                        style={{ color: lane.color }}
                        className={`font-bold uppercase tracking-wider leading-snug break-words whitespace-pre-wrap text-center max-w-full ${lane.name.length > 22 ? 'text-[11px]' : 'text-xs'
                          }`}
                      >
                        {lane.name}
                      </span>
                    )}
                  </div>



                  {/* Delete lane button if more than 1 lane */}
                  {swimlanes.length > 1 && onDeleteLane ? (
                    <button
                      type="button"
                      title={`Delete lane ${lane.name}`}
                      onClick={() => onDeleteLane(lane.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>

                {/* Lane Canvas Track (Pure non-blocking background) */}
                <div className="flex-1 relative bg-slate-50/20 pointer-events-none">
                  {/* Subtle watermarked lane guide */}
                  <div className="absolute right-4 bottom-2 text-[10px] font-mono text-slate-300 uppercase tracking-widest pointer-events-none">
                    {lane.name} Track
                  </div>
                </div>

                {/* Interactive Drag & Drop Lane Height Resize Handle on Bottom Border */}
                {onStartLaneResize && (
                  <div
                    title={`Drag up or down to adjust ${lane.name} lane height`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onStartLaneResize(e, lane.id, lane.height);
                    }}
                    className="absolute -bottom-2.5 left-0 right-0 h-5 z-20 cursor-ns-resize flex items-center justify-center group/lane-resize pointer-events-auto select-none"
                  >
                    {/* Visual drag divider line with hover effect */}
                    <div className="w-full h-1 bg-transparent group-hover/lane-resize:bg-indigo-500/80 transition-colors flex items-center justify-center relative">
                      {/* Center grip pill */}
                      <div className="px-2.5 py-0.5 rounded-full bg-white text-slate-600 group-hover/lane-resize:bg-indigo-600 group-hover/lane-resize:text-white border border-slate-300 group-hover/lane-resize:border-indigo-600 text-[9px] font-mono font-bold shadow-xs flex items-center gap-1 transition-colors scale-90 group-hover/lane-resize:scale-100">
                        <GripHorizontal className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right-edge Interactive Table Width Resize Handle */}
        {onStartTableResize ? (
          <div
            title="Drag sideways to adjust table width"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartTableResize(e);
            }}
            className="w-4 bg-slate-100 hover:bg-indigo-600 border-l border-slate-300 hover:border-indigo-700 flex items-center justify-center cursor-ew-resize transition-colors group/resize pointer-events-auto shrink-0 select-none interactive-control z-20"
          >
            <div className="flex flex-col gap-1 items-center pointer-events-none">
              <div className="w-1 h-3 rounded-full bg-slate-400 group-hover/resize:bg-white" />
              <div className="w-1 h-3 rounded-full bg-slate-400 group-hover/resize:bg-white" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Table Size Controls & Add Lane Toolbar */}
      <div className="mt-3 flex items-center gap-3 pointer-events-auto">
        {onAddLane ? (
          <button
            type="button"
            onClick={onAddLane}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add New Lane</span>
          </button>
        ) : null}

      </div>
    </div>
  );
};

/**
 * Render Clean Ghost Skeleton Blueprint Template
 * Shows dashed skeleton nodes with orthogonal right-angle paths
 * @param {GhostSkeletonTemplate} template - blueprint skeleton data
 * @param {boolean} show - whether to display skeleton
 * @returns {React.ReactElement | null} - rendered ghost skeleton
 */
export const _renderGhostSkeleton = (
  template: GhostSkeletonTemplate | undefined,
  show: boolean,
): React.ReactElement | null => {
  if (!show || !template) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      {/* SVG Layer for clean dashed connecting lines */}
      <svg className="absolute inset-0 w-[2600px] h-[2600px] overflow-visible">
        {template.edges.map((edge) => {
          const source: FlowNode | undefined =
            edge.sourceNodeId === 'start_node'
              ? ({
                id: 'start_node',
                type: 'start',
                label: 'Start',
                description: '',
                moduleCategory: 'General',
                position: { x: 520, y: 40 },
                colorTheme: 'emerald',
                width: 160,
                height: 50,
              } as FlowNode)
              : template.nodes.find((n) => n.id === edge.sourceNodeId);

          const target = template.nodes.find((n) => n.id === edge.targetNodeId);
          if (!source || !target) return null;

          const geometry = _calculateEdgePath(source, target);

          return (
            <g key={edge.id} opacity={0.45}>
              <path
                d={geometry.pathD}
                fill="none"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              {edge.label ? (
                (() => {
                  const badgeW = Math.max(48, edge.label.length * 6.5 + 16);
                  return (
                    <g transform={`translate(${geometry.midX}, ${geometry.midY})`}>
                      <rect
                        x={-badgeW / 2}
                        y={-9}
                        width={badgeW}
                        height={18}
                        rx={9}
                        fill="#ffffff"
                        stroke="#cbd5e1"
                        strokeWidth={1}
                        opacity={0.95}
                      />
                      <text
                        x={0}
                        y={3.5}
                        textAnchor="middle"
                        fontSize="9.5"
                        fill="#475569"
                        fontWeight="700"
                        className="font-sans select-none"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })()
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* Clean ghost dashed node placeholders matching exact node dimensions */}
      {template.nodes.map((node) => {
        const dims = _getNodeDimensions(node);
        const isDiamond = node.type === 'decision';
        const isPill = node.type === 'end' || node.type === 'start';
        const isCircle = node.type === 'dfdProcess';

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
              width: `${dims.width}px`,
              height: `${dims.height}px`,
            }}
            className="flex items-center justify-center p-3 text-center opacity-40 relative select-none"
          >
            {/* SVG Contour matching node shape */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${dims.width} ${dims.height}`}
            >
              {isDiamond ? (
                <polygon
                  points={`${dims.width / 2},2 ${dims.width - 2},${dims.height / 2} ${dims.width / 2},${dims.height - 2} 2,${dims.height / 2}`}
                  fill="#ffffff"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              ) : isCircle ? (
                <circle
                  cx={dims.width / 2}
                  cy={dims.height / 2}
                  r={dims.width / 2 - 2}
                  fill="#ffffff"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              ) : isPill ? (
                <rect
                  x={2}
                  y={2}
                  width={dims.width - 4}
                  height={dims.height - 4}
                  rx={dims.height / 2}
                  fill="#ffffff"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              ) : (
                <rect
                  x={2}
                  y={2}
                  width={dims.width - 4}
                  height={dims.height - 4}
                  rx={10}
                  fill="#ffffff"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              )}
            </svg>

            <span className="relative z-10 text-xs font-semibold text-slate-700 px-2 line-clamp-2 leading-snug text-center break-words">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
