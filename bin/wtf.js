#!/usr/bin/env node

/**
 * WTF (Want Take Flow) CLI
 * Visual Workflow & Enterprise Diagram Gateway
 *
 * Usage:
 *   wtf init
 *   wtf gateway start [--port 5174] [--no-open]
 *   wtf gateway status
 *   wtf gateway stop
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(PACKAGE_ROOT, 'dist');
const CWD = process.cwd();
const WTF_DIR = path.resolve(CWD, '.wtf');
const PID_FILE = path.resolve(WTF_DIR, 'gateway.pid');
const GLOBAL_WTF_DIR = path.resolve(os.homedir(), '.wtf');
const GLOBAL_PID_FILE = path.resolve(GLOBAL_WTF_DIR, 'gateway.pid');

const VERSION = '1.0.3';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

function printBanner() {
  console.log(`
${colors.cyan}${colors.bold}  ██╗    ██╗████████╗███████╗     ██████╗██╗     ██╗
  ██║    ██║╚══██╔══╝██╔════╝    ██╔════╝██║     ██║
  ██║ █╗ ██║   ██║   █████╗      ██║     ██║     ██║
  ██║███╗██║   ██║   ██╔══╝      ██║     ██║     ██║
  ╚███╔███╔╝   ██║   ██║         ╚██████╗███████╗██║
   ╚══╝╚══╝    ╚═╝   ╚═╝          ╚═════╝╚══════╝╚═╝${colors.reset}
  ${colors.dim}Want Take Flow (WTF) - Enterprise Flowchart & Architecture Gateway v${VERSION}${colors.reset}
`);
}

function printHelp() {
  printBanner();
  console.log(`${colors.bold}USAGE:${colors.reset}
  $ ${colors.cyan}wtf${colors.reset} <command> [options]

${colors.bold}COMMANDS:${colors.reset}
  ${colors.green}init${colors.reset}                   Initialize .wtf workspace and project configuration file
  ${colors.green}gateway start${colors.reset}          Launch WTF Gateway local application web server
  ${colors.green}gateway status${colors.reset}         Check status of running gateway process
  ${colors.green}gateway stop${colors.reset}           Stop active local gateway server
  ${colors.green}push <file.json>${colors.reset}       Push diagram JSON schema to live browser interface
  ${colors.green}schema${colors.reset}                 Display JSON schema format & prompt instructions for Hermes/AI

${colors.bold}OPTIONS:${colors.reset}
  ${colors.yellow}-p, --port <number>${colors.reset}   Gateway port (default: 5174)
  ${colors.yellow}-H, --host <host>${colors.reset}     Host bind address (default: localhost)
  ${colors.yellow}--no-open${colors.reset}             Do not automatically open the browser
  ${colors.yellow}-v, --version${colors.reset}         Display CLI version
  ${colors.yellow}-h, --help${colors.reset}            Display this help guide

${colors.bold}EXAMPLES:${colors.reset}
  $ ${colors.cyan}wtf init${colors.reset}
  $ ${colors.cyan}wtf gateway start${colors.reset}
  $ ${colors.cyan}wtf push my_flow.json${colors.reset}
  $ ${colors.cyan}wtf schema${colors.reset}
  $ ${colors.cyan}wtf gateway status${colors.reset}
  $ ${colors.cyan}wtf gateway stop${colors.reset}

${colors.bold}SUPPORT / BUY ME A COFFEE:${colors.reset}
  ${colors.magenta}https://saweria.co/wanttakeflow${colors.reset}
`);
}

function openBrowser(url) {
  const startCmd =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
      ? 'start'
      : 'xdg-open';

  exec(`${startCmd} ${url}`, (err) => {
    if (err) {
      // Non-critical, user can click the terminal link
    }
  });
}

/**
 * Command: wtf init
 */
