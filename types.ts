export interface ComedianProfile {
  id: string;
  name: string;
  styleDescription: string;
  avatarColor: string;
  isCustom?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  audioData?: string; // Base64 audio
  sources?: { uri: string; title: string }[];
}

export interface GenerationConfig {
  topic: string;
  selectedProfileId: string;
  customKnowledge: string; // The "logic" or "transcripts" user pastes
  useWebSearch: boolean; // To "collect data from global sites"
}