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
  { id: 'dammam', name: 'Dammam' },
  { id: 'alkhobar', name: 'Al Khobar' },
  { id: 'hofuf', name: 'Al Hofuf' },
  { id: 'qatif', name: 'Qatif' },
  { id: 'jubail', name: 'Al Jubail' }
];

const weatherIcons: Record<string, React.ElementType> = {
  'Sunny': Sun,
  'Partly Cloudy': Cloud,
  'Cloudy': Cloud,
  'Light Rain': CloudRain,
  'Thunderstorm': CloudLightning
};

function getWeatherIcon(condition: string): React.ElementType {
  return weatherIcons[condition] || Sun;
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
  const WeatherIcon = weatherIcons[current.condition] || Sun;

  return (
    <Card
      ref={sectionRef}
      className={`border border-gray-200 overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Cloud className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Weather</h3>
              <p className="text-xs text-gray-500">Agricultural forecasts</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-7 w-7"
          >
            <RefreshCw className={`w-3 h-3 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="p-3">
        {/* Location Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between mb-3 h-8 text-xs">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{selectedLocation.name}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
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
        <div className="text-center mb-4">
          <div className={`inline-flex p-2 rounded-xl mb-2 ${getWeatherColor(current.condition)}`}>
            <WeatherIcon className="w-8 h-8" />
          </div>
          <div className="flex items-start justify-center gap-1">
            <span className="text-3xl font-bold text-gray-900">{current.temperature}</span>
            <span className="text-lg text-gray-500 mt-0.5">°C</span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{current.condition}</p>
          <p className="text-xs text-gray-400">
            Feels like {current.temperature + 2}°C
          </p>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <Droplets className="w-3 h-3 text-blue-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900">{current.humidity}%</p>
            <p className="text-xs text-gray-400">Humidity</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <Wind className="w-3 h-3 text-cyan-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900">{current.windSpeed}</p>
            <p className="text-xs text-gray-400">km/h</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <Umbrella className="w-3 h-3 text-purple-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900">{current.precipitation}</p>
            <p className="text-xs text-gray-400">mm</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <Sun className="w-3 h-3 text-amber-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900">{current.uvIndex}</p>
            <p className="text-xs text-gray-400">UV</p>
          </div>
        </div>

        {/* Agricultural Metrics */}
        <div className="p-2 bg-green-50 rounded-lg mb-3">
          <p className="text-xs font-medium text-green-700 mb-1.5">Agricultural Metrics</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Evapotranspiration</span>
              <span className="font-medium text-gray-900">4.2 mm/day</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Soil Temp</span>
              <span className="font-medium text-gray-900">26°C</span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-700">5-Day Forecast</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-xs h-6 px-2"
            >
              {expanded ? 'Less' : 'More'}
            </Button>
          </div>

          <div className="space-y-1">
            {forecast.slice(0, expanded ? 5 : 3).map((day, index) => {
              const DayIcon = getWeatherIcon(day.condition);
              const date = new Date(day.date);
              const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DayIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700 w-10">{dayName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900 w-6 text-right">{day.high}°</span>
                    <span className="text-xs text-gray-400 w-6 text-right">{day.low}°</span>
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
