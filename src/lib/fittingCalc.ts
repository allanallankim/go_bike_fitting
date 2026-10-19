export interface Point2D {
  x: number;
  y: number;
  visibility?: number;
}

export interface PoseLandmarks {
  leftShoulder: Point2D;
  rightShoulder: Point2D;
  leftElbow: Point2D;
  rightElbow: Point2D;
  leftWrist: Point2D;
  rightWrist: Point2D;
  leftHip: Point2D;
  rightHip: Point2D;
  leftKnee: Point2D;
  rightKnee: Point2D;
  leftAnkle: Point2D;
  rightAnkle: Point2D;
  leftHeel?: Point2D;
  rightHeel?: Point2D;
  leftFootIndex?: Point2D;
  rightFootIndex?: Point2D;
}

export type RiderSide = 'left' | 'right';

export interface FittingMetrics {
  kneeAngle: number;         // degrees (Hip-Knee-Ankle extension)
  torsoAngle: number;        // degrees from horizontal (Hip-Shoulder)
  elbowAngle: number;        // degrees (Shoulder-Elbow-Wrist)
  shoulderAngle: number;     // degrees (Torso to Upper Arm)
  kopsOffsetMm: number | null; // mm (positive = knee ahead of pedal spindle)
  kopsOffsetPx: number;      // pixels
  saddleHeightDiffMm: number;// Recommended change (+ means raise, - means lower)
  saddleForeAftDiffMm: number;// Recommended change (+ means move forward, - means move back)
  reachDiffMm: number;       // Recommended reach change (+ means increase stem/reach)
  score: number;             // Overall fitting score 0 ~ 100
  kneeStatus: 'OPTIMAL' | 'LOW' | 'HIGH';
  kopsStatus: 'OPTIMAL' | 'TOO_FORWARD' | 'TOO_BACK' | 'UNKNOWN';
  reachStatus: 'OPTIMAL' | 'TOO_LONG' | 'TOO_SHORT';
  pedalingPhase: 'BDC' | 'KOPS_3_OCLOCK' | 'TOP' | 'TRANSITION';
}

/**
 * Calculate angle ABC (in degrees) where B is the vertex
 */
