import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { extractPoseAngles, MetricSmoother } from '../../utils/poseGeometry';
import { Landmark, PoseAngles, PostureFeedback, RepPhase, RepMachineState, RepCycleMetrics } from '../../types/fitness';
import { EXERCISES } from '../../data/exerciseData';
import { Camera as CameraIcon, CameraOff, Volume2, VolumeX, Mic, MicOff, RefreshCw, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface Props {
  className?: string;
  isCompact?: boolean;
}

export const CameraPoseDetector: React.FC<Props> = ({ className = '', isCompact = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);

  // 5-State Hysteresis Rep Detection Machine refs
  const repStateRef = useRef<RepMachineState>('IDLE');
  const repCycleRef = useRef<RepCycleMetrics>({
    descentStartMs: 0,
    bottomReachedMs: 0,
    ascentStartMs: 0,
    minElbowAngle: 180,
    maxElbowAngle: 160,
    totalFrames: 0,
    bodyPlaneViolationFrames: 0,
    worstBodyPlaneAngle: 180,
  });
  const lastRepTimestampRef = useRef<number>(0);
  const bottomEntryTimeRef = useRef<number>(0);
  const smootherRef = useRef(new MetricSmoother(0.2));
  const bodyPlaneSmootherRef = useRef(new MetricSmoother(0.2));
  const simAngleRef = useRef(165);
  const simDirectionRef = useRef<-1 | 1>(-1);
  const simBottomHoldRef = useRef(0);

  // Store bindings
  const {
    isCameraActive,
    isModelLoaded,
    isCalibrated,
    cameraError,
    selectedExercise,
    repCount,
    formScore,
    currentAngles,
    postureFeedback,
    soundEnabled,
    voiceEnabled,
    showSkeleton,
    showAngleBadges,
    setCameraActive,
    setModelLoaded,
    setCalibrated,
    setCameraError,
    updatePoseFrame,
    registerCompletedRep,
    toggleSound,
    toggleVoice,
    toggleSkeleton,
    toggleAngleBadges,
    calibratePose,
  } = useWorkoutStore();

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Fetch available cameras
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setDeviceList(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      }).catch(console.warn);
    }
  }, [selectedDeviceId]);

  /**
   * Initialize MediaPipe Pose instance
   */
  useEffect(() => {
    let isCancelled = false;

    async function initMediaPipe() {
      try {
        // Dynamically import @mediapipe/pose to handle both bundler & browser WASM
        const mpPose = await import('@mediapipe/pose');
        const PoseConstructor = mpPose.Pose || (window as any).Pose;

        if (!PoseConstructor) {
          throw new Error('MediaPipe Pose constructor unavailable');
        }

        const pose = new PoseConstructor({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          },
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: any) => {
          if (!isCancelled) {
            handlePoseResults(results);
          }
        });

        poseRef.current = pose;
        setModelLoaded(true);
      } catch (err: any) {
        console.warn('MediaPipe initialization warning (falling back gracefully):', err);
        // Still allow simulation mode
        setModelLoaded(true);
      }
    }

    initMediaPipe();

    return () => {
      isCancelled = true;
      if (poseRef.current) {
        try {
          poseRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [setModelLoaded]);

  /**
   * Start / stop camera stream
   */
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser environment.');
      }

      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
          : { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Camera access denied or unavailable. You can use Simulation Mode.');
      setCameraActive(false);
    }
  }, [selectedDeviceId, setCameraActive, setCameraError]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
  }, [setCameraActive]);

  // Handle active camera toggle
  useEffect(() => {
    if (isCameraActive && !videoRef.current?.srcObject && !isDemoMode) {
      startCamera();
    } else if (!isCameraActive && !isDemoMode) {
      stopCamera();
    }
  }, [isCameraActive, isDemoMode, startCamera, stopCamera]);

  /**
   * Video frame processing loop
   */
  useEffect(() => {
    let active = true;

    const processFrame = async () => {
      if (!active) return;

      if (isDemoMode) {
        // Run synthetic pose simulation for preview / testing
        runDemoSimulation();
      } else if (
        isCameraActive &&
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        poseRef.current &&
        !isProcessingRef.current
      ) {
        try {
          isProcessingRef.current = true;
          await poseRef.current.send({ image: videoRef.current });
        } catch (e) {
          console.warn('Pose frame send error:', e);
        } finally {
          isProcessingRef.current = false;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isCameraActive, isDemoMode]);

  /**
   * Evaluates exercise kinematics with a 5-State Hysteresis State Machine,
   * EMA angle smoothing, dwell time verification, cooldown guarding, and accumulated per-rep form scoring.
   */
  const evaluateKinematics = useCallback(
    (angles: PoseAngles) => {
      const exercise = EXERCISES[selectedExercise] || EXERCISES.standard_pushup;
      const primaryAngle =
        selectedExercise === 'squats' ? angles.kneeAngle : angles.avgElbow;
      const smoothedAngle = smootherRef.current.smooth(primaryAngle);
      const smoothedBodyPlane = bodyPlaneSmootherRef.current.smooth(angles.bodyPlane);

      const now = Date.now();
      let phase: RepPhase = 'up';
      let message = 'Plank locked and ready';
      let detail = 'Maintain steady tempo and core rigidity';
      let status: 'optimal' | 'warning' | 'error' | 'idle' = 'optimal';
      let score = 94;

      // 1. Biomechanical Alignment Assessment
      const isSagging = smoothedBodyPlane < 155;
      const isPiked = smoothedBodyPlane > 195;
      const hasAlignmentError = isSagging || isPiked;

      // 2. State Machine Transitions with Hysteresis
      const currentState = repStateRef.current;

      switch (currentState) {
        case 'IDLE': {
          phase = 'hold';
          // Enter LOCKOUT when person establishes locked pushup plank
          if (smoothedAngle >= 150 && smoothedBodyPlane >= 155 && smoothedBodyPlane <= 200) {
            repStateRef.current = 'LOCKOUT';
            phase = 'up';
            message = 'Plank engaged. Ready to descend';
            detail = 'Lower chest smoothly toward the floor';
            status = 'optimal';
            score = 96;
          } else {
            status = 'idle';
            message = 'Assume pushup plank position';
            detail = isSagging
              ? `Hips sagging (${smoothedBodyPlane}°). Raise hips to 180° straight plank.`
              : isPiked
              ? `Hips piked (${smoothedBodyPlane}°). Lower hips into alignment.`
              : 'Hold plank with arms straight (≥150°) and core tight.';
            score = 75;
          }
          break;
        }

        case 'LOCKOUT': {
          phase = 'up';
          // Descent transition: Elbow bends below 140°
          if (smoothedAngle < 140) {
            repStateRef.current = 'DESCENDING';
            repCycleRef.current = {
              descentStartMs: now,
              bottomReachedMs: 0,
              ascentStartMs: 0,
              minElbowAngle: smoothedAngle,
              maxElbowAngle: Math.max(150, smoothedAngle),
              totalFrames: 1,
              bodyPlaneViolationFrames: hasAlignmentError ? 1 : 0,
              worstBodyPlaneAngle: smoothedBodyPlane,
            };
            phase = 'down';
            message = 'Descent initiated — lower chest with control';
            detail = 'Aim for 90° elbow flexion at the bottom';
            status = hasAlignmentError ? 'warning' : 'optimal';
            score = hasAlignmentError ? 80 : 96;
          } else {
            // Maintained in lockout
            if (hasAlignmentError) {
              status = 'warning';
              message = isSagging ? 'Hips sagging! Tighten core' : 'Hips too high! Level your back';
              detail = `Spine angle: ${smoothedBodyPlane}° (Optimal: 170°-180°)`;
              score = 80;
            } else {
              message = 'Locked out & stable. Ready to descend';
              detail = `Arms extended (${smoothedAngle}°). Maintain straight plank.`;
              status = 'optimal';
              score = 98;
            }
          }
          break;
        }

        case 'DESCENDING': {
          phase = 'down';
          // Track cycle metrics
          repCycleRef.current.totalFrames += 1;
          repCycleRef.current.minElbowAngle = Math.min(repCycleRef.current.minElbowAngle, smoothedAngle);
          if (hasAlignmentError) {
            repCycleRef.current.bodyPlaneViolationFrames += 1;
            repCycleRef.current.worstBodyPlaneAngle = isSagging
              ? Math.min(repCycleRef.current.worstBodyPlaneAngle, smoothedBodyPlane)
              : Math.max(repCycleRef.current.worstBodyPlaneAngle, smoothedBodyPlane);
          }

          // Abort check: user rose back up above 150° without reaching bottom
          if (smoothedAngle > 150) {
            repStateRef.current = 'LOCKOUT';
            phase = 'up';
            message = 'Incomplete rep — reach 90° depth before rising';
            detail = `Lowest depth: ${repCycleRef.current.minElbowAngle}° (Required: ≤95°)`;
            status = 'warning';
            score = 70;
          } else if (smoothedAngle <= 95) {
            // Reached Bottom
            repStateRef.current = 'BOTTOM';
            repCycleRef.current.bottomReachedMs = now;
            bottomEntryTimeRef.current = now;
            phase = 'inflection';
            message = 'Target depth reached! Drive up';
            detail = `Optimal 90° depth achieved (${smoothedAngle}°). Explode through palms.`;
            status = 'optimal';
            score = 100;
          } else {
            // Continuing descent
            if (hasAlignmentError) {
              status = 'warning';
              message = isSagging ? 'Hips sagging on descent' : 'Keep hips level';
              detail = `Depth: ${smoothedAngle}° • Spine: ${smoothedBodyPlane}°`;
              score = 82;
            } else {
              message = 'Lowering chest — descend deeper';
              detail = `Current depth: ${smoothedAngle}° (Target: ≤90°)`;
              status = 'optimal';
              score = 94;
            }
          }
          break;
        }

        case 'BOTTOM': {
          phase = 'inflection';
          repCycleRef.current.totalFrames += 1;
          repCycleRef.current.minElbowAngle = Math.min(repCycleRef.current.minElbowAngle, smoothedAngle);
          if (hasAlignmentError) {
            repCycleRef.current.bodyPlaneViolationFrames += 1;
          }

          const dwellDurationMs = now - bottomEntryTimeRef.current;

          // Transition to ASCENDING when elbow starts opening (>105°) with minimum bottom dwell
          if (smoothedAngle > 105 && dwellDurationMs >= 80) {
            repStateRef.current = 'ASCENDING';
            repCycleRef.current.ascentStartMs = now;
            phase = 'up';
            message = 'Driving upward — maintain rigid plank';
            detail = 'Push through palms to complete lockout (160°)';
            status = hasAlignmentError ? 'warning' : 'optimal';
            score = 96;
          } else {
            message = 'Optimal bottom depth! Push up';
            detail = `Elbow depth: ${smoothedAngle}° (Target: ≤90°)`;
            status = 'optimal';
            score = 98;
          }
          break;
        }

        case 'ASCENDING': {
          phase = 'up';
          repCycleRef.current.totalFrames += 1;
          if (hasAlignmentError) {
            repCycleRef.current.bodyPlaneViolationFrames += 1;
          }

          // Check if user stalled and dropped back to bottom
          if (smoothedAngle <= 95) {
            repStateRef.current = 'BOTTOM';
            bottomEntryTimeRef.current = now;
            phase = 'inflection';
            message = 'Don’t stop! Push all the way up';
            detail = 'Re-engaging push from bottom position';
            status = 'warning';
            score = 78;
          } else if (smoothedAngle >= 150) {
            // Reached lockout -> Evaluate and Count Rep!
            const cooldownPassed = (now - lastRepTimestampRef.current) >= 300;
            if (cooldownPassed) {
              const cycle = repCycleRef.current;

              // 1. Depth Quality (40 pts)
              let depthScore = 20;
              if (cycle.minElbowAngle <= 90) depthScore = 40;
              else if (cycle.minElbowAngle <= 95) depthScore = 35;
              else if (cycle.minElbowAngle <= 100) depthScore = 28;

              // 2. Lockout Quality (20 pts)
              let lockoutScore = 14;
              if (smoothedAngle >= 160) lockoutScore = 20;
              else if (smoothedAngle >= 150) lockoutScore = 17;

              // 3. Body Alignment Quality (25 pts)
              const violationRatio = cycle.bodyPlaneViolationFrames / Math.max(1, cycle.totalFrames);
              let alignmentScore = 25;
              if (violationRatio > 0.4) alignmentScore = 8;
              else if (violationRatio > 0.2) alignmentScore = 15;
              else if (violationRatio > 0.05) alignmentScore = 20;

              // 4. Tempo & Cadence Quality (15 pts)
              const totalRepTimeSec = Math.max(0.5, (now - cycle.descentStartMs) / 1000);
              let tempoScore = 8;
              if (totalRepTimeSec >= 1.5 && totalRepTimeSec <= 4.0) tempoScore = 15;
              else if (totalRepTimeSec >= 1.0 && totalRepTimeSec <= 5.5) tempoScore = 11;

              const repQuality = Math.min(100, Math.max(50, depthScore + lockoutScore + alignmentScore + tempoScore));

              registerCompletedRep(repQuality);
              lastRepTimestampRef.current = now;
              repStateRef.current = 'LOCKOUT';

              message = repQuality >= 90 ? 'Verified Rep! Flawless biomechanics' : 'Verified Rep! Maintain spine rigidity';
              detail = `Depth: ${cycle.minElbowAngle}° • Tempo: ${totalRepTimeSec.toFixed(1)}s • Score: ${repQuality}%`;
              status = 'optimal';
              score = repQuality;
            } else {
              // Within cooldown
              message = 'Full lockout reached';
              detail = 'Hold posture for next rep';
              status = 'optimal';
              score = 96;
            }
          } else {
            // Continuing ascent
            if (hasAlignmentError) {
              status = 'warning';
              message = isSagging ? 'Hips sagging on ascent' : 'Keep hips in line';
              detail = `Ascent angle: ${smoothedAngle}° • Spine: ${smoothedBodyPlane}°`;
              score = 84;
            } else {
              message = 'Driving up — lock out arms';
              detail = `Ascent: ${smoothedAngle}° (Target: ≥150°)`;
              status = 'optimal';
              score = 94;
            }
          }
          break;
        }
      }

      const feedback: PostureFeedback = {
        status,
        message,
        detail,
        score,
        repCount,
        phase,
        machineState: repStateRef.current,
      };

      updatePoseFrame(angles, feedback);
    },
    [selectedExercise, repCount, registerCompletedRep, updatePoseFrame]
  );

  /**
   * Handle real MediaPipe pose landmark results
   */
  const handlePoseResults = useCallback(
    (results: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!results.poseLandmarks || results.poseLandmarks.length === 0) {
        return;
      }

      const landmarks: Landmark[] = results.poseLandmarks;
      const angles = extractPoseAngles(landmarks);

      if (angles) {
        evaluateKinematics(angles);
      }

      // Draw skeleton & landmarks if enabled
      if (showSkeleton) {
        drawSkeletalOverlay(ctx, landmarks, width, height, angles);
      }
    },
    [showSkeleton, evaluateKinematics]
  );

  /**
   * Render skeletal points, connections & real-time angle gauges on canvas
   */
  const drawSkeletalOverlay = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number,
    angles: PoseAngles | null
  ) => {
    // MediaPipe pose connections pairs
    const CONNECTIONS = [
      [11, 12], // shoulders
      [11, 13], [13, 15], // left arm
      [12, 14], [14, 16], // right arm
      [11, 23], [12, 24], // torso sides
      [23, 24], // hips
      [23, 25], [25, 27], // left leg
      [24, 26], [26, 28], // right leg
    ];

    const isGoodForm = postureFeedback.status === 'optimal';
    const primaryColor = isGoodForm ? '#10b981' : '#39b8fd';
    const warningColor = '#ef4444';

    // 1. Draw connection bones
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      if (!p1 || !p2 || (p1.visibility || 0) < 0.3 || (p2.visibility || 0) < 0.3) return;

      const grad = ctx.createLinearGradient(p1.x * width, p1.y * height, p2.x * width, p2.y * height);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, '#006c49');

      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    });

    // 2. Draw keypoint joint nodes
    const KEY_JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
    KEY_JOINTS.forEach((idx) => {
      const lm = landmarks[idx];
      if (!lm || (lm.visibility || 0) < 0.3) return;

      const x = lm.x * width;
      const y = lm.y * height;

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.fill();

      // Inner solid node
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();
    });

    // 3. Draw angle tags on screen
    if (showAngleBadges && angles) {
      const leftElbow = landmarks[13];
      if (leftElbow && (leftElbow.visibility || 0) > 0.4) {
        drawAngleBadge(ctx, leftElbow.x * width, leftElbow.y * height, `${angles.avgElbow}°`, primaryColor);
      }

      const leftHip = landmarks[23];
      if (leftHip && (leftHip.visibility || 0) > 0.4) {
        drawAngleBadge(ctx, leftHip.x * width, leftHip.y * height, `${angles.bodyPlane}° Plane`, '#0EA5E9');
      }
    }
  };

  /**
   * Helper to draw clean Pill badge on canvas
   */
  const drawAngleBadge = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    bgColor: string
  ) => {
    ctx.save();
    ctx.font = 'bold 12px Inter, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padding = 6;
    const badgeW = textWidth + padding * 2;
    const badgeH = 22;

    const bx = Math.min(Math.max(10, x + 12), ctx.canvas.width - badgeW - 10);
    const by = Math.min(Math.max(10, y - 10), ctx.canvas.height - badgeH - 10);

    // Pill background
    ctx.fillStyle = 'rgba(11, 28, 48, 0.85)';
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 11);
    ctx.fill();

    // Border
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, bx + padding, by + 15);
    ctx.restore();
  };

  /**
   * Synthetic Simulation Mode for testing or when camera is offline
   */
  const runDemoSimulation = () => {
    // Oscillate angle between 165° (up) and 82° (down) with natural human cadence and bottom dwell
    let current = simAngleRef.current;
    if (simDirectionRef.current === -1) {
      current -= 2.0;
      if (current <= 82) {
        current = 82;
        simBottomHoldRef.current += 1;
        // Hold bottom for ~6-8 frames (~100-130ms) to satisfy dwell requirement
        if (simBottomHoldRef.current >= 7) {
          simDirectionRef.current = 1;
          simBottomHoldRef.current = 0;
        }
      }
    } else {
      current += 2.2;
      if (current >= 165) {
        current = 165;
        simDirectionRef.current = -1;
      }
    }
    simAngleRef.current = current;

    const fakeAngles: PoseAngles = {
      leftElbow: Math.round(current),
      rightElbow: Math.round(current),
      avgElbow: Math.round(current),
      bodyPlane: 178,
      hipAngle: 176,
      kneeAngle: Math.round(current),
    };

    evaluateKinematics(fakeAngles);

    // Draw simulation skeleton
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Draw high-tech futuristic grid background
    ctx.strokeStyle = 'rgba(219, 234, 254, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Dynamic arm geometry based on current simulated angle
    const norm = (current - 82) / (165 - 82); // 0 at bottom, 1 at top
    const shoulderY = 0.45 * h + (1 - norm) * 0.12 * h;
    const elbowY = 0.55 * h + (1 - norm) * 0.18 * h;
    const wristY = 0.75 * h;

    const fakeLandmarks: Landmark[] = [
      { x: 0.75, y: shoulderY - 0.08, visibility: 0.9 }, // Nose
      ...Array(10).fill({ x: 0.5, y: 0.5, visibility: 0.1 }),
      { x: 0.68, y: shoulderY, visibility: 0.95 }, // 11 L shoulder
      { x: 0.68, y: shoulderY, visibility: 0.95 }, // 12 R shoulder
      { x: 0.58, y: elbowY, visibility: 0.95 }, // 13 L elbow
      { x: 0.58, y: elbowY, visibility: 0.95 }, // 14 R elbow
      { x: 0.52, y: wristY, visibility: 0.95 }, // 15 L wrist
      { x: 0.52, y: wristY, visibility: 0.95 }, // 16 R wrist
      ...Array(6).fill({ x: 0.5, y: 0.5, visibility: 0.1 }),
      { x: 0.40, y: shoulderY + 0.05, visibility: 0.95 }, // 23 L hip
      { x: 0.40, y: shoulderY + 0.05, visibility: 0.95 }, // 24 R hip
      { x: 0.28, y: shoulderY + 0.12, visibility: 0.95 }, // 25 L knee
      { x: 0.28, y: shoulderY + 0.12, visibility: 0.95 }, // 26 R knee
      { x: 0.16, y: wristY, visibility: 0.95 }, // 27 L ankle
      { x: 0.16, y: wristY, visibility: 0.95 }, // 28 R ankle
    ];

    if (showSkeleton) {
      drawSkeletalOverlay(ctx, fakeLandmarks, w, h, fakeAngles);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-surface-container-low rounded-3xl ${className}`}>
      {/* Container aspect ratio wrapper */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-surface-container-highest/20 flex items-center justify-center overflow-hidden">
        {/* Real Webcam Video element */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
            isCameraActive && !isDemoMode ? 'opacity-90' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* High-DPI Canvas for Skeletal Nodes & Kinematics Overlay */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        />

        {/* Placeholder Screen when camera is disabled and not in demo mode */}
        {!isCameraActive && !isDemoMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-space-lg text-center z-20 bg-gradient-to-b from-surface-container-lowest/90 to-surface-container-low/95 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-primary-fixed/50 flex items-center justify-center text-primary mb-space-md shadow-sm">
              <CameraIcon className="w-8 h-8" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
              Live Pose Detection Camera
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg">
              Activate your camera or run simulation mode to detect repetition depth, cadence, and spine alignment in real-time.
            </p>

            {cameraError && (
              <div className="mb-space-md p-space-sm px-space-md rounded-2xl bg-error-container text-on-error-container text-body-sm flex items-center gap-2 max-w-md text-left">
                <AlertTriangle className="w-5 h-5 shrink-0 text-error" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-space-sm">
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all"
              >
                <CameraIcon className="w-4 h-4" />
                <span>Start Camera Feed</span>
              </button>
              <button
                onClick={() => {
                  setIsDemoMode(true);
                  setCameraActive(true);
                }}
                className="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-secondary font-label-md text-label-md border border-outline-variant/30 shadow-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Run Demo Simulation</span>
              </button>
            </div>
          </div>
        )}

        {/* Live HUD Header Overlay */}
        {(isCameraActive || isDemoMode) && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
            {/* Live Recording Badge */}
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm border border-outline-variant/30">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider">
                {isDemoMode ? 'SIMULATION MODE' : 'LIVE POSE ENGINE'}
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-md text-label-md text-primary font-semibold">
                {currentAngles.avgElbow}°
              </span>
              {postureFeedback.machineState && (
                <>
                  <span className="text-outline-variant">•</span>
                  <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-mono font-bold tracking-wider uppercase border border-primary/20">
                    {postureFeedback.machineState}
                  </span>
                </>
              )}
            </div>

            {/* Quick Action Controls */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md p-1 rounded-full shadow-sm border border-outline-variant/30">
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleVoice}
                title={voiceEnabled ? 'Mute AI Coach' : 'Enable AI Coach'}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                {voiceEnabled ? <Mic className="w-4 h-4 text-secondary" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleSkeleton}
                title="Toggle Skeleton Overlay"
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                {showSkeleton ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setIsDemoMode(false);
                }}
                title="Turn Off Camera"
                className="p-1.5 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
              >
                <CameraOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Live Bottom Telemetry Card Bar */}
        {(isCameraActive || isDemoMode) && (
          <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
            <div className="pointer-events-auto p-space-md rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-lg border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-md w-full sm:w-auto">
                {/* Big Reps Counter */}
                <div className="flex items-baseline gap-1 bg-surface-container-low px-4 py-2 rounded-xl">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface tabular-nums">
                    {repCount}
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Reps
                  </span>
                </div>

                {/* AI Posture Coach Guidance Prompt */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {postureFeedback.status === 'optimal' ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-secondary shrink-0" />
                    )}
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                      {postureFeedback.message}
                    </span>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    {postureFeedback.detail}
                  </p>
                </div>
              </div>

              {/* Form Readiness / Score Indicator */}
              <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Form Score
                  </div>
                  <div className="font-headline-md text-headline-md font-bold text-primary tabular-nums">
                    {formScore}%
                  </div>
                </div>

                <button
                  onClick={calibratePose}
                  className="px-space-md py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">tune</span>
                  <span>{isCalibrated ? 'Recalibrate' : 'Calibrate'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
