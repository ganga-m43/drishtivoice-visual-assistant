import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { speakText, stopSpeaking } from "@/services/speech";

export type LanguageCode =
  | "en-IN"
  | "hi-IN"
  | "kn-IN"
  | "ta-IN"
  | "te-IN"
  | "ml-IN"
  | "mr-IN"
  | "bn-IN";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  samplePhrase: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en-IN", name: "English", nativeName: "English (India)", samplePhrase: "Welcome to DrishtiVoice. I can describe your surroundings and read printed text." },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", samplePhrase: "दृष्टिवॉइस में आपका स्वागत है। मैं आपके आसपास की चीज़ों का वर्णन कर सकता हूँ।" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", samplePhrase: "ದೃಷ್ಟಿವಾಯ್ಸ್‌ಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ವಿವರಗಳನ್ನು ನಾನು ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸಬಲ್ಲೆ." },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", samplePhrase: "திருஷ்டிவாய்ஸுக்கு வரவேற்கிறோம். உங்கள் சுற்றுப்புறத்தை நான் விவரிக்க முடியும்." },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు", samplePhrase: "దృష్టివాయిస్‌కు స్వాగతం. మీ చుట్టుపక్కల ఉన్న వాటిని నేను వివరించగలను." },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", samplePhrase: "ദൃഷ്ടിവോയ്‌സിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ ചുറ്റുപാടുകൾ എനിക്ക് വിവരിക്കാൻ കഴിയും." },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी", samplePhrase: "दृष्टिव्हॉईसमध्ये आपले स्वागत आहे. मी तुमच्या सभोवतालचे वर्णन करू शकतो." },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা", samplePhrase: "দৃষ্টিভয়েসে স্বাগতম। আমি আপনার চারপাশের পরিবেশ বর্ণনা করতে পারি।" },
];

export type TextSize = "small" | "medium" | "large" | "xlarge";

export interface LanguagePreferences {
  speakingLanguage: LanguageCode;
  responseLanguage: LanguageCode;
  autoDetect: boolean;
  mixedLanguage: boolean;
}

export interface AccessibilityPreferences {
  textSize: TextSize;
  highContrast: boolean;
  voiceSpeed: number;
  voiceVolume: number;
  audioInstructions: boolean;
  reduceAnimations: boolean;
  preferredVoiceURI: string;
}

export interface ConversationEntry {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  source: "voice" | "camera";
  isDemo: boolean;
}

const DEFAULT_LANGUAGES: LanguagePreferences = {
  speakingLanguage: "en-IN",
  responseLanguage: "en-IN",
  autoDetect: true,
  mixedLanguage: true,
};

const DEFAULT_ACCESSIBILITY: AccessibilityPreferences = {
  textSize: "medium",
  highContrast: false,
  voiceSpeed: 1,
  voiceVolume: 1,
  audioInstructions: true,
  reduceAnimations: false,
  preferredVoiceURI: "",
};

function createInitialSampleHistory(): ConversationEntry[] {
  return [
    { id: "sample-1", question: "What is in front of me?", answer: "There is a wooden table in front of you. A water bottle is on the right side and a plant is on the left.", timestamp: "Today, 9:40 AM", source: "voice", isDemo: true },
    { id: "sample-2", question: "Read the expiry date on this medicine strip.", answer: "Paracetamol 500 mg Tablets. Take one tablet after meals as directed. Expiry date: 08/2027.", timestamp: "Today, 8:15 AM", source: "camera", isDemo: true },
    { id: "sample-3", question: "Where did I keep my eyeglasses?", answer: "Your eyeglasses appear near the front-left corner of the table, next to a spiral notebook.", timestamp: "Yesterday, 6:30 PM", source: "camera", isDemo: true },
    { id: "sample-4", question: "Identify the currency note I am holding.", answer: "This appears to be a 500-rupee Indian currency note, folded once lengthwise.", timestamp: "Yesterday, 2:10 PM", source: "voice", isDemo: true },
  ];
}

const STORAGE_KEYS = {
  languages: "drishtivoice_languages_v1",
  accessibility: "drishtivoice_accessibility_v1",
  history: "drishtivoice_history_v1",
};

interface DrishtiContextValue {
  setupOpen: boolean;
  setSetupOpen: (open: boolean) => void;
  languages: LanguagePreferences;
  updateLanguages: (patch: Partial<LanguagePreferences>) => void;
  accessibility: AccessibilityPreferences;
  updateAccessibility: (patch: Partial<AccessibilityPreferences>) => void;
  history: ConversationEntry[];
  addHistoryEntry: (entry: Omit<ConversationEntry, "id" | "timestamp">) => void;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  isSpeaking: boolean;
  speak: (text: string, langOverride?: LanguageCode) => void;
  stopSpeech: () => void;
  announce: (message: string, priority?: "polite" | "assertive") => void;
  currentLanguageMeta: LanguageOption;
}

