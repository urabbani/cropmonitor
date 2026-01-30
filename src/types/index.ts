// Dashboard Types

export interface KPIData {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: number;
  trendLabel: string;
  icon: string;
  sparklineData: number[];
  status: 'positive' | 'negative' | 'neutral' | 'warning';
}

export interface CropType {
  id: string;
  name: string;
  color: string;
  area: number;
  healthScore: number;
  trend: number;
}

export interface SatelliteSource {
  id: string;
  name: string;
  resolution: string;
  revisitTime: string;
  status: 'active' | 'delayed' | 'offline';
  lastUpdate: string;
  description: string;
  useCases: string[];
  icon: string;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  read: boolean;
  coordinates?: [number, number];
}

export interface FieldData {
  id: string;
  name: string;
  coordinates: [number, number][];
  center: [number, number];
  area: number;
  cropType: string;
  ndvi: number;
  healthStatus: 'healthy' | 'moderate' | 'stressed';
  plantingDate: string;
  expectedHarvest: string;
  yieldEstimate: number;
  waterStressIndex: number;
  soilMoisture: number;
  history: NDVIPoint[];
}

export interface NDVIPoint {
  date: string;
  ndvi: number;
  evi: number;
  ndwi: number;
}

export interface VegetationIndex {
  date: string;
  ndvi: number;
  evi: number;
  ndwi: number;
  savi: number;
}

export interface DistrictData {
  id: string;
  name: string;
  coordinates: [number, number][];
  totalArea: number;
  cultivatedArea: number;
  cropBreakdown: Record<string, number>;
  healthScore: number;
  alerts: number;
}

export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    uvIndex: number;
  };
  forecast: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitationChance: number;
  humidity: number;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'raster' | 'vector' | 'overlay';
  visible: boolean;
  opacity: number;
  legend?: LegendItem[];
  url?: string;
}

export interface LegendItem {
  color: string;
  label: string;
  value?: number;
}

export interface AnalyticsData {
  cropAreaTrends: {
    year: number;
    wheat: number;
    rice: number;
    cotton: number;
    sugarcane: number;
  }[];
  yieldPredictions: {
    month: string;
    predicted: number;
    actual?: number;
    confidence: [number, number];
  }[];
  healthDistribution: {
    status: string;
    percentage: number;
    area: number;
  }[];
}

export interface TimeSeriesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
    fill?: boolean;
  }[];
}
