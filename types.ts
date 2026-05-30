export interface ReactionConditions {
  metal_precursor: string;
  organic_linker: string;
  modulator: string | null;
  solvent: string;
  metal_concentration_mM: number;
  M_L_ratio: number;
  temperature_C: number;
  time_h: number | null;
  doi?: string;
  article_trial_or_failure_notes?: string;
}

export interface QuizQuestion extends ReactionConditions {
  id: string;
  isSuccess: boolean;
}

export type GameState = 'intro' | 'demo' | 'playing' | 'results' | 'submitted' | 'admin';

export interface UserResult {
  email: string;
  yearsOfExperience: string;
  score: number;
  totalQuestions: number;
  timestamp: string;
  questionIds: string[];
  answers: Record<string, string>; // { questionId: "Likely Success" }
  detailedTranscript: string;
}

export interface LocalRecord {
  id: string;
  timestamp: string;
  email: string;
  synced: boolean; // true if successfully sent to Google Script
  data: UserResult;
}