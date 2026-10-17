import {
  _generateUniqueId,
  _findNodeById,
  _calculateNodeCenter,
  _validateSchemaJson,
  _calculateEdgePath,
} from './ErpFlowGen.utils';
import type { FlowNode, SchemaExportData } from './ErpFlowGen.type';
import { SAMPLE_ERP_NODES } from './ErpFlowGen.config';

/**
 * Unit tests for ErpFlowGen utility calculations and business logic
 */
describe('ErpFlowGen Utilities Test Suite', () => {
  it('should generate a unique id with given prefix', () => {
    const id1 = _generateUniqueId('node');
    const id2 = _generateUniqueId('node');

    expect(id1).toContain('node_');
    expect(id2).toContain('node_');
    expect(id1).not.toBe(id2);
  });

  it('should find node by matching id', () => {
    const sampleNodes: FlowNode[] = SAMPLE_ERP_NODES;
    const targetNode = _findNodeById(sampleNodes, 'node_sample_1');

    expect(targetNode).not.toBeNull();
    expect(targetNode?.label).toBe('Customer PO Received');
  });

  it('should return null when searching non-existent node id', () => {
    const sampleNodes: FlowNode[] = SAMPLE_ERP_NODES;
    const targetNode = _findNodeById(sampleNodes, 'non_existent_id');

    expect(targetNode).toBeNull();
  });

  it('should accurately calculate node center position', () => {
    const dummyNode: FlowNode = {
      id: 'test_node_1',
      type: 'process',
      label: 'Sample Task',
      description: 'Sample description',
      moduleCategory: 'General / Cross-Module',
      position: { x: 100, y: 100 },
      colorTheme: 'indigo',
    };

    const center = _calculateNodeCenter(dummyNode);

    // Process node has default width: 220, height: 96
    expect(center.x).toBe(100 + 110);
    expect(center.y).toBe(100 + 48);
  });

  it('should calculate edge cubic bezier path between two nodes', () => {
    const nodeA: FlowNode = {
      id: 'node_a',
      type: 'process',
      label: 'Node A',
      description: '',
      moduleCategory: 'General',
      position: { x: 100, y: 100 },
      colorTheme: 'indigo',
    };

    const nodeB: FlowNode = {
      id: 'node_b',
      type: 'process',
      label: 'Node B',
      description: '',
      moduleCategory: 'General',
      position: { x: 400, y: 100 },
      colorTheme: 'emerald',
    };

    const geometry = _calculateEdgePath(nodeA, nodeB);

    expect(geometry.pathD).toContain('M ');
    expect(geometry.pathD).toContain('C ');
    expect(geometry.midX).toBeGreaterThan(100);
  });

  it('should calculate clean vertical path for downward flow without horizontal loops', () => {
    const nodeTop: FlowNode = {
      id: 'node_top',
      type: 'start',
      label: 'Start Node',
      description: '',
      moduleCategory: 'General',
      position: { x: 200, y: 50 },
      colorTheme: 'emerald',
    };

    const nodeBottom: FlowNode = {
      id: 'node_bottom',
      type: 'process',
      label: 'Bottom Step',
      description: '',
      moduleCategory: 'General',
      position: { x: 200, y: 250 },
      colorTheme: 'indigo',
    };

    const geometry = _calculateEdgePath(nodeTop, nodeBottom);

    expect(geometry.pathD).toContain('M ');
    expect(geometry.pathD).toContain('C ');
    // startY should be at bottom of top node (50 + 56 = 106)
    expect(geometry.midY).toBeGreaterThan(100);
  });

  it('should calculate collinear vertical entry for diagonal flow to prevent arrowhead misalignment', () => {
    const sourceNode: FlowNode = {
      id: 'source_upper_right',
      type: 'decision',
      label: 'Validasi',
      description: '',
      moduleCategory: 'General',
      position: { x: 500, y: 50 },
      colorTheme: 'amber',
    };

    const targetNode: FlowNode = {
      id: 'target_lower_left',
      type: 'subprocess',
      label: 'Sub Proses',
      description: '',
      moduleCategory: 'General',
      position: { x: 150, y: 240 },
      colorTheme: 'indigo',
    };

    const geometry = _calculateEdgePath(sourceNode, targetNode);

    // Extract end coordinates and second control point from pathD
    // Path format: M startX startY C cp1X cp1Y, cp2X cp2Y, endX endY
    const match = geometry.pathD.match(/C\s+([\d.-]+)\s+([\d.-]+),\s+([\d.-]+)\s+([\d.-]+),\s+([\d.-]+)\s+([\d.-]+)/);
    expect(match).not.toBeNull();
    if (match) {
      const cp2X = parseFloat(match[3]);
      const cp2Y = parseFloat(match[4]);
      const endX = parseFloat(match[5]);
      const endY = parseFloat(match[6]);

      // cp2X must equal endX so entry into top anchor is strictly vertical (tangent dx = 0)
      expect(Math.abs(cp2X - endX)).toBeLessThanOrEqual(0.1);
      // cp2Y must be strictly above endY so tangent is pointing downwards into the anchor
      expect(cp2Y).toBeLessThan(endY);
    }
  });

  it('should validate valid schema JSON structure', () => {
    const validPayload: SchemaExportData = {
      version: '1.0.0',
      appName: 'ERP Flow & Schema Generator',
      exportDate: '2026-10-17T00:00:00Z',
      nodes: SAMPLE_ERP_NODES,
      edges: [],
    };

    const parsed = _validateSchemaJson(JSON.stringify(validPayload));

    expect(parsed).not.toBeNull();
    expect(parsed?.nodes.length).toBe(SAMPLE_ERP_NODES.length);
  });

  it('should return null for corrupted schema JSON input', () => {
    const corruptedString = '{ "invalid": true }';
    const parsed = _validateSchemaJson(corruptedString);

    expect(parsed).toBeNull();
  });

  it('should generate structured multi-tab flowcharts from scanned codebase', async () => {
    const { generateFlowFromCodebase, DEFAULT_AI_CONFIG } = await import('./ErpFlowGen.ai');

    const mockFiles = [
      {
        path: 'src/api/auth.controller.ts',
        name: 'auth.controller.ts',
        extension: 'ts',
        size: 2048,
        contentSnippet: 'export function login(req, res) { ... }',
      },
      {
        path: 'src/models/user.model.ts',
        name: 'user.model.ts',
        extension: 'ts',
        size: 1024,
        contentSnippet: 'export interface User { id: string; email: string; }',
      },
    ];

    const tabs = await generateFlowFromCodebase('TestProject', mockFiles, DEFAULT_AI_CONFIG);

    expect(tabs.length).toBeGreaterThanOrEqual(3);
    // Tab 1 must be High-level E2E Overview
    expect(tabs[0].title).toContain('E2E');
    expect(tabs[0].nodes.length).toBeGreaterThan(0);
    expect(tabs[0].edges.length).toBeGreaterThan(0);

    // Detail Feature tabs
    expect(tabs.some((t) => t.title.toLowerCase().includes('feature') || t.title.toLowerCase().includes('fitur'))).toBe(true);
  });

  it('should provide default realistic screen mockup presets with valid svg data URIs', async () => {
    const { SCREEN_MOCKUP_PRESETS } = await import('./ErpFlowGen.mockups');
    expect(SCREEN_MOCKUP_PRESETS.length).toBeGreaterThanOrEqual(4);

    const loginFailedPreset = SCREEN_MOCKUP_PRESETS.find((p) => p.id === 'preset_login_failed');
    expect(loginFailedPreset).toBeDefined();
    expect(loginFailedPreset?.dataUrl.startsWith('data:image/svg+xml')).toBe(true);
    expect(loginFailedPreset?.name).toContain('Login Gagal');
  });

  it('should have previewImageUrl configured for sample flowchart nodes', () => {
    const nodeSample2 = SAMPLE_ERP_NODES.find((n) => n.id === 'node_sample_2');
    expect(nodeSample2).toBeDefined();
    expect(nodeSample2?.previewImageUrl).toBeDefined();
    expect(nodeSample2?.previewImageUrl).toContain('data:image/svg+xml');

    const nodeSample5 = SAMPLE_ERP_NODES.find((n) => n.id === 'node_sample_5');
    expect(nodeSample5).toBeDefined();
    expect(nodeSample5?.previewImageUrl).toBeDefined();
  });

  it('should create an initial Jira / Kanban board tab with linked workflow tasks', async () => {
    const { createInitialProject, FLOWCHART_TYPES_METADATA } = await import('./ErpFlowGen.config');

    // Check metadata includes kanban
    const kanbanMeta = FLOWCHART_TYPES_METADATA.find((m) => m.type === 'kanban');
    expect(kanbanMeta).toBeDefined();
    expect(kanbanMeta?.title).toContain('Jira');

    // Create tab
    const kanbanTab = createInitialProject('kanban', 'Sprint Backlog Board');
    expect(kanbanTab.type).toBe('kanban');
    expect(kanbanTab.title).toBe('Sprint Backlog Board');
    expect(kanbanTab.kanbanTasks).toBeDefined();
    expect(kanbanTab.kanbanTasks?.length).toBeGreaterThanOrEqual(4);

    // Verify task workflow linkage (dari node mana ke mana)
    const linkedTask = kanbanTab.kanbanTasks?.find(
      (t) => t.linkedSourceNodeId && t.linkedTargetNodeId,
    );
    expect(linkedTask).toBeDefined();
    expect(linkedTask?.key).toContain('ERP-');
    expect(linkedTask?.linkedWorkflowTabTitle).toBeDefined();
    expect(linkedTask?.linkedSourceNodeLabel).toBeDefined();
    expect(linkedTask?.linkedTargetNodeLabel).toBeDefined();
  });

  it('should support cloning a tab and cleanly remapping node and edge IDs without collisions', async () => {
    const { createInitialProject, SAMPLE_ERP_NODES, SAMPLE_ERP_EDGES } = await import('./ErpFlowGen.config');
    const sourceTab = {
      ...createInitialProject('userflow', 'Checkout Flow'),
      nodes: SAMPLE_ERP_NODES,
      edges: SAMPLE_ERP_EDGES,
    };

    expect(sourceTab.nodes.length).toBeGreaterThan(0);
    expect(sourceTab.edges.length).toBeGreaterThan(0);

    const nodeIdMap: Record<string, string> = {};
    const clonedNodes = sourceTab.nodes.map((node) => {
      const freshId = _generateUniqueId('node');
      nodeIdMap[node.id] = freshId;
      return {
        ...node,
        id: freshId,
        position: { ...node.position },
      };
    });

    const clonedEdges = sourceTab.edges.map((edge) => ({
      ...edge,
      id: _generateUniqueId('edge'),
      sourceNodeId: nodeIdMap[edge.sourceNodeId] ?? edge.sourceNodeId,
      targetNodeId: nodeIdMap[edge.targetNodeId] ?? edge.targetNodeId,
    }));

    // Verify IDs are distinct
    expect(clonedNodes[0].id).not.toBe(sourceTab.nodes[0].id);
    expect(clonedEdges[0].id).not.toBe(sourceTab.edges[0].id);

    // Verify edge continuity is preserved with new node IDs
    const originalFirstEdge = sourceTab.edges[0];
    const clonedFirstEdge = clonedEdges[0];
    expect(clonedFirstEdge.sourceNodeId).toBe(nodeIdMap[originalFirstEdge.sourceNodeId]);
    expect(clonedFirstEdge.targetNodeId).toBe(nodeIdMap[originalFirstEdge.targetNodeId]);
  });

  it('should detect nodes situated within or overlapping a group frame and move them simultaneously', async () => {
    const { _getNodeDimensions } = await import('./ErpFlowGen.utils');
    const { SAMPLE_ERP_NODES } = await import('./ErpFlowGen.config');

    // Create a group frame encompassing the first 2 nodes
    const node1 = SAMPLE_ERP_NODES[0];
    const node2 = SAMPLE_ERP_NODES[1];
    const groupFrame = {
      id: 'group_test_1',
      title: 'Order Processing Group',
      position: { x: Math.min(node1.position.x, node2.position.x) - 40, y: Math.min(node1.position.y, node2.position.y) - 40 },
      width: 600,
      height: 400,
      colorTheme: 'indigo' as const,
    };

    // Detection logic
    const nodesInside = SAMPLE_ERP_NODES.filter((n) => {
      const nd = _getNodeDimensions(n);
      const cx = n.position.x + nd.width / 2;
      const cy = n.position.y + nd.height / 2;
      const centerInside =
        cx >= groupFrame.position.x &&
        cx <= groupFrame.position.x + groupFrame.width &&
        cy >= groupFrame.position.y &&
        cy <= groupFrame.position.y + groupFrame.height;
      const overlaps =
        n.position.x < groupFrame.position.x + groupFrame.width &&
        n.position.x + nd.width > groupFrame.position.x &&
        n.position.y < groupFrame.position.y + groupFrame.height &&
        n.position.y + nd.height > groupFrame.position.y;
      return centerInside || overlaps;
    });

    expect(nodesInside.length).toBeGreaterThanOrEqual(1);

    // Simulate group movement delta
    const deltaX = 120;
    const deltaY = 80;
    const movedNodes = nodesInside.map((n) => ({
      ...n,
      position: {
        x: n.position.x + deltaX,
        y: n.position.y + deltaY,
      },
    }));

    expect(movedNodes[0].position.x).toBe(nodesInside[0].position.x + deltaX);
    expect(movedNodes[0].position.y).toBe(nodesInside[0].position.y + deltaY);
  });

  it('should adjust edge path and midpoint when waypointOffset is provided for line dragging', () => {
    const nodeA: FlowNode = {
      id: 'node_a',
      type: 'start',
      label: 'Node A',
      description: '',
      moduleCategory: 'General',
      position: { x: 100, y: 100 },
      colorTheme: 'indigo',
    };
    const nodeB: FlowNode = {
      id: 'node_b',
      type: 'process',
      label: 'Node B',
      description: '',
      moduleCategory: 'General',
      position: { x: 100, y: 300 },
      colorTheme: 'emerald',
    };

    const initialGeometry = _calculateEdgePath(nodeA, nodeB, 'orthogonal');
    const draggedGeometry = _calculateEdgePath(nodeA, nodeB, 'orthogonal', { x: 60, y: 40 });

    expect(draggedGeometry.midY).toBe(initialGeometry.midY + 40);
    expect(draggedGeometry.midX).toBe(initialGeometry.midX + 60);
    expect(draggedGeometry.pathD).not.toBe(initialGeometry.pathD);
  });

  it('should route edge to custom left or right anchor port when targetAnchor is specified', () => {
    const nodeA: FlowNode = {
      id: 'node_a',
      type: 'start',
      label: 'Node A',
      description: '',
      moduleCategory: 'General',
      position: { x: 200, y: 100 },
      colorTheme: 'indigo',
    };
    const nodeB: FlowNode = {
      id: 'node_b',
      type: 'process',
      label: 'Node B',
      description: '',
      moduleCategory: 'General',
      position: { x: 200, y: 300 },
      colorTheme: 'emerald',
    };

    // Default target anchor is top for downward layout
    const defaultGeom = _calculateEdgePath(nodeA, nodeB, 'orthogonal');
    expect(defaultGeom.endY).toBe(300); // top of nodeB

    // Custom targetAnchor 'left'
    const leftAnchorGeom = _calculateEdgePath(nodeA, nodeB, 'orthogonal', undefined, 'auto', 'left');
    expect(leftAnchorGeom.endX).toBe(200); // left edge of nodeB
    expect(leftAnchorGeom.endY).toBeGreaterThan(300); // middle Y of nodeB
    expect(leftAnchorGeom.pathD).toContain('L 200 ');

    // Custom targetAnchor 'right'
    const rightAnchorGeom = _calculateEdgePath(nodeA, nodeB, 'orthogonal', undefined, 'auto', 'right');
    expect(rightAnchorGeom.endX).toBeGreaterThan(200); // right edge of nodeB
    expect(rightAnchorGeom.endY).toBeGreaterThan(300);
  });

  it('should route edge from custom sourceAnchor (e.g. right side) instead of bottom port', () => {
    const nodeA: FlowNode = {
      id: 'node_a',
      type: 'start',
      label: 'Start Node',
      description: '',
      moduleCategory: 'General',
      position: { x: 200, y: 100 },
      colorTheme: 'indigo',
    };
    const nodeB: FlowNode = {
      id: 'node_b',
      type: 'process',
      label: 'Process Node',
      description: '',
      moduleCategory: 'General',
      position: { x: 200, y: 300 },
      colorTheme: 'emerald',
    };

    // Default source anchor is bottom for downward layout
    const defaultGeom = _calculateEdgePath(nodeA, nodeB, 'curved');
    expect(defaultGeom.sourceSide).toBe('bottom');

    // Custom sourceAnchor 'right'
    const rightSourceGeom = _calculateEdgePath(nodeA, nodeB, 'curved', undefined, 'right', 'top');
    expect(rightSourceGeom.sourceSide).toBe('right');
    expect(rightSourceGeom.startX).toBeGreaterThan(200); // starts from the right edge
  });
});




