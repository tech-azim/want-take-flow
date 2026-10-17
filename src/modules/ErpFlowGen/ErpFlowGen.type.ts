export type FlowNodeType =
  | 'start'
  | 'end'
  | 'process'
  | 'subprocess'
  | 'decision'
  | 'document'
  | 'multidocument'
  | 'inputOutput'
  | 'database'
  | 'datastore'
  | 'delay'
  | 'inspection'
  | 'dfdProcess'
  | 'entity';

export type FlowchartProjectType =
  | 'swimlane'
  | 'userflow'
  | 'sop'
  | 'dfd'
  | 'algorithm'
  | 'general'
  | 'kanban';

export type NodeColorTheme = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate' | 'violet';

export type Position = {
  x: number;
  y: number;
};

export type SchemaColumn = {
  name: string;
  dataType: string;
  isPrimaryKey: boolean;
};

export type FlowNode = {
  id: string;
  type: FlowNodeType;
  label: string;
  description: string;
  moduleCategory: string;
  position: Position;
  colorTheme: NodeColorTheme;
  width?: number;
  height?: number;
  schemaColumns?: SchemaColumn[];
  decisionSwap?: boolean;
  previewImageUrl?: string;
  previewImageCaption?: string;
};

export type FlowEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
  color?: string;
  waypointOffset?: { x: number; y: number };
  sourceAnchor?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  targetAnchor?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
};

export type SwimlaneLane = {
  id: string;
  name: string;
  color: string;
  height: number;
};

export type FlowGroupFrame = {
  id: string;
  title: string;
  position: Position;
  width: number;
  height: number;
  colorTheme?: NodeColorTheme;
};
export type GroupResizeMode =
  | 'both'
  | 'horizontal'
  | 'vertical'
  | 'top'
  | 'left'
  | 'top-right'
  | 'top-left'
  | 'bottom-left'
  | 'bottom-right';

export type FlowProjectTab = {
  id: string;
  title: string;
  type: FlowchartProjectType;
  nodes: FlowNode[];
  edges: FlowEdge[];
  groups?: FlowGroupFrame[];
  showGhostSkeleton: boolean;
  transform: CanvasTransform;
  swimlanes?: SwimlaneLane[];
  masterTitle?: string;
  tableWidth?: number;
  kanbanTasks?: KanbanTask[];
};

export type SmartSuggestion = {
  id: string;
  title: string;
  subtitle: string;
  nodeType: FlowNodeType;
  edgeLabel: string;
  defaultColor: NodeColorTheme;
  moduleCategory: string;
};

export type PaletteItem = {
  type: FlowNodeType;
  label: string;
  description: string;
  iconName: string;
  defaultColor: NodeColorTheme;
  defaultCategory: string;
};

export type CanvasTransform = {
  x: number;
  y: number;
  scale: number;
};

export type DraggingState = {
  isDragging: boolean;
  nodeId: string;
  dragOffset: Position;
};

export type ConnectingState = {
  isConnecting: boolean;
  sourceNodeId: string;
  sourceAnchor?: 'top' | 'bottom' | 'left' | 'right';
  currentMousePosition: Position;
  candidateTargetNodeId?: string;
  candidateTargetAnchor?: 'top' | 'bottom' | 'left' | 'right';
};

export type EdgeEndpointDragState = {
  isDragging: boolean;
  edgeId: string;
  endpointType: 'source' | 'target';
  currentPos: Position;
  candidateNodeId?: string;
  candidateAnchor?: 'top' | 'bottom' | 'left' | 'right';
};

export type PanningState = {
  isPanning: boolean;
  panStart: Position;
  initialTransform: Position;
};

export type SchemaExportData = {
  version: string;
  appName: string;
  exportDate: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  swimlanes?: SwimlaneLane[];
  groups?: FlowGroupFrame[];
  masterTitle?: string;
  tableWidth?: number;
  tabs?: FlowProjectTab[];
};

export type AddNodeModalData = {
  isOpen: boolean;
  mode?: 'new' | 'connect';
  targetNodeId?: string;
  sourceNodeId: string;
  sourceNodeLabel?: string;
  sourceNodeType?: FlowNodeType;
  targetLaneId?: string;
  direction?: 'right' | 'bottom';
  label: string;
  description: string;
  type: FlowNodeType;
  edgeLabel: string;
  category: string;
  colorTheme: NodeColorTheme;
  shapeCategoryFilter: string;
};

export type EditNodeModalData = {
  isOpen: boolean;
  nodeId: string;
  label: string;
  description: string;
  type: FlowNodeType;
  moduleCategory: string;
  colorTheme: NodeColorTheme;
  width?: number;
  height?: number;
  previewImageUrl?: string;
  previewImageCaption?: string;
};

