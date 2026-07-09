import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Heart, ShieldAlert, Key, Car, Sparkles, Check, Info } from 'lucide-react';
import { Language } from '../types';
import { educationGuides, EducationCard } from '../data/education';
import { translations } from '../data/translations';

interface EducationViewProps {
  language: Language;
  onClose: () => void;
}

export default function EducationView({
  language,
  onClose
}: EducationViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language];

  // Fetch education data for current language
  const guides = educationGuides[language] || [];

  // Map category code to human names and icons
  const categories = [
    { id: 'all', label: language === 'en' ? 'All Guides' : 'सभी गाइड्स', icon: '📚' },
    { id: 'emergency', label: language === 'en' ? 'Survival' : 'आपातकाल', icon: '🚨' },
    { id: 'firstaid', label: language === 'en' ? 'First Aid' : 'प्राथमिक चिकित्सा', icon: '🏥' },
    { id: 'cyber', label: language === 'en' ? 'Cyber Safety' : 'साइबर सुरक्षा', icon: '🛡️' },
    { id: 'plan', label: language === 'en' ? 'Safety Plan' : 'सुरक्षा योजना', icon: '📝' },
    { id: 'transport', label: language === 'en' ? 'Transit' : 'सुरक्षित यात्रा', icon: '🚍' }
  ];

  const filteredGuides = selectedCategory === 'all'
    ? guides
    : guides.filter(g => g.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'emergency': return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'firstaid': return <Heart className="w-4 h-4 text-emerald-400" />;
      case 'cyber': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'plan': return <Key className="w-4 h-4 text-amber-400" />;
      case 'transport': return <Car className="w-4 h-4 text-purple-400" />;
      default: return <BookOpen className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onClose} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold font-display uppercase tracking-wider">{t.emergencyGuides}</h1>
      </div>

      <p className="text-[11px] text-neutral-400 mb-3 text-left">
        {language === 'en' 
          ? 'Browse simple offline guides curated with action steps and tips to protect yourself and others.' 
          : 'संकट के समय तुरंत काम आने वाली प्राथमिक चिकित्सा, साइबर ठगी और सुरक्षित सफ़र की मार्गदर्शिका पढ़ें।'}
      </p>

      {/* Categories Row */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-red-600 border-red-500 text-white shadow'
                : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Guide Cards Listing */}
      <div className="flex-1 space-y-3.5 mt-2.5 overflow-y-auto max-h-[460px] pr-0.5 hide-scrollbar">
        {filteredGuides.map((guide) => (
          <div key={guide.id} className="bg-slate-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-3.5">
            
            {/* Guide Title */}
            <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
              <span className="p-1.5 bg-neutral-950 rounded-lg border border-neutral-850">
                {getCategoryIcon(guide.category)}
              </span>
              <h2 className="text-xs font-bold text-neutral-100 uppercase tracking-wide leading-relaxed">
                {guide.title}
              </h2>
            </div>

            {/* Action Steps */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
                {language === 'en' ? 'Actionable steps:' : 'त्वरित कदम:'}
              </span>
              <ol className="space-y-2">
                {guide.steps.map((step, idx) => (
                  <li key={idx} className="text-[11px] text-neutral-300 flex gap-2 items-start leading-relaxed font-sans">
                    <span className="w-4 h-4 rounded-full bg-slate-950 border border-neutral-800 text-[9px] font-bold text-neutral-400 flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro Tips */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-850/80 bg-neutral-950/20 p-2 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                {language === 'en' ? 'Crucial tips:' : 'अहम सलाह:'}
              </span>
              <ul className="space-y-1.5">
                {guide.tips.map((tip, idx) => (
                  <li key={idx} className="text-[10px] text-neutral-400 flex gap-1.5 items-start leading-relaxed italic">
                    <span className="text-red-500 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

      <div className="bg-neutral-950 p-2 rounded-lg border border-neutral-850 text-left mt-3 shrink-0">
        <p className="text-[8px] text-neutral-500 leading-normal flex items-start gap-1">
          <Info className="w-3 h-3 shrink-0" />
          Guides are stored fully locally in flash memory so you can access crucial emergency details offline when cellular and network connections fail.
        </p>
      </div>

    </div>
  );
}
