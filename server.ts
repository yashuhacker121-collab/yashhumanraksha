import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// 1. Setup in-memory databases with standard initial mock data to enable standalone testing
let activeAlerts: any[] = [
  {
    id: "alert-1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userName: "Yash Sharma (Demo User)",
    phone: "+91 98765 43210",
    lat: 28.6139,
    lng: 77.2090,
    battery: 88,
    status: "active_emergency",
    type: "Power Button SOS Triggered",
    evidenceRecorded: true,
    evidenceType: 'audio',
    message: "EMERGENCY: Yash Sharma is in an unsafe situation at Delhi Metro. Battery: 88%. Live track at: https://yash-raksha.in/track/alert-1"
  }
];

let reports: any[] = [
  {
    id: "rep-101",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: "Suspicious Vehicle",
    description: "An auto-rickshaw (DL 1RT 2345) followed me for 300 meters near Central Market. Turned off into a side street after I used the Fake Call feature.",
    lat: 28.6214,
    lng: 77.2185,
    battery: 92,
    evidenceType: "audio",
    status: "submitted"
  }
];

let helpDirectory: any[] = [
  {
    id: "help-1",
    name: "Tilak Marg Police Station",
    category: "police",
    phone: "+91 11 2338 5865",
    address: "Tilak Marg, Mandi House, New Delhi",
    lat: 28.6225,
    lng: 77.2341,
    verified: true
  },
  {
    id: "help-2",
    name: "Connaught Place Police Station",
    category: "police",
    phone: "+91 11 2335 1200",
    address: "Regal Building, Connaught Place, New Delhi",
    lat: 28.6315,
    lng: 77.2201,
    verified: true
  },
  {
    id: "help-3",
    name: "National ERSS Helpline",
    category: "emergency_112",
    phone: "112",
    address: "National Emergency Response Support System, Govt of India",
    lat: 28.6139,
    lng: 77.2090,
    verified: true
  },
  {
    id: "help-4",
    name: "Delhi Women Helpline",
    category: "women_support",
    phone: "1091",
    address: "Delhi Commission for Women, New Delhi",
    lat: 28.6150,
    lng: 77.2100,
    verified: true
  },
  {
    id: "help-5",
    name: "Dr. Ram Manohar Lohia Hospital",
    category: "hospital",
    phone: "+91 11 2336 5525",
    address: "Baba Kharak Singh Marg, Connaught Place, New Delhi",
    lat: 28.6241,
    lng: 77.2014,
    verified: true
  },
  {
    id: "help-6",
    name: "Safdarjung Fire Station",
    category: "fire",
    phone: "101",
    address: "Safdarjung Enclave, New Delhi",
    lat: 28.5684,
    lng: 77.2057,
    verified: true
  }
];

// Lazy Gemini API Client Initialization helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or is the default placeholder. Please set a valid key in the Settings > Secrets panel of the AI Studio UI.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// --- API Endpoints ---