export type ShareModalData = {
  isOpen: boolean;
  shareUrl: string;
  isCopied: boolean;
};

export type FlowRunnerState = {
  isRunning: boolean;
  currentNodeId: string | null;
  stepIndex: number;
  speedMs: number;
};

export type KanbanTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type KanbanTaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type KanbanIssueType = 'story' | 'task' | 'bug' | 'epic' | 'improvement';

export type KanbanTask = {
  id: string;
  key: string;
  title: string;
  description: string;
  status: KanbanTaskStatus;
  priority: KanbanTaskPriority;
  issueType?: KanbanIssueType;
  sprint?: string;
  duration?: string;
  storyPoints?: number | string;
  startDate?: string;
  dueDate?: string;
  acceptanceCriteria?: string;
  assignee?: string;
  tags?: string[];
  linkedWorkflowTabId?: string;
  linkedWorkflowTabTitle?: string;
  linkedSourceNodeId?: string;
  linkedSourceNodeLabel?: string;
  linkedTargetNodeId?: string;
  linkedTargetNodeLabel?: string;
  linkedEdgeLabel?: string;
  createdAt?: string;
};

export type KanbanTaskModalData = {
  isOpen: boolean;
  taskId?: string;
  title: string;
  description: string;
  status: KanbanTaskStatus;
  priority: KanbanTaskPriority;
  issueType: KanbanIssueType;
  sprint: string;
  duration: string;
  storyPoints: string;
  startDate: string;
  dueDate: string;
  acceptanceCriteria: string;
  assignee: string;
  tags: string;
  linkedWorkflowTabId: string;
  linkedSourceNodeId: string;
  linkedTargetNodeId: string;
  linkedEdgeLabel: string;
};

export type CreateProjectModalData = {
  isOpen: boolean;
  projectName: string;
  projectType: FlowchartProjectType;
};

export type HermesAiConfig = {
  endpoint: string;
  apiKey: string;
  model: string;
};

export type ScannedFile = {
  path: string;
  name: string;
  extension: string;
  size: number;
  contentSnippet: string;
};

export type ProjectScanModalData = {
  isOpen: boolean;
  folderName: string;
  files: ScannedFile[];
  isScanning: boolean;
  isGenerating: boolean;
  generationStep: string;
  progressPercent: number;
  errorMessage?: string;
};

export type AiSettingsModalData = {
  isOpen: boolean;
  endpoint: string;
  apiKey: string;
  model: string;
  isTesting: boolean;
  testStatus?: 'idle' | 'success' | 'error';
  testMessage?: string;
};

export type EditEdgeModalData = {
  isOpen: boolean;
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
  sourceAnchor?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  targetAnchor?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
};

