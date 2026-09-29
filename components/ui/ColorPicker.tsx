import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SPACING, RADIUS, NEON_PALETTE, TOUCH_TARGET } from '../../constants/theme';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
  columns?: number;
}

/** Flat swatch grid for picking a custom category accent color. */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelect,
  columns = 5,
}) => {
  const rows: string[][] = [];
  for (let i = 0; i < NEON_PALETTE.length; i += columns) {
    rows.push(NEON_PALETTE.slice(i, i + columns));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <Pressable
                key={color}
                onPress={() => onSelect(color)}
                accessibilityLabel={`Select color ${color}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.swatch,
                  {
                    backgroundColor: color,
                    borderWidth: isSelected ? 3 : 0,
                    borderColor: '#111114',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    minWidth: TOUCH_TARGET.minimum - 8,
    minHeight: TOUCH_TARGET.minimum - 8,
  },
});
