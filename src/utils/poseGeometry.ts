import { Landmark, PoseAngles } from '../types/fitness';

/**
 * Calculates 2D angle (in degrees) at vertex B formed by points A - B - C
 */
export function calculateAngle(pointA: Landmark, pointB: Landmark, pointC: Landmark): number {
  const baX = pointA.x - pointB.x;
  const baY = pointA.y - pointB.y;
  const bcX = pointC.x - pointB.x;
  const bcY = pointC.y - pointB.y;

  const dot = baX * bcX + baY * bcY;
  const magBA = Math.sqrt(baX * baX + baY * baY);
  const magBC = Math.sqrt(bcX * bcX + bcY * bcY);

  if (magBA === 0 || magBC === 0) return 180;

  let cosAngle = dot / (magBA * magBC);
  // Clamp between -1 and 1 to prevent NaN from precision limits
  cosAngle = Math.max(-1, Math.min(1, cosAngle));

  const radians = Math.acos(cosAngle);
  return Math.round((radians * 180) / Math.PI);
}

/**
 * Calculates Euclidean distance between two landmarks
 */
export function calculateDistance(pointA: Landmark, pointB: Landmark): number {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * MediaPipe landmark index constants
 */
export const POSE_INDEX = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

/**
 * Extracts and calculates biomechanical angles from pose landmarks
 */
export function extractPoseAngles(landmarks: Landmark[]): PoseAngles | null {
  if (!landmarks || landmarks.length < 29) return null;

  // Left side
  const leftShoulder = landmarks[POSE_INDEX.LEFT_SHOULDER];
  const leftElbow = landmarks[POSE_INDEX.LEFT_ELBOW];
  const leftWrist = landmarks[POSE_INDEX.LEFT_WRIST];
  const leftHip = landmarks[POSE_INDEX.LEFT_HIP];
  const leftKnee = landmarks[POSE_INDEX.LEFT_KNEE];
  const leftAnkle = landmarks[POSE_INDEX.LEFT_ANKLE];

  // Right side
  const rightShoulder = landmarks[POSE_INDEX.RIGHT_SHOULDER];
  const rightElbow = landmarks[POSE_INDEX.RIGHT_ELBOW];
  const rightWrist = landmarks[POSE_INDEX.RIGHT_WRIST];
  const rightHip = landmarks[POSE_INDEX.RIGHT_HIP];
  const rightKnee = landmarks[POSE_INDEX.RIGHT_KNEE];
  const rightAnkle = landmarks[POSE_INDEX.RIGHT_ANKLE];

  // Check visibility scores
  const leftVisible = (leftShoulder.visibility || 0.5) > 0.4 && (leftElbow.visibility || 0.5) > 0.4;
  const rightVisible = (rightShoulder.visibility || 0.5) > 0.4 && (rightElbow.visibility || 0.5) > 0.4;

  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  let avgElbow = 180;
  if (leftVisible && rightVisible) {
    avgElbow = Math.round((leftElbowAngle + rightElbowAngle) / 2);
  } else if (leftVisible) {
    avgElbow = leftElbowAngle;
  } else if (rightVisible) {
    avgElbow = rightElbowAngle;
  }

  // Body alignment plane: Shoulder -> Hip -> Ankle (ideally 170-180 for pushup plank)
  const leftBodyPlane = calculateAngle(leftShoulder, leftHip, leftAnkle);
  const rightBodyPlane = calculateAngle(rightShoulder, rightHip, rightAnkle);
  const bodyPlane = leftVisible ? leftBodyPlane : rightBodyPlane;

  // Hip angle: Shoulder -> Hip -> Knee
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const hipAngle = leftVisible ? leftHipAngle : rightHipAngle;

  // Knee angle: Hip -> Knee -> Ankle (for squats or form)
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const kneeAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);

  // Wrist distance (useful for diamond pushup detection)
  const wristDistance = calculateDistance(leftWrist, rightWrist);

  return {
    leftElbow: leftElbowAngle,
    rightElbow: rightElbowAngle,
    avgElbow,
    bodyPlane,
    hipAngle,
    kneeAngle,
    wristDistance,
  };
}

/**
 * Lightweight exponential smoother to filter jitter.
 * Default alpha = 0.2 calibrated for stable pose transitions without excessive lag.
 */
export class MetricSmoother {
  private value: number | null = null;
  private alpha: number;

  constructor(alpha: number = 0.2) {
    this.alpha = alpha;
  }

  smooth(newValue: number): number {
    if (this.value === null) {
      this.value = newValue;
    } else {
      this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
    }
    return Math.round(this.value);
  }

  get(): number | null {
    return this.value !== null ? Math.round(this.value) : null;
  }

  reset(initialValue?: number) {
    this.value = initialValue !== undefined ? initialValue : null;
  }
}
