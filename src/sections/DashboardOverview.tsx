import { useEffect, useRef, useState } from 'react';
import { 
  Map, 
  Heart, 
  Droplets, 
  Satellite,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { kpiData } from '@/data/mockData';

interface KPICardProps {
  title: string;
  value: string;
  unit: string;
  trend: number;
  trendLabel: string;
  icon: string;
  sparklineData: number[];
  status: 'positive' | 'negative' | 'neutral' | 'warning';
  delay: number;
}

const iconMap: Record<string, React.ElementType> = {
  Map,
  Heart,
  Droplets,
  Satellite
};

const statusColors = {
  positive: 'text-green-600 bg-green-50 border-green-200',
  negative: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-amber-600 bg-amber-50 border-amber-200',
  neutral: 'text-gray-600 bg-gray-50 border-gray-200'
};

const trendIcons = {
  positive: TrendingUp,
  negative: TrendingDown,
  warning: TrendingDown,
  neutral: Minus
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-3" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill={`url(#gradient-${color})`}
        points={`0,100 ${points} 100,100`}
      />
    </svg>
  );
}

function KPICard({ title, value, unit, trend, trendLabel, icon, sparklineData, status, delay }: KPICardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[icon] || Map;
  const TrendIcon = trendIcons[status];
  const trendColor = status === 'positive' ? 'text-green-600' : status === 'negative' ? 'text-red-600' : status === 'warning' ? 'text-amber-600' : 'text-gray-600';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      // Animate number counting
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const duration = 1500;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(current.toFixed(value.includes('.') ? 1 : 0));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div
      ref={cardRef}
      className={`
        opacity-0 transform translate-y-5
        ${isVisible ? 'animate-fade-in-up' : ''}
      `}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <Card className="p-2.5 card-hover border border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className={`p-1.5 rounded-lg ${statusColors[status]}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-0.5">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg lg:text-xl font-bold text-gray-900">
              {displayValue}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>

        <div className="mb-2 h-8 overflow-hidden">
          <Sparkline
            data={sparklineData}
            color={status === 'positive' ? '#22c55e' : status === 'negative' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#6b7280'}
          />
        </div>

        <p className="text-xs text-gray-400">{trendLabel}</p>
      </Card>
    </div>
  );
}

export function DashboardOverview() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Drought monitoring and early warning across Saudi Arabia</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated:</span>
          <span className="font-medium text-gray-700">Just now</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            {...kpi}
            delay={index}
          />
        ))}
      </div>
    </section>
  );
}
