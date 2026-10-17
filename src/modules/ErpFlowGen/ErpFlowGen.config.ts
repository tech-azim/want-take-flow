import type {
  FlowNode,
  FlowNodeType,
  FlowEdge,
  PaletteItem,
  SmartSuggestion,
  FlowchartProjectType,
  FlowProjectTab,
} from './ErpFlowGen.type';
import {
  MOCKUP_LOGIN_FAILED_SVG,
  MOCKUP_LOGIN_SUCCESS_SVG,
  MOCKUP_CHECKOUT_FORM_SVG,
} from './ErpFlowGen.mockups';

export const CANVAS_CONFIG = {
  MIN_SCALE: 0.35,
  MAX_SCALE: 2.2,
  SCALE_STEP: 0.15,
  DEFAULT_SCALE: 1.0,
};

export const NODE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  start: { width: 160, height: 50 },
  end: { width: 160, height: 50 },
  process: { width: 220, height: 96 },
  subprocess: { width: 220, height: 96 },
  decision: { width: 190, height: 110 },
  document: { width: 210, height: 80 },
  multidocument: { width: 210, height: 80 },
  inputOutput: { width: 220, height: 80 },
  database: { width: 220, height: 100 },
  datastore: { width: 210, height: 60 },
  delay: { width: 190, height: 70 },
  inspection: { width: 190, height: 80 },
  dfdProcess: { width: 130, height: 130 },
  entity: { width: 180, height: 75 },
};

export type FlowNodeTypeOption = {
  type: FlowNodeType;
  label: string;
  category: 'Event' | 'Proses' | 'Logika' | 'Data & Dokumen' | 'DFD';
  icon: string;
  desc: string;
  shapeName: string;
};

export const FLOW_NODE_TYPE_OPTIONS: FlowNodeTypeOption[] = [
  // 1. Event
  { type: 'start', label: 'Start Event', category: 'Event', icon: 'PlayCircle', desc: 'Bentuk: Kapsul / Oval', shapeName: 'Bentuk: Kapsul / Oval' },
  { type: 'end', label: 'End Event', category: 'Event', icon: 'CheckCircle2', desc: 'Bentuk: Kapsul / Oval Bulat', shapeName: 'Bentuk: Kapsul / Oval Bulat' },

  // 2. Proses & Operasi
  { type: 'process', label: 'Task / Proses', category: 'Proses', icon: 'SquareCode', desc: 'Bentuk: Kotak Persegi Panjang', shapeName: 'Bentuk: Kotak Persegi Panjang' },
  { type: 'subprocess', label: 'Sub-proses', category: 'Proses', icon: 'Layers', desc: 'Bentuk: Kotak Garis Ganda', shapeName: 'Bentuk: Kotak Garis Ganda' },
  { type: 'inspection', label: 'Inspeksi QC', category: 'Proses', icon: 'Search', desc: 'Bentuk: Hexagon (Segi Enam)', shapeName: 'Bentuk: Hexagon (Segi Enam)' },
  { type: 'delay', label: 'Delay / Antrean', category: 'Proses', icon: 'Clock', desc: 'Bentuk: Huruf D (Setengah Lingkaran)', shapeName: 'Bentuk: Huruf D (Setengah Lingkaran)' },

  // 3. Logika & Keputusan
  { type: 'decision', label: 'Decision (If / Else)', category: 'Logika', icon: 'GitFork', desc: 'Bentuk: Belah Ketupat (Diamond)', shapeName: 'Bentuk: Belah Ketupat (Diamond)' },

  // 4. Data & Dokumen
  { type: 'document', label: 'Dokumen', category: 'Data & Dokumen', icon: 'FileText', desc: 'Bentuk: Dokumen Wave Bawah', shapeName: 'Bentuk: Dokumen Wave Bawah' },
  { type: 'multidocument', label: 'Multi-Dokumen', category: 'Data & Dokumen', icon: 'Files', desc: 'Bentuk: Dokumen Rangkap (Tumpuk)', shapeName: 'Bentuk: Dokumen Rangkap (Tumpuk)' },
  { type: 'inputOutput', label: 'Data I/O', category: 'Data & Dokumen', icon: 'FileSpreadsheet', desc: 'Bentuk: Jajar Genjang (Parallelogram)', shapeName: 'Bentuk: Jajar Genjang' },
  { type: 'database', label: 'Database Storage', category: 'Data & Dokumen', icon: 'Database', desc: 'Bentuk: Silinder Vertikal', shapeName: 'Bentuk: Silinder Vertikal' },

  // 5. DFD (Data Flow Diagram)
  { type: 'dfdProcess', label: 'DFD Proses', category: 'DFD', icon: 'Circle', desc: 'Bentuk: Lingkaran Bulat', shapeName: 'Bentuk: Lingkaran Bulat' },
  { type: 'datastore', label: 'DFD Data Store', category: 'DFD', icon: 'Archive', desc: 'Bentuk: Garis Terbuka [ = ]', shapeName: 'Bentuk: Garis Terbuka [ = ]' },
  { type: 'entity', label: 'DFD External Entity', category: 'DFD', icon: 'UserCheck', desc: 'Bentuk: Kotak Entitas Luar', shapeName: 'Bentuk: Kotak Entitas Luar' },
];

export type FlowchartTypeMeta = {
  type: FlowchartProjectType;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  iconName: string;
};