function handleInit() {
  printBanner();
  console.log(`${colors.bold}🚀 Initializing WTF Workspace at:${colors.reset} ${colors.cyan}${CWD}${colors.reset}\n`);

  try {
    if (!fs.existsSync(WTF_DIR)) {
      fs.mkdirSync(WTF_DIR, { recursive: true });
    }

    const configFile = path.resolve(WTF_DIR, 'config.json');
    const schemasDir = path.resolve(WTF_DIR, 'schemas');

    if (!fs.existsSync(schemasDir)) {
      fs.mkdirSync(schemasDir, { recursive: true });
    }

    const sampleConfig = {
      name: path.basename(CWD),
      version: '1.0.0',
      description: 'WTF Architecture & Business Process Workspace',
      gateway: {
        defaultPort: 5174,
        host: 'localhost',
        autoOpen: true,
      },
      ai: {
        provider: 'gemini',
        model: 'gemini-2.5-pro',
      },
      diagramDefaults: {
        connectorStyle: 'orthogonal',
        theme: 'slate',
        snapToGrid: true,
      },
      createdAt: new Date().toISOString(),
    };

    if (!fs.existsSync(configFile)) {
      fs.writeFileSync(configFile, JSON.stringify(sampleConfig, null, 2), 'utf-8');
      console.log(`  ${colors.green}✓${colors.reset} Created: ${colors.cyan}.wtf/config.json${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}!${colors.reset} Configuration .wtf/config.json already exists (skipped)`);
    }

    const starterSchemaFile = path.resolve(schemasDir, 'starter_flow.json');
    if (!fs.existsSync(starterSchemaFile)) {
      const sampleSchema = {
        name: 'Starter Workflow Process',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        tabs: [
          {
            id: 'tab_starter',
            title: 'Customer Order Flow',
            type: 'userflow',
            nodes: [
              {
                id: 'n_start',
                type: 'start',
                label: 'Visit Website',
                description: 'User navigates to the e-commerce web portal',
                position: { x: 260, y: 80 },
                colorTheme: 'indigo',
              },
              {
                id: 'n_browse',
                type: 'process',
                label: 'Browse Catalog & Checkout',
                description: 'Select items and proceed to checkout shopping cart',
                position: { x: 260, y: 220 },
                colorTheme: 'blue',
              },
              {
                id: 'n_pay',
                type: 'decision',
                label: 'Payment Verified?',
                description: 'Verify payment gateway settlement status',
                position: { x: 260, y: 380 },
                colorTheme: 'amber',
              },
              {
                id: 'n_success',
                type: 'end',
                label: 'Process Order Fulfillment',
                description: 'Send invoice confirmation email and dispatch order',
                position: { x: 260, y: 560 },
                colorTheme: 'emerald',
              },
            ],
            edges: [
              { id: 'e1', sourceNodeId: 'n_start', targetNodeId: 'n_browse', label: 'Open Web' },
              { id: 'e2', sourceNodeId: 'n_browse', targetNodeId: 'n_pay', label: 'Proceed to Pay' },
              { id: 'e3', sourceNodeId: 'n_pay', targetNodeId: 'n_success', label: 'Yes / Approved' },
            ],
          },
        ],
      };
      fs.writeFileSync(starterSchemaFile, JSON.stringify(sampleSchema, null, 2), 'utf-8');
      console.log(`  ${colors.green}✓${colors.reset} Created template: ${colors.cyan}.wtf/schemas/starter_flow.json${colors.reset}`);
    }

    const agentsMdFile = path.resolve(CWD, 'AGENTS.md');
    if (!fs.existsSync(agentsMdFile)) {
      const agentsMdContent = `# AI Agent Guidelines (Hermes / Claude / Cursor / Antigravity)

## Want Take Flow (WTF) Architecture & Diagram Generation
When requested to create, inspect, or update architecture diagrams and workflow flowcharts:

1. **Schema Inspection**:
   Run \`wtf schema --json\` to retrieve the exact diagram format.

2. **Analysis & Structure**:
   Analyze the codebase and structure the flowchart into logical tabs:
   - **Tab 1: High-Level Overview**: End-to-end system flow (Client -> API Gateway -> Service -> DB).
   - **Tab 2+: Sub-Process Breakdown**: Detailed flow for complex modules (Auth, Payments, Workers).
   - **Tab Last: Kanban Board**: Task board for refactors, backlog, or issues found during code scan.

3. **Live Sync to Browser**:
   Save the output to \`flow.json\` and push to the live gateway:
   \`\`\`bash
   wtf push flow.json
   \`\`\`
`;
      fs.writeFileSync(agentsMdFile, agentsMdContent, 'utf-8');
      console.log(`  ${colors.green}✓${colors.reset} Created AI context file: ${colors.cyan}AGENTS.md${colors.reset}`);
    }

    console.log(`\n${colors.green}${colors.bold}🎉 Workspace Initialized Successfully!${colors.reset}`);
    console.log(`To launch the visual interface, run:`);
    console.log(`  $ ${colors.cyan}wtf gateway start${colors.reset}\n`);
  } catch (err) {
    console.error(`${colors.red}Failed to initialize workspace:${colors.reset}`, err);
    process.exit(1);
  }
}

