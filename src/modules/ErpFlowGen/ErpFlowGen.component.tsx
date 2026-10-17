import * as React from 'react';
import {
  Download,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  X,
  HelpCircle,
  PlayCircle,
  SquareCode,
  Database,
  FileSpreadsheet,
  Edit3,
  CheckCircle2,
  Eye,
  EyeOff,
  GitFork,
  Layers,
  Search,
  Clock,
  FileText,
  Files,
  Archive,
  UserCheck,
  Circle,
  Workflow,
  Sparkles,
  Columns,
  ArrowRight,
  ArrowDown,
  Map,
  Target,
  FolderPlus,
  Palette,
  GripHorizontal,
  Check,
  ArrowLeftRight,
  FolderCode,
  Bot,
  Key,
  FileCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  Share2,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Copy,
  Lock,
  Camera,
  LayoutDashboard,
  ListTodo,
  Link2,
  Move,
} from 'lucide-react';
import type {
  FlowNode,
  FlowNodeType,
  FlowGroupFrame,
  NodeColorTheme,
  CanvasTransform,
  FlowProjectTab,
  FlowchartProjectType,
  ErpFlowGenComponentProps,
  KanbanTaskStatus,
} from './ErpFlowGen.type';
import {
  FLOW_NODE_TYPE_OPTIONS,
  FLOWCHART_TYPES_METADATA,
  SKELETON_TEMPLATES,
} from './ErpFlowGen.config';
import { COLOR_THEME_STYLES } from './ErpFlowGen.style';
import { _getNodeDimensions } from './ErpFlowGen.utils';
import {
  _renderSwimlaneTable,
  _renderGhostSkeleton,
  _renderConnectingPath,
  _renderEdgeCurve,
} from './ErpFlowGen.helpers';

/**
 * Render visual SVG shape preview for node types (Kapsul, Kotak, Belah Ketupat, Hexagon, etc.)
 */
const _renderShapeVisualPreview = (type: FlowNodeType, className = 'w-5 h-5'): React.ReactElement => {
  switch (type) {
    case 'start':
      // Kapsul / Pill / Oval horizontal
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="2" y="7" width="28" height="18" rx="9" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    case 'end':
      // Kapsul / Pill tebal ring ganda
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="2" y="7" width="28" height="18" rx="9" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3" />
          <rect x="6" y="10.5" width="20" height="11" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
        </svg>
      );
    case 'process':
      // Kotak Persegi Panjang
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="2" y="6" width="28" height="20" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    case 'subprocess':
      // Kotak garis ganda (Predefined Process)
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="2" y="6" width="28" height="20" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
          <line x1="7" y1="6" x2="7" y2="26" stroke="currentColor" strokeWidth="2" />
          <line x1="25" y1="6" x2="25" y2="26" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'inspection':
      // Hexagon / Segi Enam
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <polygon points="7,6 25,6 30,16 25,26 7,26 2,16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'delay':
      // Huruf D / Setengah Lingkaran
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M 4 6 L 16 6 A 10 10 0 0 1 16 26 L 4 26 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'decision':
      // Belah Ketupat / Diamond
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <polygon points="16,3 29,16 16,29 3,16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'document':
      // Dokumen dengan wave bawah
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M 4 5 L 28 5 L 28 22 C 22 19 18 26 10 22 C 6 20 4 22 4 22 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'multidocument':
      // Dokumen rangkap / bertumpuk
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M 8 3 L 28 3 L 28 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M 4 7 L 24 7 L 24 24 C 18 21 14 28 8 24 C 5 22 4 24 4 24 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'inputOutput':
      // Jajar genjang / Parallelogram
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <polygon points="9,6 29,6 23,26 3,26" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'database':
      // Silinder Vertikal
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <ellipse cx="16" cy="8" rx="12" ry="4" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
          <path d="M 4 8 L 4 24 C 4 26.5 9.4 28 16 28 C 22.6 28 28 26.5 28 24 L 28 8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'dfdProcess':
      // Lingkaran Bulat
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    case 'datastore':
      // DFD Data Store [ = ]
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <line x1="3" y1="8" x2="29" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="3" y1="24" x2="29" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="7" y1="8" x2="7" y2="24" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'entity':
      // Kotak Entitas
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="3" y="6" width="26" height="20" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="2" y="6" width="28" height="20" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
  }
};

/**
 * Render dynamic Lucide icon by name
 */
const _renderShapeIcon = (iconName: string, className = 'w-4 h-4'): React.ReactElement => {
  switch (iconName) {
    case 'PlayCircle':
      return <PlayCircle className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'SquareCode':
      return <SquareCode className={className} />;
    case 'GitFork':
      return <GitFork className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Files':
      return <Files className={className} />;
    case 'Circle':
      return <Circle className={className} />;
    case 'Archive':
      return <Archive className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Columns':
      return <Columns className={className} />;
    case 'LayoutDashboard':
      return <LayoutDashboard className={className} />;
    default:
      return <Workflow className={className} />;
  }
};

type CanvasNodeProps = {
  node: FlowNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onOpenEditModal: (nodeId: string) => void;
  onStartDrag: (event: React.MouseEvent<HTMLDivElement>, nodeId: string) => void;
  onStartResize?: (event: React.MouseEvent, nodeId: string, mode?: 'both' | 'horizontal' | 'vertical') => void;
  onStartConnection?: (event: React.MouseEvent<HTMLButtonElement>, nodeId: string) => void;
  onCompleteConnect: (nodeId: string) => void;
  onOpenAddModal: (nodeId: string, direction: 'right' | 'bottom', defaultEdgeLabel?: string) => void;
  onToggleDecisionSwap?: (nodeId: string) => void;
  flowType?: FlowchartProjectType;
  isViewOnly?: boolean;
  isRunnerActive?: boolean;
  onMouseEnter?: (nodeId: string) => void;
  onMouseLeave?: () => void;
};

/**
 * Render individual flowchart node on the canvas with consistent quick-add (+) buttons
 * and corner resize handle
 */
