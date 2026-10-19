import { PoseLandmarks, RiderSide, Point2D, FittingMetrics } from './fittingCalc';

export interface CalibrationPin {
  p1: Point2D;
  p2: Point2D;
  knownDistanceMm: number;
  label: string;
}

export function drawPoseOverlay(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmarks,
  side: RiderSide,
  metrics: FittingMetrics | null,
  showAngles: boolean = true,
  showKopsPlumb: boolean = true,
  showSkeleton: boolean = true,
  activeDraggingKey: string | null = null,
  hoverKey: string | null = null
) {
  const isLeft = side === 'left';
  const hip = isLeft ? landmarks.leftHip : landmarks.rightHip;
  const knee = isLeft ? landmarks.leftKnee : landmarks.rightKnee;
  const ankle = isLeft ? landmarks.leftAnkle : landmarks.rightAnkle;
  const footIndex = isLeft ? landmarks.leftFootIndex : landmarks.rightFootIndex;
  const shoulder = isLeft ? landmarks.leftShoulder : landmarks.rightShoulder;
  const elbow = isLeft ? landmarks.leftElbow : landmarks.rightElbow;
  const wrist = isLeft ? landmarks.leftWrist : landmarks.rightWrist;
  const heel = isLeft ? landmarks.leftHeel : landmarks.rightHeel;

  // Background/Inactive side (dimmed)
  const oppHip = !isLeft ? landmarks.leftHip : landmarks.rightHip;
  const oppKnee = !isLeft ? landmarks.leftKnee : landmarks.rightKnee;
  const oppAnkle = !isLeft ? landmarks.leftAnkle : landmarks.rightAnkle;
  const oppShoulder = !isLeft ? landmarks.leftShoulder : landmarks.rightShoulder;
  const oppElbow = !isLeft ? landmarks.leftElbow : landmarks.rightElbow;
  const oppWrist = !isLeft ? landmarks.leftWrist : landmarks.rightWrist;

  if (showSkeleton) {
    // 1. Draw opposite side (faint ghost lines)
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 4]);

    drawLine(ctx, oppShoulder, oppElbow);
    drawLine(ctx, oppElbow, oppWrist);
    drawLine(ctx, oppShoulder, oppHip);
    drawLine(ctx, oppHip, oppKnee);
    drawLine(ctx, oppKnee, oppAnkle);
    ctx.restore();

    // 2. Draw Active Skeleton with glowing gradients
    ctx.save();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Torso (Hip to Shoulder)
    ctx.strokeStyle = '#38bdf8'; // Sky blue
    drawLine(ctx, hip, shoulder);

    // Arm (Shoulder -> Elbow -> Wrist)
    ctx.strokeStyle = '#60a5fa';
    drawLine(ctx, shoulder, elbow);
    drawLine(ctx, elbow, wrist);

    // Leg (Hip -> Knee -> Ankle)
    // Knee color varies by status
    const kneeColor =
      metrics?.kneeStatus === 'OPTIMAL' ? '#4ade80' : metrics?.kneeStatus === 'LOW' ? '#fbbf24' : '#f87171';
    ctx.strokeStyle = kneeColor;
    drawLine(ctx, hip, knee);
    drawLine(ctx, knee, ankle);

    // Foot (Ankle -> Heel -> FootIndex)
    if (heel && footIndex) {
      ctx.strokeStyle = '#a78bfa';
      drawLine(ctx, ankle, heel);
      drawLine(ctx, heel, footIndex);
      drawLine(ctx, footIndex, ankle);
    }
    ctx.restore();
  }

  // 3. Draw KOPS Plumb Line (Vertical line from Knee through Pedal)
  if (showKopsPlumb && knee) {
    const pedalX = footIndex ? ankle.x * 0.4 + footIndex.x * 0.6 : ankle.x;
    const pedalY = footIndex ? Math.max(ankle.y, footIndex.y) : ankle.y;

    ctx.save();
    // Vertical plumb line from Knee downward
    const plumbColor = metrics?.kopsStatus === 'OPTIMAL' ? '#34d399' : '#f43f5e';
    ctx.strokeStyle = plumbColor;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);

    ctx.beginPath();
    ctx.moveTo(knee.x, knee.y - 15);
    ctx.lineTo(knee.x, pedalY + 30);
    ctx.stroke();

    // Pedal Spindle target vertical line
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)'; // amber
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pedalX, knee.y);
    ctx.lineTo(pedalX, pedalY + 35);
    ctx.stroke();

    // Pedal Spindle Crosshair
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(pedalX, pedalY, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pedalX - 12, pedalY);
    ctx.lineTo(pedalX + 12, pedalY);
    ctx.moveTo(pedalX, pedalY - 12);
    ctx.lineTo(pedalX, pedalY + 12);
    ctx.stroke();

    // KOPS Offset measurement bracket
    const offsetPx = knee.x - pedalX;
    if (Math.abs(offsetPx) > 2) {
      const midY = (knee.y + pedalY) / 2;
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(knee.x, midY);
      ctx.lineTo(pedalX, midY);
      ctx.stroke();

      // Text badge for KOPS
      const offsetMmText = metrics?.kopsOffsetMm !== null ? `${Math.abs(metrics!.kopsOffsetMm)}mm` : `${Math.abs(Math.round(offsetPx))}px`;
      drawBadge(
        ctx,
        (knee.x + pedalX) / 2,
        midY - 12,
        `KOPS: ${offsetMmText} ${offsetPx > 0 ? '전방' : '후방'}`,
        metrics?.kopsStatus === 'OPTIMAL' ? '#059669' : '#dc2626'
      );
    }
    ctx.restore();
  }

  // 4. Draw Angle Arcs & Labels
  if (showAngles && metrics) {
    // Knee Angle
    drawAngleArc(ctx, hip, knee, ankle, metrics.kneeAngle, `${metrics.kneeAngle}°`, metrics.kneeStatus === 'OPTIMAL' ? '#10b981' : '#f59e0b');

    // Elbow Angle
    drawAngleArc(ctx, shoulder, elbow, wrist, metrics.elbowAngle, `${metrics.elbowAngle}°`, '#38bdf8');

    // Torso Angle label
    const torsoMidX = (hip.x + shoulder.x) / 2;
    const torsoMidY = (hip.y + shoulder.y) / 2;
    drawBadge(ctx, torsoMidX, torsoMidY - 14, `상체: ${metrics.torsoAngle}°`, '#6366f1');
  }

  // 5. Draw Interactive Joint Markers
  const joints: { key: string; pt: Point2D; label: string; color: string }[] = [
    { key: isLeft ? 'leftShoulder' : 'rightShoulder', pt: shoulder, label: '어깨', color: '#38bdf8' },
    { key: isLeft ? 'leftElbow' : 'rightElbow', pt: elbow, label: '팔꿈치', color: '#60a5fa' },
    { key: isLeft ? 'leftWrist' : 'rightWrist', pt: wrist, label: '손목', color: '#93c5fd' },
    { key: isLeft ? 'leftHip' : 'rightHip', pt: hip, label: '고관절', color: '#a855f7' },
    { key: isLeft ? 'leftKnee' : 'rightKnee', pt: knee, label: '무릎', color: '#10b981' },
    { key: isLeft ? 'leftAnkle' : 'rightAnkle', pt: ankle, label: '발목', color: '#06b6d4' },
    ...(footIndex ? [{ key: isLeft ? 'leftFootIndex' : 'rightFootIndex', pt: footIndex, label: '발끝/페달', color: '#f59e0b' }] : []),
  ];

  joints.forEach(({ key, pt, label, color }) => {
    const isHovered = hoverKey === key;
    const isDragged = activeDraggingKey === key;
    const radius = isDragged ? 9 : isHovered ? 8 : 6;

    ctx.save();
    // Outer glow ring
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius + 3, 0, Math.PI * 2);
    ctx.fillStyle = isHovered || isDragged ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Main Circle
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Show label on hover
    if (isHovered || isDragged) {
      drawBadge(ctx, pt.x, pt.y - 18, label, '#1e293b');
    }
    ctx.restore();
  });
}