/**
 * Command: wtf gateway status
 */
function handleStatus() {
  if (!fs.existsSync(PID_FILE)) {
    console.log(`${colors.yellow}WTF Gateway is currently not running.${colors.reset}`);
    return;
  }

  try {
    const raw = fs.readFileSync(PID_FILE, 'utf-8').trim();
    const { pid, port, startedAt } = JSON.parse(raw);

    // Check if process is alive
    process.kill(pid, 0);

    console.log(`\n${colors.green}${colors.bold}● WTF Gateway ACTIVE (Running)${colors.reset}`);
    console.log(`  PID:        ${colors.cyan}${pid}${colors.reset}`);
    console.log(`  URL:        ${colors.cyan}http://localhost:${port}${colors.reset}`);
    console.log(`  Started:    ${colors.dim}${startedAt}${colors.reset}\n`);
  } catch (e) {
    // Stale PID file
    fs.unlinkSync(PID_FILE);
    console.log(`${colors.yellow}WTF Gateway is not active (cleaned up stale PID).${colors.reset}`);
  }
}

/**
 * Command: wtf gateway stop
 */
function handleStop() {
  if (!fs.existsSync(PID_FILE)) {
    console.log(`${colors.yellow}No active WTF Gateway process found.${colors.reset}`);
    return;
  }

  try {
    const raw = fs.readFileSync(PID_FILE, 'utf-8').trim();
    const { pid, port } = JSON.parse(raw);

    process.kill(pid, 'SIGTERM');
    fs.unlinkSync(PID_FILE);
    console.log(`${colors.green}✓ WTF Gateway on port ${port} (PID: ${pid}) has been stopped.${colors.reset}`);
  } catch (err) {
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    console.log(`${colors.yellow}Process not found or already stopped.${colors.reset}`);
  }
}

/**
 * Command: wtf push <file.json>
 */
