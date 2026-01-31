import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning,
  Droplets,
  Wind,
  RefreshCw,
  MapPin,
  ChevronDown,
  Umbrella
} from 'lucide-react';
import { weatherData } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const locations = [
  { id: 'hyderabad', name: 'Hyderabad' },
  { id: 'karachi', name: 'Karachi' },
  { id: 'sukkur', name: 'Sukkur' },
  { id: 'larkana', name: 'Larkana' },
  { id: 'mirpurkhas', name: 'Mirpurkhas' }
];

const weatherIcons: Record<string, React.ElementType> = {
  'Sunny': Sun,
  'Partly Cloudy': Cloud,
  'Cloudy': Cloud,
  'Light Rain': CloudRain,
  'Thunderstorm': CloudLightning
};

interface WeatherIconProps {
  condition: string;
  className?: string;
}

// Component declared outside render to satisfy react-hooks/static-components
function WeatherIconComponent({ condition, className }: WeatherIconProps) {
  const IconComponent = weatherIcons[condition] || Sun;
  return <IconComponent className={className} />;
}

function getWeatherColor(condition: string): string {
  switch (condition) {
    case 'Sunny': return 'text-amber-500 bg-amber-50';
    case 'Partly Cloudy': return 'text-blue-500 bg-blue-50';
    case 'Cloudy': return 'text-gray-500 bg-gray-50';
    case 'Light Rain': return 'text-cyan-500 bg-cyan-50';
    case 'Thunderstorm': return 'text-purple-500 bg-purple-50';
    default: return 'text-amber-500 bg-amber-50';
  }
}

export function WeatherWidget() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const { current, forecast } = weatherData;

  return (
    <Card 
      ref={sectionRef}
      className={`border border-gray-200 overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Weather</h3>
              <p className="text-xs text-gray-500">Agricultural forecasts</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="p-4">
        {/* Location Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{selectedLocation.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {locations.map((location) => (
              <DropdownMenuItem
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="cursor-pointer"
              >
                {location.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Main Weather Display */}
        <div className="text-center mb-6">
          <div className={`inline-flex p-4 rounded-2xl mb-3 ${getWeatherColor(current.condition)}`}>
            <WeatherIconComponent condition={current.condition} className="w-12 h-12" />
          </div>
          <div className="flex items-start justify-center gap-1">
            <span className="text-5xl font-bold text-gray-900">{current.temperature}</span>
            <span className="text-2xl text-gray-500 mt-1">°C</span>
          </div>
          <p className="text-lg text-gray-600 mt-1">{current.condition}</p>
          <p className="text-sm text-gray-400">
            Feels like {current.temperature + 2}°C
          </p>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500">Humidity</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{current.humidity}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="w-4 h-4 text-cyan-500" />
              <span className="text-xs text-gray-500">Wind</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{current.windSpeed} km/h</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Umbrella className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-500">Precipitation</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{current.precipitation} mm</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-gray-500">UV Index</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{current.uvIndex}/10</p>
          </div>
        </div>

        {/* Agricultural Metrics */}
        <div className="p-3 bg-green-50 rounded-xl mb-4">
          <p className="text-xs font-medium text-green-700 mb-2">Agricultural Metrics</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Evapotranspiration</span>
              <span className="font-medium text-gray-900">4.2 mm/day</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Soil Temperature</span>
              <span className="font-medium text-gray-900">26°C</span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">5-Day Forecast</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
              className="text-xs"
            >
              {expanded ? 'Show Less' : 'Show More'}
            </Button>
          </div>
          
          <div className="space-y-2">
            {forecast.slice(0, expanded ? 5 : 3).map((day, index) => {
              const date = new Date(day.date);
              const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <WeatherIconComponent condition={day.condition} className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 w-12">{dayName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-gray-500">{day.precipitationChance}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{day.high}°</span>
                      <span className="text-sm text-gray-400">{day.low}°</span>
                    </div>
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
