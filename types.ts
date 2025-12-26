
export type ParticipantType = 'STUDENT' | 'TEACHER';

export interface Participant {
  id: string | number; // 1-38 or 'teacher'
  name: string;
  isParticipating: boolean;
  hasDrawn: boolean;
  type: ParticipantType;
  giftReceived?: number | null;
}

export interface Gift {
  id: number;
  isTaken: boolean;
  ownerId?: string | number | null;
}

export interface HistoryItem {
  id: string;
  drawerId: string | number;
  drawerName: string;
  giftId: number;
  timestamp: Date;
}

export type GameState = 'SETUP' | 'PLAYING' | 'FINISHED';
