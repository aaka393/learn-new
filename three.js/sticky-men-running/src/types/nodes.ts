export interface GraphNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  z?: number;
  fileName?: string;
}

export interface GraphConnection {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  connections: GraphConnection[];
}
