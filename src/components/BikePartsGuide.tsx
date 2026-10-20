'use client';

import React, { useState } from 'react';
import {
  Bike,
  ZoomIn,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

interface BikePartImageItem {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  category: 'Road' | 'Mountain' | 'Geometry & Detailed';
  originalFileName: string;
  src: string;
  description: string;
  keyParts: { ko: string; en: string; desc: string }[];
}

const BIKE_PARTS_LIST: BikePartImageItem[] = [
  {
    id: 'road-parts-main',
    order: 1,
    title: '로드 자전거 부위별 명칭 (Road Bike Parts)',
    subtitle: 'PartsoftheBike_Road.jpg',
    category: 'Road',
    originalFileName: 'PartsoftheBike_Road.jpg',
    src: '/images/bike_parts/PartsoftheBike_Road.jpg',
    description: '로드바이크의 핸들바(드롭바), 듀얼 컨트롤 레버(후드), 탑튜브, 시트튜브, 크랭크, 드레일러 등 주요 부품의 공식 영문 및 국문 명칭입니다.',
    keyParts: [
      { ko: '드롭바 (핸들바)', en: 'Drop Handlebars', desc: '다양한 그립 포지션을 제공하는 로드바이크 특유의 구부러진 핸들바' },
      { ko: '후드 / 브레이크 레버', en: 'Brake / Shift Levers (Hoods)', desc: '피팅의 기준이 되는 주 파지 부위이며 변속과 제동을 담당' },
      { ko: '스템', en: 'Stem', desc: '조향축(포크 스티어러)과 핸들바를 연결하며 리치와 스택 조절의 핵심 부품' },
      { ko: '안장 및 싯포스트', en: 'Saddle & Seatpost', desc: '라이더의 골반을 지지하고 안장 높이(Inseam) 및 셋백(KOPS)을 결정' },
      { ko: '크랭크 & 체인링', en: 'Crankset & Chainrings', desc: '페달링 회전력을 체인으로 전달하는 구동계 중심축' },
      { ko: '앞/뒤 드레일러', en: 'Front & Rear Derailleur', desc: '체인을 체인링 및 스프라켓(카세트) 사이로 이동시키는 변속기' },
    ],
  },
  {
    id: 'mountain-parts',
    order: 2,
    title: '산악 자전거(MTB) 부위별 명칭 (Mountain Bike Parts)',
    subtitle: 'PartsoftheBike_mountain.jpg',
    category: 'Mountain',
    originalFileName: 'PartsoftheBike_mountain.jpg',
    src: '/images/bike_parts/PartsoftheBike_mountain.jpg',
    description: '서스펜션 포크, 유압식 디스크 브레이크, 와이드 플랫바 등 험로 주행에 최적화된 MTB 부품 명칭 구조입니다.',
    keyParts: [
      { ko: '플랫 / 라이저 바', en: 'Flat / Riser Handlebars', desc: '거친 노면에서 강한 조종성을 확보해주는 넓은 일자형 핸들바' },
      { ko: '서스펜션 포크 (샥)', en: 'Suspension Fork (Shock)', desc: '노면 충격을 흡수하는 트래블 구조의 앞 포크 완충 장치' },
      { ko: '유압 디스크 브레이크', en: 'Hydraulic Disc Brakes', desc: '진흙과 우천 시에도 일정한 제동력을 제공하는 로터 & 캘리퍼 시스템' },
      { ko: '가변 싯포스트 (드롭퍼)', en: 'Dropper Seatpost', desc: '다운힐 급경사 시 레버로 안장 높이를 즉시 낮출 수 있는 싯포스트' },
      { ko: '광폭 튜브리스 타이어', en: 'Knobby Tubeless Tires', desc: '접지력(Grip)을 극대화한 놉(Knob) 패턴의 저압 타이어' },
    ],
  },
  {
    id: 'road-parts-detailed',
    order: 3,
    title: '로드 자전거 상세 지오메트리 & 부품 (Road Bike Detailed)',
    subtitle: 'Partsofthebike_road (1).jpg',
    category: 'Geometry & Detailed',
    originalFileName: 'Partsofthebike_road (1).jpg',
    src: '/images/bike_parts/Partsofthebike_road_1.jpg',
    description: '프레임의 세부 튜빙(탑튜브, 다운튜브, 시트스테이, 체인스테이, 헤드튜브) 및 지오메트리 측정 기준점 상세 명칭입니다.',
    keyParts: [
      { ko: '탑튜브 (수평/슬로핑)', en: 'Top Tube', desc: '헤드튜브와 시트튜브를 연결하며 유효 탑튜브 길이가 자전거 리치를 결정' },
      { ko: '헤드튜브', en: 'Head Tube', desc: '포크 스티어러가 삽입되는 튜브로 자전거 스택(Stack) 높이에 직접적 영향' },
      { ko: '다운튜브', en: 'Down Tube', desc: '헤드튜브와 비비쉘(BB)을 연결하는 가장 굵고 단단한 하단 지지 튜브' },
      { ko: '시트스테이 & 체인스테이', en: 'Seatstays & Chainstays', desc: '뒷바퀴를 감싸는 후방 삼각 프레임으로 승차감과 힘 전달력 결정' },
      { ko: '바텀 브라켓 (BB)', en: 'Bottom Bracket (BB Shell)', desc: '크랭크 액슬이 회전하는 베어링 조립체이며 피팅의 공간적 원점(0,0)' },
    ],
  },
];

interface BikePartsGuideProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const BikePartsGuide: React.FC<BikePartsGuideProps> = ({ onClose, isModal = false }) => {
  const [selectedImage, setSelectedImage] = useState<BikePartImageItem | null>(null);

  return (
    <div className={`space-y-6 ${isModal ? 'p-4 sm:p-6 text-slate-100' : ''}`}>
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bike className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              자전거 부위별 명칭 가이드
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                총 3편 수록
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            로드 자전거 및 산악 자전거의 프레임 부위, 조향계, 구동계 공식 부품 명칭입니다. 피팅 처방 시 스템, 싯포스트 셋백, 크랭크 등의 명칭을 이해하는 데 도움이 됩니다.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition shrink-0"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sequential Image List (1 -> 2 -> 3) */}
      <div className="space-y-6">
        {BIKE_PARTS_LIST.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-cyan-500/20">
                  {item.order}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    파일명: {item.originalFileName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {item.category}
                </span>
                <button
                  onClick={() => setSelectedImage(item)}
                  className="flex items-center gap-1 px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 hover:text-cyan-200 border border-cyan-800 rounded-lg text-xs font-semibold transition"
                  title="원본 크기로 크게 보기"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>크게보기</span>
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div
              onClick={() => setSelectedImage(item)}
              className="relative bg-slate-950 p-2 sm:p-4 flex items-center justify-center cursor-pointer group"
            >
              <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto max-h-[580px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-cyan-400 text-xs font-semibold flex items-center gap-1.5 shadow-xl">
                    <ZoomIn className="w-4 h-4" />
                    <span>클릭하여 고화질 확대 뷰어 열기</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Key Terminology */}
            <div className="p-4 sm:p-5 bg-slate-950/30 border-t border-slate-800/80 text-xs space-y-3">
              <p className="text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Key Parts Pills/List */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  주요 부품 한·영 명칭 및 피팅 연계
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {item.keyParts.map((part, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between gap-1 font-bold text-white mb-0.5">
                        <span className="text-cyan-300 text-[11px]">{part.ko}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{part.en}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {part.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs">
                {selectedImage.order}
              </span>
              <strong className="text-white text-sm">{selectedImage.title}</strong>
              <span className="text-slate-400 font-mono hidden sm:inline">
                ({selectedImage.originalFileName})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={selectedImage.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>새 탭에서 원본 보기</span>
              </a>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 rounded-xl transition"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Image Container */}
          <div
            className="flex-1 flex items-center justify-center overflow-auto p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