function handlePush(args) {
  const filePath = args[0];
  if (!filePath) {
    console.error(`${colors.red}Error: Please specify the path to a JSON diagram file.${colors.reset}`);
    console.log(`Usage: ${colors.cyan}wtf push <path/to/diagram.json>${colors.reset}`);
    process.exit(1);
  }

  const resolvedPath = path.resolve(CWD, filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`${colors.red}Error: File not found at '${resolvedPath}'${colors.reset}`);
    process.exit(1);
  }

  let content = '';
  try {
    content = fs.readFileSync(resolvedPath, 'utf-8');
    JSON.parse(content);
  } catch (e) {
    console.error(`${colors.red}Error: Invalid JSON in '${filePath}': ${e.message}${colors.reset}`);
    process.exit(1);
  }

  // Save to .wtf/schemas/current.json locally and globally
  try {
    if (!fs.existsSync(path.resolve(WTF_DIR, 'schemas'))) {
      fs.mkdirSync(path.resolve(WTF_DIR, 'schemas'), { recursive: true });
    }
    fs.writeFileSync(path.resolve(WTF_DIR, 'schemas', 'current.json'), content, 'utf-8');
  } catch (_) {}

  try {
    if (!fs.existsSync(path.resolve(GLOBAL_WTF_DIR, 'schemas'))) {
      fs.mkdirSync(path.resolve(GLOBAL_WTF_DIR, 'schemas'), { recursive: true });
    }
    fs.writeFileSync(path.resolve(GLOBAL_WTF_DIR, 'schemas', 'current.json'), content, 'utf-8');
  } catch (_) {}

  // Check if gateway is running (check local PID, global PID, or probe active ports)
  let port = null;
  for (const pFile of [PID_FILE, GLOBAL_PID_FILE]) {
    if (fs.existsSync(pFile)) {
      try {
        const pidData = JSON.parse(fs.readFileSync(pFile, 'utf-8'));
        process.kill(pidData.pid, 0);
        port = pidData.port;
        break;
      } catch (_) {}
    }
  }

  const sendPost = (targetPort) => {
    const postData = content;
    const req = http.request(
      {
        hostname: 'localhost',
        port: targetPort,
        path: '/api/diagram',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let respBody = '';
        res.on('data', (d) => { respBody += d; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`\n${colors.green}${colors.bold}✓ Flowchart pushed successfully to WTF Gateway (port ${targetPort})!${colors.reset}`);
            console.log(`  Live Browser UI updated in real-time at ${colors.cyan}http://localhost:${targetPort}${colors.reset}\n`);
          } else {
            console.error(`${colors.red}Gateway returned error (${res.statusCode}):${colors.reset}`, respBody);
          }
        });
      }
    );

    req.on('error', (err) => {
      console.log(`\n${colors.yellow}! Saved to .wtf/schemas/current.json, but gateway connection failed: ${err.message}${colors.reset}`);
      console.log(`Start the gateway with: ${colors.cyan}wtf gateway start${colors.reset}\n`);
    });

    req.write(postData);
    req.end();
  };

  if (port) {
    sendPost(port);
  } else {
    // Probe common ports if PID file was in another directory
    const probePorts = [5174, 5175, 5176, 5177, 3000];
    const checkNext = (idx) => {
      if (idx >= probePorts.length) {
        console.log(`\n${colors.green}${colors.bold}✓ Saved to .wtf/schemas/current.json${colors.reset}`);
        console.log(`${colors.yellow}! Gateway is not currently running.${colors.reset}`);
        console.log(`To open and view in browser, run:`);
        console.log(`  $ ${colors.cyan}wtf gateway start${colors.reset}\n`);
        return;
      }
      const testPort = probePorts[idx];
      const checkReq = http.get({ hostname: 'localhost', port: testPort, path: '/api/health', timeout: 400 }, (res) => {
        if (res.statusCode === 200) {
          sendPost(testPort);
        } else {
          checkNext(idx + 1);
        }
      });
      checkReq.on('error', () => checkNext(idx + 1));
      checkReq.on('timeout', () => { checkReq.destroy(); checkNext(idx + 1); });
    };
    checkNext(0);
  }
}

/**
 * Command: wtf schema
 */
