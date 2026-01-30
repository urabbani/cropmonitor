import { useState, useRef, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { vegetationIndexData, cropTypes, analyticsData } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const timeRanges = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '3m', label: '3 Months' },
  { id: '1y', label: '1 Year' }
];

const healthStatusConfig = {
  healthy: { 
    label: 'Healthy', 
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  moderate: { 
    label: 'Moderate Stress', 
    color: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  stressed: { 
    label: 'High Stress', 
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
};

function HealthDistributionCard() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} className={`space-y-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <h4 className="font-semibold text-gray-900">Health Distribution</h4>
      <div className="space-y-4">
        {analyticsData.healthDistribution.map((item, index) => {
          const config = healthStatusConfig[item.status.toLowerCase().includes('healthy') ? 'healthy' : 
                                           item.status.toLowerCase().includes('moderate') ? 'moderate' : 'stressed'];
          return (
            <div 
              key={item.status} 
              className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${config.textColor}`}>{item.status}</span>
                <Badge variant="outline" className={config.bgColor + ' ' + config.textColor}>
                  {item.percentage}%
                </Badge>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {(item.area / 1000000).toFixed(2)}M hectares
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CropHealthCard({ crop }: { crop: typeof cropTypes[0] }) {
  const trendColor = crop.trend > 0 ? 'text-green-600' : crop.trend < 0 ? 'text-red-600' : 'text-gray-600';
  const TrendIcon = crop.trend > 0 ? TrendingUp : crop.trend < 0 ? TrendingDown : Minus;
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 rounded"
          style={{ backgroundColor: crop.color }}
        />
        <div>
          <p className="font-medium text-gray-900">{crop.name}</p>
          <p className="text-xs text-gray-500">{(crop.area / 1000).toFixed(0)}k ha</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 justify-end">
          <span className={`text-sm font-medium ${trendColor}`}>
            {crop.trend > 0 ? '+' : ''}{crop.trend}%
          </span>
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
        </div>
        <p className="text-xs text-gray-500">{crop.healthScore}% healthy</p>
      </div>
    </div>
  );
}

export function CropHealthMonitor() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedIndices, setSelectedIndices] = useState({
    ndvi: true,
    evi: true,
    ndwi: false,
    savi: false
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const chartData = vegetationIndexData.map(d => ({
    date: d.date.slice(5),
    NDVI: d.ndvi,
    EVI: d.evi,
    NDWI: d.ndwi,
    SAVI: d.savi
  }));

  return (
    <Card 
      ref={sectionRef}
      className={`p-5 border border-gray-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Crop Health Monitor</h3>
            <p className="text-xs text-gray-500">Vegetation indices and stress analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{timeRanges.find(r => r.id === selectedTimeRange)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {timeRanges.map((range) => (
                <DropdownMenuItem
                  key={range.id}
                  onClick={() => setSelectedTimeRange(range.id)}
                  className="text-sm cursor-pointer"
                >
                  {range.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-3">
          {/* Index Toggles */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'ndvi', label: 'NDVI', color: '#22c55e' },
              { id: 'evi', label: 'EVI', color: '#3b82f6' },
              { id: 'ndwi', label: 'NDWI', color: '#06b6d4' },
              { id: 'savi', label: 'SAVI', color: '#f59e0b' }
            ].map((index) => (
              <button
                key={index.id}
                onClick={() => setSelectedIndices(prev => ({
                  ...prev,
                  [index.id]: !prev[index.id as keyof typeof prev]
                }))}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${selectedIndices[index.id as keyof typeof selectedIndices]
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: index.color }}
                />
                {index.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  domain={[-0.2, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                {selectedIndices.ndvi && (
                  <Line
                    type="monotone"
                    dataKey="NDVI"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {selectedIndices.evi && (
                  <Line
                    type="monotone"
                    dataKey="EVI"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {selectedIndices.ndwi && (
                  <Line
                    type="monotone"
                    dataKey="NDWI"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {selectedIndices.savi && (
                  <Line
                    type="monotone"
                    dataKey="SAVI"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          <HealthDistributionCard />
          
          {/* Crop-Specific Health */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Crop Health by Type</h4>
            <div className="space-y-2">
              {cropTypes.map((crop) => (
                <CropHealthCard key={crop.id} crop={crop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
