import type {
  FlowProjectTab,
  FlowNode,
  FlowEdge,
  FlowGroupFrame,
  HermesAiConfig,
  ScannedFile,
} from './ErpFlowGen.type';
import { _generateUniqueId } from './ErpFlowGen.utils';

export const DEFAULT_AI_CONFIG: HermesAiConfig = {
  endpoint: 'https://openrouter.ai/api/v1',
  model: 'nousresearch/hermes-3-llama-3.1-70b',
  apiKey: '',
};

export const AI_STORAGE_KEY = 'erp_flowgen_hermes_config';

/**
 * Directories and patterns to ignore during codebase scanning
 */
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  'coverage',
  '.idea',
  '.vscode',
  'vendor',
  'tmp',
  'temp',
  'logs',
  '.turbo',
  '__pycache__',
]);

const ALLOWED_EXTENSIONS = new Set([
  'ts',
  'tsx',
  'js',
  'jsx',
  'mjs',
  'cjs',
  'json',
  'py',
  'go',
  'rs',
  'java',
  'php',
  'rb',
  'sql',
  'prisma',
  'graphql',
  'md',
]);

/**
 * Scan codebase files using modern Web File System Access API
 */
export async function scanProjectDirectory(
  dirHandle: FileSystemDirectoryHandle,
  onProgress?: (count: number, currentFile: string) => void,
  maxFiles = 60,
): Promise<{ folderName: string; files: ScannedFile[] }> {
  const files: ScannedFile[] = [];
  const folderName = dirHandle.name;

  async function traverse(currentDir: FileSystemDirectoryHandle, currentPath: string): Promise<void> {
    if (files.length >= maxFiles) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for await (const entry of (currentDir as any).values()) {
      if (files.length >= maxFiles) break;

      if (entry.kind === 'directory') {
        if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
          await traverse(entry, `${currentPath}${entry.name}/`);
        }
      } else if (entry.kind === 'file') {
        const ext = entry.name.split('.').pop()?.toLowerCase() || '';
        if (ALLOWED_EXTENSIONS.has(ext)) {
          try {
            const file = await entry.getFile();
            if (file.size < 350000) { // Limit to 350KB per file
              const text = await file.text();
              const snippet = text.slice(0, 4000); // 4KB preview
              files.push({
                path: `${currentPath}${entry.name}`,
                name: entry.name,
                extension: ext,
                size: file.size,
                contentSnippet: snippet,
              });
              onProgress?.(files.length, `${currentPath}${entry.name}`);
            }
          } catch {
            // Ignore unreadable files
          }
        }
      }
    }
  }

  await traverse(dirHandle, '');
  return { folderName, files };
}

/**
 * Fallback scanner for standard HTML file input with webkitdirectory
 */
export async function scanProjectFileList(
  fileList: FileList,
  onProgress?: (count: number, currentFile: string) => void,
  maxFiles = 60,
): Promise<{ folderName: string; files: ScannedFile[] }> {
  const files: ScannedFile[] = [];
  let folderName = 'Project';

  for (let i = 0; i < fileList.length; i++) {
    if (files.length >= maxFiles) break;

    const file = fileList[i];
    const path = file.webkitRelativePath || file.name;
    const parts = path.split('/');
    if (parts.length > 0 && parts[0]) {
      folderName = parts[0];
    }

    const isIgnored = parts.some((p) => IGNORED_DIRS.has(p) || p.startsWith('.'));
    if (isIgnored) continue;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (ALLOWED_EXTENSIONS.has(ext) && file.size < 350000) {
      try {
        const text = await file.text();
        files.push({
          path,
          name: file.name,
          extension: ext,
          size: file.size,
          contentSnippet: text.slice(0, 4000),
        });
        onProgress?.(files.length, path);
      } catch {
        // Ignore unreadable
      }
    }
  }

  return { folderName, files };
}

/**
 * Test AI API connection (OpenRouter or OpenAI-compatible endpoint)
 */
