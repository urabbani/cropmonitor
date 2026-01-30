import type { 
  KPIData, 
  CropType, 
  SatelliteSource, 
  Alert, 
  FieldData, 
  DistrictData, 
  WeatherData,
  VegetationIndex,
  AnalyticsData
} from '@/types';

// KPI Cards Data
export const kpiData: KPIData[] = [
  {
    id: 'cultivated-area',
    title: 'Total Cultivated Area',
    value: '2.84M',
    unit: 'hectares',
    trend: 3.2,
    trendLabel: 'from last season',
    icon: 'Map',
    sparklineData: [2.65, 2.68, 2.72, 2.75, 2.78, 2.81, 2.84],
    status: 'positive'
  },
  {
    id: 'crop-health',
    title: 'Active Crop Health Index',
    value: '78.4',
    unit: '/100',
    trend: -2.1,
    trendLabel: 'moderate concern',
    icon: 'Heart',
    sparklineData: [82, 81, 80, 79, 78, 78, 78.4],
    status: 'warning'
  },
  {
    id: 'water-stress',
    title: 'Water Stress Alerts',
    value: '127',
    unit: 'fields',
    trend: 15,
    trendLabel: 'new this week',
    icon: 'Droplets',
    sparklineData: [95, 102, 108, 115, 120, 124, 127],
    status: 'negative'
  },
  {
    id: 'ndvi-coverage',
    title: 'NDVI Coverage (Latest)',
    value: '94.2',
    unit: '%',
    trend: 0,
    trendLabel: 'updated 6h ago',
    icon: 'Satellite',
    sparklineData: [89, 90, 91, 92, 93, 93.5, 94.2],
    status: 'positive'
  }
];

// Crop Types Data
export const cropTypes: CropType[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    color: '#eab308',
    area: 985000,
    healthScore: 82,
    trend: 2.5
  },
  {
    id: 'rice',
    name: 'Rice',
    color: '#22d3ee',
    area: 720000,
    healthScore: 71,
    trend: -1.8
  },
  {
    id: 'cotton',
    name: 'Cotton',
    color: '#e2e8f0',
    area: 580000,
    healthScore: 65,
    trend: -3.2
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    color: '#16a34a',
    area: 555000,
    healthScore: 89,
    trend: 4.1
  }
];

// Satellite Data Sources
export const satelliteSources: SatelliteSource[] = [
  {
    id: 'modis',
    name: 'MODIS (Terra/Aqua)',
    resolution: '250m - 1km',
    revisitTime: 'Daily',
    status: 'active',
    lastUpdate: '4 hours ago',
    description: 'Moderate Resolution Imaging Spectroradiometer aboard NASA satellites',
    useCases: ['Broad screening', 'Land Surface Temperature', 'Phenology tracking', 'Drought detection'],
    icon: 'Globe'
  },
  {
    id: 'sentinel-1',
    name: 'Sentinel-1 (SAR)',
    resolution: '~10m',
    revisitTime: '6-12 days',
    status: 'active',
    lastUpdate: '2 days ago',
    description: 'C-band Synthetic Aperture Radar for all-weather monitoring',
    useCases: ['All-weather monitoring', 'Soil moisture', 'Flood detection', 'Crop structure'],
    icon: 'Radar'
  },
  {
    id: 'sentinel-2',
    name: 'Sentinel-2 (Optical)',
    resolution: '10m',
    revisitTime: '5 days',
    status: 'active',
    lastUpdate: '1 day ago',
    description: 'High-resolution multispectral optical imagery',
    useCases: ['NDVI calculation', 'Crop classification', 'Stress detection', 'Chlorophyll assessment'],
    icon: 'Scan'
  },
  {
    id: 'landsat',
    name: 'Landsat 8/9',
    resolution: '30m',
    revisitTime: '8 days',
    status: 'active',
    lastUpdate: '3 days ago',
    description: 'Long-running Earth observation program with thermal bands',
    useCases: ['Historical analysis', 'Thermal imaging', 'Trend analysis', 'Water stress'],
    icon: 'Telescope'
  },
  {
    id: 'planet',
    name: 'Planet.com',
    resolution: '~3m',
    revisitTime: 'Daily',
    status: 'active',
    lastUpdate: '12 hours ago',
    description: 'High-resolution daily imagery from Dove constellation',
    useCases: ['Field-level detail', 'Rapid change detection', 'Validation', 'Precision agriculture'],
    icon: 'Orbit'
  }
];

