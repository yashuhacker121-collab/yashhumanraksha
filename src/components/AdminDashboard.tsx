import React, { useState } from 'react';
import { 
  ShieldAlert, Radio, HelpCircle, FileText, Settings2, Trash2, 
  CheckCircle, Plus, Send, AlertTriangle, MapPin, Battery, Check,
  Clock, ShieldCheck, Database, RefreshCw
} from 'lucide-react';
import { HelpDirectoryItem, IncidentReport, SMSLog, HelpCategory } from '../types';

interface AdminDashboardProps {
  activeAlerts: any[];
  onResolveAlert: (id: string) => void;
  reports: IncidentReport[];
  smsLogs: SMSLog[];
  helpDirectory: HelpDirectoryItem[];
  onAddHelpItem: (item: Omit<HelpDirectoryItem, 'id'>) => void;
  onDeleteHelpItem: (id: string) => void;
  isOffline: boolean;
  onToggleNetwork: () => void;
  onSimulateShake: () => void;
  onSimulatePowerPress: () => void;
  onSimulateLowBattery: () => void;
  onClearSMSLogs: () => void;
}

export default function AdminDashboard({
  activeAlerts,
  onResolveAlert,
  reports,
  smsLogs,
  helpDirectory,
  onAddHelpItem,
  onDeleteHelpItem,
  isOffline,
  onToggleNetwork,
  onSimulateShake,
  onSimulatePowerPress,
  onSimulateLowBattery,
  onClearSMSLogs
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'directory' | 'reports' | 'sms'>('alerts');
  
  // State for adding a new helpline item
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<HelpCategory>('police');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newLat, setNewLat] = useState('28.6139');
  const [newLng, setNewLng] = useState('77.2090');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmitHelpItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    
    onAddHelpItem({
      name: newName,
      category: newCategory,
      phone: newPhone,
      address: newAddress || "Emergency Service",
      lat: Number(newLat) || 28.6139,
      lng: Number(newLng) || 77.2090,
      verified: true
    });

    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const activeEmergencies = activeAlerts.filter(a => a.status === 'active_emergency');
  const resolvedEmergencies = activeAlerts.filter(a => a.status === 'resolved');

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col h-[780px] w-full text-white overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <h1 className="text-xl font-bold font-display tracking-wide uppercase text-white flex items-center gap-2">
              YASH HUMAN RAKSHA <span className="text-red-500 text-xs px-2 py-0.5 bg-red-500/10 rounded-full border border-red-500/20">Control Room</span>
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Backend Operator Panel & Safety Intelligence Desk</p>
        </div>

        {/* Network State Toggles & Quick Event Simulators */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Internet State */}
          <button
            onClick={onToggleNetwork}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isOffline 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{isOffline ? 'Offline (Force SMS Fallback)' : 'Network Active (Online sync)'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Event Trigger Bar */}
      <div className="bg-neutral-950/60 rounded-xl p-3 mt-3 border border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <span className="text-xs font-mono font-medium text-neutral-400 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          TEST SIMULATORS (Click to test phone triggers):
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            onClick={onSimulatePowerPress}
            className="px-2.5 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded border border-neutral-700 font-medium transition-all text-neutral-200"
          >
            ⚡ Power Button Click 3x
          </button>
          <button 
            onClick={onSimulateShake}
            className="px-2.5 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded border border-neutral-700 font-medium transition-all text-neutral-200"
          >
            📳 Shake Device
          </button>
          <button 
            onClick={onSimulateLowBattery}
            className="px-2.5 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded border border-neutral-700 font-medium transition-all text-neutral-200"
          >
            🔋 Set Low Battery (12%)
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-neutral-800 mt-4 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'alerts' 
              ? 'border-red-500 text-red-400 bg-red-500/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Active Emergencies ({activeEmergencies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'directory' 
              ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Nearby Directory ({helpDirectory.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'reports' 
              ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Evidence & Logs ({reports.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'sms' 
              ? 'border-teal-500 text-teal-400 bg-teal-500/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Simulated SMS Logs ({smsLogs.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pt-4 pr-1 hide-scrollbar">
        
        {/* VIEW 1: ACTIVE EMERGENCY ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            
            {/* Critical Emergency Queue */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-red-500 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                Live Critical SOS Broadcasts ({activeEmergencies.length})
              </h2>
              {activeEmergencies.length === 0 ? (
                <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-8 text-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto opacity-70 mb-2" />
                  <p className="text-sm font-semibold text-neutral-200">No active emergency signals.</p>
                  <p className="text-xs text-neutral-500 mt-1">Yash Human Raksha security center is fully clear.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeEmergencies.map((alert) => (
                    <div 
                      key={alert.id} 
                      className="bg-red-500/5 border border-red-500/30 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse-slow"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-red-400">{alert.userName}</span>
                          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">
                            {alert.type}
                          </span>
                          <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-200 italic font-mono bg-neutral-950 p-2 rounded border border-neutral-800/80">
                          &ldquo;{alert.message}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap pt-1">
                          <span className="flex items-center gap-1 text-blue-400">
                            <MapPin className="w-3 h-3" />
                            Lat: {alert.lat.toFixed(4)}, Lng: {alert.lng.toFixed(4)}
                          </span>
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Battery className="w-3 h-3" />
                            Battery: {alert.battery}%
                          </span>
                          {alert.evidenceRecorded && (
                            <span className="text-emerald-400 font-semibold text-[10px] uppercase bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                              🟢 Encrypted {alert.evidenceType || 'audio'} active
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 w-full md:w-auto">
                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all"
                        >
                          <Check className="w-4 h-4" />
                          Resolve / Mark Safe
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resolved Alarms Log */}
            <div className="pt-4 border-t border-neutral-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Recently Resolved Alarms ({resolvedEmergencies.length})
              </h2>
              {resolvedEmergencies.length === 0 ? (
                <p className="text-xs text-neutral-500 italic">No historical alarms in this session.</p>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto hide-scrollbar">
                  {resolvedEmergencies.map((alert) => (
                    <div key={alert.id} className="bg-neutral-950/50 border border-neutral-850 rounded-lg p-3 flex justify-between items-center gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-300">{alert.userName}</span>
                          <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">{alert.type}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5 truncate max-w-[280px]">{alert.message}</p>
                      </div>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/10 shrink-0">
                        <CheckCircle className="w-3 h-3" /> Resolved
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: NEARBY DIRECTORY CONFIG */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            
            {/* Form to Add Helpline Hub */}
            <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add Verified Safety Hub (Publishes instantly to Mobile App!)
              </h2>
              <form onSubmit={handleSubmitHelpItem} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase font-semibold">Service Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rohini Sector-3 Police Chowki" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs focus:border-blue-500 focus:outline-none mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase font-semibold">Helpline Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +91 99999 88888" 
                    value={newPhone} 
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs focus:border-blue-500 focus:outline-none mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase font-semibold">Address Details</label>
                  <input 
                    type="text" 
                    placeholder="Sector-3, Outer Ring Road, Rohini" 
                    value={newAddress} 
                    onChange={e => setNewAddress(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs focus:border-blue-500 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase font-semibold">Directory Category</label>
                  <select 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value as HelpCategory)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs focus:border-blue-500 focus:outline-none mt-1 text-white"
                  >
                    <option value="police">👮 Police Station</option>
                    <option value="ambulance">🚑 Ambulance Service</option>
                    <option value="hospital">🏥 Hospital / Clinic</option>
                    <option value="fire">🚒 Fire Brigade</option>
                    <option value="women_support">👩 Women Support helpline</option>
                    <option value="shelter">🛖 Safe Shelter</option>
                    <option value="legal_aid">⚖️ Legal-Aid Office</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center justify-between pt-2 border-t border-neutral-800">
                  {formSuccess ? (
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Added successfully! Syncing live.
                    </span>
                  ) : <span className="text-[10px] text-neutral-500">Auto-injects location pins on mobile maps.</span>}
                  
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-1.5 rounded transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish Hub
                  </button>
                </div>
              </form>
            </div>

            {/* List of directory items */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Active Listings in Mobile App ({helpDirectory.length})
              </h2>
              <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/60 text-neutral-400 uppercase text-[9px] font-bold border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Category</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Helpline</th>
                      <th className="p-3">Address</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 font-mono">
                    {helpDirectory.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-900/40">
                        <td className="p-3 capitalize text-blue-400 font-semibold">{item.category.replace('_', ' ')}</td>
                        <td className="p-3 text-neutral-200 font-sans font-medium">{item.name}</td>
                        <td className="p-3 text-yellow-400 font-bold">{item.phone}</td>
                        <td className="p-3 text-neutral-400 max-w-[150px] truncate">{item.address}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteHelpItem(item.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-all"
                            title="Delete listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: INCIDENT REPORTS & EVIDENCE */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Active Security Evidence Recordings ({reports.length})
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Encrypted audio evidence transmitted securely to backup server vault upon SOS activation. Fully decryptable locally with user key code.
            </p>
            {reports.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No submitted reports or evidence logs available.</p>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-sm text-yellow-400">{rep.type}</span>
                      <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                        Vault ID: {rep.id}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans bg-neutral-900 p-2.5 rounded border border-neutral-850">
                      {rep.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 flex-wrap gap-2 font-mono pt-1">
                      <span className="text-blue-400">📍 Coords: {rep.lat.toFixed(4)}, {rep.lng.toFixed(4)}</span>
                      <span>🔋 Phone Battery: {rep.battery}%</span>
                      <span>🕒 Submitted: {new Date(rep.timestamp).toLocaleString()}</span>
                    </div>
                    
                    {rep.evidenceType && (
                      <div className="mt-2 pt-2 border-t border-neutral-850 flex items-center justify-between">
                        <span className="text-emerald-400 font-semibold text-[10px] uppercase flex items-center gap-1 font-mono">
                          🔐 SECURE EVIDENCE FILE RECEIVED ({rep.evidenceType.toUpperCase()})
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => alert("Decrypting secure package... Access granted under emergency operator credentials.")}
                            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-neutral-200 border border-neutral-750 transition-all"
                          >
                            Decrypt Recording
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: SIMULATED SMS LOGS */}
        {activeTab === 'sms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Simulated Carrier Outbox Logs ({smsLogs.length})
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Fallback cellular channel logging. Triggers when WiFi/Mobile Data is simulated as &ldquo;Offline&rdquo;.
                </p>
              </div>
              {smsLogs.length > 0 && (
                <button 
                  onClick={onClearSMSLogs}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Outbox
                </button>
              )}
            </div>

            {smsLogs.length === 0 ? (
              <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-8 text-center text-xs text-neutral-500 italic">
                Offline SMS outbox is empty. No backup alerts sent during this session.
              </div>
            ) : (
              <div className="space-y-2.5">
                {smsLogs.map((log) => (
                  <div key={log.id} className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3.5 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Recipient Phone: <strong className="text-teal-400">{log.recipient}</strong></span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${
                          log.status === 'sent' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                    <p className="bg-neutral-950 p-2.5 rounded text-neutral-300 border border-neutral-850/80 italic">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
