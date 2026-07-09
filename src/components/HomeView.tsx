import React from 'react';
import { 
  ShieldAlert, Compass, PhoneCall, MapPin, Users, HelpCircle, 
  Clock, Shield, BookOpen, Settings2, Sparkles, Battery, Mic, WifiOff
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HomeViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectFeature: (feature: 'sos' | 'route' | 'fakecall' | 'nearby' | 'circle' | 'cyber' | 'checkin' | 'education' | 'privacy' | 'selfdefense') => void;
  batteryLevel: number;
  isOffline: boolean;
  voiceActive: boolean;
  contactsCount: number;
}

export default function HomeView({
  language,
  onLanguageChange,
  onSelectFeature,
  batteryLevel,
  isOffline,
  voiceActive,
  contactsCount
}: HomeViewProps) {
  const t = translations[language];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans h-full overflow-y-auto hide-scrollbar">
      
      {/* Top App Bar Header */}
      <div className="px-5 py-3.5 bg-slate-900/80 border-b border-neutral-800/60 sticky top-0 z-30 backdrop-blur flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500 animate-pulse" />
          <h1 className="text-sm font-bold font-display tracking-wider text-white">
            {t.appName}
          </h1>
        </div>
        
        {/* Quick select and config button */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-neutral-900 border border-neutral-800 text-[10px] rounded px-1.5 py-0.5 text-white focus:outline-none"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="hr">हरियाणवी</option>
          </select>
          <button 
            onClick={() => onSelectFeature('privacy')}
            className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
            title="Privacy and Settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-1.5 flex items-center justify-between text-[10px] text-red-400 font-medium">
          <span className="flex items-center gap-1">
            <WifiOff className="w-3 h-3" />
            No internet! Safety fallback enabled: SMS sending GPS coordinates.
          </span>
        </div>
      )}

      {/* Dynamic Voice Active Indicator */}
      {voiceActive && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1 flex items-center justify-center text-[10px] text-green-400 font-semibold gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          <span>Listening for Voice Safety Phrases (e.g. &ldquo;Help me&rdquo;)</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="p-4 space-y-4 flex-1 flex flex-col">
        
        {/* Emergency Number Calling Button */}
        <div className="bg-red-950/40 border border-red-900/30 rounded-2xl p-3 flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold text-red-400 flex items-center gap-1">
              🚨 India National Helpline: 112
            </h2>
            <p className="text-[10px] text-neutral-400">{t.oneTapCalling}</p>
          </div>
          <a 
            href="tel:112"
            onClick={(e) => {
              e.preventDefault();
              alert("Calling India Helpline 112... Direct telephone call triggered!");
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow"
          >
            {t.callingButton}
          </a>
        </div>

        {/* Central SOS Button Area */}
        <div className="flex-1 flex flex-col justify-center items-center py-6 min-h-[190px]">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring indicators behind button */}
            <div className="absolute w-[180px] h-[180px] rounded-full bg-red-600/10 animate-radar-ripple" />
            <div className="absolute w-[220px] h-[220px] rounded-full bg-red-600/5 animate-radar-ripple" style={{ animationDelay: '0.5s' }} />
            
            {/* The main active SOS Button */}
            <button
              onClick={() => onSelectFeature('sos')}
              className="relative w-[150px] h-[150px] bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 active:scale-95 transition-all rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-slate-950 animate-safety-pulse group"
            >
              <ShieldAlert className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold font-display text-white tracking-widest mt-1">
                {t.sosButton}
              </span>
              <span className="text-[8px] font-mono font-medium text-red-200 tracking-wider">
                {t.sosSubtitle}
              </span>
            </button>
          </div>
        </div>

        {/* Core Safety Grid Features (Bento style) */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Tile: YouTube Self-Defense (Span 2) */}
          <button
            onClick={() => onSelectFeature('selfdefense')}
            className="col-span-2 bg-gradient-to-r from-red-950/40 to-slate-900/70 border border-red-500/30 hover:border-red-500/60 p-3 rounded-2xl flex items-center justify-between text-left transition-all group relative overflow-hidden"
            id="selfdefense-home-btn"
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-600/10 transition-all" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-red-950/30">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    {language === 'en' ? 'Self-Defense Training' : language === 'hi' ? 'आत्मरक्षा फाइटिंग' : 'आत्मरक्षा लड़न सीख'}
                  </span>
                  <span className="text-[7px] font-mono bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                    YOUTUBE
                  </span>
                </div>
                <p className="text-[9px] text-neutral-400">
                  {language === 'en' 
                    ? 'Watch physical defense videos & practice quick combos' 
                    : language === 'hi'
                      ? 'मुसीबत में खुद को बचाने और लड़ने के तरीके सीखें'
                      : 'मुसीबत में भिड़न और खुद नै बचाण के तरीके सीखो'}
                </p>
              </div>
            </div>
            <div className="text-red-400 font-bold text-[9px] uppercase font-mono tracking-wider shrink-0 bg-neutral-950/60 border border-neutral-800 px-2 py-1 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
              {language === 'en' ? 'Learn' : 'सीखें'}
            </div>
          </button>

          {/* Tile 1: Safe Route */}
          <button
            onClick={() => onSelectFeature('route')}
            className="bg-slate-900/70 border border-neutral-800 hover:border-blue-500/50 p-3 rounded-2xl flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all">
              <Compass className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-neutral-200 mt-2">{t.safeRoute}</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">Lighting & scores</span>
          </button>

          {/* Tile 2: Fake Call */}
          <button
            onClick={() => onSelectFeature('fakecall')}
            className="bg-slate-900/70 border border-neutral-800 hover:border-purple-500/50 p-3 rounded-2xl flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-all">
              <PhoneCall className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-neutral-200 mt-2">{t.fakeCall}</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">Quick escape call</span>
          </button>

          {/* Tile 3: Nearby Help */}
          <button
            onClick={() => onSelectFeature('nearby')}
            className="bg-slate-900/70 border border-neutral-800 hover:border-emerald-500/50 p-3 rounded-2xl flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-all">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-neutral-200 mt-2">{t.nearbyHelp}</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">Helplines & map</span>
          </button>

          {/* Tile 4: Safety Circle */}
          <button
            onClick={() => onSelectFeature('circle')}
            className="bg-slate-900/70 border border-neutral-800 hover:border-amber-500/50 p-3 rounded-2xl flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-all flex justify-between items-center w-full">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1.5 rounded-full font-mono">{contactsCount} Contacts</span>
            </div>
            <span className="text-xs font-bold text-neutral-200 mt-2">{t.safetyCircle}</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">Granular permissions</span>
          </button>

          {/* Tile 5: Cyber Safety */}
          <button
            onClick={() => onSelectFeature('cyber')}
            className="bg-slate-900/70 border border-neutral-800 hover:border-red-500/50 p-3 rounded-2xl flex flex-col items-start text-left transition-all group col-span-1"
          >
            <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-all flex items-center gap-1 w-full">
              <HelpCircle className="w-4 h-4 text-red-400" />
              <Sparkles className="w-2.5 h-2.5 text-yellow-400 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-neutral-200 mt-2">{t.cyberSafety}</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">Gemini AI Scan</span>
          </button>

          {/* Tile 6: Check-in Timer */}
          <button
            onClick={() => onSelectFeature('checkin')}
            className="bg-slate-900/70 border border-neutral-800 hover:border-teal-500/50 p-3 rounded-2xl flex flex-col items-start text-left transition-all group col-span-1"
          >
            <div className="p-2 bg-teal-500/10 rounded-xl group-hover:bg-teal-500/20 transition-all">
              <Clock className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-xs font-bold text-neutral-200 mt-2">{t.checkInTimer}</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">Automatic alarms</span>
          </button>

        </div>

        {/* Footer Quick Actions (Education Guides & Privacy Center) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button 
            onClick={() => onSelectFeature('education')}
            className="flex items-center justify-center gap-1.5 bg-neutral-900 border border-neutral-850 py-2.5 rounded-xl text-neutral-300 hover:bg-neutral-850 transition-all text-[11px]"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.emergencyGuides}</span>
          </button>
          
          <button 
            onClick={() => onSelectFeature('privacy')}
            className="flex items-center justify-center gap-1.5 bg-neutral-900 border border-neutral-850 py-2.5 rounded-xl text-neutral-300 hover:bg-neutral-850 transition-all text-[11px]"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.privacyCenter}</span>
          </button>
        </div>

        {/* Bottom Disclaimer */}
        <p className="text-[8px] text-center text-neutral-500 leading-normal font-sans pt-1">
          {t.disclaimerText}
        </p>

      </div>
    </div>
  );
}
