# AI Agent Guidelines (Hermes / Claude / Cursor / Antigravity)

## Want Take Flow (WTF) Architecture & Diagram Generation
When requested to create, inspect, or update architecture diagrams and workflow flowcharts:

1. **Schema Format**:
   To inspect the exact JSON schema, run:
   ```bash
   wtf schema --json
   ```

2. **Analysis & Structure**:
   Analyze the codebase and structure the flowchart into logical tabs:
   - **Tab 1: High-Level Overview**: End-to-end system flow (Client -> API Gateway -> Service -> Database).
   - **Tab 2+: Sub-Process Breakdown**: Detailed flow for complex modules (Auth, Payments, Workers).
   - **Tab Last: Kanban Board**: Task board for refactors, backlog, or issues found during code scan.

3. **Live Sync to Browser**:
   Save the output to `flow.json` and push to the live gateway:
   ```bash
   wtf push flow.json
   ```
