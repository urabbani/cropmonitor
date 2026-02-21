import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Layers,
  Satellite,
  TrendingUp,
  Download,
  Settings,
  Info,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw
} from 'lucide-react';
import {
  availableSatelliteDates,
  indexResults,
  generateHistogramData,
  temporalComparisons
} from '@/data/mockData';
import {
  vegetationIndices,
  getIndexConfig,
  getColorScaleGradient
} from '@/lib/satelliteUtils';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SatelliteImageryViewerProps {}

// Map bounds component
function MapBoundsFitter({ bounds }: { bounds: [[number, number], [number, number], [number, number], [number, number]] }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds([[bounds[0][0], bounds[0][1]], [bounds[2][0], bounds[2][1]]] as [[number, number], [number, number]]);
  }, [map, bounds]);

  return null;
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

// Change Map Component
function ChangeMapChart({ data }: { data: Array<{ category: string; value: number; area: number; color: string }> }) {
  return (
    <div className="h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            type="number"
            stroke="#9ca3af"
            fontSize={10}
            tickLine={false}
            tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
          />
          <YAxis
            type="category"
            dataKey="category"
            stroke="#9ca3af"
            fontSize={9}
            tickLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '11px'
            }}
            formatter={(value: number, name: string, props: any) => {
              if (name === 'value') return [`${value > 0 ? '+' : ''}${value}%`, 'Change'];
              if (name === 'area') return [`${(props.payload.area / 1000000).toFixed(2)}M ha`, 'Area'];
              return [value, name];
            }}
          />
          <Bar dataKey="value" radius={[0, 2, 2, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SatelliteImageryViewer({}: SatelliteImageryViewerProps) {
  const [selectedDate, setSelectedDate] = useState('2025-01-26');
  const [selectedIndex, setSelectedIndex] = useState('ndvi');
  const [viewMode, setViewMode] = useState<'single' | 'comparison'>('single');
  const [comparisonDate, setComparisonDate] = useState('2025-01-15');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const sindhBounds: [[number, number], [number, number], [number, number], [number, number]] = [
    [23.7, 66.9],
    [23.7, 71.2],
    [28.5, 71.2],
    [28.5, 66.9]
  ];

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play through dates
  useEffect(() => {
    if (!isPlaying) return;

    const availableDates = availableSatelliteDates.filter(d => d.available).map(d => d.date);
    const currentIndex = availableDates.indexOf(selectedDate);

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % availableDates.length;
      setSelectedDate(availableDates[nextIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedDate]);

  const availableDates = availableSatelliteDates.filter(d => d.available);
  const selectedDateData = availableSatelliteDates.find(d => d.date === selectedDate);
  const indexConfig = getIndexConfig(selectedIndex);
  const currentResult = indexResults[selectedDate as keyof typeof indexResults]?.[selectedIndex as keyof typeof indexResults['2025-01-26']];
  const histogramData = currentResult ? generateHistogramData(currentResult.mean, currentResult.stdDev) : [];

  const comparisonResult = indexResults[comparisonDate as keyof typeof indexResults]?.[selectedIndex as keyof typeof indexResults['2025-01-15']];
  const changePercentage = currentResult && comparisonResult
    ? ((currentResult.mean - comparisonResult.mean) / comparisonResult.mean) * 100
    : 0;

  return (
    <section ref={sectionRef} className={`space-y-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Satellite className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Satellite Imagery Analysis</h3>
            <p className="text-xs text-gray-500">Multi-temporal vegetation index visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'single' | 'comparison')}>
            <TabsList>
              <TabsTrigger value="single" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Single Date</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-gray-200">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-4 p-4 border-b border-gray-100 bg-gray-50">
          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[150px]">
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
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-500" />
            <Select value={selectedIndex} onValueChange={setSelectedIndex}>
              <SelectTrigger className="w-[140px]">
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

          {/* Timeline Controls */}
          <div className="flex items-center gap-1 ml-auto">
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
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
        </div>

        <div className="flex">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-80 bg-white border-r border-gray-100 p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {/* Current Selection Info */}
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
            </div>
          )}

          {/* Map Area */}
          <div className="flex-1 relative">
            <MapContainer
              center={[26.5, 68.8]}
              zoom={7}
              className="h-[500px] w-full"
            >
              <MapBoundsFitter bounds={sindhBounds} />
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Simulated index overlay */}
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
                bounds={sindhBounds}
                opacity={0.6}
              />
            </MapContainer>
          </div>
        </div>
      </Card>

      {/* Temporal Comparison Panel */}
      {viewMode === 'comparison' && (
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-gray-500">Baseline Date</label>
                <Select value={comparisonDate} onValueChange={setComparisonDate}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDates.map((date) => (
                      <SelectItem key={date.date} value={date.date}>
                        {date.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-gray-400">vs</span>
              <div>
                <label className="text-xs text-gray-500">Current Date</label>
                <div className="text-sm font-medium">{selectedDate}</div>
              </div>
            </div>
            <Badge variant={changePercentage >= 0 ? 'default' : 'destructive'}>
              {changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(1)}% {indexConfig?.name}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Change Map */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Change Distribution</h4>
              <ChangeMapChart data={temporalComparisons[0].changeMap} />
            </div>

            {/* Comparison Stats */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Comparison Summary</h4>
              {comparisonResult && currentResult && (
                <>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-600">Declining Areas</span>
                    <span className="font-semibold text-red-600">385K ha</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Stable Areas</span>
                    <span className="font-semibold text-gray-600">1.85M ha</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Improving Areas</span>
                    <span className="font-semibold text-green-600">545K ha</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
