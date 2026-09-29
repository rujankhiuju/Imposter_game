import { useSettingsStore } from '../store/settingsStore';
import { LIGHT_COLORS, DARK_COLORS, ThemeColors } from '../constants/theme';

export type ThemeMode = 'light' | 'dark';

/**
 * Returns the active color palette based on the user's theme setting.
 * Light (Imposter Who? look) is the default.
 */
export const useTheme = (): { colors: ThemeColors; mode: ThemeMode } => {
  const mode = useSettingsStore((s) => s.theme);
  return {
    colors: mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
    mode,
  };
};
