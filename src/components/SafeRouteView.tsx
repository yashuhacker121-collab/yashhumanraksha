import React, { useState } from 'react';
import { 
  ArrowLeft, Navigation, Shield, Compass, MapPin, Share2, AlertTriangle, 
  Clock, ShieldAlert, Sparkles, Check, Car, User, Eye, Send, EyeOff, Info
} from 'lucide-react';
import { Language, SafeRoute, TrustedContact } from '../types';
import { translations } from '../data/translations';

interface SafeRouteViewProps {
  language: Language;
  onClose: () => void;
  contacts: TrustedContact[];
  onAddLog: (message: string) => void;
}

export default function SafeRouteView({
  language,
  onClose,
  contacts,
  onAddLog
}: SafeRouteViewProps) {
  const [destination, setDestination] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');
  
  // Trip sharing state
  const [sharingActive, setSharingActive] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  
  // Simulated alert triggers
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  const t = translations[language];

  // Mock safety routes
  const mockRoutes: SafeRoute[] = [
    {
      id: 'route-1',
      name: language === 'en' ? 'Safe Path (Recommended)' : (language === 'hi' ? 'सुरक्षित मार्ग (अनुशंसित)' : 'सुरक्षित रस्ता (मंजूर)'),
      rating: 9.4,
      lighting: 'Excellent',
      crimeScore: 'Low',
      crowdDensity: 'Moderate',
      duration: 18,
      distance: 3.8,
      policeStations: 2,
      hospitals: 1,
      points: [{ lat: 28.6139, lng: 77.2090 }, { lat: 28.6214, lng: 77.2185 }, { lat: 28.6225, lng: 77.2341 }]
    },
    {
      id: 'route-2',
      name: language === 'en' ? 'Shortest (Poorly Lit)' : (language === 'hi' ? 'सबसे छोटा मार्ग (अंधेरा मार्ग)' : 'छोटा रस्ता (अंधेरा)'),
      rating: 4.2,
      lighting: 'Poor',
      crimeScore: 'High',
      crowdDensity: 'Empty',
      duration: 11,
      distance: 2.2,
      policeStations: 0,
      hospitals: 0,
      points: [{ lat: 28.6139, lng: 77.2090 }, { lat: 28.6315, lng: 77.2201 }]
    }
  ];

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setShowRoutes(true);
    onAddLog(`Safe Route safety analysis computed for destination: ${destination}`);
  };

  const handleShareTrip = (e: React.FormEvent) => {
    e.preventDefault();
    setSharingActive(true);
    const logMsg = `TRIP SHARED: Heading to ${destination}. Vehicle: ${vehicleNumber || 'Unspecified Cab'}. Driver: ${driverName || 'Verified Cabby'}. Live ETA: ${mockRoutes.find(r => r.id === selectedRouteId)?.duration} mins. Circles notified.`;
    onAddLog(logMsg);
    alert(language === 'en' ? "Trip shared! Safety Circle notified with live ETA and driver info." : "सफ़र की जानकारी साझा की गई! आपके सुरक्षा चक्र को चालक विवरण और आगमन समय भेज दिया गया है।");
  };

  const handleSimulateIncident = (type: 'wrong_turn' | 'long_stop') => {
    if (type === 'wrong_turn') {
      setSimulatedAlert("ALERT: Device GPS detected a route deviation of 300 meters from safe path! Safety Circle alerted.");
      onAddLog("ROUTING DEVIATION DETECTED: Device deviated from safe corridor limits. Sent alert to circles.");
    } else {
      setSimulatedAlert("ALERT: Unusually long stop of 4+ minutes detected without reaching destination. Initiating private check-in countdown!");
      onAddLog("ALERT COOLDOWN TRIGGERED: Long vehicle stall detected. Sent threat check-in warning.");
    }
  };

  const currentSelectedRoute = mockRoutes.find(r => r.id === selectedRouteId);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4">
      {/* Top Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.routeSafetyTitle}</h1>
      </div>

      {/* Dynamic Simulation Warning Modals */}
      {simulatedAlert && (
        <div className="bg-red-600 border border-red-500 rounded-xl p-3.5 mb-3 text-left space-y-2.5 animate-bounce">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-white" />
            <p className="text-xs font-bold leading-normal text-white">{simulatedAlert}</p>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setSimulatedAlert(null)}
              className="px-3 py-1 bg-slate-950 text-white font-semibold text-[10px] uppercase rounded border border-red-500/20"
            >
              I am Safe (Dismiss)
            </button>
          </div>
        </div>
      )}

      {/* Destination Form */}
      {!showRoutes ? (
        <form onSubmit={handleStartAnalysis} className="space-y-3.5">
          <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-neutral-400">{t.sourceLabel}</label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-2.5 rounded-lg text-xs font-medium text-blue-400">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Central Delhi Corridors (GPS Lock)</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-neutral-400">Destination</label>
              <input 
                type="text" 
                placeholder={t.destinationPlaceholder}
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-neutral-800 rounded-lg p-2.5 text-xs focus:border-red-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>{t.findSafeRoute}</span>
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          
          {/* Simulated SVG Interactive Map */}
          <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-3 text-center space-y-2 relative">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider text-left">Live Map Corridors</h3>
            
            <div className="w-full h-[150px] bg-slate-950 rounded-xl relative overflow-hidden border border-neutral-850 flex items-center justify-center">
              {/* Simple map grids */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
              
              {/* SVG drawing paths for safety routes */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Unsafe Short Route */}
                <path d="M 50 120 L 220 50 L 320 30" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4" className={selectedRouteId === 'route-2' ? 'stroke-red-500 stroke-2' : 'stroke-red-900 opacity-40'} />
                {/* Safe Recommended Route */}
                <path d="M 50 120 L 100 130 L 180 100 L 250 80 L 320 30" fill="none" stroke="#10b981" strokeWidth="4" className={selectedRouteId === 'route-1' ? 'stroke-emerald-400 animate-pulse' : 'stroke-emerald-800 opacity-40'} />
                
                {/* Points */}
                <circle cx="50" cy="120" r="6" fill="#3b82f6" /> {/* Source */}
                <circle cx="320" cy="30" r="6" fill="#ef4444" /> {/* Dest */}
                
                {/* Police icons placeholders */}
                <circle cx="100" cy="130" r="4" fill="#60a5fa" />
                <circle cx="250" cy="80" r="4" fill="#60a5fa" />
              </svg>

              {/* Map UI overlays */}
              <div className="absolute left-3 bottom-3 text-[9px] bg-neutral-900/90 border border-neutral-800 px-2 py-1 rounded text-neutral-300 font-mono">
                🔵 You
              </div>
              <div className="absolute right-3 bottom-3 text-[9px] bg-neutral-900/90 border border-neutral-800 px-2 py-1 rounded text-neutral-300 font-mono">
                📍 {destination}
              </div>

              {/* Mini icons overlays */}
              <div className="absolute left-[92px] top-[112px] bg-blue-500/10 border border-blue-500/20 px-1 rounded text-[8px] text-blue-400 font-bold">👮 PS</div>
              <div className="absolute left-[242px] top-[62px] bg-blue-500/10 border border-blue-500/20 px-1 rounded text-[8px] text-blue-400 font-bold">👮 PS</div>
            </div>
            
            <p className="text-[8px] text-neutral-500 italic text-left flex items-center gap-1 leading-normal">
              <Info className="w-3 h-3 shrink-0" />
              Safety indices estimates based on local crowd registries, streetlighting data, and proximity to stations. Scores are predictions, not legal guarantees.
            </p>
          </div>

          {/* Route Option Comparison Grid */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider text-left">Compare Route Safety</h3>
            {mockRoutes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`w-full text-left p-3 rounded-xl border flex justify-between items-center transition-all ${
                  selectedRouteId === route.id 
                    ? 'bg-slate-900 border-blue-500 shadow-md' 
                    : 'bg-neutral-900/60 border-neutral-850 hover:bg-neutral-900'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-200">{route.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      route.rating >= 8 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {t.routeScore}: {route.rating}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono">
                    <span>⏱️ {route.duration} mins</span>
                    <span>🛣️ {route.distance} km</span>
                    <span>👮 {route.policeStations} police</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    route.lighting === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    💡 {route.lighting}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* SHARE TRIP DRAWER PANEL */}
          <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                Share Active Trip with Circle
              </span>
              {sharingActive && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">SHARED ✓</span>}
            </div>

            <form onSubmit={handleShareTrip} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                    <Car className="w-3 h-3 text-neutral-400" /> Vehicle Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. DL 3C AB 4567" 
                    value={vehicleNumber}
                    onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-neutral-850 rounded p-1.5 text-xs text-white uppercase font-mono mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-neutral-400" /> Driver Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Satish Kumar" 
                    value={driverName}
                    onChange={e => setDriverName(e.target.value)}
                    className="w-full bg-slate-950 border border-neutral-850 rounded p-1.5 text-xs text-white mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wide transition-all"
              >
                Broadcast Safe-Trip Corridor
              </button>
            </form>
          </div>

          {/* INCIDENT TEST SIMULATORS */}
          <div className="bg-neutral-950/60 border border-neutral-850 rounded-2xl p-3 space-y-2">
            <h4 className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider text-left">Incident Testing Simulators</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulateIncident('wrong_turn')}
                className="py-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-500/20 rounded-lg text-[9px] font-mono text-red-400 transition-all flex items-center justify-center gap-1"
              >
                ⚠️ Deviaiton (Wrong Turn)
              </button>
              <button
                onClick={() => handleSimulateIncident('long_stop')}
                className="py-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-500/20 rounded-lg text-[9px] font-mono text-red-400 transition-all flex items-center justify-center gap-1"
              >
                🛑 Long Halt (Halt Stop)
              </button>
            </div>
          </div>

          {/* Reset View Button */}
          <button 
            onClick={() => setShowRoutes(false)}
            className="w-full py-1.5 text-center text-xs text-neutral-500 hover:text-neutral-400"
          >
            Clear Route / Edit Destination
          </button>

        </div>
      )}

    </div>
  );
}
