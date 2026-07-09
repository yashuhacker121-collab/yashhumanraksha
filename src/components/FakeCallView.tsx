import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Phone, PhoneOff, Clock, User, Bell, Volume2, ShieldAlert,
  Calculator, AlertTriangle, Eye, RefreshCw, Send, CheckCircle
} from 'lucide-react';
import { Language, UserSettings } from '../types';
import { translations } from '../data/translations';

interface FakeCallViewProps {
  language: Language;
  onClose: () => void;
  onAddLog: (message: string) => void;
  onSilentSOSTriggered: () => void;
  settings: UserSettings;
}

export default function FakeCallView({
  language,
  onClose,
  onAddLog,
  onSilentSOSTriggered,
  settings
}: FakeCallViewProps) {
  const [callerName, setCallerName] = useState('Mom / माँ');
  const [delaySecs, setDelaySecs] = useState<number>(5);
  const [ringtone, setRingtone] = useState('Classic Ring');
  
  // Call screens
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCallScreen, setShowCallScreen] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  
  // Calculator mode
  const [isCalculatorMode, setIsCalculatorMode] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcLog, setCalcLog] = useState('');

  const t = translations[language];

  // Timer effect for fake call schedule
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    
    const id = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timerActive, timeLeft]);

  // When timer hits 0, trigger full screen call overlay
  useEffect(() => {
    if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      setShowCallScreen(true);
      onAddLog(`FAKE CALL TRIGGERED: Simulated incoming call from "${callerName}" initiated.`);
    }
  }, [timerActive, timeLeft]);

  const handleScheduleCall = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeLeft(delaySecs);
    setTimerActive(true);
  };

  const handleAcceptCall = () => {
    setCallAccepted(true);
    onAddLog(`FAKE CALL CONNECTED: User accepted fake escape call to exit unverified situations.`);
  };

  const handleDeclineCall = () => {
    setShowCallScreen(false);
    setCallAccepted(false);
    onAddLog(`FAKE CALL ENDED: User terminated escape loop.`);
  };

  // Calculator button handler
  const handleCalcBtn = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      // Trigger silent SOS if the entered expression is the pin code!
      if (calcDisplay === settings.pinCode || calcDisplay === '9999' || calcDisplay === '1234') {
        onSilentSOSTriggered();
        onAddLog(`SILENT DISCREET SOS LAUNCHED: Activated via secret Calculator formula code: "${calcDisplay}".`);
        setCalcDisplay('SENT ✓');
        setTimeout(() => setCalcDisplay('0'), 3000);
      } else {
        try {
          // Simple safe evaluation
          const cleaned = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
          const res = Function(`"use strict"; return (${cleaned})`)();
          setCalcDisplay(String(res));
        } catch {
          setCalcDisplay('Error');
        }
      }
    } else {
      if (calcDisplay === '0' || calcDisplay === 'Error' || calcDisplay === 'SENT ✓') {
        setCalcDisplay(val);
      } else {
        setCalcDisplay(calcDisplay + val);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar">
      
      {/* FULL SCREEN FAKE CALL OVERLAY (Super realistic screen!) */}
      {showCallScreen && (
        <div className="absolute inset-0 bg-neutral-900 z-50 flex flex-col justify-between py-16 px-6 text-center select-none animate-fade-in font-sans">
          {!callAccepted ? (
            <>
              {/* Call incoming */}
              <div className="space-y-3 pt-8">
                <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto flex items-center justify-center border border-neutral-700 shadow-md">
                  <User className="w-12 h-12 text-neutral-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{callerName}</h2>
                  <p className="text-sm text-green-400 font-medium tracking-wide animate-pulse mt-1">Inbound Cellular Call...</p>
                </div>
              </div>

              {/* Accept/Decline Sliding Actions */}
              <div className="flex justify-around items-center px-4">
                <button
                  onClick={handleDeclineCall}
                  className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 shadow-lg active:scale-95 transition-all"
                  title="Decline Call"
                >
                  <PhoneOff className="w-7 h-7 text-white" />
                </button>

                <button
                  onClick={handleAcceptCall}
                  className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 shadow-lg animate-bounce active:scale-95 transition-all"
                  title="Accept Call"
                >
                  <Phone className="w-7 h-7 text-white" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Active Conversation state */}
              <div className="space-y-3 pt-8">
                <div className="w-20 h-20 bg-emerald-950/40 rounded-full mx-auto flex items-center justify-center border border-emerald-500/30">
                  <User className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{callerName}</h2>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>00:14 (Active Escape Tunnel)</span>
                  </div>
                </div>
              </div>

              {/* Animated audio speaker wave */}
              <div className="flex justify-center items-center gap-1 my-6 h-8">
                <div className="w-1 h-3 bg-red-500 animate-pulse" />
                <div className="w-1 h-6 bg-red-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-8 bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="w-1 h-4 bg-red-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
                <div className="w-1 h-2 bg-red-500 animate-pulse" style={{ animationDelay: '0.8s' }} />
              </div>

              {/* Decline Button */}
              <div className="flex justify-center pb-4">
                <button
                  onClick={handleDeclineCall}
                  className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 shadow-xl transition-all"
                  title="End Call"
                >
                  <PhoneOff className="w-7 h-7 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* DISCREET CALCULATOR PANEL */}
      {isCalculatorMode ? (
        <div className="flex-1 flex flex-col justify-between p-4">
          {/* Header */}
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <button 
              onClick={() => setIsCalculatorMode(false)}
              className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Discreet Core Cal</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-850 p-2.5 rounded-xl my-2 text-left space-y-1">
            <h3 className="text-[10px] font-bold text-red-400 flex items-center gap-1 uppercase">
              <AlertTriangle className="w-3.5 h-3.5" /> SECRET SOS MODE ENABLED
            </h3>
            <p className="text-[9px] text-neutral-400 leading-normal">
              Entering your PIN code (e.g., <strong>{settings.pinCode}</strong> or <strong>9999</strong>) followed by <strong>&ldquo;=&rdquo;</strong> sends a silent SOS in the background without modifying the calculator interface!
            </p>
          </div>

          {/* Calculator screen display */}
          <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 my-2 text-right">
            <div className="text-[10px] font-mono text-neutral-500 h-4">Formula mode: standard decimal</div>
            <div className="text-3xl font-mono font-bold text-white overflow-x-auto select-all pt-1 select-none whitespace-nowrap hide-scrollbar">{calcDisplay}</div>
          </div>

          {/* Calculator pad */}
          <div className="grid grid-cols-4 gap-2 py-2">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', 'C', '=', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcBtn(btn)}
                className={`h-12 rounded-xl text-sm font-bold font-mono transition-all active:scale-95 flex items-center justify-center ${
                  btn === '=' 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : btn === 'C' 
                      ? 'bg-neutral-800 hover:bg-neutral-750 text-red-400' 
                      : ['/', '*', '-', '+'].includes(btn) 
                        ? 'bg-neutral-800 hover:bg-neutral-750 text-blue-400'
                        : 'bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800/60'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCalculatorMode(false)}
            className="w-full py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-400 hover:text-neutral-200 mt-2 transition-all"
          >
            Exit Secret Calculator Interface
          </button>
        </div>
      ) : (
        /* STANDARD FAKE CALL CONFIGURATION PANEL */
        <div className="flex-1 flex flex-col justify-between p-4">
          
          <div className="space-y-4">
            {/* Top Back Action */}
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.fakeCallTitle}</h1>
            </div>

            <p className="text-xs text-neutral-400">
              {t.fakeCallSubtitle}
            </p>

            {/* Config Form container */}
            <form onSubmit={handleScheduleCall} className="bg-slate-900/80 border border-neutral-800 rounded-2xl p-4 space-y-4 text-left">
              
              {/* Delayed Schedule timer */}
              {timerActive && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center justify-between text-xs text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin-slow" />
                    Call scheduled in: <strong>{timeLeft} seconds</strong>
                  </span>
                  <button 
                    type="button"
                    onClick={() => setTimerActive(false)}
                    className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Caller field */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-neutral-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {t.fakeCallerName}
                </label>
                <input 
                  type="text" 
                  value={callerName} 
                  onChange={e => setCallerName(e.target.value)}
                  className="w-full bg-slate-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  required
                />
                
                {/* Quick Caller presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Mom / माँ', 'Papa / पापा', 'Boss / बॉस', 'Satish Bhai', 'Police / पुलिस'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCallerName(preset)}
                      className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-850 rounded text-[9px] text-neutral-300 border border-neutral-850"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delay Selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Delay Timer
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                  {[5, 10, 30, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDelaySecs(sec)}
                      className={`py-1.5 rounded border font-bold text-center transition-all ${
                        delaySecs === sec 
                          ? 'border-red-500 text-red-400 bg-red-500/5' 
                          : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {sec >= 60 ? `${sec/60}m` : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ringtone selection */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-neutral-400 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" /> Ringtone Preference
                </label>
                <select
                  value={ringtone}
                  onChange={e => setRingtone(e.target.value)}
                  className="w-full bg-slate-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none text-left"
                >
                  <option value="Classic Ring">Classic Telephone Ring (Default)</option>
                  <option value="Corporate Tune">Corporate Office Ringtone</option>
                  <option value="Vibrate Only">Silent Vibration Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                {t.fakeCallTrigger}
              </button>

            </form>

            {/* DISCREET CALCULATOR MODE LINK */}
            <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-4 text-left space-y-2.5">
              <h3 className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-400 animate-pulse" />
                Discreet Screen Mode
              </h3>
              <p className="text-[11px] text-neutral-400 leading-normal">
                Excuses you under a completely functional Calculator interface. Tap the secret formula code to silently trigger background SOS signals immediately.
              </p>
              
              <button
                onClick={() => setIsCalculatorMode(true)}
                className="w-full py-2 bg-slate-950 hover:bg-neutral-850 border border-neutral-800 text-blue-400 rounded-xl text-xs font-semibold tracking-wide transition-all"
              >
                {t.fakeCallDiscreet}
              </button>
            </div>

          </div>

          <p className="text-[9px] text-neutral-500 text-center leading-normal pt-4">
            🛡️ Escaping tense or awkward spots is highly recommended before they escalate to emergencies. Use Fake Call discreetly.
          </p>
        </div>
      )}

    </div>
  );
}
