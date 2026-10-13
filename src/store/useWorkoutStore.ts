import { create } from 'zustand';
import { 
  ExerciseType, 
  PoseAngles, 
  PostureFeedback, 
  WorkoutHistoryItem, 
  BiometricTelemetry 
} from '../types/fitness';
import { playRepChime, playWarningTone, speakFeedback } from '../utils/audioFeedback';

export type NavView = 'workouts' | 'analytics' | 'activity-history' | 'community' | 'live-trainer';

interface WorkoutStoreState {
  // Navigation & View
  currentView: NavView;
  setCurrentView: (view: NavView) => void;

  // Selected Exercise
  selectedExercise: ExerciseType;
  setSelectedExercise: (exercise: ExerciseType) => void;

  // Camera & Detection Engine State
  isCameraActive: boolean;
  isModelLoaded: boolean;
  isCalibrated: boolean;
  cameraError: string | null;
  setCameraActive: (active: boolean) => void;
  setModelLoaded: (loaded: boolean) => void;
  setCalibrated: (calibrated: boolean) => void;
  setCameraError: (error: string | null) => void;

  // Live Posture & Reps Telemetry (Fast updates)
  repCount: number;
  currentPhase: 'up' | 'down' | 'inflection' | 'hold';
  currentAngles: PoseAngles;
  formScore: number;
  postureFeedback: PostureFeedback;
  sessionDurationSec: number;
  isSessionRunning: boolean;

  // Audio & Display Preferences
  soundEnabled: boolean;
  voiceEnabled: boolean;
  showSkeleton: boolean;
  showAngleBadges: boolean;
  toggleSound: () => void;
  toggleVoice: () => void;
  toggleSkeleton: () => void;
  toggleAngleBadges: () => void;

  // Biometrics & Global Daily Stats
  telemetry: BiometricTelemetry;
  history: WorkoutHistoryItem[];

  // Actions
  updatePoseFrame: (angles: PoseAngles, feedback: PostureFeedback) => void;
  registerCompletedRep: (formQuality: number) => void;
  resetSet: () => void;
  startSession: () => void;
  pauseSession: () => void;
  finishSession: () => void;
  calibratePose: () => void;
}

const INITIAL_ANGLES: PoseAngles = {
  leftElbow: 165,
  rightElbow: 165,
  avgElbow: 165,
  bodyPlane: 178,
  hipAngle: 175,
  kneeAngle: 176,
};

const INITIAL_FEEDBACK: PostureFeedback = {
  status: 'idle',
  message: 'Position yourself in camera frame',
  detail: 'Ensure side profile view for accurate kinematics analysis',
  score: 94,
  repCount: 0,
  phase: 'up',
};

const INITIAL_TELEMETRY: BiometricTelemetry = {
  formReadiness: 94,
  chestRecovery: 98,
  jointLoad: 'Low (0.2G)',
  todayReps: 42,
  dailyTarget: 100,
  activeMinutes: 38,
  caloriesBurned: 320,
  avgCadence: 2.4,
  peakDayReps: 165,
};