function handleSchema(args = []) {
  const schemaSample = {
    name: 'Project Workflow & Architecture',
    version: '1.0.0',
    tabs: [
      {
        id: 'tab_overview',
        title: '1. E2E System Overview',
        type: 'flowchart',
        nodes: [
          {
            id: 'node_1',
            type: 'start',
            label: 'Client Request',
            description: 'User clicks checkout in web app',
            position: { x: 260, y: 80 },
            colorTheme: 'indigo',
          },
          {
            id: 'node_2',
            type: 'process',
            label: 'Order Service',
            description: 'Validates stock & calculates tax',
            position: { x: 260, y: 240 },
            colorTheme: 'blue',
          },
          {
            id: 'node_3',
            type: 'decision',
            label: 'Payment OK?',
            description: 'Checks payment gateway webhook',
            position: { x: 260, y: 400 },
            colorTheme: 'amber',
          },
          {
            id: 'node_4',
            type: 'end',
            label: 'Invoice Sent',
            description: 'Email confirmation and shipping label',
            position: { x: 260, y: 560 },
            colorTheme: 'emerald',
          },
        ],
        edges: [
          { id: 'e1', sourceNodeId: 'node_1', targetNodeId: 'node_2', label: 'POST /order' },
          { id: 'e2', sourceNodeId: 'node_2', targetNodeId: 'node_3', label: 'Verify' },
          { id: 'e3', sourceNodeId: 'node_3', targetNodeId: 'node_4', label: 'Approved' },
        ],
      },
      {
        id: 'tab_sub_payment',
        title: '2. Payment Sub-Process Breakdown',
        type: 'flowchart',
        nodes: [
          {
            id: 'sub_1',
            type: 'start',
            label: 'Process Transaction',
            description: 'Verify payment gateway token',
            position: { x: 260, y: 80 },
            colorTheme: 'indigo',
          },
          {
            id: 'sub_2',
            type: 'decision',
            label: 'Sufficient Balance?',
            description: 'Check bank settlement status',
            position: { x: 260, y: 240 },
            colorTheme: 'amber',
          },
          {
            id: 'sub_3',
            type: 'end',
            label: 'Payment Completed',
            description: 'Emit order.paid event',
            position: { x: 260, y: 400 },
            colorTheme: 'emerald',
          },
        ],
        edges: [
          { id: 'se1', sourceNodeId: 'sub_1', targetNodeId: 'sub_2', label: 'Check' },
          { id: 'se2', sourceNodeId: 'sub_2', targetNodeId: 'sub_3', label: 'Yes' },
        ],
      },
      {
        id: 'tab_kanban',
        title: '3. Project Tasks Board',
        type: 'kanban',
        nodes: [],
        edges: [],
        kanbanTasks: [
          { id: 'k1', title: 'Refactor payment webhook retry', status: 'inprogress', priority: 'high' },
          { id: 'k2', title: 'Add idempotency key check on order creation', status: 'todo', priority: 'high' },
        ],
      },
    ],
  };

  if (args.includes('--json') || args.includes('-j')) {
    console.log(JSON.stringify(schemaSample, null, 2));
    return;
  }

  printBanner();
  console.log(`${colors.bold}📐 WTF DIAGRAM SCHEMA SPECIFICATION (FOR HERMES / AI AGENTS):${colors.reset}\n`);
  console.log(`Hermes can generate multi-tab flowcharts using this exact JSON structure (run ${colors.cyan}wtf schema --json${colors.reset} for raw output):\n`);
  console.log(colors.cyan + JSON.stringify(schemaSample, null, 2) + colors.reset + '\n');

  console.log(`${colors.bold}NODE TYPES:${colors.reset} start, process, decision, subprocess, database, api, queue, end`);
  console.log(`${colors.bold}COLOR THEMES:${colors.reset} indigo, blue, emerald, amber, rose, purple, cyan, slate\n`);

  console.log(`${colors.bold}🤖 CARA SURUH HERMES (TANPA PERLU COPY FORMAT):${colors.reset}`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`${colors.yellow}"Cek format di 'wtf schema --json', baca folder codebase ini, buat flowchart multi-tab di 'flow.json', lalu jalankan 'wtf push flow.json'."${colors.reset}`);
  console.log(`--------------------------------------------------------------------------------\n`);
}

/**
 * Command: wtf gateway start
 */
