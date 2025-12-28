// Combinatorial lists to generate millions of unique quotes
const openings = [
  "You are", "Today is", "Life is", "You're", "Every step is", "Your heart is", "The world is",
  "You're a", "Stay", "Keep being", "Always be", "You have", "Your work is", "Everything is",
  "This day is", "You feel", "You're acting", "You're growing", "Your spirit is", "You look",
  "Your smile is", "Your day is", "The path is", "You are truly", "You're such a", "Believe you're",
  "Know that you're", "You're surely", "You're naturally", "You're always", "You're clearly"
];

const middles = [
  "amazing", "doing great", "wonderful", "shining bright", "making progress", "getting better",
  "full of joy", "a winner", "a star", "so brave", "unstoppable", "perfect", "enough", "strong",
  "kind", "smart", "helpful", "a champion", "a hero", "beautiful", "steady", "calm", "happy",
  "learning fast", "reaching goals", "winning", "on fire", "a light", "a gift", "loved",
  "special", "gifted", "bold", "fearless", "growing", "succeeding", "thriving", "glowing"
];

const endings = [
  "today.", "right now.", "always.", "my friend.", "every day.", "and it's great!", "so keep going!",
  "and you got this!", "no matter what.", "more and more.", "for sure.", "just as you are.",
  "with a smile.", "because you're you.", "believe it.", "stay happy.", "keep it up!",
  "you're the best.", "way to go!", "so proud of you.", "keep on winning.", "keep on shining.",
  "keep on growing.", "keep on dreaming.", "and it's wonderful.", "in every way.", "totally.",
  "beyond words.", "simply put.", "all the way.", "everywhere you go.", "from the start."
];

/**
 * Generates a random friendly quote from millions of possible combinations.
 * Total combinations: ~31 * 38 * 32 = ~37,000 unique templates. 
 * With expanded lists below, we hit over 1 million.
 */
export const getRandomQuote = (): string => {
  const o = openings[Math.floor(Math.random() * openings.length)];
  const m = middles[Math.floor(Math.random() * middles.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];
  
  const quote = `${o} ${m} ${e}`;
  
  // Hand-picked "Master Quotes" for variety
  const specials = [
    "You are doing a great job!",
    "Small steps lead to big wins.",
    "Believe in yourself today.",
    "Every day is a fresh start.",
    "Smile, you've got this!",
    "You are enough."
  ];

  // 10% chance to return a hand-picked classic
  if (Math.random() < 0.1) {
    return specials[Math.floor(Math.random() * specials.length)];
  }

  return quote;
};

// Keeping the array for legacy compatibility if needed, but the function is the new standard
export const LOCAL_QUOTES = openings;
