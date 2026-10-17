# ⚡ want-take-flow (WTF CLI)

> **Enterprise Architecture, Business Process & ERP Flowchart Gateway**  
> Modern visual flowchart workspace with AI Codebase Scanner, Swimlane Process Matrix, Kanban Task Board, and high-performance interactive diagramming.

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://npmjs.com/package/want-take-flow)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-v19.2-61dafb.svg)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Support: Saweria](https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-orange.svg?logo=buy-me-a-coffee)](https://saweria.co/wanttakeflow)

---

## 📦 Global Installation

Install the CLI globally using your favorite package manager:

```bash
# Using npm
npm install -g want-take-flow@latest

# Using bun
bun add -g want-take-flow

# Or run directly without installation via npx
npx want-take-flow gateway start
```

---

## 🚀 Quick Start

Once installed, you can use the CLI inside any project workspace directory:

### 1. Initialize Workspace
```bash
wtf init
```
This initializes a `.wtf/` directory containing the `config.json` configuration and starter workflow templates (`.wtf/schemas/starter_flow.json`).

### 2. Start Gateway & Launch App
```bash
wtf gateway start
```
This automatically boots a local HTTP gateway server on port `5174` and opens the WTF / Lamankilat Drawer visual interface in your default browser (`http://localhost:5174`).

---

## 🛠️ CLI Commands & Usage

| Command | Description |
|---|---|
| `wtf init` | Initialize `.wtf` workspace configuration and starter schema |
| `wtf gateway start` | Start local server and open visual web app in browser |
| `wtf gateway status` | Check status of running gateway (PID, port, uptime) |
| `wtf gateway stop` | Stop active local gateway process |
| `wtf --help` / `wtf -h` | Display help and usage instructions |
| `wtf --version` / `wtf -v` | Display installed CLI version |

### Options for `wtf gateway start`:
- `-p, --port <number>`: Specify custom port (e.g. `wtf gateway start --port 3000`)
- `-H, --host <host>`: Bind host address (default: `localhost`)
- `--no-open`: Start server without automatically opening the browser

---

## ✨ Core Features

### 1. Multi-Type Diagramming Engine
- **User Flow**: Design screen-to-screen user journeys, onboarding sequences, and checkout funnels.
- **Swimlane Diagram**: Map cross-departmental business processes with elastic lane resizing and multiline department headers.
- **System Architecture**: High-level dataflow and cloud infrastructure mapping.
- **Task Board (Kanban / Jira View)**: Manage agile tasks (*Todo, In Progress, Review, Done*) linked directly to workflow diagram nodes.

### 2. Direct Line & Arrowhead Dragging
- **Direct Line Drag**: Simply click and drag anywhere along a connection line to move the arrowhead or origin to another port or node.
- **Magnetic Snap Ports**: Connection ports light up automatically with magnetic snapping when an arrow approaches top, bottom, left, or right anchors.
- **Zero Conflict**: Line interactions have highest priority (`z-35`), preventing accidental triggers of port buttons.
- **Custom Waypoint Handle**: Diamond grip in the middle of lines for manual curve and bend adjustments.

### 3. Drag & Drop Task Board (Kanban)
- Drag and drop task cards between status columns with glow feedback and drop-target placeholders.
- One-click workflow status transitions (*Start ➔, Review ➔, Done ✓*).
- Bidirectional navigation between Kanban task cards and flowchart nodes.

### 4. AI Codebase Scanner & Generator
- Automatically scans project directory structures, routes, and controllers.
- Integrates with **Google Gemini AI** to synthesize enterprise architecture diagrams from raw source code in seconds.

### 5. Mockup Screen Popover
- Built-in realistic UI mockups (*Login Screen, Admin Dashboard, Order Checkout, 404 Error*).
- Switch to preview mode to inspect live interface mockups attached to each step.

### 6. Full History & Export Capabilities
- **Complete Undo / Redo**: Multi-level history snapshot tracking (`Ctrl+Z` / `Ctrl+Y`).
- **JSON Schema Export / Import**: Share and version-control workflow blueprints across engineering teams.
- **High-Resolution Visual Export**: Download diagrams as crisp vector SVGs or high-DPI PNGs.

---

## ⚙️ Workspace Configuration (`.wtf/config.json`)

The configuration file is automatically created when running `wtf init`:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "WTF Architecture & Business Process Workspace",
  "gateway": {
    "defaultPort": 5174,
    "host": "localhost",
    "autoOpen": true
  },
  "ai": {
    "provider": "gemini",
    "model": "gemini-2.5-pro"
  },
  "diagramDefaults": {
    "connectorStyle": "orthogonal",
    "theme": "slate",
    "snapToGrid": true
  }
}
```

---

## 💻 Local Development

To contribute or develop the project locally:

```bash
# Clone repository
git clone https://github.com/your-org/lamankilat-drawer.git
cd lamankilat-drawer

# Install dependencies
bun install # or npm install

# Start Vite dev server
bun run dev

# Run unit test suite
bun test

# Compile TypeScript and build production bundle
bun run build

# Link CLI globally for local testing
npm link
```

---

## ☕ Support & Sponsorship

If you find **Want Take Flow (@wtf/cli)** helpful for your architecture diagrams, engineering workflows, or team documentation, consider supporting continuous open-source development!

[![Buy Me A Coffee / Saweria](https://img.shields.io/badge/Saweria-Support%20Creator%20%E2%98%95-ff813f?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://saweria.co/wanttakeflow)

👉 **Donate / Buy Me a Coffee:** [https://saweria.co/wanttakeflow](https://saweria.co/wanttakeflow)

Every coffee helps maintain features, build new AI scanners, and improve process automation tools. Thank you for your support! ❤️

---

## 📄 License

Distributed under the [MIT License](LICENSE). Built for software architects, product managers, and engineering teams.
