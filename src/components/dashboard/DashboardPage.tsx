import React from 'react';
import { MetricCards } from './MetricCards';
import { ProjectProgress } from './ProjectProgress';
import { RecentActivities } from './RecentActivities';
import { TeamOverview } from './TeamOverview';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <MetricCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectProgress />
        <TeamOverview />
      </div>
      
      <RecentActivities />
    </div>
  );
}