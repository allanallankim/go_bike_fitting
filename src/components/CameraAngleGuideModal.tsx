'use client';

import React from 'react';
import {
  Camera,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Upload,
  Video,
  Image as ImageIcon,
  HelpCircle,
  Sliders
} from 'lucide-react';

interface CameraAngleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUploadType?: (type: 'video' | 'photo') => void;
}

export const CameraAngleGuideModal: React.FC<CameraAngleGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectUploadType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                스마트폰/태블릿 촬영 앵글 가이드
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  원근 왜곡 방지
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                자전거 로라/거치대 옆 셀프 촬영 시 정확한 각도 측정을 위한 핵심 가이드라인
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-300">
          {/* Key Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* 1. Camera Height */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs">
                    1
                  </span>
                  카메라 높이: 크랭크 축(BB) 수평
                </div>
                <p className="text-slate-400 leading-relaxed">
                  스마트폰 삼각대나 거치대를 바닥에서 약 <strong className="text-cyan-300">80~90cm</strong>(크랭크 체인링 중심 축) 높이에 수평으로 맞춰주세요.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>크랭크 축 높이 직교 촬영 (왜곡률 1% 미만)</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>위에서 내려찍기(하이앵글): 상체 각도 과소 측정</span>
                </div>
              </div>
            </div>

            {/* 2. Angle: 90 degrees */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center text-xs">
                    2
                  </span>
                  촬영 각도: 자전거와 완전 90° 직각
                </div>
                <p className="text-slate-400 leading-relaxed">
                  스마트폰 화면이 자전거 프레임의 중앙(비비쉘)과 <strong className="text-amber-300">완전한 90도 직교(수평)</strong>를 유지해야 합니다.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>스마트폰 수평 레벨 0° 유지</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>사선(대각선) 촬영 시 KOPS 20~50mm 심각한 오차 유발</span>
                </div>
              </div>
            </div>

            {/* 3. Distance & Framing */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center text-xs">
                    3
                  </span>
                  거리 2.5m~3.5m 및 표준 화각(1x)
                </div>
                <p className="text-slate-400 leading-relaxed">
                  자전거 앞뒤 바퀴와 라이더의 전신이 화면의 <strong className="text-indigo-300">75~85%</strong>를 차지하도록 충분한 거리를 확보하세요.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>스마트폰 기본 1x 표준 렌즈 사용 권장</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>0.5x 초광각 금지 (배럴 왜곡으로 각도 왜곡 심함)</span>
                </div>
              </div>
            </div>

            {/* 4. Lighting & Clothing */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                  <span className="w-6 h-6 rounded-lg bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center text-xs">
                    4
                  </span>
                  명확한 관절 인식 환경
                </div>
                <p className="text-slate-400 leading-relaxed">
                  AI 비전 모델이 어깨, 팔꿈치, 고관절, 무릎, 발목 포인트를 정확히 트래킹할 수 있도록 밝은 조명과 핏한 복장을 착용하세요.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>몸에 밀착되는 사이클링 져지 및 빕숏 권장</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span>화면 상단 '가이드선' 버튼으로 실시간 격자 정렬 가능</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Schematic Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                촬영 셋업 구성도 (Smart Trainer Setup)
              </span>
              <span className="text-[11px] text-cyan-400">평면 직교 시야각</span>
            </div>
            
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mb-1">
                  🚴‍♂️
                </div>
                <span className="text-white font-bold text-xs">자전거 & 라이더</span>
                <span className="text-[10px] text-slate-400">로라 거치 / 페달링</span>
              </div>

              <div className="flex-1 flex flex-col items-center max-w-[200px]">
                <div className="text-[10px] text-cyan-400 font-bold mb-1">↔ 약 2.5 ~ 3.5m 직교 ↔</div>
                <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-1 text-[9px] text-emerald-400 font-bold">
                    90° 직각
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">지면과 수평 유지</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-1">
                  📱
                </div>
                <span className="text-white font-bold text-xs">스마트폰 / 삼각대</span>
                <span className="text-[10px] text-amber-300">높이 80~90cm (크랭크 높이)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>화면 상단 '가이드선' 토글을 켜면 캔버스에 수평/크랭크 보조선이 겹쳐 표시됩니다.</span>
          </div>

          <div className="flex items-center gap-2">
            {onSelectUploadType && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onSelectUploadType('video');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                >
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  영상 선택
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSelectUploadType('photo');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  사진 선택
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
            >
              가이드 숙지 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
