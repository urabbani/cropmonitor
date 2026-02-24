import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  X,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import type { Alert } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (alertId: string) => void;
  onRead: (alertId: string) => void;
}

type FilterType = 'all' | 'critical' | 'warning' | 'info';

const severityConfig = {
  critical: {
    label: 'Critical',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-700'
  },
  warning: {
    label: 'Warning',
    icon: AlertCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700'
  },
  info: {
    label: 'Info',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-700'
  }
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function AlertCard({
  alert,
  onDismiss,
  onRead,
  onClick
}: {
  alert: Alert;
  onDismiss: () => void;
  onRead: () => void;
  onClick: () => void;
}) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div
      className={`
        group relative p-2.5 rounded-lg border transition-all cursor-pointer
        ${alert.read ? 'bg-gray-50 border-gray-100' : `${config.bgColor} ${config.borderColor}`}
        hover:shadow-md
      `}
      onClick={() => {
        onRead();
        onClick();
      }}
    >
      {!alert.read && (
        <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
      )}

      <div className="flex items-start gap-2 pr-4">
        <div className={`p-1.5 rounded ${config.bgColor} shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Badge variant="outline" className={`text-[10px] px-1 py-0 ${config.badgeColor}`}>
              {config.label}
            </Badge>
            <span className="text-xs text-gray-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>

          <h4 className={`font-medium text-xs mb-0.5 ${alert.read ? 'text-gray-600' : 'text-gray-900'} leading-tight`}>
            {alert.title}
          </h4>

          <p className="text-xs text-gray-500 line-clamp-1 mb-1">
            {alert.description}
          </p>

          <div className="flex items-center gap-0.5 text-xs text-gray-400">
            <MapPin className="w-2.5 h-2.5" />
            <span className="truncate">{alert.location}</span>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="absolute top-1.5 right-1.5 p-0.5 rounded hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-2.5 h-2.5 text-gray-400" />
      </button>
    </div>
  );
}

export function AlertsPanel({ alerts, onDismiss, onRead }: AlertsPanelProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
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

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.read).length;

  return (
    <Card
      ref={sectionRef}
      className={`border border-gray-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <Bell className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Alerts</h3>
              <p className="text-xs text-gray-500">
                {unreadCount} unread {criticalCount > 0 && `(${criticalCount} critical)`}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All', count: alerts.filter(a => !a.read).length },
            { id: 'critical', label: 'Critical', count: alerts.filter(a => a.severity === 'critical' && !a.read).length },
            { id: 'warning', label: 'Warning', count: alerts.filter(a => a.severity === 'warning' && !a.read).length },
            { id: 'info', label: 'Info', count: alerts.filter(a => a.severity === 'info' && !a.read).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterType)}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all
                ${filter === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`
                  px-1 py-0 rounded-full text-[9px]
                  ${filter === tab.id ? 'bg-white/20' : 'bg-gray-200'}
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <ScrollArea className="h-[280px]">
        <div className="p-3 space-y-2">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className="animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AlertCard
                  alert={alert}
                  onDismiss={() => onDismiss(alert.id)}
                  onRead={() => onRead(alert.id)}
                  onClick={() => setSelectedAlert(alert)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No alerts</p>
              <p className="text-xs text-gray-400">You're all caught up!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <Button variant="outline" className="w-full text-xs h-8">
          View All Alerts
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {/* Alert Detail Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-lg">
          {selectedAlert && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${severityConfig[selectedAlert.severity].bgColor}`}>
                    {(() => {
                      const Icon = severityConfig[selectedAlert.severity].icon;
                      return <Icon className={`w-5 h-5 ${severityConfig[selectedAlert.severity].color}`} />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle className="text-base">{selectedAlert.title}</DialogTitle>
                    <DialogDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={severityConfig[selectedAlert.severity].badgeColor}>
                          {severityConfig[selectedAlert.severity].label}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(selectedAlert.timestamp)}
                        </span>
                      </div>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <p className="text-sm text-gray-600">{selectedAlert.description}</p>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedAlert.location}</span>
                  </div>
                </div>

                {selectedAlert.coordinates && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Coordinates</p>
                    <p className="font-mono text-sm text-gray-700">
                      {selectedAlert.coordinates[0].toFixed(4)}, {selectedAlert.coordinates[1].toFixed(4)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-primary-medium hover:bg-primary-dark text-sm">
                    View on Map
                  </Button>
                  <Button variant="outline" className="flex-1 text-sm">
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