export async function testAiConnection(config: HermesAiConfig): Promise<{ success: boolean; message: string }> {
  if (!config.endpoint) {
    return { success: false, message: 'API Endpoint URL is required!' };
  }

  const endpointUrl = config.endpoint.replace(/\/+$/, '');
  const url = `${endpointUrl}/chat/completions`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin || 'http://localhost:5173',
      'X-Title': 'Want Take Flow',
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey.trim()}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model.trim() || 'nousresearch/hermes-3-llama-3.1-70b',
        messages: [{ role: 'user', content: 'Ping' }],
        max_tokens: 5,
      }),
    });

    if (res.ok) {
      return { success: true, message: `Connected to ${config.model} successfully!` };
    }

    const errText = await res.text();
    let detail = errText;
    try {
      const errJson = JSON.parse(errText);
      detail = errJson.error?.message || errText;
    } catch {
      // Keep errText
    }

    return { success: false, message: `Failed (${res.status}): ${detail.slice(0, 150)}` };
  } catch (err: unknown) {
    return {
      success: false,
      message: `Connection failed: ${(err as Error).message || 'Please check URL and internet connection.'}`,
    };
  }
}

/**
 * Generate Multi-Tab Flowcharts from Scanned Codebase
 * Divides architecture into:
 * 1. Global High-Level Overview Tab (End-to-End)
 * 2+. Detailed Feature Tabs (Modules, Services, Auth, Workflows)
 */