const DrishtiContext = createContext<DrishtiContextValue | null>(null);

export function DrishtiProvider({ children }: { children: ReactNode }) {
  const [setupOpen, setSetupOpen] = useState(false);
  const [languages, setLanguages] = useState<LanguagePreferences>(DEFAULT_LANGUAGES);
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(DEFAULT_ACCESSIBILITY);
  const [history, setHistory] = useState<ConversationEntry[]>(() => createInitialSampleHistory());
  const [hydrated, setHydrated] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [politeAnnouncement, setPoliteAnnouncement] = useState("");
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState("");

  useEffect(() => {
    try {
      setSetupOpen(localStorage.getItem("drishtivoice_setup_v1") === null);
      const savedLang = localStorage.getItem(STORAGE_KEYS.languages);
      if (savedLang) setLanguages({ ...DEFAULT_LANGUAGES, ...JSON.parse(savedLang) });
      const savedA11y = localStorage.getItem(STORAGE_KEYS.accessibility);
      if (savedA11y) setAccessibility({ ...DEFAULT_ACCESSIBILITY, ...JSON.parse(savedA11y) });
      const savedHistory = localStorage.getItem(STORAGE_KEYS.history);
      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Ignore malformed storage
      setSetupOpen(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.setAttribute("data-text-size", accessibility.textSize);
    root.classList.toggle("high-contrast", accessibility.highContrast);
    root.classList.toggle("reduce-motion", accessibility.reduceAnimations);
    try {
      localStorage.setItem(STORAGE_KEYS.accessibility, JSON.stringify(accessibility));
    } catch {
      // Ignore storage quota errors
    }
  }, [accessibility, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.languages, JSON.stringify(languages));
    } catch {
      // Ignore storage quota errors
    }
  }, [languages, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch {
      // Ignore storage quota errors
    }
  }, [history, hydrated]);

  const updateLanguages = useCallback((patch: Partial<LanguagePreferences>) => {
    setLanguages((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateAccessibility = useCallback((patch: Partial<AccessibilityPreferences>) => {
    setAccessibility((prev) => ({ ...prev, ...patch }));
  }, []);

  const addHistoryEntry = useCallback((entry: Omit<ConversationEntry, "id" | "timestamp">) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const newEntry: ConversationEntry = {
      ...entry,
      id: `conv-${Date.now()}`,
      timestamp: `Today, ${timeStr}`,
    };
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

  const deleteHistoryEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const stopSpeech = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, langOverride?: LanguageCode) => {
      speakText(text, {
        lang: langOverride ?? languages.responseLanguage,
        rate: accessibility.voiceSpeed,
        volume: accessibility.voiceVolume,
        ...(accessibility.preferredVoiceURI
          ? { voiceURI: accessibility.preferredVoiceURI }
          : {}),
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [
      languages.responseLanguage,
      accessibility.voiceSpeed,
      accessibility.voiceVolume,
      accessibility.preferredVoiceURI,
    ],
  );

  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      setAssertiveAnnouncement("");
      queueMicrotask(() => setAssertiveAnnouncement(message));
    } else {
      setPoliteAnnouncement("");
      queueMicrotask(() => setPoliteAnnouncement(message));
    }
  }, []);

  const currentLanguageMeta = useMemo(
    () =>
      SUPPORTED_LANGUAGES.find((l) => l.code === languages.speakingLanguage) ??
      { code: "en-IN", name: "English", nativeName: "English (India)", samplePhrase: "Welcome to DrishtiVoice." } as LanguageOption,
    [languages.speakingLanguage],
  );

  const value = useMemo<DrishtiContextValue>(
    () => ({
      setupOpen,
      setSetupOpen,
      languages,
      updateLanguages,
      accessibility,
      updateAccessibility,
      history,
      addHistoryEntry,
      deleteHistoryEntry,
      clearHistory,
      isSpeaking,
      speak,
      stopSpeech,
      announce,
      currentLanguageMeta,
    }),
    [
      setupOpen,
      languages,
      updateLanguages,
      accessibility,
      updateAccessibility,
      history,
      addHistoryEntry,
      deleteHistoryEntry,
      clearHistory,
      isSpeaking,
      speak,
      stopSpeech,
      announce,
      currentLanguageMeta,
    ],
  );

  return (
    <DrishtiContext.Provider value={value}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {politeAnnouncement}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {assertiveAnnouncement}
      </div>
    </DrishtiContext.Provider>
  );
}

export function useDrishti() {
  const ctx = useContext(DrishtiContext);
  if (!ctx) throw new Error("useDrishti must be used inside DrishtiProvider");
  return ctx;
}