import React, { useState } from 'react';
import { 
  ArrowLeft, Shield, Trash2, Download, ToggleLeft, ToggleRight, 
  Key, AlertCircle, Info, Lock, Eye, Check, FileText, Database, 
  Globe, ShieldAlert, Sparkles, Languages
} from 'lucide-react';
import { Language, UserSettings } from '../types';
import { translations } from '../data/translations';

interface PrivacyCenterViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClearAllData: () => void;
  onExportData: () => void;
  onClose: () => void;
  onAddLog: (message: string) => void;
  logs: string[];
}

export default function PrivacyCenterView({
  language,
  onLanguageChange,
  settings,
  onUpdateSettings,
  onClearAllData,
  onExportData,
  onClose,
  onAddLog,
  logs
}: PrivacyCenterViewProps) {
  const [pinInput, setPinInput] = useState(settings.pinCode);
  const [successMsg, setSuccessMsg] = useState('');
  
  const t = translations[language];

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || isNaN(Number(pinInput))) {
      alert("PIN must be exactly 4 digits.");
      return;
    }
    onUpdateSettings({ ...settings, pinCode: pinInput });
    onAddLog(`SECURITY SETTING CHANGED: Updated PIN security block.`);
    setSuccessMsg("PIN code updated successfully!");
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const togglePermission = (key: 'locationGranted' | 'microphoneGranted' | 'cameraGranted' | 'smsChannelEnabled') => {
    const updatedVal = !settings[key];
    onUpdateSettings({ ...settings, [key]: updatedVal });
    
    const permissionName = 
      key === 'locationGranted' ? 'GPS Location' :
      key === 'microphoneGranted' ? 'Microphone' :
      key === 'cameraGranted' ? 'Camera' : 'SMS Channel Fallback';

    onAddLog(`PRIVACY SWITCH TOGGLED: "${permissionName}" permission set to ${updatedVal ? 'GRANTED' : 'DENIED'}.`);
  };

  const togglePowerShake = (key: 'shakeDetection' | 'powerButtonTrigger') => {
    const updatedVal = !settings[key];
    onUpdateSettings({ ...settings, [key]: updatedVal });
    onAddLog(`HARDWARE TRIGGER TOGGLED: ${key === 'shakeDetection' ? 'Shake Detection' : 'Power Button SOS'} set to ${updatedVal ? 'ON' : 'OFF'}.`);
  };

  const toggleLowBatteryMode = () => {
    const updatedVal = !settings.lowBatterySOS;
    onUpdateSettings({ ...settings, lowBatterySOS: updatedVal });
    onAddLog(`LOW BATTERY PROFILE: SOS notification on battery exhaustion set to ${updatedVal ? 'ENABLED' : 'DISABLED'}.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.privacyCenter}</h1>
      </div>

      <p className="text-[11px] text-neutral-400 text-left">
        Manage system hardware triggers, setup your SOS Deactivation PIN, select app translation corridors, or clear all metadata records cleanly.
      </p>

      {/* LANGUAGE CORRIDORS SELECT */}
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
          <Languages className="w-4 h-4" /> Language Preferences
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिन्दी' },
            { id: 'hr', label: 'हरियाणवी' }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                onLanguageChange(lang.id as Language);
                onAddLog(`LANGUAGE CHANGED: Core app translation corridor updated to "${lang.label}".`);
              }}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                language === lang.id 
                  ? 'border-blue-500 bg-blue-500/5 text-blue-400' 
                  : 'border-neutral-800 hover:border-neutral-750 text-neutral-400'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* HARDWARE TRIGGERS CONFIGURATION */}
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" /> Hardware & Emergency Triggers
        </h2>

        <div className="space-y-3 divide-y divide-neutral-850">
          
          {/* Shake detection trigger */}
          <div className="flex justify-between items-center pt-1.5">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-200">Shake Detection SOS</span>
              <p className="text-[9px] text-neutral-400">Shake phone vigorously 5 times to trigger immediate emergency countdown</p>
            </div>
            <button onClick={() => togglePowerShake('shakeDetection')} className="text-neutral-400 hover:text-white transition-all">
              {settings.shakeDetection ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-neutral-500" />}
            </button>
          </div>

          {/* Power button trigger */}
          <div className="flex justify-between items-center pt-2">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-200">Power Button Quick Trigger</span>
              <p className="text-[9px] text-neutral-400">Click phone power button 3 times rapidly to launch emergency broadcast silently</p>
            </div>
            <button onClick={() => togglePowerShake('powerButtonTrigger')} className="text-neutral-400 hover:text-white transition-all">
              {settings.powerButtonTrigger ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-neutral-500" />}
            </button>
          </div>

          {/* Low Battery Alert */}
          <div className="flex justify-between items-center pt-2">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-neutral-200">Critical Battery SOS Profile</span>
              <p className="text-[9px] text-neutral-400">Automatically broadcast last known GPS to safety circle if battery falls below 10%</p>
            </div>
            <button onClick={toggleLowBatteryMode} className="text-neutral-400 hover:text-white transition-all">
              {settings.lowBatterySOS ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-neutral-500" />}
            </button>
          </div>

        </div>
      </div>

      {/* SYSTEM PERMISSIONS LOGS & SETTINGS */}
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-emerald-400" /> System Access & Consent
        </h2>

        <div className="space-y-2.5">
          {/* Permission Location */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300">GPS Location Coordinates Access</span>
            <button 
              onClick={() => togglePermission('locationGranted')}
              className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase border transition-all ${
                settings.locationGranted 
                  ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
                  : 'border-red-500/20 text-red-400 bg-red-500/5'
              }`}
            >
              {settings.locationGranted ? 'Granted' : 'Denied'}
            </button>
          </div>

          {/* Permission Mic */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300">Ambient Microphone Audio Buffer</span>
            <button 
              onClick={() => togglePermission('microphoneGranted')}
              className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase border transition-all ${
                settings.microphoneGranted 
                  ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
                  : 'border-red-500/20 text-red-400 bg-red-500/5'
              }`}
            >
              {settings.microphoneGranted ? 'Granted' : 'Denied'}
            </button>
          </div>

          {/* Permission Camera */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300">Front Camera Encrypted Record Consent</span>
            <button 
              onClick={() => togglePermission('cameraGranted')}
              className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase border transition-all ${
                settings.cameraGranted 
                  ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
                  : 'border-red-500/20 text-red-400 bg-red-500/5'
              }`}
            >
              {settings.cameraGranted ? 'Granted' : 'Denied'}
            </button>
          </div>

          {/* Permission SMS */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-300">SMS Channel Fallback (No-Internet Link)</span>
            <button 
              onClick={() => togglePermission('smsChannelEnabled')}
              className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase border transition-all ${
                settings.smsChannelEnabled 
                  ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
                  : 'border-red-500/20 text-red-400 bg-red-500/5'
              }`}
            >
              {settings.smsChannelEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* SOS DEACTIVATION PIN CODE */}
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
          <Key className="w-4 h-4" /> Safety Stop PIN
        </h2>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-[10px] text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePin} className="flex gap-2">
          <input
            type="password"
            placeholder="New 4-digit PIN"
            maxLength={4}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            className="flex-1 bg-slate-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-center font-mono focus:outline-none focus:border-red-500 tracking-wider"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 rounded-lg transition-all"
          >
            Update PIN
          </button>
        </form>
        <p className="text-[9px] text-neutral-500">
          This PIN is required to cancel active SOS sequences or access secure local evidence vaults. Default: <strong>1234</strong>
        </p>
      </div>

      {/* SYSTEM SECURITY LOGS CONTAINER */}
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-neutral-400" /> Recent Security Logs
        </h2>
        
        <div className="bg-slate-950 rounded-xl p-2.5 max-h-[140px] overflow-y-auto border border-neutral-850 space-y-1.5 font-mono text-[9px] text-neutral-400 hide-scrollbar">
          {logs.length === 0 ? (
            <div className="text-center italic text-neutral-600 py-4">No security events logged in this session yet.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex gap-2 items-start border-b border-neutral-900/50 pb-1 last:border-0">
                <span className="text-red-500 shrink-0">⏰</span>
                <span className="leading-relaxed text-neutral-300">{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CONFIDENTIAL DATA ACTIONS (Delete, Export) */}
      <div className="bg-slate-900/40 border border-red-950/40 rounded-2xl p-4 text-left space-y-3 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-red-500" /> Confidentially Wipe / Export
        </h2>
        <p className="text-[10px] text-neutral-400 leading-normal">
          We maintain a privacy-first strict architecture. No files or location metrics are permanently kept on unverified nodes. You can wipe all data instantly.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {/* Export Data */}
          <button
            onClick={() => {
              onExportData();
              onAddLog(`USER AUDIT: Exported cryptographic safety profile backup package.`);
            }}
            className="flex items-center justify-center gap-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 py-2 rounded-xl text-xs text-neutral-300 transition-all font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export backup</span>
          </button>

          {/* Wipe Data */}
          <button
            onClick={() => {
              onClearAllData();
              onAddLog(`SECURITY ACTION: Purged active credentials, contact structures and session indexes.`);
            }}
            className="flex items-center justify-center gap-1 bg-red-950/20 hover:bg-red-950/30 border border-red-900/30 py-2 rounded-xl text-xs text-red-400 transition-all font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Wipe all data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
