import { create } from 'zustand';

export interface SlideData {
  slideNumber: number;
  title: string;
  headline: string;
  bulletPoints: string[];
  keyMetricOrTip: string;
}

export interface DeckData {
  startupName: string;
  oneLiner: string;
  slides: SlideData[];
}

export interface QnA {
  question: string;
  founderAnswer?: string;
  score?: number;
  feedback?: string;
}

interface PitchState {
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  deckData: DeckData | null;
  qnaHistory: QnA[];
  
  setFormData: (data: { startupName: string; problem: string; solution: string; targetMarket: string }) => void;
  setDeckData: (data: DeckData) => void;
  addQnA: (qna: QnA) => void;
  updateLastAnswer: (answer: string) => void;
  updateLastScore: (score: number, feedback: string) => void;
}

export const usePitchStore = create<PitchState>((set) => ({
  startupName: '',
  problem: '',
  solution: '',
  targetMarket: '',
  deckData: null,
  qnaHistory: [],
  
  setFormData: (data) => set({ ...data }),
  setDeckData: (data) => set({ deckData: data }),
  addQnA: (qna) => set((state) => ({ qnaHistory: [...state.qnaHistory, qna] })),
  updateLastAnswer: (answer) => set((state) => {
    const newHistory = [...state.qnaHistory];
    if (newHistory.length > 0) {
      newHistory[newHistory.length - 1].founderAnswer = answer;
    }
    return { qnaHistory: newHistory };
  }),
  updateLastScore: (score, feedback) => set((state) => {
    const newHistory = [...state.qnaHistory];
    if (newHistory.length > 0) {
      newHistory[newHistory.length - 1].score = score;
      newHistory[newHistory.length - 1].feedback = feedback;
    }
    return { qnaHistory: newHistory };
  }),
}));
