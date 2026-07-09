import React, { useState } from 'react';
import { 
  ArrowLeft, Users, Plus, Trash2, Shield, MapPin, Clock, Phone, 
  UserPlus, AlertCircle, Save, Check
} from 'lucide-react';
import { Language, TrustedContact } from '../types';
import { translations } from '../data/translations';

interface SafetyCircleViewProps {
  language: Language;
  onClose: () => void;
  contacts: TrustedContact[];
  onAddContact: (contact: TrustedContact) => void;
  onRemoveContact: (id: string) => void;
  onTogglePermission: (id: string, permissionKey: 'sos' | 'trackLocation' | 'checkInAlerts' | 'callAccess') => void;
  onAddLog: (message: string) => void;
}

export default function SafetyCircleView({
  language,
  onClose,
  contacts,
  onAddContact,
  onRemoveContact,
  onTogglePermission,
  onAddLog
}: SafetyCircleViewProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const t = translations[language];

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !relationship.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    if (contacts.length >= 5) {
      setErrorMsg("Safety Circle limit reached (Maximum 5 contacts).");
      return;
    }
    setErrorMsg('');

    const newContact: TrustedContact = {
      id: "cont-" + Date.now(),
      name,
      phone,
      relationship,
      permissions: {
        sos: true,
        trackLocation: true,
        checkInAlerts: true,
        callAccess: false
      }
    };

    onAddContact(newContact);
    onAddLog(`CONTACT ADDED: "${name}" (${relationship}) placed in trusted Safety Circle.`);
    
    setName('');
    setPhone('');
    setRelationship('');
    setShowAddForm(false);
  };

  const handleRemove = (id: string, name: string) => {
    onRemoveContact(id);
    onAddLog(`CONTACT REMOVED: "${name}" removed from Safety Circle.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.safetyCircle}</h1>
      </div>

      <p className="text-[11px] text-neutral-400 mb-3 text-left">
        {t.safetyCircleTitle}
      </p>

      {/* 1. CONTACT CREATION FORM */}
      {showAddForm ? (
        <form onSubmit={handleCreateContact} className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 space-y-3 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
            <UserPlus className="w-4 h-4" /> Add Trusted Guardian
          </h2>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-[10px] text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 uppercase font-semibold">{t.contactName}</label>
            <input 
              type="text" 
              placeholder="e.g. Satish Bhai" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-neutral-850 rounded p-2 text-xs text-white focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 uppercase font-semibold">{t.contactPhone}</label>
            <input 
              type="tel" 
              placeholder="e.g. 9876543210" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-neutral-850 rounded p-2 text-xs text-white focus:outline-none font-mono"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 uppercase font-semibold">{t.contactRelation}</label>
            <input 
              type="text" 
              placeholder="e.g. Father, Elder Brother" 
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              className="w-full bg-slate-950 border border-neutral-850 rounded p-2 text-xs text-white focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-neutral-850">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 py-1.5 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save contact</span>
            </button>
          </div>
        </form>
      ) : (
        /* Call To Action button to toggle form */
        contacts.length < 5 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800/80 rounded-xl text-xs font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center justify-center gap-1.5 mb-3.5 shrink-0"
          >
            <Plus className="w-4 h-4 animate-pulse" />
            <span>{t.addContact}</span>
          </button>
        )
      )}

      {/* 2. TRUSTED GUARDIANS LIST WITH SEPARATE PERMISSION CONTROLS */}
      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[460px] pr-0.5 hide-scrollbar">
        {contacts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs italic">
            Your safety circle is empty. Add 3 to 5 trusted people immediately.
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-slate-900 border border-neutral-850 rounded-2xl p-4 space-y-3 text-left">
              
              {/* Header card info */}
              <div className="flex justify-between items-start gap-2 border-b border-neutral-850 pb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-200">{contact.name}</span>
                    <span className="text-[9px] bg-neutral-800 text-neutral-400 px-2 py-0.2 rounded-full uppercase">
                      {contact.relationship}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono">{contact.phone}</p>
                </div>
                
                <button
                  onClick={() => handleRemove(contact.id, contact.name)}
                  className="p-1 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all"
                  title="Remove contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Granular safety permission toggles separately for each contact */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
                  {t.permissionsLabel} {contact.name}:
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  
                  {/* SOS ALERT Toggle */}
                  <button
                    onClick={() => onTogglePermission(contact.id, 'sos')}
                    className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                      contact.permissions.sos 
                        ? 'bg-red-500/5 border-red-500/20 text-red-400 font-semibold' 
                        : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      <span>SOS Alerts</span>
                    </span>
                    <span className="text-[8px] uppercase">{contact.permissions.sos ? 'Yes' : 'No'}</span>
                  </button>

                  {/* LOCATION TRACKING Toggle */}
                  <button
                    onClick={() => onTogglePermission(contact.id, 'trackLocation')}
                    className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                      contact.permissions.trackLocation 
                        ? 'bg-blue-500/5 border-blue-500/20 text-blue-400 font-semibold' 
                        : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Track Location</span>
                    </span>
                    <span className="text-[8px] uppercase">{contact.permissions.trackLocation ? 'Yes' : 'No'}</span>
                  </button>

                  {/* MISSED CHECK-IN Toggle */}
                  <button
                    onClick={() => onTogglePermission(contact.id, 'checkInAlerts')}
                    className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                      contact.permissions.checkInAlerts 
                        ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 font-semibold' 
                        : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Check-In Alert</span>
                    </span>
                    <span className="text-[8px] uppercase">{contact.permissions.checkInAlerts ? 'Yes' : 'No'}</span>
                  </button>

                  {/* DIRECT DIAL Toggle */}
                  <button
                    onClick={() => onTogglePermission(contact.id, 'callAccess')}
                    className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                      contact.permissions.callAccess 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-semibold' 
                        : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Calling</span>
                    </span>
                    <span className="text-[8px] uppercase">{contact.permissions.callAccess ? 'Yes' : 'No'}</span>
                  </button>

                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
