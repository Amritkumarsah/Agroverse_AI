import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { actionPlanService } from '../../services/actionPlanService';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';
import { CalendarCheck, CheckCircle2, Clock } from 'lucide-react';

export const ActionPlan: React.FC = () => {
  const { selectedFarm, weatherData, soilData, satelliteData, showToast } = useApp();
  
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const dynamicPlan = actionPlanService.generate7DayPlan(selectedFarm, weatherData, soilData, satelliteData);
    setTasks(dynamicPlan.map(t => ({ ...t, completed: false })));
  }, [selectedFarm.id, weatherData, soilData]);

  const toggleTask = (index: number) => {
    setTasks(prev => prev.map((t, i) => i === index ? { ...t, completed: !t.completed } : t));
    const isComp = !tasks[index].completed;
    showToast(isComp ? `Task marked as complete for ${tasks[index].day}` : 'Task status updated', isComp ? 'success' : 'info');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: '7-Day Action Plan' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <CalendarCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">7-Day Agricultural Action Itinerary</h1>
            <Badge variant="success">{selectedFarm.name}</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Dynamic localized task itinerary generated for {selectedFarm.crop} ({selectedFarm.location}).
          </p>
        </div>
        <Badge variant="info">7 Days Planned</Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Scheduled Tasks"
          value={tasks.length}
          subtitle="7-Day Itinerary"
          icon={CalendarCheck}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Completed Tasks"
          value={`${completedCount} / ${tasks.length}`}
          subtitle={`${tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}% Execution`}
          change={completedCount > 0 ? 'In Progress' : 'Pending'}
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-teal-400"
        />

        <StatCard
          title="Immediate Priority"
          value={weatherData.aiImpact.irrigationAction.split(' ')[0]}
          subtitle="Day 1 High Priority"
          icon={Clock}
          iconColor="text-amber-400"
        />
      </div>

      {/* Action Plan Timeline */}
      <Card title={`7-Day Action Itinerary — ${selectedFarm.name}`} subtitle="Click any task item to toggle completion status">
        <div className="space-y-3">
          {tasks.map((item, index) => (
            <div 
              key={index}
              onClick={() => toggleTask(index)}
              className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                item.completed 
                  ? 'bg-emerald-950/30 border-emerald-800/40 text-gray-400 opacity-75' 
                  : index === 0 
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-100 ring-1 ring-amber-500/30' 
                  : 'bg-[#18261e] border-[#294233] text-gray-300 hover:border-emerald-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                item.completed 
                  ? 'bg-emerald-600 text-white' 
                  : index === 0 
                  ? 'bg-amber-500 text-white shadow' 
                  : 'bg-[#131e17] text-emerald-400 border border-[#23362a]'
              }`}>
                {item.completed ? <CheckCircle2 className="w-4 h-4" /> : `D${index + 1}`}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-extrabold text-sm ${item.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {item.day}
                  </span>
                  <Badge variant={index === 0 ? 'warning' : 'default'}>
                    {item.category}
                  </Badge>
                </div>
                <p className={`text-xs leading-relaxed ${item.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                  {item.task}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
