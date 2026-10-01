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
    hints: [
      "It's a film...",
      'You would watch this at a cinema or on a streaming app...',
      'It has actors, a plot, and a director...',
      'It was released on screens sometime...',
    ],
    words: [
      'Inception', 'The Matrix', 'Parasite', 'Interstellar', 'Pulp Fiction',
      'The Godfather', 'Fight Club', 'The Dark Knight', 'Forrest Gump', 'Titanic',
      'Avatar', 'Gladiator', 'The Shawshank Redemption', 'Goodfellas', 'The Silence of the Lambs',
      'Se7en', 'The Usual Suspects', 'Saving Private Ryan', 'The Green Mile', 'Jurassic Park',
      'Back to the Future', 'The Terminator', 'Alien', 'Blade Runner', 'The Prestige',
      'The Lion King', 'Toy Story', 'Finding Nemo', 'Frozen', 'The Incredibles',
      'Spirited Away', 'Amélie', 'Casablanca', 'Rear Window', 'Kill Bill',
      'Mad Max: Fury Road', 'The Grand Budapest Hotel', 'Get Out', 'La La Land', 'Whiplash',
      'Coco',
    ],
    isCustom: false,
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍔',
    neonColor: '#FFBE0B',
    hintPrefix: "It's something you eat...",
    hints: [
      "It's something you eat...",
      'You could order this at a restaurant...',
      'You would find this on a menu...',
      'It might be sweet, salty, or spicy...',
    ],
    words: [
      'Sushi', 'Tacos', 'Ramen', 'Croissant', 'Pizza',
      'Burger', 'Pad Thai', 'Dim Sum', 'Paella', 'Tiramisu',
      'Curry', 'Bibimbap', 'Pho', 'Empanadas', 'Gelato',
      'Waffles', 'Dumplings', 'Ceviche', 'Ratatouille', 'Churros',
      'Baklava', 'Gnocchi', 'Shawarma', 'Poutine', 'Cheesecake',
      'Steak', 'Mac and Cheese', 'Pancakes', 'Falafel', 'Kimchi',
      'Samosa', 'Burrito', 'Fish and Chips', 'Risotto', 'Lasagna',
      'Macarons', 'Pretzel', 'Hummus', 'Tempura', 'Corn on the Cob',
    ],
    isCustom: false,
  },
  {
    id: 'celebrities',
    name: 'Celebrities',
    emoji: '🌟',
    neonColor: '#8338EC',
    hintPrefix: "They're famous for...",
    hints: [
      "They're famous for...",
      'You would recognise them from the screen or the news...',
      'They are a well-known public figure...',
      'Their face has been on a magazine cover...',
    ],
    words: [
      'Taylor Swift', 'Keanu Reeves', 'Beyoncé', 'Leonardo DiCaprio', 'Tom Hanks',
      'Meryl Streep', 'Brad Pitt', 'Jennifer Lawrence', 'Robert Downey Jr.', 'Scarlett Johansson',
      'Dwayne Johnson', 'Emma Watson', 'Chris Evans', 'Zendaya', 'Ryan Reynolds',
      'Margot Robbie', 'Michael B. Jordan', 'Florence Pugh', 'Timothée Chalamet', 'Anya Taylor-Joy',
      'Tom Cruise', 'Angelina Jolie', 'Johnny Depp', 'Jackie Chan', 'Julia Roberts',
      'Matt Damon', 'Hugh Jackman', 'Natalie Portman', 'Sandra Bullock', 'Charlize Theron',
      'Cate Blanchett', 'Adele', 'Ed Sheeran', 'MrBeast', 'Cillian Murphy',
      'Pedro Pascal', 'Selena Gomez', 'Eminem', 'Rihanna', 'Katy Perry',
    ],
    isCustom: false,
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    neonColor: '#06D6A0',
    hintPrefix: "It's a creature...",
    hints: [
      "It's a creature...",
      'It lives in the wild, on a farm, or in a zoo...',
      'It breathes, eats, and moves...',
      'A vet could look after it...',
    ],
    words: [
      'Penguin', 'Octopus', 'Red Panda', 'Axolotl', 'Narwhal',
      'Sloth', 'Quokka', 'Fennec Fox', 'Mantis Shrimp', 'Capybara',
      'Platypus', 'Snow Leopard', 'Blue Whale', 'Hummingbird', 'Chameleon',
      'Arctic Fox', 'Sea Turtle', 'Elephant', 'Tiger', 'Dolphin',
      'Giraffe', 'Zebra', 'Lion', 'Bear', 'Kangaroo',
      'Koala', 'Panda', 'Wolf', 'Fox', 'Owl',
      'Eagle', 'Shark', 'Whale', 'Crocodile', 'Snake',
      'Frog', 'Butterfly', 'Bee', 'Flamingo', 'Rabbit',
    ],
    isCustom: false,
  },
  {
    id: 'places',
    name: 'Places',
    emoji: '🗺️',
    neonColor: '#118AB2',
    hintPrefix: "It's a location...",
    hints: [
      "It's a location...",
      'You could travel there...',
      'You would need a map or a boarding pass...',
      'People live there or visit on holiday...',
    ],
    words: [
      'Tokyo', 'Paris', 'Machu Picchu', 'Santorini', 'New York City',
      'Dubai', 'Rome', 'Bali', 'Iceland', 'Venice',
      'Barcelona', 'Kyoto', 'Marrakech', 'Rio de Janeiro', 'Sydney',
      'Prague', 'Cape Town', 'Banff', 'Petra', 'Maldives',
      'London', 'Berlin', 'Amsterdam', 'Vienna', 'Istanbul',
      'Cairo', 'Los Angeles', 'Las Vegas', 'Chicago', 'Toronto',
      'Mexico City', 'Buenos Aires', 'Lima', 'Athens', 'Lisbon',
      'Dublin', 'Hong Kong', 'Singapore', 'Seoul', 'Beijing',
    ],
    isCustom: false,
  },
  {
    id: 'books',
    name: 'Books',
    emoji: '📚',
    neonColor: '#FF6B6B',
    hintPrefix: "It's a book...",
    hints: [
      "It's a book...",
      'You would read this, not watch it...',
      'It has pages and an author...',
      'You would find it on a shelf or an e-reader...',
    ],
    words: [
      '1984', 'To Kill a Mockingbird', 'The Great Gatsby', 'Harry Potter', 'The Hobbit',
      'Pride and Prejudice', 'The Catcher in the Rye', 'Lord of the Rings', 'Dune', 'Sapiens',
      'The Alchemist', 'Atomic Habits', 'Educated', 'Becoming', 'The Subtle Art',
      'Thinking Fast and Slow', 'The Power of Now', 'Outliers', 'Grit', 'Mindset',
      'The Da Vinci Code', 'Brave New World', 'Fahrenheit 451', 'The Chronicles of Narnia', 'Percy Jackson',
      'Twilight', 'The Hunger Games', 'Gone Girl', 'The Martian', 'Great Expectations',
      'Moby Dick', 'Alice in Wonderland', 'Lord of the Flies', 'Treasure Island', 'Hamlet',
      'Romeo and Juliet', 'The Fault in Our Stars', 'Divergent', 'The Maze Runner', 'Charlie and the Chocolate Factory',
    ],
    isCustom: false,
  },
  {
    id: 'brands',
    name: 'Brands',
    emoji: '🏷️',
    neonColor: '#4ECDC4',
    hintPrefix: "It's a brand...",
    hints: [
      "It's a brand...",
      'You have seen its logo before...',
      'A company owns it...',
      'It makes products people buy...',
    ],
    words: [
      'Apple', 'Nike', 'Tesla', 'Coca-Cola', 'Google',
      'Amazon', 'Microsoft', 'Disney', 'Netflix', 'Spotify',
      'Adidas', 'Samsung', 'Sony', 'BMW', 'Mercedes',
      'Louis Vuitton', 'Gucci', 'Rolex', 'Ferrari', 'Lego',
      'Intel', 'Starbucks', 'Toyota', 'Honda', 'Ford',
      'Pepsi', 'KFC', 'Ikea', 'H&M', 'Chanel',
      'Prada', 'Puma', 'YouTube', 'Instagram', 'Adobe',
      'Uber', 'Airbnb', 'PlayStation', 'Xbox',
    ],
    isCustom: false,
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    neonColor: '#FFD166',
    hintPrefix: "It's a sport...",
    hints: [
      "It's a sport...",
      'You would play or watch this game...',
      'It needs physical skill or training...',
      'You would see it on a sports channel...',
    ],
    words: [
      'Soccer', 'Basketball', 'Tennis', 'Swimming', 'Golf',
      'Boxing', 'Skiing', 'Surfing', 'Climbing', 'Cycling',
      'Running', 'Yoga', 'Football', 'Baseball', 'Hockey',
      'Volleyball', 'Rugby', 'Cricket', 'Skateboarding', 'Gymnastics',
      'Marathon', 'Rowing', 'Kayaking', 'Sailing', 'Archery',
      'Fencing', 'Judo', 'Karate', 'Wrestling', 'Table Tennis',
      'Badminton', 'Squash', 'Softball', 'Lacrosse', 'Polo',
      'Figure Skating', 'Snowboarding', 'Bobsled', 'Kickboxing', 'MMA',
    ],
    isCustom: false,
  },
  {
    id: 'music',
    name: 'Music',
    emoji: '🎵',
    neonColor: '#C44DFF',
    hintPrefix: "It's music-related...",
    hints: [
      "It's music-related...",
      'You would hear it at a concert or on a playlist...',
      'It involves instruments, vocals, or a stage...',
      'A DJ or a band could be behind it...',
    ],
    words: [
      'Guitar', 'Piano', 'Drums', 'Violin', 'Saxophone',
      'Concert', 'Festival', 'Album', 'Symphony', 'Jazz',
      'Rock', 'Pop', 'Hip Hop', 'Classical', 'Electronic',
      'Opera', 'Broadway', 'Karaoke', 'DJ', 'Vinyl',
      'Trumpet', 'Flute', 'Cello', 'Harp', 'Banjo',
      'Ukulele', 'Trombone', 'Clarinet', 'Harmonica', 'Microphone',
      'Headphones', 'Grammy', 'Disco', 'Country', 'Reggae',
      'Blues', 'Metal', 'Indie', 'Rap', 'Folk',
    ],
    isCustom: false,
  },
  {
    id: 'historical',
    name: 'Historical Figures',
    emoji: '🏛️',
    neonColor: '#00D4AA',
    hintPrefix: "They made history...",
    hints: [
      "They made history...",
      'They lived in the past...',
      'You would read about them in a history book...',
      'They changed the world in some way...',
    ],
    words: [
      'Einstein', 'Cleopatra', 'Da Vinci', 'Napoleon', 'Shakespeare',
      'Newton', 'Galileo', 'Marie Curie', 'Lincoln', 'Gandhi',
      'Mandela', 'Churchill', 'Tesla', 'Darwin', 'Mozart',
      'Michelangelo', 'Columbus', 'Marco Polo', 'Joan of Arc', 'Alexander',
      'Aristotle', 'Plato', 'Socrates', 'Julius Caesar', 'Alexander the Great',
      'Genghis Khan', 'Queen Victoria', 'George Washington', 'Martin Luther King', 'Rosa Parks',
      'Thomas Edison', 'Amelia Earhart', 'Stephen Hawking', 'Sigmund Freud', 'Mother Teresa',
      'Princess Diana', 'Confucius', 'Spartacus', 'Nero', 'Attila the Hun',
    ],
    isCustom: false,
  },
  {
    id: 'jobs',
    name: 'Jobs & Professions',
    emoji: '👔',
    neonColor: '#3A86FF',
    hintPrefix: "It's a job...",
    hints: [
      "It's a job...",
      'Someone does this for a living...',
      'You would find it on a business card...',
      'It is what someone does for work...',
    ],
    words: [
      'Doctor', 'Nurse', 'Teacher', 'Lawyer', 'Engineer',
      'Chef', 'Pilot', 'Firefighter', 'Police Officer', 'Farmer',
      'Dentist', 'Pharmacist', 'Architect', 'Accountant', 'Journalist',
      'Photographer', 'Barista', 'Mechanic', 'Plumber', 'Electrician',
      'Carpenter', 'Mail Carrier', 'Librarian', 'Scientist', 'Veterinarian',
      'Hairdresser', 'Tailor', 'Baker', 'Soldier', 'Sailor',
      'Astronaut', 'Programmer', 'Designer', 'Actor', 'Model',
    ],
    isCustom: false,
  },
  {
    id: 'hobbies',
    name: 'Hobbies & Activities',
    emoji: '🎨',
    neonColor: '#FB5607',
    hintPrefix: "It's a hobby...",
    hints: [
      "It's a hobby...",
      'People do this for fun in their free time...',
      'You could pick this up on a weekend...',
      'It is something you do, not something you watch...',
    ],
    words: [
      'Painting', 'Drawing', 'Knitting', 'Gardening', 'Baking',
      'Cooking', 'Fishing', 'Camping', 'Hiking', 'Photography',
      'Scrapbooking', 'Origami', 'Pottery', 'Sewing', 'Chess',
      'Video Games', 'Board Games', 'Puzzles', 'Reading', 'Writing',
      'Singing', 'Dancing', 'Acting', 'Magic Tricks', 'Birdwatching',
      'Astronomy', 'Geocaching', 'Roller Skating', 'Bowling', 'Volunteering',
      'Stamp Collecting', 'Model Building', 'Woodworking', 'Calligraphy', 'Meditation',
    ],
    isCustom: false,
  },
  {
    id: 'countries',
    name: 'Countries & Cities',
    emoji: '🌍',
    neonColor: '#4CC9F0',
    hintPrefix: "It's a country or city...",
    hints: [
      "It's a country or city...",
      'You would need a passport or a plane to get there...',
      'It is a place on the map...',
      'People live there or visit on holiday...',
    ],
    words: [
      'France', 'Germany', 'Italy', 'Spain', 'Portugal',
      'England', 'Scotland', 'Ireland', 'Canada', 'Brazil',
      'Argentina', 'Chile', 'Peru', 'Mexico', 'Japan',
      'China', 'India', 'Thailand', 'Vietnam', 'South Korea',
      'Australia', 'New Zealand', 'Egypt', 'Morocco', 'Kenya',
      'South Africa', 'Greece', 'Turkey', 'Russia', 'Poland',
      'Netherlands', 'Switzerland', 'Austria', 'Sweden', 'Norway',
      'Denmark', 'Finland', 'Belgium', 'Israel', 'Saudi Arabia',
    ],
    isCustom: false,
  },
];

export type Category = typeof BUILTIN_CATEGORIES[number];
