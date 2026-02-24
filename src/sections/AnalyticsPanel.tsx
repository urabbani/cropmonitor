import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Sprout,
  Droplets,
  Bug,
  Download,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  Line
} from 'recharts';
import { analyticsData } from '@/data/mockData';

function MetricCard({
  title,
  value,
  target,
  icon: Icon,
  trend,
  color
}: {
  title: string;
  value: string;
  target: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}) {
  const percentage = parseInt(value);

  return (
    <div className="p-2 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between mb-1">
        <div className={`p-1 rounded ${color}`}>
          <Icon className="w-3 h-3" />
        </div>
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
      </div>
      <p className="text-xs text-gray-500 mb-0.5 truncate">{title}</p>
      <p className="text-sm font-bold text-gray-900 mb-1">{value}</p>
      <Progress value={percentage} className="h-1 mb-0.5" />
      <p className="text-xs text-gray-400">Target: {target}</p>
    </div>
  );
}

export function AnalyticsPanel() {
  const [activeChart, setActiveChart] = useState<'area' | 'yield'>('area');
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

  // Crop area trends data
  const areaTrendData = analyticsData.cropAreaTrends.map(d => ({
    year: d.year.toString(),
    Wheat: d.wheat / 1000,
    Rice: d.rice / 1000,
    Cotton: d.cotton / 1000,
    Sugarcane: d.sugarcane / 1000
  }));

  // Yield prediction data
  const yieldData = analyticsData.yieldPredictions.map(d => ({
    month: d.month,
    predicted: d.predicted,
    actual: d.actual,
    lower: d.confidence[0],
    upper: d.confidence[1]
  }));

  return (
    <Card
      ref={sectionRef}
      className={`border border-gray-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Analytics</h3>
              <p className="text-xs text-gray-500">Crop trends & predictions</p>
            </div>
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Download className="w-3 h-3" />
          </Button>
        </div>

        {/* Chart Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveChart('area')}
            className={`
              px-2 py-1 rounded-md text-xs font-medium transition-all
              ${activeChart === 'area'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            Area Trends
          </button>
          <button
            onClick={() => setActiveChart('yield')}
            className={`
              px-2 py-1 rounded-md text-xs font-medium transition-all
              ${activeChart === 'yield'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            Yield
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* Chart */}
        <div className="h-[180px] mb-4">
          {activeChart === 'area' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="year"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => `${value}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    fontSize: '11px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(0)}k ha`, '']}
                />
                <Bar dataKey="Wheat" stackId="a" fill="#eab308" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Rice" stackId="a" fill="#22d3ee" />
                <Bar dataKey="Cotton" stackId="a" fill="#e2e8f0" />
                <Bar dataKey="Sugarcane" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d8a57" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2d8a57" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 6]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    fontSize: '11px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)} t/ha`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill="url(#colorConfidence)"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="none"
                  fill="white"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#2d8a57"
                  strokeWidth={2}
                  dot={{ fill: '#2d8a57', strokeWidth: 0, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#eab308"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#eab308', strokeWidth: 0, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <MetricCard
            title="Irrigation"
            value="73%"
            target="80%"
            icon={Droplets}
            trend="up"
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard
            title="Drought Risk"
            value="42%"
            target="30%"
            icon={Sprout}
            trend="down"
            color="bg-amber-100 text-amber-600"
          />
          <MetricCard
            title="Pest Risk"
            value="21%"
            target="25%"
            icon={Bug}
            trend="up"
            color="bg-green-100 text-green-600"
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Total Area</span>
            <span className="font-semibold text-gray-900">2.84M ha</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-gray-500">Expected Yield</span>
            <span className="font-semibold text-gray-900">4.5 t/ha</span>
          </div>
        </div>

        {/* View More Link */}
        <Button variant="ghost" className="w-full mt-3 text-xs text-primary-medium py-1">
          View Detailed Analytics
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
