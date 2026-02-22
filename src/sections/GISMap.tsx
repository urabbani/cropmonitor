import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, LayerGroup, CircleMarker, useMap } from 'react-leaflet';
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
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sampleFields, districts } from '@/data/mockData';
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

interface GISMapProps {
  onFieldSelect: (field: FieldData) => void;
}

// Map bounds fitter component
function MapBoundsFitter() {
  const map = useMap();
  
  useEffect(() => {
    // Fit to Sindh Province bounds
    const sindhBounds = L.latLngBounds(
      [23.7, 66.9], // Southwest
      [28.5, 71.2]  // Northeast
    );
    map.fitBounds(sindhBounds, { padding: [20, 20] });
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
    'Wheat': '#eab308',
    'Rice': '#22d3ee',
    'Cotton': '#e2e8f0',
    'Sugarcane': '#16a34a'
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

export function GISMap({ onFieldSelect }: GISMapProps) {
  const [activeLayers, setActiveLayers] = useState({
    ndvi: true,
    crops: true,
    moisture: false,
    temperature: false,
    stress: false
  });
  const [baseLayer, setBaseLayer] = useState('osm');
  const [selectedDate, setSelectedDate] = useState('2025-01-26');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Timeline dates
  const timelineDates = useMemo(() => ['2025-01-20', '2025-01-22', '2025-01-24', '2025-01-26'], []);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(3);

  // Auto-play timeline
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimelineIndex((prev) => {
          const next = (prev + 1) % timelineDates.length;
          setSelectedDate(timelineDates[next]);
          return next;
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timelineDates]);

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

  return (
    <Card className="overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-pale rounded-lg">
            <Layers className="w-5 h-5 text-primary-dark" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">GIS Map View</h3>
            <p className="text-xs text-gray-500">Sindh Province, Pakistan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search Location</span>
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
        {/* Layer Controls Sidebar */}
        {sidebarOpen && (
          <div className="w-72 bg-white border-r border-gray-100 p-4 space-y-4 max-h-[600px] overflow-y-auto">
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
                    { name: 'Wheat', color: '#eab308' },
                    { name: 'Rice', color: '#22d3ee' },
                    { name: 'Cotton', color: '#e2e8f0', border: true },
                    { name: 'Sugarcane', color: '#16a34a' }
                  ].map((crop) => (
                    <div key={crop.name} className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 rounded ${crop.border ? 'border border-gray-300' : ''}`}
                        style={{ backgroundColor: crop.color }}
                      />
                      <span className="text-sm text-gray-600">{crop.name}</span>
                    </div>
                  ))}
                </div>
              </div>
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
            center={[26.5, 68.8]}
            zoom={7}
            className="h-[500px] lg:h-[600px] w-full"
            ref={mapRef}
          >
            <MapBoundsFitter />
            
            <TileLayer
              attribution={baseLayer === 'osm' ? '© OpenStreetMap contributors' : '© Esri'}
              url={baseLayerUrls[baseLayer]}
            />

            {/* District Boundaries */}
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

            {/* Field Polygons */}
            {(activeLayers.ndvi || activeLayers.crops) && (
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
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
