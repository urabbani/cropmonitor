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
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
      </div>
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-xl font-bold text-gray-900 mb-2">{value}</p>
      <Progress value={percentage} className="h-1.5 mb-1" />
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
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-xs text-gray-500">Crop trends and predictions</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>

        {/* Chart Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveChart('area')}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${activeChart === 'area' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            Crop Area Trends
          </button>
          <button
            onClick={() => setActiveChart('yield')}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${activeChart === 'yield' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            Yield Prediction
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Chart */}
        <div className="h-[250px] mb-6">
          {activeChart === 'area' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${value}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
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
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 6]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
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
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            title="Irrigation Eff."
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
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Monitored Area</span>
            <span className="font-semibold text-gray-900">2.84M hectares</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Expected Yield (Current Season)</span>
            <span className="font-semibold text-gray-900">4.5 t/ha</span>
          </div>
        </div>

        {/* View More Link */}
        <Button variant="ghost" className="w-full mt-4 text-primary-medium hover:text-primary-dark">
          View Detailed Analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
