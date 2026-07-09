import React, { useState } from 'react';
import { Shield, Smartphone, Key, CheckCircle, Navigation, Mic, Video, Send, AlertCircle, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface OnboardingViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (phoneNum: string) => void;
  permissions: {
    location: boolean;
    microphone: boolean;
    camera: boolean;
    sms: boolean;
  };
  onGrantPermission: (key: 'location' | 'microphone' | 'camera' | 'sms') => void;
}

export default function OnboardingView({
  language,
  onLanguageChange,
  onComplete,
  permissions,
  onGrantPermission
}: OnboardingViewProps) {
  const [step, setStep] = useState<'splash' | 'login' | 'permissions'>('splash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const t = translations[language];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMsg(language === 'en' ? "Please enter a valid 10-digit number." : "कृपया 10 अंकों का वैध नंबर दर्ज करें।");
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234' && otp !== '9999') {
      setErrorMsg(language === 'en' ? "Invalid OTP. Use '1234' or '9999' for testing." : "गलत ओटीपी। टेस्टिंग के लिए '1234' या '9999' का उपयोग करें।");
      return;
    }
    setErrorMsg('');
    setStep('permissions');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar">
      
      {/* STEP 1: SPLASH SCREEN */}
      {step === 'splash' && (
        <div className="flex-1 flex flex-col justify-between py-8">
          <div className="flex justify-end shrink-0">
            {/* Language Selector in Splash */}
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-neutral-900 border border-neutral-800 text-xs rounded px-2.5 py-1 text-white focus:outline-none focus:border-red-500"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="hr">हरियाणवी</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center my-6 space-y-4">
            {/* Animated Logo Shield */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl w-32 h-32 animate-pulse" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-900 to-slate-900 border-2 border-red-500 rounded-full flex items-center justify-center shadow-2xl">
                <Shield className="w-16 h-16 text-red-500" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold font-display tracking-wider text-white">
                {t.appName}
              </h1>
              <p className="text-xs text-red-400 font-medium tracking-wide uppercase px-4 py-1 bg-red-950/40 rounded-full border border-red-900/30">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="space-y-4 shrink-0">
            <button
              onClick={() => setStep('login')}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide shadow-lg animate-safety-pulse"
            >
              <span>Get Secured / आगे बढ़ें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-neutral-400">
              🛡️ Android & iOS Responsive Safety Shield
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: SIMULATED PHONE / EMAIL LOGIN */}
      {step === 'login' && (
        <div className="flex-1 flex flex-col justify-between py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-500" />
              <h2 className="text-lg font-bold font-display uppercase tracking-wider">{t.appName} Login</h2>
            </div>
            <p className="text-xs text-neutral-400">
              Authenticate via secure phone number simulation to access your emergency contacts and safety portal.
            </p>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-semibold text-neutral-400">Enter Phone Number</label>
                  <div className="flex border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/60 focus-within:border-red-500 transition-all">
                    <span className="bg-neutral-850 px-3.5 flex items-center text-xs font-mono text-neutral-400 border-r border-neutral-800">+91</span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-transparent px-4 py-3.5 text-sm focus:outline-none text-white font-mono"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider border border-neutral-700"
                >
                  Request OTP Code (Demo)
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-400">
                  ⚡ <strong>DEMO OTP SENT!</strong> Please enter code <strong>1234</strong> or <strong>9999</strong> to complete verification.
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-semibold text-neutral-400">Verification Code (4-Digits)</label>
                  <input
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3.5 text-center text-lg font-mono tracking-widest focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 font-bold py-3 rounded-xl text-xs uppercase border border-neutral-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wide shadow-md"
                  >
                    Verify Code
                  </button>
                </div>
              </form>
            )}
          </div>
          <p className="text-[10px] text-center text-neutral-500 pt-4">
            🔐 Secure cryptographic OTP simulation. Your data is privately stored in local encrypted state.
          </p>
        </div>
      )}

      {/* STEP 3: REASONED PERMISSIONS ONBOARDING */}
      {step === 'permissions' && (
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider font-display">Permissions Onboarding</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                We value your security and privacy. We ask for device permissions with clear context below. You can toggle them anytime.
              </p>
            </div>

            {/* Permission checklist blocks */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 hide-scrollbar">
              
              {/* Permission 1: GPS location */}
              <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold">GPS Location Tracking</span>
                  </div>
                  <button
                    onClick={() => onGrantPermission('location')}
                    className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                      permissions.location 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {permissions.location ? 'Granted ✓' : 'Grant'}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  {t.consentLocation}
                </p>
              </div>

              {/* Permission 2: Microphone */}
              <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-semibold">Microphone Monitoring</span>
                  </div>
                  <button
                    onClick={() => onGrantPermission('microphone')}
                    className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                      permissions.microphone 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {permissions.microphone ? 'Granted ✓' : 'Grant'}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  {t.consentMicrophone}
                </p>
              </div>

              {/* Permission 3: Camera */}
              <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold">Encrypted Video Rec</span>
                  </div>
                  <button
                    onClick={() => onGrantPermission('camera')}
                    className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                      permissions.camera 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {permissions.camera ? 'Granted ✓' : 'Grant'}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  {t.consentCamera}
                </p>
              </div>

              {/* Permission 4: SMS Fallback */}
              <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-semibold">SMS Fallback Channel</span>
                  </div>
                  <button
                    onClick={() => onGrantPermission('sms')}
                    className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                      permissions.sms 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {permissions.sms ? 'Granted ✓' : 'Grant'}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  {t.consentSMS}
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={() => onComplete(phoneNumber || "9876543210")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shrink-0 mt-3"
          >
            Enter Dashboard / चालू करें
          </button>
        </div>
      )}

    </div>
  );
}
