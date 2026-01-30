import { useState } from 'react';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { 
  X, 
  MapPin, 
  Calendar, 
  Ruler, 
  Sprout, 
  Droplets,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { FieldData } from '@/types';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';

interface FieldDetailModalProps {
  field: FieldData;
  onClose: () => void;
}

const healthConfig = {
  healthy: {
    label: 'Healthy',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle2
  },
  moderate: {
    label: 'Moderate Stress',
    color: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: AlertTriangle
  },
  stressed: {
    label: 'High Stress',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertTriangle
  }
};

function NDVIGauge({ value }: { value: number }) {
  const percentage = value * 100;
  let color = '#8b4513';
  if (value >= 0.8) color = '#006100';
  else if (value >= 0.7) color = '#38a800';
  else if (value >= 0.6) color = '#c6e090';
  else if (value >= 0.4) color = '#ffffcc';
  else if (value >= 0.2) color = '#d2b48c';

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 2.51} 251`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{value.toFixed(2)}</span>
        <span className="text-xs text-gray-500">NDVI</span>
      </div>
    </div>
  );
}

export function FieldDetailModal({ field, onClose }: FieldDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const health = healthConfig[field.healthStatus];
  const HealthIcon = health.icon;

  const chartData = field.history.map(h => ({
    date: h.date.slice(5),
    NDVI: h.ndvi,
    EVI: h.evi,
    NDWI: h.ndwi
  }));

  // Calculate days until harvest
  const harvestDate = new Date(field.expectedHarvest);
  const today = new Date();
  const daysUntilHarvest = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{field.name}</h2>
                <Badge className={`${health.bgColor} ${health.textColor} ${health.borderColor}`}>
                  <HealthIcon className="w-3 h-3 mr-1" />
                  {health.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {field.center[0].toFixed(4)}, {field.center[1].toFixed(4)}
                </span>
                <span className="flex items-center gap-1">
                  <Sprout className="w-4 h-4" />
                  {field.cropType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 border-b border-gray-100">
            <TabsList className="w-full justify-start bg-transparent border-b-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary-medium rounded-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="timeseries" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary-medium rounded-none">
                Time Series
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary-medium rounded-none">
                Analysis
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <NDVIGauge value={field.ndvi} />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Area</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{field.area}</p>
                  <p className="text-xs text-gray-500">hectares</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Harvest In</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{daysUntilHarvest}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Yield Est.</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{field.yieldEstimate}</p>
                  <p className="text-xs text-gray-500">tons/ha</p>
                </div>
              </div>

              {/* Field Map */}
              <div className="h-[250px] rounded-xl overflow-hidden border border-gray-200">
                <MapContainer
                  center={field.center}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="© Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                  <Polygon
                    positions={field.coordinates}
                    pathOptions={{
                      color: '#2d8a57',
                      weight: 3,
                      fillColor: '#2d8a57',
                      fillOpacity: 0.3
                    }}
                  />
                </MapContainer>
              </div>

              {/* Field Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">Crop Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Crop Type</span>
                      <span className="font-medium text-gray-900">{field.cropType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Planting Date</span>
                      <span className="font-medium text-gray-900">{field.plantingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Harvest</span>
                      <span className="font-medium text-gray-900">{field.expectedHarvest}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">Soil & Water</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Soil Moisture</span>
                      <div className="flex items-center gap-2">
                        <Progress value={field.soilMoisture} className="w-16 h-2" />
                        <span className="font-medium text-gray-900 w-10">{field.soilMoisture}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Water Stress</span>
                      <div className="flex items-center gap-2">
                        <Progress value={field.waterStressIndex * 100} className="w-16 h-2" />
                        <span className="font-medium text-gray-900 w-10">{(field.waterStressIndex * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeseries" className="mt-0 space-y-6">
              {/* Vegetation Index Chart */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Vegetation Index History</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorNDVI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} domain={[0, 1]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="NDVI"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fill="url(#colorNDVI)"
                      />
                      <Line
                        type="monotone"
                        dataKey="EVI"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="NDWI"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={false}
                      />
                      <ReferenceLine y={0.6} stroke="#f59e0b" strokeDasharray="5 5" label="Stress Threshold" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparison with Regional Average */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-3">Regional Comparison</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">This Field (Current NDVI)</span>
                      <span className="font-medium text-gray-900">{field.ndvi.toFixed(2)}</span>
                    </div>
                    <Progress value={field.ndvi * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Regional Average</span>
                      <span className="font-medium text-gray-900">0.68</span>
                    </div>
                    <Progress value={68} className="h-2 bg-gray-200" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">District Average</span>
                      <span className="font-medium text-gray-900">0.72</span>
                    </div>
                    <Progress value={72} className="h-2 bg-gray-200" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0 space-y-6">
              {/* Water Stress Analysis */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Water Stress Analysis</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {field.waterStressIndex < 0.3 
                    ? 'High water stress detected. Immediate irrigation recommended to prevent yield loss.'
                    : field.waterStressIndex < 0.5
                    ? 'Moderate water stress. Monitor closely and consider irrigation within 3-5 days.'
                    : 'Water stress levels are acceptable. Continue current irrigation schedule.'}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Water Stress Index</span>
                      <span className="font-medium text-gray-900">{(field.waterStressIndex * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={field.waterStressIndex * 100} 
                      className="h-3"
                    />
                  </div>
                </div>
              </div>

              {/* Growth Stage */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sprout className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-gray-900">Growth Stage Detection</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Current Stage</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Grain Filling
                      </Badge>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">75% through growing cycle</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-amber-600" />
                  <h4 className="font-medium text-gray-900">Recommendations</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {field.waterStressIndex < 0.5 && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      Schedule irrigation within 48 hours
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    Monitor NDVI trends daily
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    Prepare for harvest in {daysUntilHarvest} days
                  </li>
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
