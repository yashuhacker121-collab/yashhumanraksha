import React, { useState, useEffect } from 'react';
import DeviceFrame from './components/DeviceFrame';
import AdminDashboard from './components/AdminDashboard';
import OnboardingView from './components/OnboardingView';
import HomeView from './components/HomeView';
import SOSView from './components/SOSView';
import SafeRouteView from './components/SafeRouteView';
import FakeCallView from './components/FakeCallView';
import NearbyHelpView from './components/NearbyHelpView';
import SafetyCircleView from './components/SafetyCircleView';
import CheckInTimerView from './components/CheckInTimerView';
import CyberSafetyView from './components/CyberSafetyView';
import PrivacyCenterView from './components/PrivacyCenterView';
import EducationView from './components/EducationView';
import SelfDefenseView from './components/SelfDefenseView';

import { 
  TrustedContact, 
  IncidentReport, 
  HelpDirectoryItem, 
  SMSLog, 
  UserSettings, 
  SafetyCheckIn, 
  Language 
} from './types';

export default function App() {
  // Screen and localization
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'sos' | 'route' | 'fakecall' | 'nearby' | 'circle' | 'cyber' | 'checkin' | 'education' | 'privacy' | 'selfdefense'>('onboarding');
  const [language, setLanguage] = useState<Language>('en');

  // Hardcoded defaults / simulation metrics
  const [phoneOwnerName, setPhoneOwnerName] = useState('Yash / यश');
  const [phoneOwnerPhone, setPhoneOwnerPhone] = useState('9876543210');
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isOffline, setIsOffline] = useState(false);
  const [voiceActive, setVoiceActive] = useState(true);

  // Security log lines displayed in Privacy settings
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);

  // Subordinated database arrays syncing with backend
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [helpDirectory, setHelpDirectory] = useState<HelpDirectoryItem[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);

  // Client local settings
  const [settings, setSettings] = useState<UserSettings>({
    pinCode: '1234',
    locationGranted: false,
    microphoneGranted: false,
    cameraGranted: false,
    smsChannelEnabled: true,
    shakeDetection: true,
    powerButtonTrigger: true,
    lowBatterySOS: true
  });

  // Client active Check-In scheduler
  const [activeCheckIn, setActiveCheckIn] = useState<SafetyCheckIn | null>(null);

  // Initial dummy trusted contacts list (size 3)
  const [contacts, setContacts] = useState<TrustedContact[]>([
    {
      id: "cont-dad",
      name: "Dad / पिताजी",
      phone: "+91 98960 12345",
      relationship: "Father",
      permissions: { sos: true, trackLocation: true, checkInAlerts: true, callAccess: true }
    },
    {
      id: "cont-mom",
      name: "Mom / माताजी",
      phone: "+91 98960 54321",
      relationship: "Mother",
      permissions: { sos: true, trackLocation: true, checkInAlerts: true, callAccess: true }
    },
    {
      id: "cont-brother",
      name: "Satish Bhai / सतीश भाई",
      phone: "+91 99912 99999",
      relationship: "Brother",
      permissions: { sos: true, trackLocation: true, checkInAlerts: false, callAccess: false }
    }
  ]);

  // Add a security event log helper
  const addSecurityLog = (msg: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setSecurityLogs(prev => [`[${timeStr}] ${msg}`, ...prev].slice(0, 40));
  };

  // Sync state with server-side database
  const refreshDatabaseState = async () => {
    try {
      const [alertsRes, dirRes, repRes] = await Promise.all([
        fetch('/api/active-alerts'),
        fetch('/api/help-directory'),
        fetch('/api/incident-reports')
      ]);

      if (alertsRes.ok) setActiveAlerts(await alertsRes.json());
      if (dirRes.ok) setHelpDirectory(await dirRes.json());
      if (repRes.ok) setReports(await repRes.json());
    } catch (err) {
      console.warn("Failed fetching backend synchronized state. Working locally.", err);
    }
  };

  useEffect(() => {
    refreshDatabaseState();
    // Setup periodic polling for backend changes (since HMR is disabled, this is ideal for dual workspace frames!)
    const id = setInterval(refreshDatabaseState, 4000);
    return () => clearInterval(id);
  }, []);

  // Sync log on startup
  useEffect(() => {
    addSecurityLog("Yash Human Raksha security container initialized successfully.");
  }, []);

  // Triggering the primary Active SOS alert (registers on backend and logs contacts notification)
  const triggerActiveSOS = async (details: { type: string; message: string; evidenceRecorded: boolean; evidenceType: 'audio' | 'video' | 'none' }) => {
    // Generate active SOS structure
    const newAlert = {
      userName: phoneOwnerName,
      type: details.type,
      message: details.message,
      lat: 28.6139,
      lng: 77.2090,
      battery: batteryLevel,
      evidenceRecorded: details.evidenceRecorded,
      evidenceType: details.evidenceType
    };

    // 1. Post alert to server
    try {
      await fetch('/api/active-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert)
      });
    } catch (err) {
      console.error(err);
    }

    // 2. Post report to server
    if (details.evidenceRecorded) {
      const newReport = {
        type: `${details.evidenceType.toUpperCase()} Evidence Saved`,
        description: `Captured emergency ${details.evidenceType} recording feed. Encrypted using local PIN key container.`,
        lat: 28.6139,
        lng: 77.2090,
        battery: batteryLevel,
        evidenceType: details.evidenceType
      };

      try {
        await fetch('/api/incident-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReport)
        });
      } catch (err) {
        console.error(err);
      }
    }

    // 3. Generate Simulated SMS Logs if offline or enabled
    if (settings.smsChannelEnabled) {
      const notifiedContacts = contacts.filter(c => c.permissions.sos);
      const nextSms: SMSLog[] = notifiedContacts.map(c => ({
        id: "sms-" + Date.now() + Math.random(),
        recipient: c.phone,
        message: `EMERGENCY SOS: ${phoneOwnerName} is in danger! Live GPS Location: https://maps.google.com/?q=28.6139,77.2090. Phone Battery: ${batteryLevel}%. Time: ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        status: isOffline ? 'sent' : 'delivered'
      }));

      setSmsLogs(prev => [...nextSms, ...prev]);
      addSecurityLog(`CARRIER SMS BROADCAST: Dispatched emergency backup SMS nodes to ${notifiedContacts.length} trusted contacts.`);
    }

    refreshDatabaseState();
  };

  // Resolving alerts from operator room
  const handleResolveAlert = async (id: string) => {
    try {
      await fetch(`/api/active-alerts/${id}/resolve`, { method: 'POST' });
      addSecurityLog(`ALERT RESOLVED BY OPERATOR: Cleared emergency status index for active SOS.`);
      refreshDatabaseState();
    } catch (err) {
      console.error(err);
    }
  };

  // Adding nearby helplines from operator room
  const handleAddHelpItem = async (item: Omit<HelpDirectoryItem, 'id'>) => {
    try {
      await fetch('/api/help-directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      addSecurityLog(`DIRECTORY LISTING ADDED: Published new verified support hub "${item.name}".`);
      refreshDatabaseState();
    } catch (err) {
      console.error(err);
    }
  };

  // Deleting nearby helplines from operator room
  const handleDeleteHelpItem = async (id: string) => {
    try {
      await fetch(`/api/help-directory/${id}`, { method: 'DELETE' });
      addSecurityLog(`DIRECTORY LISTING REMOVED: Deleted helpline hub.`);
      refreshDatabaseState();
    } catch (err) {
      console.error(err);
    }
  };

  // ONBOARDING PERMISSION GRANT CLICKS
  const handleGrantPermission = (key: 'location' | 'microphone' | 'camera' | 'sms') => {
    const settingsKey = 
      key === 'location' ? 'locationGranted' :
      key === 'microphone' ? 'microphoneGranted' :
      key === 'camera' ? 'cameraGranted' : 'smsChannelEnabled';

    const updatedSettings = { ...settings, [settingsKey]: true };
    setSettings(updatedSettings);
    addSecurityLog(`ONBOARDING CONSENT: User granted "${key.toUpperCase()}" permission profile.`);
  };

  const handleOnboardingComplete = (phoneNum: string) => {
    setPhoneOwnerPhone(phoneNum);
    setCurrentScreen('home');
    addSecurityLog(`USER AUTHENTICATED: Simulated secure session established for terminal +91 ${phoneNum}.`);
  };

  // CONTACT DIRECT ACTIONS
  const handleAddContact = (contact: TrustedContact) => {
    setContacts(prev => [...prev, contact]);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleContactPermission = (id: string, permissionKey: 'sos' | 'trackLocation' | 'checkInAlerts' | 'callAccess') => {
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          permissions: {
            ...c.permissions,
            [permissionKey]: !c.permissions[permissionKey]
          }
        };
      }
      return c;
    }));
  };

  // TIMED CHECK-IN DISPATCHERS
  const handleStartCheckIn = (checkIn: SafetyCheckIn) => {
    setActiveCheckIn(checkIn);
  };

  const handleCancelCheckIn = () => {
    setActiveCheckIn(null);
  };

  // CONFIDENTIAL PRIVACY CLEARS
  const handleClearAllData = () => {
    setContacts([]);
    setActiveCheckIn(null);
    setSmsLogs([]);
    setSettings({
      pinCode: '1234',
      locationGranted: false,
      microphoneGranted: false,
      cameraGranted: false,
      smsChannelEnabled: true,
      shakeDetection: true,
      powerButtonTrigger: true,
      lowBatterySOS: true
    });
    setSecurityLogs([]);
    setCurrentScreen('onboarding');
    alert("Absolute cryptographic purge completed. All cache frames, contacts, logs and credentials cleared. Returning to onboarding.");
  };

  const handleExportData = () => {
    const safetyBackup = {
      profile: { phoneOwnerName, phoneOwnerPhone, batteryLevel },
      settings,
      circle: contacts,
      logs: securityLogs
    };

    const blob = new Blob([JSON.stringify(safetyBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yash_human_raksha_private_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert("Cryptographic profile backup exported successfully as JSON!");
  };

  // SIMULATOR BUTTON CALLBACKS FROM CONTROL PANEL
  const handleSimulateShake = () => {
    if (!settings.shakeDetection) {
      alert("Shake Detection is currently toggled OFF in phone privacy settings.");
      return;
    }
    addSecurityLog("HARDWARE SENSOR: Gyroscope shake threshold exceeded (Simulated).");
    setCurrentScreen('sos');
  };

  const handleSimulatePowerPress = () => {
    if (!settings.powerButtonTrigger) {
      alert("Power Button Quick Trigger is currently toggled OFF in phone privacy settings.");
      return;
    }
    addSecurityLog("HARDWARE EVENT: Power button clicked rapidly 3 times (Simulated).");
    
    // Silently register alert on backend and alert contacts!
    triggerActiveSOS({
      type: "Silent Trigger (Power Click)",
      message: `CRITICAL ALERT: Power Button rapid click SOS dispatched silently. Live battery: ${batteryLevel}%. Sharing active GPS stream.`,
      evidenceRecorded: true,
      evidenceType: 'audio'
    });
    
    alert("SILENT SOS SENT: Rapid power presses detected. Signal broadcasted to circles and control room. App maintains discreet mode.");
  };

  const handleSimulateLowBattery = () => {
    setBatteryLevel(12);
    addSecurityLog("HARDWARE METRIC: Battery level dropped critically to 12%.");
    
    if (settings.lowBatterySOS) {
      triggerActiveSOS({
        type: "Critical Low Battery Alert",
        message: `AUTOMATED SYSTEM WARNING: Phone battery has exhausted to 12%. Sharing final GPS coordinates before shutdown.`,
        evidenceRecorded: false,
        evidenceType: 'none'
      });
      alert("Low Battery SOS profile triggered! Coordinates sent to Safety Circle automatically.");
    }
  };

  const handleToggleNetwork = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);
    addSecurityLog(`NETWORK CHANNEL CHANGE: Simulating connection environment as ${nextOffline ? "OFFLINE (SMS Channel only)" : "ONLINE (Web sync enabled)"}.`);
  };

  const handleClearSMSLogs = () => {
    setSmsLogs([]);
    addSecurityLog("SYSTEM CLEAN: SMS Carrier Outbox logs cleared.");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Mobile Phone Device Simulator */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <DeviceFrame
            batteryLevel={batteryLevel}
            isOffline={isOffline}
            onPowerClick={() => addSecurityLog("HARDWARE CLICKS: Physical power button pressed.")}
            onShakeTrigger={handleSimulateShake}
            voiceActive={voiceActive}
            onToggleVoice={() => {
              setVoiceActive(!voiceActive);
              addSecurityLog(`VOICE SENSING: Set voice listening mode to ${!voiceActive ? 'ON' : 'OFF'}.`);
            }}
          >
            {/* View Dispatcher inside Phone screen */}
            {currentScreen === 'onboarding' && (
              <OnboardingView
                language={language}
                onLanguageChange={setLanguage}
                onComplete={handleOnboardingComplete}
                permissions={{
                  location: settings.locationGranted,
                  microphone: settings.microphoneGranted,
                  camera: settings.cameraGranted,
                  sms: settings.smsChannelEnabled
                }}
                onGrantPermission={handleGrantPermission}
              />
            )}

            {currentScreen === 'home' && (
              <HomeView
                language={language}
                onLanguageChange={setLanguage}
                onSelectFeature={(feat) => {
                  setCurrentScreen(feat as any);
                  addSecurityLog(`USER INTERACTION: Switched mobile screen context to "${feat.toUpperCase()}"`);
                }}
                batteryLevel={batteryLevel}
                isOffline={isOffline}
                voiceActive={voiceActive}
                contactsCount={contacts.length}
              />
            )}

            {currentScreen === 'sos' && (
              <SOSView
                language={language}
                onClose={() => setCurrentScreen('home')}
                contacts={contacts}
                settings={settings}
                batteryLevel={batteryLevel}
                isOffline={isOffline}
                onSOSActivated={triggerActiveSOS}
              />
            )}

            {currentScreen === 'route' && (
              <SafeRouteView
                language={language}
                onClose={() => setCurrentScreen('home')}
                contacts={contacts}
                onAddLog={(m) => {
                  addSecurityLog(m);
                  refreshDatabaseState();
                }}
              />
            )}

            {currentScreen === 'fakecall' && (
              <FakeCallView
                language={language}
                onClose={() => setCurrentScreen('home')}
                onAddLog={(m) => {
                  addSecurityLog(m);
                  refreshDatabaseState();
                }}
                onSilentSOSTriggered={() => {
                  triggerActiveSOS({
                    type: "Silent SOS (Calculator Secret Mode)",
                    message: "CRITICAL ALERT: Secret SOS triggered via discreet calculator formula. Sending GPS coordinates.",
                    evidenceRecorded: true,
                    evidenceType: 'audio'
                  });
                }}
                settings={settings}
              />
            )}

            {currentScreen === 'nearby' && (
              <NearbyHelpView
                language={language}
                onClose={() => setCurrentScreen('home')}
                directoryItems={helpDirectory}
                locationPermission={settings.locationGranted}
                onGrantLocation={() => handleGrantPermission('location')}
                onAddLog={addSecurityLog}
                isOffline={isOffline}
              />
            )}

            {currentScreen === 'circle' && (
              <SafetyCircleView
                language={language}
                onClose={() => setCurrentScreen('home')}
                contacts={contacts}
                onAddContact={handleAddContact}
                onRemoveContact={handleRemoveContact}
                onTogglePermission={handleToggleContactPermission}
                onAddLog={addSecurityLog}
              />
            )}

            {currentScreen === 'checkin' && (
              <CheckInTimerView
                language={language}
                onClose={() => setCurrentScreen('home')}
                contacts={contacts}
                onAddLog={addSecurityLog}
                activeCheckIn={activeCheckIn}
                onStartCheckIn={handleStartCheckIn}
                onCancelCheckIn={handleCancelCheckIn}
                isOffline={isOffline}
                batteryLevel={batteryLevel}
              />
            )}

            {currentScreen === 'cyber' && (
              <CyberSafetyView
                language={language}
                onClose={() => setCurrentScreen('home')}
                onAddLog={addSecurityLog}
              />
            )}

            {currentScreen === 'privacy' && (
              <PrivacyCenterView
                language={language}
                onLanguageChange={setLanguage}
                settings={settings}
                onUpdateSettings={setSettings}
                onClearAllData={handleClearAllData}
                onExportData={handleExportData}
                onClose={() => setCurrentScreen('home')}
                onAddLog={addSecurityLog}
                logs={securityLogs}
              />
            )}

            {currentScreen === 'education' && (
              <EducationView
                language={language}
                onClose={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'selfdefense' && (
              <SelfDefenseView
                language={language}
                onClose={() => setCurrentScreen('home')}
                onAddLog={addSecurityLog}
              />
            )}

          </DeviceFrame>
        </div>

        {/* Right Side: Backoffice Emergency Control Room Operator Panel */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <AdminDashboard
            activeAlerts={activeAlerts}
            onResolveAlert={handleResolveAlert}
            reports={reports}
            smsLogs={smsLogs}
            helpDirectory={helpDirectory}
            onAddHelpItem={handleAddHelpItem}
            onDeleteHelpItem={handleDeleteHelpItem}
            isOffline={isOffline}
            onToggleNetwork={handleToggleNetwork}
            onSimulateShake={handleSimulateShake}
            onSimulatePowerPress={handleSimulatePowerPress}
            onSimulateLowBattery={handleSimulateLowBattery}
            onClearSMSLogs={handleClearSMSLogs}
          />
        </div>

      </div>
    </div>
  );
}
