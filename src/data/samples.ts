import { PoseLandmarks } from '../lib/fittingCalc';

export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  category: 'Optimal' | 'Low Saddle' | 'High Saddle' | 'KOPS Forward' | 'Long Reach';
  phase: 'BDC' | 'KOPS_3_OCLOCK';
  side: 'left' | 'right';
  landmarks: PoseLandmarks;
  bikeModelId?: string;
  bikeSize?: string;
  notes: string;
}

// Coordinate space: 800 x 600 canvas (Facing Left: Front wheel on left, Rear wheel on right)
// Hip around (480, 240)
// Crank BB around (450, 430)
// Handlebar around (250, 230)

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'optimal-bdc',
    name: '최적의 하사점 (Optimal BDC)',
    description: '무릎 각도 약 145°로 페달 하사점(6시)에서 파워 전달과 관절 보호가 완벽한 상태',
    category: 'Optimal',
    phase: 'BDC',
    side: 'left',
    landmarks: {
      leftHip: { x: 470, y: 240, visibility: 0.99 },
      rightHip: { x: 475, y: 240, visibility: 0.8 },
      leftKnee: { x: 420, y: 350, visibility: 0.99 },
      rightKnee: { x: 440, y: 310, visibility: 0.8 },
      leftAnkle: { x: 435, y: 465, visibility: 0.99 },
      rightAnkle: { x: 450, y: 330, visibility: 0.8 },
      leftFootIndex: { x: 385, y: 480, visibility: 0.95 },
      rightFootIndex: { x: 400, y: 340, visibility: 0.8 },
      leftHeel: { x: 460, y: 470, visibility: 0.95 },
      rightHeel: { x: 470, y: 340, visibility: 0.8 },
      leftShoulder: { x: 310, y: 200, visibility: 0.99 },
      rightShoulder: { x: 315, y: 200, visibility: 0.8 },
      leftElbow: { x: 260, y: 250, visibility: 0.98 },
      rightElbow: { x: 265, y: 250, visibility: 0.8 },
      leftWrist: { x: 235, y: 245, visibility: 0.98 },
      rightWrist: { x: 240, y: 245, visibility: 0.8 },
    },
    bikeModelId: 'specialized-tarmac-sl8',
    bikeSize: '54',
    notes: '무릎 각도 144.5°, 팔꿈치 155° 굽힘으로 매우 이상적인 로드 라이딩 자세입니다.',
  },
  {
    id: 'low-saddle-bdc',
    name: '안장 낮음 (Low Saddle)',
    description: '안장이 낮아 무릎이 133°까지만 펴지며, 장시간 주행 시 앞무릎(슬개골) 통증 유발',
    category: 'Low Saddle',
    phase: 'BDC',
    side: 'left',
    landmarks: {
      leftHip: { x: 470, y: 265, visibility: 0.99 }, // lower hip
      rightHip: { x: 475, y: 265, visibility: 0.8 },
      leftKnee: { x: 410, y: 365, visibility: 0.99 },
      rightKnee: { x: 430, y: 320, visibility: 0.8 },
      leftAnkle: { x: 435, y: 465, visibility: 0.99 },
      rightAnkle: { x: 450, y: 330, visibility: 0.8 },
      leftFootIndex: { x: 385, y: 480, visibility: 0.95 },
      rightFootIndex: { x: 400, y: 340, visibility: 0.8 },
      leftHeel: { x: 460, y: 470, visibility: 0.95 },
      rightHeel: { x: 470, y: 340, visibility: 0.8 },
      leftShoulder: { x: 310, y: 205, visibility: 0.99 },
      rightShoulder: { x: 315, y: 205, visibility: 0.8 },
      leftElbow: { x: 260, y: 255, visibility: 0.98 },
      rightElbow: { x: 265, y: 255, visibility: 0.8 },
      leftWrist: { x: 235, y: 245, visibility: 0.98 },
      rightWrist: { x: 240, y: 245, visibility: 0.8 },
    },
    bikeModelId: 'trek-madone-gen8',
    bikeSize: 'M',
    notes: '무릎 각도가 133°로 12° 부족합니다. 안장을 약 +28mm~30mm 올리는 피팅이 권장됩니다.',
  },
  {
    id: 'high-saddle-bdc',
    name: '안장 높음 (High Saddle)',
    description: '안장이 과도하게 높아 무릎 각도가 154°에 달하며 골반 흔들림과 햄스트링 과긴장 발생',
    category: 'High Saddle',
    phase: 'BDC',
    side: 'left',
    landmarks: {
      leftHip: { x: 470, y: 215, visibility: 0.99 }, // higher hip
      rightHip: { x: 475, y: 215, visibility: 0.8 },
      leftKnee: { x: 435, y: 340, visibility: 0.99 },
      rightKnee: { x: 450, y: 300, visibility: 0.8 },
      leftAnkle: { x: 435, y: 465, visibility: 0.99 },
      rightAnkle: { x: 450, y: 330, visibility: 0.8 },
      leftFootIndex: { x: 385, y: 480, visibility: 0.95 },
      rightFootIndex: { x: 400, y: 340, visibility: 0.8 },
      leftHeel: { x: 460, y: 470, visibility: 0.95 },
      rightHeel: { x: 470, y: 340, visibility: 0.8 },
      leftShoulder: { x: 310, y: 195, visibility: 0.99 },
      rightShoulder: { x: 315, y: 195, visibility: 0.8 },
      leftElbow: { x: 260, y: 248, visibility: 0.98 },
      rightElbow: { x: 265, y: 248, visibility: 0.8 },
      leftWrist: { x: 235, y: 245, visibility: 0.98 },
      rightWrist: { x: 240, y: 245, visibility: 0.8 },
    },
    bikeModelId: 'giant-tcr-adv-sl',
    bikeSize: 'M',
    notes: '무릎 각도가 154°로 과신전 상태입니다. 안장을 약 -22mm 낮춰 안정성을 확보하세요.',
  },
  {
    id: 'optimal-kops',
    name: '최적의 KOPS (3시 방향)',
    description: '크랭크 3시 방향(전방 수평)에서 무릎 앞단 수직선이 페달 스핀들(축)과 정확히 일치',
    category: 'Optimal',
    phase: 'KOPS_3_OCLOCK',
    side: 'left',
    landmarks: {
      leftHip: { x: 470, y: 240, visibility: 0.99 },
      rightHip: { x: 475, y: 240, visibility: 0.8 },
      leftKnee: { x: 360, y: 330, visibility: 0.99 },
      rightKnee: { x: 460, y: 340, visibility: 0.8 },
      leftAnkle: { x: 350, y: 410, visibility: 0.99 },
      rightAnkle: { x: 470, y: 430, visibility: 0.8 },
      leftFootIndex: { x: 320, y: 420, visibility: 0.95 }, // Pedal spindle ~ (350*0.4 + 320*0.6) = 332
      rightFootIndex: { x: 490, y: 440, visibility: 0.8 },
      leftHeel: { x: 380, y: 405, visibility: 0.95 },
      rightHeel: { x: 450, y: 430, visibility: 0.8 },
      leftShoulder: { x: 310, y: 200, visibility: 0.99 },
      rightShoulder: { x: 315, y: 200, visibility: 0.8 },
      leftElbow: { x: 260, y: 250, visibility: 0.98 },
      rightElbow: { x: 265, y: 250, visibility: 0.8 },
      leftWrist: { x: 235, y: 245, visibility: 0.98 },
      rightWrist: { x: 240, y: 245, visibility: 0.8 },
    },
    bikeModelId: 'canyon-aeroad-cfr',
    bikeSize: 'M',
    notes: 'KOPS 오차가 거의 0에 수렴하여 페달을 아래로 누를 때 무릎에 전단력 없이 최대 파워가 발생합니다.',
  },
  {
    id: 'kops-too-forward',
    name: '안장 전진 과다 (KOPS Forward)',
    description: '안장이 과도하게 앞으로 전진되어 무릎이 페달 축보다 35mm 이상 앞으로 쏠림',
    category: 'KOPS Forward',
    phase: 'KOPS_3_OCLOCK',
    side: 'left',
    landmarks: {
      leftHip: { x: 425, y: 240, visibility: 0.99 }, // saddle shifted forward
      rightHip: { x: 430, y: 240, visibility: 0.8 },
      leftKnee: { x: 315, y: 330, visibility: 0.99 }, // knee way forward
      rightKnee: { x: 420, y: 340, visibility: 0.8 },
      leftAnkle: { x: 350, y: 410, visibility: 0.99 },
      rightAnkle: { x: 470, y: 430, visibility: 0.8 },
      leftFootIndex: { x: 320, y: 420, visibility: 0.95 },
      rightFootIndex: { x: 490, y: 440, visibility: 0.8 },
      leftHeel: { x: 380, y: 405, visibility: 0.95 },
      rightHeel: { x: 450, y: 430, visibility: 0.8 },
      leftShoulder: { x: 290, y: 200, visibility: 0.99 },
      rightShoulder: { x: 295, y: 200, visibility: 0.8 },
      leftElbow: { x: 255, y: 250, visibility: 0.98 },
      rightElbow: { x: 260, y: 250, visibility: 0.8 },
      leftWrist: { x: 235, y: 245, visibility: 0.98 },
      rightWrist: { x: 240, y: 245, visibility: 0.8 },
    },
    bikeModelId: 'specialized-tarmac-sl8',
    bikeSize: '54',
    notes: '무릎이 페달 축보다 많이 앞서있습니다. 안장 레일을 뒤로 20mm 밀어 셋백(Setback)을 확보하세요.',
  },
  {
    id: 'long-reach-stretched',
    name: '리치 과다 & 팔 펴짐 (Over-stretched)',
    description: '스템이 너무 길거나 탑튜브가 길어 팔이 175°로 펴지고 어깨와 목에 과도한 하중 전달',
    category: 'Long Reach',
    phase: 'BDC',
    side: 'left',
    landmarks: {
      leftHip: { x: 480, y: 240, visibility: 0.99 },
      rightHip: { x: 485, y: 240, visibility: 0.8 },
      leftKnee: { x: 425, y: 350, visibility: 0.99 },
      rightKnee: { x: 445, y: 310, visibility: 0.8 },
      leftAnkle: { x: 435, y: 465, visibility: 0.99 },
      rightAnkle: { x: 450, y: 330, visibility: 0.8 },
      leftFootIndex: { x: 385, y: 480, visibility: 0.95 },
      rightFootIndex: { x: 400, y: 340, visibility: 0.8 },
      leftHeel: { x: 460, y: 470, visibility: 0.95 },
      rightHeel: { x: 470, y: 340, visibility: 0.8 },
      leftShoulder: { x: 315, y: 220, visibility: 0.99 },
      rightShoulder: { x: 320, y: 220, visibility: 0.8 },
      leftElbow: { x: 245, y: 235, visibility: 0.98 }, // locked elbow
      rightElbow: { x: 250, y: 235, visibility: 0.8 },
      leftWrist: { x: 180, y: 245, visibility: 0.98 }, // handlebar far forward
      rightWrist: { x: 185, y: 245, visibility: 0.8 },
    },
    bikeModelId: 'pinarello-dogma-f',
    bikeSize: '560',
    notes: '팔이 174°로 잠겨있어 노면 충격을 어깨와 목으로 흡수하게 됩니다. 스템을 20mm 줄이거나 스택을 올리세요.',
  }
];
