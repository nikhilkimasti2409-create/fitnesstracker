import React from 'react';
import { useWorkoutStore, NavView } from '../../store/useWorkoutStore';

export const Header: React.FC = () => {
  const { currentView, setCurrentView } = useWorkoutStore();

  const navItems: { id: NavView; label: string; disabled?: boolean }[] = [
    { id: 'workouts', label: 'Workouts' },
    { id: 'live-trainer', label: 'Live Pushup Tracker' },
    { id: 'analytics', label: 'Analytics (Locked)', disabled: true },
    { id: 'activity-history', label: 'History (Locked)', disabled: true },
    { id: 'community', label: 'Community (Locked)', disabled: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1380px] mx-auto px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-xl">
          {/* Logo */}
          <button
            onClick={() => setCurrentView('workouts')}
            className="flex items-center gap-space-sm text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">vital_signs</span>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
              PulseFit
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-space-lg">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              if (item.disabled) {
                return (
                  <span
                    key={item.id}
                    className="font-label-lg text-label-lg text-outline/60 py-space-sm cursor-not-allowed select-none"
                    title="Feature temporarily disabled for pushup-focused testing"
                  >
                    {item.label}
                  </span>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`py-space-sm transition-all duration-200 ${
                    isActive
                      ? 'text-primary font-label-lg text-label-lg border-b-2 border-primary font-semibold'
                      : 'font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Header Utilities */}
        <div className="flex items-center gap-space-md">
          {/* Streak Badge */}
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)]">
            <span className="material-symbols-outlined text-primary text-body-lg">
              local_fire_department
            </span>
            <span className="font-label-md text-label-md text-on-surface font-bold">
              14 Day Streak
            </span>
          </div>

          {/* Notifications Button */}
          <button 
            title="Notifications"
            className="flex items-center justify-center p-space-xs rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-headline-md">notifications</span>
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary-fixed shadow-sm overflow-hidden text-secondary font-bold text-sm">
              AL
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