export async function generateFlowFromCodebase(
  folderName: string,
  files: ScannedFile[],
  config: HermesAiConfig,
  onStepChange?: (step: string) => void,
): Promise<FlowProjectTab[]> {
  // If API key is provided and endpoint is configured, attempt Hermes AI Generation
  if (config.apiKey.trim() && config.endpoint.trim()) {
    try {
      onStepChange?.('Preparing architecture analysis prompt for Hermes AI...');
      const summary = _buildCodebaseSummary(folderName, files);

      const endpointUrl = config.endpoint.replace(/\/+$/, '');
      const url = `${endpointUrl}/chat/completions`;

      const prompt = `You are a Principal Enterprise Software Architect.
Analyze the following codebase files and generate a comprehensive multi-tab flowchart architecture.

CRITICAL REQUIREMENT:
DO NOT put the entire system into a single huge diagram.
Instead, divide the system cleanly into separate tabs:
- Tab 1 MUST be the "High-Level Architecture (E2E)" overview showing end-to-end data flow: Client/UI -> API Gateway/Routes -> Controllers -> Core Services -> Database/Storage.
- Tabs 2+ MUST represent individual major features or modules (e.g. "Feature: Authentication & Session", "Feature: Order Processing", "Feature: Database & Data Models", "Feature: UI State & Handlers").

Return ONLY a strict JSON object with NO markdown formatting, NO backticks, NO explanations:
{
  "tabs": [
    {
      "id": "tab_e2e_overview",
      "title": "01. Architecture Overview (E2E)",
      "type": "general",
      "nodes": [
        {
          "id": "node_1",
          "type": "start",
          "label": "User / Client Request",
          "description": "HTTP request or UI user interaction",
          "moduleCategory": "Frontend",
          "position": { "x": 100, "y": 240 },
          "colorTheme": "indigo"
        },
        {
          "id": "node_2",
          "type": "process",
          "label": "API Router / Gateway",
          "description": "Route matching and middleware validation",
          "moduleCategory": "Routing",
          "position": { "x": 420, "y": 240 },
          "colorTheme": "indigo"
        },
        {
          "id": "node_3",
          "type": "decision",
          "label": "Authorized & Valid?",
          "description": "Validate session token or request payload",
          "moduleCategory": "Security",
          "position": { "x": 760, "y": 220 },
          "colorTheme": "amber"
        },
        {
          "id": "node_4",
          "type": "database",
          "label": "Database Storage",
          "description": "Persist transaction or fetch records",
          "moduleCategory": "Database",
          "position": { "x": 1100, "y": 240 },
          "colorTheme": "cyan"
        },
        {
          "id": "node_5",
          "type": "end",
          "label": "Return HTTP Response",
          "description": "200 OK / JSON payload delivered",
          "moduleCategory": "Response",
          "position": { "x": 1440, "y": 240 },
          "colorTheme": "emerald"
        }
      ],
      "edges": [
        { "id": "e1", "sourceNodeId": "node_1", "targetNodeId": "node_2", "label": "Dispatches Request" },
        { "id": "e2", "sourceNodeId": "node_2", "targetNodeId": "node_3", "label": "Validate" },
        { "id": "e3", "sourceNodeId": "node_3", "targetNodeId": "node_4", "label": "Ya / Valid" },
        { "id": "e4", "sourceNodeId": "node_4", "targetNodeId": "node_5", "label": "Success" }
      ],
      "groups": [
        {
          "id": "group_1",
          "title": "Backend API Layer",
          "position": { "x": 380, "y": 140 },
          "width": 1260,
          "height": 260,
          "colorTheme": "indigo"
        }
      ]
    }
  ]
}

Codebase summary:
${summary}`;

      onStepChange?.(`Connecting to Hermes 3 (${config.model})...`);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey.trim()}`,
          'HTTP-Referer': window.location.origin || 'http://localhost:5173',
          'X-Title': 'Want Take Flow',
        },
        body: JSON.stringify({
          model: config.model.trim() || 'nousresearch/hermes-3-llama-3.1-70b',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 3500,
        }),
      });

      if (!res.ok) {
        throw new Error(`Hermes API error: ${res.statusText}`);
      }

      onStepChange?.('Parsing architecture JSON response from Hermes AI...');
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';

      const cleanedJson = _cleanJsonString(content);
      const parsed = JSON.parse(cleanedJson);

      if (parsed.tabs && Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
        return parsed.tabs.map((tabData: any, idx: number) => ({
          id: tabData.id || _generateUniqueId(`tab_ai_${idx}`),
          title: tabData.title || `Tab ${idx + 1}`,
          type: tabData.type || (idx === 0 ? 'general' : 'algorithm'),
          nodes: (tabData.nodes || []).map((n: any) => ({
            id: n.id || _generateUniqueId('node'),
            type: n.type || 'process',
            label: n.label || 'Step',
            description: n.description || '',
            moduleCategory: n.moduleCategory || 'Core',
            position: n.position || { x: 100, y: 150 },
            colorTheme: n.colorTheme || 'indigo',
          })),
          edges: (tabData.edges || []).map((e: any) => ({
            id: e.id || _generateUniqueId('edge'),
            sourceNodeId: e.sourceNodeId,
            targetNodeId: e.targetNodeId,
            label: e.label || '',
          })),
          groups: (tabData.groups || []).map((g: any) => ({
            id: g.id || _generateUniqueId('group'),
            title: g.title || 'Module Frame',
            position: g.position || { x: 80, y: 80 },
            width: g.width || 800,
            height: g.height || 300,
            colorTheme: g.colorTheme || 'indigo',
          })),
          showGhostSkeleton: false,
          transform: { x: 60, y: 60, scale: 0.9 },
        }));
      }
    } catch {
      // Fall through to deterministic smart generator
    }
  }

  // Deterministic Smart Fallback Analyzer (Never fails)
  onStepChange?.('Analyzing project file structure locally...');
  return _generateSmartLocalFlowTabs(folderName, files);
}

/**
 * Clean LLM response string to extract pure JSON
 */
function _cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

/**
 * Build summarized representation of codebase for AI prompt
 */
function _buildCodebaseSummary(folderName: string, files: ScannedFile[]): string {
  const fileTree = files.map((f) => `- ${f.path} (${Math.round(f.size / 1024)} KB)`).join('\n');

  // Identify package.json or main config
  const pkgFile = files.find((f) => f.name === 'package.json');
  let dependencies = '';
  if (pkgFile) {
    try {
      const parsed = JSON.parse(pkgFile.contentSnippet);
      const deps = Object.keys(parsed.dependencies || {}).join(', ');
      dependencies = `Dependencies: ${deps}`;
    } catch {
      // Ignore
    }
  }

  // Key sample snippets
  const samples = files
    .slice(0, 15)
    .map((f) => `--- File: ${f.path} ---\n${f.contentSnippet.slice(0, 800)}`)
    .join('\n\n');

  return `Project Name: ${folderName}
Total Files: ${files.length}
${dependencies}

File Tree:
${fileTree}

Key File Snippets:
${samples}`;
}

/**
 * Intelligent deterministic generator that inspects the scanned files
 * and produces clean, multi-tab flowcharts (E2E Overview + Feature Tabs)
 */
function _generateSmartLocalFlowTabs(folderName: string, files: ScannedFile[]): FlowProjectTab[] {
  // Detect architectural aspects
  const hasRoutes = files.some((f) => f.path.toLowerCase().includes('route') || f.path.toLowerCase().includes('controller') || f.path.toLowerCase().includes('api'));
  const hasDb = files.some((f) => f.path.toLowerCase().includes('model') || f.path.toLowerCase().includes('schema') || f.path.toLowerCase().includes('db') || f.path.toLowerCase().includes('entity'));
  const hasAuth = files.some((f) => f.path.toLowerCase().includes('auth') || f.path.toLowerCase().includes('login') || f.path.toLowerCase().includes('user') || f.path.toLowerCase().includes('session'));
  const hasFrontend = files.some((f) => f.path.toLowerCase().includes('component') || f.path.toLowerCase().includes('view') || f.path.toLowerCase().includes('page') || f.extension === 'tsx' || f.extension === 'jsx');

  const tabs: FlowProjectTab[] = [];

  // Tab 1: High-Level End-to-End Architecture Overview
  const e2eNodes: FlowNode[] = [
    {
      id: 'e2e_start',
      type: 'start',
      label: 'Client / User Interaction',
      description: `${folderName} User triggers an action`,
      moduleCategory: 'Frontend UI',
      position: { x: 60, y: 220 },
      colorTheme: 'indigo',
    },
    {
      id: 'e2e_client',
      type: 'process',
      label: hasFrontend ? 'React / UI View Component' : 'Client Application',
      description: 'Handles client state & dispatches action',
      moduleCategory: 'Presentation Layer',
      position: { x: 340, y: 205 },
      colorTheme: 'indigo',
    },
    {
      id: 'e2e_gateway',
      type: 'process',
      label: hasRoutes ? 'API Gateway & Routing' : 'Controller & Router',
      description: 'Request dispatcher & input sanitization',
      moduleCategory: 'API Layer',
      position: { x: 650, y: 205 },
      colorTheme: 'violet',
    },
    {
      id: 'e2e_decision',
      type: 'decision',
      label: 'Payload & Auth Valid?',
      description: 'Verify token, permissions & payload validation',
      moduleCategory: 'Security & Validation',
      position: { x: 970, y: 185 },
      colorTheme: 'amber',
    },
    {
      id: 'e2e_service',
      type: 'process',
      label: 'Business Service Layer',
      description: 'Executes core domain logic & business rules',
      moduleCategory: 'Business Logic',
      position: { x: 1290, y: 205 },
      colorTheme: 'emerald',
    },
    {
      id: 'e2e_db',
      type: 'database',
      label: hasDb ? 'Database Storage / Entity' : 'Persistent Storage',
      description: 'Reads / writes data records transactionally',
      moduleCategory: 'Data Layer',
      position: { x: 1610, y: 195 },
      colorTheme: 'cyan',
    },
    {
      id: 'e2e_end',
      type: 'end',
      label: 'Render Success Response',
      description: '200 OK Response returned to client',
      moduleCategory: 'Output',
      position: { x: 1930, y: 220 },
      colorTheme: 'emerald',
    },
    {
      id: 'e2e_reject',
      type: 'end',
      label: 'Return Error 400/401',
      description: 'Invalid input or unauthorized token error',
      moduleCategory: 'Error Handler',
      position: { x: 970, y: 440 },
      colorTheme: 'rose',
    },
  ];

  const e2eEdges: FlowEdge[] = [
    { id: 'edge_e2e_1', sourceNodeId: 'e2e_start', targetNodeId: 'e2e_client', label: 'User Action' },
    { id: 'edge_e2e_2', sourceNodeId: 'e2e_client', targetNodeId: 'e2e_gateway', label: 'HTTP / API Call' },
    { id: 'edge_e2e_3', sourceNodeId: 'e2e_gateway', targetNodeId: 'e2e_decision', label: 'Validate' },
    { id: 'edge_e2e_4', sourceNodeId: 'e2e_decision', targetNodeId: 'e2e_service', label: 'Ya / Valid' },
    { id: 'edge_e2e_5', sourceNodeId: 'e2e_decision', targetNodeId: 'e2e_reject', label: 'Tidak / Error' },
    { id: 'edge_e2e_6', sourceNodeId: 'e2e_service', targetNodeId: 'e2e_db', label: 'Commit Transaction' },
    { id: 'edge_e2e_7', sourceNodeId: 'e2e_db', targetNodeId: 'e2e_end', label: 'Success Data' },
  ];

  const e2eGroups: FlowGroupFrame[] = [
    {
      id: 'group_e2e_frontend',
      title: 'Frontend & Client Layer',
      position: { x: 40, y: 130 },
      width: 550,
      height: 250,
      colorTheme: 'indigo',
    },
    {
      id: 'group_e2e_backend',
      title: 'Backend Services & Core Logic',
      position: { x: 620, y: 110 },
      width: 930,
      height: 430,
      colorTheme: 'violet',
    },
    {
      id: 'group_e2e_storage',
      title: 'Persistence & Output',
      position: { x: 1580, y: 130 },
      width: 530,
      height: 250,
      colorTheme: 'cyan',
    },
  ];

  tabs.push({
    id: _generateUniqueId('tab_e2e'),
    title: '01. Arsitektur E2E (Overview)',
    type: 'general',
    nodes: e2eNodes,
    edges: e2eEdges,
    groups: e2eGroups,
    showGhostSkeleton: false,
    transform: { x: 40, y: 50, scale: 0.8 },
  });

  // Tab 2: Feature: Business Logic & Processing Flow
  const logicNodes: FlowNode[] = [
    {
      id: 'logic_start',
      type: 'start',
      label: 'Dispatch Action Trigger',
      description: 'Incoming payload prepared for processing',
      moduleCategory: 'Trigger',
      position: { x: 80, y: 180 },
      colorTheme: 'indigo',
    },
    {
      id: 'logic_parse',
      type: 'process',
      label: 'Input Parsing & Sanitization',
      description: 'Parse body params and validate structure types',
      moduleCategory: 'Parser',
      position: { x: 360, y: 165 },
      colorTheme: 'indigo',
    },
    {
      id: 'logic_check',
      type: 'decision',
      label: 'Business Rules Passed?',
      description: 'Verify state consistency & prerequisites',
      moduleCategory: 'Domain Logic',
      position: { x: 680, y: 145 },
      colorTheme: 'amber',
    },
    {
      id: 'logic_process',
      type: 'process',
      label: 'Execute Domain Service',
      description: 'Apply computational calculations & state mutations',
      moduleCategory: 'Service Layer',
      position: { x: 1000, y: 165 },
      colorTheme: 'emerald',
    },
    {
      id: 'logic_audit',
      type: 'process',
      label: 'Emit Event / Audit Log',
      description: 'Log transaction telemetry or broadcast update',
      moduleCategory: 'Observability',
      position: { x: 1320, y: 165 },
      colorTheme: 'slate',
    },
    {
      id: 'logic_end',
      type: 'end',
      label: 'Process Completed',
      description: 'State committed successfully',
      moduleCategory: 'Done',
      position: { x: 1640, y: 180 },
      colorTheme: 'emerald',
    },
    {
      id: 'logic_reject',
      type: 'end',
      label: 'Rollback & Throw Exception',
      description: 'Abort operation with diagnostic message',
      moduleCategory: 'Error',
      position: { x: 680, y: 390 },
      colorTheme: 'rose',
    },
  ];

  const logicEdges: FlowEdge[] = [
    { id: 'edge_l_1', sourceNodeId: 'logic_start', targetNodeId: 'logic_parse', label: 'Payload' },
    { id: 'edge_l_2', sourceNodeId: 'logic_parse', targetNodeId: 'logic_check', label: 'Check Logic' },
    { id: 'edge_l_3', sourceNodeId: 'logic_check', targetNodeId: 'logic_process', label: 'Ya / Valid' },
    { id: 'edge_l_4', sourceNodeId: 'logic_check', targetNodeId: 'logic_reject', label: 'Tidak / Abort' },
    { id: 'edge_l_5', sourceNodeId: 'logic_process', targetNodeId: 'logic_audit', label: 'Success' },
    { id: 'edge_l_6', sourceNodeId: 'logic_audit', targetNodeId: 'logic_end', label: 'Finished' },
  ];

  const logicGroups: FlowGroupFrame[] = [
    {
      id: 'group_logic_validation',
      title: 'Rule Engine & Invariants',
      position: { x: 330, y: 80 },
      width: 590,
      height: 400,
      colorTheme: 'amber',
    },
    {
      id: 'group_logic_exec',
      title: 'Domain State Mutation',
      position: { x: 960, y: 80 },
      width: 590,
      height: 250,
      colorTheme: 'emerald',
    },
  ];

  tabs.push({
    id: _generateUniqueId('tab_logic'),
    title: '02. Feature: Business Logic Flow',
    type: 'algorithm',
    nodes: logicNodes,
    edges: logicEdges,
    groups: logicGroups,
    showGhostSkeleton: false,
    transform: { x: 50, y: 60, scale: 0.85 },
  });

  // Tab 3: Feature: Data Layer & Persistence Pipeline
  const dbNodes: FlowNode[] = [
    {
      id: 'db_start',
      type: 'start',
      label: 'Database Operation Trigger',
      description: 'Incoming query / mutation request',
      moduleCategory: 'ORM / Query',
      position: { x: 80, y: 190 },
      colorTheme: 'cyan',
    },
    {
      id: 'db_conn',
      type: 'process',
      label: 'Acquire Pool Connection',
      description: 'Check active pool connection & health check',
      moduleCategory: 'Connection Pool',
      position: { x: 360, y: 175 },
      colorTheme: 'cyan',
    },
    {
      id: 'db_check',
      type: 'decision',
      label: 'Transaction Needed?',
      description: 'Determine single query or multi-table commit',
      moduleCategory: 'Transaction Mgr',
      position: { x: 680, y: 155 },
      colorTheme: 'amber',
    },
    {
      id: 'db_tx',
      type: 'process',
      label: 'Begin Database Transaction',
      description: 'Execute queries with ACID rollback protection',
      moduleCategory: 'ACID Scope',
      position: { x: 1000, y: 120 },
      colorTheme: 'indigo',
    },
    {
      id: 'db_table',
      type: 'database',
      label: 'Database Schema Tables',
      description: `${folderName} schema tables & relational indexes`,
      moduleCategory: 'Persistence',
      position: { x: 1320, y: 155 },
      colorTheme: 'cyan',
    },
    {
      id: 'db_end',
      type: 'end',
      label: 'Commit & Release Connection',
      description: 'Transaction committed and pool socket freed',
      moduleCategory: 'Completed',
      position: { x: 1650, y: 190 },
      colorTheme: 'emerald',
    },
    {
      id: 'db_simple',
      type: 'process',
      label: 'Execute Read Query (SELECT)',
      description: 'Read-only indexed scan without lock contention',
      moduleCategory: 'Read Replica',
      position: { x: 1000, y: 280 },
      colorTheme: 'slate',
    },
  ];

  const dbEdges: FlowEdge[] = [
    { id: 'edge_db_1', sourceNodeId: 'db_start', targetNodeId: 'db_conn', label: 'Connect' },
    { id: 'edge_db_2', sourceNodeId: 'db_conn', targetNodeId: 'db_check', label: 'Execute' },
    { id: 'edge_db_3', sourceNodeId: 'db_check', targetNodeId: 'db_tx', label: 'Ya / Multi-Step' },
    { id: 'edge_db_4', sourceNodeId: 'db_check', targetNodeId: 'db_simple', label: 'Tidak / Read-Only' },
    { id: 'edge_db_5', sourceNodeId: 'db_tx', targetNodeId: 'db_table', label: 'Write / Commit' },
    { id: 'edge_db_6', sourceNodeId: 'db_simple', targetNodeId: 'db_table', label: 'Query Data' },
    { id: 'edge_db_7', sourceNodeId: 'db_table', targetNodeId: 'db_end', label: 'Return Result' },
  ];

  const dbGroups: FlowGroupFrame[] = [
    {
      id: 'group_db_tx',
      title: 'Database Engine & Transactions',
      position: { x: 640, y: 60 },
      width: 950,
      height: 340,
      colorTheme: 'cyan',
    },
  ];

  tabs.push({
    id: _generateUniqueId('tab_db'),
    title: '03. Feature: Database & Data Models',
    type: 'dfd',
    nodes: dbNodes,
    edges: dbEdges,
    groups: dbGroups,
    showGhostSkeleton: false,
    transform: { x: 50, y: 60, scale: 0.85 },
  });

  if (hasAuth) {
    const authNodes: FlowNode[] = [
      {
        id: 'auth_start',
        type: 'start',
        label: 'Auth Request (Login/Token)',
        description: 'Client presents credential or Bearer JWT',
        moduleCategory: 'Client Auth',
        position: { x: 80, y: 190 },
        colorTheme: 'violet',
      },
      {
        id: 'auth_verify',
        type: 'process',
        label: 'Verify JWT Signature',
        description: 'Verify cryptographic secret or RS256 public key',
        moduleCategory: 'Security Token',
        position: { x: 360, y: 175 },
        colorTheme: 'violet',
      },
      {
        id: 'auth_decision',
        type: 'decision',
        label: 'Signature & Token Valid?',
        description: 'Check expiration exp, issuer iss, and signature',
        moduleCategory: 'Validation',
        position: { x: 680, y: 155 },
        colorTheme: 'amber',
      },
      {
        id: 'auth_grant',
        type: 'process',
        label: 'Attach User Context to Request',
        description: 'Decorate request context with permissions & user ID',
        moduleCategory: 'Context Middleware',
        position: { x: 1000, y: 175 },
        colorTheme: 'emerald',
      },
      {
        id: 'auth_end',
        type: 'end',
        label: 'Allow Route Access',
        description: 'Pass next() to downstream controller handler',
        moduleCategory: 'Authorized',
        position: { x: 1320, y: 190 },
        colorTheme: 'emerald',
      },
      {
        id: 'auth_reject',
        type: 'end',
        label: 'Reject 401 Unauthorized',
        description: 'Token expired, invalid signature, or revoked',
        moduleCategory: 'Security Block',
        position: { x: 680, y: 390 },
        colorTheme: 'rose',
      },
    ];

    const authEdges: FlowEdge[] = [
      { id: 'edge_a_1', sourceNodeId: 'auth_start', targetNodeId: 'auth_verify', label: 'Credentials' },
      { id: 'edge_a_2', sourceNodeId: 'auth_verify', targetNodeId: 'auth_decision', label: 'Check Claims' },
      { id: 'edge_a_3', sourceNodeId: 'auth_decision', targetNodeId: 'auth_grant', label: 'Ya / Valid' },
      { id: 'edge_a_4', sourceNodeId: 'auth_decision', targetNodeId: 'auth_reject', label: 'Tidak / Expired' },
      { id: 'edge_a_5', sourceNodeId: 'auth_grant', targetNodeId: 'auth_end', label: 'Authorized' },
    ];

    const authGroups: FlowGroupFrame[] = [
      {
        id: 'group_auth_sec',
        title: 'Authentication & Security Boundary',
        position: { x: 320, y: 90 },
        width: 950,
        height: 390,
        colorTheme: 'violet',
      },
    ];

    tabs.push({
      id: _generateUniqueId('tab_auth'),
      title: '04. Feature: Auth & Session Guard',
      type: 'algorithm',
      nodes: authNodes,
      edges: authEdges,
      groups: authGroups,
      showGhostSkeleton: false,
      transform: { x: 50, y: 60, scale: 0.85 },
    });
  }

  return tabs;
}
