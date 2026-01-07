
export interface SubtitleItem {
  index: number;
  startTime: string;
  endTime: string;
  originalText: string;
  translatedText?: string;
  status: 'pending' | 'translating' | 'completed' | 'error';
}

export type TranslationMode = 'bilingual' | 'chinese-only';

export interface TranslationConfig {
  mode: TranslationMode;
  model: string;
}

export interface TranslationProgress {
  total: number;
  completed: number;
  currentChunk: number;
  totalChunks: number;
}
