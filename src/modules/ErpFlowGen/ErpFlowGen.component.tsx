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
  GripVertical,
  Check,

  Share2,
  Copy,
  Lock,
  Camera,
  LayoutDashboard,
  ListTodo,
  Link2,
  Move,
  Undo2,
  Redo2,
  Calendar,
  Zap,
  Tag,
  CheckSquare,
} from 'lucide-react';
import type {
  FlowNode,
  FlowEdge,
  FlowNodeType,
  FlowGroupFrame,
  NodeColorTheme,
  CanvasTransform,
  FlowProjectTab,
  FlowchartProjectType,
  ErpFlowGenComponentProps,
  KanbanTaskStatus,
  EdgeEndpointDragState,
} from './ErpFlowGen.type';
import {
  FLOW_NODE_TYPE_OPTIONS,
  FLOWCHART_TYPES_METADATA,
  SKELETON_TEMPLATES,
} from './ErpFlowGen.config';
import { COLOR_THEME_STYLES } from './ErpFlowGen.style';
import { _getNodeDimensions, _calculateEdgePath } from './ErpFlowGen.utils';
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
  onStartConnection?: (event: React.MouseEvent, nodeId: string, sourceAnchor?: 'top' | 'bottom' | 'left' | 'right') => void;
  onCompleteConnect: (nodeId: string) => void;
  onOpenAddModal: (nodeId: string, direction: 'right' | 'bottom', defaultEdgeLabel?: string) => void;
  onToggleDecisionSwap?: (nodeId: string) => void;
  flowType?: FlowchartProjectType;
  isViewOnly?: boolean;
  isRunnerActive?: boolean;
  isConnectingCandidate?: boolean;
  onMouseEnter?: (nodeId: string) => void;
  onMouseLeave?: () => void;
  onOpenCreateKanbanTask?: (defaultStatus?: KanbanTaskStatus, defaultSourceNodeId?: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  edges?: FlowEdge[];
  allNodes?: FlowNode[];
  edgeEndpointDragState?: EdgeEndpointDragState;
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
    onDeleteNode,
    onStartDrag,
    onStartResize,
    onStartConnection,
    onCompleteConnect,
    onOpenAddModal,
    flowType,
    isViewOnly,
    isRunnerActive,
    isConnectingCandidate,
    onMouseEnter,
    onMouseLeave,
    onOpenCreateKanbanTask,
    edges,
    allNodes,
    edgeEndpointDragState,
  } = props;

  // Track which ports are already occupied by existing connected edges
  const connectedAnchors = new Set<string>();
  if (edges && allNodes) {
    edges.forEach((e) => {
      if (e.sourceNodeId === node.id) {
        if (e.sourceAnchor && e.sourceAnchor !== 'auto') {
          connectedAnchors.add(e.sourceAnchor);
        } else {
          const targetNode = allNodes.find((n) => n.id === e.targetNodeId);
          if (targetNode) {
            const geom = _calculateEdgePath(node, targetNode, 'curved', e.waypointOffset, e.sourceAnchor, e.targetAnchor);
            if (geom.sourceSide) {
              connectedAnchors.add(geom.sourceSide);
            }
          } else {
            connectedAnchors.add(flowType === 'swimlane' ? 'right' : 'bottom');
          }
        }
      }
      if (e.targetNodeId === node.id) {
        if (e.targetAnchor && e.targetAnchor !== 'auto') {
          connectedAnchors.add(e.targetAnchor);
        } else {
          const sourceNode = allNodes.find((n) => n.id === e.sourceNodeId);
          if (sourceNode) {
            const geom = _calculateEdgePath(sourceNode, node, 'curved', e.waypointOffset, e.sourceAnchor, e.targetAnchor);
            if (geom.targetSide) {
              connectedAnchors.add(geom.targetSide);
            }
          } else {
            connectedAnchors.add(flowType === 'swimlane' ? 'left' : 'top');
          }
        }
      }
    });
  }

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
        title="Screen Mockup available (Hover to preview)"
        className="absolute -top-2 left-2 z-30 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-bold shadow-xs pointer-events-none"
      >
        <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
        <span>Screen</span>
      </div>
    );
  };

  // Quick Node Action Buttons (Connect Line, Jira Task, Open Edit Modal) at Top-Right Corner Outside Node
  const _renderEditButton = (extraButtons?: React.ReactNode): React.ReactElement | null => {
    if (isViewOnly) return null;
    return (
      <div
        className={`absolute -top-7.5 right-0 flex items-center gap-0.5 bg-white/95 backdrop-blur-xs rounded-md p-0.5 shadow-xs border border-slate-200 z-40 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity pointer-events-auto`}
      >
        {extraButtons}
        {onStartConnection && (
          <button
            type="button"
            title="Connect Line (Drag or click to connect to another node)"
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartConnection(e, node.id);
            }}
            className="w-5 h-5 rounded-md hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-crosshair"
          >
            <Link2 className="w-3 h-3" />
          </button>
        )}
        {onOpenCreateKanbanTask && (
          <button
            type="button"
            title="Create Jira task ticket for this node"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreateKanbanTask('todo', node.id);
            }}
            className="w-5 h-5 rounded-md hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3 h-3" />
          </button>
        )}
        <button
          type="button"
          title="Open Edit Node Modal"
          onClick={(e) => {
            e.stopPropagation();
            onOpenEditModal(node.id);
          }}
          className="w-5 h-5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Edit3 className="w-3 h-3" />
        </button>
        {onDeleteNode && (
          <button
            type="button"
            title="Delete Node (Delete)"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(node.id);
            }}
            className="w-5 h-5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  // 4-Side Drag-to-Connect Ports + Consistent Quick-Action Buttons (Miro / Figma style)
  const _renderConsistentPlusButtons = (): React.ReactElement => {
    const isPortVisible = isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100';
    const isEndpointDragging = Boolean(edgeEndpointDragState?.isDragging);
    const isCandidateNode = isEndpointDragging && edgeEndpointDragState?.candidateNodeId === node.id;
    const candidateAnchor = isCandidateNode ? edgeEndpointDragState?.candidateAnchor : undefined;

    return (
      <>
        {_renderScreenBadge()}

        {/* Magnetic Snap Target Indicator when dragging an edge endpoint onto this node */}
        {isCandidateNode && candidateAnchor && (
          <>
            <div
              className={`absolute w-7 h-7 rounded-full bg-indigo-500/25 border-2 border-indigo-600 animate-ping pointer-events-none z-45 ${candidateAnchor === 'top'
                ? '-top-3.5 left-1/2 -translate-x-1/2'
                : candidateAnchor === 'bottom'
                  ? '-bottom-3.5 left-1/2 -translate-x-1/2'
                  : candidateAnchor === 'left'
                    ? '-left-3.5 top-1/2 -translate-y-1/2'
                    : '-right-3.5 top-1/2 -translate-y-1/2'
                }`}
            />
            <div
              className={`absolute w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-lg pointer-events-none z-45 flex items-center justify-center scale-110 ${candidateAnchor === 'top'
                ? '-top-2 left-1/2 -translate-x-1/2'
                : candidateAnchor === 'bottom'
                  ? '-bottom-2 left-1/2 -translate-x-1/2'
                  : candidateAnchor === 'left'
                    ? '-left-2 top-1/2 -translate-y-1/2'
                    : '-right-2 top-1/2 -translate-y-1/2'
                }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </>
        )}

        {!isViewOnly && !isEndpointDragging && (
          <>
            {/* 1. Top Connection Port (Always available to drag new lines) */}
            <div
              title="Drag to create new line from Top"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onStartConnection?.(e, node.id, 'top');
              }}
              className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center cursor-crosshair z-50 ${isPortVisible} pointer-events-auto`}
            >
              <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-md hover:scale-125 transition-all flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>
            </div>

            {/* 2. Left Connection Port (Always available to drag new lines) */}
            <div
              title="Drag to create new line from Left"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onStartConnection?.(e, node.id, 'left');
              }}
              className={`absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center cursor-crosshair z-50 ${isPortVisible} pointer-events-auto`}
            >
              <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-md hover:scale-125 transition-all flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>
            </div>

            {/* 3. Right Connection Port (Always available to drag new lines) */}
            <div
              title="Drag to create new line from Right"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onStartConnection?.(e, node.id, 'right');
              }}
              className={`absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center cursor-crosshair z-50 ${isPortVisible} pointer-events-auto`}
            >
              <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-md hover:scale-125 transition-all flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>
            </div>

            {/* 4. Bottom Connection Port (Always available to drag new lines) */}
            <div
              title="Drag to create new line from Bottom"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onStartConnection?.(e, node.id, 'bottom');
              }}
              className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center cursor-crosshair z-50 ${isPortVisible} pointer-events-auto`}
            >
              <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-md hover:scale-125 transition-all flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>
            </div>

            {/* 5. Quick Add Node (+) Button at Bottom-Right Corner Outside Node */}
            <button
              type="button"
              title="Add next step / node (Quick Add Node)"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddModal(node.id, flowType === 'swimlane' ? 'right' : 'bottom');
              }}
              className={`absolute -bottom-8 -right-8 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center justify-center cursor-pointer hover:scale-115 transition-transform z-45 pointer-events-auto ${isSelected ? 'opacity-100' : isPortVisible
                } transition-opacity`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5] pointer-events-none" />
            </button>

            {/* 6. Quick Action Toolbar (Link, Jira, Edit) at Top-Right Corner Outside Node */}
            {_renderEditButton()}
          </>
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

        {/* 1. Primary Bottom-Right Corner Resize Handle (Width & Height) */}
        <div
          title="Drag corner to freely resize width & height"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStartResize(e, node.id, 'both');
          }}
          className={`absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-md cursor-se-resize hover:scale-130 transition-transform z-40 select-none interactive-control ${showHandles ? 'opacity-100 scale-100 ring-2 ring-indigo-200' : 'opacity-0 group-hover:opacity-90 scale-90'
            }`}
        />

        {/* 2. Right-Edge Center Resize Handle (Width Only - Hover only) */}
        {!isHorizontal && !isDecision && (
          <div
            title="Drag sideways to adjust node width"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartResize(e, node.id, 'horizontal');
            }}
            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-6 bg-white border-2 border-indigo-600 rounded-full shadow-md cursor-ew-resize hover:scale-125 transition-transform z-40 select-none interactive-control opacity-0 group-hover:opacity-90"
          />
        )}

        {/* 3. Bottom-Edge Center Resize Handle (Height Only - Hover only) */}
        {isHorizontal && !isDecision && (
          <div
            title="Drag down to adjust node height"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartResize(e, node.id, 'vertical');
            }}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2 w-6 bg-white border-2 border-indigo-600 rounded-full shadow-md cursor-ns-resize hover:scale-125 transition-transform z-40 select-none interactive-control opacity-0 group-hover:opacity-90"
          />
        )}
      </>
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

          {/* Dynamic 4-Way Connection Ports (Top, Bottom, Left, Right) */}
          {_renderConsistentPlusButtons()}
          {_renderEditButton()}
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
  const isEndpointCandidate = Boolean(
    edgeEndpointDragState?.isDragging && edgeEndpointDragState.candidateNodeId === node.id,
  );
  const candidateClass = (isConnectingCandidate || isEndpointCandidate)
    ? 'ring-4 ring-indigo-500 ring-offset-2 scale-[1.03] z-30 shadow-2xl transition-all'
    : '';

  return React.cloneElement(element, {
    onMouseEnter: () => onMouseEnter?.(node.id),
    onMouseLeave,
    className: `${element.props.className || ''} ${runnerGlowClass} ${candidateClass}`.trim(),
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
    <>
      {/* 1. Background Frame Boxes Layer (Below nodes & lines) */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {groups.map((group) => {
          const theme = GROUP_FRAME_THEMES[group.colorTheme || 'indigo'] || GROUP_FRAME_THEMES.indigo;
          const isSelected = selectedGroupId === group.id;

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
              key={`bg-${group.id}`}
              className={`absolute pointer-events-none rounded-2xl border-2 border-dashed select-none transition-[border-color,background-color] duration-150 ${theme.bg
                } ${isSelected ? theme.selectedBorder : theme.border}`}
              style={{
                left: `${group.position.x}px`,
                top: `${group.position.y}px`,
                width: `${group.width}px`,
                height: `${group.height}px`,
              }}
            >
              {insideCount === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 text-xs font-medium text-slate-500">
                  <span>Geser node ke dalam frame ini untuk grouping</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Interactive Foreground Controls Layer (Header Tags & Resize Handles, Above lines & nodes at z-40) */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {groups.map((group) => {
          const theme = GROUP_FRAME_THEMES[group.colorTheme || 'indigo'] || GROUP_FRAME_THEMES.indigo;

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
              key={`ctrl-${group.id}`}
              data-group-id={group.id}
              className="absolute pointer-events-none select-none group/frame"
              style={{
                left: `${group.position.x}px`,
                top: `${group.position.y}px`,
                width: `${group.width}px`,
                height: `${group.height}px`,
              }}
            >
              {/* Header Tag / Drag Handle */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectGroup(group.id);
                }}
                onMouseDown={(e) => onStartGroupDrag(e, group.id)}
                title="Drag this tab to move the Group Frame and all enclosed nodes"
                className={`absolute -top-8 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-xs font-semibold shadow-md cursor-grab active:cursor-grabbing select-none transition-transform hover:-translate-y-0.5 z-40 pointer-events-auto ${theme.tagBg} ${theme.tagText}`}
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
                  placeholder="Group Frame Title..."
                />

                {/* Node Count Pill with Move icon */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${theme.badgeBg}`}
                  title={`${insideCount} nodes enclosed in this frame. Drag frame to move group together.`}
                >
                  <Move className="w-2.5 h-2.5" />
                  {insideCount} nodes
                </span>

                {/* Cycle Color Button */}
                <button
                  type="button"
                  title="Change Frame Color"
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
                  title="Delete Group Frame (Nodes are preserved)"
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

              {/* Resize Handle: Bottom-Right Corner */}
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onStartGroupResize(e, group.id, 'both');
                }}
                title="Drag to resize Frame"
                className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-slate-400 hover:border-indigo-600 hover:bg-indigo-50 rounded-md shadow-xs flex items-center justify-center cursor-nwse-resize z-40 group-hover/frame:opacity-100 transition-opacity pointer-events-auto"
              >
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-xs" />
              </div>

              {/* Resize Handle: Right Edge */}
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onStartGroupResize(e, group.id, 'horizontal');
                }}
                title="Drag Frame width"
                className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 bg-white border-2 border-slate-300 hover:border-indigo-600 rounded-sm shadow-2xs cursor-ew-resize z-40 opacity-0 group-hover/frame:opacity-100 transition-opacity pointer-events-auto"
              />

              {/* Resize Handle: Bottom Edge */}
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onStartGroupResize(e, group.id, 'vertical');
                }}
                title="Drag Frame height"
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border-2 border-slate-300 hover:border-indigo-600 rounded-sm shadow-2xs cursor-ns-resize z-40 opacity-0 group-hover/frame:opacity-100 transition-opacity pointer-events-auto"
              />
            </div>
          );
        })}
      </div>
    </>
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
          title="Open Minimap"
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
          title="Close Minimap"
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
    onDeleteSelectedNode,
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
    onUpdateSwimlaneName,
    onUpdateMasterTitle,
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
    canvasRef,
    fileInputRef,
    mainContainerRef,
    isViewOnly,
    onToggleViewOnly,
    projectSubView,
    onSetProjectSubView,
    onGenerateTasksFromNodes,
    shareModal,
    onOpenShareModal,
    onCloseShareModal,
    onCopyShareLink,
    hoveredNodeId,
    onNodeMouseEnter,
    onNodeMouseLeave,
    flowRunner,
    onUploadMockupImage,
    onClearMockupImage,
    kanbanTaskModal,
    kanbanSearchQuery,
    kanbanPriorityFilter,
    kanbanSprintFilter,
    kanbanLinkFilter,
    onSetKanbanSearchQuery,
    onSetKanbanPriorityFilter,
    onSetKanbanSprintFilter,
    onSetKanbanLinkFilter,
    onOpenCreateKanbanTask,
    onOpenEditKanbanTask,
    onCloseKanbanTaskModal,
    onUpdateKanbanTaskField,
    onSaveKanbanTask,
    onDeleteKanbanTask,
    onMoveKanbanTaskStatus,
    onJumpToLinkedWorkflow,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    connectorStyle,
    onSetConnectorStyle,
    onSelectEdge,
    onDeleteEdgeById,
    editEdgeModal: _editEdgeModal,
    onOpenEditEdgeModal: _onOpenEditEdgeModal,
    onCloseEditEdgeModal: _onCloseEditEdgeModal,
    onUpdateEditEdgeField: _onUpdateEditEdgeField,
    onSaveEditEdge: _onSaveEditEdge,
    onFlipEdgeDirection: _onFlipEdgeDirection,
    onStartEdgeWaypointDrag,
    onResetEdgeWaypoint,
    onSetEdgeTargetAnchor,
    edgeEndpointDragState,
    onStartEdgeEndpointDrag,
    onUpdateEdgeLabel,
    onUpdateEdgeColor,
    onResetEdgeAnchors: _onResetEdgeAnchors,
    onSetEdgeSourceAnchor: _onSetEdgeSourceAnchor,
  } = props;

  const currentSkeleton = SKELETON_TEMPLATES[activeTab.type];

  const [activeEdgeLabelToolbarId, setActiveEdgeLabelToolbarId] = React.useState<string | null>(null);
  const [, setHoveredEdgeId] = React.useState<string>('');
  const [draggingKanbanTaskId, setDraggingKanbanTaskId] = React.useState<string | null>(null);
  const [dragOverKanbanColId, setDragOverKanbanColId] = React.useState<KanbanTaskStatus | null>(null);

  React.useEffect(() => {
    if (!selectedEdgeId) {
      setActiveEdgeLabelToolbarId(null);
    }
  }, [selectedEdgeId]);

  // Filtered shape options in modal
  // Filtered shape options in modal
  const filteredShapes = addNodeModal.shapeCategoryFilter === 'All'
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
                      title="Double-click to rename tab"
                      className="truncate"
                    >
                      {tab.title}
                    </span>
                    <button
                      type="button"
                      title="Rename tab"
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
                      title="Clone / Duplicate this tab"
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
                  title="Close tab"
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
            title="Add New Project / Flowchart (+)"
            onClick={onAddTabClick}
            className="w-7 h-7 rounded-full bg-slate-300/80 hover:bg-white text-slate-700 flex items-center justify-center transition-all ml-1.5 cursor-pointer shadow-xs hover:shadow"
          >
            <Plus className="w-4 h-4" />
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
      <header className="h-12 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-20 overflow-x-auto no-scrollbar">
        {/* Left Section: Logo, Title, Tab Stats, and Undo / Redo */}
        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shadow-xs shrink-0 hover:scale-105 transition-all">
              <img
                src="/favicon.svg"
                alt="Want Take Flow Logo"
                className="w-full h-full object-contain select-none"
              />
            </div>
            <div className="min-w-0 max-w-[180px] sm:max-w-[240px]">
              <div className="font-bold text-xs text-slate-900 leading-tight flex items-center gap-1.5">
                <span className="truncate" title={activeTab.title}>{activeTab.title}</span>
                <button
                  type="button"
                  title="Rename active project / tab"
                  onClick={() => onStartRenameTab(activeTab.id, activeTab.title)}
                  className="w-4 h-4 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Clone / Duplicate active tab"
                  onClick={() => onCloneTab(activeTab.id)}
                  className="w-4 h-4 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Undo / Redo Controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z / Cmd+Z)"
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${canUndo
                ? 'hover:bg-white text-slate-700 hover:text-indigo-600 cursor-pointer shadow-2xs active:scale-95'
                : 'text-slate-300 cursor-not-allowed'
                }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y / Cmd+Shift+Z)"
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${canRedo
                ? 'hover:bg-white text-slate-700 hover:text-indigo-600 cursor-pointer shadow-2xs active:scale-95'
                : 'text-slate-300 cursor-not-allowed'
                }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode View-Only Indicator Badge */}
          {isViewOnly && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-bold shadow-2xs shrink-0">
              <Lock className="w-3 h-3 text-purple-600" />
              <span>View-Only</span>
            </div>
          )}
        </div>

        {/* Right Section: Organized Action Groups */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onZoomOut}
              title="Zoom Out"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              onClick={onResetZoom}
              title="Reset Zoom to 100%"
              className="text-[11px] font-mono px-1.5 text-slate-600 cursor-pointer hover:text-indigo-600 font-semibold select-none"
            >
              {Math.round(transform.scale * 100)}%
            </span>
            <button
              type="button"
              onClick={onZoomIn}
              title="Zoom In"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>


          {/* + Add Node */}
          <button
            type="button"
            onClick={() => onOpenAddNodeModal(selectedNodeId || (nodes[nodes.length - 1]?.id ?? ''))}
            title="Add New Step / Node to Flowchart"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Node</span>
          </button>

          {/* + Frame Group */}
          <button
            type="button"
            onClick={onAddGroupFrame}
            title="Group Nodes into Frame (Group Box)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Frame Group</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-0.5 shrink-0" />

          {/* Canvas Utilities Cluster (Reset, Clear, Import, JSON) */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onLoadTemplate}
              title="Reset to initial template"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClearCanvas}
              title="Clear canvas diagram"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={onImportJsonClick}
              title="Import JSON diagram"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onExportJson}
              title="Download JSON diagram file"
              className="w-7 h-7 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept=".json"
            className="hidden"
          />

          <div className="h-5 w-[1px] bg-slate-200 mx-0.5 shrink-0" />

          {/* Mode Switcher: Flowchart vs Task Board */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => onSetProjectSubView('flowchart')}
              title="Show Flowchart Diagram / Nodes"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${projectSubView === 'flowchart' && activeTab.type !== 'kanban'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Flowchart</span>
            </button>
            <button
              type="button"
              onClick={() => onSetProjectSubView('kanban')}
              title="Show Task Board (Workflow Tickets)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${projectSubView === 'kanban' || activeTab.type === 'kanban'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Task Board</span>
              {(activeTab.kanbanTasks?.length ?? 0) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                  {activeTab.kanbanTasks?.length}
                </span>
              )}
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-0.5 shrink-0" />

          {/* Connector Line Style Switcher */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 shrink-0" title="Connector Line Style (Orthogonal / Curved)">
            <button
              type="button"
              onClick={() => onSetConnectorStyle('orthogonal')}
              title="Orthogonal Right-Angle Lines (Flowchart Standard)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${connectorStyle === 'orthogonal'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <span>⏞ Orthogonal</span>
            </button>
            <button
              type="button"
              onClick={() => onSetConnectorStyle('curved')}
              title="Smooth Curved Lines"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${connectorStyle === 'curved'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <span>∿ Curved</span>
            </button>
          </div>

          {/* Export PNG */}
          <button
            type="button"
            onClick={onExportPng}
            disabled={isExportingPng}
            title="Export to PNG image"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isExportingPng ? 'Rendering...' : 'Export PNG'}</span>
          </button>

          {/* Share View-Only Link Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            title="Share Flowchart (View-Only Mode)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden lg:inline">Share</span>
          </button>

          {/* Help Button */}
          <button
            type="button"
            onClick={onToggleHelpModal}
            title="Help & Shortcuts"
            className="w-7 h-7 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
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
              const matchesSprint = task.sprint?.toLowerCase().includes(q) ?? false;
              const matchesNode =
                (task.linkedSourceNodeLabel?.toLowerCase().includes(q) ?? false) ||
                (task.linkedTargetNodeLabel?.toLowerCase().includes(q) ?? false);
              if (!matchesKey && !matchesTitle && !matchesDesc && !matchesAssignee && !matchesSprint && !matchesNode) {
                return false;
              }
            }

            if (kanbanPriorityFilter !== 'all' && task.priority !== kanbanPriorityFilter) {
              return false;
            }

            if (kanbanSprintFilter !== 'all') {
              if (kanbanSprintFilter.toLowerCase() === 'backlog') {
                if (task.sprint && task.sprint.toLowerCase() !== 'backlog') return false;
              } else if (task.sprint !== kanbanSprintFilter) {
                return false;
              }
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
          const totalStoryPoints = tasks.reduce(
            (sum, t) => sum + (typeof t.storyPoints === 'number' ? t.storyPoints : (Number(t.storyPoints) || 0)),
            0,
          );
          const availableSprints = Array.from(
            new Set(['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Backlog', ...tasks.map((t) => t.sprint).filter(Boolean)]),
          ) as string[];

          return (
            <main className="flex-1 overflow-y-auto bg-slate-100/70 p-6 flex flex-col gap-6 select-text">
              {/* Kanban Board Top Control Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Task Board (Kanban)
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {tasks.length} Tickets ({doneCount} Done • {progressPercent}%)
                        {totalStoryPoints > 0 && ` • ${totalStoryPoints} Story Points`}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">
                      {activeTab.title}
                    </h2>
                  </div>
                </div>

                {/* Actions, Search & Filters */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onSetProjectSubView('flowchart')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
                  >
                    <Workflow className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Back to Flowchart</span>
                  </button>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search tickets, keys, sprints, or nodes..."
                      value={kanbanSearchQuery}
                      onChange={(e) => onSetKanbanSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-48 transition-all"
                    />
                  </div>

                  {/* Filter Sprint */}
                  <select
                    value={kanbanSprintFilter}
                    onChange={(e) => onSetKanbanSprintFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Sprints</option>
                    {availableSprints.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>

                  {/* Filter Prioritas */}
                  <select
                    value={kanbanPriorityFilter}
                    onChange={(e) => onSetKanbanPriorityFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent (P1)</option>
                    <option value="high">High (P2)</option>
                    <option value="medium">Medium (P3)</option>
                    <option value="low">Low (P4)</option>
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
                    <span>Only Linked Nodes</span>
                  </button>

                  {!isViewOnly && nodes.length > 0 && (
                    <button
                      type="button"
                      onClick={onGenerateTasksFromNodes}
                      title="Automatically generate tickets from each node in this flowchart"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Sync Nodes to Tickets</span>
                    </button>
                  )}

                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => onOpenCreateKanbanTask('todo')}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer hover:scale-102 transition-all active:scale-98"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Create New Ticket</span>
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
                      onDragOver={(e) => {
                        if (isViewOnly) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (dragOverKanbanColId !== col.id) {
                          setDragOverKanbanColId(col.id);
                        }
                      }}
                      onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                          if (dragOverKanbanColId === col.id) {
                            setDragOverKanbanColId(null);
                          }
                        }
                      }}
                      onDrop={(e) => {
                        if (isViewOnly) return;
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData('text/plain') || draggingKanbanTaskId;
                        if (taskId) {
                          onMoveKanbanTaskStatus(taskId, col.id);
                        }
                        setDraggingKanbanTaskId(null);
                        setDragOverKanbanColId(null);
                      }}
                      className={`flex flex-col rounded-2xl border p-3 h-full min-h-[450px] transition-all duration-150 ${dragOverKanbanColId === col.id
                        ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-400/30 shadow-md'
                        : 'bg-slate-200/50 border-slate-200/80'
                        }`}
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
                            title={`Add ticket to ${col.title}`}
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
                          <div
                            className={`flex-1 flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-xl text-center transition-colors ${dragOverKanbanColId === col.id
                              ? 'border-indigo-400 bg-indigo-50/50 text-indigo-700'
                              : 'border-slate-200 text-slate-400'
                              }`}
                          >
                            <ListTodo className="w-6 h-6 mb-1 opacity-70" />
                            <span className="text-xs font-medium">
                              {dragOverKanbanColId === col.id ? 'Drop ticket here' : 'No tickets'}
                            </span>
                          </div>
                        ) : (
                          colTasks.map((task) => {
                            const priorityColor =
                              task.priority === 'urgent'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : task.priority === 'high'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : task.priority === 'medium'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-slate-50 text-slate-600 border-slate-200';

                            const issueBadge = {
                              story: { label: 'Story', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
                              task: { label: 'Task', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
                              bug: { label: 'Bug', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
                              epic: { label: 'Epic', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                              improvement: { label: 'Improvement', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                            }[task.issueType || 'task'] || { label: 'Task', cls: 'bg-blue-50 text-blue-700 border-blue-200' };

                            const hasLink = Boolean(task.linkedSourceNodeId || task.linkedWorkflowTabTitle);

                            return (
                              <div
                                key={task.id}
                                draggable={!isViewOnly}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', task.id);
                                  e.dataTransfer.effectAllowed = 'move';
                                  setDraggingKanbanTaskId(task.id);
                                }}
                                onDragEnd={() => {
                                  setDraggingKanbanTaskId(null);
                                  setDragOverKanbanColId(null);
                                }}
                                className={`group bg-white rounded-xl border p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5 ${!isViewOnly ? 'cursor-grab active:cursor-grabbing' : ''
                                  } ${draggingKanbanTaskId === task.id
                                    ? 'opacity-40 border-indigo-400 border-dashed scale-95 shadow-none'
                                    : 'border-slate-200'
                                  }`}
                              >
                                {/* Card Top Row: Issue Type, Key & Priority */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    {!isViewOnly && (
                                      <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 cursor-grab active:cursor-grabbing -ml-0.5" />
                                    )}
                                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold border ${issueBadge.cls}`}>
                                      {issueBadge.label}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold border border-slate-200">
                                      {task.key}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold border ${priorityColor}`}>
                                      {task.priority.toUpperCase()}
                                    </span>

                                    {!isViewOnly && (
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        <button
                                          type="button"
                                          title="Edit Ticket"
                                          onClick={() => onOpenEditKanbanTask(task.id)}
                                          className="w-5 h-5 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center cursor-pointer"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Delete Ticket"
                                          onClick={() => onDeleteKanbanTask(task.id)}
                                          className="w-5 h-5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Card Second Row: Sprint, Durasi, Story Points & Due Date */}
                                {(task.sprint || task.duration || (task.storyPoints != null && task.storyPoints !== '') || task.dueDate) && (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {task.sprint && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[9.5px] font-medium">
                                        <span>{task.sprint}</span>
                                      </span>
                                    )}
                                    {task.duration && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 text-[9.5px] font-medium">
                                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                                        <span>{task.duration}</span>
                                      </span>
                                    )}
                                    {task.storyPoints != null && task.storyPoints !== '' && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 text-[9.5px] font-semibold">
                                        <Zap className="w-2.5 h-2.5 text-slate-400" />
                                        <span>{task.storyPoints} pt</span>
                                      </span>
                                    )}
                                    {task.dueDate && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 text-[9.5px] font-medium">
                                        <Calendar className="w-2.5 h-2.5 text-slate-400" />
                                        <span>{task.dueDate}</span>
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Card Title & Desc */}
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                                    {task.title}
                                  </h4>
                                  {task.description && (
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                {/* Acceptance Criteria Preview */}
                                {task.acceptanceCriteria && (
                                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex items-start gap-1.5">
                                    <CheckSquare className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                                    <div className="line-clamp-2 whitespace-pre-line font-medium leading-relaxed">
                                      {task.acceptanceCriteria}
                                    </div>
                                  </div>
                                )}

                                {/* Tags Pills */}
                                {task.tags && task.tags.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {task.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9.5px] font-medium border border-slate-200"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* 🔗 WORKFLOW LINKAGE BOX */}
                                {hasLink && (
                                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[10px] font-medium text-slate-600 flex items-center gap-1 truncate">
                                        <Workflow className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{task.linkedWorkflowTabTitle || 'Workflow'}</span>
                                      </span>
                                      <button
                                        type="button"
                                        title="Open this tab and highlight node in flowchart"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onJumpToLinkedWorkflow(
                                            task.linkedWorkflowTabId || '',
                                            task.linkedSourceNodeId,
                                            task.linkedTargetNodeId,
                                          );
                                        }}
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer shrink-0"
                                      >
                                        <span>View Flow</span>
                                        <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                                      </button>
                                    </div>

                                    <div className="text-[10px] font-medium text-slate-700 flex items-center gap-1 flex-wrap">
                                      <span className="px-1.5 py-0.5 rounded bg-white font-medium text-slate-800 border border-slate-200 shadow-2xs">
                                        {task.linkedSourceNodeLabel || 'Source Node'}
                                      </span>
                                      {task.linkedTargetNodeLabel && (
                                        <>
                                          <span className="text-slate-400 text-xs">➔</span>
                                          <span className="px-1.5 py-0.5 rounded bg-white font-medium text-slate-800 border border-slate-200 shadow-2xs">
                                            {task.linkedTargetNodeLabel}
                                          </span>
                                          {task.linkedEdgeLabel && (
                                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">
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
                                          Start ➔
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
                                          Done ✓
                                        </button>
                                      )}
                                      {col.id === 'done' && (
                                        <button
                                          type="button"
                                          onClick={() => onMoveKanbanTaskStatus(task.id, 'todo')}
                                          className="px-1.5 py-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-[10px] transition-colors cursor-pointer"
                                          title="Move back to Todo"
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

                        {/* Drop Target Indicator when hovering over column */}
                        {dragOverKanbanColId === col.id && draggingKanbanTaskId && colTasks.length > 0 && (
                          <div className="py-3 px-4 rounded-xl border-2 border-dashed border-indigo-400 bg-indigo-50/70 text-indigo-700 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-in fade-in transition-all">
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Drop ticket here to move to {col.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          );
        };

        if (projectSubView === 'kanban' || activeTab.type === 'kanban') {
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
                onUpdateSwimlaneName,
                onUpdateMasterTitle,
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
                    markerHeight="8"
                    refX="8.5"
                    refY="4"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <polygon points="0 1, 8.5 4, 0 7" fill="#64748b" />
                  </marker>
                  <marker
                    id="erp-arrow-marker-emerald"
                    markerWidth="10"
                    markerHeight="8"
                    refX="8.5"
                    refY="4"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <polygon points="0 1, 8.5 4, 0 7" fill="#10b981" />
                  </marker>
                  <marker
                    id="erp-arrow-marker-rose"
                    markerWidth="10"
                    markerHeight="8"
                    refX="8.5"
                    refY="4"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <polygon points="0 1, 8.5 4, 0 7" fill="#f43f5e" />
                  </marker>
                  <marker
                    id="erp-arrow-marker-indigo"
                    markerWidth="10"
                    markerHeight="8"
                    refX="8.5"
                    refY="4"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <polygon points="0 1, 8.5 4, 0 7" fill="#4f46e5" />
                  </marker>
                  <marker
                    id="erp-arrow-marker-amber"
                    markerWidth="10"
                    markerHeight="8"
                    refX="8.5"
                    refY="4"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <polygon points="0 1, 8.5 4, 0 7" fill="#f59e0b" />
                  </marker>
                  <marker
                    id="erp-arrow-marker-purple"
                    markerWidth="10"
                    markerHeight="8"
                    refX="8.5"
                    refY="4"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <polygon points="0 1, 8.5 4, 0 7" fill="#8b5cf6" />
                  </marker>
                </defs>

                {edges.map((edge) =>
                  _renderEdgeCurve(
                    edge,
                    nodes,
                    selectedEdgeId === edge.id,
                    onSelectEdge,
                    _onOpenEditEdgeModal,
                    onDeleteEdgeById,
                    connectorStyle,
                    onStartEdgeWaypointDrag,
                    onResetEdgeWaypoint,
                    onSetEdgeTargetAnchor,
                    onStartEdgeEndpointDrag,
                    edgeEndpointDragState,
                    onUpdateEdgeLabel,
                    setActiveEdgeLabelToolbarId,
                    setHoveredEdgeId,
                  ),
                )}
              </svg>

              {/* Interactive Flow Nodes Layer (Always above background edges so ports are never blocked) */}
              <div className={`relative ${connectingState.isConnecting ? 'z-40' : 'z-25'}`}>
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
                    isConnectingCandidate={connectingState.isConnecting && connectingState.candidateTargetNodeId === node.id}
                    onMouseEnter={onNodeMouseEnter}
                    onMouseLeave={onNodeMouseLeave}
                    onOpenCreateKanbanTask={onOpenCreateKanbanTask}
                    onDeleteNode={onDeleteSelectedNode}
                    edges={edges}
                    allNodes={nodes}
                    edgeEndpointDragState={edgeEndpointDragState}
                  />
                ))}

                {/* High-Priority Interactive Top Layer for Handles & Live Connection */}
                <svg className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${connectingState.isConnecting ? 'z-30' : 'z-20'}`}>
                  {connectingState.isConnecting ? (
                    (() => {
                      const src = nodes.find((n) => n.id === connectingState.sourceNodeId);
                      return src
                        ? _renderConnectingPath(src, connectingState.currentMousePosition, connectingState.sourceAnchor)
                        : null;
                    })()
                  ) : null}

                  {/* Render top-layer interactive endpoint & waypoint handles for selected edge ONLY when NOT connecting */}
                  {!connectingState.isConnecting && selectedEdgeId ? (
                    (() => {
                      const activeEdge = edges.find((e) => e.id === selectedEdgeId);
                      if (!activeEdge) return null;
                      return _renderEdgeCurve(
                        activeEdge,
                        nodes,
                        true,
                        onSelectEdge,
                        _onOpenEditEdgeModal,
                        onDeleteEdgeById,
                        connectorStyle,
                        onStartEdgeWaypointDrag,
                        onResetEdgeWaypoint,
                        onSetEdgeTargetAnchor,
                        onStartEdgeEndpointDrag,
                        edgeEndpointDragState,
                        onUpdateEdgeLabel,
                        setActiveEdgeLabelToolbarId,
                        setHoveredEdgeId,
                      );
                    })()
                  ) : null}
                </svg>

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

              {/* Floating Color Toolbar for Selected Edge (Shown only when edge label text is clicked) */}
              {(() => {
                if (!selectedEdgeId || isViewOnly || activeEdgeLabelToolbarId !== selectedEdgeId) return null;
                const edge = edges.find((e) => e.id === selectedEdgeId);
                if (!edge) return null;
                const src = nodes.find((n) => n.id === edge.sourceNodeId);
                const tgt = nodes.find((n) => n.id === edge.targetNodeId);
                if (!src || !tgt) return null;
                const geom = _calculateEdgePath(src, tgt, connectorStyle, edge.waypointOffset, edge.sourceAnchor, edge.targetAnchor);

                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${geom.midX}px`,
                      top: `${geom.midY - 40}px`,
                      transform: 'translateX(-50%)',
                    }}
                    className="z-30 pointer-events-auto flex items-center justify-center bg-slate-900/95 backdrop-blur-md text-white px-2.5 py-1.5 rounded-full shadow-2xl border border-slate-700/80 text-[11px] select-none scale-95 hover:scale-100 transition-all animate-in fade-in zoom-in-95"
                  >
                    {/* Color Swatches Only */}
                    <div className="flex items-center gap-1.5 px-0.5">
                      {[
                        { name: 'Indigo (Default)', color: '#4f46e5' },
                        { name: 'Green', color: '#10b981' },
                        { name: 'Red', color: '#f43f5e' },
                        { name: 'Yellow', color: '#f59e0b' },
                        { name: 'Purple', color: '#8b5cf6' },
                        { name: 'Gray', color: '#64748b' },
                      ].map((swatch) => {
                        const isCurrentColor = (edge.color || '#4f46e5') === swatch.color;
                        return (
                          <button
                            key={swatch.color}
                            type="button"
                            title={swatch.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateEdgeColor(edge.id, swatch.color);
                            }}
                            className={`w-4 h-4 rounded-full transition-transform cursor-pointer flex items-center justify-center ${isCurrentColor
                              ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-slate-900 shadow-xs'
                              : 'hover:scale-110 opacity-75 hover:opacity-100'
                              }`}
                            style={{ backgroundColor: swatch.color }}
                          />
                        );
                      })}
                    </div>

                    {/* Divider & Delete Edge Button */}
                    <div className="h-3 w-px bg-slate-700 mx-1 shrink-0" />
                    <button
                      type="button"
                      title="Delete Connection Line"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEdgeById(edge.id);
                        setActiveEdgeLabelToolbarId(null);
                      }}
                      className="w-5 h-5 rounded-full hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Floating Auto-Focus Notification when user is dragged far from diagram */}
            {isFarFromStart && (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3  backdrop-blur-md rounded-full border border-amber-300 shadow-xl text-xs text-amber-900 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={onFocusStart}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Focus on Start</span>
                </button>
              </div>
            )}

            {/* Floating Mode Switcher: Edit Mode vs Preview Mode */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-slate-700/80 pointer-events-auto select-none gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (isViewOnly) onToggleViewOnly();
                }}
                title="Switch to Edit Mode (Add, edit, and organize diagram)"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${!isViewOnly
                  ? 'bg-indigo-600 text-white shadow-md active:scale-95'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Mode</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isViewOnly) onToggleViewOnly();
                }}
                title="Switch to Preview Mode (Clean diagram and screen mockup preview)"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${isViewOnly
                  ? 'bg-purple-600 text-white shadow-md active:scale-95'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Mode</span>
              </button>
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

      {/* 4. Complete "Add Workflow Step" Modal with Direct Shape Names */}
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
                    Add Workflow Step
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>Continuing from: <strong>{addNodeModal.sourceNodeLabel || 'Previous Node'}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                      {addNodeModal.direction === 'bottom' ? (
                        <>
                          <ArrowDown className="w-3 h-3" /> Downward
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3 h-3" /> Rightward
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

            {/* Modal Form Body for New Node */}
            <form onSubmit={onSubmitAddNode} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Form Input: Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Step Name / Label <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify Customer Payment"
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
                    Connection Line Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yes / Valid / Approved"
                    value={addNodeModal.edgeLabel}
                    onChange={(e) => onUpdateAddNodeField('edgeLabel', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Department / Category Lane
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Finance / Sales"
                    value={addNodeModal.category}
                    onChange={(e) => onUpdateAddNodeField('category', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Form Input: Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Additional Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief work instructions or parameter notes..."
                  value={addNodeModal.description}
                  onChange={(e) => onUpdateAddNodeField('description', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all resize-none"
                />
              </div>

              {/* Shape Selector: Direct Title + Shape Name (Zero verbose descriptions) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Select Shape / Node Type
                  </label>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                    {['All', 'Event', 'Process', 'Logic', 'Data & Docs', 'DFD'].map((cat) => (
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
                  Node Theme Color
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Step</span>
                </button>
              </div>
            </form>
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
                  Step Name / Label <span className="text-rose-500">*</span>
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
                    Flowchart Shape Type
                  </label>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    {FLOW_NODE_TYPE_OPTIONS.find((s) => s.type === editNodeModal.type)?.label || 'Standard Shape'}
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
                  Department / Category Lane
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
                  Short Description
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
                  Theme Color
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
                    <span>Upload Screen Image (Shown During Preview)</span>
                  </label>
                  {editNodeModal.previewImageUrl ? (
                    <button
                      type="button"
                      onClick={onClearMockupImage}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>

                {editNodeModal.previewImageUrl ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between gap-3 shadow-2xs">
                    <img
                      src={editNodeModal.previewImageUrl}
                      alt="Image Preview"
                      className="w-24 h-16 object-cover rounded-xl border border-slate-200 bg-white shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800">
                        Uploaded Image
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                        Change Image
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
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-5 bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-300 border-dashed rounded-2xl text-xs font-medium text-slate-700 cursor-pointer transition-all hover:border-indigo-400 group">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-indigo-600 group-hover:underline">Click to upload image</span>
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
                    <span>Delete Node</span>
                  </button>

                  <button
                    type="button"
                    title="Create task ticket on Task Board for this node"
                    onClick={() => {
                      onOpenCreateKanbanTask('todo', editNodeModal.nodeId);
                      onCloseEditNodeModal();
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Create Task Ticket</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCloseEditNodeModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    Save Changes
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
                  Create New Flowchart Project / Tab
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
                  Project Name
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
                  Select Flowchart Type
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer"
                >
                  Create Project
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
                <span>Flowchart Navigation Guide</span>
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
              <p>• <strong>Consistent (+) Quick Actions</strong>: Every node has (+) buttons on the right (horizontal flow) and bottom (vertical flow).</p>
              <p>• <strong>Edit Node</strong>: Double-click a node or click the pencil icon to open the edit modal.</p>
              <p>• <strong>Resize Node</strong>: Drag the bottom-right handle of a node to resize.</p>
              <p>• <strong>Clean Vertical Routing</strong>: Downward connections route cleanly without tangle loops.</p>
              <p>• <strong>Swimlane Table</strong>: Table width can be expanded via the (+200px) button or the right edge handle.</p>
              <p>• <strong>Auto-Saved Data</strong>: All workflow diagrams and tickets are saved locally and persist on page reload.</p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={onToggleHelpModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
              >
                Got it
              </button>
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
                  <h3 className="text-sm font-bold text-slate-900">Share Flowchart</h3>
                  <p className="text-[11px] text-slate-500">View-Only Mode (Secure &amp; Read-Only)</p>
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
                  Public View-Only Link
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
                    <span>{shareModal.isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
                <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Secure &amp; Interactive:</strong> Anyone with the link can explore diagrams in read-only mode without modifying structure. Interactive features like <strong>Zoom, Pan, Tab Switching, Mockup Hover Previews, and Flow Simulation</strong> remain fully functional!
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
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 11. Jira / Kanban Task Creation & Edit Modal */}
      {kanbanTaskModal.isOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <LayoutDashboard className="w-4 h-4 text-slate-600" />
                <span>Task Board</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-semibold">
                  {kanbanTaskModal.taskId ? 'Edit Ticket' : 'New Ticket'}
                </span>
              </div>

              <button
                type="button"
                onClick={onCloseKanbanTaskModal}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSaveKanbanTask} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Judul Tiket */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Ticket title..."
                  value={kanbanTaskModal.title}
                  onChange={(e) => onUpdateKanbanTaskField('title', e.target.value)}
                  className="w-full text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal px-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-xl focus:outline-hidden transition-colors"
                  autoFocus
                />
              </div>

              {/* Deskripsi */}
              <div>
                <textarea
                  rows={2}
                  placeholder="Add description or implementation notes..."
                  value={kanbanTaskModal.description}
                  onChange={(e) => onUpdateKanbanTaskField('description', e.target.value)}
                  className="w-full text-xs text-slate-700 placeholder:text-slate-400 px-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-xl focus:outline-hidden resize-none transition-colors"
                />
              </div>

              {/* Metadata / Attributes Grid */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-3">
                {/* Row 1: Status, Prioritas, Sprint, Assignee */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Status
                    </label>
                    <select
                      value={kanbanTaskModal.status}
                      onChange={(e) => onUpdateKanbanTaskField('status', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Priority
                    </label>
                    <select
                      value={kanbanTaskModal.priority}
                      onChange={(e) => onUpdateKanbanTaskField('priority', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                    >
                      <option value="urgent">Urgent (P1)</option>
                      <option value="high">High (P2)</option>
                      <option value="medium">Medium (P3)</option>
                      <option value="low">Low (P4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Sprint
                    </label>
                    <input
                      type="text"
                      list="modal-sprint-list"
                      placeholder="Sprint 1"
                      value={kanbanTaskModal.sprint}
                      onChange={(e) => onUpdateKanbanTaskField('sprint', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden"
                    />
                    <datalist id="modal-sprint-list">
                      <option value="Sprint 1" />
                      <option value="Sprint 2" />
                      <option value="Sprint 3" />
                      <option value="Backlog" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Assignee
                    </label>
                    <input
                      type="text"
                      placeholder="Assignee name"
                      value={kanbanTaskModal.assignee}
                      onChange={(e) => onUpdateKanbanTaskField('assignee', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Row 2: Tipe, Story Points, Durasi, Tenggat */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/60">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Issue Type
                    </label>
                    <select
                      value={kanbanTaskModal.issueType}
                      onChange={(e) => onUpdateKanbanTaskField('issueType', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                    >
                      <option value="story">Story</option>
                      <option value="task">Task</option>
                      <option value="bug">Bug</option>
                      <option value="epic">Epic</option>
                      <option value="improvement">Improvement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between">
                      <span>Story Points</span>
                      <Zap className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3"
                      value={kanbanTaskModal.storyPoints}
                      onChange={(e) => onUpdateKanbanTaskField('storyPoints', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between">
                      <span>Estimate</span>
                      <Clock className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Days"
                      value={kanbanTaskModal.duration}
                      onChange={(e) => onUpdateKanbanTaskField('duration', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between">
                      <span>Due Date</span>
                      <Calendar className="w-3 h-3 text-slate-400" />
                    </label>
                    <input
                      type="date"
                      value={kanbanTaskModal.dueDate}
                      onChange={(e) => onUpdateKanbanTaskField('dueDate', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Tags / Labels (comma-separated: Frontend, API, Auth)"
                      value={kanbanTaskModal.tags}
                      onChange={(e) => onUpdateKanbanTaskField('tags', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Kriteria Penerimaan (Acceptance Criteria) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Acceptance Criteria</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="• Acceptance criteria or completion requirements..."
                  value={kanbanTaskModal.acceptanceCriteria}
                  onChange={(e) => onUpdateKanbanTaskField('acceptanceCriteria', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-hidden resize-none transition-colors"
                />
              </div>

              {/* Tautan Alur Kerja (Workflow Linkage) */}
              <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Workflow className="w-3.5 h-3.5 text-slate-600" />
                    <span>Workflow Diagram Link</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Link ticket to flowchart steps</span>
                </div>

                {/* Pilih Tab Flowchart */}
                <select
                  value={kanbanTaskModal.linkedWorkflowTabId}
                  onChange={(e) => {
                    onUpdateKanbanTaskField('linkedWorkflowTabId', e.target.value);
                    onUpdateKanbanTaskField('linkedSourceNodeId', '');
                    onUpdateKanbanTaskField('linkedTargetNodeId', '');
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="">(Select workflow diagram...)</option>
                  {tabs
                    .filter((t) => t.type !== 'kanban')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.type.toUpperCase()})
                      </option>
                    ))}
                </select>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {/* Dari Node Mana */}
                      <div>
                        <label className="block text-[10.5px] font-medium text-slate-500 mb-1">
                          Source Node (Trigger)
                        </label>
                        <select
                          value={kanbanTaskModal.linkedSourceNodeId}
                          onChange={(e) => {
                            const chosenId = e.target.value;
                            onUpdateKanbanTaskField('linkedSourceNodeId', chosenId);
                            onUpdateKanbanTaskField('linkedTargetNodeId', '');
                            const chosenNode = flowNodes.find((n) => n.id === chosenId);
                            if (chosenNode) {
                              if (!kanbanTaskModal.title) {
                                onUpdateKanbanTaskField('title', chosenNode.label);
                              }
                              if (!kanbanTaskModal.description && chosenNode.description) {
                                onUpdateKanbanTaskField('description', chosenNode.description);
                              }
                              if (!kanbanTaskModal.tags && chosenNode.moduleCategory) {
                                onUpdateKanbanTaskField('tags', chosenNode.moduleCategory);
                              }
                              const outgoing = flowEdges.find((ed) => ed.sourceNodeId === chosenId);
                              if (outgoing) {
                                onUpdateKanbanTaskField('linkedTargetNodeId', outgoing.targetNodeId);
                                if (outgoing.label) {
                                  onUpdateKanbanTaskField('linkedEdgeLabel', outgoing.label);
                                }
                              }
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                        >
                          <option value="">(Select source node)</option>
                          {flowNodes.map((n) => (
                            <option key={n.id} value={n.id}>
                              {n.label} ({n.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Ke Node Mana */}
                      <div>
                        <label className="block text-[10.5px] font-medium text-slate-500 mb-1">
                          Target Node (Transition)
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
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                        >
                          <option value="">(Single node only - no transition)</option>
                          {outgoingEdges.length > 0 && (
                            <optgroup label="Directly connected from source node:">
                              {outgoingEdges.map((ed) => {
                                const targetNode = flowNodes.find((n) => n.id === ed.targetNodeId);
                                return (
                                  <option key={`edge_${ed.id}`} value={ed.targetNodeId}>
                                    ➔ {targetNode?.label || ed.targetNodeId} ({ed.label || 'Next'})
                                  </option>
                                );
                              })}
                            </optgroup>
                          )}
                          <optgroup label="All Nodes:">
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

                {/* Connection Live Preview */}
                {kanbanTaskModal.linkedSourceNodeId && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-slate-700 flex-wrap">
                    <span className="text-[10px] text-slate-400">Link:</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium">
                      {tabs
                        .find((t) => t.id === kanbanTaskModal.linkedWorkflowTabId)
                        ?.nodes.find((n) => n.id === kanbanTaskModal.linkedSourceNodeId)?.label || 'Source Node'}
                    </span>
                    {kanbanTaskModal.linkedTargetNodeId && (
                      <>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium">
                          {tabs
                            .find((t) => t.id === kanbanTaskModal.linkedWorkflowTabId)
                            ?.nodes.find((n) => n.id === kanbanTaskModal.linkedTargetNodeId)?.label ||
                            'Target Node'}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {kanbanTaskModal.taskId && (
                    <button
                      type="button"
                      onClick={() => {
                        if (kanbanTaskModal.taskId) {
                          onDeleteKanbanTask(kanbanTaskModal.taskId);
                        }
                        onCloseKanbanTaskModal();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Ticket</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCloseKanbanTaskModal}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                  >
                    {kanbanTaskModal.taskId ? 'Save Changes' : 'Create Ticket'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};
