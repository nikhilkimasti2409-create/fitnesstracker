import React, { useState } from 'react';
import { useWorkoutStore } from '../../store/useWorkoutStore';

export const AnalyticsDashboardView: React.FC = () => {
  const { telemetry, history, setCurrentView, startSession } = useWorkoutStore();
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) =>
    item.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Control Deck & Breadcrumb Context */}
      <section className="py-space-lg flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            <button
              onClick={() => setCurrentView('workouts')}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Dashboard
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">Biometrics & Form Tracking</span>
          </div>

          <div className="flex items-baseline gap-space-sm">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Performance & Form Analytics
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps font-bold">
              LIVE BIOMETRICS
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Post-session computer vision kinematics and eccentric load diagnostics
          </p>
        </div>

        {/* Controls: Date Range Segmented Pill + Export Action */}
        <div className="flex items-center flex-wrap gap-space-sm">
          <div className="flex items-center p-1 bg-surface-container rounded-full shadow-sm">
            <button
              onClick={() => setPeriod('7d')}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
                period === '7d'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
                period === '30d'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
                period === 'all'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={() => alert('Generating PDF Biometric kinematics report...')}
            className="group flex items-center gap-space-xs px-space-lg py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container transition-all duration-200 shadow-sm text-secondary font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-y-0.5 transition-transform duration-200">
              download
            </span>
            Export Report
          </button>

          <button
            onClick={() => {
              startSession();
              setCurrentView('live-trainer');
            }}
            className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Start Camera Session
          </button>
        </div>
      </section>

      {/* Key Biometric Highlight Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-space-sm mb-space-lg">
        {/* Widget 1: Total Reps Today */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-space-lg flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_32px_-4px_rgba(14,165,233,0.06)] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">fitness_center</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                    Kinetic Volume
                  </p>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Total Reps Today
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-1 px-space-sm py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                <span>+18%</span>
              </div>
            </div>

            <div className="flex items-baseline gap-space-sm my-space-sm">
              <span className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold tabular-nums">
                {telemetry.todayReps + 106}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant font-normal">
                verified reps
              </span>
            </div>

            {/* Exercise Type Granular Breakdown */}
            <div className="flex flex-wrap gap-space-xs mt-space-sm mb-space-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                <span className="font-semibold">85</span> Military
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-secondary-container" />
                <span className="font-semibold">35</span> Decline
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="font-semibold">28</span> Diamond
              </span>
            </div>
          </div>

          {/* Mini Sparkline Visualization */}
          <div className="pt-space-sm bg-surface-container-lowest rounded-2xl">
            <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
              <span>INTRA-DAY TEMPO & SET ACCUMULATION</span>
              <span className="text-primary font-semibold">Target Exceeded (123%)</span>
            </div>
            <div className="h-16 w-full">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 50">
                <defs>
                  <linearGradient id="sparkGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,42 Q 40,38 70,30 T 140,24 T 210,12 T 275,18 T 340,4 L 340,50 L 0,50 Z"
                  fill="url(#sparkGradient)"
                />
                <path
                  d="M 0,42 Q 40,38 70,30 T 140,24 T 210,12 T 275,18 T 340,4"
                  fill="none"
                  stroke="#006c49"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle cx="70" cy="30" fill="#ffffff" r="3" stroke="#006c49" strokeWidth="2" />
                <circle cx="140" cy="24" fill="#ffffff" r="3" stroke="#006c49" strokeWidth="2" />
                <circle cx="210" cy="12" fill="#ffffff" r="3" stroke="#006c49" strokeWidth="2" />
                <circle cx="340" cy="4" fill="#10b981" r="4.5" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Widget 2: Form Accuracy & Biomechanics */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_32px_-4px_rgba(14,165,233,0.06)] transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">vital_signs</span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                  Vision Kinematics
                </p>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Form Accuracy & Biomechanics
                </h2>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed font-label-md text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              Excellent Posture • 4/5 reps in green zone
            </div>
          </div>

          {/* Ring Gauge + Diagnostic Highlights Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center my-space-xs">
            {/* Interactive Progress Ring Visual */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                  <defs>
                    <linearGradient id="biometricRingGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#39b8fd" />
                      <stop offset="70%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#006c49" />
                    </linearGradient>
                  </defs>
                  <circle cx="70" cy="70" fill="none" r="56" stroke="#eff4ff" strokeWidth="11" />
                  <circle
                    className="transition-all duration-1000 ease-out"
                    cx="70"
                    cy="70"
                    fill="none"
                    r="56"
                    stroke="url(#biometricRingGrad)"
                    strokeDasharray="351.86"
                    strokeDashoffset="28.15"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-display-lg text-[40px] leading-tight text-on-surface font-bold tracking-tight">
                    92<span className="text-headline-lg font-semibold text-primary">%</span>
                  </span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    Alignment Score
                  </span>
                </div>
              </div>
              <span className="mt-2 text-center font-body-sm text-body-sm text-on-surface-variant font-medium">
                9.2 out of 10 motion markers cleared
              </span>
            </div>

            {/* Metric Diagnostic Gauges */}
            <div className="md:col-span-7 flex flex-col justify-center gap-space-md">
              {/* Metric 1 */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">straighten</span>
                    Elbow Angle Consistency
                  </span>
                  <span className="font-label-md text-label-md text-primary font-bold">94%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-primary-container rounded-full transition-all duration-700" style={{ width: '94%' }} />
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                  Consistent 45° sagittal abduction maintained across 94% of sets
                </p>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">accessibility_new</span>
                    Core Alignment & Pelvic Tilt
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-bold">91%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-secondary-container rounded-full transition-all duration-700" style={{ width: '91%' }} />
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                  Minimal spinal extension observed during rep cycles #12 to #20
                </p>
              </div>

              {/* Metric 3 */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-tertiary">speed</span>
                    Tempo & Eccentric Cadence Control
                  </span>
                  <span className="font-label-md text-label-md text-tertiary font-bold">90%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-tertiary-container rounded-full transition-all duration-700" style={{ width: '90%' }} />
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                  Stable 1.8s descent with an explosive 0.6s concentric return
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Fast Stat Metrics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-lg">
        {/* Active Time */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px]">timer</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Active Time
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {telemetry.activeMinutes}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface">mins</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant ml-1 font-normal">
                (Avg 45s per set)
              </span>
            </div>
          </div>
        </div>

        {/* Caloric Burn */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[26px]">local_fire_department</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Caloric Expenditure
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface tabular-nums">
                {telemetry.caloriesBurned}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface">kcal</span>
              <span className="font-body-sm text-body-sm text-primary ml-1 font-semibold">
                ↑ 34 kcal surplus
              </span>
            </div>
          </div>
        </div>

        {/* Rep Cadence / Pace */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[26px]">file_map_stack</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Cadence Pace
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {telemetry.avgCadence}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface">sec/rep</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant ml-1 font-normal">
                (Ideal cadence range)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 7-Day Pushup Volume SVG Chart Card */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] mb-space-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm mb-space-lg">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">stacked_bar_chart</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Volume Consistency
              </p>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Reps Over the Last 7 Days
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <span className="w-3 h-3 rounded-md bg-primary-container" />
              <span>Completed Reps</span>
            </div>
            <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <span className="w-6 border-b-2 border-dashed border-outline-variant inline-block" />
              <span>Daily Baseline (100 reps)</span>
            </div>
          </div>
        </div>

        {/* High-Fidelity Responsive SVG Chart Container */}
        <div className="w-full relative pt-4 pb-2">
          <div className="w-full h-72">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 840 260">
              <defs>
                <linearGradient id="chartBarGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6ffbbe" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="chartPeakBarGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006c49" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="chartCurvedFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#39b8fd" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#39b8fd" stopOpacity="0.0" />
                </linearGradient>
                <filter height="130%" id="softShadow" width="120%" x="-10%" y="-10%">
                  <feDropShadow dx="0" dy="4" floodColor="#006c49" floodOpacity="0.1" stdDeviation="6" />
                </filter>
              </defs>

              <line stroke="#eff4ff" strokeWidth="1.5" x1="40" x2="800" y1="40" y2="40" />
              <text fill="#6c7a71" fontSize="11" fontWeight="500" textAnchor="end" x="32" y="44">180</text>
              <line stroke="#eff4ff" strokeWidth="1.5" x1="40" x2="800" y1="90" y2="90" />
              <text fill="#6c7a71" fontSize="11" fontWeight="500" textAnchor="end" x="32" y="94">140</text>
              <line stroke="#6c7a71" strokeDasharray="6 6" strokeOpacity="0.45" strokeWidth="1.5" x1="40" x2="800" y1="140" y2="140" />
              <text fill="#006c49" fontSize="11" fontWeight="600" textAnchor="end" x="32" y="144">100 Target</text>
              <line stroke="#eff4ff" strokeWidth="1.5" x1="40" x2="800" y1="190" y2="190" />
              <text fill="#6c7a71" fontSize="11" fontWeight="500" textAnchor="end" x="32" y="194">60</text>
              <line stroke="#eff4ff" strokeWidth="1.5" x1="40" x2="800" y1="230" y2="230" />
              <text fill="#6c7a71" fontSize="11" fontWeight="500" textAnchor="end" x="32" y="234">0</text>

              {/* Smooth Kinematic Progression Flow */}
              <path
                d="M 80,158 Q 185,127 290,146 T 500,90 T 605,115 T 710,58 T 790,79 L 790,230 L 80,230 Z"
                fill="url(#chartCurvedFill)"
              />
              <path
                d="M 80,158 Q 185,127 290,146 T 500,90 T 605,115 T 710,58 T 790,79"
                fill="none"
                stroke="#39b8fd"
                strokeLinecap="round"
                strokeOpacity="0.85"
                strokeWidth="2.5"
              />

              {/* Bars */}
              <rect className="transition-all duration-300 hover:opacity-80 cursor-pointer" fill="url(#chartBarGrad)" height="106" rx="8" width="38" x="62" y="124" />
              <text fill="#3c4a42" fontSize="12" fontWeight="600" textAnchor="middle" x="81" y="248">Mon</text>
              <text fill="#006c49" fontSize="11" fontWeight="600" textAnchor="middle" x="81" y="116">85</text>

              <rect className="transition-all duration-300 hover:opacity-80 cursor-pointer" fill="url(#chartBarGrad)" height="137" rx="8" width="38" x="167" y="93" />
              <text fill="#3c4a42" fontSize="12" fontWeight="600" textAnchor="middle" x="186" y="248">Tue</text>
              <text fill="#006c49" fontSize="11" fontWeight="600" textAnchor="middle" x="186" y="85">110</text>

              <rect className="transition-all duration-300 hover:opacity-80 cursor-pointer" fill="url(#chartBarGrad)" height="118" rx="8" width="38" x="272" y="112" />
              <text fill="#3c4a42" fontSize="12" fontWeight="600" textAnchor="middle" x="291" y="248">Wed</text>
              <text fill="#006c49" fontSize="11" fontWeight="600" textAnchor="middle" x="291" y="104">95</text>

              <rect className="transition-all duration-300 hover:opacity-80 cursor-pointer" fill="url(#chartBarGrad)" height="175" rx="8" width="38" x="377" y="55" />
              <text fill="#3c4a42" fontSize="12" fontWeight="600" textAnchor="middle" x="396" y="248">Thu</text>
              <text fill="#006c49" fontSize="11" fontWeight="600" textAnchor="middle" x="396" y="47">140</text>

              <rect className="transition-all duration-300 hover:opacity-80 cursor-pointer" fill="url(#chartBarGrad)" height="150" rx="8" width="38" x="482" y="80" />
              <text fill="#3c4a42" fontSize="12" fontWeight="600" textAnchor="middle" x="501" y="248">Fri</text>
              <text fill="#006c49" fontSize="11" fontWeight="600" textAnchor="middle" x="501" y="72">120</text>

              <rect className="transition-all duration-300 hover:opacity-90 cursor-pointer" fill="url(#chartPeakBarGrad)" filter="url(#softShadow)" height="206" rx="8" width="38" x="587" y="24" />
              <text fill="#006c49" fontSize="12" fontWeight="700" textAnchor="middle" x="606" y="248">Sat</text>
              <g transform="translate(606, 12)">
                <rect fill="#0b1c30" height="30" rx="15" width="96" x="-48" y="-36" />
                <path d="M -4,-6 L 0,-1 L 4,-6 Z" fill="#0b1c30" />
                <text fill="#ffffff" fontSize="11" fontWeight="700" letterSpacing="0.02em" textAnchor="middle" x="0" y="-17">Peak • 165 Reps</text>
              </g>

              <rect className="transition-all duration-300 hover:opacity-80 cursor-pointer" fill="url(#chartBarGrad)" height="185" rx="8" width="38" x="692" y="45" />
              <text fill="#006c49" fontSize="12" fontWeight="700" textAnchor="middle" x="711" y="248">Today</text>
              <text fill="#006c49" fontSize="11" fontWeight="700" textAnchor="middle" x="711" y="37">
                {telemetry.todayReps + 106}
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Editorial Card: Coach Insights & Biomechanical Advice */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-space-lg">
        {/* Visual Coach Tile */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-space-lg flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 mb-space-sm text-primary font-label-md text-label-md font-semibold">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>Adaptive Kinematic AI</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs font-semibold">
              Eccentric Load Optimal
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your muscle tension under descent reached a 7-day high. You are primed for strength progression without strain on anterior deltoids.
            </p>
          </div>

          <div className="mt-space-md pt-space-md flex items-center justify-between border-t border-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">
                ML
              </div>
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">Dr. Maya Lin, PT</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">Lead Movement Specialist</p>
              </div>
            </div>
            <button
              onClick={() => alert('Consulting with AI Kinetic coach...')}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary-fixed/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Live Form Capture Snapshot / Motion Skeleton Preview */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] flex flex-col md:flex-row items-center gap-space-lg">
          <div className="w-full md:w-5/12 h-44 rounded-2xl overflow-hidden relative shadow-inner bg-surface-container-low flex items-center justify-center">
            {/* Tech pose visual */}
            <svg className="w-48 h-32 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 200 100">
              <circle cx="160" cy="40" r="8" stroke="#10b981" />
              <line stroke="#10b981" x1="152" x2="65" y1="45" y2="65" />
              <line stroke="#39b8fd" x1="65" x2="25" y1="65" y2="85" />
              <polyline stroke="#006591" points="140,50 142,68 145,88" strokeWidth="3" />
              <circle cx="140" cy="50" fill="#10b981" r="3" />
              <circle cx="142" cy="68" fill="#39b8fd" r="3" />
              <circle cx="145" cy="88" fill="#006c49" r="3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-space-sm">
              <div className="flex items-center gap-1.5 text-white font-label-caps text-label-caps font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                POSE ESTIMATION ACTIVE
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-semibold">
                NEURAL JOINT MAPPING
              </span>
              <span className="text-on-surface-variant font-body-sm text-body-sm">Frame #439</span>
            </div>
            <h4 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">
              Zero Wrist Shear Detected
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm">
              Hand placement positioned at 1.2x biacromial diameter prevented radial nerve compression during the decline sets.
            </p>
            <div className="flex items-center gap-space-sm">
              <button
                onClick={() => setCurrentView('live-trainer')}
                className="font-label-md text-label-md text-secondary font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Launch live 3D skeletal detector</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Workouts Data Table Card */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] mb-space-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Granular Session Archive
            </p>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Recent Workouts & Set Breakdown
            </h2>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-full bg-surface-container text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-all"
                placeholder="Filter exercise..."
                type="text"
              />
            </div>
            <button className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">tune</span>
            </button>
          </div>
        </div>

        {/* Modern Elevated Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider bg-surface-container-low/60 rounded-xl">
                <th className="py-3.5 px-space-md rounded-l-xl font-bold">Date & Time</th>
                <th className="py-3.5 px-space-md font-bold">Exercise Type</th>
                <th className="py-3.5 px-space-md font-bold">Rep Count</th>
                <th className="py-3.5 px-space-md font-bold">Form Accuracy</th>
                <th className="py-3.5 px-space-md font-bold">Duration</th>
                <th className="py-3.5 px-space-md rounded-r-xl font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors group cursor-pointer">
                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">{row.date}</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">Computer Vision Verified</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-base">
                        fitness_center
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-medium">
                        {row.exerciseName}
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {row.sets} sets • {row.repCount} reps
                    </span>
                  </td>
                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-container rounded-full"
                          style={{ width: `${row.formAccuracy}%` }}
                        />
                      </div>
                      <span className="font-label-md text-label-md text-primary font-bold">
                        {row.formAccuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md whitespace-nowrap font-body-md text-body-md text-on-surface-variant">
                    {row.duration}
                  </td>
                  <td className="py-space-md px-space-md whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed font-label-md text-label-md font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
