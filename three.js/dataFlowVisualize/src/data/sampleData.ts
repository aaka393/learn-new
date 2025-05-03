import { GraphData } from '../types/nodes';

const COLUMN_LEFT = 200;    // Left nodes x position
const COLUMN_CENTER = 500;  // AI Gizmo x position
const COLUMN_RIGHT = 800;   // Right nodes x position
const START_Y = 100;        // Starting y position
const Y_SPACING = 100;      // Vertical spacing between nodes

export const sampleData: GraphData = {
  nodes: [
    // Left nodes (data sources) - Energy related first
    {
      id: 'scada', label: 'SCADA System', type: 'service', x: COLUMN_LEFT, y: START_Y,
      z: undefined
    },
    {
      id: 'smartMeters', label: 'Smart Meters', type: 'service', x: COLUMN_LEFT, y: START_Y + Y_SPACING,
      z: undefined
    },
    {
      id: 'weatherApi', label: 'Weather API', type: 'service', x: COLUMN_LEFT, y: START_Y + Y_SPACING * 2,
      z: undefined
    },
    {
      id: 'gridExcel', label: 'Grid Inspection Excel', type: 'excel', x: COLUMN_LEFT, y: START_Y + Y_SPACING * 3,
      z: undefined
    },
    {
      id: 'gridPdf', label: 'Grid Performance Reports PDF', type: 'pdf', x: COLUMN_LEFT, y: START_Y + Y_SPACING * 4, fileName: 'Nat-electric-report.pdf',
      z: undefined
    },
    {
      id: 'gdrive', label: 'Google Drive', type: 'service', x: COLUMN_LEFT, y: START_Y + Y_SPACING * 5,
      z: undefined
    },
    
    // Center node (AI Gizmo)
    {
      id: 'aigizmo', label: 'Gizmo Vector Agents', type: 'aigizmo', x: COLUMN_CENTER, y: 400,
      z: undefined
    },
    
    // Right nodes (outputs) - Energy related first
    {
      id: 'gridHealth', label: 'Grid Health Monitor', type: 'service', x: COLUMN_RIGHT, y: START_Y,
      z: undefined
    },
    {
      id: 'maintenance', label: 'Predictive Maintenance', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING,
      z: undefined
    },
    {
      id: 'loadBalance', label: 'Load Balancing', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 2,
      z: undefined
    },
    // Other outputs
    {
      id: 'oilProduction', label: 'Oil Production', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 3,
      z: undefined
    },
    {
      id: 'gasProduction', label: 'Gas Production', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 4,
      z: undefined
    },
    {
      id: 'waterProduction', label: 'Water Production', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 5,
      z: undefined
    },
    {
      id: 'productionForecast', label: 'Production Forecast', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 6,
      z: undefined
    },
    {
      id: 'wellStatus', label: 'Well Status', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 7,
      z: undefined
    },
    {
      id: 'gasProduction', label: 'Gas Production', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 4,
      z: undefined
    },
    {
      id: 'waterProduction', label: 'Water Production', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 5,
      z: undefined
    },
    {
      id: 'productionForecast', label: 'Production Forecast', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 6,
      z: undefined
    },
    {
      id: 'wellStatus', label: 'Well Status', type: 'service', x: COLUMN_RIGHT, y: START_Y + Y_SPACING * 7,
      z: undefined
    }
  ],
  connections: [
    // Connections from energy data sources to AI Gizmo
    { source: 'scada', target: 'aigizmo', label: 'Real-time grid data' },
    { source: 'smartMeters', target: 'aigizmo', label: 'Consumption metrics' },
    { source: 'weatherApi', target: 'aigizmo', label: 'Weather forecasts' },
    { source: 'gridExcel', target: 'aigizmo', label: '156 inspection sheets' },
    { source: 'gridPdf', target: 'aigizmo', label: '43 inspection reports' },
    // Other source connections
    // { source: 'salesforce', target: 'aigizmo', label: '26 dynamic lists' },
    // { source: 'zoho', target: 'aigizmo', label: 'Material Data' },
    // { source: 'hubspot', target: 'aigizmo', label: 'Consumption Data' },
    // { source: 'sharepoint', target: 'aigizmo', label: '56 lists with 288 datapoints' },
    { source: 'gdrive', target: 'aigizmo', label: '1098 files' },
    
    // Connections from AI Gizmo to outputs - Energy related first
    { source: 'aigizmo', target: 'gridHealth', label: 'Grid status metrics' },
    { source: 'aigizmo', target: 'maintenance', label: 'Equipment health data' },
    { source: 'aigizmo', target: 'loadBalance', label: 'Distribution metrics' },
    // Other output connections
    { source: 'aigizmo', target: 'oilProduction', label: '28 data points' },
    { source: 'aigizmo', target: 'gasProduction', label: '12 data points' },
    { source: 'aigizmo', target: 'waterProduction', label: '15 data points' },
    { source: 'aigizmo', target: 'productionForecast', label: '96 data points' },
    { source: 'aigizmo', target: 'wellStatus', label: 'Monitoring 129 data points' }
  ]
};
