export type ExerciseType = 'standard_pushup' | 'decline_pushup' | 'diamond_pushup' | 'squats';

export type RepPhase = 'up' | 'down' | 'inflection' | 'hold';

/**
 * 5-state hysteresis rep detection machine.
 * Rep is counted ONLY on the ASCENDING → LOCKOUT transition.
 */
export type RepMachineState = 'IDLE' | 'LOCKOUT' | 'DESCENDING' | 'BOTTOM' | 'ASCENDING';

/**
 * Accumulated metrics tracked across a single rep cycle (descent + ascent).
 * Used to compute a per-rep form score at the moment of counting.
 */
export interface RepCycleMetrics {
  /** Timestamp when descent began (LOCKOUT → DESCENDING) */
  descentStartMs: number;
  /** Timestamp when bottom was reached */
  bottomReachedMs: number;
  /** Timestamp when ascent began (BOTTOM → ASCENDING) */
  ascentStartMs: number;
  /** Minimum elbow angle observed during this rep */
  minElbowAngle: number;
  /** Maximum elbow angle at lockout entry */
  maxElbowAngle: number;
  /** Total frames in the rep cycle */
  totalFrames: number;
  /** Frames where body plane was outside 165°-180° */
  bodyPlaneViolationFrames: number;
  /** Worst body plane angle seen */
  worstBodyPlaneAngle: number;
}

export interface ExerciseConfig {
  id: ExerciseType;
  title: string;
  badge: string;
  difficulty: 'MODERATE' | 'ADVANCED' | 'HIGH';
  difficultyColor: string;
  focus: string;
  description: string;
  prescription: string;
  targetAngleDescription: string;
  targetBottomAngle: number; // e.g. 90 deg for elbow at bottom of pushup
  targetTopAngle: number;    // e.g. 160 deg for lockout
  category: 'Foundation' | 'Upper Chest' | 'Triceps Burn' | 'Lower Body';
}

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PoseAngles {
  leftElbow: number;
  rightElbow: number;
  avgElbow: number;
  bodyPlane: number;      // shoulder-hip-ankle alignment (180 is straight plank)
  hipAngle: number;       // shoulder-hip-knee
  kneeAngle: number;      // hip-knee-ankle (for squats)
  wristDistance?: number; // for diamond pushup detection
}

export interface PostureFeedback {
  status: 'optimal' | 'warning' | 'error' | 'idle';
  message: string;
  detail: string;
  score: number; // 0 - 100%
  repCount: number;
  phase: RepPhase;
  machineState?: RepMachineState;
}

export interface WorkoutHistoryItem {
  id: string;
  date: string;
  exerciseName: string;
  exerciseType: ExerciseType;
  sets: number;
  repCount: number;
  formAccuracy: number;
  duration: string;
  status: 'Completed' | 'Partial';
}

export interface BiometricTelemetry {
  formReadiness: number;
  chestRecovery: number;
  jointLoad: string;
  todayReps: number;
  dailyTarget: number;
  activeMinutes: number;
  caloriesBurned: number;
  avgCadence: number;
  peakDayReps: number;
}
