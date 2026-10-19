'use client';

import React, { useState } from 'react';
import { BIKE_DATABASE, BikeGeometry } from '../data/bikes';
import { Database, Search, Check, Sparkles, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { CalibrationPin } from '../lib/canvasOverlay';

interface BikeGeometryDatabaseProps {
  selectedBike: {
    bike: BikeGeometry;
    sizeName: string;
  } | null;
  onSelectBike: (bike: BikeGeometry, sizeName: string) => void;
  onApplyWheelbaseToScale: (wheelbaseMm: number) => void;
}

export const BikeGeometryDatabase: React.FC<BikeGeometryDatabaseProps> = ({
  selectedBike,
  onSelectBike,
  onApplyWheelbaseToScale,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBikeId, setActiveBikeId] = useState<string>(selectedBike?.bike.id || BIKE_DATABASE[0].id);

  const brands = ['All', ...Array.from(new Set(BIKE_DATABASE.map((b) => b.brand)))];

  const filteredBikes = BIKE_DATABASE.filter((bike) => {
    const matchesBrand = selectedBrand === 'All' || bike.brand === selectedBrand;
    const matchesSearch =
      bike.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const activeBike = BIKE_DATABASE.find((b) => b.id === activeBikeId) || BIKE_DATABASE[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              로드 자전거 지오메트리 DB (Geometry Explorer)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            주요 제조사(스페셜라이즈드, 트렉, 자이언트, 캐니언 등)의 스택(Stack) & 리치(Reach) 제원
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="브랜드 또는 모델명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Brand Filters */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedBrand === brand
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {brand === 'All' ? '전체 브랜드' : brand}
          </button>
        ))}
      </div>

      {/* Main Layout: Bike List & Geometry Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Bike Selection Cards */}
        <div className="lg:col-span-5 space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {filteredBikes.map((bike) => {
            const isSelected = activeBike.id === bike.id;
            return (
              <button
                key={bike.id}
                onClick={() => setActiveBikeId(bike.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-semibold">
                      {bike.category}
                    </span>
                    <span className="text-xs font-bold">{bike.brand}</span>
                    <span className="text-[11px] text-slate-400">{bike.year}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{bike.model}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    사이즈: {bike.sizes.map((s) => s.sizeName).join(', ')}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Geometry Details & Size Table */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs text-cyan-400 font-semibold tracking-wider uppercase">
                  {activeBike.brand} • {activeBike.category}
                </span>
                <h3 className="text-lg font-extrabold text-white">{activeBike.model}</h3>
              </div>
            </div>

            {/* Geometry Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-2.5">사이즈</th>
                    <th className="py-2 px-2.5">스택</th>
                    <th className="py-2 px-2.5">리치</th>
                    <th className="py-2 px-2.5">S/R 비율</th>
                    <th className="py-2 px-2.5">탑튜브</th>
                    <th className="py-2 px-2.5">휠베이스</th>
                    <th className="py-2 px-2.5">크랭크</th>
                    <th className="py-2 px-2.5 text-center">선택</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {activeBike.sizes.map((size) => {
                    const ratio = (size.stack / size.reach).toFixed(2);
                    const isCurrentSelected =
                      selectedBike?.bike.id === activeBike.id && selectedBike?.sizeName === size.sizeName;

                    return (
                      <tr
                        key={size.sizeName}
                        className={`hover:bg-slate-800/40 transition ${
                          isCurrentSelected ? 'bg-cyan-950/60 text-cyan-200' : ''
                        }`}
                      >
                        <td className="py-2 px-2.5 font-bold text-white">{size.sizeName}</td>
                        <td className="py-2 px-2.5 font-semibold text-cyan-400">{size.stack}mm</td>
                        <td className="py-2 px-2.5 font-semibold text-amber-400">{size.reach}mm</td>
                        <td className="py-2 px-2.5 text-slate-400">{ratio}</td>
                        <td className="py-2 px-2.5">{size.topTubeLength}mm</td>
                        <td className="py-2 px-2.5">{size.wheelbase}mm</td>
                        <td className="py-2 px-2.5">{size.stockCrankLength}mm</td>
                        <td className="py-2 px-2.5 text-center">
                          <button
                            onClick={() => {
                              onSelectBike(activeBike, size.sizeName);
                              onApplyWheelbaseToScale(size.wheelbase);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 mx-auto ${
                              isCurrentSelected
                                ? 'bg-emerald-500 text-slate-950 font-extrabold'
                                : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300'
                            }`}
                          >
                            {isCurrentSelected ? (
                              <>
                                <Check className="w-3 h-3" /> 적용됨
                              </>
                            ) : (
                              '내 바이크로 적용'
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>
                💡 <strong>스택/리치(S/R) 비율 가이드:</strong> 1.40 미만(공격적 에어로), 1.40~1.45(올라운드 레이싱), 1.45 이상(편안한 엔듀런스 포지션)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