function handleGatewayStart(args) {
  printBanner();

  let port = 5174;
  let host = 'localhost';
  let shouldOpen = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-p' || args[i] === '--port') {
      port = parseInt(args[i + 1], 10) || port;
      i++;
    } else if (args[i] === '-H' || args[i] === '--host') {
      host = args[i + 1] || host;
      i++;
    } else if (args[i] === '--no-open') {
      shouldOpen = false;
    }
  }

  if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.resolve(DIST_DIR, 'index.html'))) {
    console.error(`${colors.red}${colors.bold}Error: Production build directory 'dist' was not found!${colors.reset}`);
    console.error(`Please run the build script first at repo root:`);
    console.error(`  $ ${colors.cyan}bun run build${colors.reset} or ${colors.cyan}npm run build${colors.reset}\n`);
    process.exit(1);
  }

  let sseClients = [];

  const broadcastDiagramUpdate = (payload) => {
    const dataStr = `data: ${JSON.stringify({ type: 'DIAGRAM_UPDATE', payload })}\n\n`;
    sseClients = sseClients.filter((client) => {
      try {
        client.write(dataStr);
        return true;
      } catch (_) {
        return false;
      }
    });
  };

  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // CORS Headers for AI Agent & Hermes integrations
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // SSE Events for live browser synchronization
    if (pathname === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      });
      res.write(': connected\n\n');
      sseClients.push(res);
      req.on('close', () => {
        sseClients = sseClients.filter((c) => c !== res);
      });
      return;
    }

    // API Diagram POST (Hermes & CLI push endpoint)
    if (pathname === '/api/diagram' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!fs.existsSync(path.resolve(WTF_DIR, 'schemas'))) {
            fs.mkdirSync(path.resolve(WTF_DIR, 'schemas'), { recursive: true });
          }
          fs.writeFileSync(
            path.resolve(WTF_DIR, 'schemas', 'current.json'),
            JSON.stringify(parsed, null, 2),
            'utf-8'
          );

          try {
            if (!fs.existsSync(path.resolve(GLOBAL_WTF_DIR, 'schemas'))) {
              fs.mkdirSync(path.resolve(GLOBAL_WTF_DIR, 'schemas'), { recursive: true });
            }
            fs.writeFileSync(
              path.resolve(GLOBAL_WTF_DIR, 'schemas', 'current.json'),
              JSON.stringify(parsed, null, 2),
              'utf-8'
            );
          } catch (_) {}

          broadcastDiagramUpdate(parsed);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Diagram updated and broadcast to browser tabs successfully',
            tabsCount: parsed.tabs ? parsed.tabs.length : (parsed.nodes ? 1 : 0),
            clientsNotified: sseClients.length,
          }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload', details: err.message }));
        }
      });
      return;
    }

    // API Diagram GET (Fetch current diagram)
    if (pathname === '/api/diagram' && req.method === 'GET') {
      const localFile = path.resolve(WTF_DIR, 'schemas', 'current.json');
      const globalFile = path.resolve(GLOBAL_WTF_DIR, 'schemas', 'current.json');
      const targetFile = fs.existsSync(localFile) ? localFile : (fs.existsSync(globalFile) ? globalFile : null);
      if (targetFile) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(fs.readFileSync(targetFile, 'utf-8'));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No active diagram found' }));
      }
      return;
    }

    // API Gateway Health Endpoint
    if (pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', version: VERSION, uptime: process.uptime() }));
      return;
    }

    // API Workspace Config Endpoint
    if (pathname === '/api/workspace') {
      const configFile = path.resolve(WTF_DIR, 'config.json');
      let configData = {};
      if (fs.existsSync(configFile)) {
        try {
          configData = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        } catch (_) {}
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ workspaceRoot: CWD, config: configData }));
      return;
    }

    let filePath = path.resolve(DIST_DIR, pathname.startsWith('/') ? pathname.slice(1) : pathname);

    // Security check: prevent directory traversal
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    // If directory, look for index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.resolve(filePath, 'index.html');
    }

    // SPA fallback: If file doesn't exist and not asking for a specific extension, serve dist/index.html
    if (!fs.existsSync(filePath)) {
      if (!path.extname(pathname)) {
        filePath = path.resolve(DIST_DIR, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      });
      res.end(content);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`${colors.yellow}Port ${port} is in use, trying port ${port + 1}...${colors.reset}`);
      port++;
      server.listen(port, host);
    } else {
      console.error(`${colors.red}Server error:${colors.reset}`, err);
      process.exit(1);
    }
  });

  server.listen(port, host, () => {
    const url = `http://${host}:${port}`;

    // Record PID for status and stop commands
    try {
      const pidStr = JSON.stringify({ pid: process.pid, port, host, startedAt: new Date().toISOString() }, null, 2);
      if (!fs.existsSync(WTF_DIR)) fs.mkdirSync(WTF_DIR, { recursive: true });
      fs.writeFileSync(PID_FILE, pidStr, 'utf-8');

      if (!fs.existsSync(GLOBAL_WTF_DIR)) fs.mkdirSync(GLOBAL_WTF_DIR, { recursive: true });
      fs.writeFileSync(GLOBAL_PID_FILE, pidStr, 'utf-8');
    } catch (_) {}

    console.log(`
${colors.green}${colors.bold}  ✓ WTF Gateway Active & Ready!${colors.reset}

  ${colors.bold}Application UI:${colors.reset}   ${colors.cyan}${colors.bold}${url}${colors.reset}
  ${colors.bold}Workspace:${colors.reset}        ${colors.dim}${CWD}${colors.reset}
  ${colors.bold}Local API:${colors.reset}        ${colors.dim}${url}/api/health${colors.reset}

  ${colors.dim}Press ${colors.bold}Ctrl+C${colors.reset}${colors.dim} to stop the server.${colors.reset}
`);

    if (shouldOpen) {
      console.log(`  ${colors.cyan}➜ Opening browser...${colors.reset}\n`);
      openBrowser(url);
    }
  });

  // Graceful shutdown
  const handleExit = () => {
    console.log(`\n${colors.yellow}Stopping WTF Gateway...${colors.reset}`);
    try {
      if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
      if (fs.existsSync(GLOBAL_PID_FILE)) fs.unlinkSync(GLOBAL_PID_FILE);
    } catch (_) {}
    server.close(() => {
      console.log(`${colors.green}Gateway shut down cleanly. Goodbye!${colors.reset}`);
      process.exit(0);
    });
  };

  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
}

