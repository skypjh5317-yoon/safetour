import React, { useState } from 'react';
import { WorldMap } from './components/WorldMap';
import { CountryDossierModal } from './components/CountryDossierModal';
import { ConflictTracker } from './components/ConflictTracker';
import { RouteSafetyChecker } from './components/RouteSafetyChecker';
import { SafeDestinationsGuide } from './components/SafeDestinationsGuide';
import { EmergencyGuide } from './components/EmergencyGuide';
import { CountryInfo } from './types/travelRisk';
import { COUNTRIES_DATA } from './data/countriesData';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  Flame, 
  Plane, 
  ShieldCheck, 
  LifeBuoy, 
  Globe2, 
  AlertTriangle,
  Info
} from 'lucide-react';

type TabType = 'map' | 'conflicts' | 'route' | 'safe' | 'emergency';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [targetFocusCoords, setTargetFocusCoords] = useState<[number, number] | null>(null);
  const [routePresetDest, setRoutePresetDest] = useState<CountryInfo | null>(null);

  // Quick stats
  const warCount = COUNTRIES_DATA.filter(c => c.riskLevel === 'war').length;
  const safeCount = COUNTRIES_DATA.filter(c => c.riskLevel === 'safe').length;

  const handleFocusMap = (coords: [number, number], country?: CountryInfo) => {
    setActiveTab('map');
    setTargetFocusCoords(coords);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const handleSelectAlternative = (countryName: string) => {
    const cleanName = countryName.split(' ')[0];
    const found = COUNTRIES_DATA.find(c => c.nameKo.includes(cleanName) || c.nameEn.toLowerCase().includes(cleanName.toLowerCase()));
    if (found) {
      setSelectedCountry(found);
    }
  };

  const handleAddToRouteChecker = (country: CountryInfo) => {
    setRoutePresetDest(country);
    setActiveTab('route');
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-white">
      {/* Top Warning Ticker Banner */}
      <div className="bg-gradient-to-r from-red-950/90 via-red-900/80 to-slate-900 border-b border-red-800/60 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-bold text-white flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              글로벌 안보 경보:
            </span>
            <span className="truncate">
              전쟁·무력 분쟁 지역 <strong>{warCount}개국</strong>은 세계 지도에 <strong>빨간색(Red)</strong>으로 위험 표시 중입니다. 여행 계획 시 해당 지역 및 인근 폐쇄 영공을 반드시 회피하세요.
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-red-300 font-medium shrink-0">
            <span>외교부 영사콜센터 24시: +82-2-3210-0404</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-0.5 shadow-lg shadow-red-900/40">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  세이프투어 <span className="text-red-500 text-sm font-semibold">(SafeTour)</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                  전쟁 회피 가이드
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                전쟁·분쟁 국가 위험 지도 시각화 및 안전 여행지 안내
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'map'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>세계 안전 지도</span>
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'conflicts'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span>분쟁·전쟁 분석</span>
            </button>
            <button
              onClick={() => setActiveTab('route')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'route'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Plane className="w-4 h-4 text-amber-400" />
              <span>경로 안전 진단</span>
            </button>
            <button
              onClick={() => setActiveTab('safe')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'safe'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>안심 여행지 추천</span>
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'emergency'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LifeBuoy className="w-4 h-4 text-cyan-400" />
              <span>비상 매뉴얼</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TAB 1: World Map View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Map Header Description Card */}
            <div className="p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>전 세계 분쟁 및 여행 경보 시각화 지도</span>
                  <span className="text-xs font-normal text-slate-400">(인터랙티브 SVG 벡터 지도)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  <span className="text-red-400 font-bold">빨간색(Red)</span>으로 표시된 국가는 현재 전쟁 또는 심각한 무력 충돌(외교부 4단계 여행금지) 상태입니다. 국가를 클릭하면 상세 분석과 안전 대체지를 확인할 수 있습니다.
                </p>
              </div>

              {/* Quick Jump Hotspot Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] block sm:inline">주요 분쟁국 바로가기:</span>
                <button
                  onClick={() => {
                    const ukr = COUNTRIES_DATA.find(c => c.id === '804');
                    if (ukr) {
                      setTargetFocusCoords(ukr.coords);
                      setSelectedCountry(ukr);
                    }
                  }}
                  className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 transition-colors"
                >
                  우크라이나
                </button>
                <button
                  onClick={() => {
                    const isr = COUNTRIES_DATA.find(c => c.id === '376');
                    if (isr) {
                      setTargetFocusCoords(isr.coords);
                      setSelectedCountry(isr);
                    }
                  }}
                  className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 transition-colors"
                >
                  이스라엘/가자
                </button>
                <button
                  onClick={() => {
                    const sdn = COUNTRIES_DATA.find(c => c.id === '729');
                    if (sdn) {
                      setTargetFocusCoords(sdn.coords);
                      setSelectedCountry(sdn);
                    }
                  }}
                  className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 transition-colors"
                >
                  수단
                </button>
                <button
                  onClick={() => {
                    const mmr = COUNTRIES_DATA.find(c => c.id === '104');
                    if (mmr) {
                      setTargetFocusCoords(mmr.coords);
                      setSelectedCountry(mmr);
                    }
                  }}
                  className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 transition-colors"
                >
                  미얀마
                </button>
                <button
                  onClick={() => {
                    const che = COUNTRIES_DATA.find(c => c.id === '756');
                    if (che) {
                      setTargetFocusCoords(che.coords);
                      setSelectedCountry(che);
                    }
                  }}
                  className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition-colors"
                >
                  스위스 (안심)
                </button>
              </div>
            </div>

            {/* Interactive Vector Map */}
            <WorldMap
              onSelectCountry={(c) => setSelectedCountry(c)}
              selectedCountry={selectedCountry}
              targetFocusCoords={targetFocusCoords}
            />
          </div>
        )}

        {/* TAB 2: Conflict Tracker */}
        {activeTab === 'conflicts' && (
          <ConflictTracker
            onFocusMap={handleFocusMap}
            onSelectCountry={(c) => setSelectedCountry(c)}
          />
        )}

        {/* TAB 3: Route Safety Checker */}
        {activeTab === 'route' && (
          <RouteSafetyChecker
            onSelectCountryForMap={(c) => {
              setActiveTab('map');
              setTargetFocusCoords(c.coords);
              setSelectedCountry(c);
            }}
            presetDestination={routePresetDest}
          />
        )}

        {/* TAB 4: Safe Destinations Guide */}
        {activeTab === 'safe' && (
          <SafeDestinationsGuide
            onSelectCountry={(c) => setSelectedCountry(c)}
            onFocusMap={handleFocusMap}
          />
        )}

        {/* TAB 5: Emergency Action Manual */}
        {activeTab === 'emergency' && (
          <EmergencyGuide />
        )}
      </main>

      {/* Country Detail Dossier Modal */}
      <CountryDossierModal
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        onSelectAlternative={handleSelectAlternative}
        onAddToRouteChecker={handleAddToRouteChecker}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-semibold text-slate-400">
              세이프투어 (SafeTour) • 여행자를 위한 글로벌 분쟁 및 위험지역 실시간 안내 서비스
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              본 서비스는 대한민국 외교부 해외안전여행 고시, 유엔(UN) 안보리 보고서, 국제 항공안전 영공 고시(NOTAM) 및 글로벌 평화지수(GPI)를 바탕으로 제작되었습니다.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>외교부 영사콜센터: +82-2-3210-0404</span>
            <span>•</span>
            <span>해외안전여행: 0404.go.kr</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
