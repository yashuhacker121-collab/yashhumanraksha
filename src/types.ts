export type Language = 'en' | 'hi' | 'hr';

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  permissions: {
    sos: boolean;
    trackLocation: boolean;
    checkInAlerts: boolean;
    callAccess: boolean;
  };
}

export interface SafetyCheckIn {
  id: string;
  targetTime: string; // HH:MM
  label: string;
  isActive: boolean;
  lastConfirmedAt?: string;
  reminderSent: boolean;
  sosTriggered: boolean;
}

export type HelpCategory = 
  | 'police' 
  | 'emergency_112' 
  | 'ambulance' 
  | 'hospital' 
  | 'fire' 
  | 'women_support' 
  | 'shelter' 
  | 'legal_aid';

export interface HelpDirectoryItem {
  id: string;
  name: string;
  category: HelpCategory;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  verified: boolean;
}

export interface IncidentReport {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  battery: number;
  evidenceType?: 'audio' | 'video' | 'both';
  evidenceUrl?: string; // base64 or objectUrl
  status: 'active_emergency' | 'resolved' | 'submitted';
}

export interface SafeRoute {
  id: string;
  name: string;
  rating: number; // 1-10
  lighting: 'Poor' | 'Moderate' | 'Excellent';
  crimeScore: 'Low' | 'Medium' | 'High';
  crowdDensity: 'Empty' | 'Moderate' | 'Crowded';
  duration: number; // minutes
  distance: number; // km
  policeStations: number;
  hospitals: number;
  points: { lat: number; lng: number }[];
}

export interface UserSettings {
  pinCode: string;
  locationGranted: boolean;
  microphoneGranted: boolean;
  cameraGranted: boolean;
  smsChannelEnabled: boolean;
  shakeDetection: boolean;
  powerButtonTrigger: boolean;
  lowBatterySOS: boolean;
  language?: Language;
  voiceSOSActive?: boolean;
  secretPhrase?: string;
  lowDataMode?: boolean;
  batterySaver?: boolean;
  powerButtonSOS?: boolean;
  shakeSOS?: boolean;
  recordingsDeletionPeriod?: 'never' | '24h' | '7days' | '30days';
  encryptedStorageOnly?: boolean;
  locationSharingExpiry?: 'always' | '1h' | '4h' | '12h';
}

export interface SMSLog {
  id: string;
  timestamp: string;
  recipient: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
}

export interface Dictionary<T> {
  [key: string]: T;
}
