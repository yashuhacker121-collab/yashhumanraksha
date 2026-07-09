import { Language } from '../types';

export interface EducationCard {
  id: string;
  title: string;
  category: 'emergency' | 'firstaid' | 'cyber' | 'plan' | 'transport';
  steps: string[];
  tips: string[];
}

export const educationGuides: Record<Language, EducationCard[]> = {
  en: [
    {
      id: "emergency-guide",
      title: "Immediate Action in an Emergency",
      category: "emergency",
      steps: [
        "Assess the situation quickly. If threatened, prioritize escaping to a crowded or well-lit area.",
        "Trigger the SOS button on Yash Human Raksha immediately by holding the button or pressing your physical power button 3-5 times.",
        "Use One-Tap calling to connect with National Emergency Helpline 112.",
        "Keep moving if followed; avoid dead ends or dark alleyways."
      ],
      tips: [
        "Keep your phone in your hand when walking in unfamiliar areas.",
        "Set up your 'Safety Circle' with people you trust to take action immediately."
      ]
    },
    {
      id: "firstaid-guide",
      title: "First Aid Basics & Emergency Trauma",
      category: "firstaid",
      steps: [
        "Severe Bleeding: Apply firm, direct pressure to the wound using a clean cloth or bandage. Keep the limb elevated.",
        "Choking: Stand behind the person, wrap your arms around their waist, and perform 5 sharp abdominal thrusts.",
        "Unconsciousness: Check if they are breathing. If breathing, place them in the 'recovery position' on their side.",
        "Panic Attacks: Guide them to take deep, slow breaths. Breathe in for 4 seconds, hold for 4, and exhale for 4."
      ],
      tips: [
        "Never leave an injured person alone unless absolutely necessary to seek help.",
        "Always call an ambulance via 102/112 before attempting complex procedures."
      ]
    },
    {
      id: "cyber-guide",
      title: "Phishing & Cyber Scam Prevention",
      category: "cyber",
      steps: [
        "Check URLs before clicking. Scammers use lookalike links like 'payt-m.com' or 'sbi-secure-login.net'.",
        "Never share OTPs (One-Time Passwords) or UPI PINs with anyone, even if they claim to be from bank support or customer service.",
        "Beware of 'Urgent Emergency' scams, such as calls claiming a family member is in trouble and requesting immediate cash transfers.",
        "Enable Two-Factor Authentication (2FA) on all messaging and social media accounts."
      ],
      tips: [
        "Take screenshot evidence immediately if harassed or blackmailed online.",
        "File a complaint at cybercrime.gov.in (India's official portal) or call 1930."
      ]
    },
    {
      id: "plan-guide",
      title: "How to Build a Trusted-Contact Plan",
      category: "plan",
      steps: [
        "Select 3 to 5 people who are responsive, close to you geographically, or physically able to assist.",
        "Discuss your plan with them. Ensure they know they are in your 'Yash Human Raksha' Safety Circle.",
        "Establish code words or actions: A missed check-in means 'check on me', while a direct SOS means 'emergency - call police'.",
        "Set up permissions properly (e.g. give direct GPS tracking permission to close family, but SOS-only to general friends)."
      ],
      tips: [
        "Test your plan at least once. Trigger a 'Demo SOS' to verify they receive your coordinates.",
        "Keep emergency contacts updated whenever moving to a new city or job."
      ]
    },
    {
      id: "transport-guide",
      title: "Safe Commutes & Travel Safeguards",
      category: "transport",
      steps: [
        "Check vehicle details: Before entering any cab or auto, verify the license plate matches your booking app.",
        "Share your trip details: Use the 'Safe Route Share' feature to broadcast your vehicle number, driver details, and live route.",
        "Stay alert: Avoid putting both headphones in or falling asleep on unfamiliar routes.",
        "If the driver takes a wrong turn or stops unusually, immediately trigger your Fake Call to make an excuse or use SOS if threatened."
      ],
      tips: [
        "Sit near the door or other passengers on trains and buses.",
        "Always note down the cab driver's ID card/photo if displayed."
      ]
    }
  ],
  hi: [
    {
      id: "emergency-guide",
      title: "आपातकाल में तुरंत कार्रवाई",
      category: "emergency",
      steps: [
        "स्थिति का तुरंत आकलन करें। यदि खतरा हो, तो भीड़भाड़ या अच्छी रोशनी वाले क्षेत्र में जाने को प्राथमिकता दें।",
        "यश ह्यूमन रक्षा पर तुरंत एसओएस बटन दबाएं या अपने भौतिक पावर बटन को 3-5 बार दबाएं।",
        "राष्ट्रीय आपातकालीन हेल्पलाइन 112 से जुड़ने के लिए वन-टैप कॉलिंग का उपयोग करें।",
        "यदि कोई पीछा कर रहा हो तो चलते रहें; बंद गलियों या अंधेरे रास्तों से बचें।"
      ],
      tips: [
        "अपरिचित क्षेत्रों में चलते समय अपने फोन को हाथ में रखें।",
        "तुरंत कार्रवाई करने के लिए उन लोगों के साथ अपना 'सुरक्षा चक्र' स्थापित करें जिन पर आप भरोसा करते हैं।"
      ]
    },
    {
      id: "firstaid-guide",
      title: "प्राथमिक चिकित्सा (First Aid) के मूल नियम",
      category: "firstaid",
      steps: [
        "गंभीर रक्तस्राव: साफ कपड़े या पट्टी का उपयोग करके घाव पर सीधा दबाव डालें। अंग को ऊपर उठाकर रखें।",
        "दम घुटना (Choking): व्यक्ति के पीछे खड़े हों, अपनी बाहों को उनकी कमर के चारों ओर लपेटें, और तेजी से पेट पर झटके दें।",
        "बेहोशी: जांचें कि वे सांस ले रहे हैं या नहीं। यदि सांस ले रहे हैं, तो उन्हें करवट दिलाकर 'रिकवरी पोजीशन' में लेटाएं।",
        "घबराहट का दौरा (Panic Attack): उन्हें गहरी और धीमी सांसें लेने के लिए कहें। 4 सेकंड के लिए सांस लें, 4 रोकें, और 4 में छोड़ें।"
      ],
      tips: [
        "जब तक मदद लेने के लिए बिल्कुल आवश्यक न हो, घायल व्यक्ति को कभी अकेला न छोड़ें।",
        "जटिल चिकित्सा का प्रयास करने से पहले हमेशा 102 या 112 पर कॉल करके एम्बुलेंस बुलाएं।"
      ]
    },
    {
      id: "cyber-guide",
      title: "फ़िशिंग और साइबर घोटालों से बचाव",
      category: "cyber",
      steps: [
        "क्लिक करने से पहले लिंक को ध्यान से देखें। ठग 'payt-m.com' या 'sbi-secure-login.net' जैसे नकली नामों का उपयोग करते हैं।",
        "किसी के साथ भी ओटीपी (OTP) या यूपीआई पिन (UPI PIN) साझा न करें, भले ही वे बैंक अधिकारी होने का दावा करें।",
        "आपातकालीन घोटालों से सावधान रहें, जैसे कि रिश्तेदार के संकट में होने का झूठा नाटक करके पैसे मांगना।",
        "अपने सभी सोशल मीडिया और मैसेजिंग खातों पर टू-फैक्टर ऑथेंटिकेशन (2FA) चालू करें।"
      ],
      tips: [
        "यदि कोई ऑनलाइन ब्लैकमेल करे तो तुरंत स्क्रीनशॉट साक्ष्य लें।",
        "cybercrime.gov.in (भारत सरकार की वेबसाइट) पर शिकायत दर्ज करें या 1930 डायल करें।"
      ]
    },
    {
      id: "plan-guide",
      title: "सुरक्षा चक्र योजना कैसे तैयार करें",
      category: "plan",
      steps: [
        "3 से 5 ऐसे लोगों को चुनें जो कॉल का तुरंत जवाब देते हैं, भौगोलिक रूप से नजदीक हैं, या शारीरिक रूप से मदद के लिए आ सकते हैं।",
        "उन्हें बताएं कि वे आपके 'यश ह्यूमन रक्षा' सुरक्षा चक्र में शामिल हैं।",
        "कोड वर्ड तय करें: समय पर चेक-इन न करने का मतलब 'मेरी खबर लें' और डायरेक्ट एसओएस का मतलब 'पुलिस बुलाएं' है।",
        "सही अनुमतियां सेट करें (जैसे परिवार को लाइव लोकेशन और सामान्य दोस्तों को केवल एसओएस अलर्ट)।"
      ],
      tips: [
        "योजना का परीक्षण करें। यह देखने के लिए कि क्या वे स्थान प्राप्त कर रहे हैं, एक 'डेमो एसओएस' भेजें।",
        "नया काम शुरू करने या नया शहर बदलने पर अपने संपर्कों को अपडेट करें।"
      ]
    },
    {
      id: "transport-guide",
      title: "सुरक्षित यात्रा और परिवहन युक्तियाँ",
      category: "transport",
      steps: [
        "वाहन के विवरण की जांच करें: कैब या ऑटो में बैठने से पहले, लाइसेंस प्लेट की पुष्टि करें।",
        "अपनी यात्रा साझा करें: अपनी यात्रा के दौरान 'लाइव रूट शेयर' का उपयोग करके वाहन संख्या और चालक का विवरण साझा करें।",
        "सतर्क रहें: अपरिचित रास्तों पर दोनों कानों में हेडफोन लगाने या सो जाने से बचें।",
        "यदि चालक गलत रास्ता चुनता है या अनावश्यक रूप से रुकता है, तो तुरंत 'फेक कॉल' का उपयोग करें या डराने पर एसओएस दबाएं।"
      ],
      tips: [
        "ट्रेन और बसों में दरवाजे या अन्य यात्रियों के करीब बैठें।",
        "कैब चालक के प्रदर्शित आईडी कार्ड/फोटो का विवरण हमेशा नोट करें।"
      ]
    }
  ],
  hr: [
    {
      id: "emergency-guide",
      title: "मुसीबत आते ही तुरंत क्या करें",
      category: "emergency",
      steps: [
        "माहौल नै जल्दी त भांप लो। जै खतरा दिखे तो भीड़भाड़ आली या बत्ती आली जगह पै चले जाओ।",
        "यश ह्यूमन रक्षा पै तुरंत बड़ा एसओएस बटन दाबो या अपने फ़ोन का पावर बटन 3-5 बार लगातार दाबो।",
        "112 पै सीधी घंटी मिला के सरकारी पुलिस की मदद मांगो।",
        "जै कोए पाछे पड़ रहा हो तो रुकियो मत; अंधेरे गळियों और सूने रास्तों त बचो।"
      ],
      tips: [
        "अनजान रस्ते पै चलते बखत फ़ोन नै हाथ में पकड़ के रखो।",
        "अपने सुरक्षा चक्र (भाईचारे) में उन लोगां नै जोड़ो जो तुरंत दौड़ के आ सके।"
      ]
    },
    {
      id: "firstaid-guide",
      title: "चोट-फट में तुरंत इलाज (First Aid)",
      category: "firstaid",
      steps: [
        "घणा खून बहे तो: घाव पै साफ कपड़ा या पट्टी रख के जोर त दबाओ और हाथ-पैर नै ऊपर उठा लो।",
        "जै सांस रुक जावे (Choking): बंदे के पाछे खड़े हो जाओ, उसकी कमर पै हाथ लपेट के पेट पै ऊपर की तरफ़ जोर त धक्का मारो।",
        "बेहोशी की हालत: देखियो सांस चल रही सै कै ना। जै सांस चल रही हो तो करवट दिला के सुला दो।",
        "घबराहट हो तो: गहरी और लंबी सांस लेण नै कहो। 4 सेकंड सांस खींचो, 4 सेकंड रोको और 4 सेकंड में छोड़ो।"
      ],
      tips: [
        "मदद लेण के बिना किसे भी घायल बंदे नै कदे अकेला मत छोड़ो।",
        "घणी बड़ी चोट हो तो तुरंत 102 पै एम्बुलेंस बुलाओ।"
      ]
    },
    {
      id: "cyber-guide",
      title: "साइबर ठगी और फोन पै धोखाधड़ी त बचाव",
      category: "cyber",
      steps: [
        "लिंक पै अंगूठा दबाने त पहले जाचो। चोर 'payt-m.com' या 'sbi-secure' जैसी नकली वेबसाइट बना के रखें सै।",
        "कदे भी अपना बैंक का पासवर्ड, ओटीपी (OTP) या यूपीआई पिन किसे नै मत बताओ, चाहे वो बैंक का अफसर बन के फ़ोन करे।",
        "रिश्तेदार के एक्सीडेंट की झूठी खबर सुना के पैसे मांगन आलों त सावधान रहो।",
        "अपने व्हाट्सएप और फेसबुक पै टू-स्टेप वेरिफिकेशन (Two-Factor) हमेशा चालू रखो।"
      ],
      tips: [
        "जै कोए ब्लैकमेल करे तो तुरंत स्क्रीनशॉट ले लो।",
        "cybercrime.gov.in पै शिकायत लिखो या फिर 1930 नंबर पै फ़ोन मिलाओ।"
      ]
    },
    {
      id: "plan-guide",
      title: "बचाव का पक्का प्लान कैसे त्यार करें",
      category: "plan",
      steps: [
        "3 त 5 ऐसे बंदे चुनो जो तुरंत फ़ोन ठा लें और थारे धोरे रहते हों।",
        "उनती साफ़-साफ़ बता दो के वे थारे 'यश ह्यूमन रक्षा' भाईचारे में जुड़े हुए सैं।",
        "कोड वर्ड बना लो: जै आगमन टाइमर बंद कोन्या करया तो समझ लियो कोए गड़बड़ सै, और एसओएस गया तो सीधा पुलिस बुलाओ।",
        "मंजूरी सही चुनो: घरक्यां नै लाइव लोकेशन दिखाओ और दोस्तों नै केवल मुसीबत का अलर्ट।"
      ],
      tips: [
        "एक बार डेमो एसओएस भेज के जांच लो के थारे भाईचारे पै सही लोकेशन पहुँच रही सै कै कोन्या।",
        "नया शहर या काम बदलण पै अपने सुरक्षा चक्र के बंदे जरूर बदल दियो।"
      ]
    },
    {
      id: "transport-guide",
      title: "गाड़ी, बस और मेट्रो में सुरक्षित सफ़र के तरीके",
      category: "transport",
      steps: [
        "गाड़ी की जांच: ऑटो या टैक्सी में बैठन त पहले नंबर प्लेट देख के फ़ोन में फ़ोटो खींच लो।",
        "लाइव सफ़र सांझा करो: 'Safe Route Share' त रस्ते और ड्राइवर की फ़ोटो अपने भाईचारे नै भेज दो।",
        "होशियार रहो: कानों में लीड लगा के सोने त बचो। अपनी लोकेशन पै ध्यान रखो।",
        "जै ड्राइवर उल्टा-सुल्टा रस्ता पकड़े तो तुरंत 'झूठा फ़ोन (Fake Call)' का बहाना मारो और रस्ता बदलवाओ।"
      ],
      tips: [
        "बस या रेल में हमेशा गेट के पास या घणे पैसेंजर आले डब्बे में बैठो।",
        "टैक्सी आले का लगा होया आई-कार्ड जरूर चेक करो।"
      ]
    }
  ]
};