// Alerts Data
export const alerts: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'High Water Stress Detected',
    description: 'NDVI drop >20% observed in wheat fields. Immediate irrigation recommended.',
    location: 'District: Hyderabad, Tehsil: Latifabad',
    timestamp: '2025-01-26T14:30:00Z',
    read: false,
    coordinates: [25.3960, 68.3578]
  },
  {
    id: '2',
    severity: 'critical',
    title: 'Severe NDVI Decline',
    description: 'Rice paddies showing significant vegetation stress. Possible pest infestation.',
    location: 'District: Larkana, Tehsil: Dokri',
    timestamp: '2025-01-26T10:15:00Z',
    read: false,
    coordinates: [27.5612, 68.2159]
  },
  {
    id: '3',
    severity: 'warning',
    title: 'Moderate Drought Conditions',
    description: 'Soil moisture levels below threshold in northern Sindh regions.',
    location: 'District: Sukkur, Khairpur',
    timestamp: '2025-01-25T16:45:00Z',
    read: true,
    coordinates: [27.7052, 68.8574]
  },
  {
    id: '4',
    severity: 'warning',
    title: 'Soil Salinity Increase',
    description: '8 fields showing elevated salinity indices. Recommend soil testing.',
    location: 'District: Badin, Tehsil: Matli',
    timestamp: '2025-01-25T09:20:00Z',
    read: true,
    coordinates: [24.8142, 68.8372]
  },
  {
    id: '5',
    severity: 'info',
    title: 'New Imagery Available',
    description: 'Fresh Sentinel-2 imagery covering entire province now available.',
    location: 'Sindh Province',
    timestamp: '2025-01-26T08:00:00Z',
    read: true
  },
  {
    id: '6',
    severity: 'info',
    title: 'Wheat Harvest Season Approaching',
    description: 'Southern districts entering optimal harvest window.',
    location: 'Districts: Hyderabad, Mirpurkhas',
    timestamp: '2025-01-24T11:00:00Z',
    read: true
  }
];

// Sample Field Data
export const sampleFields: FieldData[] = [
  {
    id: 'field-001',
    name: 'Field HYD-2847',
    coordinates: [
      [25.3960, 68.3578],
      [25.3980, 68.3578],
      [25.3980, 68.3600],
      [25.3960, 68.3600]
    ],
    center: [25.3970, 68.3589],
    area: 12.5,
    cropType: 'Wheat',
    ndvi: 0.72,
    healthStatus: 'moderate',
    plantingDate: '2024-11-15',
    expectedHarvest: '2025-04-20',
    yieldEstimate: 4.2,
    waterStressIndex: 0.35,
    soilMoisture: 42,
    history: generateNDVIHistory()
  },
  {
    id: 'field-002',
    name: 'Field LAR-1932',
    coordinates: [
      [27.5612, 68.2159],
      [27.5635, 68.2159],
      [27.5635, 68.2185],
      [27.5612, 68.2185]
    ],
    center: [27.5624, 68.2172],
    area: 18.3,
    cropType: 'Rice',
    ndvi: 0.45,
    healthStatus: 'stressed',
    plantingDate: '2024-07-10',
    expectedHarvest: '2025-02-15',
    yieldEstimate: 3.1,
    waterStressIndex: 0.22,
    soilMoisture: 28,
    history: generateNDVIHistory()
  },
  {
    id: 'field-003',
    name: 'Field SKR-4521',
    coordinates: [
      [27.7052, 68.8574],
      [27.7075, 68.8574],
      [27.7075, 68.8600],
      [27.7052, 68.8600]
    ],
    center: [27.7064, 68.8587],
    area: 25.7,
    cropType: 'Sugarcane',
    ndvi: 0.85,
    healthStatus: 'healthy',
    plantingDate: '2024-09-01',
    expectedHarvest: '2025-12-01',
    yieldEstimate: 78.5,
    waterStressIndex: 0.78,
    soilMoisture: 65,
    history: generateNDVIHistory()
  },
  {
    id: 'field-004',
    name: 'Field BDN-7823',
    coordinates: [
      [24.8142, 68.8372],
      [24.8165, 68.8372],
      [24.8165, 68.8398],
      [24.8142, 68.8398]
    ],
    center: [24.8154, 68.8385],
    area: 15.2,
    cropType: 'Cotton',
    ndvi: 0.58,
    healthStatus: 'moderate',
    plantingDate: '2024-05-20',
    expectedHarvest: '2025-09-30',
    yieldEstimate: 2.8,
    waterStressIndex: 0.48,
    soilMoisture: 38,
    history: generateNDVIHistory()
  }
];

