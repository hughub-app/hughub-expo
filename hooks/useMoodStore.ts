import { create } from 'zustand';
import type { EmojiType } from '@/components/emoji';

type MoodState = {
  currentEmoji: EmojiType;
  setCurrentEmoji: (emoji: EmojiType) => void;
};

export const useMoodStore = create<MoodState>((set) => ({
  currentEmoji: 'smile',
  setCurrentEmoji: (emoji) => set({ currentEmoji: emoji }),
}));

