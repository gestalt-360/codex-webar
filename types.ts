

export interface Hotspot {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  targetSceneId?: string;
}

export interface Scene {
  id: string;
  name: string;
  panoramaUrl: string;
  hotspots: Hotspot[];
}

// Added ChatMessage interface to fix the exported member error in services/geminiService.ts
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
