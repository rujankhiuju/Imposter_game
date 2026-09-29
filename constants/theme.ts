// ---------------------------------------------------------------------------
// Design tokens — Imposter Who? inspired: light, playful, flat, emoji-driven.
// Two palettes (light is default) share one shape; useTheme() picks one.
// ---------------------------------------------------------------------------

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  /** Lime accent used for primary CTAs and highlights. */
  primary: string;
  /** Text/icon color placed on top of {primary}. */
  primaryText: string;
  primaryPressed: string;
  /** Solid pill button (black in light theme, white in dark theme). */
  pillBg: string;
  pillText: string;
  /** Rounded name chips / soft fills. */
  chipBg: string;
  white: string;
  black: string;
  danger: string;
  success: string;
  warning: string;
  /** Solid reveal card backgrounds (stay pastel in both themes). */
  revealCivilian: string;
  revealImposter: string;
  /** Text color used on top of reveal cards. */
  onReveal: string;
}

export const LIGHT_COLORS: ThemeColors = {
  background: '#F2F2F4',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E6E6EC',
  borderLight: '#DDDDE4',
  textPrimary: '#111114',
  textSecondary: '#55555F',
  textMuted: '#8E8E99',
  primary: '#C6F73D',
  primaryText: '#111114',
  primaryPressed: '#B2E42E',
  pillBg: '#111114',
  pillText: '#FFFFFF',
  chipBg: '#ECECF1',
  white: '#FFFFFF',
  black: '#111114',
  danger: '#E53935',
  success: '#16A34A',
  warning: '#F59E0B',
  revealCivilian: '#6FE9DE',
  revealImposter: '#F9A8C4',
  onReveal: '#111114',
};

export const DARK_COLORS: ThemeColors = {
  background: '#0E0E13',
  surface: '#1A1A22',
  surfaceElevated: '#242430',
  border: '#2E2E3A',
  borderLight: '#3A3A48',
  textPrimary: '#F5F5F7',
  textSecondary: '#A6A6B5',
  textMuted: '#6E6E7E',
  primary: '#C6F73D',
  primaryText: '#111114',
  primaryPressed: '#B2E42E',
  pillBg: '#FFFFFF',
  pillText: '#111114',
  chipBg: '#26262F',
  white: '#FFFFFF',
  black: '#111114',
  danger: '#FF6B6B',
  success: '#4ADE80',
  warning: '#FBBF24',
  revealCivilian: '#6FE9DE',
  revealImposter: '#F9A8C4',
  onReveal: '#111114',
};

/** @deprecated Legacy alias kept so unmigrated code still typechecks. */
export const COLORS = LIGHT_COLORS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  fontFamily: {
    /** Heavy uppercase display font (logo, big titles). */
    display: 'ArchivoBlack_400Regular',
    heading: 'SpaceGrotesk_700Bold',
    headingMedium: 'SpaceGrotesk_600SemiBold',
    body: 'System',
    bodyMedium: 'System',
    mono: 'SpaceMono_400Regular',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
    xxxl: 48,
    display: 64,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const TOUCH_TARGET = {
  minimum: 48,
  comfortable: 56,
  large: 64,
};

export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  flip: 600,
  stagger: 80,
};

/** Accent colors offered when creating a custom category. */
export const NEON_PALETTE = [
  '#FF006E',
  '#FFBE0B',
  '#8338EC',
  '#06D6A0',
  '#118AB2',
  '#FF6B6B',
  '#4ECDC4',
  '#FFD166',
  '#C44DFF',
  '#00D4AA',
];

export const CARD = {
  width: 340,
  height: 480,
  maxWidth: 360,
  maxHeight: 500,
  borderRadius: 24,
};

export const TIMER_RING = {
  size: 280,
  strokeWidth: 12,
  maxSize: 320,
};