export const FLOWCHART_TYPES_METADATA: FlowchartTypeMeta[] = [
  {
    type: 'userflow',
    title: 'User Flow / E-Commerce',
    subtitle: 'Alur Pengguna (Contoh: Amazon Book Order)',
    badge: 'Product & UX',
    description: 'Pencarian buku, login/register, keranjang, input shipping, pembayaran, hingga order.',
    iconName: 'Workflow',
  },
  {
    type: 'swimlane',
    title: 'Swimlane / Cross-Functional',
    subtitle: 'Bagan Alir Lintas Departemen (Contoh: SOP Perusahaan)',
    badge: 'ERP & Bisnis',
    description: 'Terbagi dalam lajur Sales, Purchasing, Production, dan Finance Department.',
    iconName: 'Columns',
  },
  {
    type: 'sop',
    title: 'Operational SOP Flow',
    subtitle: 'Alur Layanan & Antrean (Contoh: Pasien Klinik RS)',
    badge: 'Operations',
    description: 'Pemeriksaan ketersediaan dokter/perawat, resep obat, jadwal kontrol, dan triase.',
    iconName: 'PlayCircle',
  },
  {
    type: 'dfd',
    title: 'Data Flow Diagram (DFD)',
    subtitle: 'Diagram Alir Data Sistem (Contoh: Order Resto)',
    badge: 'System Analyst',
    description: 'Relasi entitas eksternal, proses lingkaran, database inventory/order, dan data flow.',
    iconName: 'Database',
  },
  {
    type: 'algorithm',
    title: 'Program / Algorithm Flow',
    subtitle: 'Logika Algoritma (Contoh: Seleksi Variabel a, b, c)',
    badge: 'Engineering',
    description: 'Deklarasi variabel, seleksi percabangan kondisi if/else, dan cetak nilai output.',
    iconName: 'SquareCode',
  },
  {
    type: 'kanban',
    title: 'Jira / Kanban Task Board',
    subtitle: 'Todo List & Issue Tracker terhubung Workflow Node',
    badge: 'Agile & Sprint',
    description: 'Kelola tiket To Do, In Progress, Review, dan Done yang terkoneksi langsung ke alur node/transisi workflow.',
    iconName: 'LayoutDashboard',
  },
];

export const ERP_MODULE_CATEGORIES = [
  'Sales & Distribution (SD)',
  'Materials Management (MM)',
  'Financial Accounting (FI)',
  'Production Planning (PP)',
  'Quality Management (QM)',
  'General / Cross-Module',
];

export const NODE_PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'start',
    label: 'Start / End Event',
    description: 'Trigger event or termination point in ERP flow',
    iconName: 'PlayCircle',
    defaultColor: 'indigo',
    defaultCategory: 'General / Cross-Module',
  },
  {
    type: 'process',
    label: 'ERP Process / Task',
    description: 'Business execution, transaction or service task',
    iconName: 'SquareCode',
    defaultColor: 'slate',
    defaultCategory: 'Materials Management (MM)',
  },
  {
    type: 'decision',
    label: 'Decision Gateway',
    description: 'ATP check, tolerance check or threshold',
    iconName: 'GitFork',
    defaultColor: 'amber',
    defaultCategory: 'General / Cross-Module',
  },
  {
    type: 'database',
    label: 'ERP Database / Schema',
    description: 'Master data table, DB ledger or entity schema',
    iconName: 'Database',
    defaultColor: 'cyan',
    defaultCategory: 'Financial Accounting (FI)',
  },
  {
    type: 'inputOutput',
    label: 'I/O & Document',
    description: 'Purchase Order, Invoice or Electronic EDI',
    iconName: 'FileSpreadsheet',
    defaultColor: 'violet',
    defaultCategory: 'Sales & Distribution (SD)',
  },
];

export const EMPTY_CANVAS_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 'sugg_empty_sales_trigger',
    title: 'Customer PO Received',
    subtitle: 'Sales Order Trigger Event (SD-01)',
    nodeType: 'start',
    edgeLabel: 'Initiates',
    defaultColor: 'indigo',
    moduleCategory: 'Sales & Distribution (SD)',
  },
  {
    id: 'sugg_empty_procure_trigger',
    title: 'Material Requisition Alert',
    subtitle: 'Procurement Cycle Trigger (MM-01)',
    nodeType: 'start',
    edgeLabel: 'Triggers',
    defaultColor: 'emerald',
    moduleCategory: 'Materials Management (MM)',
  },
  {
    id: 'sugg_empty_gl_trigger',
    title: 'Period-End Closing Event',
    subtitle: 'Financial Ledger Reconciliation (FI-01)',
    nodeType: 'start',
    edgeLabel: 'Starts',
    defaultColor: 'violet',
    moduleCategory: 'Financial Accounting (FI)',
  },
];

export const DECISION_BRANCH_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 'sugg_decision_approved',
    title: 'Stock Approved & Reserved',
    subtitle: 'Allocate plant stock and create outbound delivery',
    nodeType: 'process',
    edgeLabel: 'Yes / In Stock',
    defaultColor: 'emerald',
    moduleCategory: 'Materials Management (MM)',
  },
  {
    id: 'sugg_decision_rejected',
    title: 'Backorder Requisition (ME51N)',
    subtitle: 'Raise automated purchase order to primary supplier',
    nodeType: 'process',
    edgeLabel: 'No / Backorder',
    defaultColor: 'rose',
    moduleCategory: 'Materials Management (MM)',
  },
];

export const PROCESS_NEXT_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 'sugg_proc_stock_check',
    title: 'Available-to-Promise Check',
    subtitle: 'Validate warehouse stock availability',
    nodeType: 'decision',
    edgeLabel: 'Verify Stock',
    defaultColor: 'amber',
    moduleCategory: 'Materials Management (MM)',
  },
  {
    id: 'sugg_proc_post_ledger',
    title: 'Post to General Ledger (FI)',
    subtitle: 'Commit balanced financial journal transaction',
    nodeType: 'database',
    edgeLabel: 'Commit Entry',
    defaultColor: 'cyan',
    moduleCategory: 'Financial Accounting (FI)',
  },
  {
    id: 'sugg_proc_print_invoice',
    title: 'Generate Billing Document',
    subtitle: 'Emit tax invoice and deliver via EDI',
    nodeType: 'inputOutput',
    edgeLabel: 'Produces',
    defaultColor: 'violet',
    moduleCategory: 'Sales & Distribution (SD)',
  },
];

export const DATABASE_NEXT_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 'sugg_db_audit_log',
    title: 'Write Compliance Audit Log',
    subtitle: 'Immutable ledger record for SOX compliance',
    nodeType: 'process',
    edgeLabel: 'Logs Transaction',
    defaultColor: 'slate',
    moduleCategory: 'General / Cross-Module',
  },
  {
    id: 'sugg_db_reconcile',
    title: 'Reconcile Sub-Ledger vs GL',
    subtitle: 'Ensure AR/AP balances match balance sheet',
    nodeType: 'decision',
    edgeLabel: 'Verify Balance',
    defaultColor: 'amber',
    moduleCategory: 'Financial Accounting (FI)',
  },
];

