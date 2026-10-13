import React, { useState, useMemo } from 'react';
import { CountryInfo, RouteCheckResult } from '../types/travelRisk';
import { COUNTRIES_DATA } from '../data/countriesData';
import { RISK_COLORS } from './WorldMap';
import { 
  Plane, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface RouteSafetyCheckerProps {
  onSelectCountryForMap: (country: CountryInfo) => void;
  presetDestination?: CountryInfo | null;
}

export const RouteSafetyChecker: React.FC<RouteSafetyCheckerProps> = ({
  onSelectCountryForMap,
  presetDestination
}) => {
  // Pre-sorted country lists for dropdowns
  const sortedCountries = useMemo(() => {
    return [...COUNTRIES_DATA].sort((a, b) => a.nameKo.localeCompare(b.nameKo, 'ko'));
  }, []);

  const [originId, setOriginId] = useState<string>('410'); // Default: 대한민국 (South Korea)
  const [transitId, setTransitId] = useState<string>(''); // Optional Transit
  const [destinationId, setDestinationId] = useState<string>(
    presetDestination ? presetDestination.id : '804' // Default demo: 우크라이나 (shows war warning clearly!)
  );

  // Sync if preset destination changes
  React.useEffect(() => {
    if (presetDestination) {
      setDestinationId(presetDestination.id);
    }
  }, [presetDestination]);

  const origin = useMemo(() => COUNTRIES_DATA.find(c => c.id === originId), [originId]);
  const transit = useMemo(() => COUNTRIES_DATA.find(c => c.id === transitId), [transitId]);
  const destination = useMemo(() => COUNTRIES_DATA.find(c => c.id === destinationId), [destinationId]);

  // Route Analysis Result
  const routeAnalysis = useMemo<RouteCheckResult>(() => {
    const warZones: CountryInfo[] = [];
    const highRisks: CountryInfo[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    const itinerary = [origin, transit, destination].filter(Boolean) as CountryInfo[];

    itinerary.forEach((c) => {
      if (c.riskLevel === 'war') {
        warZones.push(c);
      } else if (c.riskLevel === 'level3') {
        highRisks.push(c);
      }
    });

    // Transit airspace checks
    if (transit) {
      if (['376', '422', '364', '368', '887'].includes(transit.id)) {
        warnings.push(`${transit.nameKo} 경유 시 중동 미사일 요격 및 영공 임시 폐쇄로 인한 결항·회항 위험이 매우 높습니다.`);
      } else if (['643', '804', '112'].includes(transit.id)) {
        warnings.push(`${transit.nameKo} 영공은 전쟁으로 인해 민간 항공기 통항이 전면 금지 또는 극도로 위험합니다.`);
      }
    }

    // Destination checks
    if (destination) {
      if (destination.isAtWar) {
        warnings.push(`목적지인 [${destination.nameKo}]은(는) 현재 전쟁·무력 분쟁 상태로 외교부 여행금지(4단계) 국가입니다. 대한민국 여권 소지자 입국 시 여권법 위반으로 형사 처벌됩니다.`);
        if (destination.recommendedAlternatives) {
          suggestions.push(...destination.recommendedAlternatives);
        }
      } else if (destination.riskLevel === 'level3') {
        warnings.push(`목적지인 [${destination.nameKo}]은(는) 출국권고(3단계) 지역으로 테러, 납치, 무력 충돌의 높은 위험이 있습니다.`);
        if (destination.recommendedAlternatives) {
          suggestions.push(...destination.recommendedAlternatives);
        }
      } else if (destination.riskLevel === 'level2') {
        warnings.push(`목적지인 [${destination.nameKo}]은(는) 여행자제(2단계) 국가로 일부 치안 우범지역 및 국경 지대 방문에 각별한 주의가 필요합니다.`);
      }
    }

    let verdict: RouteCheckResult['verdict'] = 'safe';
    let verdictTitle = '✅ 안전한 여행 경로입니다';
    let verdictDescription = '선택하신 일정에는 전쟁 지역이나 고위험 국가가 포함되어 있지 않습니다. 일반적인 해외여행 안전수칙을 지키며 즐거운 여행을 계획하세요.';
    let score = 95;

    if (warZones.length > 0) {
      verdict = 'critical';
      verdictTitle = '⛔ 여행 절대 불가 (전쟁·분쟁 구역 포함)';
      verdictDescription = `경로 중 활성 전쟁 및 여행금지 국가(${warZones.map(w => w.nameKo).join(', ')})가 포함되어 있습니다. 민간인 방문이 금지되어 있으며 즉각적인 일정 변경이 필요합니다.`;
      score = 5;
    } else if (highRisks.length > 0 || warnings.length > 1) {
      verdict = 'danger';
      verdictTitle = '⚠️ 높은 위험 감지 (일정 재검토 권고)';
      verdictDescription = '출국권고 지역 또는 영공 폐쇄 위험 지역이 포함되어 있습니다. 여행 취소 또는 대체 안전 지역 선택을 강력히 권고합니다.';
      score = 35;
    } else if (destination?.riskLevel === 'level2') {
      verdict = 'caution';
      verdictTitle = '⚡ 신변안전 유의 (여행자제 국가 포함)';
      verdictDescription = '주요 관광지는 방문 가능하나 치안 불안 지역과 야간 단독 보행을 피하고 현지 안전 공지를 주시해야 합니다.';
      score = 65;
    }

    return {
      isSafe: verdict === 'safe',
      overallScore: score,
      verdict,
      verdictTitle,
      verdictDescription,
      warZonesDetected: warZones,
      highRiskDetected: highRisks,
      airspaceWarnings: warnings,
      safeTransitSuggestions: suggestions
    };
  }, [origin, transit, destination]);

  // Route presets to help user test different scenarios
  const applyPreset = (preset: { origin: string; transit: string; dest: string }) => {
    setOriginId(preset.origin);
    setTransitId(preset.transit);
    setDestinationId(preset.dest);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Plane className="w-4 h-4" />
              스마트 여행 안전 진단기
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              여행 경로 위험도 및 분쟁 지역 통과 검사
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              출발지와 경유지, 최종 목적지를 선택하면 전쟁·분쟁 국가 통과 여부 및 비행 영공 안전을 실시간 진단합니다.
            </p>
          </div>
        </div>

        {/* Quick Demo Preset Chips */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 추천 테스트 경로:
          </span>
          <button
            onClick={() => applyPreset({ origin: '410', transit: '', dest: '804' })}
            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 transition-colors"
          >
            🔥 우크라이나 분쟁지 검사
          </button>
          <button
            onClick={() => applyPreset({ origin: '410', transit: '364', dest: '250' })}
            className="px-2.5 py-1 rounded-lg bg-orange-950/60 hover:bg-orange-900/60 text-orange-300 border border-orange-800/60 transition-colors"
          >
            ⚠️ 이란 영공 경유 유럽행 검사
          </button>
          <button
            onClick={() => applyPreset({ origin: '410', transit: '702', dest: '756' })}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition-colors"
          >
            🛡️ 싱가포르 경유 스위스 안심 코스
          </button>
          <button
            onClick={() => applyPreset({ origin: '410', transit: '', dest: '392' })}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition-colors"
          >
            🌸 일본 직항 안심 코스
          </button>
        </div>
      </div>

      {/* Route Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Origin */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              출발지 (Departure)
            </div>
            <label className="block text-sm font-bold text-white mb-2">출발 국가</label>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500"
            >
              {sortedCountries.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nameKo} ({c.nameEn})
                </option>
              ))}
            </select>
          </div>
          {origin && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">치안 상태</span>
              <span className={`px-2 py-0.5 rounded font-medium border ${RISK_COLORS[origin.riskLevel].badgeBg}`}>
                {origin.mofaLevelText.split(':')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Transit */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              경유지 / 환승 허브 (Layover)
            </div>
            <label className="block text-sm font-bold text-white mb-2">경유 국가 (선택)</label>
            <select
              value={transitId}
              onChange={(e) => setTransitId(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">직항 (경유지 없음)</option>
              {sortedCountries.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nameKo} ({c.nameEn}) {c.riskLevel === 'war' ? '🔥 [전쟁중]' : ''}
                </option>
              ))}
            </select>
          </div>
          {transit ? (
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">경유지 위험도</span>
              <span className={`px-2 py-0.5 rounded font-medium border ${RISK_COLORS[transit.riskLevel].badgeBg}`}>
                {transit.mofaLevelText.split(':')[0]}
              </span>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500">
              직항 노선 이용
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              최종 목적지 (Destination)
            </div>
            <label className="block text-sm font-bold text-white mb-2">도착 국가</label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500"
            >
              {sortedCountries.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nameKo} ({c.nameEn}) {c.isAtWar ? '🚨 [전쟁·여행금지]' : ''}
                </option>
              ))}
            </select>
          </div>
          {destination && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">목적지 경보</span>
              <span className={`px-2 py-0.5 rounded font-medium border ${RISK_COLORS[destination.riskLevel].badgeBg}`}>
                {destination.mofaLevelText.split(':')[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Diagnosis Verdict Card */}
      <div 
        className={`p-6 rounded-2xl border transition-all ${
          routeAnalysis.verdict === 'critical'
            ? 'bg-red-950/40 border-red-600 shadow-2xl shadow-red-950/50'
            : routeAnalysis.verdict === 'danger'
            ? 'bg-orange-950/40 border-orange-600 shadow-xl'
            : routeAnalysis.verdict === 'caution'
            ? 'bg-amber-950/30 border-amber-600/70 shadow-lg'
            : 'bg-emerald-950/30 border-emerald-600/70 shadow-lg'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            {routeAnalysis.verdict === 'critical' ? (
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center shrink-0">
                <Flame className="w-7 h-7 text-red-500 animate-pulse" />
              </div>
            ) : routeAnalysis.verdict === 'danger' ? (
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-orange-400" />
              </div>
            ) : routeAnalysis.verdict === 'caution' ? (
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {routeAnalysis.verdictTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {routeAnalysis.verdictDescription}
              </p>
            </div>
          </div>

          {/* Safety Score Meter */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800 self-stretch md:self-auto justify-between md:justify-start">
            <span className="text-xs text-slate-400">여정 종합 안전도</span>
            <span className="font-mono text-xl font-extrabold">
              <span className={routeAnalysis.overallScore >= 80 ? 'text-emerald-400' : routeAnalysis.overallScore >= 50 ? 'text-amber-400' : 'text-red-400'}>
                {routeAnalysis.overallScore}
              </span>
              <span className="text-xs text-slate-500"> / 100</span>
            </span>
          </div>
        </div>

        {/* Warnings list */}
        {routeAnalysis.airspaceWarnings.length > 0 && (
          <div className="mt-5 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              경로 상 위험 요인 상세 내역
            </div>
            {routeAnalysis.airspaceWarnings.map((warning, idx) => (
              <div key={idx} className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 leading-relaxed">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action recommendations & alternative destinations */}
        {routeAnalysis.safeTransitSuggestions.length > 0 && (
          <div className="mt-5 p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl">
            <div className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              위험 지역 대체 안심 여행지 추천
            </div>
            <p className="text-xs text-slate-300 mb-3">
              현재 분쟁/위험 구역을 피하여 안전하게 방문할 수 있는 추천 여행지입니다. 클릭하여 지도를 확인하세요:
            </p>
            <div className="flex flex-wrap gap-2">
              {routeAnalysis.safeTransitSuggestions.map((sugg, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const countryName = sugg.split(' ')[0];
                    const found = COUNTRIES_DATA.find(c => c.nameKo.includes(countryName));
                    if (found) {
                      setDestinationId(found.id);
                      onSelectCountryForMap(found);
                    }
                  }}
                  className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>{sugg}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View on Map CTA */}
        {destination && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              선택한 목적지 위치와 주변 국경 정세를 지도에서 직접 확인하시겠습니까?
            </span>
            <button
              onClick={() => onSelectCountryForMap(destination)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>지도에서 위치 확인</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