const _CanvasNodeItem = (props: CanvasNodeProps): React.ReactElement => {
  const {
    node,
    isSelected,
    onSelect,
    onOpenEditModal,
    onStartDrag,
    onStartResize,
    onStartConnection,
    onCompleteConnect,
    onOpenAddModal,
    onToggleDecisionSwap,
    flowType,
    isViewOnly,
    isRunnerActive,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const theme = COLOR_THEME_STYLES[node.colorTheme] ?? COLOR_THEME_STYLES.indigo;
  const dims = _getNodeDimensions(node);
  const isEnd = node.type === 'end';
  const isStart = node.type === 'start';
  const isDecision = node.type === 'decision';
  const isDfdProcess = node.type === 'dfdProcess';
  const isDatastore = node.type === 'datastore';
  const isIO = node.type === 'inputOutput';
  const isSubprocess = node.type === 'subprocess';
  const isInspection = node.type === 'inspection';
  const isDelay = node.type === 'delay';
  const isDocument = node.type === 'document';
  const isMultiDocument = node.type === 'multidocument';
  const isDatabase = node.type === 'database';
  const isEntity = node.type === 'entity';

  const _handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (isViewOnly) return;
    event.preventDefault();
    event.stopPropagation();
    onStartDrag(event, node.id);
  };

  const _handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    onSelect(node.id);
  };

  const _handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    if (isViewOnly) return;
    onOpenEditModal(node.id);
  };

  const _handleMouseUp = (): void => {
    if (isViewOnly) return;
    onCompleteConnect(node.id);
  };

  const nodePositionStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${node.position.x}px`,
    top: `${node.position.y}px`,
    width: `${dims.width}px`,
    height: `${dims.height}px`,
    transition: 'none',
  };

  // Badge displayed on node if screen mockup is available
  const _renderScreenBadge = (): React.ReactElement | null => {
    if (!node.previewImageUrl) return null;
    return (
      <div
        title="Screen Mockup tersedia (Arahkan kursor/hover untuk melihat)"
        className="absolute -top-2 left-2 z-30 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-bold shadow-xs pointer-events-none"
      >
        <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
        <span>Screen</span>
      </div>
    );
  };

  // Single Clean Consistent Plus Action Button (Exactly 1 per node based on flowchart direction)
  const _renderConsistentPlusButtons = (): React.ReactElement => {
    const isHorizontal = flowType === 'swimlane';

    return (
      <>
        {_renderScreenBadge()}
        {!isViewOnly && !isEnd && (
          isHorizontal ? (
            <button
              type="button"
              title="Tambah langkah berikutnya ke Kanan (👉)"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddModal(node.id, 'right');
              }}
              className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center justify-center cursor-pointer hover:scale-115 transition-transform z-30"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              title="Tambah langkah berikutnya ke Bawah (👇)"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddModal(node.id, 'bottom');
              }}
              className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center justify-center cursor-pointer hover:scale-115 transition-transform z-30"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )
        )}
      </>
    );
  };

  // Professional Multi-Point Drag Resize Handles (Figma / Draw.io style)
  const _renderResizeGrip = (): React.ReactElement | null => {
    if (isViewOnly || !onStartResize) return null;

    const isHorizontal = flowType === 'swimlane';
    const showHandles = isSelected;

    return (
      <>
        {/* Live Dimension Indicator Badge when selected */}
        {isSelected && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/90 text-white text-[9.5px] font-mono font-bold rounded-md shadow-md pointer-events-none z-50 whitespace-nowrap">
            {dims.width} × {dims.height} px
          </div>
        )}

        {/* 1. Primary Bottom-Right Corner Resize Handle (Width & Height) */}
        <div
          title="Tarik sudut ini untuk ubah lebar & tinggi bebas"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStartResize(e, node.id, 'both');
          }}
          className={`absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-md cursor-se-resize hover:scale-130 transition-transform z-40 select-none interactive-control ${showHandles ? 'opacity-100 scale-100 ring-2 ring-indigo-200' : 'opacity-0 group-hover:opacity-90 scale-90'
            }`}
        />

        {/* 2. Right-Edge Center Resize Handle (Width Only) */}
        {!isHorizontal && !isDecision && (
          <div
            title="Tarik ke samping untuk ubah lebar node"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartResize(e, node.id, 'horizontal');
            }}
            className={`absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-6 bg-white border-2 border-indigo-600 rounded-full shadow-md cursor-ew-resize hover:scale-125 transition-transform z-40 select-none interactive-control ${showHandles ? 'opacity-100' : 'opacity-0 group-hover:opacity-90'
              }`}
          />
        )}

        {/* 3. Bottom-Edge Center Resize Handle (Height Only) */}
        {isHorizontal && !isDecision && (
          <div
            title="Tarik ke bawah untuk ubah tinggi node"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartResize(e, node.id, 'vertical');
            }}
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2 w-6 bg-white border-2 border-indigo-600 rounded-full shadow-md cursor-ns-resize hover:scale-125 transition-transform z-40 select-none interactive-control ${showHandles ? 'opacity-100' : 'opacity-0 group-hover:opacity-90'
              }`}
          />
        )}
      </>
    );
  };

  // Quick Node Action Buttons (Tarik Garis Hubungan + Buka Modal Edit)
  const _renderEditButton = (): React.ReactElement | null => {
    if (isViewOnly) return null;
    return (
      <div className="flex items-center gap-0.5">
        {onStartConnection && (
          <button
            type="button"
            title="Tarik Garis Penghubung (Drag or click to connect to another node)"
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartConnection(e, node.id);
            }}
            className="w-5 h-5 rounded-md hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-crosshair"
          >
            <Link2 className="w-3 h-3" />
          </button>
        )}
        <button
          type="button"
          title="Buka Modal Edit Node"
          onClick={(e) => {
            e.stopPropagation();
            onOpenEditModal(node.id);
          }}
          className="w-5 h-5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const _renderNodeShape = (): React.ReactElement => {
    // 1. Oval / Capsule for Start & End
    if (isStart || isEnd) {
      const isStartNode = isStart;
      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className={`group flex items-center justify-center px-4 rounded-full border-2 bg-white shadow-xs select-none cursor-grab active:cursor-grabbing relative ${isSelected
            ? 'border-indigo-600 ring-4 ring-indigo-100 shadow-md'
            : isStartNode
              ? 'border-emerald-500 hover:border-emerald-600'
              : 'border-rose-500 hover:border-rose-600'
            }`}
        >
          <div className="flex items-center gap-2.5 w-full py-2 justify-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${isStartNode ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
            >
              {isStartNode ? (
                <PlayCircle className="w-3.5 h-3.5 fill-white" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 fill-white" />
              )}
            </div>

            <span className="text-xs font-bold text-slate-800 truncate tracking-tight">
              {node.label}
            </span>

            <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 2. Diamond Shape for Decision Gateway (ISO 5807 Rhombus)
    if (isDecision) {
      const W = dims.width;
      const H = dims.height;
      const stroke = isSelected ? '#d97706' : '#f59e0b';
      const strokeWidth = isSelected ? 2.5 : 2;

      const isHorizontalFlow = flowType === 'swimlane';
      const defaultRightIsPositive = isHorizontalFlow;
      const rightIsPositive = node.decisionSwap ? !defaultRightIsPositive : defaultRightIsPositive;
      const bottomIsPositive = !rightIsPositive;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          {/* SVG True Diamond Rhombus */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <polygon
                points={`${W / 2},2 ${W - 2},${H / 2} ${W / 2},${H - 2} 2,${H / 2}`}
                fill="none"
                stroke="#d97706"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <polygon
              points={`${W / 2},2 ${W - 2},${H / 2} ${W / 2},${H - 2} 2,${H / 2}`}
              fill="#ffffff"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>

          {/* Diamond Content: Clean centered question text */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 text-center pointer-events-auto">
            {/* Action buttons (Swap & Edit) */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              {!isViewOnly && onToggleDecisionSwap && (
                <button
                  type="button"
                  title="Tukar Arah Cabang (Positif ⇄ Negatif)"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDecisionSwap(node.id);
                  }}
                  className="w-5 h-5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-110 active:scale-95"
                >
                  <ArrowLeftRight className="w-2.5 h-2.5" />
                </button>
              )}
              {_renderEditButton()}
            </div>

            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5 opacity-80">
              Decision
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-snug line-clamp-2 max-w-[85%]">
              {node.label}
            </span>
            {node.description ? (
              <span className="text-[10px] text-slate-500 line-clamp-1 max-w-[80%] mt-0.5">
                {node.description}
              </span>
            ) : null}
          </div>

          {/* Dynamic Branch 1: Right Port */}
          {!isViewOnly && (
            <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 flex items-center">
              <button
                type="button"
                title={
                  rightIsPositive
                    ? 'Cabang Positif / Ya (Lanjut ke Kanan)'
                    : 'Cabang Negatif / Tidak (Alternatif ke Kanan)'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAddModal(node.id, 'right', rightIsPositive ? 'Ya' : 'Tidak');
                }}
                className={`w-6 h-6 rounded-full text-white shadow-md flex items-center justify-center cursor-pointer hover:scale-115 transition-transform ${rightIsPositive
                  ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-200'
                  : 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-200'
                  }`}
              >
                {rightIsPositive ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </button>
              {/* Subtle Branch Label Badge */}
              <span
                className={`absolute left-7 px-1.5 py-0.5 rounded-full text-[9px] font-bold shadow-2xs whitespace-nowrap pointer-events-none transition-opacity ${rightIsPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border border-rose-300'
                  }`}
              >
                {rightIsPositive ? '✓ Ya' : '✕ Tidak'}
              </span>
            </div>
          )}

          {/* Dynamic Branch 2: Bottom Port */}
          {!isViewOnly && (
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
              <button
                type="button"
                title={
                  bottomIsPositive
                    ? 'Cabang Positif / Ya (Lanjut ke Bawah)'
                    : 'Cabang Negatif / Tidak (Alternatif ke Bawah)'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAddModal(node.id, 'bottom', bottomIsPositive ? 'Ya' : 'Tidak');
                }}
                className={`w-6 h-6 rounded-full text-white shadow-md flex items-center justify-center cursor-pointer hover:scale-115 transition-transform ${bottomIsPositive
                  ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-200'
                  : 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-200'
                  }`}
              >
                {bottomIsPositive ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </button>
              {/* Subtle Branch Label Badge */}
              <span
                className={`absolute top-7 px-1.5 py-0.5 rounded-full text-[9px] font-bold shadow-2xs whitespace-nowrap pointer-events-none transition-opacity ${bottomIsPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border border-rose-300'
                  }`}
              >
                {bottomIsPositive ? '✓ Ya' : '✕ Tidak'}
              </span>
            </div>
          )}

          {_renderScreenBadge()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 3. DFD Circular Process (Circle)
    if (isDfdProcess) {
      const W = dims.width;
      const H = dims.height;
      const r = Math.min(W, H) / 2 - 2;
      const cx = W / 2;
      const cy = H / 2;
      const stroke = isSelected ? '#0284c7' : '#0ea5e9';

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#0284c7"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="#f0f9ff"
              stroke={stroke}
              strokeWidth={isSelected ? 2.5 : 2}
            />
            <line
              x1={cx - r * 0.85}
              y1={cy - r * 0.25}
              x2={cx + r * 0.85}
              y2={cy - r * 0.25}
              stroke={stroke}
              strokeWidth={1.5}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center p-3 text-center pointer-events-auto">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight line-clamp-3 max-w-[85%]">
              {node.label}
            </span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 4. DFD Open Data Store
    if (isDatastore) {
      const W = dims.width;
      const H = dims.height;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <path
                d={`M ${W - 2},2 H 2 V ${H - 2} H ${W - 2}`}
                fill="none"
                stroke="#4f46e5"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <line x1={2} y1={2} x2={W - 2} y2={2} stroke="#334155" strokeWidth={2.5} />
            <line x1={2} y1={H - 2} x2={W - 2} y2={H - 2} stroke="#334155" strokeWidth={2.5} />
            <line x1={2} y1={2} x2={2} y2={H - 2} stroke="#334155" strokeWidth={2.5} />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center px-4 py-2 pointer-events-auto bg-white/90 text-center">
            <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 truncate">{node.label}</span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 5. External Entity Terminator
    if (isEntity) {
      const W = dims.width;
      const H = dims.height;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <rect
                x={2}
                y={2}
                width={W - 4}
                height={H - 4}
                rx={6}
                fill="none"
                stroke="#d97706"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <rect
              x={2}
              y={2}
              width={W - 4}
              height={H - 4}
              rx={6}
              fill="#fffbeb"
              stroke={isSelected ? '#d97706' : '#f59e0b'}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center p-3 pointer-events-auto text-center">
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 line-clamp-2 max-w-[85%]">{node.label}</span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 6. Predefined Subprocess (ISO 5807 Double Vertical Lines)
    if (isSubprocess) {
      const W = dims.width;
      const H = dims.height;
      const stroke = isSelected ? '#4f46e5' : '#818cf8';
      const strokeWidth = isSelected ? 2.5 : 2;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <rect
                x={2}
                y={2}
                width={W - 4}
                height={H - 4}
                rx={4}
                fill="none"
                stroke="#4f46e5"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <rect
              x={2}
              y={2}
              width={W - 4}
              height={H - 4}
              rx={4}
              fill="#ffffff"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            {/* Double vertical inner bars */}
            <line
              x1={16}
              y1={2}
              x2={16}
              y2={H - 2}
              stroke={stroke}
              strokeWidth={2}
            />
            <line
              x1={W - 16}
              y1={2}
              x2={W - 16}
              y2={H - 2}
              stroke={stroke}
              strokeWidth={2}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center p-3 px-6 pointer-events-auto text-center">
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 leading-snug line-clamp-3 max-w-[85%]">
              {node.label}
            </span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 7. Delay / Wait State (ISO 5807 D-shape)
    if (isDelay) {
      const W = dims.width;
      const H = dims.height;
      const r = H / 2 - 2;
      const pathD = `M 2,2 H ${W - r} A ${r} ${r} 0 0,1 ${W - r},${H - 2} H 2 Z`;
      const stroke = isSelected ? '#d97706' : '#fbbf24';
      const strokeWidth = isSelected ? 2.5 : 2;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <path
                d={pathD}
                fill="none"
                stroke="#d97706"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <path
              d={pathD}
              fill="#ffffff"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center pl-3 pr-6 py-2 pointer-events-auto text-center">
            <div className="absolute top-1.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 leading-snug line-clamp-3 max-w-[85%]">
              {node.label}
            </span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 8. Quality Inspection QC (ISO Hexagon)
    if (isInspection) {
      const W = dims.width;
      const H = dims.height;
      const chamfer = 20;
      const points = `${chamfer},2 ${W - chamfer},2 ${W - 2},${H / 2} ${W - chamfer},${H - 2} ${chamfer},${H - 2} 2,${H / 2}`;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <polygon
                points={points}
                fill="none"
                stroke="#059669"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <polygon
              points={points}
              fill="#ffffff"
              stroke={isSelected ? '#059669' : '#34d399'}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center p-3 px-6 pointer-events-auto text-center">
            <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 leading-snug line-clamp-3 max-w-[85%]">
              {node.label}
            </span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 9. Document & Multi-Document (ISO 5807 Wavy Bottom)
    if (isDocument || isMultiDocument) {
      const W = dims.width;
      const H = dims.height;
      const waveH = 14;
      const pathD = `
      M 2,2
      H ${W - 2}
      V ${H - waveH}
      C ${W * 0.7},${H - waveH - 12} ${W * 0.3},${H + 2} 2,${H - waveH}
      Z
    `;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {/* Back document sheet for multi-document */}
            {isMultiDocument && (
              <path
                d={`
                M 8,-4
                H ${W + 4}
                V ${H - waveH - 6}
                C ${W * 0.7 + 6},${H - waveH - 18} ${W * 0.3 + 6},${H - 4} 8,${H - waveH - 6}
                Z
              `}
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth={1.5}
              />
            )}

            {isSelected && (
              <path
                d={pathD}
                fill="none"
                stroke="#4f46e5"
                strokeWidth={8}
                opacity={0.2}
              />
            )}

            <path
              d={pathD}
              fill="#ffffff"
              stroke={isSelected ? '#4f46e5' : '#94a3b8'}
              strokeWidth={isSelected ? 2.5 : 2}
            />

            {/* Decorative folded corner */}
            <path
              d={`M ${W - 14},2 V 12 H ${W - 2} Z`}
              fill="#f8fafc"
              stroke={isSelected ? '#4f46e5' : '#94a3b8'}
              strokeWidth={1}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center p-3.5 pb-6 pointer-events-auto text-center">
            <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 leading-snug line-clamp-3 max-w-[88%]">
              {node.label}
            </span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 10. Manual Input / Output (ISO 5807 Parallelogram)
    if (isIO) {
      const W = dims.width;
      const H = dims.height;
      const S = 22; // slant offset
      const points = `${S},2 ${W - 2},2 ${W - S},${H - 2} 2,${H - 2}`;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {isSelected && (
              <polygon
                points={points}
                fill="none"
                stroke="#7c3aed"
                strokeWidth={8}
                opacity={0.2}
              />
            )}
            <polygon
              points={points}
              fill="#ffffff"
              stroke={isSelected ? '#7c3aed' : '#a78bfa'}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center py-2.5 px-7 pointer-events-auto text-center">
            <div className="absolute top-1.5 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 leading-snug line-clamp-3 max-w-[85%]">
              {node.label}
            </span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 11. Database Storage (ISO 5807 3D Cylinder)
    if (isDatabase) {
      const W = dims.width;
      const H = dims.height;
      const ry = Math.min(16, Math.max(11, H * 0.14));
      const stroke = isSelected ? '#0891b2' : '#22d3ee';
      const strokeWidth = isSelected ? 2.5 : 2;

      return (
        <div
          id={node.id}
          data-node-id={node.id}
          onMouseDown={_handleMouseDown}
          onClick={_handleClick}
          onDoubleClick={_handleDoubleClick}
          onMouseUp={_handleMouseUp}
          style={nodePositionStyle}
          className="group select-none cursor-grab active:cursor-grabbing relative"
        >
          {/* SVG Cylinder Database */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
          >
            {/* Selection Halo */}
            {isSelected && (
              <>
                <path
                  d={`M 2,${ry + 2} V ${H - ry - 2} A ${W / 2 - 2} ${ry} 0 0,0 ${W - 2},${H - ry - 2} V ${ry + 2} Z`}
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth={8}
                  opacity={0.2}
                />
                <ellipse
                  cx={W / 2}
                  cy={ry + 2}
                  rx={W / 2 - 2}
                  ry={ry}
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth={8}
                  opacity={0.2}
                />
              </>
            )}

            {/* Cylinder White Body */}
            <path
              d={`
              M 2,${ry + 2}
              V ${H - ry - 2}
              A ${W / 2 - 2} ${ry} 0 0,0 ${W - 2},${H - ry - 2}
              V ${ry + 2}
              Z
            `}
              fill="#ffffff"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />

            {/* Middle Platter Disk Line */}
            <path
              d={`
              M 2,${Math.round(H * 0.48)}
              A ${W / 2 - 2} ${ry} 0 0,0 ${W - 2},${Math.round(H * 0.48)}
            `}
              fill="none"
              stroke={stroke}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={0.6}
            />

            {/* Bottom Arc Lip */}
            <path
              d={`
              M 2,${H - ry - 2}
              A ${W / 2 - 2} ${ry} 0 0,0 ${W - 2},${H - ry - 2}
            `}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />

            {/* Top Ellipse Cap */}
            <ellipse
              cx={W / 2}
              cy={ry + 2}
              rx={W / 2 - 2}
              ry={ry}
              fill="#ecfeff"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>

          {/* Database Content: Clean centered label */}
          <div className="relative z-10 w-full h-full flex items-center justify-center px-4 pointer-events-auto text-center">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {_renderEditButton()}
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-snug line-clamp-3 max-w-[85%]">
              {node.label}
            </span>
          </div>

          {_renderConsistentPlusButtons()}
          {_renderResizeGrip()}
        </div>
      );
    }

    // 12. Default: Process Task Box (Rectangle)
    return (
      <div
        id={node.id}
        data-node-id={node.id}
        onMouseDown={_handleMouseDown}
        onClick={_handleClick}
        onDoubleClick={_handleDoubleClick}
        onMouseUp={_handleMouseUp}
        style={nodePositionStyle}
        className={`group rounded-lg border-2 bg-white shadow-xs select-none cursor-grab active:cursor-grabbing relative flex items-center justify-center p-3 text-center ${isSelected ? `${theme.border} ring-4 ring-indigo-100 shadow-md` : `${theme.border} hover:shadow-md`
          }`}
      >
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {_renderEditButton()}
        </div>

        <span className="text-xs font-bold text-slate-800 tracking-tight leading-snug line-clamp-3 max-w-[90%]">
          {node.label}
        </span>

        {_renderConsistentPlusButtons()}
        {_renderResizeGrip()}
      </div>
    );
  };

  const element = _renderNodeShape() as React.ReactElement<React.HTMLAttributes<HTMLDivElement>>;
  const runnerGlowClass = isRunnerActive
    ? 'ring-4 ring-indigo-500 ring-offset-2 animate-pulse scale-105 z-30 shadow-2xl'
    : '';

  return React.cloneElement(element, {
    onMouseEnter: () => onMouseEnter?.(node.id),
    onMouseLeave,
    className: `${element.props.className || ''} ${runnerGlowClass}`.trim(),
  });
};

const GROUP_FRAME_THEMES: Record<
  NodeColorTheme,
  {
    bg: string;
    border: string;
    selectedBorder: string;
    tagBg: string;
    tagText: string;
    badgeBg: string;
  }
> = {
  indigo: {
    bg: 'bg-indigo-50/40',
    border: 'border-indigo-300',
    selectedBorder: 'border-indigo-600 ring-2 ring-indigo-400/30 shadow-md',
    tagBg: 'bg-indigo-600',
    tagText: 'text-white',
    badgeBg: 'bg-indigo-700/80',
  },
  emerald: {
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-300',
    selectedBorder: 'border-emerald-600 ring-2 ring-emerald-400/30 shadow-md',
    tagBg: 'bg-emerald-600',
    tagText: 'text-white',
    badgeBg: 'bg-emerald-700/80',
  },
  amber: {
    bg: 'bg-amber-50/40',
    border: 'border-amber-300',
    selectedBorder: 'border-amber-600 ring-2 ring-amber-400/30 shadow-md',
    tagBg: 'bg-amber-600',
    tagText: 'text-white',
    badgeBg: 'bg-amber-700/80',
  },
  rose: {
    bg: 'bg-rose-50/40',
    border: 'border-rose-300',
    selectedBorder: 'border-rose-600 ring-2 ring-rose-400/30 shadow-md',
    tagBg: 'bg-rose-600',
    tagText: 'text-white',
    badgeBg: 'bg-rose-700/80',
  },
  cyan: {
    bg: 'bg-cyan-50/40',
    border: 'border-cyan-300',
    selectedBorder: 'border-cyan-600 ring-2 ring-cyan-400/30 shadow-md',
    tagBg: 'bg-cyan-600',
    tagText: 'text-white',
    badgeBg: 'bg-cyan-700/80',
  },
  violet: {
    bg: 'bg-violet-50/40',
    border: 'border-violet-300',
    selectedBorder: 'border-violet-600 ring-2 ring-violet-400/30 shadow-md',
    tagBg: 'bg-violet-600',
    tagText: 'text-white',
    badgeBg: 'bg-violet-700/80',
  },
  slate: {
    bg: 'bg-slate-100/50',
    border: 'border-slate-300',
    selectedBorder: 'border-slate-600 ring-2 ring-slate-400/30 shadow-md',
    tagBg: 'bg-slate-700',
    tagText: 'text-white',
    badgeBg: 'bg-slate-800/80',
  },
};

const COLOR_CYCLES: NodeColorTheme[] = [
  'indigo',
  'emerald',
  'amber',
  'rose',
  'cyan',
  'violet',
  'slate',
];

/**
 * Render visual group frames (boundary boxes to group multiple nodes with titles & colors)
 */
const _renderGroupFrames = (
  groups: FlowGroupFrame[],
  nodes: FlowNode[],
  selectedGroupId: string | null,
  onSelectGroup: (groupId: string) => void,
  onUpdateGroupTitle: (groupId: string, title: string) => void,
  onUpdateGroupColor: (groupId: string, color: NodeColorTheme) => void,
  onDeleteGroupFrame: (groupId: string) => void,
  onStartGroupDrag: (event: React.MouseEvent, groupId: string) => void,
  onStartGroupResize: (event: React.MouseEvent, groupId: string, mode?: 'both' | 'horizontal' | 'vertical') => void,
): React.ReactElement => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {groups.map((group) => {
        const theme = GROUP_FRAME_THEMES[group.colorTheme || 'indigo'] || GROUP_FRAME_THEMES.indigo;
        const isSelected = selectedGroupId === group.id;

        // Count nodes situated within or intersecting this frame
        const insideCount = nodes.filter((n) => {
          const dims = _getNodeDimensions(n);
          const cx = n.position.x + dims.width / 2;
          const cy = n.position.y + dims.height / 2;
          const centerInside =
            cx >= group.position.x &&
            cx <= group.position.x + group.width &&
            cy >= group.position.y &&
            cy <= group.position.y + group.height;
          const overlaps =
            n.position.x < group.position.x + group.width &&
            n.position.x + dims.width > group.position.x &&
            n.position.y < group.position.y + group.height &&
            n.position.y + dims.height > group.position.y;
          return centerInside || overlaps;
        }).length;

        return (
          <div
            key={group.id}
            data-group-id={group.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectGroup(group.id);
            }}
            onMouseDown={(e) => onStartGroupDrag(e, group.id)}
            title="Klik & Tarik Frame ini untuk memindahkan semua node di dalamnya sekaligus"
            className={`absolute pointer-events-auto rounded-2xl border-2 border-dashed cursor-grab active:cursor-grabbing select-none group/frame transition-[border-color,background-color] duration-150 ${theme.bg
              } ${isSelected ? theme.selectedBorder : theme.border}`}
            style={{
              left: `${group.position.x}px`,
              top: `${group.position.y}px`,
              width: `${group.width}px`,
              height: `${group.height}px`,
            }}
          >
            {/* Header Tag / Drag Handle */}
            <div
              onMouseDown={(e) => onStartGroupDrag(e, group.id)}
              className={`absolute -top-8 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-xs font-semibold shadow-md cursor-grab active:cursor-grabbing select-none transition-transform hover:-translate-y-0.5 z-30 ${theme.tagBg} ${theme.tagText}`}
            >
              <GripHorizontal className="w-4 h-4 opacity-90 shrink-0" />

              {/* Inline Editable Title */}
              <input
                type="text"
                value={group.title}
                onChange={(e) => onUpdateGroupTitle(group.id, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-b border-transparent hover:border-white/40 focus:border-white focus:bg-white/10 outline-none px-1 text-xs font-bold text-white rounded-xs w-28 sm:w-36 truncate transition-colors"
                placeholder="Nama Group Frame..."
              />

              {/* Node Count Pill with Move icon */}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${theme.badgeBg}`}
                title={`${insideCount} node berada di dalam frame ini. Tarik frame untuk memindahkan seluruh grup sekaligus.`}
              >
                <Move className="w-2.5 h-2.5" />
                {insideCount} node
              </span>

              {/* Cycle Color Button */}
              <button
                type="button"
                title="Ganti warna Frame"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = COLOR_CYCLES.indexOf(group.colorTheme || 'indigo');
                  const nextTheme = COLOR_CYCLES[(currentIdx + 1) % COLOR_CYCLES.length];
                  onUpdateGroupColor(group.id, nextTheme);
                }}
                className="w-4 h-4 rounded hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer ml-0.5"
              >
                <Palette className="w-2.5 h-2.5" />
              </button>

              {/* Delete Frame Button */}
              <button
                type="button"
                title="Hapus Frame Group (Node tidak ikut terhapus)"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroupFrame(group.id);
                }}
                className="w-4 h-4 rounded hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Quick Move Visual Hint inside frame */}
            {insideCount > 0 ? (
              <></>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 text-xs font-medium text-slate-500">
                <span>Geser node ke dalam frame ini untuk grouping</span>
              </div>
            )}

            {/* Resize Handle: Bottom-Right Corner */}
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                onStartGroupResize(e, group.id, 'both');
              }}
              title="Tarik untuk perbesar / perkecil Frame"
              className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-slate-400 hover:border-indigo-600 hover:bg-indigo-50 rounded-md shadow-xs flex items-center justify-center cursor-nwse-resize z-20 group-hover/frame:opacity-100 transition-opacity"
            >
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-xs" />
            </div>

            {/* Resize Handle: Right Edge */}
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                onStartGroupResize(e, group.id, 'horizontal');
              }}
              title="Tarik lebar Frame"
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 bg-white border-2 border-slate-300 hover:border-indigo-600 rounded-sm shadow-2xs cursor-ew-resize z-20 opacity-0 group-hover/frame:opacity-100 transition-opacity"
            />

            {/* Resize Handle: Bottom Edge */}
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                onStartGroupResize(e, group.id, 'vertical');
              }}
              title="Tarik tinggi Frame"
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border-2 border-slate-300 hover:border-indigo-600 rounded-sm shadow-2xs cursor-ns-resize z-20 opacity-0 group-hover/frame:opacity-100 transition-opacity"
            />
          </div>
        );
      })}
    </div>
  );
};

/**
 * Render interactive Minimap component
 * Scaled overview of all nodes, swimlanes, and camera viewport rectangle
 */
const _renderMinimap = (
  nodes: FlowNode[],
  transform: CanvasTransform,
  activeTab: FlowProjectTab,
  isOpen: boolean,
  onToggle: () => void,
  onPanToPoint: (canvasX: number, canvasY: number) => void,
  groups?: FlowGroupFrame[],
): React.ReactElement => {
  if (!isOpen) {
    return (
      <div className="absolute bottom-6 right-6 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={onToggle}
          title="Buka Minimap"
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md hover:shadow-lg text-slate-700 hover:text-indigo-600 text-xs font-semibold transition-all cursor-pointer"
        >
          <Map className="w-4 h-4 text-indigo-600" />
          <span>Minimap</span>
        </button>
      </div>
    );
  }

  // Calculate bounding box of diagram content
  let minX = 0;
  let minY = 0;
  let maxX = 1200;
  let maxY = 800;

  if (activeTab.type === 'swimlane') {
    const tableW = activeTab.tableWidth || 1400;
    const totalH = (activeTab.swimlanes || []).reduce((acc, l) => acc + (l.height || 180), 0) + 60;
    minX = Math.min(minX, 60);
    minY = Math.min(minY, 40);
    maxX = Math.max(maxX, 60 + tableW);
    maxY = Math.max(maxY, 40 + totalH);
  }

  (groups || []).forEach((g) => {
    minX = Math.min(minX, g.position.x);
    minY = Math.min(minY, g.position.y);
    maxX = Math.max(maxX, g.position.x + g.width);
    maxY = Math.max(maxY, g.position.y + g.height);
  });

  nodes.forEach((n) => {
    const dims = _getNodeDimensions(n);
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + dims.width);
    maxY = Math.max(maxY, n.position.y + dims.height);
  });

  // Current camera viewport in canvas coordinates
  const viewportW = 1200 / (transform.scale || 1);
  const viewportH = 800 / (transform.scale || 1);
  const viewLeft = -transform.x / (transform.scale || 1);
  const viewTop = -transform.y / (transform.scale || 1);
  const viewRight = viewLeft + viewportW;
  const viewBottom = viewTop + viewportH;

  minX = Math.min(minX, viewLeft);
  minY = Math.min(minY, viewTop);
  maxX = Math.max(maxX, viewRight);
  maxY = Math.max(maxY, viewBottom);

  const padding = 120;
  const bboxX = minX - padding;
  const bboxY = minY - padding;
  const bboxW = Math.max(600, maxX - minX + padding * 2);
  const bboxH = Math.max(400, maxY - minY + padding * 2);

  const minimapWidth = 230;
  const minimapHeight = 145;

  const handleMinimapClick = (e: React.MouseEvent<SVGSVGElement>): void => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetCanvasX = bboxX + (clickX / minimapWidth) * bboxW;
    const targetCanvasY = bboxY + (clickY / minimapHeight) * bboxH;
    onPanToPoint(targetCanvasX, targetCanvasY);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute bottom-6 right-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col w-[230px] pointer-events-auto"
    >
      {/* Minimap Header */}
      <div className="px-3 py-1.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-700">
        <div className="flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-indigo-600" />
          <span>Minimap</span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          title="Tutup Minimap"
          className="w-5 h-5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Minimap SVG Canvas */}
      <div className="relative bg-slate-50 cursor-crosshair">
        <svg
          width={minimapWidth}
          height={minimapHeight}
          viewBox={`${bboxX} ${bboxY} ${bboxW} ${bboxH}`}
          onClick={handleMinimapClick}
          className="block"
        >
          <rect
            x={bboxX}
            y={bboxY}
            width={bboxW}
            height={bboxH}
            fill="#f8fafc"
          />

          {activeTab.type === 'swimlane' && (
            <rect
              x={60}
              y={40}
              width={activeTab.tableWidth || 1400}
              height={
                (activeTab.swimlanes || []).reduce((acc, l) => acc + (l.height || 180), 0) + 60
              }
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth={3}
              rx={8}
            />
          )}

          {(groups || []).map((group) => (
            <rect
              key={group.id}
              x={group.position.x}
              y={group.position.y}
              width={group.width}
              height={group.height}
              fill="rgba(99, 102, 241, 0.06)"
              stroke="#818cf8"
              strokeWidth={2}
              strokeDasharray="4 2"
              rx={6}
            />
          ))}

          {nodes.map((node) => {
            const dims = _getNodeDimensions(node);
            const fill =
              node.type === 'start'
                ? '#10b981'
                : node.type === 'end'
                  ? '#ef4444'
                  : node.type === 'database'
                    ? '#06b6d4'
                    : node.type === 'decision'
                      ? '#f59e0b'
                      : node.type === 'inspection'
                        ? '#10b981'
                        : node.type === 'inputOutput'
                          ? '#8b5cf6'
                          : '#6366f1';

            return (
              <rect
                key={node.id}
                x={node.position.x}
                y={node.position.y}
                width={dims.width}
                height={dims.height}
                rx={node.type === 'start' || node.type === 'end' ? dims.height / 2 : 6}
                fill={fill}
                opacity={0.85}
              />
            );
          })}

          {/* Camera Viewport Indicator */}
          <rect
            x={viewLeft}
            y={viewTop}
            width={viewportW}
            height={viewportH}
            fill="rgba(99, 102, 241, 0.14)"
            stroke="#4f46e5"
            strokeWidth={Math.max(2, bboxW / 120)}
            strokeDasharray="4 2"
            rx={4}
          />
        </svg>
      </div>
      <div className="px-2 py-1 bg-slate-50/70 border-t border-slate-100 text-[9.5px] text-slate-400 text-center font-mono">
        Klik minimap untuk navigasi
      </div>
    </div>
  );
};

/**
 * Main Pure Component for Flowchart & BPMN Generator
 * Strictly zero useState and zero lifecycles (all managed by custom hook)
 */
export const ErpFlowGenComponent = (props: ErpFlowGenComponentProps): React.ReactElement => {
  const {
    tabs,
    activeTabId,
    activeTab,
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    transform,
    connectingState,
    isHelpModalOpen,
    isExportingPng,
    showGhostSkeleton,
    addNodeModal,
    editNodeModal,
    createProjectModal,
    onSelectTab,
    onAddTabClick,
    onCloneTab,
    onCloseTab,
    editingTabState,
    onStartRenameTab,
    onUpdateEditingTabTitle,
    onSaveTabTitle,
    onCancelRenameTab,
    onConfirmCreateProject,
    onCloseCreateProjectModal,
    onUpdateCreateProjectField,
    onOpenAddNodeModal,
    onCloseAddNodeModal,
    onUpdateAddNodeField,
    onSubmitAddNode,
    onOpenEditNodeModal,
    onCloseEditNodeModal,
    onUpdateEditNodeField,
    onSaveEditNode,
    onDeleteNodeFromModal,
    onToggleGhostSkeleton,
    onSelectNode,
    onDeselectAll,
    onStartNodeDrag,
    onStartNodeResize,
    onStartConnection,
    onCompleteConnection,
    onCanvasMouseDown,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onExportPng,
    onExportJson,
    onImportJsonClick,
    onFileInputChange,
    onLoadTemplate,
    onClearCanvas,
    onToggleHelpModal,
    onAddSwimlane,
    onDeleteSwimlane,
    onUpdateTableWidth,
    onStartTableResize,
    onStartLaneResize,
    onUpdateLaneHeight,
    isMinimapOpen,
    onToggleMinimap,
    isFarFromStart,
    onFocusStart,
    onPanToPoint,
    groups,
    selectedGroupId,
    onSelectGroup,
    onAddGroupFrame,
    onUpdateGroupTitle,
    onUpdateGroupColor,
    onDeleteGroupFrame,
    onStartGroupDrag,
    onStartGroupResize,
    onToggleDecisionSwap,
    aiSettingsModal,
    projectScanModal,
    onOpenAiSettings,
    onCloseAiSettings,
    onUpdateAiSettingsField,
    onTestAiConnection,
    onOpenProjectFolder,
    onCloseProjectScanModal,
    onGenerateFlowFromProject,
    folderInputRef,
    onFolderInputChange,
    canvasRef,
    fileInputRef,
    mainContainerRef,
    isViewOnly,
    onToggleViewOnly,
    shareModal,
    onOpenShareModal,
    onCloseShareModal,
    onCopyShareLink,
    hoveredNodeId,
    onNodeMouseEnter,
    onNodeMouseLeave,
    flowRunner,
    onToggleRunFlow,
    onNextFlowStep,
    onPrevFlowStep,
    onStopFlow,
    onUploadMockupImage,
    onClearMockupImage,
    kanbanTaskModal,
    kanbanSearchQuery,
    kanbanPriorityFilter,
    kanbanLinkFilter,
    onSetKanbanSearchQuery,
    onSetKanbanPriorityFilter,
    onSetKanbanLinkFilter,
    onOpenCreateKanbanTask,
    onOpenEditKanbanTask,
    onCloseKanbanTaskModal,
    onUpdateKanbanTaskField,
    onSaveKanbanTask,
    onDeleteKanbanTask,
    onMoveKanbanTaskStatus,
    onJumpToLinkedWorkflow,
  } = props;

  const currentSkeleton = SKELETON_TEMPLATES[activeTab.type];

  // Filtered shape options in modal
  const filteredShapes = addNodeModal.shapeCategoryFilter === 'Semua'
    ? FLOW_NODE_TYPE_OPTIONS
    : FLOW_NODE_TYPE_OPTIONS.filter((s) => s.category === addNodeModal.shapeCategoryFilter);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans select-none">
      {/* 1. Chrome-Style Top Tab Bar */}
      <div className="bg-slate-200/90 pt-2 px-3 border-b border-slate-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[80vw]">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isEditing = editingTabState.tabId === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onStartRenameTab(tab.id, tab.title);
                }}
                className={`group/tab flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold cursor-pointer transition-all border-t border-x ${isActive
                  ? 'bg-white text-indigo-900 border-slate-300 shadow-xs translate-y-[1px]'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-transparent'
                  }`}
              >
                {_renderShapeIcon(
                  tab.type === 'swimlane'
                    ? 'Columns'
                    : tab.type === 'algorithm'
                      ? 'SquareCode'
                      : tab.type === 'dfd'
                        ? 'Database'
                        : tab.type === 'kanban'
                          ? 'LayoutDashboard'
                          : 'Workflow',
                  'w-3.5 h-3.5 text-indigo-600 shrink-0',
                )}

                {isEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={editingTabState.title}
                    onChange={(e) => onUpdateEditingTabTitle(e.target.value)}
                    onBlur={() => onSaveTabTitle(tab.id)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onSaveTabTitle(tab.id);
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        onCancelRenameTab();
                      }
                    }}
                    className="px-1.5 py-0.5 text-xs font-semibold bg-white border-2 border-indigo-500 rounded-md outline-none text-slate-900 shadow-xs max-w-[150px] min-w-[80px]"
                  />
                ) : (
                  <div className="flex items-center gap-1.5 max-w-[160px]">
                    <span
                      title="Klik 2x untuk ganti nama tab"
                      className="truncate"
                    >
                      {tab.title}
                    </span>
                    <button
                      type="button"
                      title="Ganti nama tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartRenameTab(tab.id, tab.title);
                      }}
                      className="w-4 h-4 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200 flex items-center justify-center opacity-0 group-hover/tab:opacity-100 transition-opacity"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      title="Clone / Duplikat tab ini"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneTab(tab.id);
                      }}
                      className="w-4 h-4 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-200 flex items-center justify-center opacity-0 group-hover/tab:opacity-100 transition-opacity"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}

                <span className="text-[9.5px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
                  {tab.type}
                </span>

                <button
                  type="button"
                  title="Tutup tab"
                  onClick={(e) => onCloseTab(tab.id, e)}
                  className="w-4 h-4 rounded-full hover:bg-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <button
            type="button"
            title="Tambah Project / Flowchart Baru (+)"
            onClick={onAddTabClick}
            className="w-7 h-7 rounded-full bg-slate-300/80 hover:bg-white text-slate-700 flex items-center justify-center transition-all ml-1.5 cursor-pointer shadow-xs hover:shadow"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            title={`Clone / Duplikat Tab Aktif ("${activeTab.title}")`}
            onClick={() => onCloneTab(activeTab.id)}
            className="h-7 px-2.5 rounded-full bg-slate-300/80 hover:bg-white text-slate-700 flex items-center gap-1.5 text-xs font-semibold transition-all ml-1 cursor-pointer shadow-xs hover:shadow hover:text-emerald-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clone Tab</span>
          </button>
        </div>

        {/* Global Blueprint Skeleton Toggle */}
        <div className="flex items-center gap-2 pb-1.5">
          <button
            type="button"
            onClick={onToggleGhostSkeleton}
            title="Toggle Ghost Blueprint Guide"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${showGhostSkeleton
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-300'
              }`}
          >
            {showGhostSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Blueprint Template</span>
          </button>
        </div>
      </div>

      {/* 2. Secondary Application Header Bar */}
      <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              LF
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 leading-none flex items-center gap-1.5">
                <span>{activeTab.title}</span>
                <button
                  type="button"
                  title="Ganti nama project / tab ini"
                  onClick={() => onStartRenameTab(activeTab.id, activeTab.title)}
                  className="w-4 h-4 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Clone / Duplikat tab aktif ini"
                  onClick={() => onCloneTab(activeTab.id)}
                  className="w-4 h-4 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {activeTab.type.toUpperCase()} • {nodes.length} langkah • {edges.length} konektor
              </div>
            </div>
          </div>

          {/* Mode View-Only Indicator & Quick Toggle */}
          {isViewOnly ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold shadow-2xs">
              <Lock className="w-3 h-3 text-purple-600" />
              <span>View-Only</span>
              <button
                type="button"
                onClick={onToggleViewOnly}
                className="text-[10.5px] text-purple-700 hover:text-purple-950 font-bold underline ml-1 cursor-pointer"
                title="Beralih ke mode Editor"
              >
                Edit Mode
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onToggleViewOnly}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 transition-all cursor-pointer"
              title="Pratinjau tampilan mode View-Only (tanpa editing)"
            >
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>Preview View-Only</span>
            </button>
          )}
        </div>

        {/* Zoom & View Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={onZoomOut}
              title="Perkecil Kanvas"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              onClick={onResetZoom}
              title="Reset Zoom ke 100%"
              className="text-[11px] font-mono px-2 text-slate-600 cursor-pointer hover:text-indigo-600 font-semibold"
            >
              {Math.round(transform.scale * 100)}%
            </span>
            <button
              type="button"
              onClick={onZoomIn}
              title="Perbesar Kanvas"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fokus ke Start Node Button */}
          <button
            type="button"
            onClick={onFocusStart}
            title="Auto Focus ke Node Start"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Fokus Start</span>
          </button>

          {/* Tambah Group Frame Button */}
          <button
            type="button"
            onClick={onAddGroupFrame}
            title="Kelompokkan Node ke dalam Frame (Group Box)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Frame Group</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Buka Folder Project (Hermes AI) */}
          <button
            type="button"
            onClick={onOpenProjectFolder}
            title="Buka Folder Project Codingan & Generate Flowchart Multi-Tab dengan Hermes AI"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            <FolderCode className="w-3.5 h-3.5 text-indigo-200" />
            <span>Open Project (Hermes AI)</span>
          </button>

          {/* Hermes AI Connection Settings */}
          <button
            type="button"
            onClick={onOpenAiSettings}
            title="Pengaturan Koneksi Hermes AI (OpenRouter / Custom Endpoint)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden xl:inline">Hermes AI</span>
          </button>

          {/* Hidden File System input for fallback folder selection */}
          <input
            ref={folderInputRef}
            type="file"
            // @ts-expect-error webkitdirectory is standard for folder picking
            webkitdirectory=""
            directory=""
            multiple
            onChange={onFolderInputChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={onLoadTemplate}
            title="Reset ke template awal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onClearCanvas}
            title="Kosongkan alur di kanvas"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={onImportJsonClick}
            title="Import diagram JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={onExportJson}
            title="Download JSON file"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </button>

          {/* Quick Jira Kanban Board Tab Shortcut */}
          <button
            type="button"
            title="Buka / Buat Jira Task Board"
            onClick={() => {
              const kanbanTab = tabs.find((t) => t.type === 'kanban');
              if (kanbanTab) {
                onSelectTab(kanbanTab.id);
              } else {
                onOpenCreateKanbanTask('todo');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${activeTab.type === 'kanban'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Task Board (Jira)</span>
          </button>

          <button
            type="button"
            onClick={onExportPng}
            disabled={isExportingPng}
            title="Export ke gambar PNG"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isExportingPng ? 'Rendering...' : 'Export PNG'}</span>
          </button>

          {/* Share View-Only Link Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            title="Bagikan Flowchart ini (Mode View-Only)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Share Link</span>
          </button>

          <button
            type="button"
            onClick={onToggleHelpModal}
            title="Bantuan & Petunjuk"
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Jira / Kanban Board View */}
      {(() => {
        const _renderKanbanBoard = (): React.ReactElement => {
          const tasks = activeTab.kanbanTasks || [];

          const filteredTasks = tasks.filter((task) => {
            if (kanbanSearchQuery.trim()) {
              const q = kanbanSearchQuery.toLowerCase();
              const matchesKey = task.key.toLowerCase().includes(q);
              const matchesTitle = task.title.toLowerCase().includes(q);
              const matchesDesc = task.description.toLowerCase().includes(q);
              const matchesAssignee = task.assignee?.toLowerCase().includes(q) ?? false;
              const matchesNode =
                (task.linkedSourceNodeLabel?.toLowerCase().includes(q) ?? false) ||
                (task.linkedTargetNodeLabel?.toLowerCase().includes(q) ?? false);
              if (!matchesKey && !matchesTitle && !matchesDesc && !matchesAssignee && !matchesNode) {
                return false;
              }
            }

            if (kanbanPriorityFilter !== 'all' && task.priority !== kanbanPriorityFilter) {
              return false;
            }

            if (kanbanLinkFilter && !task.linkedSourceNodeId) {
              return false;
            }

            return true;
          });

          const columns: {
            id: KanbanTaskStatus;
            title: string;
            bgBadge: string;
            dotColor: string;
          }[] = [
              {
                id: 'todo',
                title: 'TO DO / BACKLOG',
                bgBadge: 'bg-slate-200 text-slate-800',
                dotColor: 'bg-slate-400',
              },
              {
                id: 'in_progress',
                title: 'IN PROGRESS',
                bgBadge: 'bg-indigo-100 text-indigo-800',
                dotColor: 'bg-indigo-500',
              },
              {
                id: 'review',
                title: 'IN REVIEW / TESTING',
                bgBadge: 'bg-amber-100 text-amber-800',
                dotColor: 'bg-amber-500',
              },
              {
                id: 'done',
                title: 'DONE',
                bgBadge: 'bg-emerald-100 text-emerald-800',
                dotColor: 'bg-emerald-500',
              },
            ];

          const doneCount = tasks.filter((t) => t.status === 'done').length;
          const progressPercent = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

          return (
            <main className="flex-1 overflow-y-auto bg-slate-100/70 p-6 flex flex-col gap-6 select-text">
              {/* Kanban Board Top Control Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Jira Agile Board
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {tasks.length} Tiket ({doneCount} Selesai • {progressPercent}%)
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">
                      {activeTab.title}
                    </h2>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari tiket, key, atau node..."
                      value={kanbanSearchQuery}
                      onChange={(e) => onSetKanbanSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-56 transition-all"
                    />
                  </div>

                  <select
                    value={kanbanPriorityFilter}
                    onChange={(e) => onSetKanbanPriorityFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">Semua Prioritas</option>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onSetKanbanLinkFilter(!kanbanLinkFilter)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${kanbanLinkFilter
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    <span>Hanya yang Terkoneksi Node</span>
                  </button>

                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => onOpenCreateKanbanTask('todo')}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer hover:scale-102 transition-all active:scale-98"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Buat Tiket Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Columns */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start min-h-[500px]">
                {columns.map((col) => {
                  const colTasks = filteredTasks.filter((t) => t.status === col.id);

                  return (
                    <div
                      key={col.id}
                      className="flex flex-col bg-slate-200/50 rounded-2xl border border-slate-200/80 p-3 h-full min-h-[450px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                          <span className="text-xs font-bold tracking-tight text-slate-800">
                            {col.title}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${col.bgBadge}`}>
                            {colTasks.length}
                          </span>
                        </div>

                        {!isViewOnly && (
                          <button
                            type="button"
                            title={`Tambah tiket ke ${col.title}`}
                            onClick={() => onOpenCreateKanbanTask(col.id)}
                            className="w-6 h-6 rounded-lg hover:bg-slate-300/60 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Column Cards Container */}
                      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-0.5">
                        {colTasks.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                            <ListTodo className="w-6 h-6 text-slate-300 mb-1" />
                            <span className="text-xs font-medium text-slate-400">
                              Tidak ada tiket
                            </span>
                          </div>
                        ) : (
                          colTasks.map((task) => {
                            const priorityColor =
                              task.priority === 'urgent'
                                ? 'bg-rose-100 text-rose-700 border-rose-200'
                                : task.priority === 'high'
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : task.priority === 'medium'
                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200';

                            const hasLink = Boolean(task.linkedSourceNodeId || task.linkedWorkflowTabTitle);

                            return (
                              <div
                                key={task.id}
                                className="group bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5"
                              >
                                {/* Card Top Row: Key & Priority */}
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                                    {task.key}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${priorityColor}`}>
                                      {task.priority.toUpperCase()}
                                    </span>

                                    {!isViewOnly && (
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        <button
                                          type="button"
                                          title="Edit Tiket"
                                          onClick={() => onOpenEditKanbanTask(task.id)}
                                          className="w-5 h-5 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center cursor-pointer"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Hapus Tiket"
                                          onClick={() => onDeleteKanbanTask(task.id)}
                                          className="w-5 h-5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Card Title & Desc */}
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                    {task.title}
                                  </h4>
                                  {task.description && (
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                {/* 🔗 WORKFLOW LINKAGE BOX */}
                                {hasLink && (
                                  <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1 truncate">
                                        <Workflow className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{task.linkedWorkflowTabTitle || 'Workflow'}</span>
                                      </span>
                                      <button
                                        type="button"
                                        title="Buka tab ini dan sorot node di flowchart"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onJumpToLinkedWorkflow(
                                            task.linkedWorkflowTabId || '',
                                            task.linkedSourceNodeId,
                                            task.linkedTargetNodeId,
                                          );
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer shrink-0"
                                      >
                                        <span>Lihat di Flow</span>
                                        <ArrowRight className="w-2.5 h-2.5" />
                                      </button>
                                    </div>

                                    <div className="text-[10.5px] font-medium text-slate-700 flex items-center gap-1.5 flex-wrap">
                                      <span className="px-1.5 py-0.5 rounded bg-white font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                                        {task.linkedSourceNodeLabel || 'Node Asal'}
                                      </span>
                                      {task.linkedTargetNodeLabel && (
                                        <>
                                          <span className="text-slate-400 font-bold text-xs">➔</span>
                                          <span className="px-1.5 py-0.5 rounded bg-white font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                                            {task.linkedTargetNodeLabel}
                                          </span>
                                          {task.linkedEdgeLabel && (
                                            <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                                              ({task.linkedEdgeLabel})
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Card Footer: Assignee & Quick Move */}
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[9.5px] font-bold flex items-center justify-center">
                                      {task.assignee ? task.assignee.substring(0, 1).toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-600 truncate max-w-[110px]">
                                      {task.assignee || 'Unassigned'}
                                    </span>
                                  </div>

                                  {!isViewOnly && (
                                    <div className="flex items-center gap-1">
                                      {col.id === 'todo' && (
                                        <button
                                          type="button"
                                          onClick={() => onMoveKanbanTaskStatus(task.id, 'in_progress')}
                                          className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors cursor-pointer"
                                        >
                                          Mulai ➔
                                        </button>
                                      )}
                                      {col.id === 'in_progress' && (
                                        <button
                                          type="button"
                                          onClick={() => onMoveKanbanTaskStatus(task.id, 'review')}
                                          className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold transition-colors cursor-pointer"
                                        >
                                          Review ➔
                                        </button>
                                      )}
                                      {col.id === 'review' && (
                                        <button
                                          type="button"
                                          onClick={() => onMoveKanbanTaskStatus(task.id, 'done')}
                                          className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold transition-colors cursor-pointer"
                                        >
                                          Selesai ✓
                                        </button>
                                      )}
                                      {col.id === 'done' && (
                                        <button
                                          type="button"
                                          onClick={() => onMoveKanbanTaskStatus(task.id, 'todo')}
                                          className="px-1.5 py-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-[10px] transition-colors cursor-pointer"
                                          title="Pindahkan kembali ke Todo"
                                        >
                                          ↩ Todo
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          );
        };

        if (activeTab.type === 'kanban') {
          return _renderKanbanBoard();
        }

        return (
          <main
            ref={mainContainerRef}
            className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{
              backgroundColor: '#f8fafc',
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
              backgroundSize: `${24 * transform.scale}px ${24 * transform.scale}px`,
              backgroundPosition: `${transform.x}px ${transform.y}px`,
            }}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
            onClick={onDeselectAll}
          >
            <div
              ref={canvasRef}
              className="absolute inset-0 origin-top-left overflow-visible"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: '0 0',
              }}
            >
              {/* Swimlane Grouping Table (Khusus Tipe Swimlane Process Flowchart) */}
              {_renderSwimlaneTable(
                activeTab,
                onAddSwimlane ? () => onAddSwimlane('New Department') : undefined,
                onDeleteSwimlane,
                onUpdateTableWidth,
                onUpdateLaneHeight,
                onStartTableResize,
                onStartLaneResize,
              )}

              {/* Group Frames Layer (Visual frames to group nodes) */}
              {_renderGroupFrames(
                groups || [],
                nodes,
                selectedGroupId,
                onSelectGroup,
                onUpdateGroupTitle,
                onUpdateGroupColor,
                onDeleteGroupFrame,
                onStartGroupDrag,
                onStartGroupResize,
              )}

              {/* Ghost Skeleton Blueprint */}
              {_renderGhostSkeleton(currentSkeleton, showGhostSkeleton)}

              {/* SVG Connection Edges Layer */}
              <svg
                className="absolute inset-0 pointer-events-none z-10"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <marker
                    id="erp-arrow-marker"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9.5"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                  <marker
                    id="erp-arrow-marker-emerald"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9.5"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                  </marker>
                  <marker
                    id="erp-arrow-marker-rose"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9.5"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
                  </marker>
                </defs>

                {connectingState.isConnecting ? (
                  (() => {
                    const src = nodes.find((n) => n.id === connectingState.sourceNodeId);
                    return src
                      ? _renderConnectingPath(src, connectingState.currentMousePosition)
                      : null;
                  })()
                ) : null}

                {edges.map((edge) =>
                  _renderEdgeCurve(edge, nodes, selectedEdgeId === edge.id),
                )}
              </svg>

              {/* Interactive Flow Nodes Layer */}
              <div className="relative z-20">
                {nodes.map((node) => (
                  <_CanvasNodeItem
                    key={node.id}
                    node={node}
                    isSelected={node.id === selectedNodeId}
                    onSelect={onSelectNode}
                    onOpenEditModal={onOpenEditNodeModal}
                    onStartDrag={onStartNodeDrag}
                    onStartResize={onStartNodeResize}
                    onStartConnection={onStartConnection}
                    onCompleteConnect={onCompleteConnection}
                    onOpenAddModal={onOpenAddNodeModal}
                    onToggleDecisionSwap={onToggleDecisionSwap}
                    flowType={activeTab.type}
                    isViewOnly={isViewOnly}
                    isRunnerActive={flowRunner.isRunning && flowRunner.currentNodeId === node.id}
                    onMouseEnter={onNodeMouseEnter}
                    onMouseLeave={onNodeMouseLeave}
                  />
                ))}

                {/* Floating Screen Preview Popover - Only in Preview / View-Only Mode */}
                {(() => {
                  if (!isViewOnly) return null;

                  const activeHoverNodeId =
                    flowRunner.isRunning && flowRunner.currentNodeId
                      ? flowRunner.currentNodeId
                      : hoveredNodeId;
                  if (!activeHoverNodeId) return null;
                  const hoverNode = nodes.find((n) => n.id === activeHoverNodeId);
                  if (!hoverNode || !hoverNode.previewImageUrl) return null;

                  const nodeDim = _getNodeDimensions(hoverNode);
                  const popoverLeft = hoverNode.position.x + nodeDim.width + 16;
                  const popoverTop = Math.max(10, hoverNode.position.y - 20);

                  return (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${popoverLeft}px`,
                        top: `${popoverTop}px`,
                      }}
                      className="z-50 max-w-sm sm:max-w-md rounded-2xl bg-slate-950/95 backdrop-blur-md border border-slate-700/80 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150 pointer-events-none select-none"
                    >
                      <img
                        src={hoverNode.previewImageUrl}
                        alt={hoverNode.previewImageCaption || hoverNode.label}
                        className="w-full h-auto object-contain max-h-80 rounded-xl"
                      />
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Floating Auto-Focus Notification when user is dragged far from diagram */}
            {isFarFromStart && (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full border border-amber-300 shadow-xl text-xs text-amber-900 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-medium">Posisi kanvas jauh dari diagram awal</span>
                <button
                  type="button"
                  onClick={onFocusStart}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Fokus ke Start</span>
                </button>
              </div>
            )}

            {/* Flowchart Simulation / Runner Floating Controller */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-700 pointer-events-auto select-none">
              <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-700">
                <div
                  className={`w-2 h-2 rounded-full ${flowRunner.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                    }`}
                />
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                  {flowRunner.isRunning ? 'Running Flow' : 'Flow Simulator'}
                </span>
              </div>

              <button
                type="button"
                onClick={onPrevFlowStep}
                title="Langkah Sebelumnya"
                className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onToggleRunFlow}
                title={flowRunner.isRunning ? 'Pause Alur Flowchart' : 'Jalankan Animasi Alur Flowchart'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${flowRunner.isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
              >
                {flowRunner.isRunning ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{flowRunner.isRunning ? 'Pause' : 'Play Flow'}</span>
              </button>

              <button
                type="button"
                onClick={onNextFlowStep}
                title="Langkah Berikutnya"
                className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {(flowRunner.isRunning || flowRunner.currentNodeId) && (
                <button
                  type="button"
                  onClick={onStopFlow}
                  title="Hentikan Simulasi Alur"
                  className="w-7 h-7 rounded-lg hover:bg-rose-900/50 text-rose-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              )}

              <span className="text-[11px] font-mono text-slate-400 pl-2 border-l border-slate-700">
                Step {nodes.length > 0 ? flowRunner.stepIndex + 1 : 0}/{nodes.length}
              </span>
            </div>

            {/* Interactive Minimap */}
            {_renderMinimap(
              nodes,
              transform,
              activeTab,
              isMinimapOpen,
              onToggleMinimap,
              onPanToPoint,
              groups,
            )}
          </main>
        );
      })()}

      {/* 4. Complete "Tambah Langkah Alur (Add Node)" Modal with Direct Shape Names */}
      {addNodeModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Tambah Langkah Alur
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>Lanjutan dari: <strong>{addNodeModal.sourceNodeLabel || 'Node Sebelumnya'}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                      {addNodeModal.direction === 'bottom' ? (
                        <>
                          <ArrowDown className="w-3 h-3" /> Arah Bawah
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3 h-3" /> Arah Kanan
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseAddNodeModal}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 px-6 py-2 bg-slate-100/90 border-b border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => onUpdateAddNodeField('mode', 'new')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${addNodeModal.mode !== 'connect'
                  ? 'bg-white text-indigo-700 shadow-2xs border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Buat Node Langkah Baru</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateAddNodeField('mode', 'connect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${addNodeModal.mode === 'connect'
                  ? 'bg-white text-indigo-700 shadow-2xs border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
              >
                <Workflow className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sambungkan ke Node yang Sudah Ada</span>
              </button>
            </div>

            {addNodeModal.mode === 'connect' ? (
              <form onSubmit={onSubmitAddNode} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Visual Connection Route Banner */}
                <div className="p-3.5 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 border border-indigo-200 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-950 shadow-2xs">
                  <div className="truncate max-w-[42%]">
                    <span className="text-[9.5px] uppercase font-bold text-indigo-500 block">Dari Node Asal</span>
                    <span className="font-bold truncate text-slate-800">{addNodeModal.sourceNodeLabel || 'Node Asal'}</span>
                  </div>
                  <div className="flex flex-col items-center px-2 text-indigo-600 shrink-0">
                    <span className="text-[10px] font-bold bg-white border border-indigo-200 px-2 py-0.5 rounded-full mb-0.5 shadow-2xs">
                      {addNodeModal.edgeLabel || (addNodeModal.sourceNodeType === 'decision' ? (addNodeModal.direction === 'bottom' ? 'Tidak' : 'Ya') : 'Alur')}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="truncate max-w-[42%] text-right">
                    <span className="text-[9.5px] uppercase font-bold text-indigo-500 block">Ke Node Tujuan</span>
                    <span className="font-bold truncate text-slate-800">
                      {nodes.find((n) => n.id === addNodeModal.targetNodeId)?.label || 'Pilih Node di Bawah'}
                    </span>
                  </div>
                </div>

                {/* Form Input: Pilih Target Node */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Pilih Node Tujuan Alur <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/70">
                    {nodes
                      .filter((n) => n.id !== addNodeModal.sourceNodeId)
                      .map((targetNode) => {
                        const isTargetSelected = addNodeModal.targetNodeId === targetNode.id;
                        return (
                          <div
                            key={targetNode.id}
                            onClick={() => onUpdateAddNodeField('targetNodeId', targetNode.id)}
                            className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${isTargetSelected
                              ? 'border-indigo-600 bg-indigo-50/90 text-indigo-950 shadow-xs ring-2 ring-indigo-200'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:shadow-2xs'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isTargetSelected ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                              }`}>
                              {_renderShapeVisualPreview(targetNode.type, 'w-5 h-5')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold truncate leading-tight">
                                {targetNode.label}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                                {targetNode.moduleCategory || 'General'}
                              </div>
                            </div>
                            {isTargetSelected && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Form Input: Edge Label */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Label Garis Hubungan (Transisi Alur)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tidak / Gagal / Kembali ke Form / Retry"
                    value={addNodeModal.edgeLabel}
                    onChange={(e) => onUpdateAddNodeField('edgeLabel', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                  />
                </div>

                {/* Modal Submit Footer for Connect Mode */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onCloseAddNodeModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!addNodeModal.targetNodeId}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Workflow className="w-4 h-4 stroke-[2.5]" />
                    <span>Hubungkan Garis Alur</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Modal Form Body for New Node */
              <form onSubmit={onSubmitAddNode} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Form Input: Label */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama / Label Langkah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Verifikasi Pembayaran Customer"
                    value={addNodeModal.label}
                    onChange={(e) => onUpdateAddNodeField('label', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                    autoFocus
                  />
                </div>

                {/* Form Input: Edge Label & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Label Garis Penghubung
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ya / Valid / Disetujui"
                      value={addNodeModal.edgeLabel}
                      onChange={(e) => onUpdateAddNodeField('edgeLabel', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kategori / Lajur Departemen
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Finance / Sales"
                      value={addNodeModal.category}
                      onChange={(e) => onUpdateAddNodeField('category', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Form Input: Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Deskripsi Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Instruksi kerja singkat atau catatan parameter..."
                    value={addNodeModal.description}
                    onChange={(e) => onUpdateAddNodeField('description', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all resize-none"
                  />
                </div>

                {/* Shape Selector: Direct Title + Shape Name (Zero verbose descriptions) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Pilih Jenis Shape / Bentuk
                    </label>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                      {['Semua', 'Event', 'Proses', 'Logika', 'Data & Dokumen', 'DFD'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => onUpdateAddNodeField('shapeCategoryFilter', cat)}
                          className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${addNodeModal.shapeCategoryFilter === cat
                            ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/50">
                    {filteredShapes.map((shape) => {
                      const isSelected = addNodeModal.type === shape.type;
                      return (
                        <div
                          key={shape.type}
                          onClick={() => onUpdateAddNodeField('type', shape.type)}
                          className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${isSelected
                            ? 'border-indigo-600 bg-indigo-50/90 text-indigo-950 shadow-xs ring-2 ring-indigo-200'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs text-slate-800'
                            }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700'
                              }`}
                          >
                            {_renderShapeVisualPreview(shape.type, 'w-6 h-6')}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className={`font-bold text-xs truncate ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                              {shape.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form Input: Color Theme */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Warna Tema Node
                  </label>
                  <div className="flex items-center gap-2">
                    {(['indigo', 'emerald', 'amber', 'rose', 'cyan', 'slate', 'violet'] as NodeColorTheme[]).map(
                      (color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => onUpdateAddNodeField('colorTheme', color)}
                          className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${addNodeModal.colorTheme === color
                            ? 'scale-115 ring-2 ring-offset-2 ring-indigo-500 shadow-sm'
                            : 'opacity-70 hover:opacity-100'
                            }`}
                          style={{
                            backgroundColor:
                              color === 'indigo'
                                ? '#6366f1'
                                : color === 'emerald'
                                  ? '#10b981'
                                  : color === 'amber'
                                    ? '#f59e0b'
                                    : color === 'rose'
                                      ? '#f43f5e'
                                      : color === 'cyan'
                                        ? '#06b6d4'
                                        : color === 'violet'
                                          ? '#8b5cf6'
                                          : '#64748b',
                          }}
                        >
                          {addNodeModal.colorTheme === color ? (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          ) : null}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Modal Submit Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onCloseAddNodeModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Tambahkan Langkah</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {/* 5. Complete "Edit Node" Modal (Requested: edit node muncul modal aja) */}
      {editNodeModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Node
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ID: {editNodeModal.nodeId}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseEditNodeModal}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={onSaveEditNode} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Nama / Label Node */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama / Label Langkah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editNodeModal.label}
                  onChange={(e) => onUpdateEditNodeField('label', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                  autoFocus
                />
              </div>

              {/* Ganti Bentuk Shape (Prominent at top so user can easily change shape) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Bentuk Shape Flowchart
                  </label>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    {FLOW_NODE_TYPE_OPTIONS.find((s) => s.type === editNodeModal.type)?.label || 'Bentuk Standar'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/70">
                  {FLOW_NODE_TYPE_OPTIONS.map((shape) => {
                    const isSelected = editNodeModal.type === shape.type;
                    return (
                      <div
                        key={shape.type}
                        onClick={() => onUpdateEditNodeField('type', shape.type)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-400 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:shadow-2xs'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700'
                          }`}>
                          {_renderShapeVisualPreview(shape.type, 'w-5 h-5')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                            {shape.label}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kategori / Lajur Departemen */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kategori / Lajur Departemen
                </label>
                <input
                  type="text"
                  value={editNodeModal.moduleCategory}
                  onChange={(e) => onUpdateEditNodeField('moduleCategory', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={editNodeModal.description}
                  onChange={(e) => onUpdateEditNodeField('description', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all resize-none"
                />
              </div>

              {/* Warna Tema Node */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Warna Tema
                </label>
                <div className="flex items-center gap-2">
                  {(['indigo', 'emerald', 'amber', 'rose', 'cyan', 'slate', 'violet'] as NodeColorTheme[]).map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => onUpdateEditNodeField('colorTheme', color)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${editNodeModal.colorTheme === color
                          ? 'scale-115 ring-2 ring-offset-2 ring-indigo-500 shadow-sm'
                          : 'opacity-70 hover:opacity-100'
                          }`}
                        style={{
                          backgroundColor:
                            color === 'indigo'
                              ? '#6366f1'
                              : color === 'emerald'
                                ? '#10b981'
                                : color === 'amber'
                                  ? '#f59e0b'
                                  : color === 'rose'
                                    ? '#f43f5e'
                                    : color === 'cyan'
                                      ? '#06b6d4'
                                      : color === 'violet'
                                        ? '#8b5cf6'
                                        : '#64748b',
                        }}
                      >
                        {editNodeModal.colorTheme === color ? (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        ) : null}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Screen Image Attachment (Cukup Upload Gambar) */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Gambar Layar (Tampil Saat Preview)</span>
                  </label>
                  {editNodeModal.previewImageUrl ? (
                    <button
                      type="button"
                      onClick={onClearMockupImage}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Hapus Gambar
                    </button>
                  ) : null}
                </div>

                {editNodeModal.previewImageUrl ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between gap-3 shadow-2xs">
                    <img
                      src={editNodeModal.previewImageUrl}
                      alt="Pratinjau Gambar"
                      className="w-24 h-16 object-cover rounded-xl border border-slate-200 bg-white shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800">
                        Gambar Terunggah
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                        Ganti Gambar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUploadMockupImage(file);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={onClearMockupImage}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-5 bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-300 border-dashed rounded-2xl text-xs font-medium text-slate-700 cursor-pointer transition-all hover:border-indigo-400 group">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-indigo-600 group-hover:underline">Klik untuk upload gambar</span>
                      <span className="text-slate-500"> (PNG, JPG, WebP)</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUploadMockupImage(file);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onDeleteNodeFromModal}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Node</span>
                  </button>

                  <button
                    type="button"
                    title="Buat tiket Jira yang terkoneksi langsung ke node ini"
                    onClick={() => {
                      onOpenCreateKanbanTask('todo', editNodeModal.nodeId);
                      onCloseEditNodeModal();
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Buat Tiket Jira</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCloseEditNodeModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* 6. Create Project Modal */}
      {createProjectModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Buat Project / Tab Flowchart Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseCreateProjectModal}
                className="w-7 h-7 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onConfirmCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Project
                </label>
                <input
                  type="text"
                  required
                  value={createProjectModal.projectName}
                  onChange={(e) => onUpdateCreateProjectField('projectName', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Pilih Jenis Flowchart
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FLOWCHART_TYPES_METADATA.map((meta) => {
                    const isSelected = createProjectModal.projectType === meta.type;
                    return (
                      <div
                        key={meta.type}
                        onClick={() => onUpdateCreateProjectField('projectType', meta.type)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {_renderShapeIcon(meta.iconName, 'w-4 h-4 text-indigo-600')}
                          <span className="font-bold text-xs text-slate-800">
                            {meta.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-2">
                          {meta.subtitle}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onCloseCreateProjectModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer"
                >
                  Buat Project
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* 7. Help Modal */}
      {isHelpModalOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Petunjuk Navigasi Flowchart</span>
              </h3>
              <button
                type="button"
                onClick={onToggleHelpModal}
                className="w-7 h-7 rounded-full hover:bg-slate-200 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>• <strong>Tombol (+) Konsisten</strong>: Di setiap node terdapat tombol (+) di kanan (alur horizontal) dan bawah (alur vertikal).</p>
              <p>• <strong>Edit Node</strong>: Klik ganda pada node atau klik ikon pensil untuk membuka modal edit.</p>
              <p>• <strong>Ubah Ukuran Node</strong>: Tarik sudut kanan bawah node atau atur lebarnya di modal edit.</p>
              <p>• <strong>Alur Vertikal Bersih</strong>: Koneksi ke bawah otomatis terarah vertikal tanpa loop kusut.</p>
              <p>• <strong>Tabel Swimlane</strong>: Ukuran lebar tabel dapat diperpanjang lewat tombol (+200px) atau handle di tepi kanan.</p>
              <p>• <strong>Data Otomatis Tersimpan</strong>: Semua alur tersimpan di LocalStorage dan tidak akan hilang saat direfresh.</p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={onToggleHelpModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 8. Hermes AI Settings Modal */}
      {aiSettingsModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Konfigurasi Hermes AI
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Koneksi OpenRouter / Local Endpoint untuk analisis codingan
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseAiSettings}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* API Endpoint */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  API Base URL / Endpoint
                </label>
                <input
                  type="text"
                  value={aiSettingsModal.endpoint}
                  onChange={(e) => onUpdateAiSettingsField('endpoint', e.target.value)}
                  placeholder="https://openrouter.ai/api/v1"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Preset cepat:</span>
                  <button
                    type="button"
                    onClick={() => onUpdateAiSettingsField('endpoint', 'https://openrouter.ai/api/v1')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 cursor-pointer"
                  >
                    OpenRouter
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateAiSettingsField('endpoint', 'http://localhost:11434/v1')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  >
                    Ollama Local
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateAiSettingsField('endpoint', 'http://localhost:1234/v1')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  >
                    LM Studio
                  </button>
                </div>
              </div>

              {/* Model Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Model AI (Hermes / Llama)
                </label>
                <input
                  type="text"
                  value={aiSettingsModal.model}
                  onChange={(e) => onUpdateAiSettingsField('model', e.target.value)}
                  placeholder="nousresearch/hermes-3-llama-3.1-70b"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Pilihan model:</span>
                  <button
                    type="button"
                    onClick={() => onUpdateAiSettingsField('model', 'nousresearch/hermes-3-llama-3.1-70b')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 cursor-pointer"
                  >
                    Hermes 3 70B
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateAiSettingsField('model', 'nousresearch/hermes-3-llama-3.1-405b')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  >
                    Hermes 3 405B
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateAiSettingsField('model', 'nousresearch/hermes-2-pro-llama-3-8b')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  >
                    Hermes 2 Pro 8B
                  </button>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>OpenRouter / OpenAI API Key</span>
                  <span className="text-[10px] font-normal text-slate-400">Tersimpan aman di LocalStorage</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={aiSettingsModal.apiKey}
                    onChange={(e) => onUpdateAiSettingsField('apiKey', e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  *Untuk Ollama / LM Studio local server, API key boleh dikosongkan.
                </p>
              </div>

              {/* Test Connection Button & Result Alert */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={aiSettingsModal.isTesting}
                  onClick={onTestAiConnection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {aiSettingsModal.isTesting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>Test Koneksi Endpoint</span>
                </button>

                {aiSettingsModal.testStatus === 'success' && (
                  <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{aiSettingsModal.testMessage}</span>
                  </div>
                )}

                {aiSettingsModal.testStatus === 'error' && (
                  <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{aiSettingsModal.testMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCloseAiSettings}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={onCloseAiSettings}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all cursor-pointer"
              >
                Simpan & Gunakan
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 9. Project Codebase Scan & Flow Generation Modal */}
      {projectScanModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <FolderCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Analisis Alur Codingan Project
                  </h3>
                  <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1.5 mt-0.5">
                    <span>Folder: <strong>{projectScanModal.folderName}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span>{projectScanModal.files.length} file terbaca</span>
                  </div>
                </div>
              </div>

              {!projectScanModal.isGenerating && (
                <button
                  type="button"
                  onClick={onCloseProjectScanModal}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Multi-Tab Architecture Notice */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5 text-xs text-indigo-950">
                <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Sistem Pembagian Tab Terstruktur:</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Codingan tidak akan ditumpuk jadi satu diagram raksasa yang membingungkan. Hermes AI akan membaginya ke dalam beberapa Tab:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-indigo-100 flex items-start gap-1.5 shadow-2xs">
                    <span className="text-indigo-600 font-bold">1.</span>
                    <div>
                      <strong className="text-slate-800">Arsitektur E2E (Overview)</strong>
                      <div className="text-slate-500 text-[10px]">Alur besar: Client → API Gateway → Service → DB</div>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-indigo-100 flex items-start gap-1.5 shadow-2xs">
                    <span className="text-indigo-600 font-bold">2+.</span>
                    <div>
                      <strong className="text-slate-800">Detail Fitur / Modul</strong>
                      <div className="text-slate-500 text-[10px]">Tab mendalam: Auth, Business Logic, DB Tables</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Live Status */}
              {(projectScanModal.isScanning || projectScanModal.isGenerating) && (
                <div className="space-y-2 p-3 bg-purple-50/60 border border-purple-200 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                      <span>{projectScanModal.generationStep}</span>
                    </span>
                    <span className="font-mono text-purple-700">{projectScanModal.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${projectScanModal.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Scanned Files List Preview */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>File Codingan yang Dipindai</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {projectScanModal.files.length} file siap dianalisis
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                  {projectScanModal.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 flex items-center justify-between text-xs hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCode className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="font-mono text-slate-700 truncate">{file.path}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </div>
                  ))}

                  {projectScanModal.files.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Belum ada file yang terdeteksi
                    </div>
                  )}
                </div>
              </div>

              {projectScanModal.errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{projectScanModal.errorMessage}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenProjectFolder}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Pilih Folder Lain...
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={projectScanModal.isGenerating}
                  onClick={onCloseProjectScanModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={projectScanModal.isGenerating || projectScanModal.files.length === 0}
                  onClick={onGenerateFlowFromProject}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {projectScanModal.isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Generate Multi-Tab Flowchart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 8. Share View-Only Link Modal */}
      {shareModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bagikan Flowchart</h3>
                  <p className="text-[11px] text-slate-500">Mode View-Only (Aman &amp; Read-Only)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseShareModal}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Link Publik View-Only
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareModal.shareUrl}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={onCopyShareLink}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-xs ${shareModal.isCopied
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    {shareModal.isCopied ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{shareModal.isCopied ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
                <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Aman &amp; Interaktif:</strong> Penerima link hanya bisa melihat diagram tanpa mengubah struktur. Seluruh interaksi interaktif seperti <strong>Zoom, Pan, Pindah Tab, Hover Preview Screen Mockup, dan Simulasi Flow</strong> tetap aktif sepenuhnya!
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={onCloseShareModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 11. Jira / Kanban Task Creation & Edit Modal */}
      {kanbanTaskModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {kanbanTaskModal.taskId ? 'Edit Tiket Jira' : 'Buat Tiket Jira / Task Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Koneksikan task ini ke alur flowchart (dari node mana ke mana)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseKanbanTaskModal}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSaveKanbanTask} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Judul Tiket */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Tiket / Task <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Validasi Kredensial & Error Screen Login"
                  value={kanbanTaskModal.title}
                  onChange={(e) => onUpdateKanbanTaskField('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                  autoFocus
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi Tiket
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan pengerjaan, scope, atau acceptance criteria..."
                  value={kanbanTaskModal.description}
                  onChange={(e) => onUpdateKanbanTaskField('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none transition-all"
                />
              </div>

              {/* Status, Prioritas, & Assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Kolom
                  </label>
                  <select
                    value={kanbanTaskModal.status}
                    onChange={(e) => onUpdateKanbanTaskField('status', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="todo">📋 To Do</option>
                    <option value="in_progress">⏳ In Progress</option>
                    <option value="review">🔍 In Review</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Prioritas
                  </label>
                  <select
                    value={kanbanTaskModal.priority}
                    onChange={(e) => onUpdateKanbanTaskField('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assignee
                  </label>
                  <input
                    type="text"
                    placeholder="Nama penanggung jawab"
                    value={kanbanTaskModal.assignee}
                    onChange={(e) => onUpdateKanbanTaskField('assignee', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 🔗 KONEKSI KE WORKFLOW (DARI NODE MANA KE MANA) */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Koneksi ke Alur Kerja (Workflow Linkage)
                  </span>
                </div>

                {/* Pilih Tab Flowchart */}
                <div>
                  <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                    1. Pilih Tab / Diagram Workflow
                  </label>
                  <select
                    value={kanbanTaskModal.linkedWorkflowTabId}
                    onChange={(e) => {
                      onUpdateKanbanTaskField('linkedWorkflowTabId', e.target.value);
                      onUpdateKanbanTaskField('linkedSourceNodeId', '');
                      onUpdateKanbanTaskField('linkedTargetNodeId', '');
                    }}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="">(Pilih tab workflow...)</option>
                    {tabs
                      .filter((t) => t.type !== 'kanban')
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.type.toUpperCase()})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Target Tab Nodes Picker */}
                {(() => {
                  const selectedFlowTab = tabs.find((t) => t.id === kanbanTaskModal.linkedWorkflowTabId);
                  if (!selectedFlowTab) return null;

                  const flowNodes = selectedFlowTab.nodes || [];
                  const flowEdges = selectedFlowTab.edges || [];

                  const outgoingEdges = flowEdges.filter(
                    (e) => e.sourceNodeId === kanbanTaskModal.linkedSourceNodeId,
                  );

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Dari Node Mana */}
                      <div>
                        <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                          2. Dari Node Mana (Trigger)
                        </label>
                        <select
                          value={kanbanTaskModal.linkedSourceNodeId}
                          onChange={(e) => {
                            onUpdateKanbanTaskField('linkedSourceNodeId', e.target.value);
                            onUpdateKanbanTaskField('linkedTargetNodeId', '');
                          }}
                          className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                        >
                          <option value="">(Pilih Node Asal)</option>
                          {flowNodes.map((n) => (
                            <option key={n.id} value={n.id}>
                              {n.label} ({n.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Ke Node Mana */}
                      <div>
                        <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                          3. Ke Node Mana (Transisi)
                        </label>
                        <select
                          value={kanbanTaskModal.linkedTargetNodeId}
                          onChange={(e) => {
                            const targetId = e.target.value;
                            onUpdateKanbanTaskField('linkedTargetNodeId', targetId);
                            const edge = flowEdges.find(
                              (ed) =>
                                ed.sourceNodeId === kanbanTaskModal.linkedSourceNodeId &&
                                ed.targetNodeId === targetId,
                            );
                            if (edge) {
                              onUpdateKanbanTaskField('linkedEdgeLabel', edge.label);
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                        >
                          <option value="">(Hanya node ini - tanpa transisi)</option>
                          {outgoingEdges.length > 0 && (
                            <optgroup label="Terkoneksi langsung dari node asal:">
                              {outgoingEdges.map((ed) => {
                                const targetNode = flowNodes.find((n) => n.id === ed.targetNodeId);
                                return (
                                  <option key={`edge_${ed.id}`} value={ed.targetNodeId}>
                                    ➔ {targetNode?.label || ed.targetNodeId} ({ed.label || 'Lanjut'})
                                  </option>
                                );
                              })}
                            </optgroup>
                          )}
                          <optgroup label="Seluruh Node di Diagram:">
                            {flowNodes
                              .filter((n) => n.id !== kanbanTaskModal.linkedSourceNodeId)
                              .map((n) => (
                                <option key={`all_${n.id}`} value={n.id}>
                                  {n.label} ({n.type})
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  );
                })()}

                {/* Connection Live Preview Pill */}
                {kanbanTaskModal.linkedSourceNodeId && (
                  <div className="pt-2 border-t border-indigo-200/60 flex items-center gap-2 text-xs text-indigo-950 font-semibold flex-wrap">
                    <span className="text-[11px] text-indigo-700">Preview:</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 shadow-2xs">
                      {tabs
                        .find((t) => t.id === kanbanTaskModal.linkedWorkflowTabId)
                        ?.nodes.find((n) => n.id === kanbanTaskModal.linkedSourceNodeId)?.label || 'Node Asal'}
                    </span>
                    {kanbanTaskModal.linkedTargetNodeId && (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 shadow-2xs">
                          {tabs
                            .find((t) => t.id === kanbanTaskModal.linkedWorkflowTabId)
                            ?.nodes.find((n) => n.id === kanbanTaskModal.linkedTargetNodeId)?.label ||
                            'Node Tujuan'}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onCloseKanbanTaskModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer hover:scale-102 transition-all active:scale-98"
                >
                  {kanbanTaskModal.taskId ? 'Simpan Perubahan' : 'Buat Tiket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};
