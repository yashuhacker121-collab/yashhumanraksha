import React, { useState } from 'react';
import { 
  ArrowLeft, Play, ExternalLink, Shield, Flame, Search, Sparkles, 
  CheckCircle2, Swords, Trophy, RotateCcw, AlertTriangle, Eye, Video
} from 'lucide-react';
import { Language } from '../types';

interface SelfDefenseViewProps {
  language: Language;
  onClose: () => void;
  onAddLog: (msg: string) => void;
}

interface VideoTutorial {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: 'striking' | 'escaping' | 'weapons' | 'awareness';
  youtubeUrl: string;
  embedId: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyLoc: Record<Language, string>;
  techniques: Record<Language, string[]>;
}

export default function SelfDefenseView({
  language,
  onClose,
  onAddLog
}: SelfDefenseViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<VideoTutorial | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Interactive combo trainer state
  const [trainerStep, setTrainerStep] = useState<number>(0); // 0: Idle, 1: Ready, 2: Action, 3: Success, 4: Failed
  const [comboScore, setComboScore] = useState<number>(0);
  const [comboIndex, setComboIndex] = useState<number>(0);
  const [lastActionTime, setLastActionTime] = useState<number>(0);
  const [trainerMessage, setTrainerMessage] = useState<string>('');

  const t = {
    en: {
      title: "Self-Defense & Fighting Guide",
      subtitle: "Learn martial defense, weak-point fighting & quick escape drills curated from top instructors.",
      searchPlaceholder: "Search defense techniques (grab, punch, kick)...",
      all: "All Moves",
      striking: "Striking Moves",
      escaping: "Escape Grabs",
      weapons: "Improvised Tools",
      awareness: "De-escalation",
      duration: "Duration",
      difficulty: "Difficulty",
      watchBtn: "Simulate & Learn",
      openYoutube: "Watch Full Video on YouTube",
      techniquesTitle: "Key Techniques Taught:",
      noVideos: "No videos found matching your query.",
      practiceMode: "Fight Practice Drill (Combo Mode)",
      practiceDesc: "Practice quick-response moves. Tap the matching action as fast as possible when it glows red!",
      startPractice: "Start Combo Practice",
      hitAction: "TAP QUICKLY!",
      tooSlow: "Too slow! Reaction needs to be under 1.2 seconds.",
      comboSuccess: "Excellent block! Practice increases survival chance.",
      bestScore: "Best Streak Score",
      tacticsDisclaimer: "Disclaimer: Physical force should only be used as a last resort in extreme emergencies to escape."
    },
    hi: {
      title: "महिला आत्मरक्षा और फाइटिंग",
      subtitle: "शीर्ष प्रशिक्षकों से सीखें कमजोर अंगों पर प्रहार, खतरनाक पकड़ से छूटना और तुरंत लड़ने के तरीके।",
      searchPlaceholder: "तकनीक खोजें (पकड़, मुक्का, लात, सुरक्षा)...",
      all: "सभी तकनीकें",
      striking: "प्रहार (पंच/किक)",
      escaping: "पकड़ से छुड़ाना",
      weapons: "घरेलू हथियार",
      awareness: "बचाव सूझबूझ",
      duration: "समय",
      difficulty: "कठिनाई",
      watchBtn: "प्ले करें और सीखें",
      openYoutube: "यूट्यूब पर पूरा वीडियो देखें",
      techniquesTitle: "सीखी जाने वाली मुख्य तकनीकें:",
      noVideos: "कोई वीडियो नहीं मिला।",
      practiceMode: "फाइटिंग कम्बाइन ड्रिल (अभ्यास)",
      practiceDesc: "मुसीबत में तुरंत रिस्पांस देना सीखें। जैसे ही स्क्रीन लाल हो, सही बटन को तुरंत दबाएं!",
      startPractice: "कम्बो प्रैक्टिस शुरू करें",
      hitAction: "तुरंत दबाएं!",
      tooSlow: "देरी हो गई! मुकाबला करने के लिए 1.2 सेकंड से कम समय चाहिए।",
      comboSuccess: "शानदार प्रहार! अभ्यास ही आपातकाल में सुरक्षा की कुंजी है।",
      bestScore: "सर्वोत्तम स्कोर",
      tacticsDisclaimer: "चेतावनी: शारीरिक बल का प्रयोग केवल अंतिम उपाय के रूप में अपनी जान बचाने के लिए ही करें।"
    },
    hr: {
      title: "आत्मरक्षा फाइटिंग सीख",
      subtitle: "मुसीबत पड़ने पै गाल में भिड़न की और खुद नै बचाण की धाकड़ तकनीक सीखो।",
      searchPlaceholder: "बचाव का तरीका ढूंढो (पकड़, थप्पड़, लात)...",
      all: "सारे तरीके",
      striking: "धाकड़ प्रहार (पंच/किक)",
      escaping: "पकड़ छुड़ाना",
      weapons: "जुगाड़ू हथियार",
      awareness: "होशियारी सूझबूझ",
      duration: "टेम",
      difficulty: "कठिनाई",
      watchBtn: "विडियो चलाओ",
      openYoutube: "यूट्यूब पै पूरा विडियो देखो",
      techniquesTitle: "मुख्य सीख:",
      noVideos: "कोए विडियो कोन्या मिली।",
      practiceMode: "लड़न का असली अभ्यास (कम्बो)",
      practiceDesc: "खतरे में फुर्ती त काम लेना सीखो। जैंसे ही लाल निशान दिखे, बटन नै घणी फुर्ती त दबाओ!",
      startPractice: "प्रैक्टिस चालू करो",
      hitAction: "दबा फुर्ती तै!",
      tooSlow: "घने ढीले रह गए! फुर्ती 1.2 सेकंड त कम की चाहवै सै।",
      comboSuccess: "मखा जमा सुथरा प्रहार! योही बचावेगा संकट में।",
      bestScore: "घणा स्कोर",
      tacticsDisclaimer: "सलाह: हाथापाई केवल आखिरी रस्ता होणा चाहिये जब कोए दूजा चारा ना बचे।"
    }
  }[language] || {
    title: "Self-Defense & Fighting Guide",
    subtitle: "Learn martial defense, weak-point fighting & quick escape drills curated from top instructors.",
    searchPlaceholder: "Search defense techniques (grab, punch, kick)...",
    all: "All Moves",
    striking: "Striking Moves",
    escaping: "Escape Grabs",
    weapons: "Improvised Tools",
    awareness: "De-escalation",
    duration: "Duration",
    difficulty: "Difficulty",
    watchBtn: "Simulate & Learn",
    openYoutube: "Watch Full Video on YouTube",
    techniquesTitle: "Key Techniques Taught:",
    noVideos: "No videos found matching your query.",
    practiceMode: "Fight Practice Drill (Combo Mode)",
    practiceDesc: "Practice quick-response moves. Tap the matching action as fast as possible when it glows red!",
    startPractice: "Start Combo Practice",
    hitAction: "TAP QUICKLY!",
    tooSlow: "Too slow! Reaction needs to be under 1.2 seconds.",
    comboSuccess: "Excellent block! Practice increases survival chance.",
    bestScore: "Best Streak Score",
    tacticsDisclaimer: "Disclaimer: Physical force should only be used as a last resort in extreme emergencies to escape."
  };

  // Curated list of high quality YouTube self-defense videos for ladies
  const selfDefenseVideos: VideoTutorial[] = [
    {
      id: "vid-1",
      title: {
        en: "Simple Wrist Grab Escapes for Women",
        hi: "कलाई की पकड़ से छूटने के 3 आसान तरीके",
        hr: "हाथ की पकड़ त छूटन के 3 आसान तरीके"
      },
      description: {
        en: "Learn how to use leverage and rotation to break even the strongest wrist lock, regardless of the attacker's size.",
        hi: "हमलावर कितना भी शक्तिशाली हो, लीवरेज और घूर्णन का उपयोग करके कलाई की पकड़ से आसानी से आज़ाद होना सीखें।",
        hr: "सामने आला कितना भी तगड़ा हो, कलाई का मोड़ घुमा क खुद नै छुड़ाण की देशी ट्रिक सीखो।"
      },
      category: "escaping",
      youtubeUrl: "https://www.youtube.com/watch?v=kPdnSP_uS8s",
      embedId: "kPdnSP_uS8s",
      duration: "4:32",
      difficulty: "Beginner",
      difficultyLoc: { en: "Beginner", hi: "आसान (शुरुआती)", hr: "आसान" },
      techniques: {
        en: ["Thumbs-up leverage rule", "Elbow-in rotation fold", "Immediate counter sprint"],
        hi: ["अंगूठे के जोड़ पर दबाव बनाना", "कोहनी को अंदर की तरफ मोड़ना", "आज़ाद होकर तुरंत भागना"],
        hr: ["अंगूठे की संधि पै जोर देणा", "कोहनी भीतर नै मोड़ना", "छूटते ही सरपट भागणा"]
      }
    },
    {
      id: "vid-2",
      title: {
        en: "Essential Weak-Point Striking (Eyes, Nose, Groin)",
        hi: "कमजोर अंगों पर जोरदार प्रहार (आँखें, नाक और नाजुक अंग)",
        hr: "नाजुक अंगों पै मारण की तकनीक (आँख, नाक और पेट)"
      },
      description: {
        en: "Crucial physical countermoves utilizing palm strikes and heel strikes targeting sensitive soft areas of an attacker.",
        hi: "हमलावर के संवेदनशील कोमल अंगों पर हथेली और पैर की एड़ी से जोरदार वार करने की सटीक तकनीक सीखें।",
        hr: "भीड़ पड़ने पै हमलावर की आंख या नाक पै हथेली मार क उसे सुन्न करन की गजब तरकीब।"
      },
      category: "striking",
      youtubeUrl: "https://www.youtube.com/watch?v=SF8H-fF9sU0",
      embedId: "SF8H-fF9sU0",
      duration: "6:15",
      difficulty: "Beginner",
      difficultyLoc: { en: "Beginner", hi: "आसान (शुरुआती)", hr: "आसान" },
      techniques: {
        en: ["Open-palm nose strike", "Hammer fist to chin", "Shin-bone kick to groin"],
        hi: ["खुली हथेली से नाक पर प्रहार", "ठोड़ी पर हैमर पंच", "कमर के निचले हिस्से पर पैर से वार"],
        hr: ["खुली हथेली त नाक पै वार", "ठोड़ी पै सीधा हैमर मुक्का", "पेट के निचले हिस्से पै लात मारणा"]
      }
    },
    {
      id: "vid-3",
      title: {
        en: "How to Escape a Rear Bear Hug Grab",
        hi: "पीछे से पकड़ने (Bear Hug) पर खुद को कैसे छुड़ाएं",
        hr: "पीछे त कोए जकड़ ले तो खुद नै कैंसे छुड़ाएं"
      },
      description: {
        en: "Step-by-step guidance to drop your center of gravity and strike back if someone grabs you tight from behind.",
        hi: "यदि कोई पीछे से अचानक जकड़ ले, तो गुरुत्वाकर्षण के केंद्र को नीचे लाकर कोहनी और पैर से जवाबी हमला सीखें।",
        hr: "पाछे त कोए कस क बाहों में भींच ले, तो नीचे झुक क कोहनी की चोट मारण की सीख।"
      },
      category: "escaping",
      youtubeUrl: "https://www.youtube.com/watch?v=Y8Xv6fG3VnI",
      embedId: "Y8Xv6fG3VnI",
      duration: "5:50",
      difficulty: "Intermediate",
      difficultyLoc: { en: "Intermediate", hi: "मध्यम", hr: "ठीक-ठाक" },
      techniques: {
        en: ["Base dropping to prevent lifting", "Backwards elbow to solar plexus", "Foot stamp on instep"],
        hi: ["खुद को भारी करना ताकि कोई उठा न पाए", "पीछे कोहनी से छाती पर वार", "हमलावर के पैर के पंजों को कुचलना"],
        hr: ["शरीर भारी करणा ताकी उठा ना सके", "पीछे नै कोहनी मारणा", "जूते की एड़ी त पैर कुचलना"]
      }
    },
    {
      id: "vid-4",
      title: {
        en: "Turning Keys & Pens into Defensive Tools",
        hi: "चाबी, पेन और दुपट्टे को रक्षा हथियार बनाना सीखें",
        hr: "चाबी और पेन नै हथियार बना क लड़ना सीखो"
      },
      description: {
        en: "Use common items found in ladies' purses (keys, pens, heavy hair clips) as highly effective self-defense force multipliers.",
        hi: "पर्स में रखी रोज़मर्रा की चीज़ों (चाबियाँ, पेन, कंघी) को खतरनाक रक्षा औजारों में बदलने की कला सीखें।",
        hr: "पर्स में रखे पेन या चाबी नै उँगलियों के बीच फंसा क हमलावर पै वार करन का देशी तरीका।"
      },
      category: "weapons",
      youtubeUrl: "https://www.youtube.com/watch?v=TzI7Wb7wN0o",
      embedId: "TzI7Wb7wN0o",
      duration: "7:02",
      difficulty: "Intermediate",
      difficultyLoc: { en: "Intermediate", hi: "मध्यम", hr: "ठीक-ठाक" },
      techniques: {
        en: ["Key-holding fist grip", "Tactical pen pressure points", "Handbag swing technique"],
        hi: ["मुट्ठी में चाबी फंसाने का सही तरीका", "पेन से दबाव बिंदुओं पर हमला", "हैंडबैग से मुंह पर भारी चोट करना"],
        hr: ["उँगलियों के बीच चाबी फंसाना", "पेन त नाजुक जगह गोदना", "भारी हैंडबैग घुमा के मारणा"]
      }
    },
    {
      id: "vid-5",
      title: {
        en: "De-escalating Street Aggression & Threat Assessment",
        hi: "खतरनाक बहस को टालना और स्थिति भांपना",
        hr: "खतरनाक माहौल भांपना और बच के निकलना"
      },
      description: {
        en: "Psychological tactics to sound confident, set strict physical boundaries, and create paths of escape without initiating a fight.",
        hi: "शारीरिक भाषा और बुलंद आवाज़ से हमलावर का हौसला तोड़ने और लड़ाई के बिना सुरक्षित भाग निकलने की सूझबूझ।",
        hr: "कड़क आवाज और कसूती आंखें दिखा के हमलावर का हौसला पस्त करण की मनोवैज्ञानिक सीख।"
      },
      category: "awareness",
      youtubeUrl: "https://www.youtube.com/watch?v=M86V-D6-i8k",
      embedId: "M86V-D6-i8k",
      duration: "8:20",
      difficulty: "Beginner",
      difficultyLoc: { en: "Beginner", hi: "आसान", hr: "आसान" },
      techniques: {
        en: ["Hand boundary posture ('STOP')", "Scanning exits immediately", "Scream shouting commands"],
        hi: ["हाथ दिखाकर रुकने की चेतावनी मुद्रा", "तुरंत बाहर निकलने के रास्ते देखना", "बुलंद आवाज़ में चिल्लाकर लोगों को बुलाना"],
        hr: ["हाथ आगे कर के रोकने का स्टाइल", "भागने का रस्ता ताड़ना", "जोर त 'मदद-मदद' की दहाड़ मारणा"]
      }
    }
  ];

  // Filters
  const filteredVideos = selfDefenseVideos.filter(vid => {
    const matchesCategory = selectedCategory === 'all' || vid.category === selectedCategory;
    const titleMatch = vid.title[language].toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = vid.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (titleMatch || descMatch);
  });

  // Combo Training Practice Game Rules
  const targetCombos = [
    { action: 'STRIKE NOSE', label: { en: "💥 Palm Strike Nose", hi: "💥 नाक पर हथेली प्रहार", hr: "💥 नाक पै हथेली मार" } },
    { action: 'ELBOW BACK', label: { en: "💪 Backwards Elbow Strike", hi: "💪 पीछे कोहनी वार", hr: "💪 कोहनी मार पाछे" } },
    { action: 'KICK GROIN', label: { en: "🦵 Knee Strike Groin", hi: "🦵 घुटने से नाजुक अंग पर चोट", hr: "🦵 घुटने की चोट पेट पै" } },
    { action: 'EYE POKE', label: { en: "👉 Double Finger Eye Poke", hi: "👉 आँखों में उंगली प्रहार", hr: "👉 आँख में उंगली गोदना" } },
    { action: 'SHAKE RELEASE', label: { en: "🔄 Twist & Pull Wrist Break", hi: "🔄 हाथ घुमाकर झटका देना", hr: "🔄 झटका मार हाथ छुड़ाना" } }
  ];

  const startComboTrainer = () => {
    setTrainerStep(1); // Ready status
    setComboScore(0);
    setComboIndex(Math.floor(Math.random() * targetCombos.length));
    setTrainerMessage(language === 'en' ? "Get ready! Follow prompts..." : "तैयार हो जाएं! निर्देश का पालन करें...");
    
    onAddLog("SELF-DEFENSE TRAINER: User started physical reaction combo trainer simulator.");

    setTimeout(() => {
      triggerNextStep();
    }, 1500);
  };

  const triggerNextStep = () => {
    setTrainerStep(2); // Action status! Glows Red!
    setLastActionTime(Date.now());
  };

  const handleComboClick = (actionName: string) => {
    if (trainerStep !== 2) return;

    const currentCombo = targetCombos[comboIndex];
    const reactionTime = (Date.now() - lastActionTime) / 1000;

    if (actionName === currentCombo.action) {
      if (reactionTime <= 1.2) {
        setComboScore(prev => prev + 1);
        setTrainerStep(3); // Success!
        setTrainerMessage(`${t.comboSuccess} (${reactionTime.toFixed(2)}s)`);
        
        // Schedule next
        setTimeout(() => {
          setComboIndex(Math.floor(Math.random() * targetCombos.length));
          triggerNextStep();
        }, 1800);
      } else {
        setTrainerStep(4); // Failed - too slow
        setTrainerMessage(`${t.tooSlow} (${reactionTime.toFixed(2)}s)`);
      }
    } else {
      setTrainerStep(4); // Failed - wrong button
      setTrainerMessage(language === 'en' ? "Incorrect Defense block! Attacker breached guard." : "गलत प्रहार! हमलावर हावी हो गया।");
    }
  };

  const handleResetTrainer = () => {
    setTrainerStep(0);
    setComboScore(0);
    setTrainerMessage('');
  };

  const handleWatchVideoSim = (vid: VideoTutorial) => {
    setActiveVideo(vid);
    setIsPlaying(false);
    onAddLog(`YOUTUBE INSTRUCTION: Opened YouTube Self-Defense tutorial: "${vid.title[language]}".`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white font-sans overflow-y-auto hide-scrollbar p-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button 
          onClick={onClose} 
          className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
          id="selfdefense-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5">
          <Swords className="w-4 h-4 text-red-500 animate-pulse" />
          <h1 className="text-sm font-bold font-display uppercase tracking-wider">{t.title}</h1>
        </div>
      </div>

      <p className="text-[10px] text-neutral-400 mb-4 text-left leading-relaxed">
        {t.subtitle}
      </p>

      {/* Simulated Active Video Player Section */}
      {activeVideo ? (
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl overflow-hidden p-3.5 space-y-3.5 mb-4 text-left animate-fade-in">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              YouTube Video Simulator
            </span>
            <button 
              onClick={() => setActiveVideo(null)} 
              className="text-[9px] px-2 py-0.5 bg-neutral-850 border border-neutral-800 rounded text-neutral-400 hover:text-white"
            >
              Close Player
            </button>
          </div>

          {/* Player Screen Simulation */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 flex flex-col items-center justify-center group shadow-inner">
            {!isPlaying ? (
              <>
                <div className="absolute inset-0 bg-neutral-950/60 flex flex-col items-center justify-center p-4 text-center space-y-1">
                  <Play className="w-12 h-12 text-red-600 bg-white/10 border border-white/20 p-2.5 rounded-full group-hover:scale-110 transition-transform cursor-pointer" onClick={() => setIsPlaying(true)} />
                  <span className="text-[10px] text-neutral-300 font-semibold pt-1">{activeVideo.title[language]}</span>
                  <span className="text-[8px] text-neutral-500">Duration: {activeVideo.duration} • Difficulty: {activeVideo.difficultyLoc[language]}</span>
                </div>
                {/* Simulated Thumbnail art */}
                <div className="w-full h-full bg-gradient-to-br from-slate-950 to-neutral-900 opacity-30 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-neutral-700" />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950 space-y-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <Swords className="absolute w-4 h-4 text-red-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-neutral-300 text-center animate-pulse">
                  Streaming YouTube Video {activeVideo.embedId}...
                </p>
                <button 
                  onClick={() => setIsPlaying(false)} 
                  className="text-[9px] text-neutral-400 hover:text-white border border-neutral-800 px-2 py-0.5 rounded"
                >
                  Pause
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-100">{activeVideo.title[language]}</h3>
            <p className="text-[10px] text-neutral-400 leading-normal">{activeVideo.description[language]}</p>
            
            {/* Direct Open YouTube Button */}
            <a 
              href={activeVideo.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow transition-all"
              onClick={() => onAddLog(`YOUTUBE ESCAPE: Redirected to native YouTube for self defense move: ${activeVideo.id}`)}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.openYoutube}</span>
            </a>

            {/* Techniques Bullet List */}
            <div className="bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-850/50 space-y-1 mt-2">
              <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
                {t.techniquesTitle}
              </span>
              <ul className="space-y-1">
                {activeVideo.techniques[language].map((tech, idx) => (
                  <li key={idx} className="text-[10px] text-neutral-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {/* SEARCH AND FILTERS */}
      <div className="space-y-2.5 mb-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-neutral-800 rounded-xl py-1.5 pl-8 pr-3 text-[10px] text-white focus:outline-none focus:border-red-500 placeholder-neutral-500"
          />
        </div>

        {/* Categories Row */}
        <div className="flex gap-1 overflow-x-auto pb-1 shrink-0 hide-scrollbar">
          {[
            { id: 'all', label: t.all },
            { id: 'striking', label: t.striking },
            { id: 'escaping', label: t.escaping },
            { id: 'weapons', label: t.weapons },
            { id: 'awareness', label: t.awareness }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[9px] font-bold border shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIDEO CARDS LISTING */}
      <div className="space-y-2.5 mb-4 max-h-[300px] overflow-y-auto pr-0.5 hide-scrollbar">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((vid) => (
            <div 
              key={vid.id} 
              className={`p-3 bg-slate-900 border rounded-2xl text-left flex gap-3 items-center hover:bg-neutral-900/60 transition-all cursor-pointer ${
                activeVideo?.id === vid.id ? 'border-red-500' : 'border-neutral-800'
              }`}
              onClick={() => handleWatchVideoSim(vid)}
            >
              {/* Thumbnail Play Holder */}
              <div className="relative w-16 h-16 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                <Play className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-0.5 right-0.5 text-[7px] bg-black/80 px-1 rounded text-neutral-400 font-mono">
                  {vid.duration}
                </span>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className={`text-[7px] font-bold px-1 py-0.2 rounded-full uppercase ${
                    vid.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {vid.difficultyLoc[language]}
                  </span>
                  <span className="text-[7px] text-neutral-500 capitalize">{vid.category}</span>
                </div>
                <h4 className="text-[11px] font-bold text-neutral-100 truncate leading-relaxed">
                  {vid.title[language]}
                </h4>
                <p className="text-[9px] text-neutral-400 line-clamp-1 leading-normal">
                  {vid.description[language]}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[10px] text-neutral-500 text-center py-4">{t.noVideos}</p>
        )}
      </div>

      {/* FIGHT PRACTICE DRILL CONTAINER */}
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-3.5 space-y-3.5 text-left mb-3">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <h3 className="text-xs font-bold text-neutral-100">{t.practiceMode}</h3>
          </div>
          {trainerStep > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-red-500/10 text-red-400 font-mono font-bold px-1.5 py-0.5 rounded-full">
                Combo: {comboScore}
              </span>
              <button onClick={handleResetTrainer} className="p-0.5 bg-neutral-800 rounded hover:bg-neutral-700">
                <RotateCcw className="w-3 h-3 text-neutral-400" />
              </button>
            </div>
          )}
        </div>

        {trainerStep === 0 ? (
          <div className="space-y-3">
            <p className="text-[10px] text-neutral-400 leading-normal">
              {t.practiceDesc}
            </p>
            <button
              onClick={startComboTrainer}
              className="w-full py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{t.startPractice}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Ready State */}
            {trainerStep === 1 && (
              <div className="py-4 text-center">
                <span className="text-sm font-bold font-display text-amber-400 uppercase tracking-widest animate-pulse">
                  GET READY...
                </span>
              </div>
            )}

            {/* Action State - Big Glow Alert */}
            {trainerStep === 2 && (
              <div className="bg-red-950/60 border border-red-500 rounded-xl p-3 text-center space-y-1 animate-pulse">
                <span className="text-[8px] uppercase font-bold text-red-400 tracking-wider flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  ATTACK INCOMING! TRIGGER REACTION!
                </span>
                <p className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  {targetCombos[comboIndex].label[language]}
                </p>
              </div>
            )}

            {/* Success State */}
            {trainerStep === 3 && (
              <div className="bg-emerald-950/60 border border-emerald-500 rounded-xl p-2.5 text-center space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wide flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  BLOCK SECURED!
                </span>
                <p className="text-[10px] text-neutral-300 italic">{trainerMessage}</p>
              </div>
            )}

            {/* Failed State */}
            {trainerStep === 4 && (
              <div className="bg-red-950/80 border border-red-600 rounded-xl p-2.5 text-center space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-red-500 tracking-wide">
                  ATTACK PENETRATED GUARD
                </span>
                <p className="text-[10px] text-neutral-300 italic">{trainerMessage}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={startComboTrainer} 
                    className="flex-1 py-1 bg-red-600 text-white rounded-lg text-[9px] font-bold"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={handleResetTrainer} 
                    className="flex-1 py-1 bg-neutral-800 text-neutral-300 rounded-lg text-[9px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Quick response keys list to tap */}
            {trainerStep === 2 && (
              <div className="grid grid-cols-2 gap-1.5">
                {targetCombos.map((combo) => (
                  <button
                    key={combo.action}
                    onClick={() => handleComboClick(combo.action)}
                    className={`p-2 text-center rounded-xl text-[9px] font-bold transition-all border ${
                      combo.action === targetCombos[comboIndex].action
                        ? 'bg-red-600 hover:bg-red-500 border-red-400 text-white scale-102 shadow-lg animate-bounce'
                        : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {combo.action === targetCombos[comboIndex].action ? t.hitAction : combo.label[language].split(' ').slice(1).join(' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-neutral-950 p-2 rounded-lg border border-neutral-850 text-left mt-1.5 shrink-0">
        <p className="text-[8px] text-neutral-500 leading-normal flex items-start gap-1">
          <Eye className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" />
          {t.tacticsDisclaimer}
        </p>
      </div>

    </div>
  );
}