export function calculateAngle(A: Point2D, B: Point2D, C: Point2D): number {
  const v1 = { x: A.x - B.x, y: A.y - B.y };
  const v2 = { x: C.x - B.x, y: C.y - B.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
}

/**
 * Calculate angle of line AB with respect to the horizontal axis (in degrees)
 * B is typically shoulder, A is hip (Torso angle)
 */
export function calculateAngleFromHorizontal(hip: Point2D, shoulder: Point2D): number {
  const dx = Math.abs(shoulder.x - hip.x);
  const dy = Math.abs(shoulder.y - hip.y); // in screen coords, Y goes downward
  const rad = Math.atan2(dy, dx);
  return (rad * 180) / Math.PI;
}

/**
 * Calculate Euclidean distance between two points in pixels
 */
export function calculateDistance(p1: Point2D, p2: Point2D): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Detect whether the rider is facing left or right based on shoulder vs hip or ankle
 */
export function detectRiderFacing(landmarks: PoseLandmarks, activeSide: RiderSide): 'left' | 'right' {
  const shoulder = activeSide === 'left' ? landmarks.leftShoulder : landmarks.rightShoulder;
  const hip = activeSide === 'left' ? landmarks.leftHip : landmarks.rightHip;
  // If shoulder is to the left of hip, rider faces left
  return shoulder.x < hip.x ? 'left' : 'right';
}

/**
 * Estimate active side (Left or Right) based on keypoint visibility/confidence
 */
export function detectBestSide(landmarks: PoseLandmarks): RiderSide {
  const leftVis = ((landmarks.leftKnee?.visibility ?? 0.5) + (landmarks.leftAnkle?.visibility ?? 0.5) + (landmarks.leftHip?.visibility ?? 0.5)) / 3;
  const rightVis = ((landmarks.rightKnee?.visibility ?? 0.5) + (landmarks.rightAnkle?.visibility ?? 0.5) + (landmarks.rightHip?.visibility ?? 0.5)) / 3;
  return leftVis >= rightVis ? 'left' : 'right';
}

/**
 * Analyze all bike fitting metrics from landmarks
 * @param landmarks Pose keypoints
 * @param side 'left' or 'right'
 * @param mmPerPixel Calibration factor (mm per screen pixel)
 * @param ridingStyle 'All-Round' | 'Endurance' | 'Aero'
 */
export function analyzeFitting(
  landmarks: PoseLandmarks,
  side: RiderSide = 'left',
  mmPerPixel: number = 1.0,
  ridingStyle: 'All-Round' | 'Endurance' | 'Aero' = 'All-Round'
): FittingMetrics {
  const hip = side === 'left' ? landmarks.leftHip : landmarks.rightHip;
  const knee = side === 'left' ? landmarks.leftKnee : landmarks.rightKnee;
  const ankle = side === 'left' ? landmarks.leftAnkle : landmarks.rightAnkle;
  const footIndex = side === 'left' ? landmarks.leftFootIndex : landmarks.rightFootIndex;
  const shoulder = side === 'left' ? landmarks.leftShoulder : landmarks.rightShoulder;
  const elbow = side === 'left' ? landmarks.leftElbow : landmarks.rightElbow;
  const wrist = side === 'left' ? landmarks.leftWrist : landmarks.rightWrist;

  // 1. Knee Extension Angle (Hip - Knee - Ankle)
  const kneeAngle = calculateAngle(hip, knee, ankle);

  // 2. Torso Angle (Horizontal to Hip-Shoulder)
  const torsoAngle = calculateAngleFromHorizontal(hip, shoulder);

  // 3. Elbow Angle (Shoulder - Elbow - Wrist)
  const elbowAngle = calculateAngle(shoulder, elbow, wrist);

  // 4. Shoulder Angle (Torso vector vs Shoulder-Elbow vector)
  const shoulderAngle = calculateAngle(hip, shoulder, elbow);

  // Detect direction facing
  const facing = detectRiderFacing(landmarks, side);

  // Approximate Pedal Spindle position:
  // Usually the ball of the foot (Metatarsal head) is directly above the pedal spindle.
  // We can use footIndex (toe) and ankle interpolation (approx 50% between ankle and footIndex)
  const pedalX = footIndex ? (ankle.x * 0.4 + footIndex.x * 0.6) : ankle.x;

  // KOPS offset in pixels:
  // Forward means knee is towards front of the bike compared to pedal spindle
  let kopsOffsetPx = 0;
  if (facing === 'left') {
    // Front is to the left (smaller X)
    kopsOffsetPx = pedalX - knee.x; 
  } else {
    // Front is to the right (larger X)
    kopsOffsetPx = knee.x - pedalX;
  }
  const kopsOffsetMm = mmPerPixel > 0 ? kopsOffsetPx * mmPerPixel : null;

  // Determine pedaling phase:
  // BDC (Bottom Dead Center): Ankle Y is maximum (lowest point) or knee angle is maximum (> 135)
  // 3 O'clock (KOPS): Foot is positioned horizontally forward from bottom bracket
  let pedalingPhase: 'BDC' | 'KOPS_3_OCLOCK' | 'TOP' | 'TRANSITION' = 'TRANSITION';
  if (kneeAngle >= 135) {
    pedalingPhase = 'BDC';
  } else if (Math.abs(kopsOffsetPx) < 40 && knee.y < ankle.y) {
    pedalingPhase = 'KOPS_3_OCLOCK';
  } else if (kneeAngle < 85) {
    pedalingPhase = 'TOP';
  }

  // Target ranges:
  const targetKneeMin = 140;
  const targetKneeMax = 150;
  const targetKneeOptimal = 145;

  let kneeStatus: 'OPTIMAL' | 'LOW' | 'HIGH' = 'OPTIMAL';
  let saddleHeightDiffMm = 0;

  if (kneeAngle < targetKneeMin) {
    kneeStatus = 'LOW';
    // Saddle needs to be raised: roughly ~2.5mm per degree
    const angleDiff = targetKneeOptimal - kneeAngle;
    saddleHeightDiffMm = Math.round(angleDiff * 2.6);
  } else if (kneeAngle > targetKneeMax) {
    kneeStatus = 'HIGH';
    // Saddle needs to be lowered
    const angleDiff = kneeAngle - targetKneeOptimal;
    saddleHeightDiffMm = -Math.round(angleDiff * 2.6);
  } else {
    kneeStatus = 'OPTIMAL';
    saddleHeightDiffMm = 0;
  }

  // KOPS Evaluation (-10mm ~ +10mm is considered balanced)
  let kopsStatus: 'OPTIMAL' | 'TOO_FORWARD' | 'TOO_BACK' | 'UNKNOWN' = 'OPTIMAL';
  let saddleForeAftDiffMm = 0;
  const effectiveKopsMm = kopsOffsetMm ?? (kopsOffsetPx * 0.8); // fallback estimate if not calibrated

  if (effectiveKopsMm > 12) {
    kopsStatus = 'TOO_FORWARD';
    // Knee is ahead of pedal -> Saddle should slide backwards
    saddleForeAftDiffMm = -Math.round(effectiveKopsMm);
  } else if (effectiveKopsMm < -12) {
    kopsStatus = 'TOO_BACK';
    // Knee is behind pedal -> Saddle should slide forwards
    saddleForeAftDiffMm = Math.round(Math.abs(effectiveKopsMm));
  } else {
    kopsStatus = 'OPTIMAL';
    saddleForeAftDiffMm = 0;
  }

  // Reach & Cockpit Evaluation based on elbow and shoulder
  // Ideal elbow: 150° ~ 165° (slight bend)
  // Ideal shoulder: 80° ~ 95°
  let reachStatus: 'OPTIMAL' | 'TOO_LONG' | 'TOO_SHORT' = 'OPTIMAL';
  let reachDiffMm = 0;

  if (elbowAngle > 165 || shoulderAngle > 95) {
    reachStatus = 'TOO_LONG';
    // Arms locked or stretched out -> shorten stem
    reachDiffMm = -15;
  } else if (elbowAngle < 140 && torsoAngle > 48) {
    reachStatus = 'TOO_SHORT';
    // Too cramped -> lengthen stem
    reachDiffMm = 15;
  } else {
    reachStatus = 'OPTIMAL';
    reachDiffMm = 0;
  }

  // Compute Overall Fitting Score (0 ~ 100)
  let score = 100;
  // Knee penalty (up to 40 pts)
  if (kneeAngle < targetKneeMin || kneeAngle > targetKneeMax) {
    const dev = Math.min(Math.abs(kneeAngle - targetKneeOptimal), 20);
    score -= dev * 2;
  }
  // KOPS penalty (up to 30 pts)
  if (Math.abs(effectiveKopsMm) > 10) {
    const dev = Math.min(Math.abs(effectiveKopsMm) - 10, 30);
    score -= dev * 1.0;
  }
  // Elbow penalty (up to 20 pts)
  if (elbowAngle > 165) {
    score -= (elbowAngle - 165) * 1.5;
  } else if (elbowAngle < 140) {
    score -= (140 - elbowAngle) * 1.0;
  }
  // Torso penalty based on riding style (up to 10 pts)
  const targetTorso = ridingStyle === 'Aero' ? 35 : ridingStyle === 'Endurance' ? 48 : 42;
  const torsoDev = Math.abs(torsoAngle - targetTorso);
  if (torsoDev > 10) {
    score -= Math.min(torsoDev - 10, 10);
  }

  score = Math.max(20, Math.min(100, Math.round(score)));

  return {
    kneeAngle: Math.round(kneeAngle * 10) / 10,
    torsoAngle: Math.round(torsoAngle * 10) / 10,
    elbowAngle: Math.round(elbowAngle * 10) / 10,
    shoulderAngle: Math.round(shoulderAngle * 10) / 10,
    kopsOffsetMm: kopsOffsetMm !== null ? Math.round(kopsOffsetMm * 10) / 10 : null,
    kopsOffsetPx: Math.round(kopsOffsetPx * 10) / 10,
    saddleHeightDiffMm,
    saddleForeAftDiffMm,
    reachDiffMm,
    score,
    kneeStatus,
    kopsStatus,
    reachStatus,
    pedalingPhase,
  };
}