// Suspicious Message Checker using Gemini
app.post('/api/gemini/analyze-message', async (req, res) => {
  try {
    const { message, language } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: "Message content cannot be empty." });
    }

    const client = getGeminiClient();
    
    const prompt = `
      You are an expert Cyber Security analyst specializing in scams, phishing links, online harassment, threat detection, and fake social profiles.
      Analyze the following suspicious message and provide a structured security evaluation.
      Do NOT claim 100% certainty or write alarmist clickbait. Be factual, explain the warning signs clearly, and give actionable safety advice.
      The output must be returned in the requested language (either English, Hindi, or Haryanvi). If Hindi or Haryanvi is requested, use Devanagari script.
      
      Suspicious Message to analyze:
      "${message}"
      
      Requested Language: ${language || 'English'}
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { 
              type: Type.STRING, 
              description: "Must be exactly: 'Low Risk', 'Medium Risk', or 'High Risk'" 
            },
            warningSigns: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of exact elements that look suspicious or untrustworthy (e.g., sense of urgency, fake URLs, requesting UPI pins, etc.)"
            },
            explanation: { 
              type: Type.STRING, 
              description: "Detailed, objective explanation of what this message could represent, in the chosen language."
            },
            actionSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Step-by-step immediate safe recommendations for the user (e.g. do not click, block sender, report on 1930, etc.)"
            }
          },
          required: ["riskLevel", "warningSigns", "explanation", "actionSteps"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content generated by Gemini.");
    }
    
    const result = JSON.parse(text.trim());
    res.json(result);

  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({ 
      error: error.message || "Something went wrong during cyber analysis.",
      fallback: {
        riskLevel: "Medium/High Risk (Unverified)",
        warningSigns: [
          "Urgency markers or link redirects",
          "Unverified source contacting you unexpectedly"
        ],
        explanation: `Unable to run live AI check: ${error.message}. Please notice if this message asks for money, OTPs, password resets, bank info, or threatens legal actions.`,
        actionSteps: [
          "Do NOT click any links or download attachments.",
          "Do NOT share OTPs, UPI PINs, or bank card details.",
          "Report immediately on cybercrime.gov.in or call Helpline 1930.",
          "Verify the sender independently through official directories."
        ]
      }
    });
  }
});

// Active emergency triggers (SOS tracking)
app.get('/api/active-alerts', (req, res) => {
  res.json(activeAlerts);
});

app.post('/api/active-alerts', (req, res) => {
  const { userName, phone, lat, lng, battery, type, message, evidenceRecorded, evidenceType } = req.body;
  const newAlert = {
    id: "alert-" + Date.now(),
    timestamp: new Date().toISOString(),
    userName: userName || "Anonymous User",
    phone: phone || "Unspecified",
    lat: Number(lat) || 28.6139,
    lng: Number(lng) || 77.2090,
    battery: Number(battery) || 100,
    status: "active_emergency",
    type: type || "SOS Button Pressed",
    evidenceRecorded: !!evidenceRecorded,
    evidenceType: evidenceType || 'audio',
    message: message || "EMERGENCY: SOS Alert Triggered."
  };
  activeAlerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

app.post('/api/active-alerts/resolve/:id', (req, res) => {
  const { id } = req.params;
  const alertIndex = activeAlerts.findIndex(a => a.id === id);
  if (alertIndex !== -1) {
    activeAlerts[alertIndex].status = "resolved";
    res.json({ success: true, alert: activeAlerts[alertIndex] });
  } else {
    res.status(404).json({ error: "Alert not found." });
  }
});

// Reports database API
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const { type, description, lat, lng, battery, evidenceType, evidenceUrl } = req.body;
  const newReport = {
    id: "rep-" + Date.now(),
    timestamp: new Date().toISOString(),
    type: type || "General Alert",
    description: description || "No description provided.",
    lat: Number(lat) || 28.6139,
    lng: Number(lng) || 77.2090,
    battery: Number(battery) || 100,
    evidenceType: evidenceType || "none",
    evidenceUrl: evidenceUrl || null,
    status: "submitted"
  };
  reports.unshift(newReport);
  res.status(201).json(newReport);
});

// Help Directory API
app.get('/api/help-directory', (req, res) => {
  res.json(helpDirectory);
});

app.post('/api/help-directory', (req, res) => {
  const { name, category, phone, address, lat, lng, verified } = req.body;
  if (!name || !category || !phone) {
    return res.status(400).json({ error: "Name, category, and phone are required." });
  }
  const newItem = {
    id: "help-" + Date.now(),
    name,
    category,
    phone,
    address: address || "No address entered",
    lat: Number(lat) || 28.6139,
    lng: Number(lng) || 77.2090,
    verified: verified !== undefined ? !!verified : true
  };
  helpDirectory.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/api/help-directory/:id', (req, res) => {
  const { id } = req.params;
  const index = helpDirectory.findIndex(item => item.id === id);
  if (index !== -1) {
    const deleted = helpDirectory.splice(index, 1);
    res.json({ success: true, deleted: deleted[0] });
  } else {
    res.status(404).json({ error: "Directory item not found." });
  }
});

// --- Server & Vite integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  YASH HUMAN RAKSHA backend listening on port ${PORT}`);
    console.log(`  Dev Environment: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

startServer();
