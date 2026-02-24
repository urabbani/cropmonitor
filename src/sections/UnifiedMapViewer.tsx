import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, LayerGroup, CircleMarker, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Eye,
  EyeOff,
  Play,
  Pause,
  Maximize2,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Satellite,
  TrendingUp,
  Settings,
  Info,
  SkipBack,
  SkipForward,
  RotateCcw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleFields, districts, availableSatelliteDates, indexResults, generateHistogramData } from '@/data/mockData';
import { vegetationIndices, getIndexConfig, getColorScaleGradient } from '@/lib/satelliteUtils';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FieldData } from '@/types';

// Fix Leaflet default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map bounds fitter component
function MapBoundsFitter() {
  const map = useMap();

  useEffect(() => {
    const easternProvinceBounds = L.latLngBounds(
      [25.5, 49.0],
      [27.5, 51.0]
    );
    map.fitBounds(easternProvinceBounds, { padding: [20, 20] });
  }, [map]);

  return null;
}

// NDVI Color Scale
function getNDVIColor(ndvi: number): string {
  if (ndvi < 0.2) return '#8b4513';
  if (ndvi < 0.4) return '#d2b48c';
  if (ndvi < 0.6) return '#ffffcc';
  if (ndvi < 0.7) return '#c6e090';
  if (ndvi < 0.8) return '#38a800';
  return '#006100';
}

// Crop type colors
function getCropColor(cropType: string): string {
  const colors: Record<string, string> = {
    'Dates': '#d4a574',
    'Wheat': '#eab308',
    'Tomatoes': '#ef4444',
    'Alfalfa': '#86efac'
  };
  return colors[cropType] || '#6b7280';
}

