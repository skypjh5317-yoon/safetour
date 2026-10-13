import React, { useState } from 'react';
import { SAFE_COUNTRIES } from '../data/countriesData';
import { CountryInfo } from '../types/travelRisk';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Sun, 
  Trees, 
  Coffee, 
  Compass,
  MapPin
} from 'lucide-react';

interface SafeDestinationsGuideProps {
  onSelectCountry: (country: CountryInfo) => void;
  onFocusMap: (coords: [number, number], country?: CountryInfo) => void;
}

export const SafeDestinationsGuide: React.FC<SafeDestinationsGuideProps> = ({
  onSelectCountry,
  onFocusMap
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'all' | 'nature' | 'city' | 'culture'>('all');

  // Categorize safe countries
  const curatedDestinations = [
    {
      countryId: '756', // Switzerland
      theme: 'nature',
      themeLabel: '알프스 대자연 & 평화',
      tagline: '영세 중립국으로 분쟁 위험 0%, 세계 최고 수준의 치안',
      highlight: '인터라켄, 체르마트, 융프라우, 알프스 파노라마 열차'
    },
    {
      countryId: '352', // Iceland
      theme: 'nature',
      themeLabel: '오로라 & 지열 온천',
      tagline: '16년 연속 세계평화지수(GPI) 1위, 군대 없는 평화 천국',
      highlight: '골든 서클, 블루라군, 레이캬비크 오로라 링로드'
    },
    {
      countryId: '578', // Norway
      theme: 'nature',
      themeLabel: '피오르드 대자연',
      tagline: '낮은 범죄율과 경이로운 대자연, 북유럽 최고 복지 국가',
      highlight: '베르겐 송네 피오르드, 트롬쇠 백야 및 오로라'
    },
    {
      countryId: '554', // New Zealand
      theme: 'nature',
      themeLabel: '청정 힐링의 섬',
      tagline: '남반구 최고의 안전국, 국제 분쟁과 완전히 격리된 평화',
      highlight: '퀸스타운 밀포드 사운드, 로토루아 마오리 문화'
    },
    {
      countryId: '124', // Canada
      theme: 'nature',
      themeLabel: '로키 산맥 & 나이아가라',
      tagline: '북미에서 가장 총기 범죄로부터 안전한 청정 대국',
      highlight: '밴프 국립공원, 레이크 루이스, 밴쿠버, 퀘벡시티'
    },
    {
      countryId: '392', // Japan
      theme: 'city',
      themeLabel: '도심 미식 & 온천 힐링',
      tagline: '나홀로 여행자에게 가장 안전한 이웃나라, 최상위 치안',
      highlight: '도쿄, 교토 문화유산, 홋카이도 온천, 후쿠오카'
    },
    {
      countryId: '702', // Singapore
      theme: 'city',
      themeLabel: '도시 정원 & 밤거리 안전',
      tagline: '여성 1인 야간 보행도 완벽하게 안심할 수 있는 세계 1위 치안',
      highlight: '가든스 바이 더 베이, 마리나베이 샌즈, 센토사 섬'
    },
    {
      countryId: '158', // Taiwan
      theme: 'city',
      themeLabel: '야시장 미식 & 온정',
      tagline: '친절한 시민 의식과 활기차고 안전한 밤도깨비 야시장',
      highlight: '타이베이 101, 지우펀, 타이난 미식 투어'
    },
    {
      countryId: '040', // Austria
      theme: 'city',
      themeLabel: '음악의 도시 & 알프스 호수',
      tagline: '가장 살기 좋은 도시 1위 비엔나와 평온한 호수마을',
      highlight: '비엔나 벨베데레, 잘츠부르크 모차르트 생가, 할슈타트'
    },
    {
      countryId: '208', // Denmark
      theme: 'city',
      themeLabel: '휘게(Hygge) 감성 라이프',
      tagline: '자전거 친화적이고 아늑한 평화의 북유럽 수도',
      highlight: '코펜하겐 뉘하운 운하, 티볼리 가든'
    },
    {
      countryId: '620', // Portugal
      theme: 'culture',
      themeLabel: '낭만 노을 & 에그타르트',
      tagline: '세계평화지수 7위, 서유럽에서 가장 따뜻하고 친절한 나라',
      highlight: '리스본 노란 트램, 포르투 도루강 야경, 신트라 궁전'
    },
    {
      countryId: '203', // Czechia
      theme: 'culture',
      themeLabel: '중세 고성과 맥주 순례',
      tagline: '동유럽에서 가장 평화롭고 치안이 뛰어난 낭만 수도',
      highlight: '프라하 카를교, 프라하 성, 체스키 크룸로프'
    },
    {
      countryId: '191', // Croatia
      theme: 'culture',
      themeLabel: '아드리아해의 보석',
      tagline: '청명한 아드리아해와 유네스코 성벽 도시의 평화',
      highlight: '두브로브니크 구시가지, 플리트비체 국립공원 호수'
    },
    {
      countryId: '705', // Slovenia
      theme: 'culture',
      themeLabel: '알프스의 숨은 보물',
      tagline: '세계평화지수 8위, 때묻지 않은 자연과 안전한 환경',
      highlight: '블레드 호수 섬 성당, 포스토이나 동굴'
    }
  ];

  const filtered = curatedDestinations.filter(item => {
    if (selectedTheme === 'all') return true;
    return item.theme === selectedTheme;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              글로벌 평화지수(GPI) 기반 큐레이션
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              분쟁 걱정 없는 안심 여행지 추천 가이드
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              전쟁과 무력 분쟁의 위협이 전혀 없고 치안과 의료 인프라가 뛰어난 세계 최고의 평화 국가들입니다.
            </p>
          </div>

          {/* Theme Filters */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs self-start">
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedTheme === 'all'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              전체 추천
            </button>
            <button
              onClick={() => setSelectedTheme('nature')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                selectedTheme === 'nature'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trees className="w-3.5 h-3.5" /> 대자연 힐링
            </button>
            <button
              onClick={() => setSelectedTheme('city')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                selectedTheme === 'city'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" /> 도심·미식 안심
            </button>
            <button
              onClick={() => setSelectedTheme('culture')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                selectedTheme === 'culture'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> 역사 & 문화
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const country = SAFE_COUNTRIES.find(c => c.id === item.countryId);
          if (!country) return null;

          return (
            <div
              key={country.id}
              className="p-5 bg-slate-900/90 border border-slate-800 hover:border-emerald-600/70 rounded-2xl shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {item.themeLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    안전지수 {country.safetyScore}점
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                  {country.nameKo} <span className="text-xs font-normal text-slate-400">({country.nameEn})</span>
                </h3>

                <p className="text-xs text-emerald-200/90 font-medium mb-3">
                  {item.tagline}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {country.advisorySummary}
                </p>

                {/* Highlights */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs mb-4">
                  <span className="text-slate-400 block mb-1">✨ 대표 관광 스팟:</span>
                  <span className="text-slate-200 font-medium">{item.highlight}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectCountry(country)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  상세 리포트 보기
                </button>
                <button
                  onClick={() => {
                    onFocusMap(country.coords, country);
                    onSelectCountry(country);
                  }}
                  className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/40 flex items-center gap-1 transition-all"
                >
                  <span>지도에서 보기</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
