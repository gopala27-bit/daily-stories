
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  synced: boolean;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: string[]; // ISO Dates
  streak: number;
}

export type AppView = 'notes' | 'habits' | 'ai' | 'settings';

export interface AIInsight {
  summary: string;
  suggestions: string[];
}
