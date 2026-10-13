import React, { useState } from 'react';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { EXERCISES } from '../../data/exerciseData';
import { ExerciseType } from '../../types/fitness';
import { CameraPoseDetector } from '../pose/CameraPoseDetector';

export const WorkoutSelectorView: React.FC = () => {
  const {
    telemetry,
    selectedExercise,
    setSelectedExercise,
    setCurrentView,
    isCameraActive,
    setCameraActive,
    isCalibrated,
    calibratePose,
    startSession,
  } = useWorkoutStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'beginner' | 'advanced' | 'chest'>('all');
  const [showLiveDock, setShowLiveDock] = useState(true);
  const [calibrating, setCalibrating] = useState(false);

  const completionPct = Math.round((telemetry.todayReps / telemetry.dailyTarget) * 100);

  const handleStartExercise = (exerciseId: ExerciseType) => {
    setSelectedExercise(exerciseId);
    startSession();
    setCurrentView('live-trainer');
  };

  const handleCalibrateClick = () => {
    setCalibrating(true);
    calibratePose();
    setTimeout(() => {
      setCalibrating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Greeting & Biometric Momentum Deck */}
      <section className="relative w-full pt-space-lg pb-space-xl overflow-hidden">
        {/* Ambient Luminous Gradient Glow */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-12 right-0 w-80 h-80 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Left: Narrative & Status Core */}
          <div className="lg:col-span-7 flex flex-col space-y-space-md">
            {/* Live Routine Pill */}
            <div className="inline-flex items-center gap-space-sm self-start px-space-md py-space-xs rounded-full bg-surface-container-low shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                Session Ready
              </span>
              <span className="text-outline-variant font-label-md">•</span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Kinetic Pose Engine v2.4
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
              Ready for your workout, <span className="text-primary font-display-lg">Alex?</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Precision form tracking & daily pushup progressions tuned to your recovery score.
            </p>

            {/* Kinetic Progress Capsule */}
            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03),0_2px_6px_-1px_rgba(15,23,42,0.02)] max-w-lg mt-space-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-headline-md">adjust</span>
                  <span className="font-label-lg text-label-lg text-on-surface">
                    Daily Target: {telemetry.dailyTarget} Reps
                  </span>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold">
                  {telemetry.todayReps} Completed ({completionPct}%)
                </span>
              </div>
              <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-primary-container h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, completionPct)}%` }}
                />
              </div>
            </div>

            {/* Call to Action Cluster */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
              <button
                onClick={() => handleStartExercise('standard_pushup')}
                className="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-[0_12px_24px_-4px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-headline-md">play_arrow</span>
                <span>Track Standard Pushups</span>
              </button>

              <div className="inline-flex items-center p-1 rounded-full bg-surface-container-low shadow-sm">
                <button
                  className="px-space-md py-space-xs rounded-full font-label-md text-label-md bg-surface-container-lowest text-on-surface shadow-sm font-semibold"
                >
                  Active: Standard Pushups
                </button>
                <span
                  className="px-space-md py-space-xs rounded-full font-label-md text-label-md text-outline/60 cursor-not-allowed select-none"
                  title="Disabled for this testing phase"
                >
                  Analytics (Locked)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Daily Biometric Telemetry Card */}
          <div className="lg:col-span-5">
            <div
              className="p-space-lg bg-surface-container-lowest shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03),0_2px_6px_-1px_rgba(15,23,42,0.02)] relative overflow-hidden"
              style={{ borderRadius: 24 }}
            >
              <div className="flex items-start justify-between pb-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Form Readiness
                  </span>
                  <div className="font-display-lg text-display-lg text-on-surface mt-space-xs flex items-baseline gap-space-xs">
                    <span>{telemetry.formReadiness}</span>
                    <span className="font-label-lg text-label-lg text-primary font-bold">Optimal</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-headline-lg">monitoring</span>
                </div>
              </div>

              {/* Minimal Sparkline Track Vector */}
              <div className="w-full h-16 py-space-xs">
                <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 320 60">
                  <path
                    className="text-secondary-container"
                    d="M0 45 C 40 45, 60 20, 100 25 C 140 30, 160 10, 200 15 C 240 20, 270 5, 320 2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                  <path
                    className="text-secondary-container/10"
                    d="M0 45 C 40 45, 60 20, 100 25 C 140 30, 160 10, 200 15 C 240 20, 270 5, 320 2 L 320 60 L 0 60 Z"
                    fill="currentColor"
                  />
                  <circle className="fill-secondary" cx="320" cy="2" r="4" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-space-sm pt-space-sm">
                <div className="p-space-sm bg-surface-container-low flex flex-col" style={{ borderRadius: 16 }}>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Chest Recovery
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface mt-1">
                    {telemetry.chestRecovery}%
                  </span>
                </div>
                <div className="p-space-sm bg-surface-container-low flex flex-col" style={{ borderRadius: 16 }}>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Joint Load
                  </span>
                  <span className="font-headline-md text-headline-md text-primary mt-1">
                    {telemetry.jointLoad}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pushup Variations Section Header & Filters */}
      <section className="mt-space-lg w-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
          <div>
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                Kinetic Modules
              </span>
              <span className="text-outline-variant font-label-md">•</span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Calibrated for hypertrophy & power
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Pushup Variations
            </h2>
          </div>

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className="px-space-md py-space-xs rounded-full font-label-md text-label-md bg-primary-container text-on-primary shadow-sm font-semibold"
            >
              Standard Pushups (Active)
            </button>
            <span
              className="px-space-md py-space-xs rounded-full font-label-md text-label-md bg-surface-container-low/50 text-outline/60 cursor-not-allowed select-none"
              title="Disabled for this testing phase"
            >
              Beginner (Locked)
            </span>
            <span
              className="px-space-md py-space-xs rounded-full font-label-md text-label-md bg-surface-container-low/50 text-outline/60 cursor-not-allowed select-none"
              title="Disabled for this testing phase"
            >
              Advanced (Locked)
            </span>
            <span
              className="px-space-md py-space-xs rounded-full font-label-md text-label-md bg-surface-container-low/50 text-outline/60 cursor-not-allowed select-none"
              title="Disabled for this testing phase"
            >
              Triceps (Locked)
            </span>
          </div>
        </div>

        {/* 3-Column Interactive Pushup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {/* Card 1: Standard Military Pushups (ACTIVE) */}
          <div
            className="group relative bg-surface-container-lowest p-space-lg flex flex-col justify-between shadow-[0_8px_30px_rgba(16,185,129,0.12)] ring-2 ring-primary transition-all duration-300 transform hover:-translate-y-1"
            style={{ borderRadius: 24 }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-space-md">
                <span className="px-space-md py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Active Module
                </span>
                <div className="flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-body-md text-secondary">equalizer</span>
                  <span>MODERATE</span>
                </div>
              </div>

              {/* Technical Vector Pose Display */}
              <div
                className="w-full h-44 bg-surface-container-low flex items-center justify-center relative p-space-md mb-space-md overflow-hidden"
                style={{ borderRadius: 16 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-highest/30 via-transparent to-transparent" />
                <svg
                  className="w-48 h-28 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 200 100"
                >
                  <line stroke="#bbcabf" strokeDasharray="4 4" strokeWidth="1.5" x1="10" x2="190" y1="88" y2="88" />
                  <circle cx="160" cy="38" r="7" strokeWidth="2.5" />
                  <line className="text-primary" stroke="#006c49" x1="154" x2="60" y1="42" y2="70" />
                  <polyline className="text-secondary" points="140,46 142,66 148,88" strokeWidth="3" />
                  <path d="M 140 60 A 10 10 0 0 0 148 68" stroke="#39b8fd" strokeWidth="1.5" />
                  <line stroke="#006c49" x1="60" x2="25" y1="70" y2="88" />
                  <circle cx="108" cy="56" fill="#10b981" r="2" />
                </svg>
                <span className="absolute bottom-2 right-4 font-label-caps text-label-caps text-primary font-bold">
                  180° CORE PLANE • 90° ELBOW
                </span>
              </div>

              <h3 className="font-headline-lg text-headline-lg text-on-surface text-primary transition-colors font-bold">
                Standard Military Pushups
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Precision form tracking: Real-time elbow depth detection (90°) & strict plank alignment.
              </p>

              <div className="mt-space-md p-space-sm rounded-full bg-surface-container-low flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                  Target Prescription
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  3 sets × 15-20 reps
                </span>
              </div>
            </div>

            <button
              onClick={() => handleStartExercise('standard_pushup')}
              className="mt-space-lg w-full py-3 px-space-md rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-[0_6px_20px_rgba(0,108,73,0.3)] transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <span className="material-symbols-outlined text-body-lg">videocam</span>
              <span>Start Pushup Tracking</span>
              <span className="material-symbols-outlined text-body-lg">arrow_forward</span>
            </button>
          </div>

          {/* Card 2: Decline Pushups (DISABLED DUMMY) */}
          <div
            className="group relative bg-surface-container-lowest/60 p-space-lg flex flex-col justify-between shadow-sm opacity-60 cursor-not-allowed border border-dashed border-outline-variant/60"
            style={{ borderRadius: 24 }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-space-md">
                <span className="px-space-md py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
                  Locked
                </span>
                <div className="flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-body-md text-outline">lock</span>
                  <span>DISABLED</span>
                </div>
              </div>

              {/* Elevated Decline Diagram SVG */}
              <div
                className="w-full h-44 bg-surface-container-low/50 flex items-center justify-center relative p-space-md mb-space-md overflow-hidden grayscale"
                style={{ borderRadius: 16 }}
              >
                <svg
                  className="w-48 h-28 text-outline"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 200 100"
                >
                  <line stroke="#bbcabf" strokeDasharray="4 4" strokeWidth="1.5" x1="10" x2="190" y1="88" y2="88" />
                  <rect fill="#dce9ff" height="28" rx="2" stroke="none" width="30" x="20" y="60" />
                  <circle cx="165" cy="56" r="7" strokeWidth="2.5" />
                  <line stroke="#6c7a71" x1="158" x2="68" y1="60" y2="48" />
                  <polyline stroke="#6c7a71" points="144,62 144,74 148,88" strokeWidth="3" />
                  <line stroke="#6c7a71" x1="68" x2="35" y1="48" y2="60" />
                  <circle cx="35" cy="60" fill="#6c7a71" r="3" />
                </svg>
                <span className="absolute bottom-2 right-4 font-label-caps text-label-caps text-outline">
                  COMING SOON
                </span>
              </div>

              <h3 className="font-headline-lg text-headline-lg text-on-surface-variant font-semibold">
                Decline Pushups
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant/70 mt-1">
                Upper chest progression. Disabled for current testing phase.
              </p>

              <div className="mt-space-md p-space-sm rounded-full bg-surface-container-low/50 flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  Target
                </span>
                <span className="font-label-lg text-label-lg text-outline">
                  3 sets × 10-15 reps
                </span>
              </div>
            </div>

            <button
              disabled
              className="mt-space-lg w-full py-space-sm px-space-md rounded-full bg-surface-container text-outline font-label-lg text-label-lg flex items-center justify-center gap-space-xs cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-body-md">lock</span>
              <span>Feature Disabled</span>
            </button>
          </div>

          {/* Card 3: Diamond Pushups (DISABLED DUMMY) */}
          <div
            className="group relative bg-surface-container-lowest/60 p-space-lg flex flex-col justify-between shadow-sm opacity-60 cursor-not-allowed border border-dashed border-outline-variant/60"
            style={{ borderRadius: 24 }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-space-md">
                <span className="px-space-md py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
                  Locked
                </span>
                <div className="flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-body-md text-outline">lock</span>
                  <span>DISABLED</span>
                </div>
              </div>

              {/* Diamond Grip Diagram SVG */}
              <div
                className="w-full h-44 bg-surface-container-low/50 flex items-center justify-center relative p-space-md mb-space-md overflow-hidden grayscale"
                style={{ borderRadius: 16 }}
              >
                <svg
                  className="w-48 h-28 text-outline"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 200 100"
                >
                  <line stroke="#bbcabf" strokeDasharray="4 4" strokeWidth="1.5" x1="10" x2="190" y1="88" y2="88" />
                  <circle cx="156" cy="40" r="7" strokeWidth="2.5" />
                  <line stroke="#6c7a71" x1="150" x2="55" y1="44" y2="72" />
                  <line stroke="#6c7a71" x1="55" x2="20" y1="72" y2="88" />
                  <polyline stroke="#6c7a71" points="135,46 130,68 126,88" strokeWidth="3" />
                </svg>
                <span className="absolute bottom-2 right-4 font-label-caps text-label-caps text-outline">
                  COMING SOON
                </span>
              </div>

              <h3 className="font-headline-lg text-headline-lg text-on-surface-variant font-semibold">
                Diamond Pushups
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant/70 mt-1">
                Triceps isolation. Disabled for current testing phase.
              </p>

              <div className="mt-space-md p-space-sm rounded-full bg-surface-container-low/50 flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  Target
                </span>
                <span className="font-label-lg text-label-lg text-outline">
                  3 sets × 8-12 reps
                </span>
              </div>
            </div>

            <button
              disabled
              className="mt-space-lg w-full py-space-sm px-space-md rounded-full bg-surface-container text-outline font-label-lg text-label-lg flex items-center justify-center gap-space-xs cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-body-md">lock</span>
              <span>Feature Disabled</span>
            </button>
          </div>
        </div>
      </section>

      {/* Form Guidance & Precision AI Sensor Dock */}
      <section className="mt-space-xl w-full">
        <div className="rounded-3xl bg-surface-container-lowest p-space-lg shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03),0_2px_6px_-1px_rgba(15,23,42,0.02)] flex flex-col gap-space-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-space-md">
            {/* Sensor Telemetry Information */}
            <div className="flex items-center gap-space-md w-full lg:w-auto">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/50 flex-shrink-0 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-headline-lg animate-pulse">videocam</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-lg text-label-lg text-on-surface truncate font-semibold">
                    Smart Camera Form Detection Active
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant truncate">
                  Real-time tempo and elbow angle analysis enabled via MediaPipe kinematics nodes.
                </p>
              </div>
            </div>

            {/* Controls Deck: Toggle & Quick Calibration */}
            <div className="flex items-center gap-space-lg w-full lg:w-auto justify-between lg:justify-end">
              <div className="flex items-center gap-space-sm">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  Live Pose Feed
                </span>
                {/* Soft Interactive Switch */}
                <button
                  type="button"
                  aria-pressed={isCameraActive}
                  onClick={() => setCameraActive(!isCameraActive)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex items-center ${
                    isCameraActive ? 'bg-primary-container' : 'bg-surface-container-high'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      isCameraActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={handleCalibrateClick}
                className="px-space-md py-space-xs rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors shadow-sm"
              >
                <span
                  className={`material-symbols-outlined text-body-md text-secondary ${
                    calibrating ? 'animate-spin' : ''
                  }`}
                >
                  {calibrating ? 'sync' : 'tune'}
                </span>
                <span>{calibrating ? 'Calibrating...' : isCalibrated ? 'Aligned (90°)' : 'Calibrate Angle'}</span>
              </button>
            </div>
          </div>

          {/* Embedded Camera Preview in Dock when active */}
          {isCameraActive && (
            <div className="pt-space-md border-t border-outline-variant/30">
              <CameraPoseDetector />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
