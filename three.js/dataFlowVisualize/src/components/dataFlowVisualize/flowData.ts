export interface Node {
    id: string;
    group: string;
    value: number;
    data?: any;
    x?: number;
    y?: number;
    isExpanded?: boolean;
  }
  
  // Define left side nodes (secondary)
  
  export const leftNodes: Node[] = [
    {
      id: "salesforce",
      group: "secondary",
      value: 70,
      data: { type: "Batches", description: "Batch Stocks", columns: 38 },
    },
    {
      id: "zoho",
      group: "secondary",
      value: 70,
      data: { type: "Material Data for Ex...", description: "", columns: 12 },
    },
    {
      id: "hubspot",
      group: "secondary",
      value: 70,
      data: { type: "Material Consumption", description: "", columns: 58 },
    },
    {
      id: "sharepoint",
      group: "secondary",
      value: 70,
      data: { type: "Batches", description: "", columns: 37 },
    },
    {
      id: "pipedrive",
      group: "secondary",
      value: 70,
      data: { type: "Material Valuation", description: "", columns: 109 },
    },
    {
      id: "Google Drive",
      group: "secondary",
      value: 70,
      data: {
        type: "MARD",
        description: "Storage Location Data",
        columns: 50,
      },
    },
    {
      id: "onedrive",
      group: "secondary",
      value: 70,
      data: { type: "Plant Data", description: "", columns: 238 },
    },
    {
      id: "Energy Report.xlsx",
      group: "secondary",
      value: 70,
      data: { type: "Units of Measure", description: "", columns: 29 },
    },
    {
      id: "Oil&Gas Report.pdf",
      group: "secondary",
      value: 70,
      data: { type: "Sales Data", description: "", columns: 68 },
    },
    {
      id: "analysis.jpg",
      group: "secondary",
      value: 70,
      data: { type: "Tax Classification", description: "", columns: 13 },
    },
  ];
  
  // Define right side nodes (tertiary)
  export const rightNodes: Node[] = [
      
    {
        id: "FaultsDetected",
        group: "quaternary",
        value: 50,
        data: { type: "Material Description", description: "", columns: 5 },
      },
    {
      id: "oilProduction",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "gasProduction",
      group: "tertiary",
      value: 50,
      data: { type: "Customer Material", description: "", columns: 26 },
    },
    {
      id: "waterProduction",
      group: "tertiary",
      value: 50,
      data: { type: "Material Data Extended", description: "", columns: 26 },
    },
    {
        id: "OilAnalysis",
        group: "primary",
        value: 50,
        data: { type: "Material Description", description: "", columns: 5 },
      },
      {
        id: "GasAnalysis",
        group: "primary",
        value: 50,
        data: { type: "Material Description", description: "", columns: 5 },
      },

];
  
/*
    
    {
      id: "WaterAnalysis",
      group: "primary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "IsotopeRatio",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "SourceRock",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "ForecastModel",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "ForecastStartDate",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },

{
      id: "ForecastEndDate",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "ForecastOil",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "ForecastGas",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "ForecastWater",
      group: "secondary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "ProductionForecast",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "WellStatus",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "FormationType",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "CasingMaterial",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "TubingSize",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "PackerType",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "SurfaceLocation",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "BottomHoleLocation",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "DirectionalSurvey",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "FracJob",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "AcidJob",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "WaterSource",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "WaterDisposalMethod",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "GasSalesContract",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "OilSalesContract",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "PipelineCapacity",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "PipelinePressure",
      group: "tertiary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "FacilityName",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "FacilityType",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "FacilityCapacity",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "FacilityLocation",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "EnvironmentalPermit",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "SafetyTraining",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "EmergencyResponsePlan",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "AuditFrequency",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "AuditFindings",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "CorrectiveActions",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "IncidentReport",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "NearMissReports",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
    {
      id: "EmployeeCount",
      group: "quaternary",
      value: 50,
      data: { type: "Material Description", description: "", columns: 5 },
    },
  ];
  */
