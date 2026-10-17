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
import type { FlowNode, FlowEdge, Position, FlowProjectTab, SwimlaneLane } from './ErpFlowGen.type';
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
): React.ReactElement => {
  const dims = _getNodeDimensions(sourceNode);
  const startX = sourceNode.position.x + dims.width;
  const startY = sourceNode.position.y + dims.height / 2;
  const pathD = `M ${startX} ${startY} L ${currentMouse.x} ${currentMouse.y}`;

  return (
    <path
      d={pathD}
      stroke="#6366f1"
      strokeWidth={2.5}
      strokeDasharray="5 5"
      fill="none"
      className="animate-pulse"
    />
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
): React.ReactElement | null => {
  const sourceNode = nodes.find((node) => node.id === edge.sourceNodeId);
  const targetNode = nodes.find((node) => node.id === edge.targetNodeId);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const geometry = _calculateEdgePath(sourceNode, targetNode);
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
    : isBranchYes
    ? '#10b981'
    : isBranchNo
    ? '#f43f5e'
    : '#64748b';

  const markerId = isSelected
    ? 'url(#erp-arrow-marker)'
    : isBranchYes
    ? 'url(#erp-arrow-marker-emerald)'
    : isBranchNo
    ? 'url(#erp-arrow-marker-rose)'
    : 'url(#erp-arrow-marker)';

  const displayLabel = isBranchYes && !edge.label.startsWith('✓')
    ? `✓ ${edge.label}`
    : isBranchNo && !edge.label.startsWith('✕')
    ? `✕ ${edge.label}`
    : edge.label;

  return (
    <g key={edge.id} className="cursor-pointer group">
      {/* Background thicker hover path */}
      <path
        d={geometry.pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={22}
      />
      {/* Visual visible path */}
      <path
        d={geometry.pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isSelected ? 3 : 2}
        markerEnd={markerId}
        className="transition-colors group-hover:stroke-indigo-600"
      />
      {/* Edge label pill */}
      {edge.label ? (
        <g transform={`translate(${geometry.midX}, ${geometry.midY})`}>
          <rect
            x={-displayLabel.length * 3.7 - 12}
            y={-11}
            width={displayLabel.length * 7.4 + 24}
            height={22}
            rx={11}
            fill={isBranchYes ? '#f0fdf4' : isBranchNo ? '#fff1f2' : '#ffffff'}
            stroke={strokeColor}
            strokeWidth={1.5}
            className="filter drop-shadow-sm"
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={isBranchYes ? '#047857' : isBranchNo ? '#be123c' : '#334155'}
            className="select-none pointer-events-none tracking-tight font-sans"
          >
            {displayLabel}
          </text>
        </g>
      ) : null}
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
  onUpdateTableWidth?: (newWidth: number) => void,
  onUpdateLaneHeight?: (laneId: string, newHeight: number) => void,
  onStartTableResize?: (event: React.MouseEvent) => void,
  onStartLaneResize?: (event: React.MouseEvent, laneId: string, initialHeight: number) => void,
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
        <div className="w-14 bg-purple-100 border-r-2 border-purple-200 flex flex-col items-center justify-center py-6 shrink-0 pointer-events-auto">
          <span className="font-extrabold text-[12px] uppercase tracking-widest text-purple-800 -rotate-90 whitespace-nowrap">
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
                className={`relative flex items-stretch border-slate-200/90 ${
                  index !== swimlanes.length - 1 ? 'border-b-2' : ''
                }`}
              >
                {/* Department Header Box */}
                <div
                  style={{
                    backgroundColor: `${lane.color}15`,
                    borderColor: lane.color,
                  }}
                  className="w-44 border-r-2 flex flex-col items-center justify-center p-3 text-center shrink-0 group relative pointer-events-auto"
                >
                  <span
                    style={{ color: lane.color }}
                    className="font-bold text-xs uppercase tracking-wider leading-snug"
                  >
                    {lane.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    Lajur #{index + 1} ({lane.height}px)
                  </span>

                  {/* Lane height adjust buttons */}
                  {onUpdateLaneHeight ? (
                    <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        title="Perkecil tinggi lajur (-30px)"
                        onClick={() => onUpdateLaneHeight(lane.id, Math.max(100, lane.height - 30))}
                        className="px-1.5 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-[9.5px] font-bold text-slate-600 cursor-pointer shadow-2xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        title="Perbesar tinggi lajur (+30px)"
                        onClick={() => onUpdateLaneHeight(lane.id, Math.min(500, lane.height + 30))}
                        className="px-1.5 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-[9.5px] font-bold text-slate-600 cursor-pointer shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  ) : null}

                  {/* Delete lane button if more than 1 lane */}
                  {swimlanes.length > 1 && onDeleteLane ? (
                    <button
                      type="button"
                      title={`Hapus lajur ${lane.name}`}
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
                    title={`Tarik ke bawah / ke atas untuk ubah tinggi lajur ${lane.name} (Drag to adjust height)`}
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
                        <span>{lane.height}px</span>
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
            title="Tarik ke samping untuk ubah lebar tabel (Drag to adjust table width)"
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
            <span>+ Tambah Lajur Baru</span>
          </button>
        ) : null}

        {onUpdateTableWidth ? (
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1 shadow-xs text-xs font-semibold text-slate-700">
            <span className="text-[11px] text-slate-500">Lebar: {tableWidth}px</span>
            <button
              type="button"
              title="Perkecil lebar tabel (-200px)"
              onClick={() => onUpdateTableWidth(Math.max(800, tableWidth - 200))}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              -200px
            </button>
            <button
              type="button"
              title="Perpanjang lebar tabel (+200px)"
              onClick={() => onUpdateTableWidth(Math.min(4000, tableWidth + 200))}
              className="px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold cursor-pointer"
            >
              +200px
            </button>
          </div>
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
                <g transform={`translate(${geometry.midX}, ${geometry.midY})`}>
                  <rect
                    x={-24}
                    y={-9}
                    width={48}
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

            <span className="relative z-10 text-xs font-semibold text-slate-700 px-3 truncate max-w-full">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
