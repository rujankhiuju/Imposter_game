import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredSettings } from '../types';

const defaultSettings: StoredSettings = {
  enableSounds: false,
  enableHaptics: true,
  enableAccessibility: false,
  firstLaunch: true,
  theme: 'light',
};

type SettingsStore = StoredSettings & {
  setEnableSounds: (value: boolean) => void;
  setEnableHaptics: (value: boolean) => void;
  setEnableAccessibility: (value: boolean) => void;
  setFirstLaunch: (value: boolean) => void;
  setTheme: (value: 'light' | 'dark') => void;
  resetSettings: () => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setEnableSounds: (enableSounds) => set({ enableSounds }),
      setEnableHaptics: (enableHaptics) => set({ enableHaptics }),
      setEnableAccessibility: (enableAccessibility) => set({ enableAccessibility }),
      setFirstLaunch: (firstLaunch) => set({ firstLaunch }),
      setTheme: (theme) => set({ theme }),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'imposter-settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);