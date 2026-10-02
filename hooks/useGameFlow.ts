import { useGameStore } from '../store/gameStore';
import { useScoreStore } from '../store/scoreStore';
import { useSettingsStore } from '../store/settingsStore';
import { useWordPicker } from './useWordPicker';
import { useHaptics } from './useHaptics';
import { useSound } from './useSound';
import { determineWinner } from '../utils/scoring';
import { validateSettings } from '../utils/validation';

export const useGameFlow = () => {
  const {
    settings,
    players,
    round,
    currentPlayerIndex,
    secretWord,
    categoryHint,
    setPhase,
    setPlayers,
    setCurrentPlayerIndex,
    setRound,
    assignRoles,
    resetGame,
    resetSession,
    calculateScores: storeCalculateScores,
    nextPlayer,
  } = useGameStore();

  const { pickWord, getWordPool } = useWordPicker();
  const { trigger: haptic } = useHaptics();
  const { play: playSound } = useSound();
  const { sessionScores, resetSessionScores, saveGameToHistory } = useScoreStore();
  const { firstLaunch, setFirstLaunch } = useSettingsStore();

  const startGame = (): { valid: boolean; errors: string[] } => {
    const validation = validateSettings(settings);
    if (!validation.valid) {
      return validation;
    }

    // Block start instead of crashing when nothing can be picked.
    const errors: string[] = [];
    if (settings.categoryIds.length === 0) {
      errors.push('Select at least one category');
    } else if (getWordPool().length === 0) {
      errors.push('No words available — add words to the selected categories first');
    }
    if (errors.length > 0) {
      return { valid: false, errors };
    }

    const newPlayers = players.map((p, i) => ({
      ...p,
      id: i,
      name: p.name || `Player ${i + 1}`,
      totalScore: sessionScores[i]?.totalScore ?? 0,
    }));

    setPlayers(newPlayers);
    assignRoles();
    // Fresh game: clear any round-scoped secret left from a previous session.
    useGameStore.setState({
      secretWord: '',
      categoryHint: '',
      secretCategoryId: '',
      usedWords: [],
    });
    setPhase('reveal');
    setCurrentPlayerIndex(0);
    setRound(1);

    return { valid: true, errors: [] };
  };

  const beginReveal = (): { word: string; hint: string; isImposter: boolean } => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) {
      return { word: '', hint: '', isImposter: false };
    }
    const isImposter = currentPlayer.role === 'imposter';

    haptic('medium');
    playSound('flip');

    // Pick the round's secret word once; later reveals reuse it so every
    // civilian shares the same word (and the discussion timer matches).
    const picked = secretWord
      ? { word: secretWord, hint: categoryHint }
      : pickWord();

    if (!picked) {
      // Empty word pool mid-game — show a message instead of crashing.
      return { word: '', hint: 'No words available in the selected categories.', isImposter };
    }

    // Every player gets the same hint line, from the picked word's category.
    return {
      word: isImposter ? '' : picked.word,
      hint: picked.hint,
      isImposter,
    };
  };

  const proceedToNextPlayer = (): boolean => {
    const hasNext = nextPlayer();
    if (!hasNext) {
      haptic('heavy');
      playSound('reveal');
      setPhase('discussion');
    } else {
      haptic('light');
    }
    return hasNext;
  };

  const startDiscussion = () => {
    setPhase('discussion');
  };

  const startVoting = () => {
    setPhase('voting');
  };

  const castVote = (voterId: number, targetId: number) => {
    useGameStore.getState().setVote(voterId, targetId);
    useGameStore.getState().incrementVotes(targetId);
    haptic('light');
    playSound('voteSubmit');
  };

  const finishVoting = () => {
    storeCalculateScores();
    const winner = determineWinner(useGameStore.getState().players);
    
    const updatedPlayers = useGameStore.getState().players;
    const scores: { playerId: number; playerName: string; totalScore: number; roundsPlayed: number }[] =
      updatedPlayers.map((p) => ({
        playerId: p.id,
        playerName: p.name,
        totalScore: p.totalScore,
        roundsPlayed: round,
      }));

    saveGameToHistory(settings, scores, winner);
    
    haptic(winner === 'imposters' ? 'warning' : 'success');
    playSound(winner === 'imposters' ? 'lose' : 'win');
    
    setPhase('results');
  };

  const nextRound = () => {
    resetGame();
    haptic('medium');
  };

  const endParty = () => {
    resetSession();
    resetSessionScores();
    setFirstLaunch(false);
    haptic('heavy');
  };

  const checkFirstLaunch = () => firstLaunch;

  return {
    startGame,
    beginReveal,
    proceedToNextPlayer,
    startDiscussion,
    startVoting,
    castVote,
    finishVoting,
    nextRound,
    endParty,
    checkFirstLaunch,
  };
};