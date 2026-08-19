import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { EmptyState } from '../ui/EmptyState';
import { Bell, AlertTriangle, CloudRain, Bug, Droplets, CheckCircle2 } from 'lucide-react';

export const AlertCenter: React.FC = () => {
  const { selectedFarm, alerts, markAlertRead, setCurrentView, showToast } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const unreadCount = alerts.filter(a => !a.read).length;

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const handleMarkAllRead = () => {
    alerts.forEach(a => markAlertRead(a.id));
    showToast('All alerts marked as read', 'info');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'Alert Center' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Bell className="w-6 h-6 text-amber-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">Farm Intelligence Alert Center</h1>
            <Badge variant="warning">{selectedFarm.name}</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Real-time automated warnings triggered by weather forecasts, satellite stress drops, and disease risks.
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={CheckCircle2} onClick={handleMarkAllRead}>
          Mark All Read
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Active Alerts"
          value={alerts.length}
          subtitle="Farm Threshold Triggers"
          icon={Bell}
          iconColor="text-amber-400"
        />

        <StatCard
          title="Unread Alerts"
          value={unreadCount}
          subtitle="Action Pending"
          change={unreadCount > 0 ? `${unreadCount} Unread` : 'All Clear'}
          changeType={unreadCount > 0 ? 'negative' : 'positive'}
          icon={AlertTriangle}
          iconColor="text-red-400"
        />

        <StatCard
          title="Monitored Conditions"
          value="4 Engines"
          subtitle="Weather, Stress, Disease, Water"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Category Tabs Filter */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Alerts', badge: alerts.length },
          { id: 'weather', label: 'Weather Alerts' },
          { id: 'disease', label: 'Disease Risk' },
          { id: 'irrigation', label: 'Water & Soil' },
          { id: 'stress', label: 'Canopy Stress' }
        ]}
        activeTab={filter}
        onChange={(id) => setFilter(id)}
      />

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <EmptyState
            title="No Alerts Found"
            description={`No active alerts under the "${filter}" category for ${selectedFarm.name}.`}
            icon={CheckCircle2}
          />
        ) : (
          filteredAlerts.map((alt) => (
            <Card
              key={alt.id}
              className={`cursor-pointer transition-all ${
                alt.severity === 'critical'
                  ? 'border-red-800/60 bg-red-950/20 hover:border-red-500'
                  : 'hover:border-emerald-500/50'
              }`}
              bodyClassName="p-4 flex items-start space-x-3"
              onClick={() => {
                markAlertRead(alt.id);
                if (alt.actionUrl) setCurrentView(alt.actionUrl);
              }}
            >
              <div className="p-2.5 rounded-xl bg-[#18261e] border border-[#294233] shrink-0 mt-0.5">
                {alt.type === 'weather' ? <CloudRain className="w-5 h-5 text-amber-400" /> :
                 alt.type === 'disease' ? <Bug className="w-5 h-5 text-red-400" /> :
                 alt.type === 'irrigation' ? <Droplets className="w-5 h-5 text-teal-400" /> :
                 <AlertTriangle className="w-5 h-5 text-yellow-400" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white">{alt.title}</h3>
                    {!alt.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">{alt.timestamp}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{alt.message}</p>

                <div className="pt-2 flex items-center justify-between">
                  {!alt.read ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAlertRead(alt.id);
                        showToast(`Alert "${alt.title}" marked as read`, 'info');
                      }}
                      className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Read</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-gray-500" />
                      <span>Read</span>
                    </span>
                  )}

                  {alt.actionUrl && (
                    <Button size="sm" variant="ghost" className="text-emerald-400">
                      Open Module →
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
