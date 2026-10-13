import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  Flame, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';

export const EmergencyGuide: React.FC = () => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-800/60 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <LifeBuoy className="w-4 h-4" />
          해외 비상 상황 대응 매뉴얼
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          외교부 영사콜센터 및 해외 위기 대처 가이드
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          해외에서 분쟁, 테러, 자연재해 등 긴급 사태에 직면했을 때 즉각 취해야 할 행동 요령과 24시간 긴급 연락처입니다.
        </p>
      </div>

      {/* 24/7 Hotlines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MOFA Consular Call Center */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-3">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">외교부 24시간 영사콜센터</h3>
            <p className="text-xs text-slate-400 mb-3">
              365일 24시간 연중무휴 통역 및 사건·사고 긴급 지원
            </p>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-cyan-300 font-bold text-sm flex items-center justify-between">
              <span>+82-2-3210-0404</span>
              <button
                onClick={() => copyToClipboard('+82-2-3210-0404')}
                className="text-xs text-slate-400 hover:text-white"
              >
                {copiedNumber === '+82-2-3210-0404' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            * 유료 및 국가별 무료 직통전화 연결 가능
          </div>
        </div>

        {/* Free KakaoTalk Consular Consultation */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">카카오톡 영사콜센터 상담</h3>
            <p className="text-xs text-slate-400 mb-3">
              Wi-Fi만 있으면 전 세계 어디서나 실시간 1:1 채팅 상담
            </p>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-amber-300 font-medium text-xs flex items-center justify-between">
              <span>카카오톡 친구검색: [영사콜센터]</span>
              <button
                onClick={() => copyToClipboard('영사콜센터')}
                className="text-xs text-slate-400 hover:text-white"
              >
                {copiedNumber === '영사콜센터' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            * 통신비 부담 없이 데이터망으로 즉각 상담
          </div>
        </div>

        {/* Rapid Consular Support & Escape */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">해외안전여행 '동행' 등록</h3>
            <p className="text-xs text-slate-400 mb-3">
              위기 발생 시 가족 및 대사관에 위치 정보를 신속 공유
            </p>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-emerald-300 text-xs">
              0404.go.kr 여행일정 사전 등록
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            * 현지 위기 경보 SMS 자동 수신
          </div>
        </div>
      </div>

      {/* Crisis Action Protocols */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-400" />
          분쟁·총격·공습 위기 상황별 행동 수칙
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-2">
            <div className="font-bold text-red-300 flex items-center gap-1.5">
              <span>🚨 1. 총격전 또는 공습 경보 발령 시</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 text-xs leading-relaxed">
              <li>즉시 바닥에 엎드려 머리를 감싸고 단단한 콘크리트 기둥 뒤로 엄폐합니다.</li>
              <li>유리창, 외벽, 차량 근처는 파편 피해가 크므로 즉시 피합니다.</li>
              <li>사이렌이 울리면 방공호(Shelter) 또는 지하실, 내부 계단실로 대피합니다.</li>
              <li>소셜 미디어에 군사 시설 위치나 군인 이동 경로를 촬영해 올리지 않습니다.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-2">
            <div className="font-bold text-orange-300 flex items-center gap-1.5">
              <span>✈️ 2. 영공 폐쇄 및 항공편 취소 시</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 text-xs leading-relaxed">
              <li>무리하게 공항에 가지 말고 안전한 숙소에서 대기하며 운항 재개 여부를 확인합니다.</li>
              <li>대한민국 대사관 또는 영사관에 현재 체류 위치와 연락처를 등록합니다.</li>
              <li>육로 국경 대피 권고가 내려질 경우 대사관 인솔 경로를 반드시 따릅니다.</li>
              <li>현금과 상비약, 휴대폰 보조배터리를 충분히 확보해 둡니다.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>🛡️ 3. 해외여행자보험 분쟁지역 확인 팁</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 text-xs leading-relaxed">
              <li>대부분의 일반 여행자보험은 '전쟁, 무력분쟁, 소요사태'로 인한 피해를 면책(보상 제외)합니다.</li>
              <li>외교부 3단계(출국권고) 및 4단계(여행금지) 국가 방문 시 보험금 청구가 불가합니다.</li>
              <li>위험 국가 인근을 경유할 경우 영공 우회에 따른 항공편 지연 특별 보장 특약을 확인하세요.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-2">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>🛂 4. 여권 분실 및 긴급 여권 발급</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 text-xs leading-relaxed">
              <li>여권 사본 2매와 여권용 사진 2매, 신분증 사본을 스마트폰 클라우드와 가방에 분리 보관하세요.</li>
              <li>분실 시 현지 경찰서에서 분실신고서(Police Report)를 발급받아야 재발급이 신속합니다.</li>
              <li>현지 대한민국 대사관/총영사관에서 '긴급단수여권'을 당일 또는 익일 발급받을 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
