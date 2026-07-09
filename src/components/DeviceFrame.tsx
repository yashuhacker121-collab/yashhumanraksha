import React, { useState, useEffect } from 'react';
import { Battery, Wifi, ShieldAlert, Zap, Signal, Volume2, Mic, VolumeX, RefreshCw } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  batteryLevel: number;
  isOffline: boolean;
  onPowerClick: () => void;
  onShakeTrigger: () => void;
  voiceActive: boolean;
  onToggleVoice: () => void;
}

export default function DeviceFrame({
  children,
  batteryLevel,
  isOffline,
  onPowerClick,
  onShakeTrigger,
  voiceActive,
  onToggleVoice
}: DeviceFrameProps) {
  const [time, setTime] = useState('');
  const [powerPressCount, setPowerPressCount] = useState(0);
  const [lastPowerPressTime, setLastPowerPressTime] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePhysicalPowerPress = () => {
    const now = Date.now();
    onPowerClick(); // Feed up to parent log
    
    if (now - lastPowerPressTime < 1500) {
      const newCount = powerPressCount + 1;
      setPowerPressCount(newCount);
      if (newCount >= 3) {
        // SOS triggered via physical button!
        setPowerPressCount(0);
      }
    } else {
      setPowerPressCount(1);
    }
    setLastPowerPressTime(now);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phone Case outer container */}
      <div className="relative w-[380px] h-[780px] bg-neutral-900 rounded-[55px] p-[12px] shadow-2xl border-4 border-neutral-800 ring-12 ring-neutral-950/20 flex flex-col overflow-visible">
        
        {/* Physical Buttons Left - Volume Up, Down */}
        <div className="absolute left-[-6px] top-[140px] w-[6px] h-[50px] bg-neutral-800 rounded-l-md active:bg-neutral-700 cursor-pointer transition-all border-l border-neutral-700 z-0 shadow-lg" title="Volume Up" />
        <div className="absolute left-[-6px] top-[200px] w-[6px] h-[50px] bg-neutral-800 rounded-l-md active:bg-neutral-700 cursor-pointer transition-all border-l border-neutral-700 z-0 shadow-lg" title="Volume Down" />
        
        {/* Physical Button Right - Power Key */}
        <div 
          onClick={handlePhysicalPowerPress}
          className="absolute right-[-6px] top-[170px] w-[6px] h-[65px] bg-red-600 rounded-r-md active:bg-red-500 hover:right-[-4px] cursor-pointer transition-all border-r border-neutral-700 z-50 shadow-lg flex items-center justify-center text-[8px] font-bold text-white select-none"
          title="SOS Trigger: Click 3-5 Times rapidly!"
        >
          <span className="rotate-90 origin-center whitespace-nowrap tracking-widest scale-75 opacity-90">POWER</span>
        </div>

        {/* Screen Bezel & Container */}
        <div className="relative w-full h-full bg-black rounded-[45px] overflow-hidden border border-neutral-800 flex flex-col select-none">
          
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-b-[20px] z-50 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full border border-neutral-950" />
            <div className="w-[45px] h-1.5 bg-neutral-800 rounded-full" />
            <div className={`w-2 h-2 rounded-full border border-neutral-950 ${voiceActive ? 'bg-green-500 animate-pulse' : 'bg-neutral-800'}`} title={voiceActive ? "Microphone monitoring active" : "Microphone offline"} />
          </div>

          {/* Device Status Bar */}
          <div className="h-[44px] bg-neutral-950 px-6 pt-3 flex items-center justify-between text-xs text-white z-40 select-none shrink-0 font-sans font-medium">
            <span>{time}</span>
            
            {/* Status Icons Right */}
            <div className="flex items-center gap-1.5 text-white">
              {voiceActive && <Mic className="w-3.5 h-3.5 text-green-400 animate-pulse" />}
              <Signal className="w-3.5 h-3.5 text-neutral-300" />
              {isOffline ? (
                <div className="flex items-center text-red-500 text-[10px] gap-0.5 bg-red-500/10 px-1.5 rounded-full border border-red-500/20 py-px font-semibold animate-pulse">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  <span>SMS</span>
                </div>
              ) : (
                <Wifi className="w-3.5 h-3.5 text-blue-400" />
              )}
              
              <div className="flex items-center gap-0.5 font-mono">
                <span className="text-[10px]">{batteryLevel}%</span>
                <Battery className={`w-4 h-4 ${batteryLevel <= 20 ? 'text-red-500 animate-bounce' : 'text-neutral-300'}`} />
              </div>
            </div>
          </div>

          {/* Interactive Screen Children Viewport */}
          <div className="flex-1 overflow-hidden relative flex flex-col bg-neutral-950">
            {children}
          </div>

          {/* Phone Bottom Home Swipe Bar Indicator */}
          <div className="h-[18px] bg-neutral-950 flex items-center justify-center shrink-0 z-40 relative">
            <div className="w-32 h-1 bg-neutral-600 rounded-full" />
          </div>

        </div>
      </div>
      
      {/* Explanatory subtitle below frame */}
      <p className="text-[11px] text-neutral-400 mt-2 text-center max-w-[340px]">
        💡 Click the red <strong className="text-red-400">POWER</strong> button 3 times rapidly to test physical key-press silent SOS triggers, or shake using the simulation panel on the left.
      </p>
    </div>
  );
}