export const SAMPLE_ERP_NODES: FlowNode[] = [
  {
    id: 'node_sample_1',
    type: 'start',
    label: 'Customer PO Received',
    description: 'EDI or Portal order placement trigger',
    moduleCategory: 'Sales & Distribution (SD)',
    position: { x: 60, y: 160 },
    colorTheme: 'indigo',
  },
  {
    id: 'node_sample_2',
    type: 'process',
    label: 'Create Sales Order (VA01)',
    description: 'Pricing procedure & credit limit check',
    moduleCategory: 'Sales & Distribution (SD)',
    position: { x: 340, y: 145 },
    colorTheme: 'indigo',
    previewImageUrl: MOCKUP_CHECKOUT_FORM_SVG,
    previewImageCaption: 'Form Input Sales Order VA01 & Validasi Credit Limit',
  },
  {
    id: 'node_sample_3',
    type: 'decision',
    label: 'Inventory In Stock?',
    description: 'Real-time ATP validation in regional plant',
    moduleCategory: 'Materials Management (MM)',
    position: { x: 660, y: 125 },
    colorTheme: 'amber',
  },
  {
    id: 'node_sample_4',
    type: 'process',
    label: 'Issue Outbound Delivery (VL01N)',
    description: 'Pick, pack, and generate bill of lading',
    moduleCategory: 'Materials Management (MM)',
    position: { x: 960, y: 60 },
    colorTheme: 'emerald',
  },
  {
    id: 'node_sample_5',
    type: 'process',
    label: 'Purchase Requisition (ME51N)',
    description: 'Backorder trigger sent to approved supplier',
    moduleCategory: 'Materials Management (MM)',
    position: { x: 960, y: 260 },
    colorTheme: 'rose',
    previewImageUrl: MOCKUP_LOGIN_FAILED_SVG,
    previewImageCaption: 'Alert Layar Out of Stock / Backorder Warning',
  },
  {
    id: 'node_sample_6',
    type: 'database',
    label: 'VBAK / VBAP Sales Ledger',
    description: 'PostgreSQL / SAP S/4HANA Master Ledger',
    moduleCategory: 'Financial Accounting (FI)',
    position: { x: 340, y: 320 },
    colorTheme: 'cyan',
    schemaColumns: [
      { name: 'vbeln', dataType: 'VARCHAR(10)', isPrimaryKey: true },
      { name: 'kunnr', dataType: 'VARCHAR(10)', isPrimaryKey: false },
      { name: 'netwr', dataType: 'DECIMAL(15,2)', isPrimaryKey: false },
      { name: 'waerk', dataType: 'VARCHAR(5)', isPrimaryKey: false },
    ],
  },
  {
    id: 'node_sample_7',
    type: 'inputOutput',
    label: 'Commercial Tax Invoice',
    description: 'Send electronic invoice to customer',
    moduleCategory: 'Financial Accounting (FI)',
    position: { x: 1280, y: 65 },
    colorTheme: 'violet',
    previewImageUrl: MOCKUP_LOGIN_SUCCESS_SVG,
    previewImageCaption: 'Dashboard Billing & Salinan Dokumen Faktur Pajak',
  },
];

export const SAMPLE_ERP_EDGES: FlowEdge[] = [
  {
    id: 'edge_sample_1',
    sourceNodeId: 'node_sample_1',
    targetNodeId: 'node_sample_2',
    label: 'Inbound Order',
  },
  {
    id: 'edge_sample_2',
    sourceNodeId: 'node_sample_2',
    targetNodeId: 'node_sample_6',
    label: 'Persist Sales Items',
  },
  {
    id: 'edge_sample_3',
    sourceNodeId: 'node_sample_2',
    targetNodeId: 'node_sample_3',
    label: 'Check Inventory',
  },
  {
    id: 'edge_sample_4',
    sourceNodeId: 'node_sample_3',
    targetNodeId: 'node_sample_4',
    label: 'Yes / Stock Ready',
  },
  {
    id: 'edge_sample_5',
    sourceNodeId: 'node_sample_3',
    targetNodeId: 'node_sample_5',
    label: 'No / Out of Stock',
  },
  {
    id: 'edge_sample_6',
    sourceNodeId: 'node_sample_4',
    targetNodeId: 'node_sample_7',
    label: 'Generate Billing Doc',
  },
];

