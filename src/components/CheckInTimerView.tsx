import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Clock, ShieldCheck, AlertCircle, Play, XCircle, 
  Battery, MapPin, Send, Bell, Database, Check
} from 'lucide-react';
import { Language, SafetyCheckIn, TrustedContact } from '../types';
import { translations } from '../data/translations';

interface CheckInTimerViewProps {
  language: Language;
  onClose: () => void;
  contacts: TrustedContact[];
  onAddLog: (message: string) => void;
  activeCheckIn: SafetyCheckIn | null;
  onStartCheckIn: (checkIn: SafetyCheckIn) => void;
  onCancelCheckIn: () => void;
  isOffline: boolean;
  batteryLevel: number;
}

export default function CheckInTimerView({
  language,
  onClose,
  contacts,
  onAddLog,
  activeCheckIn,
  onStartCheckIn,
  onCancelCheckIn,
  isOffline,
  batteryLevel
}: CheckInTimerViewProps) {
  const [label, setLabel] = useState('Commute Home / घर वापसी');
  const [durationMins, setDurationMins] = useState<number>(30);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  // Timer States
  const [timerAlertPhase, setTimerAlertPhase] = useState<'none' | 'private_warning' | 'sos_sent'>('none');
  const t = translations[language];

  // Sync remaining seconds if check-in is active
  useEffect(() => {
    if (!activeCheckIn || !activeCheckIn.isActive) {
      setTimerAlertPhase('none');
      return;
    }

    // Set initial remaining seconds
    const parsedMins = durationMins;
    setTimeRemaining(parsedMins * 60);
  }, [activeCheckIn]);

  // Live countdown ticker effect
  useEffect(() => {
    if (!activeCheckIn || !activeCheckIn.isActive || timeRemaining <= 0) return;

    const intervalId = setInterval(() => {
      const nextTime = timeRemaining - 1;
      setTimeRemaining(nextTime);

      // Warning thresholds
      if (nextTime === 10) {
        setTimerAlertPhase('private_warning');
        onAddLog("CHECK-IN TIMEOUT APPROACHING: Private reminder alert sent to device screen.");
      }
      
      if (nextTime === 0) {
        clearInterval(intervalId);
        triggerCheckInSOS();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeCheckIn, timeRemaining]);

  const triggerCheckInSOS = () => {
    setTimerAlertPhase('sos_sent');
    const notifiedContacts = contacts.filter(c => c.permissions.checkInAlerts).map(c => c.name).join(', ') || "Your Guardians";
    const logMsg = `MISSING CHECK-IN WARNING DETECTED: No safety confirmation for "${label}". Broadcasted alert message with last coordinates (Delhi Metro) and phone battery (${batteryLevel}%) to circles: ${notifiedContacts}.`;
    onAddLog(logMsg);
    alert(language === 'en' ? "Check-In SOS Triggered! Your Safety Circle was alerted because you did not confirm arrival." : "आगमन पुष्टि न होने पर सुरक्षा चक्र सक्रिय! आपकी लाइव लोकेशन और लापता सन्देश संपर्कों को भेज दिया गया है।");
  };

  const handleStartTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheckIn: SafetyCheckIn = {
      id: "check-" + Date.now(),
      targetTime: new Date(Date.now() + durationMins * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: label || "Commute Corridor",
      isActive: true,
      reminderSent: false,
      sosTriggered: false
    };

    onStartCheckIn(newCheckIn);
    onAddLog(`CHECK-IN TIMED INITIATED: Scheduled to confirm safety for "${label}" in ${durationMins} minutes.`);
  };

  const handleConfirmSafety = () => {
    onCancelCheckIn();
    onAddLog(`CHECK-IN VERIFIED SAFE: User arrived safely at "${label}". Terminated alert countdowns.`);
    alert(language === 'en' ? "Arrived Safe! Check-in timer successfully canceled." : "सुरक्षित आगमन दर्ज किया गया! आगमन टाइमर सफलतापूर्वक बंद कर दिया गया है।");
    onClose();
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4 justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.checkInTimerTitle}</h1>
        </div>

        <p className="text-[11px] text-neutral-400 mb-3 text-left">
          {t.checkInSubtitle}
        </p>

        {/* 1. SETUP FORM STATE (Inactive check-in) */}
        {!activeCheckIn?.isActive ? (
          <form onSubmit={handleStartTimer} className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 space-y-4 text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <Clock className="w-4 h-4" /> Schedule Safety Check-In
            </h2>

            <div className="space-y-1">
              <label className="text-[9px] text-neutral-400 uppercase font-semibold">Purpose / Destination</label>
              <input 
                type="text" 
                placeholder="e.g., Heading Home from Office" 
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="w-full bg-slate-950 border border-neutral-850 rounded p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            {/* Time Presets */}
            <div className="space-y-1.5">
              <label className="text-[9px] text-neutral-400 uppercase font-semibold">Expect Commute Duration:</label>
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                {/* 1 min for quick testing, other realistic presets */}
                {[1, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMins(mins)}
                    className={`py-1.5 rounded border font-bold text-center transition-all ${
                      durationMins === mins 
                        ? 'border-teal-500 text-teal-400 bg-teal-500/5' 
                        : 'border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {mins === 1 ? '1m (Test)' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t.checkInButton}</span>
            </button>
          </form>
        ) : (
          /* 2. RUNNING TIMED CHECK-IN SCREEN */
          <div className="space-y-4">
            
            {/* Countdown Container card */}
            <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-center space-y-4">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-ping" />
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest">{t.checkInActive}</h3>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-200">{label}</p>
                <p className="text-[10px] text-neutral-400">Expected Arrival Target: {activeCheckIn.targetTime}</p>
              </div>

              {/* Huge Countdown Display */}
              <div className="py-2.5">
                <span className={`text-4xl font-extrabold font-mono tracking-wider ${timeRemaining <= 20 ? 'text-red-500 animate-pulse' : 'text-teal-400'}`}>
                  {formatTime(timeRemaining)}
                </span>
                <p className="text-[9px] text-neutral-500 uppercase tracking-wide mt-1">{t.checkInRemaining}</p>
              </div>

              {/* Action buttons */}
              <button
                onClick={handleConfirmSafety}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-1 animate-safety-pulse shadow-md"
              >
                <ShieldCheck className="w-4 h-4 animate-bounce" />
                <span>{t.confirmSafety}</span>
              </button>
            </div>

            {/* DYNAMIC ALERT PHASES DEPENDING ON TIMERS */}
            {timerAlertPhase === 'private_warning' && (
              <div className="bg-amber-600 border border-amber-500 rounded-xl p-3 text-left space-y-2 animate-bounce">
                <div className="flex items-start gap-2 text-white">
                  <Bell className="w-4 h-4 shrink-0 animate-swing" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase">⚠️ Private Alert Warning</p>
                    <p className="text-[10px] text-amber-100">Are you safe? Confirm safety above within 10 seconds, or your Circle will be alerted immediately!</p>
                  </div>
                </div>
              </div>
            )}

            {timerAlertPhase === 'sos_sent' && (
              <div className="bg-red-600 border border-red-500 rounded-xl p-3 text-left space-y-1 animate-pulse">
                <div className="flex items-start gap-2 text-white">
                  <AlertCircle className="w-4 h-4 shrink-0 animate-spin" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase">🚨 MISSING CHECK-IN BROADCASTED</p>
                    <p className="text-[10px] text-red-100">Safety Circle has been sent your emergency SMS location because you missed your target commute window.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Fast Forward test tools */}
            <div className="bg-neutral-950/60 border border-neutral-850 rounded-2xl p-3 text-left space-y-2">
              <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                Timeout Simulator Config:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRemaining(12)}
                  className="flex-1 py-1 bg-neutral-900 border border-neutral-800 text-[10px] hover:bg-neutral-850 rounded font-mono text-neutral-300"
                >
                  ⏱️ Jump to 12s
                </button>
                <button
                  onClick={onCancelCheckIn}
                  className="flex-1 py-1 bg-neutral-900 border border-neutral-800 text-[10px] hover:bg-neutral-850 rounded font-mono text-neutral-300 text-red-400"
                >
                  🛑 Hard Reset
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      <p className="text-[9px] text-neutral-500 text-center leading-normal pt-4">
        🛡️ If you are travelling alone or taking late night transit, setting up Check-In timers provides high level automated guardrails.
      </p>

    </div>
  );
}