// Generate NDVI history for charts
function generateNDVIHistory(): { date: string; ndvi: number; evi: number; ndwi: number }[] {
  const history = [];
  const baseDate = new Date('2024-11-01');
  
  for (let i = 0; i < 90; i += 5) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    // Simulate seasonal NDVI curve
    const dayOfYear = i;
    const seasonalFactor = Math.sin((dayOfYear / 180) * Math.PI) * 0.4 + 0.4;
    const randomVariation = (Math.random() - 0.5) * 0.1;
    
    history.push({
      date: date.toISOString().split('T')[0],
      ndvi: Math.max(0, Math.min(1, seasonalFactor + randomVariation)),
      evi: Math.max(0, Math.min(1, seasonalFactor * 0.9 + randomVariation)),
      ndwi: Math.max(-1, Math.min(1, seasonalFactor * 0.7 + randomVariation - 0.2))
    });
  }
  
  return history;
}

// Districts Data
export const districts: DistrictData[] = [
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    coordinates: [
      [25.2, 68.2],
      [25.5, 68.2],
      [25.5, 68.5],
      [25.2, 68.5]
    ],
    totalArea: 285000,
    cultivatedArea: 245000,
    cropBreakdown: { wheat: 45, rice: 25, cotton: 20, sugarcane: 10 },
    healthScore: 76,
    alerts: 23
  },
  {
    id: 'larkana',
    name: 'Larkana',
    coordinates: [
      [27.4, 68.0],
      [27.7, 68.0],
      [27.7, 68.4],
      [27.4, 68.4]
    ],
    totalArea: 195000,
    cultivatedArea: 168000,
    cropBreakdown: { wheat: 30, rice: 50, cotton: 10, sugarcane: 10 },
    healthScore: 71,
    alerts: 31
  },
  {
    id: 'sukkur',
    name: 'Sukkur',
    coordinates: [
      [27.5, 68.7],
      [27.9, 68.7],
      [27.9, 69.1],
      [27.5, 69.1]
    ],
    totalArea: 165000,
    cultivatedArea: 142000,
    cropBreakdown: { wheat: 40, rice: 20, cotton: 25, sugarcane: 15 },
    healthScore: 79,
    alerts: 15
  },
  {
    id: 'badin',
    name: 'Badin',
    coordinates: [
      [24.5, 68.6],
      [24.9, 68.6],
      [24.9, 69.0],
      [24.5, 69.0]
    ],
    totalArea: 210000,
    cultivatedArea: 185000,
    cropBreakdown: { wheat: 35, rice: 30, cotton: 25, sugarcane: 10 },
    healthScore: 68,
    alerts: 28
  },
  {
    id: 'mirpurkhas',
    name: 'Mirpurkhas',
    coordinates: [
      [25.3, 68.8],
      [25.7, 68.8],
      [25.7, 69.2],
      [25.3, 69.2]
    ],
    totalArea: 178000,
    cultivatedArea: 156000,
    cropBreakdown: { wheat: 50, rice: 15, cotton: 20, sugarcane: 15 },
    healthScore: 81,
    alerts: 12
  }
];

// Weather Data
export const weatherData: WeatherData = {
  current: {
    temperature: 34,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    precipitation: 0,
    uvIndex: 8
  },
  forecast: [
    { date: '2025-01-27', high: 36, low: 22, condition: 'Sunny', precipitationChance: 5, humidity: 58 },
    { date: '2025-01-28', high: 35, low: 21, condition: 'Partly Cloudy', precipitationChance: 15, humidity: 62 },
    { date: '2025-01-29', high: 33, low: 20, condition: 'Cloudy', precipitationChance: 45, humidity: 70 },
    { date: '2025-01-30', high: 31, low: 19, condition: 'Light Rain', precipitationChance: 75, humidity: 78 },
    { date: '2025-01-31', high: 32, low: 18, condition: 'Partly Cloudy', precipitationChance: 20, humidity: 68 }
  ]
};

// Vegetation Index Time Series
export const vegetationIndexData: VegetationIndex[] = [
  { date: '2024-11-01', ndvi: 0.35, evi: 0.32, ndwi: -0.15, savi: 0.38 },
  { date: '2024-11-15', ndvi: 0.42, evi: 0.39, ndwi: -0.08, savi: 0.45 },
  { date: '2024-12-01', ndvi: 0.51, evi: 0.48, ndwi: 0.02, savi: 0.54 },
  { date: '2024-12-15', ndvi: 0.58, evi: 0.55, ndwi: 0.08, savi: 0.61 },
  { date: '2025-01-01', ndvi: 0.65, evi: 0.62, ndwi: 0.15, savi: 0.68 },
  { date: '2025-01-15', ndvi: 0.72, evi: 0.69, ndwi: 0.22, savi: 0.75 },
  { date: '2025-01-26', ndvi: 0.78, evi: 0.75, ndwi: 0.28, savi: 0.81 }
];

