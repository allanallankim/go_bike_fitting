'use client';

import React from 'react';
import { CalibrationPin } from '../lib/canvasOverlay';
import { Crosshair, Ruler, RefreshCw, CheckCircle } from 'lucide-react';

interface ScaleCalibratorProps {
  calibrationPin: CalibrationPin;
  setCalibrationPin: React.Dispatch<React.SetStateAction<CalibrationPin>>;
  mmPerPixel: number;
}

export const ScaleCalibrator: React.FC<ScaleCalibratorProps> = ({
  calibrationPin,
  setCalibrationPin,
  mmPerPixel,
}) => {
  const { p1, p2, knownDistanceMm, label } = calibrationPin;
  const distPx = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  const presets = [
    {
      label: '700C 휠 외경 (25C 타이어)',
      distanceMm: 670,
      p1: { x: 250, y: 350 },
      p2: { x: 250, y: 510 },
      desc: '앞바퀴 타이어 최상단과 최하단 (직경 670mm)',
    },
    {
      label: '크랭크 암 길이 (170mm)',
      distanceMm: 170,
      p1: { x: 450, y: 430 },
      p2: { x: 390, y: 450 },
      desc: 'BB 중심축부터 페달 액슬 중심축까지 (170mm)',
    },
    {
      label: '크랭크 암 길이 (172.5mm)',
      distanceMm: 172.5,
      p1: { x: 450, y: 430 },
      p2: { x: 390, y: 450 },
      desc: 'BB 중심축부터 페달 액슬 중심축까지 (172.5mm)',
    },
    {
      label: '휠베이스 (Wheelbase 980mm)',
      distanceMm: 980,
      p1: { x: 250, y: 430 },
      p2: { x: 600, y: 430 },
      desc: '앞바퀴 허브 중심부터 뒷바퀴 허브 중심까지',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-yellow-400" />
          <h3 className="text-sm font-bold text-white">기준점 스케일링 (mm/px 변환)</h3>
        </div>
        <div className="text-xs bg-yellow-950/70 border border-yellow-700/60 text-yellow-300 font-bold px-3 py-1 rounded-full">
          1 px = {mmPerPixel.toFixed(2)} mm
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        화면에서 이미 알고 있는 부품의 규격(예: 700c 휠, 크랭크 암 등)에 기준 핀(A, B)을 맞춰주세요.
        픽셀 당 실제 mm 비율을 계산하여 <strong>"안장을 몇 mm 올려야 하는지"</strong> 오차 없이 산출합니다.
      </p>

      {/* Preset Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          자전거 규격 프리셋 선택
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset) => {
            const isSelected = calibrationPin.label === preset.label;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setCalibrationPin({
                    p1: preset.p1,
                    p2: preset.p2,
                    knownDistanceMm: preset.distanceMm,
                    label: preset.label,
                  });
                }}
                className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-yellow-950/40 border-yellow-500 text-yellow-200 shadow-md shadow-yellow-950/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold">{preset.label}</span>
                  <span className="font-extrabold text-yellow-400">{preset.distanceMm}mm</span>
                </div>
                <span className="text-[10px] text-slate-500">{preset.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Input adjustment */}
      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-slate-400 whitespace-nowrap">직접 기준 거리 입력:</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={knownDistanceMm}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 100;
                setCalibrationPin((prev) => ({
                  ...prev,
                  knownDistanceMm: val,
                  label: `사용자 지정 (${val}mm)`,
                }));
              }}
              className="w-24 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center focus:outline-none focus:border-yellow-400"
            />
            <span className="text-slate-400">mm</span>
          </div>
        </div>

        <div className="text-slate-400 text-right w-full sm:w-auto text-[11px]">
          화면 핀 간격: <strong className="text-slate-200">{Math.round(distPx)} px</strong>
        </div>
      </div>
    </div>
  );
};