export type ErpFlowGenComponentProps = {
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
  onSelectTab: (tabId: string) => void;
  onAddTabClick: () => void;
  onCloneTab: (tabId: string) => void;
  onCloseTab: (tabId: string, event: React.MouseEvent) => void;
  editingTabState: { tabId: string; title: string };
  onStartRenameTab: (tabId: string, currentTitle: string) => void;
  onUpdateEditingTabTitle: (title: string) => void;
  onSaveTabTitle: (tabId: string) => void;
  onCancelRenameTab: () => void;
  onConfirmCreateProject: (e?: React.FormEvent) => void;
  onCloseCreateProjectModal: () => void;
  onUpdateCreateProjectField: (field: keyof CreateProjectModalData, value: string | FlowchartProjectType) => void;
  onOpenAddNodeModal: (sourceNodeId: string, direction?: 'right' | 'bottom', defaultEdgeLabel?: string, targetLaneId?: string) => void;
  onCloseAddNodeModal: () => void;
  onUpdateAddNodeField: (field: keyof AddNodeModalData, value: string | FlowNodeType | NodeColorTheme | 'new' | 'connect') => void;
  onSubmitAddNode: (e?: React.FormEvent) => void;
  onOpenEditNodeModal: (nodeId: string) => void;
  onCloseEditNodeModal: () => void;
  onUpdateEditNodeField: (field: keyof EditNodeModalData, value: string | FlowNodeType | NodeColorTheme | number) => void;
  onSaveEditNode: (e?: React.FormEvent) => void;
  onDeleteNodeFromModal: () => void;
  onToggleGhostSkeleton: () => void;
  onSelectNode: (nodeId: string) => void;
  onDeselectAll: () => void;
  onUpdateNodeLabel: (nodeId: string, label: string) => void;
  onUpdateNodeCategory: (nodeId: string, category: string) => void;
  onUpdateNodeColor: (nodeId: string, color: NodeColorTheme) => void;
  onDeleteSelectedNode: (nodeId?: string) => void;
  onDeleteSelectedEdge: () => void;
  onStartNodeDrag: (event: React.MouseEvent<HTMLDivElement>, nodeId: string) => void;
  onStartNodeResize?: (event: React.MouseEvent, nodeId: string, mode?: 'both' | 'horizontal' | 'vertical') => void;
  onStartConnection: (event: React.MouseEvent, nodeId: string, sourceAnchor?: 'top' | 'bottom' | 'left' | 'right') => void;
  onCompleteConnection: (targetNodeId: string) => void;
  onCanvasMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCanvasMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCanvasMouseUp: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onExportPng: () => void;
  onExportJson: () => void;
  onImportJsonClick: () => void;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadTemplate: () => void;
  onClearCanvas: () => void;
  onToggleHelpModal: () => void;
  onWheelPan?: (deltaX: number, deltaY: number) => void;
  onWheelZoom?: (clientX: number, clientY: number, zoomFactor: number) => void;
  onAddSwimlane?: (name: string, color?: string) => void;
  onUpdateSwimlaneName?: (laneId: string, name: string) => void;
  onUpdateMasterTitle?: (title: string) => void;
  onDeleteSwimlane?: (laneId: string) => void;
  onUpdateTableWidth?: (newWidth: number) => void;
  onStartTableResize?: (event: React.MouseEvent) => void;
  onUpdateLaneHeight?: (laneId: string, newHeight: number) => void;
  onStartLaneResize?: (event: React.MouseEvent, laneId: string, initialHeight: number) => void;
  isMinimapOpen: boolean;
  onToggleMinimap: () => void;
  isFarFromStart: boolean;
  onFocusStart: () => void;
  onPanToPoint: (canvasX: number, canvasY: number) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  mainContainerRef: React.RefObject<HTMLElement | null>;
  groups: FlowGroupFrame[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onAddGroupFrame: () => void;
  onUpdateGroupTitle: (groupId: string, title: string) => void;
  onUpdateGroupColor: (groupId: string, color: NodeColorTheme) => void;
  onDeleteGroupFrame: (groupId: string) => void;
  onStartGroupDrag: (event: React.MouseEvent, groupId: string) => void;
  onStartGroupResize: (event: React.MouseEvent, groupId: string, mode?: GroupResizeMode) => void;
  onToggleDecisionSwap: (nodeId: string) => void;
  isViewOnly: boolean;
  onToggleViewOnly: () => void;
  projectSubView: 'flowchart' | 'kanban';
  onSetProjectSubView: (mode: 'flowchart' | 'kanban') => void;
  onGenerateTasksFromNodes: () => void;
  shareModal: ShareModalData;
  onOpenShareModal: () => void;
  onCloseShareModal: () => void;
  onCopyShareLink: () => void;
  hoveredNodeId: string | null;
  onNodeMouseEnter: (nodeId: string) => void;
  onNodeMouseLeave: () => void;
  flowRunner: FlowRunnerState;
  onToggleRunFlow: () => void;
  onNextFlowStep: () => void;
  onPrevFlowStep: () => void;
  onStopFlow: () => void;
  onSelectMockupPreset: (presetId: string) => void;
  onUploadMockupImage: (file: File) => void;
  onClearMockupImage: () => void;
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
  onUndo: () => void;
  onRedo: () => void;
  connectorStyle: 'orthogonal' | 'curved' | 'straight';
  onSetConnectorStyle: (style: 'orthogonal' | 'curved' | 'straight') => void;
  onSelectEdge: (edgeId: string) => void;
  onDeleteEdgeById: (edgeId: string) => void;
  editEdgeModal: EditEdgeModalData;
  onOpenEditEdgeModal: (edgeId: string) => void;
  onCloseEditEdgeModal: () => void;
  onUpdateEditEdgeField: (field: keyof EditEdgeModalData, value: string) => void;
  onSaveEditEdge: (e?: React.FormEvent) => void;
  onFlipEdgeDirection: () => void;
  onStartEdgeWaypointDrag: (e: React.MouseEvent, edgeId: string) => void;
  onResetEdgeWaypoint: (edgeId: string) => void;
  onSetEdgeTargetAnchor: (edgeId: string, anchor: 'auto' | 'top' | 'bottom' | 'left' | 'right') => void;
  onSetEdgeSourceAnchor?: (edgeId: string, anchor: 'auto' | 'top' | 'bottom' | 'left' | 'right') => void;
  edgeEndpointDragState: EdgeEndpointDragState;
  onStartEdgeEndpointDrag: (e: React.MouseEvent, edgeId: string, endpointType?: 'source' | 'target' | 'auto') => void;
  onUpdateEdgeLabel: (edgeId: string, label: string) => void;
  onUpdateEdgeColor: (edgeId: string, color: string) => void;
  onResetEdgeAnchors?: (edgeId: string) => void;
};