// Analytics Data
export const analyticsData: AnalyticsData = {
  cropAreaTrends: [
    { year: 2020, wheat: 920000, rice: 680000, cotton: 620000, sugarcane: 480000 },
    { year: 2021, wheat: 935000, rice: 695000, cotton: 605000, sugarcane: 495000 },
    { year: 2022, wheat: 950000, rice: 710000, cotton: 590000, sugarcane: 510000 },
    { year: 2023, wheat: 965000, rice: 715000, cotton: 585000, sugarcane: 530000 },
    { year: 2024, wheat: 985000, rice: 720000, cotton: 580000, sugarcane: 555000 }
  ],
  yieldPredictions: [
    { month: 'Nov', predicted: 3.2, confidence: [2.8, 3.6] },
    { month: 'Dec', predicted: 3.5, confidence: [3.1, 3.9] },
    { month: 'Jan', predicted: 3.8, confidence: [3.4, 4.2] },
    { month: 'Feb', predicted: 4.1, confidence: [3.7, 4.5] },
    { month: 'Mar', predicted: 4.3, confidence: [3.9, 4.7] },
    { month: 'Apr', predicted: 4.5, actual: 4.2, confidence: [4.1, 4.9] }
  ],
  healthDistribution: [
    { status: 'Healthy', percentage: 68, area: 1931200 },
    { status: 'Moderate Stress', percentage: 24, area: 681600 },
    { status: 'High Stress', percentage: 8, area: 227200 }
  ]
};