const INITIAL_HISTORY: WorkoutHistoryItem[] = [
  {
    id: 'w-1',
    date: 'Today, 08:30 AM',
    exerciseName: 'Standard Military Pushups',
    exerciseType: 'standard_pushup',
    sets: 4,
    repCount: 60,
    formAccuracy: 94,
    duration: '14m 20s',
    status: 'Completed',
  },
  {
    id: 'w-2',
    date: 'Today, 07:15 AM',
    exerciseName: 'Diamond Pushups',
    exerciseType: 'diamond_pushup',
    sets: 3,
    repCount: 28,
    formAccuracy: 89,
    duration: '08m 45s',
    status: 'Completed',
  },
  {
    id: 'w-3',
    date: 'Yesterday, 06:00 PM',
    exerciseName: 'Decline Pushups',
    exerciseType: 'decline_pushup',
    sets: 3,
    repCount: 35,
    formAccuracy: 92,
    duration: '11m 10s',
    status: 'Completed',
  },
];

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  currentView: 'workouts',
  setCurrentView: (view) => set({ currentView: view }),

  selectedExercise: 'standard_pushup',
  setSelectedExercise: (exercise) => set({ selectedExercise: exercise, repCount: 0 }),

  isCameraActive: false,
  isModelLoaded: false,
  isCalibrated: false,
  cameraError: null,
  setCameraActive: (active) => set({ isCameraActive: active }),
  setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
  setCalibrated: (calibrated) => set({ isCalibrated: calibrated }),
  setCameraError: (error) => set({ cameraError: error }),

  repCount: 0,
  currentPhase: 'up',
  currentAngles: INITIAL_ANGLES,
  formScore: 94,
  postureFeedback: INITIAL_FEEDBACK,
  sessionDurationSec: 0,
  isSessionRunning: false,

  soundEnabled: true,
  voiceEnabled: true,
  showSkeleton: true,
  showAngleBadges: true,

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
  toggleSkeleton: () => set((state) => ({ showSkeleton: !state.showSkeleton })),
  toggleAngleBadges: () => set((state) => ({ showAngleBadges: !state.showAngleBadges })),

  telemetry: INITIAL_TELEMETRY,
  history: INITIAL_HISTORY,

  updatePoseFrame: (angles, feedback) => {
    set({
      currentAngles: angles,
      postureFeedback: feedback,
      formScore: feedback.score,
      currentPhase: feedback.phase,
    });
  },

  registerCompletedRep: (formQuality) => {
    const state = get();
    const newRepCount = state.repCount + 1;
    const newTodayReps = state.telemetry.todayReps + 1;
    const newCalories = state.telemetry.caloriesBurned + 2;

    // Trigger sound & speech feedback
    if (state.soundEnabled) {
      playRepChime();
    }
    if (state.voiceEnabled) {
      if (formQuality >= 90) {
        speakFeedback(`Rep ${newRepCount}, excellent depth!`);
      } else {
        speakFeedback(`Rep ${newRepCount}`);
      }
    }

    set({
      repCount: newRepCount,
      telemetry: {
        ...state.telemetry,
        todayReps: newTodayReps,
        caloriesBurned: newCalories,
      },
    });
  },

  resetSet: () => {
    set({ repCount: 0, sessionDurationSec: 0 });
  },

  startSession: () => {
    set({ isSessionRunning: true, isCameraActive: true });
  },

  pauseSession: () => {
    set({ isSessionRunning: false });
  },

  finishSession: () => {
    const state = get();
    if (state.repCount > 0) {
      const exerciseTitle = 
        state.selectedExercise === 'standard_pushup' ? 'Standard Military Pushups' :
        state.selectedExercise === 'decline_pushup' ? 'Decline Pushups' :
        state.selectedExercise === 'diamond_pushup' ? 'Diamond Pushups' : 'Squats';

      const mins = Math.floor(state.sessionDurationSec / 60);
      const secs = state.sessionDurationSec % 60;
      const durationStr = `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

      const newHistoryItem: WorkoutHistoryItem = {
        id: `w-${Date.now()}`,
        date: 'Just now',
        exerciseName: exerciseTitle,
        exerciseType: state.selectedExercise,
        sets: 1,
        repCount: state.repCount,
        formAccuracy: state.formScore,
        duration: durationStr || '1m 30s',
        status: 'Completed',
      };

      set({
        history: [newHistoryItem, ...state.history],
        isSessionRunning: false,
        repCount: 0,
        sessionDurationSec: 0,
      });
    } else {
      set({ isSessionRunning: false });
    }
  },

  calibratePose: () => {
    set({ isCalibrated: true });
    const { voiceEnabled } = get();
    if (voiceEnabled) {
      speakFeedback('Pose calibrated successfully. You are ready to start!', true);
    }
  },
}));
