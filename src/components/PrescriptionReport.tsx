'use client';

import React from 'react';
import { FittingMetrics } from '../lib/fittingCalc';
import { BikeGeometry } from '../data/bikes';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  Wrench,
  Check,
  Download,
  Info
} from 'lucide-react';

interface PrescriptionReportProps {
  metrics: FittingMetrics | null;
  selectedBike: {
    bike: BikeGeometry;
    sizeName: string;
  } | null;
  riderHeight?: number;
  riderInseam?: number;
}

export const PrescriptionReport: React.FC<PrescriptionReportProps> = ({
  metrics,
  selectedBike,
  riderHeight = 175,
  riderInseam = 81,
}) => {
  if (!metrics) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500">
        자세 분석 데이터가 준비되면 처방 리포트가 생성됩니다.
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
  } = metrics;

  const [currentDate, setCurrentDate] = React.useState<string>('');

  React.useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ko-KR'));
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 print:bg-white print:text-black print:border-none print:p-0">
      {/* Report Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400 print:text-cyan-700" />
            <h2 className="text-lg font-bold text-white print:text-black">
              로드 자전거 정밀 피팅 처방서 (Prescription Sheet)
            </h2>
          </div>
          <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
            바이오메카닉스 관절 각도 및 기준점 스케일링 기반 정량 처방
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium print:border">
            분석 일시: {currentDate || '2026. 10. 19.'}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
            종합 점수: {score}점
          </span>
        </div>
      </div>

      {/* Selected Bike & Rider Info */}
      {selectedBike && (
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 print:bg-slate-50 print:border-slate-300">
          <div>
            <span className="text-slate-400 block text-[10px]">적용 자전거 모델</span>
            <strong className="text-white text-sm print:text-black">
              {selectedBike.bike.brand} {selectedBike.bike.model} ({selectedBike.sizeName} Size)
            </strong>
          </div>
          {(() => {
            const sizeData = selectedBike.bike.sizes.find((s) => s.sizeName === selectedBike.sizeName);
            if (!sizeData) return null;
            return (
              <div className="flex items-center gap-4 text-slate-300 print:text-slate-700">
                <span>스택: <strong className="text-white print:text-black">{sizeData.stack}mm</strong></span>
                <span>리치: <strong className="text-white print:text-black">{sizeData.reach}mm</strong></span>
                <span>크랭크: <strong className="text-white print:text-black">{sizeData.stockCrankLength}mm</strong></span>
                <span>휠베이스: <strong className="text-white print:text-black">{sizeData.wheelbase}mm</strong></span>
              </div>
            );
          })()}
        </div>
      )}

      {/* 1. Core Adjustment Prescriptions (The MM values) */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          핵심 부품 정량 조절 권장값 (mm 단위)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Saddle Height */}
          <div
            className={`p-4 rounded-xl border transition ${
              saddleHeightDiffMm === 0
                ? 'bg-emerald-950/30 border-emerald-800/60'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="text-[11px] text-slate-400 font-medium">1단계: 안장 높이 (Saddle Height)</div>
            <div className="text-2xl font-black mt-1 text-white print:text-black">
              {saddleHeightDiffMm === 0 ? (
                <span className="text-emerald-400 text-lg">현재 높이 유지 (0mm)</span>
              ) : saddleHeightDiffMm > 0 ? (
                <span className="text-amber-400">+{saddleHeightDiffMm} mm 상향</span>
              ) : (
                <span className="text-rose-400">{saddleHeightDiffMm} mm 하향</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed print:text-slate-600">
              {saddleHeightDiffMm === 0
                ? '무릎 각도가 140°~150° 범위로 완벽합니다.'
                : saddleHeightDiffMm > 0
                ? '현재 무릎 각도가 부족하여 페달링 시 대퇴사두근에 과부하가 걸립니다. 싯포스트를 위로 올리세요.'
                : '현재 무릎이 과신전되어 골반이 좌우로 흔들리고 있습니다. 싯포스트를 아래로 내리세요.'}
            </p>
          </div>

          {/* Saddle Fore-Aft (KOPS) */}
          <div
            className={`p-4 rounded-xl border transition ${
              saddleForeAftDiffMm === 0
                ? 'bg-emerald-950/30 border-emerald-800/60'
                : kopsLimitExceeded
                ? 'bg-rose-950/20 border-rose-800/70'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-400 font-medium">2단계: 안장 전후 위치 (Setback)</div>
              {kopsLimitExceeded && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 animate-pulse">
                  한계 초과
                </span>
              )}
            </div>
            <div className="text-2xl font-black mt-1 text-white print:text-black">
              {saddleForeAftDiffMm === 0 ? (
                <span className="text-emerald-400 text-lg">레일 위치 유지 (0mm)</span>
              ) : saddleForeAftDiffMm < 0 ? (
                <span className="text-rose-400">{Math.abs(saddleForeAftDiffMm)} mm 후퇴</span>
              ) : (
                <span className="text-amber-400">+{saddleForeAftDiffMm} mm 전진</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed print:text-slate-600">
              {saddleForeAftDiffMm === 0
                ? '무릎 앞쪽 수직선과 페달 축(KOPS)이 일치하여 전단력 없이 동력이 전달됩니다.'
                : saddleForeAftDiffMm < 0
                ? '무릎이 페달축보다 앞으로 쏠려 슬개골 연골 압박이 높습니다. 안장 레일을 뒤로 밀어주세요.'
                : '무릎이 페달축보다 뒤에 있어 둔근 효율이 떨어집니다. 안장 레일을 앞으로 당겨주세요.'}
            </p>

            {/* 물리적 한계 경고 배너 (Constraint Warning Banner) */}
            {kopsLimitExceeded && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  안장 레일 조절 한계(±25mm) 초과 경고
                </div>
                <p className="leading-relaxed text-[11px] text-rose-100">
                  일반 로드 안장 레일의 전후 유효 조절 폭은 약 <strong>±20~25mm 내외</strong>입니다.
                  현재 산출된 조절량(<strong>{saddleForeAftDiffMm > 0 ? `+${saddleForeAftDiffMm}` : saddleForeAftDiffMm}mm</strong>)은 레일 이동만으로는 물리적으로 불가능합니다.
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-rose-800/80 text-[11px] text-amber-200 font-medium">
                  👉 <strong>권장 해결책</strong>: 셋백 싯포스트를 <strong>제로 셋백(0mm) 싯포스트로 교체</strong>하거나 <strong>프레임 사이즈(리치/지오메트리) 재검토</strong>가 필요합니다.
                </div>
              </div>
            )}

            {/* 안장 전후-높이 상호보완적 연동 안내 가이드 */}
            <div className="mt-2.5 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-[11px] text-cyan-200">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-0.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                안장 전후-높이 상호 연동 가이드
              </div>
              <p className="leading-relaxed text-slate-300">
                안장을 10mm 앞으로 당기면 크랭크 축(BB)과의 거리가 가까워지므로, 안장 높이(Saddle Height)도 함께 <strong>약 2~3mm 올려야</strong> 동일한 무릎 각도가 유지됩니다.
                {saddleForeAftDiffMm !== 0 && (
                  <span className="block mt-1 text-cyan-300 font-semibold">
                    ↳ 현재 조절 연동 권장: 안장 {saddleForeAftDiffMm > 0 ? `${saddleForeAftDiffMm}mm 전진 시` : `${Math.abs(saddleForeAftDiffMm)}mm 후퇴 시`} 안장 높이 <strong>{saddleHeightCompensationMm > 0 ? `+${saddleHeightCompensationMm}mm 상향` : `${saddleHeightCompensationMm}mm 하향`}</strong> 보정 필요
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Cockpit / Stem Length */}
          <div
            className={`p-4 rounded-xl border transition ${
              reachDiffMm === 0
                ? 'bg-emerald-950/30 border-emerald-800/60'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="text-[11px] text-slate-400 font-medium">3단계: 스템 및 콕핏 리치 (Cockpit)</div>
            <div className="text-2xl font-black mt-1 text-white print:text-black">
              {reachDiffMm === 0 ? (
                <span className="text-emerald-400 text-lg">현재 스템 유지</span>
              ) : reachDiffMm < 0 ? (
                <span className="text-amber-400">{reachDiffMm} mm 단축</span>
              ) : (
                <span className="text-cyan-400">+{reachDiffMm} mm 연장</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed print:text-slate-600">
              {reachDiffMm === 0
                ? '팔꿈치가 150°~165°로 자연스럽게 굽혀져 노면 진동을 잘 흡수합니다.'
                : reachDiffMm < 0
                ? '팔이 일직선으로 펴져 있어 승모근과 손목에 충격이 집중됩니다. 짧은 스템으로 교체하거나 헤드셋 스페이서를 추가하세요.'
                : '상체가 너무 서있어 공기 저항이 커지고 페달링 토크가 분산됩니다. 스템을 연장하는 것을 고려하세요.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Biomechanical Measurements Table */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          바이오메카닉스 관측 수치 상세
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 print:bg-slate-100">
              <tr>
                <th className="py-2.5 px-4 font-semibold">측정 항목</th>
                <th className="py-2.5 px-4 font-semibold">실제 측정값</th>
                <th className="py-2.5 px-4 font-semibold">권장 표준 범위</th>
                <th className="py-2.5 px-4 font-semibold">상태</th>
                <th className="py-2.5 px-4 font-semibold">비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 print:text-slate-700">
              <tr>
                <td className="py-2.5 px-4 font-medium text-white print:text-black">무릎 신전 각도 (BDC)</td>
                <td className="py-2.5 px-4 font-bold text-cyan-400">{kneeAngle}°</td>
                <td className="py-2.5 px-4">140° ~ 150°</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    kneeStatus === 'OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {kneeStatus === 'OPTIMAL' ? '적정' : kneeStatus === 'LOW' ? '안장 낮음' : '안장 높음'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-400">페달 하사점(6시)에서 측정</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white print:text-black">KOPS 전후 오차</td>
                <td className="py-2.5 px-4 font-bold text-amber-400">{kopsOffsetMm !== null ? `${kopsOffsetMm} mm` : '0 mm'}</td>
                <td className="py-2.5 px-4">-10 mm ~ +10 mm</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    kopsStatus === 'OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {kopsStatus === 'OPTIMAL' ? '적정 (균형)' : kopsStatus === 'TOO_FORWARD' ? '전방 과다' : '후방 과다'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-400">
                  {kopsLimitExceeded ? (
                    <span className="text-amber-400 font-semibold">⚠️ 안장 조절 한계(±25mm) 초과</span>
                  ) : (
                    '크랭크 3시 수평 시 무릎 vs 페달축'
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white print:text-black">팔꿈치 굽힘 각도</td>
                <td className="py-2.5 px-4 font-bold text-sky-400">{elbowAngle}°</td>
                <td className="py-2.5 px-4">150° ~ 165°</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    reachStatus === 'OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {reachStatus === 'OPTIMAL' ? '적정' : reachStatus === 'TOO_LONG' ? '리치 과다' : '리치 짧음'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-400">후드 파지 시 충격 완화 각도</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white print:text-black">허리 / 상체 경사각</td>
                <td className="py-2.5 px-4 font-bold text-slate-200">{torsoAngle}°</td>
                <td className="py-2.5 px-4">35° ~ 50°</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    torsoStatus === 'OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {torsoStatus === 'OPTIMAL' ? '적정' : torsoStatus === 'TOO_LOW' ? '상체 과숙임' : '상체 기립'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-400">
                  {torsoStatus === 'TOO_LOW'
                    ? '수평 대비 과도하게 숙여짐 (허리/목 부담 유발)'
                    : torsoStatus === 'TOO_UPRIGHT'
                    ? '상체가 과도하게 서있음 (공기 저항 증가)'
                    : '수평선 대비 이상적 척추 전경각'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white print:text-black">어깨-몸통 각도</td>
                <td className="py-2.5 px-4 font-bold text-slate-200">{shoulderAngle}°</td>
                <td className="py-2.5 px-4">85° ~ 95°</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    shoulderStatus === 'OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {shoulderStatus === 'OPTIMAL' ? '적정' : shoulderStatus === 'TOO_OPEN' ? '어깨 과신전' : '어깨 협소'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-400">
                  {shoulderStatus === 'TOO_OPEN'
                    ? '어깨가 과도하게 앞으로 뻗음 (승모근/손목 피로)'
                    : shoulderStatus === 'TOO_CLOSED'
                    ? '어깨가 좁혀져 흉부 압박'
                    : '상체와 상완(Shoulder-Elbow) 사이 적정 각도'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Potential Pain Points & Prevention */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          발생 가능한 부상 및 통증 예방 가이드
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <strong className="text-white block mb-1">🔴 앞무릎(슬개골) 통증 주의</strong>
            <p className="text-slate-400 leading-relaxed">
              안장이 너무 낮거나(무릎 각도 140° 미만) 안장이 앞으로 많이 당겨진 경우(KOPS 전방), 페달을 밟을 때 슬개건에 과도한 압박이 누적됩니다.
            </p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <strong className="text-white block mb-1">🔴 오금(무릎 뒤쪽) & 햄스트링 당김</strong>
            <p className="text-slate-400 leading-relaxed">
              안장이 너무 높으면(무릎 각도 150° 초과) 다리를 무리하게 뻗게 되어 슬와근건염 및 햄스트링 당김, 안장통이 악화될 수 있습니다.
            </p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <strong className="text-white block mb-1">🔴 목/어깨 결림 및 손목 저림 (척골 신경통)</strong>
            <p className="text-slate-400 leading-relaxed">
              핸들바 리치가 너무 멀어 팔꿈치가 잠기면(165° 초과) 상체 체중이 손바닥과 어깨에 고스란히 실려 손가락 저림이 발생합니다.
            </p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <strong className="text-white block mb-1">🟢 자가 피팅 조절 황금 원칙</strong>
            <p className="text-slate-400 leading-relaxed">
              안장 높이 조절은 한 번에 최대 3~5mm씩 변경한 뒤 최소 20~30분간 적응 라이딩을 진행하며 신체 반응을 확인하는 것이 권장됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
