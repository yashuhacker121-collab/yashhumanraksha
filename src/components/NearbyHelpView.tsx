import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Phone, Navigation, ShieldCheck, MapPin, 
  AlertTriangle, Check, Compass, Info, WifiOff
} from 'lucide-react';
import { Language, HelpDirectoryItem, HelpCategory } from '../types';
import { translations } from '../data/translations';

interface NearbyHelpViewProps {
  language: Language;
  onClose: () => void;
  directoryItems: HelpDirectoryItem[];
  locationPermission: boolean;
  onGrantLocation: () => void;
  onAddLog: (message: string) => void;
  isOffline: boolean;
}

export default function NearbyHelpView({
  language,
  onClose,
  directoryItems,
  locationPermission,
  onGrantLocation,
  onAddLog,
  isOffline
}: NearbyHelpViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | 'all'>('all');
  const t = translations[language];

  // Category filters mapping with icons
  const categoriesList: { id: HelpCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: language === 'en' ? 'All' : 'सभी', icon: '🌐' },
    { id: 'police', label: t.police, icon: '👮' },
    { id: 'emergency_112', label: '112 ERSS', icon: '📞' },
    { id: 'ambulance', label: t.ambulance, icon: '🚑' },
    { id: 'hospital', label: t.hospital, icon: '🏥' },
    { id: 'fire', label: t.fire, icon: '🚒' },
    { id: 'women_support', label: t.women_support, icon: '👩' },
    { id: 'shelter', label: t.shelter, icon: '🛖' },
    { id: 'legal_aid', label: t.legal_aid, icon: '⚖️' }
  ];

  // Filter listings
  const filteredItems = directoryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.phone.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleDialNumber = (name: string, phone: string) => {
    onAddLog(`DIAL TRIGGERED: Outbound call placed to verified directory item "${name}" at ${phone}.`);
    alert(language === 'en' ? `Dialing verified helpline: ${phone}\n(${name})` : `कॉल मिलाया जा रहा है: ${phone}\n(${name})`);
  };

  const handleNavigate = (name: string) => {
    onAddLog(`NAVIGATION LAUNCHED: Compass routing directions mapped to "${name}".`);
    alert(language === 'en' ? `Opening GPS directions and computing safe routes to ${name}...` : `${name} के लिए सुरक्षित मार्ग और जीपीएस दिशा-निर्देश खोले जा रहे हैं...`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.nearbyHelpTitle}</h1>
      </div>

      {/* 1. PERMISSION REQUIRED STATE */}
      {!locationPermission ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4 space-y-4">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200">GPS Location Required</h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-[280px]">
              {t.consentLocation}
            </p>
          </div>
          <button
            onClick={onGrantLocation}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all shadow"
          >
            Grant Location Permission
          </button>
        </div>
      ) : (
        /* 2. DIRECTORY VIEW WITH FULL LOCATION SYNC */
        <div className="space-y-3.5 flex-1 flex flex-col">
          <p className="text-[11px] text-neutral-400">
            {t.nearbyHelpSubtitle}
          </p>

          {/* Search Box */}
          <div className="flex bg-slate-900 border border-neutral-800 rounded-xl p-2.5 items-center gap-2 focus-within:border-blue-500/50 transition-all">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search police stations, hospitals..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent flex-1 focus:outline-none text-xs text-white"
            />
          </div>

          {/* Quick Filters Row */}
          <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-blue-600 border-blue-500 text-white shadow' 
                    : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Helpline directory lists */}
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[380px] pr-0.5 hide-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs italic">
                No matching verified safety resources found. Try another search or category.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="bg-slate-900/60 border border-neutral-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-all">
                  <div className="flex items-start justify-between gap-2 text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-neutral-200">{item.name}</span>
                        {item.verified && (
                          <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      
                      {/* Address */}
                      <p className="text-[10px] text-neutral-400 flex items-start gap-1 leading-normal">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                        <span>{item.address}</span>
                      </p>
                    </div>
                    
                    {/* Category icon */}
                    <span className="text-lg p-1 bg-slate-950 rounded-lg shrink-0 border border-neutral-850">
                      {item.category === 'police' && '👮'}
                      {item.category === 'emergency_112' && '📞'}
                      {item.category === 'ambulance' && '🚑'}
                      {item.category === 'hospital' && '🏥'}
                      {item.category === 'fire' && '🚒'}
                      {item.category === 'women_support' && '👩'}
                      {item.category === 'shelter' && '🛖'}
                      {item.category === 'legal_aid' && '⚖️'}
                    </span>
                  </div>

                  {/* Actions buttons row */}
                  <div className="flex gap-2 pt-1 border-t border-neutral-850/80">
                    <button
                      onClick={() => handleDialNumber(item.name, item.phone)}
                      className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{item.phone}</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigate(item.name)}
                      className="flex-1 bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border border-neutral-750 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      <span>Navigate</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Info text */}
          <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-850 text-left shrink-0">
            <p className="text-[9px] text-neutral-500 leading-relaxed flex items-start gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              This directory dynamically updates. Operator additions published in the admin room will show up here instantly. Dials route directly through device dialer buffers.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
