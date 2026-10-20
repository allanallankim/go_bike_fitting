'use client';

import React from 'react';
import { FittingMetrics } from '../lib/fittingCalc';
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowUpRight, ArrowDownRight, Compass, Gauge, ShieldAlert } from 'lucide-react';

interface FittingDiagnosticsProps {
  metrics: FittingMetrics | null;
  ridingStyle: 'All-Round' | 'Endurance' | 'Aero';
  setRidingStyle: (style: 'All-Round' | 'Endurance' | 'Aero') => void;
  mmPerPixel: number;
}

export const FittingDiagnostics: React.FC<FittingDiagnosticsProps> = ({
  metrics,
  ridingStyle,
  setRidingStyle,
  mmPerPixel,
}) => {
  if (!metrics) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <Gauge className="w-10 h-10 mx-auto text-slate-600 mb-2 animate-pulse" />
        <p className="font-medium text-slate-300">자세 데이터를 감지하는 중입니다...</p>
        <p className="text-xs text-slate-500 mt-1">
          화면에 라이더의 측면 관절 포인트가 잘 보이도록 위치를 맞춰주세요.
        </p>
      </div>
    );
  }

  const {
    kneeAngle,
    torsoAngle,
    elbowAngle,
    shoulderAngle,
    kopsOffsetMm,
    saddleHeightDiffMm,
    saddleForeAftDiffMm,
    saddleHeightCompensationMm,
    reachDiffMm,
    score,
    kneeStatus,
    kopsStatus,
    reachStatus,
    torsoStatus,
    shoulderStatus,
    kopsLimitExceeded,
    pedalingPhase,
  } = metrics;

  return (
    <div className="space-y-4">
      {/* Top Banner: Score & Riding Style */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Circular Score Badge */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className={`transition-all duration-700 ${
                  score >= 85 ? 'stroke-emerald-400' : score >= 70 ? 'stroke-amber-400' : 'stroke-rose-500'
                }`}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - score / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-white leading-none">{score}</span>
              <span className="text-[9px] text-slate-400">SCORE</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">종합 피팅 적합도</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  score >= 85
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : score >= 70
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {score >= 85 ? '완벽/우수' : score >= 70 ? '미세 조정 필요' : '정밀 세팅 권장'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              현재 페달 상태: <strong className="text-cyan-400">{pedalingPhase === 'BDC' ? '페달 하사점 (6시)' : pedalingPhase === 'KOPS_3_OCLOCK' ? '크랭크 3시 (전방 수평)' : '페달링 회전 구간'}</strong>
            </p>
          </div>
        </div>

        {/* Riding Style Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['All-Round', 'Endurance', 'Aero'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setRidingStyle(style)}
              className={`px-2.5 py-1 rounded-lg transition ${
                ridingStyle === style
                  ? 'bg-slate-800 text-cyan-400 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {style === 'All-Round' ? '올라운드' : style === 'Endurance' ? '엔듀런스' : '에어로'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 3 Major Diagnostics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Knee Extension (Saddle Height) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                무릎 신전 각도 (하사점)
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  kneeStatus === 'OPTIMAL'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : kneeStatus === 'LOW'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {kneeStatus === 'OPTIMAL' ? '적정' : kneeStatus === 'LOW' ? '안장 낮음' : '안장 높음'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{kneeAngle}°</span>
              <span className="text-xs text-slate-400">목표: 140° ~ 150°</span>
            </div>

            {/* Visual Bar Gauge */}
            <div className="space-y-1 mb-3">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                {/* 120 ~ 140 (Low) */}
                <div className="w-[33%] bg-amber-500/40" title="Low Saddle" />
                {/* 140 ~ 150 (Optimal) */}
                <div className="w-[34%] bg-emerald-500" title="Optimal Range" />
                {/* 150 ~ 170 (High) */}
                <div className="w-[33%] bg-rose-500/40" title="High Saddle" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>120°</span>
                <span className="text-emerald-400 font-bold">140°~150°</span>
                <span>170°</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            {saddleHeightDiffMm === 0 ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 안장 높이가 이상적입니다.
              </p>
            ) : saddleHeightDiffMm > 0 ? (
              <p className="text-xs text-amber-300 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                안장을 약 <strong>+{saddleHeightDiffMm}mm</strong> 올리세요
              </p>
            ) : (
              <p className="text-xs text-rose-300 flex items-center gap-1 font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                안장을 약 <strong>{saddleHeightDiffMm}mm</strong> 내리세요
              </p>
            )}
          </div>
        </div>

        {/* 2. KOPS (Knee Over Pedal Spindle) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                KOPS (크랭크 3시 전후 위치)
              </span>
              <div className="flex items-center gap-1">
                {kopsLimitExceeded && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800 animate-pulse">
                    한계 초과
                  </span>
                )}
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    kopsStatus === 'OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {kopsStatus === 'OPTIMAL' ? '균형' : kopsStatus === 'TOO_FORWARD' ? '전방 과다' : '후방 과다'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">
                {kopsOffsetMm !== null ? `${Math.abs(kopsOffsetMm)}` : '0'}
                <span className="text-base font-normal text-slate-400">mm</span>
              </span>
              <span className="text-xs text-slate-400">
                {kopsOffsetMm && kopsOffsetMm > 0 ? '페달축 앞쪽' : '페달축 뒤쪽'}
              </span>
            </div>

            {/* KOPS Gauge */}
            <div className="space-y-1 mb-3">
              <div className="h-2 w-full bg-slate-800 rounded-full relative overflow-hidden flex">
                <div className="w-1/3 bg-rose-500/30" />
                <div className="w-1/3 bg-emerald-500" />
                <div className="w-1/3 bg-rose-500/30" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-30mm(후방)</span>
                <span className="text-emerald-400 font-bold">0mm (일치)</span>
                <span>+30mm(전방)</span>
              </div>
            </div>

            {/* 조절 한계 경고 (물리적 한계) */}
            {kopsLimitExceeded && (
              <div className="p-2 mb-2 rounded-lg bg-rose-950/70 border border-rose-800/80 text-[11px] text-rose-200 leading-snug">
                <span className="font-bold flex items-center gap-1 text-rose-300">
                  <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                  안장 레일 조절 한계(±25mm) 초과
                </span>
                제로 셋백(0mm) 싯포스트 교체 또는 프레임 사이즈 재검토를 권장합니다.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            {saddleForeAftDiffMm === 0 ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 안장 전후 위치가 완벽합니다.
              </p>
            ) : saddleForeAftDiffMm < 0 ? (
              <p className="text-xs text-rose-300 flex items-center gap-1 font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                안장 레일을 약 <strong>{Math.abs(saddleForeAftDiffMm)}mm 뒤로</strong> 미세요
              </p>
            ) : (
              <p className="text-xs text-amber-300 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                안장 레일을 약 <strong>+{saddleForeAftDiffMm}mm 앞으로</strong> 당기세요
              </p>
            )}

            {/* 연동 안내 */}
            {saddleForeAftDiffMm !== 0 && (
              <p className="text-[10px] text-slate-400 leading-tight">
                💡 안장 {saddleForeAftDiffMm > 0 ? '전진' : '후퇴'} 시 안장 높이도 <strong>{saddleHeightCompensationMm > 0 ? `+${saddleHeightCompensationMm}mm` : `${saddleHeightCompensationMm}mm`}</strong> 연동 조절 필요
              </p>
            )}
          </div>
        </div>

        {/* 3. Cockpit & Torso Reach */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                상체 & 콕핏 리치
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  reachStatus === 'OPTIMAL'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {reachStatus === 'OPTIMAL' ? '안정적' : reachStatus === 'TOO_LONG' ? '리치 과다' : '리치 짧음'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">팔꿈치 각도</span>
                <span className="text-xl font-bold text-white">{elbowAngle}°</span>
                <span className="text-[9px] text-slate-500 block">권장: 150°~165°</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">허리/상체 각도</span>
                  <span className={`text-[9px] font-bold px-1 rounded ${
                    torsoStatus === 'OPTIMAL'
                      ? 'text-emerald-400 bg-emerald-950/80'
                      : 'text-rose-400 bg-rose-950/80'
                  }`}>
                    {torsoStatus === 'OPTIMAL' ? '적정' : torsoStatus === 'TOO_LOW' ? '과숙임' : '과기립'}
                  </span>
                </div>
                <span className="text-xl font-bold text-white">{torsoAngle}°</span>
                <span className="text-[9px] text-slate-500 block">권장: 35°~50°</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
              <span>
                어깨-상완 각도: <strong className="text-slate-200">{shoulderAngle}°</strong> <span className="text-[10px] text-slate-500">(권장 85°~95°)</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                shoulderStatus === 'OPTIMAL'
                  ? 'text-emerald-400 bg-emerald-950/80'
                  : 'text-rose-400 bg-rose-950/80'
              }`}>
                {shoulderStatus === 'OPTIMAL' ? '적정' : shoulderStatus === 'TOO_OPEN' ? '과신전' : '협소'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            {reachStatus === 'OPTIMAL' ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 상체 밸런스와 팔 유연성 우수
              </p>
            ) : reachStatus === 'TOO_LONG' ? (
              <p className="text-xs text-amber-300 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                스템 <strong>-10~20mm 단축</strong> 또는 스페이서 추가 권장
              </p>
            ) : (
              <p className="text-xs text-cyan-300 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
                스템 <strong>+10mm 연장</strong> 또는 안장 위치 재확인
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