export type GhostSkeletonTemplate = {
  type: FlowchartProjectType;
  swimlanes?: { name: string; y: number; height: number; color: string }[];
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export const SKELETON_TEMPLATES: Record<FlowchartProjectType, GhostSkeletonTemplate> = {
  userflow: {
    type: 'userflow',
    nodes: [
      // Row 1: Middle Column (X_MID = 600, Y = 130)
      { id: 'sk_u1', type: 'process', label: 'Enter the website from the browser', description: 'User opens homepage', moduleCategory: 'Navigation', position: { x: 490, y: 130 }, colorTheme: 'slate' },
      // Row 2: Middle Diamond (X_MID = 600, Y = 245), Left Column (X_LEFT = 200, Y = 260), Right Column (X_RIGHT = 1000, Y = 260)
      { id: 'sk_u2', type: 'decision', label: 'Registered ?', description: 'Check account existence', moduleCategory: 'Auth', position: { x: 505, y: 245 }, colorTheme: 'amber' },
      { id: 'sk_u3', type: 'process', label: 'Sign in', description: 'Authenticate user', moduleCategory: 'Auth', position: { x: 90, y: 260 }, colorTheme: 'indigo', previewImageUrl: MOCKUP_LOGIN_SUCCESS_SVG, previewImageCaption: 'Tampilan Form Sign In & Session Berhasil' },
      { id: 'sk_u4', type: 'process', label: 'Sign up', description: 'Register new profile', moduleCategory: 'Auth', position: { x: 890, y: 260 }, colorTheme: 'indigo', previewImageUrl: MOCKUP_LOGIN_FAILED_SVG, previewImageCaption: 'Tampilan Error Registrasi / Password Kurang Aman' },
      // Row 3: Middle Column (X_MID = 600, Y = 400)
      { id: 'sk_u5', type: 'process', label: 'On home page search for book of your choice', description: 'Keyword lookup', moduleCategory: 'Catalog', position: { x: 490, y: 400 }, colorTheme: 'cyan' },
      // Row 4: Middle Column (X_MID = 600, Y = 520)
      { id: 'sk_u6', type: 'process', label: 'Select your preferred book', description: 'Product detail page', moduleCategory: 'Catalog', position: { x: 490, y: 520 }, colorTheme: 'cyan' },
      // Row 5: Middle Diamond (X_MID = 600, Y = 645), Left Column (X_LEFT = 200, Y = 660), Right Column (X_RIGHT = 1000, Y = 660)
      { id: 'sk_u7', type: 'decision', label: 'Buy new ?', description: 'Condition selection', moduleCategory: 'Cart', position: { x: 505, y: 645 }, colorTheme: 'amber' },
      { id: 'sk_u8', type: 'process', label: 'Select a new book', description: 'New edition inventory', moduleCategory: 'Cart', position: { x: 90, y: 660 }, colorTheme: 'emerald' },
      { id: 'sk_u9', type: 'process', label: 'Select an old book', description: 'Used edition discount', moduleCategory: 'Cart', position: { x: 890, y: 660 }, colorTheme: 'emerald' },
      // Row 6: Left Column (X_LEFT = 200, Y = 800), Middle Column (X_MID = 600, Y = 800), Right Column (X_RIGHT = 1000, Y = 800)
      { id: 'sk_u10', type: 'process', label: 'Add to cart', description: 'Basket update', moduleCategory: 'Checkout', position: { x: 90, y: 800 }, colorTheme: 'violet' },
      { id: 'sk_u11', type: 'process', label: 'Review order', description: 'Order summary items', moduleCategory: 'Checkout', position: { x: 490, y: 800 }, colorTheme: 'violet' },
      { id: 'sk_u12', type: 'inputOutput', label: 'Enter shipping information', description: 'Courier destination', moduleCategory: 'Logistics', position: { x: 890, y: 800 }, colorTheme: 'violet', previewImageUrl: MOCKUP_CHECKOUT_FORM_SVG, previewImageCaption: 'Tampilan Input Alamat Pengiriman & Kurir' },
      // Row 7: Left Column (X_LEFT = 200, Y = 940), Middle Diamond (X_MID = 600, Y = 925), Right Column (X_RIGHT = 1000, Y = 940)
      { id: 'sk_u13_change', type: 'process', label: 'Change information', description: 'Edit address / cart', moduleCategory: 'Checkout', position: { x: 90, y: 940 }, colorTheme: 'rose' },
      { id: 'sk_u14', type: 'decision', label: 'Is information correct ?', description: 'Final confirmation', moduleCategory: 'Checkout', position: { x: 505, y: 925 }, colorTheme: 'amber' },
      { id: 'sk_u13', type: 'process', label: 'Select payment method', description: 'Gateway options', moduleCategory: 'Payment', position: { x: 890, y: 940 }, colorTheme: 'rose' },
      // Row 8: Middle Column (X_MID = 600, Y = 1080), Right Column (X_RIGHT = 1000, Y = 1095)
      { id: 'sk_u15', type: 'process', label: 'Place order', description: 'Commit transaction', moduleCategory: 'Checkout', position: { x: 490, y: 1080 }, colorTheme: 'emerald' },
      { id: 'sk_u16', type: 'end', label: 'End', description: 'Order completed', moduleCategory: 'Checkout', position: { x: 920, y: 1095 }, colorTheme: 'rose' },
    ],
    edges: [
      { id: 'sk_ue1', sourceNodeId: 'start_node', targetNodeId: 'sk_u1', label: 'Begins' },
      { id: 'sk_ue2', sourceNodeId: 'sk_u1', targetNodeId: 'sk_u2', label: 'Browses' },
      { id: 'sk_ue3', sourceNodeId: 'sk_u2', targetNodeId: 'sk_u3', label: 'Yes' },
      { id: 'sk_ue4', sourceNodeId: 'sk_u2', targetNodeId: 'sk_u4', label: 'No' },
      { id: 'sk_ue5', sourceNodeId: 'sk_u3', targetNodeId: 'sk_u5', label: 'Logged In' },
      { id: 'sk_ue6', sourceNodeId: 'sk_u4', targetNodeId: 'sk_u5', label: 'Registered' },
      { id: 'sk_ue7', sourceNodeId: 'sk_u5', targetNodeId: 'sk_u6', label: 'Picks' },
      { id: 'sk_ue8', sourceNodeId: 'sk_u6', targetNodeId: 'sk_u7', label: 'Evaluates' },
      { id: 'sk_ue9', sourceNodeId: 'sk_u7', targetNodeId: 'sk_u8', label: 'Yes' },
      { id: 'sk_ue10', sourceNodeId: 'sk_u7', targetNodeId: 'sk_u9', label: 'No' },
      { id: 'sk_ue11', sourceNodeId: 'sk_u8', targetNodeId: 'sk_u10', label: 'Picks' },
      { id: 'sk_ue12', sourceNodeId: 'sk_u9', targetNodeId: 'sk_u10', label: 'Picks' },
      { id: 'sk_ue13', sourceNodeId: 'sk_u10', targetNodeId: 'sk_u11', label: 'Proceeds' },
      { id: 'sk_ue14', sourceNodeId: 'sk_u11', targetNodeId: 'sk_u12', label: 'Address' },
      { id: 'sk_ue15', sourceNodeId: 'sk_u12', targetNodeId: 'sk_u13', label: 'Pay' },
      { id: 'sk_ue16', sourceNodeId: 'sk_u13', targetNodeId: 'sk_u14', label: 'Verify' },
      { id: 'sk_ue17', sourceNodeId: 'sk_u14', targetNodeId: 'sk_u13_change', label: 'No' },
      { id: 'sk_ue18', sourceNodeId: 'sk_u14', targetNodeId: 'sk_u15', label: 'Yes' },
      { id: 'sk_ue19', sourceNodeId: 'sk_u13_change', targetNodeId: 'sk_u15', label: 'Updated' },
      { id: 'sk_ue20', sourceNodeId: 'sk_u15', targetNodeId: 'sk_u16', label: 'Done' },
    ],
  },
  swimlane: {
    type: 'swimlane',
    swimlanes: [
      { name: 'Sales Department', y: 60, height: 160, color: '#6366f1' },
      { name: 'Purchasing Department', y: 230, height: 160, color: '#ec4899' },
      { name: 'Production Department', y: 400, height: 160, color: '#f59e0b' },
      { name: 'Finance Department', y: 570, height: 160, color: '#ef4444' },
    ],
    nodes: [
      { id: 'sk_s1', type: 'process', label: 'Sales contract signing', description: 'Customer signs terms', moduleCategory: 'Sales Department', position: { x: 420, y: 105 }, colorTheme: 'cyan' },
      { id: 'sk_s2', type: 'decision', label: 'Contract review', description: 'Credit & spec check', moduleCategory: 'Sales Department', position: { x: 680, y: 90 }, colorTheme: 'amber' },
      { id: 'sk_s3', type: 'process', label: 'Modify the contract', description: 'Revise terms', moduleCategory: 'Sales Department', position: { x: 920, y: 105 }, colorTheme: 'cyan' },
      { id: 'sk_s4', type: 'process', label: 'Spare parts procurement', description: 'Order raw parts', moduleCategory: 'Purchasing Department', position: { x: 680, y: 275 }, colorTheme: 'cyan' },
      { id: 'sk_s5', type: 'process', label: 'Purchase into warehouse', description: 'Goods receipt', moduleCategory: 'Purchasing Department', position: { x: 420, y: 275 }, colorTheme: 'cyan' },
      { id: 'sk_s6', type: 'process', label: 'Production material collection', description: 'Pick components', moduleCategory: 'Production Department', position: { x: 180, y: 445 }, colorTheme: 'cyan' },
      { id: 'sk_s7', type: 'process', label: 'Production assembly', description: 'Manufacturing line', moduleCategory: 'Production Department', position: { x: 420, y: 445 }, colorTheme: 'cyan' },
      { id: 'sk_s8', type: 'decision', label: 'Quality inspection', description: 'QC compliance test', moduleCategory: 'Production Department', position: { x: 680, y: 430 }, colorTheme: 'amber' },
      { id: 'sk_s9', type: 'process', label: 'Product storage', description: 'Finish goods warehouse', moduleCategory: 'Production Department', position: { x: 920, y: 445 }, colorTheme: 'cyan' },
      { id: 'sk_s10', type: 'process', label: 'Financial accounting', description: 'Post invoice & ledger', moduleCategory: 'Finance Department', position: { x: 420, y: 615 }, colorTheme: 'slate' },
      { id: 'sk_s11', type: 'inputOutput', label: 'Financial statements', description: 'Periodic reporting', moduleCategory: 'Finance Department', position: { x: 680, y: 615 }, colorTheme: 'slate' },
      { id: 'sk_s12', type: 'end', label: 'Process Finished (End)', description: 'Close cycle', moduleCategory: 'Finance Department', position: { x: 920, y: 625 }, colorTheme: 'emerald' },
    ],
    edges: [
      { id: 'sk_se1', sourceNodeId: 'start_node', targetNodeId: 'sk_s1', label: 'Prospect' },
      { id: 'sk_se2', sourceNodeId: 'sk_s1', targetNodeId: 'sk_s2', label: 'Submits' },
      { id: 'sk_se3', sourceNodeId: 'sk_s2', targetNodeId: 'sk_s3', label: 'No' },
      { id: 'sk_se4', sourceNodeId: 'sk_s3', targetNodeId: 'sk_s2', label: 'Resubmit' },
      { id: 'sk_se5', sourceNodeId: 'sk_s2', targetNodeId: 'sk_s4', label: 'Yes' },
      { id: 'sk_se6', sourceNodeId: 'sk_s4', targetNodeId: 'sk_s5', label: 'Receives' },
      { id: 'sk_se7', sourceNodeId: 'sk_s5', targetNodeId: 'sk_s6', label: 'Dispatches' },
      { id: 'sk_se8', sourceNodeId: 'sk_s6', targetNodeId: 'sk_s7', label: 'Feeds' },
      { id: 'sk_se9', sourceNodeId: 'sk_s7', targetNodeId: 'sk_s8', label: 'Checks' },
      { id: 'sk_se10', sourceNodeId: 'sk_s8', targetNodeId: 'sk_s7', label: 'Remodel' },
      { id: 'sk_se11', sourceNodeId: 'sk_s8', targetNodeId: 'sk_s9', label: 'Pass' },
      { id: 'sk_se12', sourceNodeId: 'sk_s9', targetNodeId: 'sk_s10', label: 'Invoiced' },
      { id: 'sk_se13', sourceNodeId: 'sk_s10', targetNodeId: 'sk_s11', label: 'Reports' },
      { id: 'sk_se14', sourceNodeId: 'sk_s11', targetNodeId: 'sk_s12', label: 'Closes' },
    ],
  },
  sop: {
    type: 'sop',
    nodes: [
      { id: 'sk_sop1', type: 'process', label: 'Patient arrives', description: 'Enters triage clinic', moduleCategory: 'Reception', position: { x: 180, y: 150 }, colorTheme: 'amber' },
      { id: 'sk_sop2', type: 'decision', label: 'Registered patient ?', description: 'Database verification', moduleCategory: 'Reception', position: { x: 180, y: 260 }, colorTheme: 'amber' },
      { id: 'sk_sop3', type: 'process', label: 'Register patient', description: 'Create medical record', moduleCategory: 'Reception', position: { x: 180, y: 400 }, colorTheme: 'amber' },
      { id: 'sk_sop4', type: 'decision', label: 'Available nurse ?', description: 'Check duty roster', moduleCategory: 'Nursing', position: { x: 420, y: 260 }, colorTheme: 'amber' },
      { id: 'sk_sop5', type: 'process', label: 'Wait for nurse', description: 'Waiting queue', moduleCategory: 'Nursing', position: { x: 420, y: 400 }, colorTheme: 'amber' },
      { id: 'sk_sop6', type: 'process', label: 'Record health condition', description: 'Vitals & symptoms', moduleCategory: 'Nursing', position: { x: 660, y: 275 }, colorTheme: 'amber' },
      { id: 'sk_sop7', type: 'decision', label: 'Available doctor ?', description: 'Consultation room', moduleCategory: 'Doctor', position: { x: 660, y: 400 }, colorTheme: 'amber' },
      { id: 'sk_sop8', type: 'process', label: 'Assign patient to doctor', description: 'Begin examination', moduleCategory: 'Doctor', position: { x: 900, y: 415 }, colorTheme: 'amber' },
      { id: 'sk_sop9', type: 'decision', label: 'Need follow up ?', description: 'Control appointment', moduleCategory: 'Doctor', position: { x: 900, y: 540 }, colorTheme: 'amber' },
      { id: 'sk_sop10', type: 'process', label: 'Arrange appointment', description: 'Calendar reservation', moduleCategory: 'Reception', position: { x: 1120, y: 555 }, colorTheme: 'amber' },
      { id: 'sk_sop11', type: 'decision', label: 'Need Medication ?', description: 'Prescription needed', moduleCategory: 'Pharmacy', position: { x: 900, y: 680 }, colorTheme: 'amber' },
      { id: 'sk_sop12', type: 'inputOutput', label: 'Give patient prescription', description: 'Dispense medicine', moduleCategory: 'Pharmacy', position: { x: 1120, y: 695 }, colorTheme: 'amber' },
      { id: 'sk_sop13', type: 'process', label: 'Patient Leaves', description: 'Discharged safely', moduleCategory: 'General', position: { x: 900, y: 820 }, colorTheme: 'amber' },
      { id: 'sk_sop14', type: 'end', label: 'End of Visit', description: 'Completed visit', moduleCategory: 'General', position: { x: 900, y: 940 }, colorTheme: 'rose' },
    ],
    edges: [
      { id: 'sk_sope1', sourceNodeId: 'start_node', targetNodeId: 'sk_sop1', label: 'Arrival' },
      { id: 'sk_sope2', sourceNodeId: 'sk_sop1', targetNodeId: 'sk_sop2', label: 'Checks' },
      { id: 'sk_sope3', sourceNodeId: 'sk_sop2', targetNodeId: 'sk_sop3', label: 'No' },
      { id: 'sk_sope4', sourceNodeId: 'sk_sop3', targetNodeId: 'sk_sop4', label: 'Done' },
      { id: 'sk_sope5', sourceNodeId: 'sk_sop2', targetNodeId: 'sk_sop4', label: 'Yes' },
      { id: 'sk_sope6', sourceNodeId: 'sk_sop4', targetNodeId: 'sk_sop5', label: 'No' },
      { id: 'sk_sope7', sourceNodeId: 'sk_sop5', targetNodeId: 'sk_sop4', label: 'Wait' },
      { id: 'sk_sope8', sourceNodeId: 'sk_sop4', targetNodeId: 'sk_sop6', label: 'Yes' },
      { id: 'sk_sope9', sourceNodeId: 'sk_sop6', targetNodeId: 'sk_sop7', label: 'Prepped' },
      { id: 'sk_sope10', sourceNodeId: 'sk_sop7', targetNodeId: 'sk_sop8', label: 'Yes' },
      { id: 'sk_sope11', sourceNodeId: 'sk_sop8', targetNodeId: 'sk_sop9', label: 'Examines' },
      { id: 'sk_sope12', sourceNodeId: 'sk_sop9', targetNodeId: 'sk_sop10', label: 'Yes' },
      { id: 'sk_sope13', sourceNodeId: 'sk_sop9', targetNodeId: 'sk_sop11', label: 'No' },
      { id: 'sk_sope14', sourceNodeId: 'sk_sop10', targetNodeId: 'sk_sop11', label: 'Scheduled' },
      { id: 'sk_sope15', sourceNodeId: 'sk_sop11', targetNodeId: 'sk_sop12', label: 'Yes' },
      { id: 'sk_sope16', sourceNodeId: 'sk_sop11', targetNodeId: 'sk_sop13', label: 'No' },
      { id: 'sk_sope17', sourceNodeId: 'sk_sop12', targetNodeId: 'sk_sop13', label: 'Handover' },
      { id: 'sk_sope18', sourceNodeId: 'sk_sop13', targetNodeId: 'sk_sop14', label: 'Exit' },
    ],
  },
  dfd: {
    type: 'dfd',
    nodes: [
      { id: 'sk_dfd1', type: 'process', label: '1.0 Order food', description: 'Compute kitchen ticket & bill', moduleCategory: 'Process', position: { x: 380, y: 150 }, colorTheme: 'cyan' },
      { id: 'sk_dfd2', type: 'inputOutput', label: 'Kitchen (Entity)', description: 'Cooking station terminator', moduleCategory: 'External Entity', position: { x: 740, y: 150 }, colorTheme: 'amber' },
      { id: 'sk_dfd3', type: 'database', label: 'Inventory (Store)', description: 'Ingredient master data', moduleCategory: 'Data Store', position: { x: 380, y: 290 }, colorTheme: 'slate' },
      { id: 'sk_dfd4', type: 'database', label: 'Order (Store)', description: 'Open order records', moduleCategory: 'Data Store', position: { x: 620, y: 290 }, colorTheme: 'slate' },
      { id: 'sk_dfd5', type: 'process', label: '2.0 Make report', description: 'Aggregate sales summary', moduleCategory: 'Process', position: { x: 380, y: 450 }, colorTheme: 'cyan' },
      { id: 'sk_dfd6', type: 'inputOutput', label: 'Manager (Entity)', description: 'Executive stakeholder', moduleCategory: 'External Entity', position: { x: 740, y: 450 }, colorTheme: 'amber' },
      { id: 'sk_dfd7', type: 'process', label: '3.0 Order audit', description: 'Supply reconciliation', moduleCategory: 'Process', position: { x: 380, y: 590 }, colorTheme: 'cyan' },
      { id: 'sk_dfd8', type: 'inputOutput', label: 'Supplier (Entity)', description: 'Vendor replenish orders', moduleCategory: 'External Entity', position: { x: 80, y: 590 }, colorTheme: 'amber' },
    ],
    edges: [
      { id: 'sk_dfde1', sourceNodeId: 'start_node', targetNodeId: 'sk_dfd1', label: 'Order details' },
      { id: 'sk_dfde2', sourceNodeId: 'sk_dfd1', targetNodeId: 'sk_dfd2', label: 'Kitchen ticket' },
      { id: 'sk_dfde3', sourceNodeId: 'sk_dfd1', targetNodeId: 'sk_dfd3', label: 'Inventory details' },
      { id: 'sk_dfde4', sourceNodeId: 'sk_dfd1', targetNodeId: 'sk_dfd4', label: 'Order record' },
      { id: 'sk_dfde5', sourceNodeId: 'sk_dfd4', targetNodeId: 'sk_dfd5', label: 'Read order' },
      { id: 'sk_dfde6', sourceNodeId: 'sk_dfd5', targetNodeId: 'sk_dfd6', label: 'Daily report' },
      { id: 'sk_dfde7', sourceNodeId: 'sk_dfd3', targetNodeId: 'sk_dfd7', label: 'Audit details' },
      { id: 'sk_dfde8', sourceNodeId: 'sk_dfd7', targetNodeId: 'sk_dfd8', label: 'PO to supplier' },
    ],
  },
  algorithm: {
    type: 'algorithm',
    nodes: [
      { id: 'sk_alg1', type: 'process', label: 'Declare variables a, b and c', description: 'Initialize memory vars', moduleCategory: 'Declaration', position: { x: 400, y: 150 }, colorTheme: 'violet' },
      { id: 'sk_alg2', type: 'inputOutput', label: 'Read a, b and c', description: 'Accept user input', moduleCategory: 'I/O Input', position: { x: 400, y: 250 }, colorTheme: 'violet' },
      { id: 'sk_alg3', type: 'decision', label: 'is a > b ?', description: 'Primary comparison', moduleCategory: 'Branch', position: { x: 420, y: 350 }, colorTheme: 'violet' },
      { id: 'sk_alg4', type: 'decision', label: 'is b > c ?', description: 'Secondary test left', moduleCategory: 'Branch', position: { x: 220, y: 490 }, colorTheme: 'violet' },
      { id: 'sk_alg5', type: 'decision', label: 'is a > c ?', description: 'Secondary test right', moduleCategory: 'Branch', position: { x: 620, y: 490 }, colorTheme: 'violet' },
      { id: 'sk_alg6', type: 'inputOutput', label: 'print b', description: 'Output max b', moduleCategory: 'I/O Output', position: { x: 100, y: 630 }, colorTheme: 'violet' },
      { id: 'sk_alg7', type: 'inputOutput', label: 'print c', description: 'Output max c', moduleCategory: 'I/O Output', position: { x: 420, y: 630 }, colorTheme: 'violet' },
      { id: 'sk_alg8', type: 'inputOutput', label: 'print a', description: 'Output max a', moduleCategory: 'I/O Output', position: { x: 740, y: 630 }, colorTheme: 'violet' },
      { id: 'sk_alg9', type: 'end', label: 'Stop', description: 'End execution', moduleCategory: 'Termination', position: { x: 420, y: 760 }, colorTheme: 'violet' },
    ],
    edges: [
      { id: 'sk_alge1', sourceNodeId: 'start_node', targetNodeId: 'sk_alg1', label: 'Execute' },
      { id: 'sk_alge2', sourceNodeId: 'sk_alg1', targetNodeId: 'sk_alg2', label: 'Next' },
      { id: 'sk_alge3', sourceNodeId: 'sk_alg2', targetNodeId: 'sk_alg3', label: 'Compare' },
      { id: 'sk_alge4', sourceNodeId: 'sk_alg3', targetNodeId: 'sk_alg4', label: 'False' },
      { id: 'sk_alge5', sourceNodeId: 'sk_alg3', targetNodeId: 'sk_alg5', label: 'True' },
      { id: 'sk_alge6', sourceNodeId: 'sk_alg4', targetNodeId: 'sk_alg6', label: 'True' },
      { id: 'sk_alge7', sourceNodeId: 'sk_alg4', targetNodeId: 'sk_alg7', label: 'False' },
      { id: 'sk_alge8', sourceNodeId: 'sk_alg5', targetNodeId: 'sk_alg7', label: 'False' },
      { id: 'sk_alge9', sourceNodeId: 'sk_alg5', targetNodeId: 'sk_alg8', label: 'True' },
      { id: 'sk_alge10', sourceNodeId: 'sk_alg6', targetNodeId: 'sk_alg9', label: 'Done' },
      { id: 'sk_alge11', sourceNodeId: 'sk_alg7', targetNodeId: 'sk_alg9', label: 'Done' },
      { id: 'sk_alge12', sourceNodeId: 'sk_alg8', targetNodeId: 'sk_alg9', label: 'Done' },
    ],
  },
  general: {
    type: 'general',
    nodes: [
      { id: 'sk_gen1', type: 'process', label: 'Review Business Requirement', description: 'Analyze scope & feasibility', moduleCategory: 'General', position: { x: 380, y: 160 }, colorTheme: 'indigo' },
      { id: 'sk_gen2', type: 'decision', label: 'Feasibility Approved ?', description: 'Budget & capacity check', moduleCategory: 'General', position: { x: 400, y: 280 }, colorTheme: 'amber' },
      { id: 'sk_gen3', type: 'database', label: 'Project Ledger Record', description: 'Persist project baseline', moduleCategory: 'General', position: { x: 400, y: 440 }, colorTheme: 'cyan' },
      { id: 'sk_gen4', type: 'end', label: 'Project Kickoff (End)', description: 'Process complete', moduleCategory: 'General', position: { x: 400, y: 590 }, colorTheme: 'emerald' },
    ],
    edges: [
      { id: 'sk_gene1', sourceNodeId: 'start_node', targetNodeId: 'sk_gen1', label: 'Begins' },
      { id: 'sk_gene2', sourceNodeId: 'sk_gen1', targetNodeId: 'sk_gen2', label: 'Submits' },
      { id: 'sk_gene3', sourceNodeId: 'sk_gen2', targetNodeId: 'sk_gen3', label: 'Approved' },
      { id: 'sk_gene4', sourceNodeId: 'sk_gen3', targetNodeId: 'sk_gen4', label: 'Committed' },
    ],
  },
  kanban: {
    type: 'kanban',
    nodes: [],
    edges: [],
  },
};

/**
 * Factory to create an initial Project Tab with clean Start node and skeleton template
 */
export const createInitialProject = (
  type: FlowchartProjectType = 'userflow',
  customTitle?: string,
): FlowProjectTab => {
  const meta = FLOWCHART_TYPES_METADATA.find((m) => m.type === type);
  const title = customTitle || meta?.title.split('/')[0].trim() || 'New Flowchart';
  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  let startNode: FlowNode;

  if (type === 'swimlane') {
    startNode = {
      id: 'start_node',
      type: 'start',
      label: 'Find potential customers',
      description: 'Prospect identification trigger',
      moduleCategory: 'Sales Department',
      position: { x: 280, y: 75 },
      colorTheme: 'emerald',
    };

    return {
      id,
      title,
      type,
      nodes: [startNode],
      edges: [],
      showGhostSkeleton: true,
      transform: { x: 40, y: 30, scale: 1 },
      swimlanes: [
        { id: 'lane_sales', name: 'Sales Department', color: '#6366f1', height: 180 },
        { id: 'lane_purchasing', name: 'Purchasing Department', color: '#ec4899', height: 180 },
        { id: 'lane_production', name: 'Production Department', color: '#f59e0b', height: 180 },
        { id: 'lane_finance', name: 'Finance Department', color: '#ef4444', height: 180 },
      ],
      masterTitle: 'XXX Company Business Process Diagram',
    };
  } else if (type === 'kanban') {
    return {
      id,
      title: customTitle || 'Jira Task Board',
      type: 'kanban',
      nodes: [],
      edges: [],
      showGhostSkeleton: false,
      transform: { x: 0, y: 0, scale: 1 },
      kanbanTasks: [
        {
          id: 'task_sample_1',
          key: 'ERP-101',
          title: 'Implementasi Validasi Kredensial & Screen Error Login',
          description: 'Pastikan status HTTP 401 mengembalikan UI mockup alert error dan memblokir sesi user yang tidak sah.',
          status: 'in_progress',
          priority: 'high',
          assignee: 'Budi Santoso (Frontend)',
          linkedWorkflowTabTitle: 'Amazon Book Order',
          linkedSourceNodeId: 'sk_u3',
          linkedSourceNodeLabel: 'Log In / Credentials',
          linkedTargetNodeId: 'sk_u4',
          linkedTargetNodeLabel: 'Register Account',
          linkedEdgeLabel: 'No (Invalid)',
          tags: ['Auth', 'Security', 'Frontend'],
          createdAt: '2026-10-17',
        },
        {
          id: 'task_sample_2',
          key: 'ERP-102',
          title: 'Integrasi Payment Gateway & Webhook Notifikasi Pembayaran',
          description: 'Hubungkan endpoint callback pembayaran otomatis untuk merubah status order dari pending menjadi paid.',
          status: 'todo',
          priority: 'urgent',
          assignee: 'Siti Rahma (Backend)',
          linkedWorkflowTabTitle: 'Amazon Book Order',
          linkedSourceNodeId: 'sk_u13',
          linkedSourceNodeLabel: 'Select payment method',
          linkedTargetNodeId: 'sk_u15',
          linkedTargetNodeLabel: 'Place order',
          linkedEdgeLabel: 'Verify Success',
          tags: ['Payment', 'API', 'Webhook'],
          createdAt: '2026-10-17',
        },
        {
          id: 'task_sample_3',
          key: 'ERP-103',
          title: 'QC & Pengujian Alur Signing Kontrak Penjualan',
          description: 'Verifikasi validitas klausa termin pembayaran sebelum diserahkan ke Purchasing Department.',
          status: 'review',
          priority: 'medium',
          assignee: 'Fajar Pratama (QA)',
          linkedWorkflowTabTitle: 'SOP Perusahaan',
          linkedSourceNodeId: 'sk_s1',
          linkedSourceNodeLabel: 'Sales contract signing',
          linkedTargetNodeId: 'sk_s2',
          linkedTargetNodeLabel: 'Contract review',
          linkedEdgeLabel: 'Review',
          tags: ['QA', 'SOP'],
          createdAt: '2026-10-17',
        },
        {
          id: 'task_sample_4',
          key: 'ERP-104',
          title: 'Migrasi & Pembuatan Tabel Master Ledger PostgreSQL / SAP',
          description: 'DDL skema tabel VBAK/VBAP untuk persistensi data invoice dan pajak.',
          status: 'done',
          priority: 'low',
          assignee: 'Andi Wijaya (DBA)',
          linkedWorkflowTabTitle: 'Amazon Book Order',
          linkedSourceNodeId: 'node_sample_6',
          linkedSourceNodeLabel: 'VBAK / VBAP Sales Ledger',
          tags: ['Database', 'Postgres'],
          createdAt: '2026-10-16',
        },
      ],
    };
  } else if (type === 'dfd') {
    startNode = {
      id: 'start_node',
      type: 'inputOutput',
      label: 'Customer (Entity)',
      description: 'Places food order & receives bill',
      moduleCategory: 'External Entity',
      position: { x: 80, y: 150 },
      colorTheme: 'amber',
    };
  } else if (type === 'sop') {
    startNode = {
      id: 'start_node',
      type: 'start',
      label: 'Start (Hospital Triage)',
      description: 'Patient check-in entry point',
      moduleCategory: 'Reception',
      position: { x: 180, y: 60 },
      colorTheme: 'rose',
    };
  } else if (type === 'algorithm') {
    startNode = {
      id: 'start_node',
      type: 'start',
      label: 'Start',
      description: 'Program execution entry',
      moduleCategory: 'Algorithm Logic',
      position: { x: 420, y: 60 },
      colorTheme: 'violet',
    };
  } else {
    // userflow or general
    startNode = {
      id: 'start_node',
      type: 'start',
      label: 'Start',
      description: 'Online book shopping flow',
      moduleCategory: 'Customer Journey',
      position: { x: 520, y: 40 },
      colorTheme: 'emerald',
      width: 160,
      height: 50,
    };
  }

  // Auto-center diagram in viewport (Horizontal center at X=600)
  const screenW = typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : 1280;
  const diagramCenterX = 600;
  const initialX = Math.round(screenW / 2 - diagramCenterX);

  return {
    id,
    title,
    type,
    nodes: [startNode],
    edges: [],
    showGhostSkeleton: true,
    transform: { x: initialX, y: 40, scale: 1 },
  };
};

