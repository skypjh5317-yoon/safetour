import React, { useState } from 'react';
import { ACTIVE_WAR_FLASHPOINTS } from '../data/conflictData';
import { ConflictFlashpoint, CountryInfo } from '../types/travelRisk';
import { COUNTRIES_DATA } from '../data/countriesData';
import { 
  Flame, 
  MapPin, 
  AlertTriangle, 
  Plane, 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  Filter
} from 'lucide-react';

interface ConflictTrackerProps {
  onFocusMap: (coords: [number, number], country?: CountryInfo) => void;
  onSelectCountry: (country: CountryInfo) => void;
}

export const ConflictTracker: React.FC<ConflictTrackerProps> = ({
  onFocusMap,
  onSelectCountry
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredFlashpoints = ACTIVE_WAR_FLASHPOINTS.filter(item => {
    if (selectedRegion === 'all') return true;
    return item.regionKo.includes(selectedRegion);
  });

  const handleInspectConflict = (item: ConflictFlashpoint) => {
    // Find primary country involved
    const primaryCountryName = item.countriesInvolved[0];
    const country = COUNTRIES_DATA.find(c => c.nameKo.includes(primaryCountryName));
    onFocusMap(item.coords, country);
    if (country) {
      onSelectCountry(country);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="p-5 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 animate-pulse" />
              전 세계 활성 전쟁·무력 분쟁 감시
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              전쟁·교전 지역 실시간 브리핑 및 여행 위험 구역
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              현재 군사적 교전 및 공습이 진행 중인 주요 분쟁 지역입니다. 이들 국가는 지도 상에서 빨간색으로 표시됩니다.
            </p>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs self-start">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRegion === 'all'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedRegion('동유럽')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRegion === '동유럽'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              유럽
            </button>
            <button
              onClick={() => setSelectedRegion('중동')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRegion === '중동'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              중동
            </button>
            <button
              onClick={() => setSelectedRegion('아프리카')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRegion === '아프리카'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              아프리카
            </button>
            <button
              onClick={() => setSelectedRegion('동남아시아')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRegion === '동남아시아'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              아시아
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Conflict Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFlashpoints.map((conflict) => (
          <div
            key={conflict.id}
            className="p-5 bg-slate-900/90 border border-slate-800 hover:border-red-600/60 rounded-2xl shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/80 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                  {conflict.intensity}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {conflict.regionKo}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-300 transition-colors mb-2">
                {conflict.titleKo}
              </h3>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {conflict.summary}
              </p>

              {/* Danger Factors Table */}
              <div className="space-y-2 mb-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                <div className="flex items-start gap-2">
                  <Plane className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">영공 운항: </span>
                    <strong className="text-amber-300">{conflict.airspaceStatus}</strong>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">여행 영향: </span>
                    <span className="text-slate-200">{conflict.impactOnTravel}</span>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-xs text-red-200 mb-4">
                <strong className="block text-red-300 mb-0.5">⚠️ 여행 안전 지침</strong>
                {conflict.recommendation}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                관련국: {conflict.countriesInvolved.join(', ')}
              </span>
              <button
                onClick={() => handleInspectConflict(conflict)}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg border border-red-500/40 flex items-center gap-1.5 transition-all font-medium"
              >
                <span>지도에서 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
