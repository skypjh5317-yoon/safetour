export type RiskLevel = 'war' | 'level3' | 'level2' | 'level1' | 'safe';

export interface WarDetails {
  conflictName: string;
  parties: string;
  status: string;
  threatTypes: string[];
  airspaceClosure: boolean;
  summary: string;
  recentUpdate: string;
}

export interface CountryInfo {
  id: string; // ISO 3166-1 numeric
  iso2?: string;
  iso3?: string;
  nameKo: string;
  nameEn: string;
  capitalKo: string;
  continent: '아시아' | '유럽' | '중동' | '아프리카' | '아메리카' | '오세아니아';
  riskLevel: RiskLevel;
  isAtWar: boolean; // 전쟁·무력분쟁 직접 당사국 여부
  dangerCategory?: '전면전쟁' | '내전' | '군사충돌' | '테러·치안붕괴' | '국경분쟁';
  safetyScore: number; // 0 to 100
  mofaLevelText: string; // 외교부 기준 단계 설명
  advisorySummary: string;
  dangerReasons: string[];
  safeRegionsAdvice?: string;
  recommendedAlternatives?: string[];
  emergencyContact?: string;
  coords: [number, number]; // [longitude, latitude] for map centering
}

export interface ConflictFlashpoint {
  id: string;
  titleKo: string;
  regionKo: string;
  countriesInvolved: string[];
  coords: [number, number];
  intensity: '극심 (전면전)' | '심각 (교전·공습)' | '고조 (국지적 무력 충돌)';
  impactOnTravel: string;
  airspaceStatus: '전면 폐쇄' | '일부 우회 권고' | '위험 영공 지정';
  summary: string;
  recommendation: string;
}

export interface RouteCheckResult {
  isSafe: boolean;
  overallScore: number;
  verdict: 'safe' | 'caution' | 'danger' | 'critical';
  verdictTitle: string;
  verdictDescription: string;
  warZonesDetected: CountryInfo[];
  highRiskDetected: CountryInfo[];
  airspaceWarnings: string[];
  safeTransitSuggestions: string[];
}
