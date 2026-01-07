
import { SubtitleItem } from '../types';

export const parseSRT = (content: string): SubtitleItem[] => {
  const blocks = content.trim().split(/\r?\n\r?\n/);
  return blocks.map((block) => {
    const lines = block.split(/\r?\n/);
    const index = parseInt(lines[0]);
    const timeMatch = lines[1]?.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
    
    if (!timeMatch) return null;

    const originalText = lines.slice(2).join('\n');

    // Use explicit type annotation to avoid narrow type inference for the status property
    const item: SubtitleItem = {
      index,
      startTime: timeMatch[1],
      endTime: timeMatch[2],
      originalText,
      status: 'pending'
    };
    return item;
  }).filter((item): item is SubtitleItem => item !== null);
};

export const generateSRT = (items: SubtitleItem[], mode: 'bilingual' | 'chinese-only'): string => {
  return items.map((item) => {
    const text = mode === 'bilingual' 
      ? `${item.translatedText}\n${item.originalText}` 
      : item.translatedText;
    
    return `${item.index}\n${item.startTime} --> ${item.endTime}\n${text}\n`;
  }).join('\n');
};
