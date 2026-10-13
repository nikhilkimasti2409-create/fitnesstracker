import React, { useEffect, useState } from 'react';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { EXERCISES } from '../../data/exerciseData';
import { ExerciseType } from '../../types/fitness';
import { CameraPoseDetector } from './CameraPoseDetector';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Activity, 
  Flame, 
  Timer, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const LiveWorkoutSessionView: React.FC = () => {
  const {
    selectedExercise,
    setSelectedExercise,
    repCount,
    formScore,
    currentPhase,
    currentAngles,
    postureFeedback,
    soundEnabled,
    voiceEnabled,
    toggleSound,
    toggleVoice,
    resetSet,
    finishSession,
    setCurrentView,
  } = useWorkoutStore();

  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Exercise config
  const currentConfig = EXERCISES[selectedExercise] || EXERCISES.standard_pushup;

  // Session timer
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishSet = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#39b8fd', '#006c49'],
    });
    finishSession();
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Session Header / Exercise Picker */}
      <div className="py-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-1">
            <button
              onClick={() => setCurrentView('workouts')}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>Workouts</span>
            </button>
            <span>/</span>
            <span className="text-primary font-semibold">Live Computer Vision Trainer</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            {currentConfig.title}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {currentConfig.focus}
          </p>
        </div>

        {/* Focused Exercise Mode Badge & Back Button */}
        <div className="flex items-center gap-space-sm">
          <div className="inline-flex items-center gap-2 px-space-md py-1.5 bg-primary-fixed/50 text-on-primary-fixed rounded-full border border-primary/20 shadow-sm font-label-md text-label-md font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Single-Focus: Standard Pushups</span>
          </div>

          <button
            onClick={() => setCurrentView('workouts')}
            className="px-space-md py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
          >
            ← Back to Catalog
          </button>
        </div>
      </div>

      {/* Main Live Training Layout (Camera + Biometric Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start mt-space-sm">
        {/* Left Column: Live Webcam Pose Detector (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          <CameraPoseDetector className="shadow-lg border border-outline-variant/30" />

          {/* Real-time Angle Diagnostics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Elbow Joint
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-md text-headline-md font-bold text-primary tabular-nums">
                  {currentAngles.avgElbow}°
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant">
                  / {currentConfig.targetBottomAngle}°
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                Depth target
              </span>
            </div>

            <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Core Plane
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-md text-headline-md font-bold text-secondary tabular-nums">
                  {currentAngles.bodyPlane}°
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant">
                  / 180°
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                Spine alignment
              </span>
            </div>

            <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Motion Phase
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface uppercase mt-1 truncate">
                {postureFeedback.machineState || currentPhase}
              </span>
              <span className="text-[11px] text-primary font-semibold mt-0.5">
                5-State Engine
              </span>
            </div>

            <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Cadence Time
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface tabular-nums mt-1">
                {formatTimer(sessionSeconds)}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                Active set
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Set Controls (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Large Reps Card */}
          <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] border border-outline-variant/30 flex flex-col items-center text-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
              Current Set Count
            </span>

            <div className="my-space-md flex items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-surface-container-low to-primary-fixed/30 flex flex-col items-center justify-center border-4 border-primary shadow-inner">
                <span className="font-display-lg text-5xl font-black text-on-surface tabular-nums">
                  {repCount}
                </span>
                <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest mt-1">
                  Verified
                </span>
              </div>
            </div>

            {/* Target Prescription */}
            <div className="w-full p-space-sm rounded-2xl bg-surface-container-low flex items-center justify-between text-left mb-space-md">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Goal
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                {currentConfig.prescription}
              </span>
            </div>

            {/* Posture Status Box */}
            <div
              className={`w-full p-space-sm rounded-2xl flex items-start gap-2.5 text-left mb-space-lg ${
                postureFeedback.status === 'optimal'
                  ? 'bg-primary-fixed/30 text-on-primary-fixed-variant'
                  : 'bg-secondary-fixed/40 text-on-secondary-fixed-variant'
              }`}
            >
              <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-label-md text-label-md font-bold">{postureFeedback.message}</p>
                <p className="font-body-sm text-[12px] opacity-90">{postureFeedback.detail}</p>
              </div>
            </div>

            {/* Actions: Finish / Reset */}
            <div className="flex flex-col gap-space-xs w-full">
              <button
                onClick={handleFinishSet}
                className="w-full py-3 px-space-md rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Finish Set & Save</span>
              </button>

              <button
                onClick={resetSet}
                className="w-full py-2.5 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-on-surface-variant" />
                <span>Reset Count</span>
              </button>
            </div>
          </div>

          {/* Form Coaching Advice & Tips */}
          <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] border border-outline-variant/30">
            <div className="flex items-center gap-2 mb-space-sm text-primary font-label-md text-label-md font-semibold">
              <Activity className="w-5 h-5 text-primary" />
              <span>Biomechanical Checklist</span>
            </div>

            <ul className="space-y-2.5 text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Full Lockout:</strong> Push all the way up until arms reach 160°+.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Chest Depth:</strong> Lower chest until elbows form a 90° angle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Core Stiffness:</strong> Avoid letting hips sag to maintain 180° plane.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
