export interface GraphData {
  nodes: Node[];
  connections: Connection[];
}

export interface Node {
  z: any;
  id: string;
  label: string;
  type: 'salesforce' | 'service' | 'database' | 'api' | 'hubspot' | 'zendesk' | 'dynamics' | 'aigizmo' | 'excel' | 'pdf' | 'doc';
  x: number;
  y: number;
  fileName?: string;
}

export interface Connection {
  source: string;
  target: string;
  label?: string;
}
