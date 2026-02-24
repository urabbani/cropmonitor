import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Radar, 
  Scan, 
  Telescope, 
  Orbit,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { satelliteSources } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Radar,
  Scan,
  Telescope,
  Orbit
};

const statusConfig = {
  active: { 
    label: 'Active', 
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle2,
    pulse: true
  },
  delayed: { 
    label: 'Delayed', 
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: AlertCircle,
    pulse: false
  },
  offline: { 
    label: 'Offline', 
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle,
    pulse: false
  }
};

interface SatelliteCardProps {
  source: typeof satelliteSources[0];
  onClick: () => void;
  delay: number;
}

function SatelliteCard({ source, onClick, delay }: SatelliteCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[source.icon] || Globe;
  const status = statusConfig[source.status];
  const StatusIcon = status.icon;

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

  return (
    <div
      ref={cardRef}
      className={`
        opacity-0 transform translate-y-5
        ${isVisible ? 'animate-fade-in-up' : ''}
      `}
      style={{ animationDelay: `${delay * 0.1}s` }}
      onClick={onClick}
    >
      <Card className="p-2 card-hover border border-gray-100 cursor-pointer">
        <div className="flex items-start justify-between mb-1">
          <div className={`p-1 rounded-md ${status.bgColor}`}>
            <Icon className={`w-3 h-3 ${status.color}`} />
          </div>
          <div className="flex items-center gap-0.5">
            {status.pulse && (
              <div className="relative">
                <div className={`w-1 h-1 rounded-full ${status.color.replace('text-', 'bg-')}`}></div>
                <div className={`absolute inset-0 w-1 h-1 rounded-full ${status.color.replace('text-', 'bg-')} animate-pulse-ring`}></div>
              </div>
            )}
            <Badge variant="outline" className={`text-[10px] px-1 py-0.5 ${status.bgColor} ${status.color} ${status.borderColor}`}>
              <StatusIcon className="w-2 h-2 mr-0.5" />
              {status.label}
            </Badge>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-0.5 text-xs leading-tight">{source.name}</h4>
        <p className="text-xs text-gray-500 mb-1 line-clamp-2">{source.description}</p>

        <div className="space-y-0.5 mb-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 text-[10px]">Res</span>
            <span className="font-medium text-gray-900 text-[10px]">{source.resolution}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 text-[10px]">Revisit</span>
            <span className="font-medium text-gray-900 text-[10px]">{source.revisitTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-center gap-0.5 text-xs text-gray-500">
            <Clock className="w-2 h-2" />
            <span className="text-[10px]">{source.lastUpdate}</span>
          </div>
          <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
        </div>
      </Card>
    </div>
  );
}

export function SatelliteSources() {
  const [selectedSource, setSelectedSource] = useState<typeof satelliteSources[0] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <section ref={sectionRef} className={`space-y-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Orbit className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Satellite Data Sources</h3>
            <p className="text-xs text-gray-500">Multi-source Earth Observation integration</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Status</span>
        </Button>
      </div>

      {/* Satellite Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {satelliteSources.map((source, index) => (
          <SatelliteCard
            key={source.id}
            source={source}
            onClick={() => setSelectedSource(source)}
            delay={index}
          />
        ))}
      </div>

      {/* Data Source Detail Dialog */}
      <Dialog open={!!selectedSource} onOpenChange={() => setSelectedSource(null)}>
        <DialogContent className="max-w-lg">
          {selectedSource && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${statusConfig[selectedSource.status].bgColor}`}>
                    {(() => {
                      const Icon = iconMap[selectedSource.icon] || Globe;
                      return <Icon className={`w-5 h-5 ${statusConfig[selectedSource.status].color}`} />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle className="text-lg">{selectedSource.name}</DialogTitle>
                    <DialogDescription>
                      <Badge variant="outline" className={`mt-1 ${statusConfig[selectedSource.status].bgColor} ${statusConfig[selectedSource.status].color}`}>
                        {statusConfig[selectedSource.status].label}
                      </Badge>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <p className="text-sm text-gray-600">{selectedSource.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Spatial Resolution</p>
                    <p className="font-semibold text-gray-900">{selectedSource.resolution}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Revisit Frequency</p>
                    <p className="font-semibold text-gray-900">{selectedSource.revisitTime}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Use Cases</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSource.useCases.map((useCase) => (
                      <Badge key={useCase} variant="secondary" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Last update: {selectedSource.lastUpdate}</span>
                  </div>
                  <Button size="sm" className="bg-primary-medium hover:bg-primary-dark">
                    View Data Catalog
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
