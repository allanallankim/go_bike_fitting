'use client';

import React from 'react';
import { Activity, Camera, Video, Image as ImageIcon, Sparkles, Printer, RotateCcw } from 'lucide-react';
import { RiderSide } from '../lib/fittingCalc';

interface HeaderProps {
  mode: 'sample' | 'webcam' | 'video' | 'photo' | 'simulator';
  setMode: (mode: 'sample' | 'webcam' | 'video' | 'photo' | 'simulator') => void;
  side: RiderSide;
  setSide: (side: RiderSide) => void;
  onPrint: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  side,
  setSide,
  onPrint,
  onReset,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 text-white sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                RoadFit AI
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                PRO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI 비전 기반 정밀 로드 자전거 자가 피팅 시스템
            </p>
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setMode('sample')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'sample'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            샘플 데모
          </button>
          <button
            onClick={() => setMode('webcam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'webcam'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            웹캠 실시간
          </button>
          <button
            onClick={() => setMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'video'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            영상 업로드
          </button>
          <button
            onClick={() => setMode('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'photo'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            사진 업로드
          </button>
          <button
            onClick={() => setMode('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'simulator'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold shadow-md'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            피팅 샌드박스
          </button>
        </div>

        {/* Side & Actions */}
        <div className="flex items-center gap-3">
          {/* Side Toggle */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setSide('left')}
              className={`px-2.5 py-1 rounded-md transition ${
                side === 'left' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              좌측 (Drive-opposite)
            </button>
            <button
              onClick={() => setSide('right')}
              className={`px-2.5 py-1 rounded-md transition ${
                side === 'right' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              우측 (Drive-side)
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="기본값 초기화"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Print/Export */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            <Printer className="w-3.5 h-3.5" />
            리포트 인쇄
          </button>
        </div>
      </div>
    </header>
  );
};