// Health status badge
function getHealthBadge(status: string) {
  const configs: Record<string, { label: string; className: string }> = {
    'healthy': { label: 'Healthy', className: 'bg-green-100 text-green-700 border-green-200' },
    'moderate': { label: 'Moderate', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    'stressed': { label: 'Stressed', className: 'bg-red-100 text-red-700 border-red-200' }
  };
  return configs[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };
}

// Index Legend Component
function IndexLegend({ indexId }: { indexId: string }) {
  const config = getIndexConfig(indexId);
  if (!config) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">{config.name} Scale</span>
        <span className="text-xs text-gray-500">{config.unit || 'unitless'}</span>
      </div>
      <div
        className="h-4 rounded-full"
        style={{ background: getColorScaleGradient(indexId) }}
      />
      <div className="flex justify-between text-xs text-gray-500">
        {config.colorScale.map((stop) => (
          <span key={stop.value} className={stop.value === config.range[0] || stop.value === config.range[1] ? '' : 'hidden'}>
            {stop.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Histogram Chart Component
function IndexHistogram({ histogram }: { histogram: { value: number; count: number }[] }) {
  const getColor = (value: number) => {
    if (value < 0.2) return '#8b4513';
    if (value < 0.4) return '#d2b48c';
    if (value < 0.6) return '#c6e090';
    return '#006100';
  };

  return (
    <div className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={histogram}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="value"
            stroke="#9ca3af"
            fontSize={10}
            tickLine={false}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={10}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(count: number) => [count, 'Pixels']}
            labelFormatter={(value) => `Value: ${Number(value).toFixed(2)}`}
          />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            {histogram.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface UnifiedMapViewerProps {
  onFieldSelect: (field: FieldData) => void;
}

export const UnifiedMapViewer = React.memo(function UnifiedMapViewer({ onFieldSelect }: UnifiedMapViewerProps) {
  const [activeTab, setActiveTab] = useState<'gis' | 'satellite'>('gis');

  // GIS Map state
  const [activeLayers, setActiveLayers] = useState({
    ndvi: true,
    crops: true,
    moisture: false,
    temperature: false,
    stress: false
  });
  const [baseLayer, setBaseLayer] = useState('osm');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Satellite state
  const [selectedDate, setSelectedDate] = useState('2025-01-26');
  const [selectedIndex, setSelectedIndex] = useState('ndvi');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timeline dates
  const timelineDates = useMemo(() => ['2025-01-20', '2025-01-22', '2025-01-24', '2025-01-26'], []);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(3);

  // Auto-play timeline
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (activeTab === 'gis') {
          setCurrentTimelineIndex((prev) => {
            const next = (prev + 1) % timelineDates.length;
            setSelectedDate(timelineDates[next]);
            return next;
          });
        } else {
          const availableDates = availableSatelliteDates.filter(d => d.available).map(d => d.date);
          const currentIndex = availableDates.indexOf(selectedDate);
          const nextIndex = (currentIndex + 1) % availableDates.length;
          setSelectedDate(availableDates[nextIndex]);
        }
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeTab, timelineDates, selectedDate]);

  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId as keyof typeof prev]
    }));
  };

  const handleFieldClick = (field: FieldData) => {
    setSelectedFieldId(field.id);
    onFieldSelect(field);
  };

  const baseLayerUrls: Record<string, string> = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  const availableDates = availableSatelliteDates.filter(d => d.available);
  const selectedDateData = availableSatelliteDates.find(d => d.date === selectedDate);
  const indexConfig = getIndexConfig(selectedIndex);
  const currentResult = indexResults[selectedDate as keyof typeof indexResults]?.[selectedIndex as keyof typeof indexResults['2025-01-26']];
  const histogramData = currentResult ? generateHistogramData(currentResult.mean, currentResult.stdDev) : [];

  const easternProvinceBounds: [[number, number], [number, number], [number, number], [number, number]] = [
    [25.5, 49.0],
    [25.5, 51.0],
    [27.5, 51.0],
    [27.5, 49.0]
  ];

  return (
    <Card className="overflow-hidden border border-gray-200">
      {/* Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-100 bg-white gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${activeTab === 'gis' ? 'bg-primary-pale' : 'bg-purple-50'}`}>
            {activeTab === 'gis' ? <Layers className="w-5 h-5 text-primary-dark" /> : <Satellite className="w-5 h-5 text-purple-600" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {activeTab === 'gis' ? 'GIS Map View' : 'Satellite Imagery Analysis'}
            </h3>
            <p className="text-xs text-gray-500">
              {activeTab === 'gis' ? 'Eastern Province, Saudi Arabia' : 'Multi-temporal vegetation index visualization'}
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'gis' | 'satellite')} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="gis" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>GIS Map</span>
            </TabsTrigger>
            <TabsTrigger value="satellite" className="flex items-center gap-2">
              <Satellite className="w-4 h-4" />
              <span>Satellite</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex">
        {/* Sidebar Controls */}
        {sidebarOpen && (
          <div className="w-72 bg-white border-r border-gray-100 p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {activeTab === 'gis' ? (
              <>
                {/* Base Layer Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Base Layer</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'osm', label: 'OpenStreetMap' },
                      { id: 'satellite', label: 'Satellite Imagery' },
                      { id: 'terrain', label: 'Terrain' }
                    ].map((layer) => (
                      <label
                        key={layer.id}
                        className={`
                          flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors
                          ${baseLayer === layer.id ? 'bg-primary-pale border border-primary-light' : 'hover:bg-gray-50 border border-transparent'}
                        `}
                      >
                        <input
                          type="radio"
                          name="baseLayer"
                          value={layer.id}
                          checked={baseLayer === layer.id}
                          onChange={(e) => setBaseLayer(e.target.value)}
                          className="w-4 h-4 text-primary-medium"
                        />
                        <span className="text-sm">{layer.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Data Layers */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Data Layers</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'ndvi', label: 'NDVI (Vegetation Health)', color: '#38a800' },
                      { id: 'crops', label: 'Crop Types', color: '#eab308' },
                      { id: 'moisture', label: 'Soil Moisture', color: '#3b82f6' },
                      { id: 'temperature', label: 'Land Surface Temp', color: '#ef4444' },
                      { id: 'stress', label: 'Water Stress Index', color: '#f59e0b' }
                    ].map((layer) => (
                      <div
                        key={layer.id}
                        onClick={() => toggleLayer(layer.id)}
                        className={`
                          layer-control-item
                          ${activeLayers[layer.id as keyof typeof activeLayers] ? 'active' : ''}
                        `}
                      >
                        {activeLayers[layer.id as keyof typeof activeLayers] ? (
                          <Eye className="w-4 h-4 text-primary-medium" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-sm flex-1">{layer.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NDVI Legend */}
                {activeLayers.ndvi && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">NDVI Legend</h4>
                    <div className="ndvi-scale h-4 rounded-full mb-2"></div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>-0.2</span>
                      <span>0.5</span>
                      <span>1.0</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Water</span>
                      <span>Moderate</span>
                      <span>Healthy</span>
                    </div>
                  </div>
                )}

                {/* Crop Type Legend */}
                {activeLayers.crops && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Crop Types</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Dates', color: '#d4a574' },
                        { name: 'Wheat', color: '#eab308' },
                        { name: 'Tomatoes', color: '#ef4444' },
                        { name: 'Alfalfa', color: '#86efac' }
                      ].map((crop) => (
                        <div key={crop.name} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: crop.color }}
                          />
                          <span className="text-sm text-gray-600">{crop.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Date Selector */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Select Date</h4>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date.date} value={date.date}>
                          <div className="flex items-center gap-2">
                            <span>{date.date}</span>
                            <Badge variant="outline" className="text-xs">
                              {date.cloudCover}%
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Index Selector */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Vegetation Index</h4>
                  <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select index" />
                    </SelectTrigger>
                    <SelectContent>
                      {vegetationIndices.map((index) => (
                        <SelectItem key={index.id} value={index.id}>
                          {index.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selection Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Selection Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Index</span>
                      <span className="font-medium">{indexConfig?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cloud Cover</span>
                      <span className="font-medium">{selectedDateData?.cloudCover}%</span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                {currentResult && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Statistics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Min</p>
                        <p className="font-semibold text-gray-900">{currentResult.min.toFixed(2)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Max</p>
                        <p className="font-semibold text-gray-900">{currentResult.max.toFixed(2)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Mean</p>
                        <p className="font-semibold text-gray-900">{currentResult.mean.toFixed(2)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Std Dev</p>
                        <p className="font-semibold text-gray-900">{currentResult.stdDev.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Index Legend */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
                  <IndexLegend indexId={selectedIndex} />
                </div>

                {/* Histogram */}
                {histogramData.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Distribution</h4>
                    <IndexHistogram histogram={histogramData} />
                  </div>
                )}

                {/* Formula Info */}
                {indexConfig && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">{indexConfig.name}</p>
                        <p className="text-xs text-blue-700 mt-1">{indexConfig.formula}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-[400] bg-white shadow-md rounded-r-lg p-1.5 hover:bg-gray-50 transition-colors"
          style={{ left: sidebarOpen ? '288px' : '0' }}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[26.5, 50.0]}
            zoom={8}
            className="h-[500px] lg:h-[600px] w-full"
          >
            <MapBoundsFitter />

            <TileLayer
              attribution={baseLayer === 'osm' ? '© OpenStreetMap contributors' : '© Esri'}
              url={baseLayerUrls[baseLayer]}
            />

            {/* Satellite Mode: Index Overlay */}
            {activeTab === 'satellite' && (
              <ImageOverlay
                url={`data:image/svg+xml,${encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
                    <defs>
                      <linearGradient id="ndviGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#8b4513;stop-opacity:0.7" />
                        <stop offset="30%" style="stop-color:#ffffcc;stop-opacity:0.7" />
                        <stop offset="60%" style="stop-color:#38a800;stop-opacity:0.7" />
                        <stop offset="100%" style="stop-color:#006100;stop-opacity:0.7" />
                      </linearGradient>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="url(#ndviGradient)" opacity="0.5"/>
                        <circle cx="25" cy="25" r="8" fill="white" opacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>
                    <text x="400" y="300" font-family="Arial" font-size="24" fill="white" text-anchor="middle" opacity="0.8">
                      ${indexConfig?.name} - ${selectedDate}
                    </text>
                  </svg>
                `)}`}
                bounds={easternProvinceBounds}
                opacity={0.6}
              />
            )}

            {/* GIS Mode: District Boundaries */}
            {activeTab === 'gis' && (
              <LayerGroup>
                {districts.map((district) => (
                  <Polygon
                    key={district.id}
                    positions={district.coordinates}
                    pathOptions={{
                      color: '#1a5d3a',
                      weight: 2,
                      opacity: 0.6,
                      fillColor: '#e8f5ee',
                      fillOpacity: 0.1
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold text-gray-900">{district.name}</h4>
                        <p className="text-sm text-gray-600">Total Area: {district.totalArea.toLocaleString()} ha</p>
                        <p className="text-sm text-gray-600">Cultivated: {district.cultivatedArea.toLocaleString()} ha</p>
                        <p className="text-sm text-gray-600">Health Score: {district.healthScore}/100</p>
                      </div>
                    </Popup>
                  </Polygon>
                ))}
              </LayerGroup>
            )}

            {/* Field Polygons */}
            {(activeTab === 'gis' && (activeLayers.ndvi || activeLayers.crops)) && (
              <LayerGroup>
                {sampleFields.map((field) => (
                  <Polygon
                    key={field.id}
                    positions={field.coordinates}
                    pathOptions={{
                      color: activeLayers.crops ? getCropColor(field.cropType) : getNDVIColor(field.ndvi),
                      weight: selectedFieldId === field.id ? 4 : 2,
                      opacity: 0.8,
                      fillColor: activeLayers.crops ? getCropColor(field.cropType) : getNDVIColor(field.ndvi),
                      fillOpacity: activeLayers.ndvi ? 0.5 : 0.3
                    }}
                    eventHandlers={{
                      click: () => handleFieldClick(field)
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{field.name}</h4>
                          <Badge
                            variant="outline"
                            className={getHealthBadge(field.healthStatus).className}
                          >
                            {getHealthBadge(field.healthStatus).label}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium">Crop:</span> {field.cropType}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Area:</span> {field.area} ha
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">NDVI:</span> {field.ndvi.toFixed(2)}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Soil Moisture:</span> {field.soilMoisture}%
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Water Stress:</span> {(field.waterStressIndex * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-3 bg-primary-medium hover:bg-primary-dark"
                          onClick={() => handleFieldClick(field)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Popup>
                  </Polygon>
                ))}
              </LayerGroup>
            )}

            {/* Field Center Markers */}
            {activeTab === 'gis' && (
              <LayerGroup>
                {sampleFields.map((field) => (
                  <CircleMarker
                    key={`marker-${field.id}`}
                    center={field.center}
                    radius={6}
                    pathOptions={{
                      fillColor: getCropColor(field.cropType),
                      color: '#fff',
                      weight: 2,
                      fillOpacity: 0.9
                    }}
                    eventHandlers={{
                      click: () => handleFieldClick(field)
                    }}
                  />
                ))}
              </LayerGroup>
            )}
          </MapContainer>

          {/* Timeline Control */}
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-[400]">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              {activeTab === 'gis' ? (
                <>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Timeline</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-primary-dark">{selectedDate}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={timelineDates.length - 1}
                      value={currentTimelineIndex}
                      onChange={(e) => {
                        const index = parseInt(e.target.value);
                        setCurrentTimelineIndex(index);
                        setSelectedDate(timelineDates[index]);
                      }}
                      className="timeline-slider"
                    />
                    <div className="flex justify-between mt-1">
                      {timelineDates.map((date, index) => (
                        <span
                          key={date}
                          className={`text-xs ${index === currentTimelineIndex ? 'text-primary-dark font-medium' : 'text-gray-400'}`}
                        >
                          {date.slice(5)}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const dates = availableDates.map(d => d.date);
                        const idx = dates.findIndex(d => d === selectedDate);
                        setSelectedDate(dates[Math.max(0, idx - 1)]);
                      }}
                      disabled={availableDates.findIndex(d => d.date === selectedDate) === 0}
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const dates = availableDates.map(d => d.date);
                        const idx = dates.findIndex(d => d === selectedDate);
                        setSelectedDate(dates[Math.min(dates.length - 1, idx + 1)]);
                      }}
                      disabled={availableDates.findIndex(d => d.date === selectedDate) === availableDates.length - 1}
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDate(availableDates[availableDates.length - 1].date)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Source Badge */}
                  <Badge variant="secondary" className="ml-2">
                    {selectedDateData?.sourceName || 'Sentinel-2'}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});
