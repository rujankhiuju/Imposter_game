import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { useSettingsStore } from '../store/settingsStore';

type SoundName = 'flip' | 'timerWarning' | 'voteSubmit' | 'reveal' | 'win' | 'lose';

const SOUND_FILES: Record<SoundName, number> = {
  flip: require('../assets/sounds/flip.mp3'),
  timerWarning: require('../assets/sounds/timer-warning.mp3'),
  voteSubmit: require('../assets/sounds/vote-submit.mp3'),
  reveal: require('../assets/sounds/reveal.mp3'),
  win: require('../assets/sounds/win.mp3'),
  lose: require('../assets/sounds/lose.mp3'),
};

let playerCache: Record<SoundName, AudioPlayer | null> = {
  flip: null,
  timerWarning: null,
  voteSubmit: null,
  reveal: null,
  win: null,
  lose: null,
};

let isLoaded = false;

export const preloadSounds = async (): Promise<void> => {
  if (isLoaded) return;

  try {
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch (error) {
    console.warn('Failed to configure audio mode', error);
  }

  for (const [name, file] of Object.entries(SOUND_FILES)) {
    try {
      const player = createAudioPlayer(file);
      player.volume = 0.7;
      playerCache[name as SoundName] = player;
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error);
    }
  }
  isLoaded = true;
};

export const unloadSounds = async (): Promise<void> => {
  for (const name of Object.keys(playerCache) as SoundName[]) {
    const player = playerCache[name];
    if (player) {
      try {
        player.remove();
      } catch (error) {
        console.warn('Failed to unload sound', error);
      }
      playerCache[name] = null;
    }
  }
  isLoaded = false;
};

export const playSound = async (name: SoundName): Promise<void> => {
  const enableSounds = useSettingsStore.getState().enableSounds;
  if (!enableSounds) return;

  const player = playerCache[name];
  if (player) {
    try {
      await player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn(`Failed to play sound: ${name}`, error);
    }
  }
};

export const useSound = () => {
  const enableSounds = useSettingsStore((s) => s.enableSounds);

  const play = async (name: SoundName) => {
    if (!enableSounds) return;
    await playSound(name);
  };

  return { play, preloadSounds, unloadSounds };
};
