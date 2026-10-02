import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GameSettings, Player, GamePhase } from '../types';
import { GAME_CONSTANTS } from '../constants/game';

const initialSettings: GameSettings = {
  playerCount: GAME_CONSTANTS.DEFAULT_PLAYER_COUNT,
  imposterCount: GAME_CONSTANTS.DEFAULT_IMPOSTER_COUNT,
  categoryIds: ['movies'],
  roundTimerSeconds: GAME_CONSTANTS.DEFAULT_TIMER_SECONDS,
  enableSounds: false,
  enableHaptics: true,
  enableAccessibility: false,
};

const createInitialPlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Player ${i + 1}`,
    role: 'civilian' as const,
    votesReceived: 0,
    hasVoted: false,
    roundScore: 0,
    totalScore: 0,
  }));

const initialState: GameState = {
  settings: initialSettings,
  players: createInitialPlayers(initialSettings.playerCount),
  currentPlayerIndex: 0,
  phase: 'setup',
  round: 1,
  secretWord: '',
  categoryHint: '',
  secretCategoryId: '',
  usedWords: [],
};

type GameStore = GameState & {
  setSettings: (settings: Partial<GameSettings>) => void;
  setPhase: (phase: GamePhase) => void;
  setPlayers: (players: Player[]) => void;
  updatePlayer: (id: number, updates: Partial<Player>) => void;
  setCurrentPlayerIndex: (index: number) => void;
  setRound: (round: number) => void;
  setSecretWord: (word: string) => void;
  setCategoryHint: (hint: string) => void;
  setSecretCategoryId: (categoryId: string) => void;
  addUsedWord: (word: string) => void;
  resetGame: () => void;
  resetSession: () => void;
  assignRoles: () => void;
  incrementVotes: (targetId: number) => void;
  setVote: (voterId: number, targetId: number) => void;
  calculateScores: () => void;
  nextPlayer: () => boolean;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSettings: (settings) =>
        set((state) => {
          const newPlayerCount = settings.playerCount ?? state.settings.playerCount;
          const newSettings = { ...state.settings, ...settings };
          let newPlayers = state.players;

          if (newPlayerCount !== state.settings.playerCount) {
            if (newPlayerCount > state.players.length) {
              const additional = Array.from(
                { length: newPlayerCount - state.players.length },
                (_, i) => ({
                  id: state.players.length + i,
                  name: `Player ${state.players.length + i + 1}`,
                  role: 'civilian' as const,
                  votesReceived: 0,
                  hasVoted: false,
                  roundScore: 0,
                  totalScore: state.players[i]?.totalScore ?? 0,
                })
              );
              newPlayers = [...state.players, ...additional];
            } else {
              newPlayers = state.players.slice(0, newPlayerCount);
            }
          }

          return { settings: newSettings, players: newPlayers };
        }),

      setPhase: (phase) => set({ phase }),

      setPlayers: (players) => set({ players }),

      updatePlayer: (id, updates) =>
        set((state) => ({
          players: state.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      setCurrentPlayerIndex: (currentPlayerIndex) => set({ currentPlayerIndex }),

      setRound: (round) => set({ round }),

      setSecretWord: (secretWord) => set({ secretWord }),

      setCategoryHint: (categoryHint) => set({ categoryHint }),

      setSecretCategoryId: (secretCategoryId) => set({ secretCategoryId }),

      addUsedWord: (word) =>
        set((state) => ({
          usedWords: [...state.usedWords, word],
        })),

      resetGame: () =>
        set((state) => ({
          players: createInitialPlayers(state.settings.playerCount).map((p, i) => ({
            ...p,
            totalScore: state.players[i]?.totalScore ?? 0,
          })),
          currentPlayerIndex: 0,
          phase: 'reveal',
          round: state.round + 1,
          secretWord: '',
          categoryHint: '',
          secretCategoryId: '',
          usedWords: [],
        })),

      resetSession: () =>
        set({
          ...initialState,
          players: createInitialPlayers(initialState.settings.playerCount),
        }),

      assignRoles: () =>
        set((state) => {
          const { playerCount, imposterCount } = state.settings;
          const indices = Array.from({ length: playerCount }, (_, i) => i)
            .sort(() => Math.random() - 0.5)
            .slice(0, imposterCount);

          return {
            players: state.players.map((p, i) => ({
              ...p,
              role: indices.includes(i) ? 'imposter' : 'civilian',
              votesReceived: 0,
              hasVoted: false,
              voteTarget: undefined,
              roundScore: 0,
            })),
            currentPlayerIndex: 0,
          };
        }),

      incrementVotes: (targetId) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === targetId ? { ...p, votesReceived: p.votesReceived + 1 } : p
          ),
        })),

      setVote: (voterId, targetId) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === voterId ? { ...p, hasVoted: true, voteTarget: targetId } : p
          ),
        })),

      calculateScores: () =>
        set((state) => {
          const imposters = state.players.filter((p) => p.role === 'imposter');
          const impostersCaught = imposters.filter((p) => p.votesReceived > 0);
          const imposterWon = impostersCaught.length === 0;

          return {
            players: state.players.map((p) => {
              let roundScore = 0;
              if (p.role === 'imposter') {
                roundScore = imposterWon ? GAME_CONSTANTS.SCORE_IMPOSTER_WIN : 0;
              } else {
                roundScore = imposterWon ? 0 : GAME_CONSTANTS.SCORE_CIVILIAN_WIN;
                const votedForImposter = p.voteTarget && imposters.some((i) => i.id === p.voteTarget);
                if (votedForImposter) {
                  roundScore += GAME_CONSTANTS.SCORE_CORRECT_VOTE_BONUS;
                }
              }
              return {
                ...p,
                roundScore,
                totalScore: p.totalScore + roundScore,
              };
            }),
          };
        }),

      nextPlayer: () => {
        let hasNext = false;
        set((state) => {
          const nextIndex = state.currentPlayerIndex + 1;
          if (nextIndex >= state.players.length) {
            hasNext = false;
            return { currentPlayerIndex: 0, phase: 'discussion' };
          }
          hasNext = true;
          return { currentPlayerIndex: nextIndex };
        });
        return hasNext;
      },
    }),
    {
      name: 'imposter-game-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Tolerate old/corrupt persisted state: migrate the legacy single
      // `categoryId` string to `categoryIds`, validate shapes, and fall back
      // to defaults on anything unreadable instead of crashing.
      merge: (persisted, current) => {
        try {
          const stored = persisted as Partial<GameStore> | undefined;
          if (!stored || typeof stored !== 'object') return current;

          const legacySettings = (stored.settings ?? {}) as Partial<GameSettings> & {
            categoryId?: unknown;
          };
          const rawSelection =
            legacySettings.categoryIds !== undefined
              ? legacySettings.categoryIds
              : legacySettings.categoryId;
          const categoryIds = Array.isArray(rawSelection)
            ? rawSelection.filter((id): id is string => typeof id === 'string' && id.length > 0)
            : typeof rawSelection === 'string' && rawSelection.length > 0
              ? [rawSelection]
              : current.settings.categoryIds;

          const settings: GameSettings = {
            ...current.settings,
            ...legacySettings,
            categoryIds,
          };
          // Drop the removed single-selection field entirely.
          delete (settings as unknown as Record<string, unknown>).categoryId;

          return {
            ...current,
            ...stored,
            settings,
            players: Array.isArray(stored.players) ? stored.players : current.players,
            usedWords: Array.isArray(stored.usedWords) ? stored.usedWords : current.usedWords,
            secretCategoryId:
              typeof stored.secretCategoryId === 'string' ? stored.secretCategoryId : '',
          };
        } catch {
          return current;
        }
      },
      partialize: (state) => ({
        settings: state.settings,
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        phase: state.phase,
        round: state.round,
        secretWord: state.secretWord,
        categoryHint: state.categoryHint,
        secretCategoryId: state.secretCategoryId,
        usedWords: state.usedWords,
      }),
    }
  )
);