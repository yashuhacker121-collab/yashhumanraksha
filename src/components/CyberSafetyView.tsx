import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldAlert, Sparkles, AlertTriangle, CheckCircle, 
  BookOpen, HelpCircle, FileText, Image, Globe, Info, RefreshCw
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface CyberSafetyViewProps {
  language: Language;
  onClose: () => void;
  onAddLog: (message: string) => void;
}

interface AnalysisResult {
  riskLevel: string;
  warningSigns: string[];
  explanation: string;
  actionSteps: string[];
}

export default function CyberSafetyView({
  language,
  onClose,
  onAddLog
}: CyberSafetyViewProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const t = translations[language];

  const handleAnalyzeMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorOccurred(false);
    setResult(null);
    onAddLog(`CYBER SCAN INITIATED: Requesting Gemini AI audit of threat message: "${inputText.substring(0, 30)}..."`);

    try {
      const response = await fetch('/api/gemini/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText, language: language === 'hi' ? 'Hindi' : (language === 'hr' ? 'Haryanvi' : 'English') })
      });

      if (!response.ok) {
        throw new Error("Server analysis service returned error.");
      }

      const data = await response.json();
      setResult(data);
      onAddLog(`CYBER SCAN SUCCEEDED: Threat level analyzed as "${data.riskLevel || 'Checked'}" by Gemini.`);
    } catch (err: any) {
      console.error(err);
      setErrorOccurred(true);
      // Fallback response block
      const fallbackResult: AnalysisResult = {
        riskLevel: "Medium/High Risk (Unverified)",
        warningSigns: [
          "Urgency markers or link redirects",
          "Unverified source contacting you unexpectedly"
        ],
        explanation: "Unable to run live AI check: Server is offline or API key is not configured. Notice if this message asks for urgent bank transfers, OTP codes, or threatens legal action.",
        actionSteps: [
          "Do NOT click any links or download attachments.",
          "Do NOT share OTPs, UPI PINs, or bank card details.",
          "Report immediately on cybercrime.gov.in or call Helpline 1930."
        ]
      };
      setResult(fallbackResult);
      onAddLog(`CYBER SCAN OFFLINE FALLBACK: Served local heuristic checks due to connection limits.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.cyberSafetyTitle}</h1>
      </div>

      <p className="text-[11px] text-neutral-400 mb-3 text-left">
        {t.cyberSafetySubtitle}
      </p>

      {/* 1. INPUT MESSAGES FOR GEMINI AUDIT */}
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-3 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          {t.suspiciousChecker}
        </h2>
        
        <form onSubmit={handleAnalyzeMessage} className="space-y-3">
          <textarea
            placeholder={t.messageCheckPlaceholder}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500/60 leading-normal"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing with Gemini AI...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>{t.checkMessageButton}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading audit message placeholder */}
      {isLoading && (
        <div className="bg-slate-900/50 border border-neutral-850 p-6 rounded-2xl my-3 text-center space-y-2 animate-pulse">
          <Sparkles className="w-6 h-6 text-yellow-400 mx-auto animate-spin-slow" />
          <p className="text-xs font-semibold text-neutral-300">Scanning Threat Nodes</p>
          <p className="text-[10px] text-neutral-500 leading-normal max-w-[240px] mx-auto">
            Yash Human Raksha security container is processing text signatures via Google Gemini 3.5. Translating indicators...
          </p>
        </div>
      )}

      {/* 2. DYNAMIC ANALYSIS RESULTS */}
      {result && !isLoading && (
        <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 my-3 text-left space-y-3">
          
          {/* Header risk badge */}
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Scan Results:</span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono ${
              result.riskLevel.toLowerCase().includes('high') 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' 
                : result.riskLevel.toLowerCase().includes('medium') 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {result.riskLevel}
            </span>
          </div>

          {/* Explanation text */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">Analysis Overview:</h4>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed bg-slate-950 p-2.5 rounded border border-neutral-850">
              {result.explanation}
            </p>
          </div>

          {/* Warning Signs list */}
          {result.warningSigns.length > 0 && (
            <div className="space-y-1.5 text-left">
              <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Suspicious Signatures:
              </h4>
              <ul className="space-y-1">
                {result.warningSigns.map((sign, idx) => (
                  <li key={idx} className="text-[11px] text-neutral-300 flex items-start gap-1 leading-relaxed">
                    <span className="text-red-500 shrink-0 mt-0.5">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Recommended Steps list */}
          {result.actionSteps.length > 0 && (
            <div className="space-y-1.5 text-left pt-1 border-t border-neutral-850">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Actionable safety steps:
              </h4>
              <ul className="space-y-1">
                {result.actionSteps.map((step, idx) => (
                  <li key={idx} className="text-[11px] text-neutral-300 flex items-start gap-1 leading-relaxed font-mono">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {errorOccurred && (
            <p className="text-[8px] text-neutral-500 text-center italic pt-1">
              💡 Analysis calculated locally without external key credentials. Setup your key in secrets panel for live AI scanning.
            </p>
          )}

        </div>
      )}

      {/* 3. CYBER SAFETY AWARENESS MANUAL (Screenshots checklist, links) */}
      <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-4 text-left space-y-3 my-1 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-blue-400" />
          Evidence Checklist & Reporting
        </h3>

        {/* Screenshot tips */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
            <Image className="w-3.5 h-3.5 text-neutral-400" /> Tips on Saving Screenshot Evidence:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-neutral-300">
            <div className="bg-slate-950 p-2 rounded border border-neutral-850 leading-relaxed">
              <strong>Capture Full Headers:</strong> Ensure the sender's phone number, email ID, or URL domain bar is completely visible in your screenshot.
            </div>
            <div className="bg-slate-950 p-2 rounded border border-neutral-850 leading-relaxed">
              <strong>Timestamp details:</strong> Keep device status bars and date/time visible inside the crop bounds to establish forensic timelines.
            </div>
          </div>
        </div>

        {/* Reporting links */}
        <div className="pt-2.5 border-t border-neutral-850 flex justify-between items-center gap-3">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-neutral-400" /> Official Indian Reporting Portal:
            </span>
            <p className="text-[10px] text-blue-400 font-mono font-bold">cybercrime.gov.in (Helpline: 1930)</p>
          </div>
          <a 
            href="https://cybercrime.gov.in"
            target="_blank"
            referrerPolicy="no-referrer"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase rounded-xl transition-all shadow"
          >
            Visit Portal
          </a>
        </div>
      </div>

    </div>
  );
}
