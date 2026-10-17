import { useState, useCallback, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import type {
  FlowNode,
  FlowEdge,
  FlowNodeType,
  NodeColorTheme,
  CanvasTransform,
  DraggingState,
  ConnectingState,
  PanningState,
  FlowProjectTab,
  FlowchartProjectType,
  AddNodeModalData,
  EditNodeModalData,
  CreateProjectModalData,
  SchemaExportData,
  Position,
  FlowGroupFrame,
  AiSettingsModalData,
  ProjectScanModalData,
  HermesAiConfig,
  ShareModalData,
  FlowRunnerState,
  KanbanTask,
  KanbanTaskModalData,
  KanbanTaskStatus,
  SwimlaneLane,
  EditEdgeModalData,
  EdgeEndpointDragState,
} from './ErpFlowGen.type';
import { SCREEN_MOCKUP_PRESETS } from './ErpFlowGen.mockups';
import {
  DEFAULT_AI_CONFIG,
  AI_STORAGE_KEY,
  scanProjectDirectory,
  scanProjectFileList,
  testAiConnection,
  generateFlowFromCodebase,
} from './ErpFlowGen.ai';
import {
  CANVAS_CONFIG,
  createInitialProject,
  NODE_DIMENSIONS,
} from './ErpFlowGen.config';
import {
  _generateUniqueId,
  _findNodeById,
  _getNodeDimensions,
  _validateSchemaJson,
  _downloadJsonFile,
} from './ErpFlowGen.utils';

const STORAGE_KEY = 'erp_flowgen_tabs_v7';
const ACTIVE_TAB_KEY = 'erp_flowgen_active_tab_id_v7';

const _loadPersistedTabs = (): FlowProjectTab[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed reading localStorage tabs:', err);
  }
  return [
    createInitialProject('userflow', 'Amazon Book Order'),
    createInitialProject('swimlane', 'SOP Perusahaan'),
  ];
};

const _loadPersistedActiveTabId = (fallbackId: string): string => {
  if (typeof window === 'undefined') return fallbackId;
  try {
    const saved = localStorage.getItem(ACTIVE_TAB_KEY);
    if (saved) return saved;
  } catch (err) {
    console.warn('Failed reading activeTabId:', err);
  }
  return fallbackId;
};