// CLI Command Dispatcher
const rawArgs = process.argv.slice(2);

if (rawArgs.length === 0 || rawArgs.includes('-h') || rawArgs.includes('--help') || rawArgs[0] === 'help') {
  printHelp();
  process.exit(0);
}

if (rawArgs.includes('-v') || rawArgs.includes('--version') || rawArgs[0] === 'version') {
  console.log(`@wtf/cli v${VERSION}`);
  process.exit(0);
}

const command = rawArgs[0];
const subCommand = rawArgs[1];

if (command === 'init') {
  handleInit();
} else if (command === 'push') {
  handlePush(rawArgs.slice(1));
} else if (command === 'schema') {
  handleSchema(rawArgs.slice(1));
} else if (command === 'gateway' || command === 'start') {
  const action = command === 'start' ? 'start' : subCommand;
  const remainingArgs = command === 'start' ? rawArgs.slice(1) : rawArgs.slice(2);

  if (action === 'start' || !action) {
    handleGatewayStart(remainingArgs);
  } else if (action === 'status') {
    handleStatus();
  } else if (action === 'stop') {
    handleStop();
  } else {
    console.error(`${colors.red}Unknown command: wtf gateway ${action}${colors.reset}`);
    console.log(`Run ${colors.cyan}wtf --help${colors.reset} for available commands.`);
    process.exit(1);
  }
} else if (command === 'status') {
  handleStatus();
} else if (command === 'stop') {
  handleStop();
} else {
  console.error(`${colors.red}Invalid command: '${command}'.${colors.reset}`);
  console.log(`Run ${colors.cyan}wtf --help${colors.reset} for available commands.`);
  process.exit(1);
}