// Map Layer Configurations
export const mapLayers = {
  baseLayers: [
    { id: 'osm', name: 'OpenStreetMap', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap contributors' },
    { id: 'satellite', name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri' },
    { id: 'terrain', name: 'Terrain', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '© OpenTopoMap' }
  ],
  dataLayers: [
    { id: 'ndvi', name: 'NDVI', visible: true, opacity: 0.8 },
    { id: 'crops', name: 'Crop Types', visible: true, opacity: 1 },
    { id: 'moisture', name: 'Soil Moisture', visible: false, opacity: 0.7 },
    { id: 'temperature', name: 'Land Surface Temp', visible: false, opacity: 0.7 },
    { id: 'stress', name: 'Water Stress Index', visible: false, opacity: 0.8 }
  ]
};

// Available Satellite Dates for Sindh Province
export const availableSatelliteDates = [
  { date: '2024-11-01', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 5, available: true },
  { date: '2024-11-06', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 12, available: true },
  { date: '2024-11-11', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 3, available: true },
  { date: '2024-11-16', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 25, available: false },
  { date: '2024-11-21', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 8, available: true },
  { date: '2024-11-26', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 2, available: true },
  { date: '2024-12-01', sourceId: 'landsat', sourceName: 'Landsat 8/9', cloudCover: 10, available: true },
  { date: '2024-12-06', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 15, available: true },
  { date: '2024-12-11', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 4, available: true },
  { date: '2024-12-16', sourceId: 'modis', sourceName: 'MODIS', cloudCover: 8, available: true },
  { date: '2024-12-21', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 20, available: true },
  { date: '2024-12-26', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 6, available: true },
  { date: '2024-12-31', sourceId: 'landsat', sourceName: 'Landsat 8/9', cloudCover: 12, available: true },
  { date: '2025-01-05', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 7, available: true },
  { date: '2025-01-10', sourceId: 'modis', sourceName: 'MODIS', cloudCover: 5, available: true },
  { date: '2025-01-15', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 3, available: true },
  { date: '2025-01-20', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 18, available: true },
  { date: '2025-01-26', sourceId: 'sentinel-2', sourceName: 'Sentinel-2', cloudCover: 4, available: true }
];

// Pre-calculated index results for demonstration
export const indexResults = {
  '2025-01-26': {
    ndvi: { min: -0.15, max: 0.92, mean: 0.58, stdDev: 0.18, indexId: 'ndvi', indexName: 'NDVI' },
    evi: { min: -0.22, max: 0.88, mean: 0.52, stdDev: 0.16, indexId: 'evi', indexName: 'EVI' },
    ndwi: { min: -0.45, max: 0.65, mean: 0.12, stdDev: 0.22, indexId: 'ndwi', indexName: 'NDWI' },
    savi: { min: -0.18, max: 0.85, mean: 0.54, stdDev: 0.17, indexId: 'savi', indexName: 'SAVI' },
    msi: { min: 0.65, max: 2.45, mean: 1.32, stdDev: 0.35, indexId: 'msi', indexName: 'MSI' },
    nbr: { min: -0.35, max: 0.78, mean: 0.42, stdDev: 0.19, indexId: 'nbr', indexName: 'NBR' },
    lai: { min: 0.1, max: 5.8, mean: 3.2, stdDev: 1.1, indexId: 'lai', indexName: 'LAI' },
    gndvi: { min: -0.12, max: 0.85, mean: 0.51, stdDev: 0.17, indexId: 'gndvi', indexName: 'GNDVI' }
  },
  '2025-01-15': {
    ndvi: { min: -0.12, max: 0.88, mean: 0.55, stdDev: 0.17, indexId: 'ndvi', indexName: 'NDVI' },
    evi: { min: -0.20, max: 0.85, mean: 0.49, stdDev: 0.15, indexId: 'evi', indexName: 'EVI' },
    ndwi: { min: -0.42, max: 0.62, mean: 0.10, stdDev: 0.21, indexId: 'ndwi', indexName: 'NDWI' },
    savi: { min: -0.15, max: 0.82, mean: 0.51, stdDev: 0.16, indexId: 'savi', indexName: 'SAVI' },
    msi: { min: 0.70, max: 2.55, mean: 1.38, stdDev: 0.37, indexId: 'msi', indexName: 'MSI' },
    nbr: { min: -0.32, max: 0.75, mean: 0.40, stdDev: 0.18, indexId: 'nbr', indexName: 'NBR' },
    lai: { min: 0.1, max: 5.5, mean: 3.0, stdDev: 1.0, indexId: 'lai', indexName: 'LAI' },
    gndvi: { min: -0.10, max: 0.82, mean: 0.48, stdDev: 0.16, indexId: 'gndvi', indexName: 'GNDVI' }
  }
};

// Histogram data for NDVI visualization
export function generateHistogramData(mean: number, stdDev: number): { value: number; count: number }[] {
  const histogram: { value: number; count: number }[] = [];
  for (let i = -2; i <= 10; i++) {
    const value = i * 0.1;
    const zScore = (value - mean) / stdDev;
    const count = Math.max(0, Math.exp(-0.5 * zScore * zScore) * 1000 + Math.random() * 100);
    histogram.push({ value, count: Math.round(count) });
  }
  return histogram;
}

// Sindh Province bounds for satellite imagery
export const sindhBounds: [[number, number], [number, number], [number, number], [number, number]] = [
  [23.7, 66.9],  // Southwest
  [23.7, 71.2],  // Southeast
  [28.5, 71.2],  // Northeast
  [28.5, 66.9]   // Northwest
];

// Regions of interest for detailed analysis
export const regionsOfInterest = [
  {
    id: 'indus-delta',
    name: 'Indus River Delta',
    bounds: [[23.5, 67.0], [23.5, 68.5], [24.5, 68.5], [24.5, 67.0]] as [[number, number], [number, number], [number, number], [number, number]],
    area: 850000
  },
  {
    id: 'thar-desert',
    name: 'Thar Desert Region',
    bounds: [[24.0, 69.5], [24.0, 71.0], [25.5, 71.0], [25.5, 69.5]] as [[number, number], [number, number], [number, number], [number, number]],
    area: 1200000
  },
  {
    id: 'rice-belt',
    name: 'Rice Cultivation Belt',
    bounds: [[26.5, 68.0], [26.5, 69.0], [27.5, 69.0], [27.5, 68.0]] as [[number, number], [number, number], [number, number], [number, number]],
    area: 650000
  }
];

// Temporal comparison data
export const temporalComparisons = [
  {
    date1: '2025-01-15',
    date2: '2025-01-26',
    indexId: 'ndvi',
    changeMap: [
      { category: 'Significant Decline (>20%)', value: -20, area: 85000, color: '#dc2626' },
      { category: 'Moderate Decline (10-20%)', value: -15, area: 120000, color: '#f97316' },
      { category: 'Slight Decline (5-10%)', value: -7, area: 180000, color: '#fbbf24' },
      { category: 'Stable (±5%)', value: 0, area: 1850000, color: '#d1d5db' },
      { category: 'Slight Increase (5-10%)', value: 7, area: 320000, color: '#86efac' },
      { category: 'Moderate Increase (10-20%)', value: 15, area: 150000, color: '#22c55e' },
      { category: 'Significant Increase (>20%)', value: 25, area: 75000, color: '#15803d' }
    ]
  }
];