export type UseErpFlowGenReturn = {
  tabs: FlowProjectTab[];
  activeTabId: string;
  activeTab: FlowProjectTab;
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string;
  selectedEdgeId: string;
  transform: CanvasTransform;
  connectingState: ConnectingState;
  isHelpModalOpen: boolean;
  isExportingPng: boolean;
  showGhostSkeleton: boolean;
  addNodeModal: AddNodeModalData;
  editNodeModal: EditNodeModalData;
  createProjectModal: CreateProjectModalData;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  mainContainerRef: React.RefObject<HTMLElement | null>;
  handleSelectTab: (tabId: string) => void;
  handleAddTabClick: () => void;
  handleCloneTab: (tabId: string) => void;
  handleCloseTab: (tabId: string, event: React.MouseEvent) => void;
  editingTabState: { tabId: string; title: string };
  handleStartRenameTab: (tabId: string, currentTitle: string) => void;
  handleUpdateEditingTabTitle: (title: string) => void;
  handleSaveTabTitle: (tabId: string) => void;
  handleCancelRenameTab: () => void;
  handleConfirmCreateProject: (e?: React.FormEvent) => void;
  handleCloseCreateProjectModal: () => void;
  handleUpdateCreateProjectField: (field: keyof CreateProjectModalData, value: string | FlowchartProjectType) => void;
  handleOpenAddNodeModal: (sourceNodeId: string, direction?: 'right' | 'bottom', defaultEdgeLabel?: string, targetLaneId?: string) => void;
  handleCloseAddNodeModal: () => void;
  handleUpdateAddNodeField: (field: keyof AddNodeModalData, value: string | FlowNodeType | NodeColorTheme | 'new' | 'connect') => void;
  handleToggleDecisionSwap: (nodeId: string) => void;
  handleSubmitAddNode: (e?: React.FormEvent) => void;
  handleOpenEditNodeModal: (nodeId: string) => void;
  handleCloseEditNodeModal: () => void;
  handleUpdateEditNodeField: (field: keyof EditNodeModalData, value: string | FlowNodeType | NodeColorTheme | number) => void;
  handleSaveEditNode: (e?: React.FormEvent) => void;
  handleDeleteNodeFromModal: () => void;
  handleToggleGhostSkeleton: () => void;
  handleAddSwimlane: (name: string, color?: string) => void;
  handleUpdateSwimlaneName: (laneId: string, name: string) => void;
  handleDeleteSwimlane: (laneId: string) => void;
  handleUpdateTableWidth: (newWidth: number) => void;
  handleStartTableResize: (event: React.MouseEvent) => void;
  handleStartLaneResize: (event: React.MouseEvent, laneId: string, initialHeight: number) => void;
  handleUpdateLaneHeight: (laneId: string, newHeight: number) => void;
  handleSelectNode: (nodeId: string) => void;
  handleDeselectAll: () => void;
  handleUpdateNodeLabel: (nodeId: string, label: string) => void;
  handleUpdateNodeCategory: (nodeId: string, category: string) => void;
  handleUpdateNodeColor: (nodeId: string, color: NodeColorTheme) => void;
  handleDeleteSelectedNode: () => void;
  handleDeleteSelectedEdge: () => void;
  handleStartNodeDrag: (event: React.MouseEvent<HTMLDivElement>, nodeId: string) => void;
  handleStartNodeResize: (event: React.MouseEvent, nodeId: string, mode?: 'both' | 'horizontal' | 'vertical') => void;
  handleStartConnection: (event: React.MouseEvent, nodeId: string, sourceAnchor?: 'top' | 'bottom' | 'left' | 'right') => void;
  handleCompleteConnection: (targetNodeId: string, targetAnchor?: 'top' | 'bottom' | 'left' | 'right') => void;
  handleCanvasMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleCanvasMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleCanvasMouseUp: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  handleExportPng: () => void;
  handleExportJson: () => void;
  handleImportJsonClick: () => void;
  handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoadTemplate: () => void;
  handleClearCanvas: () => void;
  handleToggleHelpModal: () => void;
  handleWheelPan: (deltaX: number, deltaY: number) => void;
  handleWheelZoom: (clientX: number, clientY: number, zoomFactor: number) => void;
  isMinimapOpen: boolean;
  handleToggleMinimap: () => void;
  isFarFromStart: boolean;
  handleFocusStart: () => void;
  handlePanToPoint: (canvasX: number, canvasY: number) => void;
  groups: FlowGroupFrame[];
  selectedGroupId: string;
  handleSelectGroup: (groupId: string) => void;
  handleAddGroupFrame: () => void;
  handleUpdateGroupTitle: (groupId: string, title: string) => void;
  handleUpdateGroupColor: (groupId: string, color: NodeColorTheme) => void;
  handleDeleteGroupFrame: (groupId: string) => void;
  handleStartGroupDrag: (event: React.MouseEvent, groupId: string) => void;
  handleStartGroupResize: (event: React.MouseEvent, groupId: string, mode?: 'both' | 'horizontal' | 'vertical') => void;
  aiSettingsModal: AiSettingsModalData;
  projectScanModal: ProjectScanModalData;
  handleOpenAiSettings: () => void;
  handleCloseAiSettings: () => void;
  handleUpdateAiSettingsField: (field: keyof AiSettingsModalData, value: string) => void;
  handleTestAiConnection: () => void;
  handleOpenProjectFolder: () => void;
  handleCloseProjectScanModal: () => void;
  handleGenerateFlowFromProject: () => void;
  folderInputRef: React.RefObject<HTMLInputElement | null>;
  handleFolderInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isViewOnly: boolean;
  handleToggleViewOnly: () => void;
  projectSubView: 'flowchart' | 'kanban';
  handleSetProjectSubView: (mode: 'flowchart' | 'kanban') => void;
  handleGenerateTasksFromNodes: () => void;
  shareModal: ShareModalData;
  handleOpenShareModal: () => void;
  handleCloseShareModal: () => void;
  handleCopyShareLink: () => void;
  hoveredNodeId: string | null;
  handleNodeMouseEnter: (nodeId: string) => void;
  handleNodeMouseLeave: () => void;
  flowRunner: FlowRunnerState;
  handleToggleRunFlow: () => void;
  handleNextFlowStep: () => void;
  handlePrevFlowStep: () => void;
  handleStopFlow: () => void;
  handleSelectMockupPreset: (presetId: string) => void;
  handleUploadMockupImage: (file: File) => void;
  handleClearMockupImage: () => void;
  kanbanTaskModal: KanbanTaskModalData;
  kanbanSearchQuery: string;
  kanbanPriorityFilter: string;
  kanbanSprintFilter: string;
  kanbanLinkFilter: boolean;
  onSetKanbanSearchQuery: (query: string) => void;
  onSetKanbanPriorityFilter: (filter: string) => void;
  onSetKanbanSprintFilter: (filter: string) => void;
  onSetKanbanLinkFilter: (linkedOnly: boolean) => void;
  onOpenCreateKanbanTask: (defaultStatus?: KanbanTaskStatus, defaultSourceNodeId?: string) => void;
  onOpenEditKanbanTask: (taskId: string) => void;
  onCloseKanbanTaskModal: () => void;
  onUpdateKanbanTaskField: (field: keyof KanbanTaskModalData, value: string) => void;
  onSaveKanbanTask: (e?: React.FormEvent) => void;
  onDeleteKanbanTask: (taskId: string) => void;
  onMoveKanbanTaskStatus: (taskId: string, newStatus: KanbanTaskStatus) => void;
  onJumpToLinkedWorkflow: (tabId: string, nodeId?: string, targetNodeId?: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  connectorStyle: 'orthogonal' | 'curved' | 'straight';
  handleSetConnectorStyle: (style: 'orthogonal' | 'curved' | 'straight') => void;
  handleSelectEdge: (edgeId: string) => void;
  handleDeleteEdgeById: (edgeId: string) => void;
  editEdgeModal: EditEdgeModalData;
  handleOpenEditEdgeModal: (edgeId: string) => void;
  handleCloseEditEdgeModal: () => void;
  handleUpdateEditEdgeField: (field: keyof EditEdgeModalData, value: string) => void;
  handleSaveEditEdge: (e?: React.FormEvent) => void;
  handleFlipEdgeDirection: () => void;
  handleStartEdgeWaypointDrag: (event: React.MouseEvent, edgeId: string) => void;
  handleResetEdgeWaypoint: (edgeId: string) => void;
  handleSetEdgeTargetAnchor: (edgeId: string, anchor: 'auto' | 'top' | 'bottom' | 'left' | 'right') => void;
  handleSetEdgeSourceAnchor: (edgeId: string, anchor: 'auto' | 'top' | 'bottom' | 'left' | 'right') => void;
  edgeEndpointDragState: EdgeEndpointDragState;
  handleStartEdgeEndpointDrag: (event: React.MouseEvent, edgeId: string, endpointType: 'source' | 'target') => void;
  handleUpdateEdgeLabel: (edgeId: string, label: string) => void;
  handleUpdateEdgeColor: (edgeId: string, color: string) => void;
  handleResetEdgeAnchors: (edgeId: string) => void;
};

/**
 * Custom hook managing the tabbed ERP Flow, modal states, persistence, and interactions
 * All business logic, lifecycles, and state reside here (strictly zero useState in component)
 * @returns {UseErpFlowGenReturn} - tabs state, refs, and action handlers
 */
export const useErpFlowGen = (): UseErpFlowGenReturn => {
  // 1. Persisted Tabs state (never lost on refresh)
  const [tabs, setTabs] = useState<FlowProjectTab[]>(_loadPersistedTabs);
  const [activeTabId, setActiveTabId] = useState<string>(() =>
    _loadPersistedActiveTabId(tabs[0]?.id || ''),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    } catch (err) {
      console.warn('Failed writing tabs to localStorage:', err);
    }
  }, [tabs]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, activeTabId);
    } catch (err) {
      console.warn('Failed writing activeTabId to localStorage:', err);
    }
  }, [activeTabId]);

  // --- Undo & Redo History Management ---
  const [historyPast, setHistoryPast] = useState<FlowProjectTab[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<FlowProjectTab[][]>([]);
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  const dragSnapshotRef = useRef<FlowProjectTab[] | null>(null);
  const hasMovedDuringDrag = useRef<boolean>(false);

  const recordHistory = useCallback((): void => {
    setHistoryPast((prev) => {
      const next = [...prev, tabsRef.current];
      return next.length > 30 ? next.slice(next.length - 30) : next;
    });
    setHistoryFuture([]);
  }, []);

  const handleUndo = useCallback((): void => {
    setHistoryPast((past) => {
      if (past.length === 0) return past;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      setHistoryFuture((future) => [tabsRef.current, ...future]);
      setTabs(previous);
      if (!previous.some((t) => t.id === activeTabId)) {
        setActiveTabId(previous[0]?.id || '');
      }
      return newPast;
    });
  }, [activeTabId]);

  const handleRedo = useCallback((): void => {
    setHistoryFuture((future) => {
      if (future.length === 0) return future;
      const next = future[0];
      const newFuture = future.slice(1);
      setHistoryPast((past) => [...past, tabsRef.current]);
      setTabs(next);
      if (!next.some((t) => t.id === activeTabId)) {
        setActiveTabId(next[0]?.id || '');
      }
      return newFuture;
    });
  }, [activeTabId]);

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;

  // Global Keyboard Shortcuts for Undo (Cmd/Ctrl+Z) & Redo (Cmd+Shift+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl && (activeEl as HTMLElement).isContentEditable);
      if (isTyping) return;

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isModifier = isMac ? e.metaKey : e.ctrlKey;

      if (isModifier && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (isModifier && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('start_node');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>('');
  const [connectorStyle, setConnectorStyle] = useState<'orthogonal' | 'curved' | 'straight'>('orthogonal');
  const [editEdgeModal, setEditEdgeModal] = useState<EditEdgeModalData>({
    isOpen: false,
    edgeId: '',
    sourceNodeId: '',
    targetNodeId: '',
    label: '',
  });
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);

  // 2. Modals state (All centralized in hook)
  const [addNodeModal, setAddNodeModal] = useState<AddNodeModalData>({
    isOpen: false,
    mode: 'new',
    targetNodeId: '',
    sourceNodeId: '',
    sourceNodeLabel: '',
    sourceNodeType: 'start',
    targetLaneId: '',
    direction: 'right',
    label: '',
    description: '',
    type: 'process',
    edgeLabel: '',
    category: 'General',
    colorTheme: 'indigo',
    shapeCategoryFilter: 'Semua',
  });

  const [editNodeModal, setEditNodeModal] = useState<EditNodeModalData>({
    isOpen: false,
    nodeId: '',
    label: '',
    description: '',
    type: 'process',
    moduleCategory: 'General',
    colorTheme: 'indigo',
    width: 220,
    height: 96,
    previewImageUrl: '',
    previewImageCaption: '',
  });

  const [createProjectModal, setCreateProjectModal] = useState<CreateProjectModalData>({
    isOpen: false,
    projectName: '',
    projectType: 'userflow',
  });

  // Mode View-Only state (detect from URL ?mode=view or ?view=readonly)
  const [isViewOnly, setIsViewOnly] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      return (
        params.get('mode') === 'view' ||
        params.get('view') === 'readonly' ||
        params.get('view') === '1'
      );
    } catch {
      return false;
    }
  });

  // Share modal state
  const [shareModal, setShareModal] = useState<ShareModalData>({
    isOpen: false,
    shareUrl: '',
    isCopied: false,
  });

  // Hovered node state for screen mockup tooltip / popover
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Flowchart Runner / Simulator state
  const [flowRunner, setFlowRunner] = useState<FlowRunnerState>({
    isRunning: false,
    currentNodeId: null,
    stepIndex: 0,
    speedMs: 1800,
  });

  // 3. Hermes AI Config & Project Folder Scan State
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // 4. Jira / Kanban Board State
  const [kanbanTaskModal, setKanbanTaskModal] = useState<KanbanTaskModalData>({
    isOpen: false,
    taskId: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    issueType: 'task',
    sprint: 'Sprint 1',
    duration: '3 Hari',
    storyPoints: '3',
    startDate: '',
    dueDate: '',
    acceptanceCriteria: '',
    assignee: 'Budi Santoso',
    tags: '',
    linkedWorkflowTabId: '',
    linkedSourceNodeId: '',
    linkedTargetNodeId: '',
    linkedEdgeLabel: '',
  });

  const [kanbanSearchQuery, setKanbanSearchQuery] = useState<string>('');
  const [kanbanPriorityFilter, setKanbanPriorityFilter] = useState<string>('all');
  const [kanbanSprintFilter, setKanbanSprintFilter] = useState<string>('all');
  const [kanbanLinkFilter, setKanbanLinkFilter] = useState<boolean>(false);

  // 5. Project SubView Mode ('flowchart' vs 'kanban' task board)
  const [projectSubView, setProjectSubView] = useState<'flowchart' | 'kanban'>('flowchart');

  const handleSetProjectSubView = useCallback((mode: 'flowchart' | 'kanban'): void => {
    setProjectSubView(mode);
  }, []);

  const handleGenerateTasksFromNodes = useCallback((): void => {
    recordHistory();
    const currentTab = tabs.find((t) => t.id === activeTabId);
    if (!currentTab) return;
    const currentTasks = currentTab.kanbanTasks || [];
    const existingSourceNodeIds = new Set(
      currentTasks.map((t) => t.linkedSourceNodeId).filter(Boolean),
    );

    const newTasks: KanbanTask[] = [];
    currentTab.nodes.forEach((node, index) => {
      if (existingSourceNodeIds.has(node.id)) return;
      const taskKey = `TASK-${(currentTasks.length + newTasks.length + 1)
        .toString()
        .padStart(3, '0')}`;
      newTasks.push({
        id: `task_${Date.now()}_${index}`,
        key: taskKey,
        title: node.label || `Langkah ${index + 1}`,
        description:
          node.description || `Implementasi alur untuk langkah: ${node.label}`,
        status: index === 0 ? 'in_progress' : 'todo',
        priority: node.type === 'decision' ? 'high' : 'medium',
        issueType: node.type === 'decision' ? 'story' : 'task',
        sprint: kanbanSprintFilter !== 'all' ? kanbanSprintFilter : 'Sprint 1',
        duration: node.type === 'decision' ? '3 Hari' : '2 Hari',
        storyPoints: node.type === 'decision' ? 5 : 3,
        startDate: new Date().toISOString().split('T')[0],
        assignee: 'Budi Santoso',
        linkedWorkflowTabId: currentTab.id,
        linkedWorkflowTabTitle: currentTab.title,
        linkedSourceNodeId: node.id,
        linkedSourceNodeLabel: node.label,
        createdAt: new Date().toISOString().split('T')[0],
      });
    });

    if (newTasks.length > 0) {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, kanbanTasks: [...(t.kanbanTasks || []), ...newTasks] }
            : t,
        ),
      );
    }
  }, [tabs, activeTabId, recordHistory]);

  const [aiConfig, setAiConfig] = useState<HermesAiConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_AI_CONFIG;
    try {
      const saved = localStorage.getItem(AI_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_AI_CONFIG;
    } catch {
      return DEFAULT_AI_CONFIG;
    }
  });

  const [aiSettingsModal, setAiSettingsModal] = useState<AiSettingsModalData>({
    isOpen: false,
    endpoint: aiConfig.endpoint,
    apiKey: aiConfig.apiKey,
    model: aiConfig.model,
    isTesting: false,
  });

  const [projectScanModal, setProjectScanModal] = useState<ProjectScanModalData>({
    isOpen: false,
    folderName: '',
    files: [],
    isScanning: false,
    isGenerating: false,
    generationStep: '',
    progressPercent: 0,
  });

  // Auto-save AI config changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiConfig));
    } catch (err) {
      console.warn('Failed saving AI config:', err);
    }
  }, [aiConfig]);

  // 4. Minimap state
  const [isMinimapOpen, setIsMinimapOpen] = useState<boolean>(true);
  const handleToggleMinimap = useCallback((): void => {
    setIsMinimapOpen((prev) => !prev);
  }, []);

  // Active tab derivation with fallback
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0] ?? createInitialProject();
  const nodes = activeTab.nodes;
  const edges = activeTab.edges;
  const showGhostSkeleton = activeTab.showGhostSkeleton;
  const transform = activeTab.transform;

  // 4b. Flowchart Runner Simulation Loop
  useEffect(() => {
    if (!flowRunner.isRunning) return;
    const tabNodes = activeTab.nodes;
    if (!tabNodes || tabNodes.length === 0) return;

    const timer = setTimeout(() => {
      setFlowRunner((prev) => {
        if (!prev.isRunning) return prev;
        const nextIdx = (prev.stepIndex + 1) % tabNodes.length;
        const nextNode = tabNodes[nextIdx];
        setHoveredNodeId(nextNode ? nextNode.id : null);
        return {
          ...prev,
          stepIndex: nextIdx,
          currentNodeId: nextNode ? nextNode.id : null,
        };
      });
    }, flowRunner.speedMs);

    return () => clearTimeout(timer);
  }, [flowRunner.isRunning, flowRunner.stepIndex, flowRunner.speedMs, activeTab.nodes]);

  // Dragging, Resizing, and Panning state
  const [draggingState, setDraggingState] = useState<DraggingState>({
    isDragging: false,
    nodeId: '',
    dragOffset: { x: 0, y: 0 },
  });

  const [resizingState, setResizingState] = useState<{
    isResizing: boolean;
    nodeId: string;
    mode?: 'both' | 'horizontal' | 'vertical';
    startPos: Position;
    initialDims: { width: number; height: number };
  }>({
    isResizing: false,
    nodeId: '',
    mode: 'both',
    startPos: { x: 0, y: 0 },
    initialDims: { width: 220, height: 96 },
  });

  const [connectingState, setConnectingState] = useState<ConnectingState>({
    isConnecting: false,
    sourceNodeId: '',
    currentMousePosition: { x: 0, y: 0 },
  });

  const [panningState, setPanningState] = useState<PanningState>({
    isPanning: false,
    panStart: { x: 0, y: 0 },
    initialTransform: { x: 0, y: 0 },
  });

  const [tableResizingState, setTableResizingState] = useState<{
    isResizing: boolean;
    startX: number;
    initialWidth: number;
  }>({
    isResizing: false,
    startX: 0,
    initialWidth: 1400,
  });

  const [laneResizingState, setLaneResizingState] = useState<{
    isResizing: boolean;
    laneId: string;
    startY: number;
    initialHeight: number;
  }>({
    isResizing: false,
    laneId: '',
    startY: 0,
    initialHeight: 180,
  });

  // Group Frame State
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groupDraggingState, setGroupDraggingState] = useState<{
    isDragging: boolean;
    groupId: string;
    dragOffset: Position;
    initialGroupPos: Position;
    initialNodePositions: { nodeId: string; x: number; y: number }[];
  }>({
    isDragging: false,
    groupId: '',
    dragOffset: { x: 0, y: 0 },
    initialGroupPos: { x: 0, y: 0 },
    initialNodePositions: [],
  });

  const [groupResizingState, setGroupResizingState] = useState<{
    isResizing: boolean;
    groupId: string;
    mode: 'both' | 'horizontal' | 'vertical';
    startPos: Position;
    initialDims: { width: number; height: number };
  }>({
    isResizing: false,
    groupId: '',
    mode: 'both',
    startPos: { x: 0, y: 0 },
    initialDims: { width: 380, height: 240 },
  });

  const [edgeWaypointDragState, setEdgeWaypointDragState] = useState<{
    isDragging: boolean;
    edgeId: string;
    startPos: Position;
    initialWaypointOffset: Position;
  }>({
    isDragging: false,
    edgeId: '',
    startPos: { x: 0, y: 0 },
    initialWaypointOffset: { x: 0, y: 0 },
  });

  const [edgeEndpointDragState, setEdgeEndpointDragState] = useState<EdgeEndpointDragState>({
    isDragging: false,
    edgeId: '',
    endpointType: 'target',
    currentPos: { x: 0, y: 0 },
  });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const mainContainerRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Responsive Auto-Center Viewport (Horizontal center)
  useEffect(() => {
    const centerCanvas = (): void => {
      const containerW =
        canvasRef.current?.clientWidth ||
        (typeof window !== 'undefined' ? window.innerWidth : 1280);
      if (!containerW || containerW <= 0) return;

      setTabs((prev) =>
        prev.map((tab) => {
          const startNode = tab.nodes.find((n) => n.type === 'start') ?? tab.nodes[0];
          const dims = startNode ? _getNodeDimensions(startNode) : { width: 160, height: 50 };
          const startCenterX = (startNode?.position.x ?? 520) + dims.width / 2;
          const targetX = Math.round(containerW / 2 - startCenterX);

          // Center if uncentered or offset
          if (
            tab.transform.x === 80 ||
            tab.transform.x === 40 ||
            Math.abs(tab.transform.x - targetX) > 120
          ) {
            return {
              ...tab,
              transform: {
                ...tab.transform,
                x: targetX,
                y: 40,
                scale: 1.0,
              },
            };
          }
          return tab;
        }),
      );
    };

    centerCanvas();
    window.addEventListener('resize', centerCanvas);
    return () => window.removeEventListener('resize', centerCanvas);
  }, []);

  const handleSelectTab = useCallback(
    (tabId: string): void => {
      setActiveTabId(tabId);
      setSelectedNodeId('');
      setSelectedEdgeId('');
      const target = tabs.find((t) => t.id === tabId);
      if (target?.type === 'kanban') {
        setProjectSubView('kanban');
      } else {
        setProjectSubView('flowchart');
      }
    },
    [tabs],
  );

  const handleAddTabClick = useCallback((): void => {
    setCreateProjectModal({
      isOpen: true,
      projectName: `Flow Project ${tabs.length + 1}`,
      projectType: 'userflow',
    });
  }, [tabs.length]);

  const handleCloseCreateProjectModal = useCallback((): void => {
    setCreateProjectModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleUpdateCreateProjectField = useCallback(
    (field: keyof CreateProjectModalData, value: string | FlowchartProjectType): void => {
      setCreateProjectModal((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleConfirmCreateProject = useCallback(
    (e?: React.FormEvent): void => {
      if (e) e.preventDefault();
      recordHistory();
      const title = createProjectModal.projectName.trim() || `Flow Project ${tabs.length + 1}`;
      const newProj = createInitialProject(createProjectModal.projectType, title);
      setTabs((prev) => [...prev, newProj]);
      setActiveTabId(newProj.id);
      setSelectedNodeId('start_node');
      setSelectedEdgeId('');
      setCreateProjectModal((prev) => ({ ...prev, isOpen: false }));
    },
    [createProjectModal, tabs.length, recordHistory],
  );

  const handleCloseTab = useCallback(
    (tabId: string, event: React.MouseEvent): void => {
      event.stopPropagation();
      recordHistory();
      if (tabs.length <= 1) {
        const freshTab = createInitialProject('userflow', 'Project 1');
        setTabs([freshTab]);
        setActiveTabId(freshTab.id);
        return;
      }

      const remainingTabs = tabs.filter((t) => t.id !== tabId);
      setTabs(remainingTabs);

      if (activeTabId === tabId) {
        setActiveTabId(remainingTabs[0].id);
      }
    },
    [tabs, activeTabId, recordHistory],
  );

  const handleCloneTab = useCallback(
    (tabId: string): void => {
      const sourceTab = tabs.find((t) => t.id === tabId);
      if (!sourceTab) return;

      recordHistory();
      const newTabId = _generateUniqueId('flow_project');

      // Remap node IDs to guarantee no cross-tab ID collisions
      const nodeIdMap: Record<string, string> = {};
      const clonedNodes: FlowNode[] = (sourceTab.nodes || []).map((node) => {
        const freshId = _generateUniqueId('node');
        nodeIdMap[node.id] = freshId;
        return {
          ...node,
          id: freshId,
          position: { ...node.position },
          schemaColumns: node.schemaColumns ? node.schemaColumns.map((col) => ({ ...col })) : undefined,
        };
      });

      const clonedEdges: FlowEdge[] = (sourceTab.edges || []).map((edge) => ({
        ...edge,
        id: _generateUniqueId('edge'),
        sourceNodeId: nodeIdMap[edge.sourceNodeId] ?? edge.sourceNodeId,
        targetNodeId: nodeIdMap[edge.targetNodeId] ?? edge.targetNodeId,
      }));

      const clonedGroups: FlowGroupFrame[] | undefined = sourceTab.groups
        ? sourceTab.groups.map((group) => ({
            ...group,
            id: _generateUniqueId('group'),
            position: { ...group.position },
          }))
        : undefined;

      const clonedKanbanTasks: KanbanTask[] | undefined = sourceTab.kanbanTasks
        ? sourceTab.kanbanTasks.map((task) => ({
            ...task,
            id: _generateUniqueId('task'),
            linkedWorkflowTabId: newTabId,
            linkedWorkflowTabTitle: `${sourceTab.title} (Salinan)`,
            linkedSourceNodeId: task.linkedSourceNodeId
              ? (nodeIdMap[task.linkedSourceNodeId] ?? task.linkedSourceNodeId)
              : undefined,
            linkedTargetNodeId: task.linkedTargetNodeId
              ? (nodeIdMap[task.linkedTargetNodeId] ?? task.linkedTargetNodeId)
              : undefined,
            tags: task.tags ? [...task.tags] : undefined,
          }))
        : undefined;

      const clonedSwimlanes: SwimlaneLane[] | undefined = sourceTab.swimlanes
        ? sourceTab.swimlanes.map((lane) => ({ ...lane }))
        : undefined;

      const clonedTab: FlowProjectTab = {
        ...sourceTab,
        id: newTabId,
        title: `${sourceTab.title} (Salinan)`,
        nodes: clonedNodes,
        edges: clonedEdges,
        groups: clonedGroups,
        kanbanTasks: clonedKanbanTasks,
        swimlanes: clonedSwimlanes,
        transform: { ...sourceTab.transform },
      };

      setTabs((prev) => {
        const targetIndex = prev.findIndex((t) => t.id === tabId);
        if (targetIndex >= 0) {
          const next = [...prev];
          next.splice(targetIndex + 1, 0, clonedTab);
          return next;
        }
        return [...prev, clonedTab];
      });

      setActiveTabId(clonedTab.id);
      setSelectedNodeId(clonedNodes[0]?.id || '');
      setSelectedEdgeId('');
    },
    [tabs, recordHistory],
  );

  // Tab Rename Handlers (Double-click or pen icon)
  const [editingTabState, setEditingTabState] = useState<{
    tabId: string;
    title: string;
  }>({
    tabId: '',
    title: '',
  });

  const handleStartRenameTab = useCallback((tabId: string, currentTitle: string): void => {
    setEditingTabState({
      tabId,
      title: currentTitle,
    });
  }, []);

  const handleUpdateEditingTabTitle = useCallback((title: string): void => {
    setEditingTabState((prev) => ({ ...prev, title }));
  }, []);

  const handleSaveTabTitle = useCallback(
    (tabId: string): void => {
      const trimmed = editingTabState.title.trim();
      if (trimmed) {
        recordHistory();
        setTabs((prev) =>
          prev.map((t) => (t.id === tabId ? { ...t, title: trimmed } : t)),
        );
      }
      setEditingTabState({ tabId: '', title: '' });
    },
    [editingTabState.title, recordHistory],
  );

  const handleCancelRenameTab = useCallback((): void => {
    setEditingTabState({ tabId: '', title: '' });
  }, []);

  // Hermes AI Settings Handlers
  const handleOpenAiSettings = useCallback((): void => {
    setAiSettingsModal((prev) => ({
      ...prev,
      isOpen: true,
      endpoint: aiConfig.endpoint,
      apiKey: aiConfig.apiKey,
      model: aiConfig.model,
      testStatus: 'idle',
      testMessage: '',
    }));
  }, [aiConfig]);

  const handleCloseAiSettings = useCallback((): void => {
    setAiSettingsModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleUpdateAiSettingsField = useCallback(
    (field: keyof AiSettingsModalData, value: string): void => {
      setAiSettingsModal((prev) => ({ ...prev, [field]: value }));
      if (field === 'endpoint' || field === 'apiKey' || field === 'model') {
        setAiConfig((prev) => ({ ...prev, [field]: value }));
      }
    },
    [],
  );

  const handleTestAiConnection = useCallback(async (): Promise<void> => {
    setAiSettingsModal((prev) => ({ ...prev, isTesting: true, testStatus: 'idle', testMessage: '' }));
    const result = await testAiConnection({
      endpoint: aiSettingsModal.endpoint,
      apiKey: aiSettingsModal.apiKey,
      model: aiSettingsModal.model,
    });
    setAiSettingsModal((prev) => ({
      ...prev,
      isTesting: false,
      testStatus: result.success ? 'success' : 'error',
      testMessage: result.message,
    }));
  }, [aiSettingsModal.endpoint, aiSettingsModal.apiKey, aiSettingsModal.model]);

  // Project Folder Codebase Scanner Handlers
  const handleOpenProjectFolder = useCallback(async (): Promise<void> => {
    if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
      try {
        setProjectScanModal({
          isOpen: true,
          folderName: 'Membaca direktori...',
          files: [],
          isScanning: true,
          isGenerating: false,
          generationStep: 'Memilih direktori project...',
          progressPercent: 15,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: 'read',
        });

        setProjectScanModal((prev) => ({
          ...prev,
          folderName: dirHandle.name,
          generationStep: `Memindai file di folder "${dirHandle.name}"...`,
          progressPercent: 35,
        }));

        const { folderName, files } = await scanProjectDirectory(dirHandle, (count, current) => {
          setProjectScanModal((prev) => ({
            ...prev,
            generationStep: `Membaca: ${current.split('/').pop()} (${count} file)`,
            progressPercent: Math.min(85, 35 + count),
          }));
        });

        setProjectScanModal({
          isOpen: true,
          folderName,
          files,
          isScanning: false,
          isGenerating: false,
          generationStep: `${files.length} file codingan berhasil dibaca dan siap dianalisis!`,
          progressPercent: 100,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') {
          setProjectScanModal((prev) => ({ ...prev, isOpen: false, isScanning: false }));
          return;
        }
        // Fallback to hidden file input
      }
    }

    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  }, []);

  const handleFolderInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    setProjectScanModal({
      isOpen: true,
      folderName: 'Membaca folder...',
      files: [],
      isScanning: true,
      isGenerating: false,
      generationStep: 'Memindai file project codingan...',
      progressPercent: 30,
    });

    const { folderName, files } = await scanProjectFileList(fileList, (count, current) => {
      setProjectScanModal((prev) => ({
        ...prev,
        generationStep: `Membaca: ${current.split('/').pop()} (${count} file)`,
        progressPercent: Math.min(85, 30 + count),
      }));
    });

    setProjectScanModal({
      isOpen: true,
      folderName,
      files,
      isScanning: false,
      isGenerating: false,
      generationStep: `${files.length} file codingan berhasil dibaca dan siap dianalisis!`,
      progressPercent: 100,
    });

    event.target.value = '';
  }, []);

  const handleCloseProjectScanModal = useCallback((): void => {
    setProjectScanModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleGenerateFlowFromProject = useCallback(async (): Promise<void> => {
    if (projectScanModal.files.length === 0) return;

    setProjectScanModal((prev) => ({
      ...prev,
      isGenerating: true,
      generationStep: 'Menghubungi Hermes AI untuk analisis arsitektur multi-tab...',
      progressPercent: 40,
    }));

    try {
      const generatedTabs = await generateFlowFromCodebase(
        projectScanModal.folderName,
        projectScanModal.files,
        aiConfig,
        (step) => {
          setProjectScanModal((prev) => ({
            ...prev,
            generationStep: step,
            progressPercent: Math.min(95, prev.progressPercent + 15),
          }));
        },
      );

      if (generatedTabs.length > 0) {
        setTabs((prevTabs) => [...prevTabs, ...generatedTabs]);
        setActiveTabId(generatedTabs[0].id);

        setProjectScanModal((prev) => ({
          ...prev,
          isOpen: false,
          isGenerating: false,
        }));
      }
    } catch (err: unknown) {
      setProjectScanModal((prev) => ({
        ...prev,
        isGenerating: false,
        errorMessage: (err as Error).message || 'Gagal menghasilkan flowchart dari AI.',
      }));
    }
  }, [projectScanModal.folderName, projectScanModal.files, aiConfig]);

  // Toggle Ghost Skeleton Template
  const handleToggleGhostSkeleton = useCallback((): void => {
    setTabs((prevTabs) =>
      prevTabs.map((t) =>
        t.id === activeTabId ? { ...t, showGhostSkeleton: !t.showGhostSkeleton } : t,
      ),
    );
  }, [activeTabId]);

  // Quick Add Node Modal Handlers
  const handleOpenAddNodeModal = useCallback(
    (
      sourceNodeId: string,
      direction: 'right' | 'bottom' = 'right',
      defaultEdgeLabel?: string,
      targetLaneId?: string,
    ): void => {
      const src = _findNodeById(nodes, sourceNodeId);
      setTabs((prevTabs) =>
        prevTabs.map((t) =>
          t.id === activeTabId ? { ...t, showGhostSkeleton: false } : t,
        ),
      );

      let computedEdgeLabel = defaultEdgeLabel || '';
      let computedColorTheme: NodeColorTheme = 'indigo';

      if (!computedEdgeLabel && src?.type === 'decision') {
        computedEdgeLabel = direction === 'bottom' ? 'Tidak' : 'Ya';
      }

      if (
        computedEdgeLabel.toLowerCase().includes('ya') ||
        computedEdgeLabel.toLowerCase().includes('yes') ||
        computedEdgeLabel.toLowerCase().includes('true')
      ) {
        computedColorTheme = 'emerald';
      } else if (
        computedEdgeLabel.toLowerCase().includes('tidak') ||
        computedEdgeLabel.toLowerCase().includes('no') ||
        computedEdgeLabel.toLowerCase().includes('false')
      ) {
        computedColorTheme = 'rose';
      }

      const otherNodes = nodes.filter((n) => n.id !== sourceNodeId);
      const defaultTargetId = otherNodes.length > 0 ? otherNodes[0].id : '';

      setAddNodeModal({
        isOpen: true,
        mode: 'new',
        targetNodeId: defaultTargetId,
        sourceNodeId,
        sourceNodeLabel: src?.label,
        sourceNodeType: src?.type,
        targetLaneId,
        direction,
        label: '',
        description: '',
        type: 'process',
        edgeLabel: computedEdgeLabel,
        category: src?.moduleCategory || 'General',
        colorTheme: computedColorTheme,
        shapeCategoryFilter: 'Semua',
      });
    },
    [nodes, activeTabId],
  );

  const handleToggleDecisionSwap = useCallback(
    (nodeId: string): void => {
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            nodes: t.nodes.map((n) =>
              n.id === nodeId ? { ...n, decisionSwap: !n.decisionSwap } : n,
            ),
          };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleCloseAddNodeModal = useCallback((): void => {
    setAddNodeModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleUpdateAddNodeField = useCallback(
    (field: keyof AddNodeModalData, value: string | FlowNodeType | NodeColorTheme | 'new' | 'connect'): void => {
      setAddNodeModal((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmitAddNode = useCallback(
    (e?: React.FormEvent): void => {
      if (e) e.preventDefault();
      recordHistory();

      const sourceNode = _findNodeById(nodes, addNodeModal.sourceNodeId);

      // 1. Mode: Sambungkan ke node yang sudah ada (Connect to existing node)
      if (addNodeModal.mode === 'connect') {
        const targetId = addNodeModal.targetNodeId;
        if (!targetId || !addNodeModal.sourceNodeId || targetId === addNodeModal.sourceNodeId) return;

        const isDuplicate = edges.some(
          (edge) =>
            edge.sourceNodeId === addNodeModal.sourceNodeId &&
            edge.targetNodeId === targetId,
        );

        if (!isDuplicate) {
          const defaultEdgeLabel = sourceNode?.type === 'decision'
            ? (addNodeModal.direction === 'bottom' ? 'Tidak / Else' : 'Ya / If')
            : 'Lanjut';

          const newEdge: FlowEdge = {
            id: _generateUniqueId('edge'),
            sourceNodeId: addNodeModal.sourceNodeId,
            targetNodeId: targetId,
            label: addNodeModal.edgeLabel || defaultEdgeLabel,
          };

          setTabs((prevTabs) =>
            prevTabs.map((t) => {
              if (t.id !== activeTabId) return t;
              return {
                ...t,
                edges: [...t.edges, newEdge],
              };
            }),
          );

          setSelectedEdgeId(newEdge.id);
        }

        setAddNodeModal((prev) => ({ ...prev, isOpen: false }));
        return;
      }

      // 2. Mode: Buat langkah/node baru
      if (!addNodeModal.label.trim()) return;

      const newNodeId = _generateUniqueId('node');
      const sourceDims = sourceNode ? _getNodeDimensions(sourceNode) : { width: 220, height: 96 };

      let targetX = 380;
      let targetY = 240;

      if (sourceNode) {
        if (addNodeModal.direction === 'bottom') {
          targetX = sourceNode.position.x;
          targetY = sourceNode.position.y + sourceDims.height + 70;
        } else {
          targetX = sourceNode.position.x + sourceDims.width + 80;
          targetY = sourceNode.position.y;
        }
      }

      // If swimlane and a lane is targeted
      if (activeTab.type === 'swimlane' && activeTab.swimlanes && activeTab.swimlanes.length > 0) {
        const targetLane = activeTab.swimlanes.find(
          (l) => l.id === addNodeModal.targetLaneId || l.name === addNodeModal.category,
        ) || activeTab.swimlanes[0];

        let accumulatedY = 40;
        for (const lane of activeTab.swimlanes) {
          if (lane.id === targetLane.id) {
            targetY = accumulatedY + (lane.height / 2) - 45;
            break;
          }
          accumulatedY += lane.height;
        }
      }

      const newNode: FlowNode = {
        id: newNodeId,
        type: addNodeModal.type,
        label: addNodeModal.label.trim(),
        description: addNodeModal.description.trim(),
        moduleCategory: addNodeModal.category || sourceNode?.moduleCategory || 'General',
        position: {
          x: targetX,
          y: targetY,
        },
        colorTheme: addNodeModal.colorTheme,
      };

      const defaultEdgeLabel = sourceNode?.type === 'decision'
        ? (addNodeModal.direction === 'bottom' ? 'Tidak / Else' : 'Ya / If')
        : 'Lanjut';

      const newEdge: FlowEdge | null = sourceNode
        ? {
            id: _generateUniqueId('edge'),
            sourceNodeId: sourceNode.id,
            targetNodeId: newNodeId,
            label: addNodeModal.edgeLabel || defaultEdgeLabel,
          }
        : null;

      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            showGhostSkeleton: false,
            nodes: [...t.nodes, newNode],
            edges: newEdge ? [...t.edges, newEdge] : t.edges,
          };
        }),
      );

      setSelectedNodeId(newNodeId);
      setSelectedEdgeId('');
      setAddNodeModal((prev) => ({ ...prev, isOpen: false }));
    },
    [nodes, edges, addNodeModal, activeTabId, activeTab.type, activeTab.swimlanes],
  );

  // Edit Node Modal Handlers
  const handleOpenEditNodeModal = useCallback(
    (nodeId: string): void => {
      const targetNode = _findNodeById(nodes, nodeId);
      if (!targetNode) return;
      const dims = _getNodeDimensions(targetNode);

      setEditNodeModal({
        isOpen: true,
        nodeId,
        label: targetNode.label,
        description: targetNode.description || '',
        type: targetNode.type,
        moduleCategory: targetNode.moduleCategory || 'General',
        colorTheme: targetNode.colorTheme || 'indigo',
        width: targetNode.width ?? dims.width,
        height: targetNode.height ?? dims.height,
        previewImageUrl: targetNode.previewImageUrl || '',
        previewImageCaption: targetNode.previewImageCaption || '',
      });
      setSelectedNodeId(nodeId);
    },
    [nodes],
  );

  const handleCloseEditNodeModal = useCallback((): void => {
    setEditNodeModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleUpdateEditNodeField = useCallback(
    (field: keyof EditNodeModalData, value: string | FlowNodeType | NodeColorTheme | number): void => {
      setEditNodeModal((prev) => {
        if (field === 'type') {
          const newType = value as FlowNodeType;
          const newDims = NODE_DIMENSIONS[newType] ?? { width: 220, height: 80 };
          return {
            ...prev,
            type: newType,
            width: newDims.width,
            height: newDims.height,
          };
        }
        return { ...prev, [field]: value };
      });
    },
    [],
  );

  const handleSaveEditNode = useCallback(
    (e?: React.FormEvent): void => {
      if (e) e.preventDefault();
      if (!editNodeModal.label.trim()) return;

      recordHistory();
      const defaultDims = NODE_DIMENSIONS[editNodeModal.type] ?? { width: 220, height: 80 };
      const finalWidth = editNodeModal.width ? Number(editNodeModal.width) : defaultDims.width;
      const finalHeight = editNodeModal.height ? Number(editNodeModal.height) : defaultDims.height;

      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            nodes: t.nodes.map((n) =>
              n.id === editNodeModal.nodeId
                ? {
                    ...n,
                    label: editNodeModal.label.trim(),
                    description: editNodeModal.description.trim(),
                    type: editNodeModal.type,
                    moduleCategory: editNodeModal.moduleCategory,
                    colorTheme: editNodeModal.colorTheme,
                    width: finalWidth,
                    height: finalHeight,
                    previewImageUrl: editNodeModal.previewImageUrl?.trim() || undefined,
                    previewImageCaption: editNodeModal.previewImageCaption?.trim() || undefined,
                  }
                : n,
            ),
          };
        }),
      );

      setEditNodeModal((prev) => ({ ...prev, isOpen: false }));
    },
    [editNodeModal, activeTabId, recordHistory],
  );

  // Mockup Presets & Custom Upload Handlers
  const handleSelectMockupPreset = useCallback((presetId: string): void => {
    const preset = SCREEN_MOCKUP_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setEditNodeModal((prev) => ({
        ...prev,
        previewImageUrl: preset.dataUrl,
        previewImageCaption: preset.caption,
      }));
    }
  }, []);

  const handleUploadMockupImage = useCallback((file: File): void => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setEditNodeModal((prev) => ({
          ...prev,
          previewImageUrl: result,
          previewImageCaption: prev.previewImageCaption || `Mockup Screenshot (${file.name})`,
        }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClearMockupImage = useCallback((): void => {
    setEditNodeModal((prev) => ({
      ...prev,
      previewImageUrl: '',
      previewImageCaption: '',
    }));
  }, []);

  // Hover Popover Handlers
  const handleNodeMouseEnter = useCallback((nodeId: string): void => {
    setHoveredNodeId(nodeId);
  }, []);

  const handleNodeMouseLeave = useCallback((): void => {
    if (!flowRunner.isRunning) {
      setHoveredNodeId(null);
    }
  }, [flowRunner.isRunning]);

  // Mode View-Only & Share Modal Handlers
  const handleOpenShareModal = useCallback((): void => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?mode=view`
        : '';
    setShareModal({
      isOpen: true,
      shareUrl: url,
      isCopied: false,
    });
  }, []);

  const handleCloseShareModal = useCallback((): void => {
    setShareModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleCopyShareLink = useCallback((): void => {
    if (typeof window !== 'undefined' && shareModal.shareUrl) {
      navigator.clipboard.writeText(shareModal.shareUrl);
      setShareModal((prev) => ({ ...prev, isCopied: true }));
      setTimeout(() => {
        setShareModal((prev) => ({ ...prev, isCopied: false }));
      }, 2500);
    }
  }, [shareModal.shareUrl]);

  const handleToggleViewOnly = useCallback((): void => {
    setIsViewOnly((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (next) {
          url.searchParams.set('mode', 'view');
        } else {
          url.searchParams.delete('mode');
          url.searchParams.delete('view');
        }
        window.history.replaceState({}, '', url.toString());
      }
      return next;
    });
  }, []);

  // Flowchart Runner / Simulation Controls
  const handleToggleRunFlow = useCallback((): void => {
    setFlowRunner((prev) => {
      const willRun = !prev.isRunning;
      if (willRun) {
        const firstNode = activeTab.nodes[0];
        const startNode = activeTab.nodes.find((n) => n.type === 'start') || firstNode;
        const startIdx = startNode ? activeTab.nodes.indexOf(startNode) : 0;
        setHoveredNodeId(startNode ? startNode.id : null);
        return {
          ...prev,
          isRunning: true,
          stepIndex: startIdx >= 0 ? startIdx : 0,
          currentNodeId: startNode ? startNode.id : null,
        };
      }
      return { ...prev, isRunning: false };
    });
  }, [activeTab.nodes]);

  const handleStopFlow = useCallback((): void => {
    setFlowRunner((prev) => ({
      ...prev,
      isRunning: false,
      currentNodeId: null,
      stepIndex: 0,
    }));
    setHoveredNodeId(null);
  }, []);

  const handleNextFlowStep = useCallback((): void => {
    if (!activeTab.nodes.length) return;
    setFlowRunner((prev) => {
      const nextIdx = (prev.stepIndex + 1) % activeTab.nodes.length;
      const nextNode = activeTab.nodes[nextIdx];
      setHoveredNodeId(nextNode ? nextNode.id : null);
      return {
        ...prev,
        stepIndex: nextIdx,
        currentNodeId: nextNode ? nextNode.id : null,
      };
    });
  }, [activeTab.nodes]);

  const handlePrevFlowStep = useCallback((): void => {
    if (!activeTab.nodes.length) return;
    setFlowRunner((prev) => {
      const prevIdx = prev.stepIndex <= 0 ? activeTab.nodes.length - 1 : prev.stepIndex - 1;
      const prevNode = activeTab.nodes[prevIdx];
      setHoveredNodeId(prevNode ? prevNode.id : null);
      return {
        ...prev,
        stepIndex: prevIdx,
        currentNodeId: prevNode ? prevNode.id : null,
      };
    });
  }, [activeTab.nodes]);

  const handleDeleteNodeFromModal = useCallback((): void => {
    const idToDelete = editNodeModal.nodeId;
    if (!idToDelete) return;

    recordHistory();
    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== activeTabId) return t;
        return {
          ...t,
          nodes: t.nodes.filter((n) => n.id !== idToDelete),
          edges: t.edges.filter(
            (e) => e.sourceNodeId !== idToDelete && e.targetNodeId !== idToDelete,
          ),
        };
      }),
    );

    setSelectedNodeId('');
    setSelectedEdgeId('');
    setEditNodeModal((prev) => ({ ...prev, isOpen: false }));
  }, [editNodeModal.nodeId, activeTabId, recordHistory]);

  // Swimlane adjustments
  const handleUpdateTableWidth = useCallback(
    (newWidth: number): void => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, tableWidth: Math.max(700, Math.min(5000, newWidth)) }
            : t,
        ),
      );
    },
    [activeTabId],
  );

  const handleStartTableResize = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();
      event.stopPropagation();
      dragSnapshotRef.current = tabsRef.current;
      hasMovedDuringDrag.current = false;
      setPanningState({
        isPanning: false,
        panStart: { x: 0, y: 0 },
        initialTransform: { x: 0, y: 0 },
      });
      const currentWidth = activeTab.tableWidth || 1400;
      setTableResizingState({
        isResizing: true,
        startX: event.clientX,
        initialWidth: currentWidth,
      });
    },
    [activeTab.tableWidth],
  );

  const handleStartLaneResize = useCallback(
    (event: React.MouseEvent, laneId: string, initialHeight: number): void => {
      event.preventDefault();
      event.stopPropagation();
      dragSnapshotRef.current = tabsRef.current;
      hasMovedDuringDrag.current = false;
      setPanningState({
        isPanning: false,
        panStart: { x: 0, y: 0 },
        initialTransform: { x: 0, y: 0 },
      });
      setLaneResizingState({
        isResizing: true,
        laneId,
        startY: event.clientY,
        initialHeight,
      });
    },
    [],
  );

  const handleUpdateLaneHeight = useCallback(
    (laneId: string, newHeight: number): void => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                swimlanes: (t.swimlanes || []).map((l) =>
                  l.id === laneId ? { ...l, height: Math.max(80, newHeight) } : l,
                ),
              }
            : t,
        ),
      );
    },
    [activeTabId],
  );

  // Selection handlers
  const handleSelectNode = useCallback((nodeId: string): void => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId('');
    setSelectedGroupId('');
  }, []);

  const handleSelectGroup = useCallback((groupId: string): void => {
    setSelectedGroupId(groupId);
    setSelectedNodeId('');
    setSelectedEdgeId('');
  }, []);

  const handleDeselectAll = useCallback((): void => {
    setSelectedNodeId('');
    setSelectedEdgeId('');
    setSelectedGroupId('');
  }, []);

  // Group Frame Handlers
  const handleAddGroupFrame = useCallback((): void => {
    recordHistory();
    const newId = _generateUniqueId('group');
    let posX = 200;
    let posY = 100;
    let width = 420;
    let height = 260;

    // If a node is selected, wrap the frame around that node nicely!
    if (selectedNodeId) {
      const targetNode = _findNodeById(nodes, selectedNodeId);
      if (targetNode) {
        const nd = _getNodeDimensions(targetNode);
        posX = Math.max(20, targetNode.position.x - 28);
        posY = Math.max(20, targetNode.position.y - 48);
        width = Math.max(340, nd.width + 56);
        height = Math.max(220, nd.height + 88);
      }
    } else {
      const containerW = canvasRef.current?.clientWidth || 1200;
      const containerH = canvasRef.current?.clientHeight || 800;
      const scale = transform.scale || 1;
      const centerX = (containerW / 2 - transform.x) / scale;
      const centerY = (containerH / 2 - transform.y) / scale;
      posX = Math.round(centerX - width / 2);
      posY = Math.round(centerY - height / 2);
    }

    const newGroup: FlowGroupFrame = {
      id: newId,
      title: `Grup Alur ${(activeTab.groups || []).length + 1}`,
      position: { x: posX, y: posY },
      width,
      height,
      colorTheme: 'indigo',
    };

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, groups: [...(t.groups || []), newGroup] }
          : t,
      ),
    );
    setSelectedGroupId(newId);
  }, [selectedNodeId, nodes, transform, activeTab.groups, activeTabId, recordHistory]);

  const handleUpdateGroupTitle = useCallback(
    (groupId: string, title: string): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                groups: (t.groups || []).map((g) =>
                  g.id === groupId ? { ...g, title } : g,
                ),
              }
            : t,
        ),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleUpdateGroupColor = useCallback(
    (groupId: string, colorTheme: NodeColorTheme): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                groups: (t.groups || []).map((g) =>
                  g.id === groupId ? { ...g, colorTheme } : g,
                ),
              }
            : t,
        ),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleDeleteGroupFrame = useCallback(
    (groupId: string): void => {
      if (isViewOnly) return;
      recordHistory();
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                groups: (t.groups || []).filter((g) => g.id !== groupId),
              }
            : t,
        ),
      );
      if (selectedGroupId === groupId) {
        setSelectedGroupId('');
      }
    },
    [isViewOnly, activeTabId, selectedGroupId, recordHistory],
  );

  const handleStartGroupDrag = useCallback(
    (event: React.MouseEvent, groupId: string): void => {
      if (isViewOnly) return;
      const targetElement = event.target as HTMLElement;
      if (
        targetElement.tagName === 'INPUT' ||
        targetElement.tagName === 'BUTTON' ||
        targetElement.closest('button') ||
        targetElement.closest('input')
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragSnapshotRef.current = tabsRef.current;
      hasMovedDuringDrag.current = false;
      setPanningState({ isPanning: false, panStart: { x: 0, y: 0 }, initialTransform: { x: 0, y: 0 } });

      const targetGroup = (activeTab.groups || []).find((g) => g.id === groupId);
      if (!targetGroup) return;

      setSelectedGroupId(groupId);
      setSelectedNodeId('');
      setSelectedEdgeId('');

      const mouseX = (event.clientX - transform.x) / transform.scale;
      const mouseY = (event.clientY - transform.y) / transform.scale;

      // Find all nodes positioned inside or overlapping this group frame to move them along seamlessly
      const nodesInside = nodes.filter((n) => {
        const nd = _getNodeDimensions(n);
        const cx = n.position.x + nd.width / 2;
        const cy = n.position.y + nd.height / 2;
        const centerInside =
          cx >= targetGroup.position.x &&
          cx <= targetGroup.position.x + targetGroup.width &&
          cy >= targetGroup.position.y &&
          cy <= targetGroup.position.y + targetGroup.height;
        const overlaps =
          n.position.x < targetGroup.position.x + targetGroup.width &&
          n.position.x + nd.width > targetGroup.position.x &&
          n.position.y < targetGroup.position.y + targetGroup.height &&
          n.position.y + nd.height > targetGroup.position.y;
        return centerInside || overlaps;
      });

      setGroupDraggingState({
        isDragging: true,
        groupId,
        dragOffset: {
          x: mouseX - targetGroup.position.x,
          y: mouseY - targetGroup.position.y,
        },
        initialGroupPos: {
          x: targetGroup.position.x,
          y: targetGroup.position.y,
        },
        initialNodePositions: nodesInside.map((n) => ({
          nodeId: n.id,
          x: n.position.x,
          y: n.position.y,
        })),
      });
    },
    [isViewOnly, activeTab.groups, nodes, transform],
  );

  const handleStartGroupResize = useCallback(
    (event: React.MouseEvent, groupId: string, mode: 'both' | 'horizontal' | 'vertical' = 'both'): void => {
      if (isViewOnly) return;
      event.preventDefault();
      event.stopPropagation();
      dragSnapshotRef.current = tabsRef.current;
      hasMovedDuringDrag.current = false;
      setPanningState({ isPanning: false, panStart: { x: 0, y: 0 }, initialTransform: { x: 0, y: 0 } });

      const targetGroup = (activeTab.groups || []).find((g) => g.id === groupId);
      if (!targetGroup) return;

      setSelectedGroupId(groupId);
      setGroupResizingState({
        isResizing: true,
        groupId,
        mode,
        startPos: { x: event.clientX, y: event.clientY },
        initialDims: { width: targetGroup.width, height: targetGroup.height },
      });
    },
    [isViewOnly, activeTab.groups],
  );

  const handleUpdateNodeLabel = useCallback(
    (nodeId: string, label: string): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, nodes: t.nodes.map((n) => (n.id === nodeId ? { ...n, label } : n)) }
            : t,
        ),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleUpdateNodeCategory = useCallback(
    (nodeId: string, moduleCategory: string): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, nodes: t.nodes.map((n) => (n.id === nodeId ? { ...n, moduleCategory } : n)) }
            : t,
        ),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleUpdateNodeColor = useCallback(
    (nodeId: string, colorTheme: NodeColorTheme): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, nodes: t.nodes.map((n) => (n.id === nodeId ? { ...n, colorTheme } : n)) }
            : t,
        ),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleDeleteSelectedNode = useCallback((): void => {
    if (isViewOnly) return;
    if (!selectedNodeId) return;

    recordHistory();
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        return {
          ...t,
          nodes: t.nodes.filter((node) => node.id !== selectedNodeId),
          edges: t.edges.filter(
            (edge) =>
              edge.sourceNodeId !== selectedNodeId && edge.targetNodeId !== selectedNodeId,
          ),
        };
      }),
    );

    setSelectedNodeId('');
  }, [isViewOnly, selectedNodeId, activeTabId, recordHistory]);

  const handleDeleteSelectedEdge = useCallback((): void => {
    if (isViewOnly) return;
    if (!selectedEdgeId) return;

    recordHistory();
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        return {
          ...t,
          edges: t.edges.filter((edge) => edge.id !== selectedEdgeId),
        };
      }),
    );

    setSelectedEdgeId('');
  }, [isViewOnly, selectedEdgeId, activeTabId, recordHistory]);

  const handleSetConnectorStyle = useCallback((style: 'orthogonal' | 'curved' | 'straight'): void => {
    setConnectorStyle(style);
  }, []);

  const handleSelectEdge = useCallback((edgeId: string): void => {
    setSelectedEdgeId(edgeId);
    setSelectedNodeId('');
  }, []);

  const handleOpenEditEdgeModal = useCallback(
    (_edgeId: string): void => {
      // Direct manipulation is used instead of modal popup
    },
    [],
  );

  const handleCloseEditEdgeModal = useCallback((): void => {
    setEditEdgeModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleUpdateEditEdgeField = useCallback(
    (field: keyof EditEdgeModalData, value: string): void => {
      setEditEdgeModal((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSaveEditEdge = useCallback(
    (e?: React.FormEvent): void => {
      if (e) e.preventDefault();
      if (!editEdgeModal.edgeId || !editEdgeModal.sourceNodeId || !editEdgeModal.targetNodeId) return;
      if (editEdgeModal.sourceNodeId === editEdgeModal.targetNodeId) return;

      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.map((edge) => {
              if (edge.id !== editEdgeModal.edgeId) return edge;
              return {
                ...edge,
                sourceNodeId: editEdgeModal.sourceNodeId,
                targetNodeId: editEdgeModal.targetNodeId,
                label: editEdgeModal.label.trim(),
                sourceAnchor: editEdgeModal.sourceAnchor || 'auto',
                targetAnchor: editEdgeModal.targetAnchor || 'auto',
              };
            }),
          };
        }),
      );
      setEditEdgeModal((prev) => ({ ...prev, isOpen: false }));
    },
    [editEdgeModal, activeTabId, recordHistory],
  );

  const handleUpdateEdgeLabel = useCallback(
    (edgeId: string, label: string): void => {
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.map((edge) => {
              if (edge.id !== edgeId) return edge;
              return {
                ...edge,
                label,
              };
            }),
          };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleUpdateEdgeColor = useCallback(
    (edgeId: string, color: string): void => {
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.map((edge) => {
              if (edge.id !== edgeId) return edge;
              return {
                ...edge,
                color,
              };
            }),
          };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleSetEdgeTargetAnchor = useCallback(
    (edgeId: string, anchor: 'auto' | 'top' | 'bottom' | 'left' | 'right'): void => {
      if (isViewOnly) return;
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.map((ed) => {
              if (ed.id !== edgeId) return ed;
              return {
                ...ed,
                targetAnchor: anchor,
              };
            }),
          };
        }),
      );
    },
    [isViewOnly, activeTabId, recordHistory],
  );

  const handleSetEdgeSourceAnchor = useCallback(
    (edgeId: string, anchor: 'auto' | 'top' | 'bottom' | 'left' | 'right'): void => {
      if (isViewOnly) return;
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.map((ed) => {
              if (ed.id !== edgeId) return ed;
              return {
                ...ed,
                sourceAnchor: anchor,
              };
            }),
          };
        }),
      );
    },
    [isViewOnly, activeTabId, recordHistory],
  );

  const handleResetEdgeAnchors = useCallback(
    (edgeId: string): void => {
      if (isViewOnly) return;
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.map((ed) => {
              if (ed.id !== edgeId) return ed;
              return {
                ...ed,
                sourceAnchor: 'auto',
                targetAnchor: 'auto',
                waypointOffset: { x: 0, y: 0 },
              };
            }),
          };
        }),
      );
    },
    [isViewOnly, activeTabId, recordHistory],
  );

  const handleDeleteEdgeById = useCallback(
    (edgeId: string): void => {
      if (isViewOnly) return;
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.filter((edge) => edge.id !== edgeId),
          };
        }),
      );
      if (selectedEdgeId === edgeId) {
        setSelectedEdgeId('');
      }
      if (editEdgeModal.isOpen && editEdgeModal.edgeId === edgeId) {
        setEditEdgeModal((prev) => ({ ...prev, isOpen: false }));
      }
    },
    [isViewOnly, activeTabId, recordHistory, selectedEdgeId, editEdgeModal],
  );

  const handleFlipEdgeDirection = useCallback((): void => {
    setEditEdgeModal((prev) => ({
      ...prev,
      sourceNodeId: prev.targetNodeId,
      targetNodeId: prev.sourceNodeId,
    }));
  }, []);

  const handleStartEdgeWaypointDrag = useCallback(
    (event: React.MouseEvent, edgeId: string): void => {
      if (isViewOnly) return;
      event.preventDefault();
      event.stopPropagation();

      dragSnapshotRef.current = JSON.parse(JSON.stringify(tabs));
      hasMovedDuringDrag.current = false;

      setSelectedEdgeId(edgeId);
      setSelectedNodeId('');

      const activeEdges = activeTab.edges || [];
      const currentEdge = activeEdges.find((e) => e.id === edgeId);
      const initialOffset = currentEdge?.waypointOffset ?? { x: 0, y: 0 };

      setEdgeWaypointDragState({
        isDragging: true,
        edgeId,
        startPos: { x: event.clientX, y: event.clientY },
        initialWaypointOffset: { ...initialOffset },
      });
    },
    [isViewOnly, tabs, activeTab.edges],
  );

  const handleResetEdgeWaypoint = useCallback(
    (edgeId: string): void => {
      if (isViewOnly) return;
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            edges: t.edges.map((ed) => {
              if (ed.id !== edgeId) return ed;
              const { waypointOffset, ...rest } = ed;
              return rest;
            }),
          };
        }),
      );
    },
    [isViewOnly, activeTabId, recordHistory],
  );

  const handleStartEdgeEndpointDrag = useCallback(
    (event: React.MouseEvent, edgeId: string, endpointType: 'source' | 'target'): void => {
      if (isViewOnly) return;
      event.preventDefault();
      event.stopPropagation();

      dragSnapshotRef.current = JSON.parse(JSON.stringify(tabs));
      hasMovedDuringDrag.current = false;
      setSelectedEdgeId(edgeId);
      setSelectedNodeId('');

      const clientX = event.clientX;
      const clientY = event.clientY;
      const rect = mainContainerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      const canvasX = (clientX - rect.left - transform.x) / transform.scale;
      const canvasY = (clientY - rect.top - transform.y) / transform.scale;

      const edge = activeTab.edges.find((e) => e.id === edgeId);
      const initialNodeId = endpointType === 'target' ? edge?.targetNodeId : edge?.sourceNodeId;
      const initialAnchor = endpointType === 'target' ? edge?.targetAnchor : edge?.sourceAnchor;
      const sanitizedAnchor = initialAnchor && initialAnchor !== 'auto' ? initialAnchor : undefined;

      setEdgeEndpointDragState({
        isDragging: true,
        edgeId,
        endpointType,
        currentPos: { x: canvasX, y: canvasY },
        candidateNodeId: initialNodeId,
        candidateAnchor: sanitizedAnchor,
      });
    },
    [isViewOnly, tabs, activeTab.edges, transform],
  );

  // Keyboard shortcut listener for deleting selected Node or Edge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl && (activeEl as HTMLElement).isContentEditable);
      if (isTyping) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedEdgeId) {
          e.preventDefault();
          handleDeleteSelectedEdge();
        } else if (selectedNodeId) {
          e.preventDefault();
          handleDeleteSelectedNode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEdgeId, selectedNodeId, handleDeleteSelectedEdge, handleDeleteSelectedNode]);

  // Fast Butter-Smooth Dragging
  const handleStartNodeDrag = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, nodeId: string): void => {
      if (isViewOnly) return;
      const targetElement = event.target as HTMLElement;
      if (
        targetElement.tagName === 'INPUT' ||
        targetElement.tagName === 'BUTTON' ||
        targetElement.closest('button') ||
        targetElement.closest('input')
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragSnapshotRef.current = tabsRef.current;
      hasMovedDuringDrag.current = false;
      const targetNode = _findNodeById(nodes, nodeId);
      if (!targetNode) return;

      setSelectedNodeId(nodeId);
      setSelectedEdgeId('');

      // Explicitly cancel any canvas panning to avoid conflict
      setPanningState({
        isPanning: false,
        panStart: { x: 0, y: 0 },
        initialTransform: { x: 0, y: 0 },
      });

      const mouseX = (event.clientX - transform.x) / transform.scale;
      const mouseY = (event.clientY - transform.y) / transform.scale;

      // If user holds Shift while dragging a node, check if node is in a group frame to move whole group together
      if (event.shiftKey) {
        const parentGroup = (activeTab.groups || []).find((g) => {
          const nd = _getNodeDimensions(targetNode);
          const cx = targetNode.position.x + nd.width / 2;
          const cy = targetNode.position.y + nd.height / 2;
          const centerInside =
            cx >= g.position.x &&
            cx <= g.position.x + g.width &&
            cy >= g.position.y &&
            cy <= g.position.y + g.height;
          const overlaps =
            targetNode.position.x < g.position.x + g.width &&
            targetNode.position.x + nd.width > g.position.x &&
            targetNode.position.y < g.position.y + g.height &&
            targetNode.position.y + nd.height > g.position.y;
          return centerInside || overlaps;
        });

        if (parentGroup) {
          handleStartGroupDrag(event, parentGroup.id);
          return;
        }
      }

      setDraggingState({
        isDragging: true,
        nodeId,
        dragOffset: {
          x: mouseX - targetNode.position.x,
          y: mouseY - targetNode.position.y,
        },
      });
    },
    [isViewOnly, nodes, transform, activeTab.groups, handleStartGroupDrag],
  );

  // Drag-to-Resize Node (Supports both, horizontal-only, and vertical-only)
  const handleStartNodeResize = useCallback(
    (event: React.MouseEvent, nodeId: string, mode: 'both' | 'horizontal' | 'vertical' = 'both'): void => {
      if (isViewOnly) return;
      event.preventDefault();
      event.stopPropagation();
      dragSnapshotRef.current = tabsRef.current;
      hasMovedDuringDrag.current = false;
      setPanningState({
        isPanning: false,
        panStart: { x: 0, y: 0 },
        initialTransform: { x: 0, y: 0 },
      });
      const node = _findNodeById(nodes, nodeId);
      if (!node) return;
      const dims = _getNodeDimensions(node);

      setResizingState({
        isResizing: true,
        nodeId,
        mode,
        startPos: { x: event.clientX, y: event.clientY },
        initialDims: { width: dims.width, height: dims.height },
      });
    },
    [isViewOnly, nodes],
  );

  const handleStartConnection = useCallback(
    (event: React.MouseEvent, nodeId: string, sourceAnchor?: 'top' | 'bottom' | 'left' | 'right'): void => {
      if (isViewOnly) return;
      event.stopPropagation();
      const mouseX = (event.clientX - transform.x) / transform.scale;
      const mouseY = (event.clientY - transform.y) / transform.scale;

      setConnectingState({
        isConnecting: true,
        sourceNodeId: nodeId,
        sourceAnchor,
        currentMousePosition: { x: mouseX, y: mouseY },
      });
    },
    [isViewOnly, transform],
  );

  const handleCompleteConnection = useCallback(
    (targetNodeId: string, targetAnchor?: 'top' | 'bottom' | 'left' | 'right'): void => {
      if (!connectingState.isConnecting) return;

      const sourceId = connectingState.sourceNodeId;
      if (sourceId && sourceId !== targetNodeId) {
        const isDuplicate = edges.some(
          (edge) =>
            edge.sourceNodeId === sourceId &&
            edge.targetNodeId === targetNodeId &&
            (edge.sourceAnchor || 'auto') === (connectingState.sourceAnchor || 'auto') &&
            (edge.targetAnchor || 'auto') === (targetAnchor || 'auto'),
        );

        if (!isDuplicate) {
          recordHistory();
          const newEdge: FlowEdge = {
            id: _generateUniqueId('edge'),
            sourceNodeId: sourceId,
            targetNodeId,
            sourceAnchor: connectingState.sourceAnchor,
            targetAnchor: targetAnchor || 'auto',
            label: 'Lanjut',
          };

          setTabs((prev) =>
            prev.map((t) => (t.id === activeTabId ? { ...t, edges: [...t.edges, newEdge] } : t)),
          );
          setSelectedEdgeId(newEdge.id);
        }
      }

      setConnectingState({
        isConnecting: false,
        sourceNodeId: '',
        currentMousePosition: { x: 0, y: 0 },
      });
    },
    [connectingState, edges, activeTabId, recordHistory],
  );

  const handleCanvasMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (
        event.defaultPrevented ||
        draggingState.isDragging ||
        resizingState.isResizing ||
        tableResizingState.isResizing ||
        groupDraggingState.isDragging ||
        groupResizingState.isResizing ||
        edgeWaypointDragState.isDragging
      ) {
        return;
      }

      const target = event.target as HTMLElement;
      const isInteractive = Boolean(
        target.closest('[data-node-id]') ||
        target.closest('[data-group-id]') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.interactive-control')
      );

      if (!isInteractive) {
        setSelectedNodeId('');
        setSelectedEdgeId('');

        setPanningState({
          isPanning: true,
          panStart: { x: event.clientX, y: event.clientY },
          initialTransform: { x: transform.x, y: transform.y },
        });
      }
    },
    [transform, draggingState.isDragging, resizingState.isResizing, tableResizingState.isResizing],
  );

  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (connectingState.isConnecting) {
        const mouseX = (event.clientX - transform.x) / transform.scale;
        const mouseY = (event.clientY - transform.y) / transform.scale;

        setConnectingState((previous) => ({
          ...previous,
          currentMousePosition: { x: mouseX, y: mouseY },
        }));
      }
    },
    [connectingState, transform],
  );

  const handleCanvasMouseUp = useCallback((): void => {
    if (hasMovedDuringDrag.current && dragSnapshotRef.current) {
      const snap = dragSnapshotRef.current;
      setHistoryPast((prev) => {
        const next = [...prev, snap];
        return next.length > 30 ? next.slice(next.length - 30) : next;
      });
      setHistoryFuture([]);
    }
    dragSnapshotRef.current = null;
    hasMovedDuringDrag.current = false;

    if (draggingState.isDragging) {
      setDraggingState({
        isDragging: false,
        nodeId: '',
        dragOffset: { x: 0, y: 0 },
      });
    }

    if (resizingState.isResizing) {
      setResizingState({
        isResizing: false,
        nodeId: '',
        startPos: { x: 0, y: 0 },
        initialDims: { width: 220, height: 96 },
      });
    }

    if (tableResizingState.isResizing) {
      setTableResizingState({
        isResizing: false,
        startX: 0,
        initialWidth: 1400,
      });
    }

    if (laneResizingState.isResizing) {
      setLaneResizingState({
        isResizing: false,
        laneId: '',
        startY: 0,
        initialHeight: 180,
      });
    }

    if (groupDraggingState.isDragging) {
      setGroupDraggingState({
        isDragging: false,
        groupId: '',
        dragOffset: { x: 0, y: 0 },
        initialGroupPos: { x: 0, y: 0 },
        initialNodePositions: [],
      });
    }

    if (groupResizingState.isResizing) {
      setGroupResizingState({
        isResizing: false,
        groupId: '',
        mode: 'both',
        startPos: { x: 0, y: 0 },
        initialDims: { width: 380, height: 240 },
      });
    }

    if (panningState.isPanning) {
      setPanningState({
        isPanning: false,
        panStart: { x: 0, y: 0 },
        initialTransform: { x: 0, y: 0 },
      });
    }

    if (edgeWaypointDragState.isDragging) {
      setEdgeWaypointDragState({
        isDragging: false,
        edgeId: '',
        startPos: { x: 0, y: 0 },
        initialWaypointOffset: { x: 0, y: 0 },
      });
    }

    if (connectingState.isConnecting) {
      setConnectingState({
        isConnecting: false,
        sourceNodeId: '',
        currentMousePosition: { x: 0, y: 0 },
      });
    }

    if (edgeEndpointDragState.isDragging) {
      setEdgeEndpointDragState({
        isDragging: false,
        edgeId: '',
        endpointType: 'target',
        currentPos: { x: 0, y: 0 },
      });
    }
  }, [
    draggingState.isDragging,
    resizingState.isResizing,
    tableResizingState.isResizing,
    laneResizingState.isResizing,
    groupDraggingState.isDragging,
    groupResizingState.isResizing,
    panningState.isPanning,
    connectingState.isConnecting,
    edgeWaypointDragState.isDragging,
    edgeEndpointDragState.isDragging,
    recordHistory,
  ]);

  // Window-level mousemove & mouseup listeners for 100% rock-solid drag & drop without drops
  useEffect(() => {
    if (
      !draggingState.isDragging &&
      !panningState.isPanning &&
      !resizingState.isResizing &&
      !tableResizingState.isResizing &&
      !laneResizingState.isResizing &&
      !groupDraggingState.isDragging &&
      !groupResizingState.isResizing &&
      !edgeWaypointDragState.isDragging &&
      !edgeEndpointDragState.isDragging &&
      !connectingState.isConnecting
    ) {
      return;
    }

    const onWindowMouseMove = (event: MouseEvent): void => {
      if (!panningState.isPanning) {
        hasMovedDuringDrag.current = true;
      }
      // 1. Table width resizing (Butter-smooth with rAF)
      if (tableResizingState.isResizing) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const clientX = event.clientX;
        rafRef.current = requestAnimationFrame(() => {
          const deltaX = (clientX - tableResizingState.startX) / transform.scale;
          const newWidth = Math.max(700, Math.min(5000, Math.round(tableResizingState.initialWidth + deltaX)));
          setTabs((prevTabs) =>
            prevTabs.map((t) =>
              t.id === activeTabId && t.tableWidth !== newWidth
                ? { ...t, tableWidth: newWidth }
                : t,
            ),
          );
        });
      } else if (laneResizingState.isResizing && laneResizingState.laneId) {
        // 2. Swimlane Lane Height resizing (Butter-smooth with rAF)
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const clientY = event.clientY;
        rafRef.current = requestAnimationFrame(() => {
          const deltaY = (clientY - laneResizingState.startY) / transform.scale;
          const newHeight = Math.max(80, Math.min(1000, Math.round(laneResizingState.initialHeight + deltaY)));
          setTabs((prevTabs) =>
            prevTabs.map((t) => {
              if (t.id !== activeTabId) return t;
              return {
                ...t,
                swimlanes: (t.swimlanes || []).map((lane) =>
                  lane.id === laneResizingState.laneId && lane.height !== newHeight
                    ? { ...lane, height: newHeight }
                    : lane,
                ),
              };
            }),
          );
        });
      } else if (groupResizingState.isResizing && groupResizingState.groupId) {
        // 3. Group Frame resizing
        const deltaX = (event.clientX - groupResizingState.startPos.x) / transform.scale;
        const deltaY = (event.clientY - groupResizingState.startPos.y) / transform.scale;
        const mode = groupResizingState.mode || 'both';
        const newWidth = mode === 'vertical'
          ? groupResizingState.initialDims.width
          : Math.max(180, Math.min(2500, Math.round(groupResizingState.initialDims.width + deltaX)));
        const newHeight = mode === 'horizontal'
          ? groupResizingState.initialDims.height
          : Math.max(100, Math.min(2000, Math.round(groupResizingState.initialDims.height + deltaY)));

        setTabs((prevTabs) =>
          prevTabs.map((t) =>
            t.id === activeTabId
              ? {
                  ...t,
                  groups: (t.groups || []).map((g) =>
                    g.id === groupResizingState.groupId
                      ? { ...g, width: newWidth, height: newHeight }
                      : g,
                  ),
                }
              : t,
          ),
        );
      } else if (groupDraggingState.isDragging && groupDraggingState.groupId) {
        // 4. Group Frame dragging (moves frame and all nodes inside it synchronously)
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const clientX = event.clientX;
        const clientY = event.clientY;

        rafRef.current = requestAnimationFrame(() => {
          const mouseX = (clientX - transform.x) / transform.scale;
          const mouseY = (clientY - transform.y) / transform.scale;
          const updatedX = Math.round(mouseX - groupDraggingState.dragOffset.x);
          const updatedY = Math.round(mouseY - groupDraggingState.dragOffset.y);

          const totalDeltaX = updatedX - groupDraggingState.initialGroupPos.x;
          const totalDeltaY = updatedY - groupDraggingState.initialGroupPos.y;

          const initialPosMap = new Map(
            groupDraggingState.initialNodePositions.map((p) => [p.nodeId, p]),
          );

          setTabs((prevTabs) =>
            prevTabs.map((t) => {
              if (t.id !== activeTabId) return t;

              return {
                ...t,
                groups: (t.groups || []).map((g) =>
                  g.id === groupDraggingState.groupId
                    ? { ...g, position: { x: updatedX, y: updatedY } }
                    : g,
                ),
                nodes: t.nodes.map((n) => {
                  const initialP = initialPosMap.get(n.id);
                  if (initialP) {
                    return {
                      ...n,
                      position: {
                        x: Math.round(initialP.x + totalDeltaX),
                        y: Math.round(initialP.y + totalDeltaY),
                      },
                    };
                  }
                  return n;
                }),
              };
            }),
          );
        });
      } else if (resizingState.isResizing && resizingState.nodeId) {
        // 5. Node resizing (supports both, horizontal, vertical) - with rAF
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const clientX = event.clientX;
        const clientY = event.clientY;

        rafRef.current = requestAnimationFrame(() => {
          const deltaX = (clientX - resizingState.startPos.x) / transform.scale;
          const deltaY = (clientY - resizingState.startPos.y) / transform.scale;

          const mode = resizingState.mode || 'both';
          const newWidth = mode === 'vertical'
            ? resizingState.initialDims.width
            : Math.max(120, Math.min(800, Math.round(resizingState.initialDims.width + deltaX)));
          const newHeight = mode === 'horizontal'
            ? resizingState.initialDims.height
            : Math.max(40, Math.min(600, Math.round(resizingState.initialDims.height + deltaY)));

          setTabs((prevTabs) =>
            prevTabs.map((t) => {
              if (t.id !== activeTabId) return t;
              return {
                ...t,
                nodes: t.nodes.map((n) =>
                  n.id === resizingState.nodeId && (n.width !== newWidth || n.height !== newHeight)
                    ? { ...n, width: newWidth, height: newHeight }
                    : n,
                ),
              };
            }),
          );
        });
      } else if (draggingState.isDragging && draggingState.nodeId) {
        // 6. Node dragging
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        const clientX = event.clientX;
        const clientY = event.clientY;

        rafRef.current = requestAnimationFrame(() => {
          const mouseX = (clientX - transform.x) / transform.scale;
          const mouseY = (clientY - transform.y) / transform.scale;

          const updatedX = Math.round(mouseX - draggingState.dragOffset.x);
          const updatedY = Math.round(mouseY - draggingState.dragOffset.y);

          setTabs((prevTabs) =>
            prevTabs.map((t) =>
              t.id === activeTabId
                ? {
                    ...t,
                    nodes: t.nodes.map((node) =>
                      node.id === draggingState.nodeId
                        ? {
                            ...node,
                            position: {
                              x: updatedX,
                              y: updatedY,
                            },
                          }
                        : node,
                    ),
                  }
                : t,
            ),
          );
        });
      } else if (panningState.isPanning) {
        // 7. Canvas panning
        const deltaX = event.clientX - panningState.panStart.x;
        const deltaY = event.clientY - panningState.panStart.y;

        setTabs((prevTabs) =>
          prevTabs.map((t) =>
            t.id === activeTabId
              ? {
                  ...t,
                  transform: {
                    ...t.transform,
                    x: Math.round(panningState.initialTransform.x + deltaX),
                    y: Math.round(panningState.initialTransform.y + deltaY),
                  },
                }
              : t,
          ),
        );
      } else if (edgeWaypointDragState.isDragging && edgeWaypointDragState.edgeId) {
        // 8. Edge waypoint / bend dragging (Butter-smooth with rAF)
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const clientX = event.clientX;
        const clientY = event.clientY;

        rafRef.current = requestAnimationFrame(() => {
          const deltaX = (clientX - edgeWaypointDragState.startPos.x) / transform.scale;
          const deltaY = (clientY - edgeWaypointDragState.startPos.y) / transform.scale;
          const updatedX = Math.round(edgeWaypointDragState.initialWaypointOffset.x + deltaX);
          const updatedY = Math.round(edgeWaypointDragState.initialWaypointOffset.y + deltaY);

          setTabs((prevTabs) =>
            prevTabs.map((t) => {
              if (t.id !== activeTabId) return t;
              return {
                ...t,
                edges: t.edges.map((ed) =>
                  ed.id === edgeWaypointDragState.edgeId
                    ? { ...ed, waypointOffset: { x: updatedX, y: updatedY } }
                    : ed,
                ),
              };
            }),
          );
        });
      } else if (edgeEndpointDragState.isDragging && edgeEndpointDragState.edgeId) {
        // 9. Edge endpoint dragging (drag the circular handle at arrowhead or origin)
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const clientX = event.clientX;
        const clientY = event.clientY;

        rafRef.current = requestAnimationFrame(() => {
          const rect = mainContainerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
          const canvasX = (clientX - rect.left - transform.x) / transform.scale;
          const canvasY = (clientY - rect.top - transform.y) / transform.scale;

          let bestNodeId: string | undefined;
          let bestAnchor: 'top' | 'bottom' | 'left' | 'right' | undefined;
          let bestDist = Infinity;

          activeTab.nodes.forEach((n) => {
            const dims = _getNodeDimensions(n);
            const ports: { anchor: 'top' | 'bottom' | 'left' | 'right'; x: number; y: number }[] = [
              { anchor: 'top', x: n.position.x + dims.width / 2, y: n.position.y },
              { anchor: 'bottom', x: n.position.x + dims.width / 2, y: n.position.y + dims.height },
              { anchor: 'left', x: n.position.x, y: n.position.y + dims.height / 2 },
              { anchor: 'right', x: n.position.x + dims.width, y: n.position.y + dims.height / 2 },
            ];

            ports.forEach((p) => {
              const d = Math.hypot(canvasX - p.x, canvasY - p.y);
              if (d < bestDist) {
                bestDist = d;
                bestNodeId = n.id;
                bestAnchor = p.anchor;
              }
            });
          });

          // Magnetic snapping threshold (within 140px)
          const snappedNodeId = bestDist < 140 ? bestNodeId : undefined;
          const snappedAnchor = bestDist < 140 ? bestAnchor : undefined;

          setEdgeEndpointDragState((prev) => ({
            ...prev,
            currentPos: { x: canvasX, y: canvasY },
            candidateNodeId: snappedNodeId,
            candidateAnchor: snappedAnchor,
          }));

          if (snappedNodeId && snappedAnchor) {
            setTabs((prevTabs) =>
              prevTabs.map((t) => {
                if (t.id !== activeTabId) return t;
                return {
                  ...t,
                  edges: t.edges.map((ed) => {
                    if (ed.id !== edgeEndpointDragState.edgeId) return ed;
                    if (edgeEndpointDragState.endpointType === 'target') {
                      return {
                        ...ed,
                        targetNodeId: snappedNodeId,
                        targetAnchor: snappedAnchor,
                      };
                    } else {
                      return {
                        ...ed,
                        sourceNodeId: snappedNodeId,
                        sourceAnchor: snappedAnchor,
                      };
                    }
                  }),
                };
              }),
            );
          }
        });
      } else if (connectingState.isConnecting && connectingState.sourceNodeId) {
        // 10. Direct Drag-to-Connect from node handle or plus button
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const clientX = event.clientX;
        const clientY = event.clientY;
        rafRef.current = requestAnimationFrame(() => {
          const rect = mainContainerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
          const mouseX = (clientX - rect.left - transform.x) / transform.scale;
          const mouseY = (clientY - rect.top - transform.y) / transform.scale;

          let candidateId: string | undefined;
          activeTab.nodes.forEach((n) => {
            if (n.id === connectingState.sourceNodeId) return;
            const dims = _getNodeDimensions(n);
            const inside =
              mouseX >= n.position.x - 20 &&
              mouseX <= n.position.x + dims.width + 20 &&
              mouseY >= n.position.y - 20 &&
              mouseY <= n.position.y + dims.height + 20;
            if (inside) {
              candidateId = n.id;
            }
          });

          setConnectingState((prev) => ({
            ...prev,
            currentMousePosition: { x: mouseX, y: mouseY },
            candidateTargetNodeId: candidateId,
          }));
        });
      }
    };

    const onWindowMouseUp = (): void => {
      if (connectingState.isConnecting) {
        if (connectingState.candidateTargetNodeId) {
          handleCompleteConnection(connectingState.candidateTargetNodeId);
        } else {
          setConnectingState({
            isConnecting: false,
            sourceNodeId: '',
            currentMousePosition: { x: 0, y: 0 },
          });
        }
      }
      handleCanvasMouseUp();
    };

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    draggingState,
    resizingState,
    tableResizingState,
    laneResizingState,
    panningState,
    edgeWaypointDragState,
    edgeEndpointDragState,
    connectingState,
    activeTab.nodes,
    transform,
    activeTabId,
    handleCanvasMouseUp,
    handleCompleteConnection,
  ]);

  // Zoom controls
  const handleZoomIn = useCallback((): void => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              transform: {
                ...t.transform,
                scale: Math.min(CANVAS_CONFIG.MAX_SCALE, t.transform.scale + CANVAS_CONFIG.SCALE_STEP),
              },
            }
          : t,
      ),
    );
  }, [activeTabId]);

  const handleZoomOut = useCallback((): void => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              transform: {
                ...t.transform,
                scale: Math.max(CANVAS_CONFIG.MIN_SCALE, t.transform.scale - CANVAS_CONFIG.SCALE_STEP),
              },
            }
          : t,
      ),
    );
  }, [activeTabId]);

  const handleResetZoom = useCallback((): void => {
    const containerW =
      canvasRef.current?.clientWidth ||
      (typeof window !== 'undefined' ? window.innerWidth : 1280);
    const curStart = nodes.find((n) => n.type === 'start') ?? nodes[0];
    const dims = curStart ? _getNodeDimensions(curStart) : { width: 160, height: 50 };
    const startCenterX = (curStart?.position.x ?? 520) + dims.width / 2;
    const centeredX = Math.round(containerW / 2 - startCenterX);

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              transform: { x: centeredX, y: 40, scale: CANVAS_CONFIG.DEFAULT_SCALE },
            }
          : t,
      ),
    );
  }, [activeTabId, nodes]);

  const handleWheelPan = useCallback(
    (deltaX: number, deltaY: number): void => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                transform: {
                  ...t.transform,
                  x: Math.round(t.transform.x - deltaX),
                  y: Math.round(t.transform.y - deltaY),
                },
              }
            : t,
        ),
      );
    },
    [activeTabId],
  );

  const handleWheelZoom = useCallback(
    (clientX: number, clientY: number, zoomFactor: number): void => {
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== activeTabId) return t;
          const currentScale = t.transform.scale;
          const newScale = Math.min(
            CANVAS_CONFIG.MAX_SCALE,
            Math.max(CANVAS_CONFIG.MIN_SCALE, Number((currentScale * zoomFactor).toFixed(3))),
          );
          if (newScale === currentScale) return t;

          const rect = mainContainerRef.current?.getBoundingClientRect() || {
            left: 0,
            top: 0,
          };
          const mouseX = clientX - rect.left;
          const mouseY = clientY - rect.top;

          const newX = Math.round(mouseX - (mouseX - t.transform.x) * (newScale / currentScale));
          const newY = Math.round(mouseY - (mouseY - t.transform.y) * (newScale / currentScale));

          return {
            ...t,
            transform: {
              x: newX,
              y: newY,
              scale: newScale,
            },
          };
        }),
      );
    },
    [activeTabId],
  );

  // Wheel listener attached in hook (no lifecycle in component!)
  useEffect(() => {
    const el = mainContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent): void => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        handleWheelZoom(e.clientX, e.clientY, zoomFactor);
      } else {
        handleWheelPan(e.deltaX, e.deltaY);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheelZoom, handleWheelPan]);

  // Export PNG
  const handleExportPng = useCallback(async (): Promise<void> => {
    if (!canvasRef.current) return;
    try {
      setIsExportingPng(true);
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        backgroundColor: '#f8fafc',
      });
      const link = document.createElement('a');
      link.download = `${activeTab.title.toLowerCase().replace(/\s+/g, '_')}_flow.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExportingPng(false);
    }
  }, [activeTab.title]);

  // Export JSON
  const handleExportJson = useCallback((): void => {
    const exportPayload: SchemaExportData = {
      version: '1.2.0',
      appName: 'FlowGen Chrome Edition',
      exportDate: new Date().toISOString(),
      nodes,
      edges,
      swimlanes: activeTab.swimlanes,
    };
    const fileName = `${activeTab.title.toLowerCase().replace(/\s+/g, '_')}_schema.json`;
    _downloadJsonFile(exportPayload, fileName);
  }, [nodes, edges, activeTab.title, activeTab.swimlanes]);

  const handleImportJsonClick = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e): void => {
        const content = e.target?.result as string;
        const validated = _validateSchemaJson(content);

        if (validated) {
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId
                ? {
                    ...t,
                    nodes: validated.nodes,
                    edges: validated.edges,
                    swimlanes: validated.swimlanes || t.swimlanes,
                    showGhostSkeleton: false,
                  }
                : t,
            ),
          );
        } else {
          alert('Format JSON diagram tidak valid!');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    [activeTabId],
  );

  const handleLoadTemplate = useCallback((): void => {
    recordHistory();
    const freshTab = createInitialProject(activeTab.type, activeTab.title);
    setTabs((prev) => prev.map((t) => (t.id === activeTabId ? freshTab : t)));
    setSelectedNodeId('start_node');
    setSelectedEdgeId('');
  }, [activeTab.type, activeTab.title, activeTabId, recordHistory]);

  const handleClearCanvas = useCallback((): void => {
    recordHistory();
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, nodes: [], edges: [], showGhostSkeleton: false } : t,
      ),
    );
    setSelectedNodeId('');
    setSelectedEdgeId('');
  }, [activeTabId, recordHistory]);

  const handleAddSwimlane = useCallback(
    (name: string, color = '#6366f1'): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== activeTabId) return t;
          const currentLanes = t.swimlanes || [];
          const newLane = {
            id: `lane_${Date.now()}`,
            name: name.trim() || `Lajur ${currentLanes.length + 1}`,
            color,
            height: 180,
          };
          return { ...t, swimlanes: [...currentLanes, newLane] };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleUpdateSwimlaneName = useCallback(
    (laneId: string, name: string): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            swimlanes: (t.swimlanes || []).map((l) => (l.id === laneId ? { ...l, name } : l)),
          };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleDeleteSwimlane = useCallback(
    (laneId: string): void => {
      recordHistory();
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== activeTabId) return t;
          return {
            ...t,
            swimlanes: (t.swimlanes || []).filter((l) => l.id !== laneId),
          };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleToggleHelpModal = useCallback((): void => {
    setIsHelpModalOpen((prev) => !prev);
  }, []);

  // Auto-focus calculations: detect when the viewport is panned far from the flow
  const startNode = nodes.find((n) => n.type === 'start') ?? nodes[0];
  const startNodeDims = startNode
    ? _getNodeDimensions(startNode)
    : { width: 140, height: 70 };
  const startCenterX = (startNode?.position.x ?? 100) + startNodeDims.width / 2;
  const startCenterY = (startNode?.position.y ?? 150) + startNodeDims.height / 2;

  const containerW = canvasRef.current?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const containerH = canvasRef.current?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
  const currentScale = transform.scale || 1;
  const viewportCenterX = (containerW / 2 - transform.x) / currentScale;
  const viewportCenterY = (containerH / 2 - transform.y) / currentScale;

  const distanceFromStart = Math.hypot(viewportCenterX - startCenterX, viewportCenterY - startCenterY);
  
  // Detect if start node or diagram origin is off-screen
  const startScreenX = startCenterX * currentScale + transform.x;
  const startScreenY = startCenterY * currentScale + transform.y;
  const isStartOffscreen =
    startScreenX < 40 ||
    startScreenX > containerW - 40 ||
    startScreenY < 40 ||
    startScreenY > containerH - 40;

  const isFarFromStart = isStartOffscreen || distanceFromStart > 320;

  const handleFocusStart = useCallback((): void => {
    const w = canvasRef.current?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const h = canvasRef.current?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
    const targetScale = 1.0;

    let newX = 40;
    let newY = 40;

    if (activeTab.type === 'swimlane') {
      newX = 40;
      newY = 40;
    } else {
      const curStart = nodes.find((n) => n.type === 'start') ?? nodes[0];
      const targetX = curStart ? curStart.position.x : 200;
      const targetY = curStart ? curStart.position.y : 100;
      const dims = curStart
        ? _getNodeDimensions(curStart)
        : { width: 160, height: 60 };
      newX = Math.round(w / 2 - (targetX + dims.width / 2) * targetScale);
      newY = Math.round(h / 3 - (targetY + dims.height / 2) * targetScale);
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              transform: {
                x: newX,
                y: newY,
                scale: targetScale,
              },
            }
          : t,
      ),
    );
  }, [activeTabId, activeTab.type, nodes]);

  const handlePanToPoint = useCallback(
    (canvasX: number, canvasY: number): void => {
      const w = canvasRef.current?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
      const h = canvasRef.current?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
      const scale = transform.scale || 1;
      const newX = Math.round(w / 2 - canvasX * scale);
      const newY = Math.round(h / 2 - canvasY * scale);

      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                transform: {
                  ...t.transform,
                  x: newX,
                  y: newY,
                },
              }
            : t,
        ),
      );
    },
    [activeTabId, transform.scale],
  );

  // Jira / Kanban Handlers
  const handleOpenCreateKanbanTask = useCallback(
    (defaultStatus: KanbanTaskStatus = 'todo', defaultSourceNodeId?: string): void => {
      // 1. Identify which workflow tab this task connects to
      let targetTab = defaultSourceNodeId
        ? tabs.find((t) => t.type !== 'kanban' && t.nodes?.some((n) => n.id === defaultSourceNodeId))
        : undefined;

      if (!targetTab) {
        targetTab = tabs.find((t) => t.id === activeTabId && t.type !== 'kanban');
      }

      if (!targetTab) {
        targetTab = tabs.find((t) => t.type !== 'kanban');
      }

      const defaultTabId = targetTab?.id || '';

      // 2. Locate node details for auto-filling
      const sourceNode = defaultSourceNodeId
        ? targetTab?.nodes?.find((n) => n.id === defaultSourceNodeId)
        : undefined;

      // 3. Find outgoing edge and target node if any
      const outgoingEdge = defaultSourceNodeId
        ? targetTab?.edges?.find((e) => e.sourceNodeId === defaultSourceNodeId)
        : undefined;
      const targetNode = outgoingEdge
        ? targetTab?.nodes?.find((n) => n.id === outgoingEdge.targetNodeId)
        : undefined;

      // 4. Auto-fill title, description, tags, and story points from node
      const autoTitle = sourceNode ? sourceNode.label : '';
      const autoDescription = sourceNode?.description || '';
      const autoTags = sourceNode?.moduleCategory || '';
      const autoIssueType = sourceNode?.type === 'decision' ? 'story' : 'task';
      const autoDuration = sourceNode?.type === 'decision' ? '3 Hari' : '2 Hari';
      const autoStoryPoints = sourceNode?.type === 'decision' ? '5' : '3';

      setKanbanTaskModal({
        isOpen: true,
        taskId: '',
        title: autoTitle,
        description: autoDescription,
        status: defaultStatus,
        priority: sourceNode?.type === 'decision' ? 'high' : 'medium',
        issueType: autoIssueType,
        sprint: kanbanSprintFilter !== 'all' ? kanbanSprintFilter : 'Sprint 1',
        duration: autoDuration,
        storyPoints: autoStoryPoints,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        acceptanceCriteria: '',
        assignee: 'Budi Santoso',
        tags: autoTags,
        linkedWorkflowTabId: defaultTabId,
        linkedSourceNodeId: defaultSourceNodeId || '',
        linkedTargetNodeId: targetNode ? targetNode.id : '',
        linkedEdgeLabel: outgoingEdge?.label || '',
      });
    },
    [tabs, activeTabId, kanbanSprintFilter],
  );

  const handleOpenEditKanbanTask = useCallback(
    (taskId: string): void => {
      const currentTasks = activeTab.kanbanTasks || [];
      const task = currentTasks.find((t) => t.id === taskId);
      if (!task) return;

      setKanbanTaskModal({
        isOpen: true,
        taskId: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        issueType: task.issueType || 'task',
        sprint: task.sprint || 'Sprint 1',
        duration: task.duration || '',
        storyPoints: task.storyPoints != null ? String(task.storyPoints) : '',
        startDate: task.startDate || '',
        dueDate: task.dueDate || '',
        acceptanceCriteria: task.acceptanceCriteria || '',
        assignee: task.assignee || '',
        tags: (task.tags || []).join(', '),
        linkedWorkflowTabId: task.linkedWorkflowTabId || tabs.find((t) => t.type !== 'kanban')?.id || '',
        linkedSourceNodeId: task.linkedSourceNodeId || '',
        linkedTargetNodeId: task.linkedTargetNodeId || '',
        linkedEdgeLabel: task.linkedEdgeLabel || '',
      });
    },
    [activeTab.kanbanTasks, tabs],
  );

  const handleCloseKanbanTaskModal = useCallback((): void => {
    setKanbanTaskModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleUpdateKanbanTaskField = useCallback(
    (field: keyof KanbanTaskModalData, value: string): void => {
      setKanbanTaskModal((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSaveKanbanTask = useCallback(
    (e?: React.FormEvent): void => {
      if (e) e.preventDefault();
      if (!kanbanTaskModal.title.trim()) return;

      recordHistory();
      const linkedTab = tabs.find((t) => t.id === kanbanTaskModal.linkedWorkflowTabId);
      const sourceNode = linkedTab?.nodes.find((n) => n.id === kanbanTaskModal.linkedSourceNodeId);
      const targetNode = linkedTab?.nodes.find((n) => n.id === kanbanTaskModal.linkedTargetNodeId);

      let edgeLabel = kanbanTaskModal.linkedEdgeLabel;
      if (linkedTab && sourceNode && targetNode && !edgeLabel) {
        const matchingEdge = linkedTab.edges.find(
          (ed) => ed.sourceNodeId === sourceNode.id && ed.targetNodeId === targetNode.id,
        );
        if (matchingEdge) edgeLabel = matchingEdge.label;
      }

      const parsedTags = kanbanTaskModal.tags.trim()
        ? kanbanTaskModal.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
        : undefined;

      const parsedStoryPoints = kanbanTaskModal.storyPoints.trim()
        ? !isNaN(Number(kanbanTaskModal.storyPoints))
          ? Number(kanbanTaskModal.storyPoints)
          : kanbanTaskModal.storyPoints.trim()
        : undefined;

      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          const currentTasks = tab.kanbanTasks || [];

          if (kanbanTaskModal.taskId) {
            const updated = currentTasks.map((t) => {
              if (t.id !== kanbanTaskModal.taskId) return t;
              return {
                ...t,
                title: kanbanTaskModal.title.trim(),
                description: kanbanTaskModal.description.trim(),
                status: kanbanTaskModal.status,
                priority: kanbanTaskModal.priority,
                issueType: kanbanTaskModal.issueType,
                sprint: kanbanTaskModal.sprint.trim() || undefined,
                duration: kanbanTaskModal.duration.trim() || undefined,
                storyPoints: parsedStoryPoints,
                startDate: kanbanTaskModal.startDate.trim() || undefined,
                dueDate: kanbanTaskModal.dueDate.trim() || undefined,
                acceptanceCriteria: kanbanTaskModal.acceptanceCriteria.trim() || undefined,
                assignee: kanbanTaskModal.assignee.trim(),
                tags: parsedTags,
                linkedWorkflowTabId: linkedTab?.id,
                linkedWorkflowTabTitle: linkedTab?.title,
                linkedSourceNodeId: sourceNode?.id,
                linkedSourceNodeLabel: sourceNode?.label,
                linkedTargetNodeId: targetNode?.id,
                linkedTargetNodeLabel: targetNode?.label,
                linkedEdgeLabel: edgeLabel || undefined,
              };
            });
            return { ...tab, kanbanTasks: updated };
          } else {
            const totalExisting = currentTasks.length + 100 + 1;
            const newKey = `ERP-${totalExisting}`;
            const newTask: KanbanTask = {
              id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              key: newKey,
              title: kanbanTaskModal.title.trim(),
              description: kanbanTaskModal.description.trim(),
              status: kanbanTaskModal.status,
              priority: kanbanTaskModal.priority,
              issueType: kanbanTaskModal.issueType,
              sprint: kanbanTaskModal.sprint.trim() || undefined,
              duration: kanbanTaskModal.duration.trim() || undefined,
              storyPoints: parsedStoryPoints,
              startDate: kanbanTaskModal.startDate.trim() || undefined,
              dueDate: kanbanTaskModal.dueDate.trim() || undefined,
              acceptanceCriteria: kanbanTaskModal.acceptanceCriteria.trim() || undefined,
              assignee: kanbanTaskModal.assignee.trim(),
              tags: parsedTags,
              linkedWorkflowTabId: linkedTab?.id,
              linkedWorkflowTabTitle: linkedTab?.title,
              linkedSourceNodeId: sourceNode?.id,
              linkedSourceNodeLabel: sourceNode?.label,
              linkedTargetNodeId: targetNode?.id,
              linkedTargetNodeLabel: targetNode?.label,
              linkedEdgeLabel: edgeLabel || undefined,
              createdAt: new Date().toISOString().split('T')[0],
            };
            return { ...tab, kanbanTasks: [newTask, ...currentTasks] };
          }
        }),
      );

      setKanbanTaskModal((prev) => ({ ...prev, isOpen: false }));
    },
    [kanbanTaskModal, tabs, activeTabId, recordHistory],
  );

  const handleDeleteKanbanTask = useCallback(
    (taskId: string): void => {
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          return {
            ...tab,
            kanbanTasks: (tab.kanbanTasks || []).filter((t) => t.id !== taskId),
          };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleMoveKanbanTaskStatus = useCallback(
    (taskId: string, newStatus: KanbanTaskStatus): void => {
      recordHistory();
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          return {
            ...tab,
            kanbanTasks: (tab.kanbanTasks || []).map((t) =>
              t.id === taskId ? { ...t, status: newStatus } : t,
            ),
          };
        }),
      );
    },
    [activeTabId, recordHistory],
  );

  const handleJumpToLinkedWorkflow = useCallback(
    (targetTabId: string, nodeId?: string, targetNodeId?: string): void => {
      let foundTab = tabs.find((t) => t.id === targetTabId);
      if (!foundTab) {
        foundTab = tabs.find((t) => t.type !== 'kanban');
      }
      if (!foundTab) return;

      setActiveTabId(foundTab.id);
      setProjectSubView('flowchart');

      if (nodeId) {
        setSelectedNodeId(nodeId);
        const targetNode = foundTab.nodes.find((n) => n.id === nodeId);
        if (targetNode) {
          const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
          const targetCanvasX = screenW / 2 - targetNode.position.x - 120;
          const targetCanvasY = screenH / 2 - targetNode.position.y - 60;
          setTabs((prevTabs) =>
            prevTabs.map((t) =>
              t.id === foundTab.id
                ? { ...t, transform: { x: targetCanvasX, y: targetCanvasY, scale: 1 } }
                : t,
            ),
          );
        }
      }

      if (targetNodeId && nodeId) {
        const edge = foundTab.edges.find(
          (ed) => ed.sourceNodeId === nodeId && ed.targetNodeId === targetNodeId,
        );
        if (edge) setSelectedEdgeId(edge.id);
      }
    },
    [tabs],
  );

  return {
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
    canvasRef,
    fileInputRef,
    mainContainerRef,
    handleSelectTab,
    handleAddTabClick,
    handleCloneTab,
    handleCloseTab,
    editingTabState,
    handleStartRenameTab,
    handleUpdateEditingTabTitle,
    handleSaveTabTitle,
    handleCancelRenameTab,
    handleConfirmCreateProject,
    handleCloseCreateProjectModal,
    handleUpdateCreateProjectField,
    handleOpenAddNodeModal,
    handleCloseAddNodeModal,
    handleUpdateAddNodeField,
    handleToggleDecisionSwap,
    handleSubmitAddNode,
    handleOpenEditNodeModal,
    handleCloseEditNodeModal,
    handleUpdateEditNodeField,
    handleSaveEditNode,
    handleDeleteNodeFromModal,
    handleToggleGhostSkeleton,
    handleAddSwimlane,
    handleUpdateSwimlaneName,
    handleDeleteSwimlane,
    handleUpdateTableWidth,
    handleStartTableResize,
    handleStartLaneResize,
    handleUpdateLaneHeight,
    handleSelectNode,
    handleDeselectAll,
    handleUpdateNodeLabel,
    handleUpdateNodeCategory,
    handleUpdateNodeColor,
    handleDeleteSelectedNode,
    handleDeleteSelectedEdge,
    handleStartNodeDrag,
    handleStartNodeResize,
    handleStartConnection,
    handleCompleteConnection,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleExportPng,
    handleExportJson,
    handleImportJsonClick,
    handleFileInputChange,
    handleLoadTemplate,
    handleClearCanvas,
    handleToggleHelpModal,
    handleWheelPan,
    handleWheelZoom,
    isMinimapOpen,
    handleToggleMinimap,
    isFarFromStart,
    handleFocusStart,
    handlePanToPoint,
    groups: activeTab.groups || [],
    selectedGroupId,
    handleSelectGroup,
    handleAddGroupFrame,
    handleUpdateGroupTitle,
    handleUpdateGroupColor,
    handleDeleteGroupFrame,
    handleStartGroupDrag,
    handleStartGroupResize,
    aiSettingsModal,
    projectScanModal,
    handleOpenAiSettings,
    handleCloseAiSettings,
    handleUpdateAiSettingsField,
    handleTestAiConnection,
    handleOpenProjectFolder,
    handleCloseProjectScanModal,
    handleGenerateFlowFromProject,
    folderInputRef,
    handleFolderInputChange,
    isViewOnly,
    handleToggleViewOnly,
    projectSubView,
    handleSetProjectSubView,
    handleGenerateTasksFromNodes,
    shareModal,
    handleOpenShareModal,
    handleCloseShareModal,
    handleCopyShareLink,
    hoveredNodeId,
    handleNodeMouseEnter,
    handleNodeMouseLeave,
    flowRunner,
    handleToggleRunFlow,
    handleNextFlowStep,
    handlePrevFlowStep,
    handleStopFlow,
    handleSelectMockupPreset,
    handleUploadMockupImage,
    handleClearMockupImage,
    kanbanTaskModal,
    kanbanSearchQuery,
    kanbanPriorityFilter,
    kanbanSprintFilter,
    kanbanLinkFilter,
    onSetKanbanSearchQuery: setKanbanSearchQuery,
    onSetKanbanPriorityFilter: setKanbanPriorityFilter,
    onSetKanbanSprintFilter: setKanbanSprintFilter,
    onSetKanbanLinkFilter: setKanbanLinkFilter,
    onOpenCreateKanbanTask: handleOpenCreateKanbanTask,
    onOpenEditKanbanTask: handleOpenEditKanbanTask,
    onCloseKanbanTaskModal: handleCloseKanbanTaskModal,
    onUpdateKanbanTaskField: handleUpdateKanbanTaskField,
    onSaveKanbanTask: handleSaveKanbanTask,
    onDeleteKanbanTask: handleDeleteKanbanTask,
    onMoveKanbanTaskStatus: handleMoveKanbanTaskStatus,
    onJumpToLinkedWorkflow: handleJumpToLinkedWorkflow,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    connectorStyle,
    handleSetConnectorStyle,
    handleSelectEdge,
    handleDeleteEdgeById,
    editEdgeModal,
    handleOpenEditEdgeModal,
    handleCloseEditEdgeModal,
    handleUpdateEditEdgeField,
    handleSaveEditEdge,
    handleFlipEdgeDirection,
    handleStartEdgeWaypointDrag,
    handleResetEdgeWaypoint,
    handleSetEdgeTargetAnchor,
    handleSetEdgeSourceAnchor,
    edgeEndpointDragState,
    handleStartEdgeEndpointDrag,
    handleUpdateEdgeLabel,
    handleUpdateEdgeColor,
    handleResetEdgeAnchors,
  };
};
