import { useCategoryStore } from '../store/categoryStore';
import { useGameStore } from '../store/gameStore';

export interface PickedWord {
  word: string;
  hint: string;
  categoryId: string;
}

export const useWordPicker = () => {
  const {
    settings,
    usedWords,
    addUsedWord,
    setSecretWord,
    setCategoryHint,
    setSecretCategoryId,
  } = useGameStore();

  /**
   * Merged word pool across every selected category.
   * Missing categories and empty categories are skipped, and duplicate
   * words across categories are deduped (case-insensitive, first wins).
   * Each entry keeps the category it came from.
   */
  const getWordPool = (): { word: string; categoryId: string }[] => {
    const { categories, getAllWords } = useCategoryStore.getState();
    const seen = new Set<string>();
    const pool: { word: string; categoryId: string }[] = [];

    for (const categoryId of settings.categoryIds) {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) continue;
      for (const word of getAllWords(categoryId)) {
        const key = word.trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        pool.push({ word, categoryId });
      }
    }
    return pool;
  };

  /**
   * Picks the round's secret word from the merged pool.
   * Returns null when no words exist at all — callers must block the game
   * instead of indexing an empty array.
   */
  const pickWord = (): PickedWord | null => {
    const pool = getWordPool();
    const available = pool.filter((entry) => !usedWords.includes(entry.word));
    // Every word already used this session — reshuffle from the full pool.
    const candidates = available.length > 0 ? available : pool;
    if (candidates.length === 0) return null;

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    const category = useCategoryStore.getState().getCategory(picked.categoryId);
    // One shared hint for the round, drawn from the picked word's own
    // category — civilians see it under the word and the imposter gets
    // the exact same line, so it always stays related to the word.
    const lines = category?.hints?.length ? category.hints : [category?.hintPrefix ?? 'It is something...'];
    const hint = lines[Math.floor(Math.random() * lines.length)];

    addUsedWord(picked.word);
    setSecretWord(picked.word);
    setCategoryHint(hint);
    setSecretCategoryId(picked.categoryId);

    return { word: picked.word, hint, categoryId: picked.categoryId };
  };

  return { getWordPool, pickWord };
};
