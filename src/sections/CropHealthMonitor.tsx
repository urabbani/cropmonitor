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
      className={`p-4 border border-gray-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded-lg">
            <Activity className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Crop Health Monitor</h3>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{timeRanges.find(r => r.id === selectedTimeRange)?.label}</span>
              <ChevronDown className="w-3 h-3" />
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

      {/* Index Toggles */}
      <div className="flex flex-wrap gap-1.5 mb-4">
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
              flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all
              ${selectedIndices[index.id as keyof typeof selectedIndices]
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: index.color }}
            />
            {index.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[180px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              domain={[-0.2, 1]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                fontSize: '11px'
              }}
            />
            <Legend />
            {selectedIndices.ndvi && (
              <Line
                type="monotone"
                dataKey="NDVI"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {selectedIndices.evi && (
              <Line
                type="monotone"
                dataKey="EVI"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {selectedIndices.ndwi && (
              <Line
                type="monotone"
                dataKey="NDWI"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {selectedIndices.savi && (
              <Line
                type="monotone"
                dataKey="SAVI"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section: Health Distribution + Crop Cards Horizontal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health Distribution */}
        <div>
          <h4 className="font-semibold text-gray-900 text-xs mb-2">Health Distribution</h4>
          <div className="space-y-2">
            {analyticsData.healthDistribution.slice(0, 3).map((item, index) => {
              const config = healthStatusConfig[item.status.toLowerCase().includes('healthy') ? 'healthy' :
                                           item.status.toLowerCase().includes('moderate') ? 'moderate' : 'stressed'];
              return (
                <div
                  key={item.status}
                  className={`p-2 rounded-lg border ${config.borderColor} ${config.bgColor}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${config.textColor}`}>{item.status}</span>
                    <Badge variant="outline" className={`text-[10px] px-1 py-0 ${config.bgColor} ${config.textColor}`}>
                      {item.percentage}%
                    </Badge>
                  </div>
                  <Progress
                    value={item.percentage}
                    className="h-1"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Crop Health Cards - Horizontal */}
        <div className="lg:col-span-2">
          <h4 className="font-semibold text-gray-900 text-xs mb-2">Crop Health by Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {cropTypes.map((crop) => {
              const trendColor = crop.trend > 0 ? 'text-green-600' : crop.trend < 0 ? 'text-red-600' : 'text-gray-600';
              const TrendIcon = crop.trend > 0 ? TrendingUp : crop.trend < 0 ? TrendingDown : Minus;

              return (
                <div key={crop.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: crop.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-xs">{crop.name}</p>
                      <p className="text-xs text-gray-500">{(crop.area / 1000).toFixed(0)}k ha</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 justify-end">
                      <span className={`text-xs font-medium ${trendColor}`}>
                        {crop.trend > 0 ? '+' : ''}{crop.trend}%
                      </span>
                      <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                    </div>
                    <p className="text-xs text-gray-500">{crop.healthScore}% healthy</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
