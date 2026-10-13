import React, { useState } from 'react';
import { CountryInfo } from '../types/travelRisk';
import { RISK_COLORS } from './WorldMap';
import { 
  X, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Plane, 
  PhoneCall, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check,
  ExternalLink
} from 'lucide-react';

interface CountryDossierModalProps {
  country: CountryInfo | null;
  onClose: () => void;
  onSelectAlternative?: (countryName: string) => void;
  onAddToRouteChecker?: (country: CountryInfo) => void;
}

export const CountryDossierModal: React.FC<CountryDossierModalProps> = ({
  country,
  onClose,
  onSelectAlternative,
  onAddToRouteChecker
}) => {
  const [copiedContact, setCopiedContact] = useState(false);

  if (!country) return null;

  const colorConfig = RISK_COLORS[country.riskLevel];
  const isWar = country.riskLevel === 'war';

  const copyContact = () => {
    if (country.emergencyContact) {
      navigator.clipboard.writeText(country.emergencyContact);
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Header Banner */}
        <div 
          className={`p-5 sm:p-6 border-b transition-colors ${
            isWar 
              ? 'bg-gradient-to-r from-red-950/80 via-red-900/60 to-slate-900 border-red-800/80' 
              : country.riskLevel === 'level3'
              ? 'bg-gradient-to-r from-orange-950/80 via-orange-900/60 to-slate-900 border-orange-800/80'
              : country.riskLevel === 'safe'
              ? 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-slate-900 border-emerald-800/80'
              : 'bg-slate-800/80 border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {country.continent}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${colorConfig.badgeBg}`}>
                  {country.mofaLevelText}
                </span>
                {isWar && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-600 text-white flex items-center gap-1 animate-pulse">
                    <Flame className="w-3.5 h-3.5" /> 활성 전쟁·분쟁 국가
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                {country.nameKo}
                <span className="text-sm sm:text-base font-normal text-slate-400">({country.nameEn})</span>
              </h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>수도: <strong className="text-slate-300">{country.capitalKo}</strong></span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Main Advisory Alert Banner */}
          <div 
            className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              isWar
                ? 'bg-red-950/50 border-red-600/50 text-red-200'
                : country.riskLevel === 'level3'
                ? 'bg-orange-950/40 border-orange-600/50 text-orange-200'
                : country.riskLevel === 'level2'
                ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
                : country.riskLevel === 'safe'
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                : 'bg-sky-950/40 border-sky-600/50 text-sky-200'
            }`}
          >
            {isWar ? (
              <Flame className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            ) : country.riskLevel === 'safe' ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm sm:text-base mb-1">
                {isWar ? '⚠️ 여행 절대 금지: 전쟁 및 심각한 무력 충돌 지역' : `${country.nameKo} 안전 평가 브리핑`}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                {country.advisorySummary}
              </p>
            </div>
          </div>

          {/* Safety Score Meter */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">여행 안전 지수 (Peace & Safety Score)</span>
              <span className="font-bold font-mono text-sm">
                <span className={country.safetyScore >= 80 ? 'text-emerald-400' : country.safetyScore >= 50 ? 'text-amber-400' : 'text-red-400'}>
                  {country.safetyScore}
                </span>
                <span className="text-slate-500"> / 100</span>
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  country.safetyScore >= 80 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                    : country.safetyScore >= 50 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                    : 'bg-gradient-to-r from-red-600 to-rose-500'
                }`}
                style={{ width: `${Math.max(country.safetyScore, 5)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>위험 (0)</span>
              <span>주의 (50)</span>
              <span>안심 (100)</span>
            </div>
          </div>

          {/* Specific Danger Factors (if any) */}
          {country.dangerReasons && country.dangerReasons.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                주요 위험 요인 및 주의점
              </h4>
              <ul className="space-y-1.5">
                {country.dangerReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                    <span className="text-red-400 font-bold shrink-0">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safe regions guidance if applicable */}
          {country.safeRegionsAdvice && (
            <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/70 text-xs sm:text-sm">
              <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                지역별 세부 조언 & 여행 권고사항
              </div>
              <p className="text-slate-300 leading-relaxed">
                {country.safeRegionsAdvice}
              </p>
            </div>
          )}

          {/* Safe Alternative Recommendations (Crucial for travel planners avoiding war!) */}
          {country.recommendedAlternatives && country.recommendedAlternatives.length > 0 && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
              <div className="font-bold text-emerald-300 text-sm mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                위험 국가 회피를 위한 안전한 대체 추천 여행지
              </div>
              <p className="text-xs text-slate-300 mb-3">
                현재 위험한 이 지역 대신 유사한 문화·자연 경관을 안전하게 경험할 수 있는 평화로운 안심 여행지입니다:
              </p>
              <div className="flex flex-wrap gap-2">
                {country.recommendedAlternatives.map((alt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 flex items-center gap-1.5 transition-colors group"
                  >
                    <span>{alt}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Embassy & Consular Contact */}
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 block text-[11px]">외교부 영사콜센터 및 재외공관 긴급 연락망</span>
                <span className="font-medium text-slate-200">
                  {country.emergencyContact || '외교부 24시간 영사콜센터 (+82-2-3210-0404)'}
                </span>
              </div>
            </div>
            {country.emergencyContact && (
              <button
                onClick={copyContact}
                className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                {copiedContact ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>연락처 복사</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px]">
            * 대한민국 외교부 해외안전여행 고시 및 글로벌 평화지수(GPI) 기준
          </div>
          <div className="flex items-center gap-2">
            {onAddToRouteChecker && (
              <button
                onClick={() => {
                  onAddToRouteChecker(country);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-600/30"
              >
                <Plane className="w-4 h-4" />
                여행 경로 진단에 추가
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
