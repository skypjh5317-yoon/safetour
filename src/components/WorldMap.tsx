import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import * as topojson from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import worldDataRaw from 'world-atlas/countries-110m.json';
import { CountryInfo, RiskLevel } from '../types/travelRisk';
import { getCountryByIdOrName, COUNTRIES_DATA } from '../data/countriesData';
import { ACTIVE_WAR_FLASHPOINTS } from '../data/conflictData';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Crosshair,
  Filter,
  Layers,
  MapPin
} from 'lucide-react';

interface WorldMapProps {
  onSelectCountry: (country: CountryInfo) => void;
  selectedCountry: CountryInfo | null;
  targetFocusCoords?: [number, number] | null;
}

// Color palette
export const RISK_COLORS: Record<RiskLevel, { fill: string; stroke: string; label: string; textClass: string; badgeBg: string }> = {
  war: {
    fill: '#EF4444', // Red-500
    stroke: '#991B1B', // Red-800
    label: '전쟁·무력분쟁 (여행금지)',
    textClass: 'text-red-400',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40'
  },
  level3: {
    fill: '#F97316', // Orange-500
    stroke: '#9A3412', // Orange-800
    label: '3단계: 출국권고',
    textClass: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  },
  level2: {
    fill: '#F59E0B', // Amber-500
    stroke: '#B45309', // Amber-700
    label: '2단계: 여행자제',
    textClass: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  level1: {
    fill: '#0284C7', // Sky-600
    stroke: '#0369A1',
    label: '1단계: 여행유의',
    textClass: 'text-sky-400',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  },
  safe: {
    fill: '#10B981', // Emerald-500
    stroke: '#047857',
    label: '안심 여행지 (경보 없음)',
    textClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
};

const BASE_WIDTH = 960;
const BASE_HEIGHT = 500;

interface MapFeatureItem {
  feature: any;
  path: string | null;
  info: CountryInfo;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectCountry,
  selectedCountry,
  targetFocusCoords
}) => {
  // Transform state for pan/zoom
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filter state: 'all' | 'war' | 'level3' | 'level2' | 'level1' | 'safe'
  const [activeFilter, setActiveFilter] = useState<'all' | RiskLevel>('all');
  const [showRadarBeacons, setShowRadarBeacons] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Hover state
  const [hoveredCountry, setHoveredCountry] = useState<CountryInfo | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // TopoJSON to GeoJSON features
  const geoFeatures = useMemo(() => {
    try {
      const geo = topojson.feature(worldDataRaw as any, (worldDataRaw as any).objects.countries) as any;
      return geo.features || [];
    } catch (e) {
      console.error('Failed to parse topojson:', e);
      return [];
    }
  }, []);

  // Map projection & path generator
  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .scale(154)
      .translate([BASE_WIDTH / 2, BASE_HEIGHT / 2]);
  }, []);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // Precompute paths & country info for fast rendering
  const featureData = useMemo<MapFeatureItem[]>(() => {
    return geoFeatures.map((f: any) => {
      const path = pathGenerator(f);
      const info = getCountryByIdOrName(f.id, f.properties?.name);
      return {
        feature: f,
        path,
        info
      };
    });
  }, [geoFeatures, pathGenerator]);

  // Handle focus request from external components (e.g. clicking conflict card)
  useEffect(() => {
    if (targetFocusCoords) {
      const projected = projection(targetFocusCoords);
      if (projected) {
        const [px, py] = projected;
        const newScale = 2.4;
        const targetX = BASE_WIDTH / 2 - px * newScale;
        const targetY = BASE_HEIGHT / 2 - py * newScale;
        setScale(newScale);
        setPosition({ x: targetX, y: targetY });
      }
    }
  }, [targetFocusCoords, projection]);

  // Zoom handlers
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.35, 6));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(prev / 1.35, 0.9);
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setActiveFilter('all');
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setScale(prev => {
      const next = Math.max(0.9, Math.min(prev * zoomFactor, 6));
      return next;
    });
  };

  // Drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Search filtered results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return COUNTRIES_DATA.filter(
      c => c.nameKo.toLowerCase().includes(query) || c.nameEn.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery]);

  const selectSearchResult = (country: CountryInfo) => {
    onSelectCountry(country);
    setSearchQuery('');
    setIsSearchFocused(false);
    if (country.coords) {
      const projected = projection(country.coords);
      if (projected) {
        const [px, py] = projected;
        const newScale = 2.5;
        setScale(newScale);
        setPosition({
          x: BASE_WIDTH / 2 - px * newScale,
          y: BASE_HEIGHT / 2 - py * newScale
        });
      }
    }
  };

  // Counts for legend
  const stats = useMemo(() => {
    return {
      war: COUNTRIES_DATA.filter(c => c.riskLevel === 'war').length,
      level3: COUNTRIES_DATA.filter(c => c.riskLevel === 'level3').length,
      level2: COUNTRIES_DATA.filter(c => c.riskLevel === 'level2').length,
      level1: COUNTRIES_DATA.filter(c => c.riskLevel === 'level1').length,
      safe: COUNTRIES_DATA.filter(c => c.riskLevel === 'safe').length
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Top Bar: Search, Quick Filters, View Controls */}
      <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="국가명 검색 (예: 우크라이나, 이스라엘, 스위스, 일본...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-800">
              {searchResults.map(country => {
                const config = RISK_COLORS[country.riskLevel];
                return (
                  <button
                    key={country.id + country.nameEn}
                    onClick={() => selectSearchResult(country)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <span>{country.nameKo}</span>
                        <span className="text-xs font-normal text-slate-400">({country.nameEn})</span>
                        {country.isAtWar && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-600/30 text-red-400 border border-red-500/40 rounded">
                            🔥 전쟁 중
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{country.advisorySummary}</div>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
                      {country.mofaLevelText.split(':')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-slate-400 hidden lg:inline flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> 필터:
          </span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-200 text-slate-900 shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setActiveFilter('war')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === 'war'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400'
                : 'bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            전쟁·분쟁만 ({stats.war})
          </button>
          <button
            onClick={() => setActiveFilter('level3')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
              activeFilter === 'level3'
                ? 'bg-orange-600 text-white shadow ring-2 ring-orange-400'
                : 'bg-slate-800/80 text-orange-400 border border-orange-900/40 hover:bg-slate-700'
            }`}
          >
            출국권고 ({stats.level3})
          </button>
          <button
            onClick={() => setActiveFilter('level2')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
              activeFilter === 'level2'
                ? 'bg-amber-600 text-white shadow ring-2 ring-amber-400'
                : 'bg-slate-800/80 text-amber-400 border border-amber-900/40 hover:bg-slate-700'
            }`}
          >
            여행자제 ({stats.level2})
          </button>
          <button
            onClick={() => setActiveFilter('safe')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeFilter === 'safe'
                ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-400'
                : 'bg-slate-800/80 text-emerald-400 border border-emerald-900/40 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            안심여행지 ({stats.safe})
          </button>
        </div>

        {/* Radar Flashpoint Toggle & Zoom Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowRadarBeacons(!showRadarBeacons)}
            title="분쟁 레이더 비콘 토글"
            className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all ${
              showRadarBeacons
                ? 'bg-red-950/40 border-red-600/50 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">분쟁 비콘</span>
          </button>
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700/80 p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="지도 확대"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="지도 축소"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="위치 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map SVG Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-[400px] sm:h-[520px] lg:h-[600px] bg-[#090d16] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredCountry(null);
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Graticule / Ocean background styling */}
          <defs>
            {/* Glow filters for active war zones */}
            <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="intense-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Grid pattern for high-tech aesthetic */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Ocean Background */}
          <rect width={BASE_WIDTH} height={BASE_HEIGHT} fill="#090d16" />
          <rect width={BASE_WIDTH} height={BASE_HEIGHT} fill="url(#grid)" />

          {/* Zoomable / Pannable Map Layer */}
          <g
            transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
            style={{ transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
          >
            {/* Map geometries */}
            {featureData.map(({ feature, path, info }) => {
              if (!path) return null;

              const isWar = info.riskLevel === 'war';
              const isSelected = selectedCountry?.id === info.id;
              const isHovered = hoveredCountry?.id === info.id;

              // Filter logic
              let isDimmed = false;
              if (activeFilter !== 'all') {
                if (info.riskLevel !== activeFilter) {
                  isDimmed = true;
                }
              }

              // Color determination
              const colorConfig = RISK_COLORS[info.riskLevel];
              let fillColor = colorConfig.fill;
              let strokeColor = colorConfig.stroke;

              if (isDimmed) {
                fillColor = '#1e293b'; // slate-800
                strokeColor = '#0f172a';
              } else if (isWar) {
                fillColor = '#EF4444'; // Bright Red
                strokeColor = '#991B1B';
              }

              if (isSelected) {
                strokeColor = '#FFFFFF';
              } else if (isHovered) {
                strokeColor = '#F8FAFC';
              }

              return (
                <path
                  key={feature.id || info.nameEn}
                  d={path}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 1.8 / scale : isHovered ? 1.2 / scale : 0.6 / scale}
                  opacity={isDimmed ? 0.35 : 1}
                  filter={isWar && !isDimmed ? 'url(#red-glow)' : undefined}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredCountry(info)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCountry(info);
                  }}
                />
              );
            })}

            {/* Radar beacons on active war zones */}
            {showRadarBeacons && (
              <g className="pointer-events-none">
                {ACTIVE_WAR_FLASHPOINTS.map((flashpoint) => {
                  const projected = projection(flashpoint.coords);
                  if (!projected) return null;
                  const [cx, cy] = projected;

                  return (
                    <g key={flashpoint.id} transform={`translate(${cx}, ${cy})`}>
                      {/* Outer animated ripple */}
                      <circle
                        r={14 / Math.sqrt(scale)}
                        fill="rgba(239, 68, 68, 0.25)"
                        stroke="#EF4444"
                        strokeWidth={1 / scale}
                        className="animate-ping"
                      />
                      {/* Secondary wave */}
                      <circle
                        r={8 / Math.sqrt(scale)}
                        fill="rgba(220, 38, 38, 0.4)"
                        stroke="#F87171"
                        strokeWidth={0.8 / scale}
                      />
                      {/* Center pin */}
                      <circle
                        r={3.5 / Math.sqrt(scale)}
                        fill="#FFFFFF"
                        stroke="#B91C1C"
                        strokeWidth={1.2 / scale}
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoveredCountry && (
          <div
            className="absolute z-40 pointer-events-none px-3 py-2 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md text-xs transition-opacity duration-150"
            style={{
              left: `${Math.min(Math.max(mousePos.x + 15, 10), (containerRef.current?.clientWidth || 800) - 220)}px`,
              top: `${Math.min(Math.max(mousePos.y - 45, 10), (containerRef.current?.clientHeight || 500) - 100)}px`
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-100 text-sm">{hoveredCountry.nameKo}</span>
              <span className="text-[11px] text-slate-400">({hoveredCountry.nameEn})</span>
            </div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${RISK_COLORS[hoveredCountry.riskLevel].badgeBg}`}>
                {hoveredCountry.mofaLevelText}
              </span>
              {hoveredCountry.isAtWar && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                  🔥 전쟁 중
                </span>
              )}
            </div>
            <p className="text-slate-300 max-w-[200px] line-clamp-2 leading-relaxed">
              {hoveredCountry.advisorySummary}
            </p>
            <div className="mt-1 text-[10px] text-cyan-400 font-medium">클릭하여 상세 정보 보기 →</div>
          </div>
        )}

        {/* Map Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-30 p-2.5 sm:p-3 bg-slate-900/90 border border-slate-800 rounded-xl backdrop-blur-md text-xs shadow-xl max-w-[240px] sm:max-w-xs">
          <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              여행 위험도 단계 범례
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-red-500 shadow-sm shadow-red-500/50 inline-block border border-red-400 animate-pulse"></span>
                <span className="font-semibold text-red-300">전쟁·무력분쟁 (여행금지)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{stats.war}개국</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-orange-500 inline-block border border-orange-400"></span>
                <span>3단계: 출국권고</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{stats.level3}개국</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block border border-amber-400"></span>
                <span>2단계: 여행자제</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{stats.level2}개국</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-sky-600 inline-block border border-sky-400"></span>
                <span>1단계: 여행유의</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{stats.level1}개국</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block border border-emerald-400"></span>
                <span className="text-emerald-300">안심 여행지 (경보 없음)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{stats.safe}개국</span>
            </div>
          </div>
        </div>

        {/* Map Quick Help / Interaction Guide (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-30 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] text-slate-400">
          <span>마우스 드래그: 이동</span>
          <span>•</span>
          <span>스크롤: 확대/축소</span>
          <span>•</span>
          <span>국가 클릭: 상세정보</span>
        </div>
      </div>
    </div>
  );
};
