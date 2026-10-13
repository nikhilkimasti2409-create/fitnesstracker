import React from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WorkoutSelectorView } from './components/workouts/WorkoutSelectorView';
import { AnalyticsDashboardView } from './components/analytics/AnalyticsDashboardView';
import { LiveWorkoutSessionView } from './components/pose/LiveWorkoutSessionView';
import { useWorkoutStore } from './store/useWorkoutStore';

export const App: React.FC = () => {
  const { currentView } = useWorkoutStore();

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary">
      {/* Top Fixed Header */}
      <Header />

      {/* Main Content View Container */}
      <main className="w-full pt-20 flex-1 bg-surface max-w-[1380px] mx-auto px-margin">
        {currentView === 'workouts' && <WorkoutSelectorView />}
        {currentView === 'live-trainer' && <LiveWorkoutSessionView />}
        {currentView === 'analytics' && <AnalyticsDashboardView />}
        {currentView === 'activity-history' && <AnalyticsDashboardView />}
        {currentView === 'community' && <WorkoutSelectorView />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