/**
 * Draw Scale Calibration Ruler
 */
export function drawCalibrationRuler(
  ctx: CanvasRenderingContext2D,
  pin: CalibrationPin,
  isHoveredP1: boolean,
  isHoveredP2: boolean,
  isDraggingP1: boolean,
  isDraggingP2: boolean
) {
  const { p1, p2, knownDistanceMm, label } = pin;
  const distPx = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  const mmPerPx = distPx > 0 ? (knownDistanceMm / distPx).toFixed(2) : '0';

  ctx.save();
  // Ruler guide line
  ctx.strokeStyle = '#eab308'; // Amber/Yellow
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  // Pin Handles
  const drawPin = (pt: Point2D, name: string, isHovered: boolean, isDragged: boolean) => {
    const rad = isDragged ? 11 : isHovered ? 9 : 7;
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, rad + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    drawBadge(ctx, pt.x, pt.y - 16, name, '#78350f');
    ctx.restore();
  };

  drawPin(p1, '기준 A', isHoveredP1, isDraggingP1);
  drawPin(p2, '기준 B', isHoveredP2, isDraggingP2);

  // Center Measurement Badge
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  drawBadge(
    ctx,
    midX,
    midY,
    `📏 ${label}: ${knownDistanceMm}mm (${Math.round(distPx)}px = ${mmPerPx} mm/px)`,
    '#ca8a04'
  );

  ctx.restore();
}

function drawLine(ctx: CanvasRenderingContext2D, p1: Point2D, p2: Point2D) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawBadge(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, bgColor: string) {
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  const metrics = ctx.measureText(text);
  const paddingH = 6;
  const paddingV = 3;
  const w = metrics.width + paddingH * 2;
  const h = 18;

  ctx.fillStyle = bgColor;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 4);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  A: Point2D,
  B: Point2D,
  C: Point2D,
  angleDeg: number,
  label: string,
  color: string
) {
  ctx.save();
  const radius = 28;

  const ang1 = Math.atan2(A.y - B.y, A.x - B.x);
  const ang2 = Math.atan2(C.y - B.y, C.x - B.x);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(B.x, B.y, radius, Math.min(ang1, ang2), Math.max(ang1, ang2));
  ctx.stroke();

  // Draw angle label centered between ang1 and ang2
  const midAng = (ang1 + ang2) / 2;
  const labelX = B.x + (radius + 20) * Math.cos(midAng);
  const labelY = B.y + (radius + 20) * Math.sin(midAng);
  drawBadge(ctx, labelX, labelY, label, color);
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
