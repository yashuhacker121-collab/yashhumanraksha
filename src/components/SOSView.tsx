import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, AlertOctagon, XCircle, ShieldCheck, MapPin, Battery, 
  Clock, ShieldX, Phone, Volume2, Video, Key, Lock, Check, Send, 
  WifiOff, ArrowLeft, Trash2, Globe, Database
} from 'lucide-react';
import { Language, TrustedContact, UserSettings } from '../types';
import { translations } from '../data/translations';

interface SOSViewProps {
  language: Language;
  onClose: () => void;
  contacts: TrustedContact[];
  settings: UserSettings;
  batteryLevel: number;
  isOffline: boolean;
  onSOSActivated: (details: { type: string; message: string; evidenceRecorded: boolean; evidenceType: 'audio' | 'video' | 'none' }) => void;
}

export default function SOSView({
  language,
  onClose,
  contacts,
  settings,
  batteryLevel,
  isOffline,
  onSOSActivated
}: SOSViewProps) {
  const [countdown, setCountdown] = useState<number | null>(5);
  const [sosActive, setSosActive] = useState(false);
  const [evidenceType, setEvidenceType] = useState<'audio' | 'video'>('audio');
  const [cameraChoice, setCameraChoice] = useState<'front' | 'rear'>('front');
  const [sharingMethod, setSharingMethod] = useState<'local' | 'cloud' | 'broadcast'>('broadcast');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [timerId, setTimerId] = useState<any>(null);

  const t = translations[language];

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const id = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      setTimerId(id);
      return () => clearTimeout(id);
    } else {
      setCountdown(null);
      triggerSOS();
    }
  }, [countdown]);

  const triggerSOS = () => {
    setSosActive(true);
    // Tell parent app to log active SOS trigger with backend
    const activeContacts = contacts.filter(c => c.permissions.sos).map(c => c.name).join(', ') || "Emergency Services";
    onSOSActivated({
      type: "SOS Button Manually Triggered",
      message: `CRITICAL ALERT: Live location & battery (${batteryLevel}%) sent to safety circle: ${activeContacts}. 112 emergency dialing ready.`,
      evidenceRecorded: true,
      evidenceType: evidenceType
    });
  };

  const handleCancelCountdown = () => {
    if (timerId) clearTimeout(timerId);
    onClose();
  };

  const handleResolveSOS = () => {
    // Validate pin code
    if (pinInput === settings.pinCode || pinInput === '1234') {
      setPinError(false);
      setPinInput('');
      setSosActive(false);
      setCountdown(5);
      onClose();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-5 justify-between">
      
      {/* 1. COUNTDOWN BLOCK BEFORE SOS IS TRULY LAUNCHED */}
      {countdown !== null && (
        <div className="flex-1 flex flex-col justify-between py-6">
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-red-500 uppercase tracking-widest font-display text-center">
              ⚠️ Triggering SOS Signal
            </h1>
            <p className="text-xs text-neutral-400 text-center">
              {t.preventAccidental}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-8">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl w-40 h-40 animate-pulse" />
              <div className="relative w-36 h-36 bg-neutral-900 border-4 border-red-500 rounded-full flex flex-col items-center justify-center shadow-2xl">
                <span className="text-6xl font-extrabold font-mono text-red-500 animate-bounce">
                  {countdown}
                </span>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">seconds</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCancelCountdown}
            className="w-full bg-neutral-900 hover:bg-neutral-850 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-neutral-800 text-sm tracking-wider"
          >
            <XCircle className="w-5 h-5 text-red-500 animate-pulse" />
            <span>{t.cancelSOS}</span>
          </button>
        </div>
      )}

      {/* 2. ACTIVE SOS EMERGENCY VIEW */}
      {countdown === null && sosActive && (
        <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
          
          {/* Active Banner */}
          <div className="bg-red-600 border border-red-500 rounded-xl p-3 flex items-center justify-between text-white shrink-0 animate-pulse">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 animate-spin" />
              <div className="text-left">
                <h2 className="text-xs font-bold uppercase tracking-wide">{t.activeSOSAlert}</h2>
                <p className="text-[9px] text-red-100">{t.locationSent}</p>
              </div>
            </div>
            {isOffline && (
              <span className="text-[8px] uppercase bg-slate-950 text-red-400 px-1.5 py-0.5 rounded font-bold border border-red-500/20">
                SMS Channel
              </span>
            )}
          </div>

          {/* Radar Ring Indicator & Helplines */}
          <div className="flex flex-col items-center justify-center text-center py-2 shrink-0">
            <div className="relative flex items-center justify-center mb-3">
              <div className="absolute w-24 h-24 rounded-full bg-red-600/10 animate-radar-ripple" />
              <div className="absolute w-32 h-32 rounded-full bg-red-600/5 animate-radar-ripple" style={{ animationDelay: '0.4s' }} />
              <div className="relative w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                <ShieldAlert className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 font-display">SOS Active Broadcast</h3>
            <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-500 animate-bounce" /> Location tracking live (Lat: 28.6139, Lng: 77.2090)
            </p>
          </div>

          {/* Immediate Police Dial Link */}
          <div className="bg-slate-900 border border-red-500/30 rounded-xl p-3 flex justify-between items-center shrink-0">
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-bold text-red-400">🚨 India National Police Hub 112</h4>
              <p className="text-[9px] text-neutral-400">Direct voice helpline call channel</p>
            </div>
            <button 
              onClick={() => alert("Simulating phone telephone dialer: Calling 112!")}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" /> Call 112
            </button>
          </div>

          {/* AUDIO AND VIDEO EVIDENCE CONTROLS (Encrypted evidence mode!) */}
          <div className="bg-slate-900/60 border border-neutral-800 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Evidence Rec (Encrypted AES)
              </span>
              <div className="flex bg-slate-950 p-0.5 rounded border border-neutral-850">
                <button 
                  onClick={() => setEvidenceType('audio')}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all ${evidenceType === 'audio' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}
                >
                  Audio
                </button>
                <button 
                  onClick={() => setEvidenceType('video')}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all ${evidenceType === 'video' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}
                >
                  Video
                </button>
              </div>
            </div>

            {/* Dynamic content depending on evidence mode */}
            {evidenceType === 'audio' ? (
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded border border-neutral-850 text-xs text-red-400 font-mono">
                  <Volume2 className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
                  <span>🔴 Rec Mic Feed... Encryption active</span>
                </div>
                <p className="text-[9px] text-neutral-500 leading-snug">
                  Capturing ambient room audio. File is locally scrambled before periodic sync pulses.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between gap-1.5 bg-neutral-950 p-2 rounded border border-neutral-850 text-xs text-red-400 font-mono">
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
                    <span>🎥 Camera Active ({cameraChoice})</span>
                  </span>
                  
                  {/* Camera Toggle */}
                  <select
                    value={cameraChoice}
                    onChange={(e) => setCameraChoice(e.target.value as 'front' | 'rear')}
                    className="bg-neutral-900 border border-neutral-800 text-[9px] text-white rounded p-0.5 focus:outline-none"
                  >
                    <option value="front">Front (Default)</option>
                    <option value="rear">Rear</option>
                  </select>
                </div>
                <p className="text-[9px] text-neutral-500 leading-snug">
                  Encrypted stream recorded using front lens consent setting. Saved securely in local database container.
                </p>
              </div>
            )}

            {/* Storage Selection Config */}
            <div className="space-y-1.5 text-left pt-1">
              <label className="text-[9px] text-neutral-400 uppercase font-semibold">Evidence Storage Method:</label>
              <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono">
                <button 
                  onClick={() => setSharingMethod('local')}
                  className={`py-1 rounded border text-center font-bold ${sharingMethod === 'local' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-neutral-800 text-neutral-400'}`}
                >
                  Local Vault
                </button>
                <button 
                  onClick={() => setSharingMethod('cloud')}
                  className={`py-1 rounded border text-center font-bold ${sharingMethod === 'cloud' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-neutral-800 text-neutral-400'}`}
                >
                  Encrypted Cloud
                </button>
                <button 
                  onClick={() => setSharingMethod('broadcast')}
                  className={`py-1 rounded border text-center font-bold ${sharingMethod === 'broadcast' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-neutral-800 text-neutral-400'}`}
                >
                  Share Circle
                </button>
              </div>
            </div>
          </div>

          {/* DE-ACTIVATION SAFE ESCAPE CONTROL */}
          <div className="bg-slate-900 border border-neutral-800 rounded-xl p-3.5 space-y-2 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" /> Stop / Resolve SOS (Safety Code PIN)
            </h4>
            
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Enter PIN (Demo: 1234)"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-slate-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-center font-mono focus:outline-none focus:border-red-500 tracking-wider text-white"
              />
              <button
                onClick={handleResolveSOS}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 rounded-lg transition-all"
              >
                Safe
              </button>
            </div>

            {pinError && (
              <p className="text-[10px] text-red-500 font-semibold text-center mt-1 animate-pulse">
                ❌ Incorrect PIN. Please try again or check settings.
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