export const BUILTIN_CATEGORIES = [
  {
    id: 'movies',
    name: 'Movies',
    emoji: '🎬',
    neonColor: '#FF006E',
    hintPrefix: "It's a film...",
    words: [
      'Inception', 'The Matrix', 'Parasite', 'Interstellar', 'Pulp Fiction',
      'The Godfather', 'Fight Club', 'The Dark Knight', 'Forrest Gump', 'Titanic',
      'Avatar', 'Gladiator', 'The Shawshank Redemption', 'Goodfellas', 'The Silence of the Lambs',
      'Se7en', 'The Usual Suspects', 'Saving Private Ryan', 'The Green Mile', 'Jurassic Park',
      'Back to the Future', 'The Terminator', 'Alien', 'Blade Runner', 'The Prestige',
    ],
    isCustom: false,
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍔',
    neonColor: '#FFBE0B',
    hintPrefix: "It's something you eat...",
    words: [
      'Sushi', 'Tacos', 'Ramen', 'Croissant', 'Pizza',
      'Burger', 'Pad Thai', 'Dim Sum', 'Paella', 'Tiramisu',
      'Curry', 'Bibimbap', 'Pho', 'Empanadas', 'Gelato',
      'Waffles', 'Dumplings', 'Ceviche', 'Ratatouille', 'Churros',
      'Baklava', 'Gnocchi', 'Shawarma', 'Poutine', 'Cheesecake',
    ],
    isCustom: false,
  },
  {
    id: 'celebrities',
    name: 'Celebrities',
    emoji: '🌟',
    neonColor: '#8338EC',
    hintPrefix: "They're famous for...",
    words: [
      'Taylor Swift', 'Keanu Reeves', 'Beyoncé', 'Leonardo DiCaprio', 'Tom Hanks',
      'Meryl Streep', 'Brad Pitt', 'Jennifer Lawrence', 'Robert Downey Jr.', 'Scarlett Johansson',
      'Dwayne Johnson', 'Emma Watson', 'Chris Evans', 'Zendaya', 'Ryan Reynolds',
      'Margot Robbie', 'Michael B. Jordan', 'Florence Pugh', 'Timothée Chalamet', 'Anya Taylor-Joy',
    ],
    isCustom: false,
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    neonColor: '#06D6A0',
    hintPrefix: "It's a creature...",
    words: [
      'Penguin', 'Octopus', 'Red Panda', 'Axolotl', 'Narwhal',
      'Sloth', 'Quokka', 'Fennec Fox', 'Mantis Shrimp', 'Capybara',
      'Platypus', 'Snow Leopard', 'Blue Whale', 'Hummingbird', 'Chameleon',
      'Arctic Fox', 'Sea Turtle', 'Elephant', 'Tiger', 'Dolphin',
    ],
    isCustom: false,
  },
  {
    id: 'places',
    name: 'Places',
    emoji: '🗺️',
    neonColor: '#118AB2',
    hintPrefix: "It's a location...",
    words: [
      'Tokyo', 'Paris', 'Machu Picchu', 'Santorini', 'New York City',
      'Dubai', 'Rome', 'Bali', 'Iceland', 'Venice',
      'Barcelona', 'Kyoto', 'Marrakech', 'Rio de Janeiro', 'Sydney',
      'Prague', 'Cape Town', 'Banff', 'Petra', 'Maldives',
    ],
    isCustom: false,
  },
  {
    id: 'books',
    name: 'Books',
    emoji: '📚',
    neonColor: '#FF6B6B',
    hintPrefix: "It's a book...",
    words: [
      '1984', 'To Kill a Mockingbird', 'The Great Gatsby', 'Harry Potter', 'The Hobbit',
      'Pride and Prejudice', 'The Catcher in the Rye', 'Lord of the Rings', 'Dune', 'Sapiens',
      'The Alchemist', 'Atomic Habits', 'Educated', 'Becoming', 'The Subtle Art',
      'Thinking Fast and Slow', 'The Power of Now', 'Outliers', 'Grit', 'Mindset',
    ],
    isCustom: false,
  },
  {
    id: 'brands',
    name: 'Brands',
    emoji: '🏷️',
    neonColor: '#4ECDC4',
    hintPrefix: "It's a brand...",
    words: [
      'Apple', 'Nike', 'Tesla', 'Coca-Cola', 'Google',
      'Amazon', 'Microsoft', 'Disney', 'Netflix', 'Spotify',
      'Adidas', 'Samsung', 'Sony', 'BMW', 'Mercedes',
      'Louis Vuitton', 'Gucci', 'Rolex', 'Ferrari', 'Lego',
    ],
    isCustom: false,
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    neonColor: '#FFD166',
    hintPrefix: "It's a sport...",
    words: [
      'Soccer', 'Basketball', 'Tennis', 'Swimming', 'Golf',
      'Boxing', 'Skiing', 'Surfing', 'Climbing', 'Cycling',
      'Running', 'Yoga', 'Football', 'Baseball', 'Hockey',
      'Volleyball', 'Rugby', 'Cricket', 'Skateboarding', 'Gymnastics',
    ],
    isCustom: false,
  },
  {
    id: 'music',
    name: 'Music',
    emoji: '🎵',
    neonColor: '#C44DFF',
    hintPrefix: "It's music-related...",
    words: [
      'Guitar', 'Piano', 'Drums', 'Violin', 'Saxophone',
      'Concert', 'Festival', 'Album', 'Symphony', 'Jazz',
      'Rock', 'Pop', 'Hip Hop', 'Classical', 'Electronic',
      'Opera', 'Broadway', 'Karaoke', 'DJ', 'Vinyl',
    ],
    isCustom: false,
  },
  {
    id: 'historical',
    name: 'Historical Figures',
    emoji: '🏛️',
    neonColor: '#00D4AA',
    hintPrefix: "They made history...",
    words: [
      'Einstein', 'Cleopatra', 'Da Vinci', 'Napoleon', 'Shakespeare',
      'Newton', 'Galileo', 'Marie Curie', 'Lincoln', 'Gandhi',
      'Mandela', 'Churchill', 'Tesla', 'Darwin', 'Mozart',
      'Michelangelo', 'Columbus', 'Marco Polo', 'Joan of Arc', 'Alexander',
    ],
    isCustom: false,
  },
];

export type Category = typeof BUILTIN_CATEGORIES[number];
