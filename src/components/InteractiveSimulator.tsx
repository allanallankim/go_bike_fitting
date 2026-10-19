'use client';

import React, { useState } from 'react';
import { PoseLandmarks, RiderSide } from '../lib/fittingCalc';
import { Sliders, RotateCcw, Sparkles, ArrowRight, Activity, HelpCircle } from 'lucide-react';

interface InteractiveSimulatorProps {
  landmarks: PoseLandmarks | null;
  setLandmarks: React.Dispatch<React.SetStateAction<PoseLandmarks | null>>;
  side: RiderSide;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  landmarks,
  setLandmarks,
  side,
}) => {
  // Simulator adjustments (in mm offsets)
  const [saddleHeightSlider, setSaddleHeightSlider] = useState<number>(0); // -40 ~ +40mm
  const [saddleForeAftSlider, setSaddleForeAftSlider] = useState<number>(0); // -30 ~ +30mm
  const [stemLengthSlider, setStemLengthSlider] = useState<number>(100); // 80 ~ 130mm

  // Apply slider updates to landmarks
  const updateGeometry = (heightDeltaMm: number, foreAftDeltaMm: number, stemMm: number) => {
    setSaddleHeightSlider(heightDeltaMm);
    setSaddleForeAftSlider(foreAftDeltaMm);
    setStemLengthSlider(stemMm);

    // Baseline coordinates for BDC
    // 1mm ≈ 0.45 px on standard view
    const pxScale = 0.45;
    const isLeft = side === 'left';
    const hipKey = isLeft ? 'leftHip' : 'rightHip';
    const kneeKey = isLeft ? 'leftKnee' : 'rightKnee';
    const wristKey = isLeft ? 'leftWrist' : 'rightWrist';
    const elbowKey = isLeft ? 'leftElbow' : 'rightElbow';
    const shoulderKey = isLeft ? 'leftShoulder' : 'rightShoulder';

    setLandmarks((prev) => {
      if (!prev) return prev;

      // Base Hip: (470, 240)
      // Height increases -> Hip moves UP (-Y in screen coords)
      // Fore/Aft increases -> Hip moves FORWARD (facing left -> -X)
      const baseHipX = 470;
      const baseHipY = 240;

      const newHipX = baseHipX - foreAftDeltaMm * pxScale;
      const newHipY = baseHipY - heightDeltaMm * pxScale;

      // Knee reacts to hip height and fore/aft
      const baseKneeX = 420;
      const baseKneeY = 350;
      const newKneeX = baseKneeX - foreAftDeltaMm * pxScale * 0.7 + heightDeltaMm * pxScale * 0.25;
      const newKneeY = baseKneeY - heightDeltaMm * pxScale * 0.4;

      // Handlebar/Stem affects wrist and elbow
      // Standard stem is 100mm. delta = stemMm - 100
      const stemDeltaMm = stemMm - 100;
      const baseWristX = 235;
      const baseWristY = 245;
      const newWristX = baseWristX - stemDeltaMm * pxScale;

      const baseElbowX = 260;
      const baseElbowY = 250;
      const newElbowX = baseElbowX - stemDeltaMm * pxScale * 0.5;

      return {
        ...prev,
        [hipKey]: { ...prev[hipKey], x: Math.round(newHipX), y: Math.round(newHipY) },
        [kneeKey]: { ...prev[kneeKey], x: Math.round(newKneeX), y: Math.round(newKneeY) },
        [wristKey]: { ...prev[wristKey], x: Math.round(newWristX), y: Math.round(baseWristY) },
        [elbowKey]: { ...prev[elbowKey], x: Math.round(newElbowX), y: Math.round(baseElbowY) },
      };
    });
  };

  const handleReset = () => {
    updateGeometry(0, 0, 100);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">피팅 샌드박스 시뮬레이터 (Sandbox Lab)</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      </div>

      <p className="text-xs text-slate-400">
        자전거 부품(안장 높이, 안장 전후 셋백, 스템 길이)을 가상으로 조절하며 라이더 관절 각도와 KOPS의 즉각적인 변화를 시뮬레이션해보세요.
      </p>

      {/* Sliders Grid */}
      <div className="space-y-4">
        {/* Saddle Height Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">싯포스트 높이 (Saddle Height)</span>
            <span className={`font-mono font-bold ${saddleHeightSlider > 0 ? 'text-amber-400' : saddleHeightSlider < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {saddleHeightSlider > 0 ? `+${saddleHeightSlider}mm (상향)` : saddleHeightSlider < 0 ? `${saddleHeightSlider}mm (하향)` : '표준 (0mm)'}
            </span>
          </div>
          <input
            type="range"
            min="-35"
            max="35"
            step="1"
            value={saddleHeightSlider}
            onChange={(e) => updateGeometry(parseFloat(e.target.value), saddleForeAftSlider, stemLengthSlider)}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-850 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>-35mm (낮춤)</span>
            <span>0mm</span>
            <span>+35mm (올림)</span>
          </div>
        </div>

        {/* Saddle Fore-Aft Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">안장 전후 위치 (Fore-Aft / Setback)</span>
            <span className={`font-mono font-bold ${saddleForeAftSlider > 0 ? 'text-cyan-400' : saddleForeAftSlider < 0 ? 'text-purple-400' : 'text-emerald-400'}`}>
              {saddleForeAftSlider > 0 ? `+${saddleForeAftSlider}mm (전진)` : saddleForeAftSlider < 0 ? `${Math.abs(saddleForeAftSlider)}mm (후퇴)` : '중립 (0mm)'}
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="1"
            value={saddleForeAftSlider}
            onChange={(e) => updateGeometry(saddleHeightSlider, parseFloat(e.target.value), stemLengthSlider)}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-850 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>-25mm (안장 뒤로)</span>
            <span>중립</span>
            <span>+25mm (안장 앞으로)</span>
          </div>
        </div>

        {/* Stem Length Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">스템 길이 (Stem Length)</span>
            <span className="font-mono font-bold text-sky-400">{stemLengthSlider}mm</span>
          </div>
          <input
            type="range"
            min="80"
            max="130"
            step="5"
            value={stemLengthSlider}
            onChange={(e) => updateGeometry(saddleHeightSlider, saddleForeAftSlider, parseFloat(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-850 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>80mm (단축)</span>
            <span>100mm (기본)</span>
            <span>130mm (연장)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
