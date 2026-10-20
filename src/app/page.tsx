'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '../components/Header';
import { FittingCanvas } from '../components/FittingCanvas';
import { FittingDiagnostics } from '../components/FittingDiagnostics';
import { PrescriptionReport } from '../components/PrescriptionReport';
import { ScaleCalibrator } from '../components/ScaleCalibrator';
import { BikeGeometryDatabase } from '../components/BikeGeometryDatabase';
import { InteractiveSimulator } from '../components/InteractiveSimulator';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samples';
import { BIKE_DATABASE, BikeGeometry } from '../data/bikes';
import {
  PoseLandmarks,
  RiderSide,
  FittingMetrics,
  analyzeFitting,
} from '../lib/fittingCalc';
import { CalibrationPin } from '../lib/canvasOverlay';
import {
  Activity,
  FileText,
  Ruler,
  Database,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<'sample' | 'webcam' | 'video' | 'photo' | 'simulator'>('sample');
  const [side, setSide] = useState<RiderSide>('left');
  const [ridingStyle, setRidingStyle] = useState<'All-Round' | 'Endurance' | 'Aero'>('All-Round');

  // Active Sample preset
  const [activePresetId, setActivePresetId] = useState<string>(SAMPLE_PRESETS[0].id);

  // Pose landmarks state
  const [landmarks, setLandmarks] = useState<PoseLandmarks | null>(SAMPLE_PRESETS[0].landmarks);

  // Calibration Ruler Pin state
  // Default: Front wheel diameter ~ 670mm (p1: (250, 350), p2: (250, 510) -> 160px for 670mm -> ~4.18mm/px)
  const [calibrationPin, setCalibrationPin] = useState<CalibrationPin>({
    p1: { x: 250, y: 350 },
    p2: { x: 250, y: 510 },
    knownDistanceMm: 670,
    label: '700C 휠 외경 (25C 타이어)',
  });

  // Calculate mmPerPixel from calibration pins
  const mmPerPixel = useMemo(() => {
    const { p1, p2, knownDistanceMm } = calibrationPin;
    const distPx = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    if (distPx <= 0) return 1.0;
    return knownDistanceMm / distPx;
  }, [calibrationPin]);

  // Selected Bike from Database
  const [selectedBike, setSelectedBike] = useState<{
    bike: BikeGeometry;
    sizeName: string;
  } | null>({
    bike: BIKE_DATABASE[0],
    sizeName: '54',
  });

  // Active Right-side Tab
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'prescription' | 'calibration' | 'geometry' | 'simulator'>('diagnostics');

  // Compute live fitting metrics whenever landmarks, side, mmPerPixel or ridingStyle changes
  const metrics: FittingMetrics | null = useMemo(() => {
    if (!landmarks) return null;
    return analyzeFitting(landmarks, side, mmPerPixel, ridingStyle);
  }, [landmarks, side, mmPerPixel, ridingStyle]);

  // Handle Preset Change
  const handleSelectPreset = (preset: SamplePreset) => {
    setActivePresetId(preset.id);
    setLandmarks(JSON.parse(JSON.stringify(preset.landmarks)));
    setSide(preset.side);

    if (preset.bikeModelId) {
      const b = BIKE_DATABASE.find((item) => item.id === preset.bikeModelId);
      if (b) {
        setSelectedBike({
          bike: b,
          sizeName: preset.bikeSize || b.sizes[1]?.sizeName || '54',
        });
      }
    }
  };

  // Switch to simulator tab when mode changes to simulator
  useEffect(() => {
    if (mode === 'simulator') {
      setActiveTab('simulator');
    }
  }, [mode]);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Reset to initial
  const handleReset = () => {
    handleSelectPreset(SAMPLE_PRESETS[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Header
        mode={mode}
        setMode={setMode}
        side={side}
        setSide={setSide}
        onPrint={handlePrint}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Sample Preset Carousel Banner (Only shown in Sample mode) */}
        {mode === 'sample' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                샘플 라이딩 프리셋으로 즉시 테스트
              </span>
              <span className="text-[11px] text-slate-400">
                선택 즉시 스켈레톤과 분석 수치가 반영됩니다
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {SAMPLE_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        preset.category === 'Optimal' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {preset.category}
                      </span>
                      <h4 className="text-xs font-bold mt-1.5 leading-snug line-clamp-1">{preset.name}</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{preset.phase}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Core Workspace: Canvas View (Left) & Control Tabs (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Canvas & Vision Overlay */}
          <div className="lg:col-span-7 space-y-4">
            <FittingCanvas
              mode={mode}
              side={side}
              landmarks={landmarks}
              setLandmarks={setLandmarks}
              calibrationPin={calibrationPin}
              setCalibrationPin={setCalibrationPin}
              mmPerPixel={mmPerPixel}
              metrics={metrics}
            />

            {/* Quick Fitting Diagnostics summary beneath canvas */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">무릎 각도:</span>
                <strong className="text-white text-sm">{metrics?.kneeAngle ?? 0}°</strong>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  metrics?.kneeStatus === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  {metrics?.kneeStatus ?? 'WAITING'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">KOPS 오차:</span>
                <strong className="text-white text-sm">
                  {metrics?.kopsOffsetMm !== null ? `${metrics?.kopsOffsetMm}mm` : '0mm'}
                </strong>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  metrics?.kopsStatus === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}>
                  {metrics?.kopsStatus ?? 'WAITING'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">팔꿈치 각도:</span>
                <strong className="text-white text-sm">{metrics?.elbowAngle ?? 0}°</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">피팅 점수:</span>
                <strong className="text-cyan-400 text-sm font-extrabold">{metrics?.score ?? 0}점</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Functional Panels */}
          <div className="lg:col-span-5 space-y-4">
            {/* Tabs Header */}
            <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'diagnostics'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                실시간 진단
              </button>
              <button
                onClick={() => setActiveTab('prescription')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'prescription'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                맞춤 처방전
              </button>
              <button
                onClick={() => setActiveTab('calibration')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'calibration'
                    ? 'bg-yellow-400 text-slate-950 font-bold shadow-md'
                    : 'text-yellow-400/80 hover:text-yellow-300'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                스케일 캘리브레이션
              </button>
              <button
                onClick={() => setActiveTab('geometry')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'geometry'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                지오메트리 DB
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'simulator'
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-md'
                    : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                샌드박스
              </button>
            </div>

            {/* Active Tab Content */}
            <div className="transition-all">
              {activeTab === 'diagnostics' && (
                <FittingDiagnostics
                  metrics={metrics}
                  ridingStyle={ridingStyle}
                  setRidingStyle={setRidingStyle}
                  mmPerPixel={mmPerPixel}
                />
              )}

              {activeTab === 'prescription' && (
                <PrescriptionReport
                  metrics={metrics}
                  selectedBike={selectedBike}
                />
              )}

              {activeTab === 'calibration' && (
                <ScaleCalibrator
                  calibrationPin={calibrationPin}
                  setCalibrationPin={setCalibrationPin}
                  mmPerPixel={mmPerPixel}
                />
              )}

              {activeTab === 'geometry' && (
                <BikeGeometryDatabase
                  selectedBike={selectedBike}
                  onSelectBike={(bike, sizeName) => setSelectedBike({ bike, sizeName })}
                  onApplyWheelbaseToScale={(wheelbaseMm) => {
                    setCalibrationPin({
                      p1: { x: 250, y: 430 },
                      p2: { x: 600, y: 430 },
                      knownDistanceMm: wheelbaseMm,
                      label: `휠베이스 (${wheelbaseMm}mm)`,
                    });
                  }}
                />
              )}

              {activeTab === 'simulator' && (
                <InteractiveSimulator
                  landmarks={landmarks}
                  setLandmarks={setLandmarks}
                  side={side}
                />
              )}
            </div>
          </div>
        </div>

        {/* Full-width Section: Detailed Prescription Report & Fitting Guides (Always rendered for print or scroll down) */}
        <div className="pt-6 border-t border-slate-800">
          <PrescriptionReport
            metrics={metrics}
            selectedBike={selectedBike}
          />
        </div>

        {/* Informational Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-400">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              1. 무릎 신전 각도 (140°~150°)
            </h4>
            <p className="leading-relaxed">
              페달이 가장 낮은 하사점에 도달했을 때의 고관절-무릎-발목 사이의 각도입니다. 140° 미만은 무릎 앞쪽에 과부하를 주며, 150° 초과는 페달링 시 골반이 좌우로 기우뚱거려 에너지 손실과 햄스트링 손상을 야기합니다.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              2. KOPS 및 안장 셋백 조절 한계
            </h4>
            <p className="leading-relaxed">
              크랭크 3시 전방 수평 시 슬개골 앞단 수직선과 페달 스핀들이 일치해야 합니다. 일반 로드 안장 레일 조절 폭은 약 ±20~25mm 내외이며, 안장을 10mm 앞으로 당기면 안장 높이도 약 2~3mm 올려야 원래 거리가 유지됩니다.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              3. 기준점 스케일링 (mm 정밀 변환)
            </h4>
            <p className="leading-relaxed">
              픽셀(px) 좌표를 실제 밀리미터(mm) 단위로 보정하기 위해 700C 휠 지름(약 670mm)이나 휠베이스를 기준으로 삼아 "안장 8mm 올리기" 등 오차 없는 정확한 조절량을 계산합니다.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              4. 모바일 셀프 촬영 앵글 가이드
            </h4>
            <p className="leading-relaxed">
              스마트폰/아이패드로 셀프 촬영 시 카메라 렌즈 높이를 크랭크 축(80~90cm)에 맞추고, 자전거와 완전한 90도 수평 직각을 유지해야 원근 왜곡(Perspective Distortion) 없는 정밀 측정이 가능합니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 mt-10">
        <p>RoadFit AI Studio • Client-side AI Computer Vision Bike Fitting System</p>
        <p className="mt-1 text-[11px] text-slate-600">
          모든 비디오 및 사진 분석은 사용자의 브라우저(Client-side) 내부에서 안전하게 처리되며 외부 서버로 전송되지 않습니다.
        </p>
      </footer>
    </div>
  );
}
