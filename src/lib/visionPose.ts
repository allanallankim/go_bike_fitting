import { PoseLandmarks, Point2D } from './fittingCalc';

// MediaPipe 33 Landmark indices:
// 11: left_shoulder, 12: right_shoulder
// 13: left_elbow, 14: right_elbow
// 15: left_wrist, 16: right_wrist
// 23: left_hip, 24: right_hip
// 25: left_knee, 26: right_knee
// 27: left_ankle, 28: right_ankle
// 29: left_heel, 30: right_heel
// 31: left_foot_index, 32: right_foot_index

export interface RawLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export function convertMediaPipeLandmarks(
  rawList: RawLandmark[],
  width: number,
  height: number
): PoseLandmarks | null {
  if (!rawList || rawList.length < 33) return null;

  const toPoint = (lm: RawLandmark): Point2D => ({
    x: lm.x * width,
    y: lm.y * height,
    visibility: lm.visibility ?? 1.0,
  });

  return {
    leftShoulder: toPoint(rawList[11]),
    rightShoulder: toPoint(rawList[12]),
    leftElbow: toPoint(rawList[13]),
    rightElbow: toPoint(rawList[14]),
    leftWrist: toPoint(rawList[15]),
    rightWrist: toPoint(rawList[16]),
    leftHip: toPoint(rawList[23]),
    rightHip: toPoint(rawList[24]),
    leftKnee: toPoint(rawList[25]),
    rightKnee: toPoint(rawList[26]),
    leftAnkle: toPoint(rawList[27]),
    rightAnkle: toPoint(rawList[28]),
    leftHeel: toPoint(rawList[29]),
    rightHeel: toPoint(rawList[30]),
    leftFootIndex: toPoint(rawList[31]),
    rightFootIndex: toPoint(rawList[32]),
  };
}

// Global reference for singleton PoseLandmarker instance
let poseLandmarkerInstance: any = null;
let isInitializing = false;

export async function getPoseLandmarker() {
  if (poseLandmarkerInstance) return poseLandmarkerInstance;
  if (typeof window === 'undefined') return null;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(r => setTimeout(r, 100));
    }
    return poseLandmarkerInstance;
  }

  isInitializing = true;
  try {
    const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return poseLandmarkerInstance;
  } catch (err) {
    console.warn('Failed to load GPU MediaPipe, attempting CPU fallback...', err);
    try {
      const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      return poseLandmarkerInstance;
    } catch (fallbackErr) {
      console.error('MediaPipe pose landmarker completely failed to initialize:', fallbackErr);
      return null;
    }
  } finally {
    isInitializing = false;
  }
}
