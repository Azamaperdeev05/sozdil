import { Difficulty } from '../types';

export interface PickerOptions {
  length: 4 | 5 | 6;
  difficulty: Difficulty;
  date: string; // "YYYY-MM-DD"
  salt: string; 
  recentDays: number; 
  usedWords: string[]; 
  allowBorrowed?: boolean; 
  forceWordByDate?: Record<string, string>; 
}

const KZ_VOWELS_JUAN = new Set(["а","о","ұ","ы"]);
const KZ_VOWELS_JIN = new Set(["ә","ө","ү","і","е"]);
const BORROWED = new Set(["ф","в","х","һ","ч","ц","щ","э","ю","я","ё","ь","ъ"]);
const SPECIALS = new Set(["ң","қ","ғ","ә","ө","ү","ұ","і"]);

// ---------- Utils
function normalize(w: string) { return w.toLowerCase().trim(); }

function vowelsGroup(word: string): "juan"|"jin"|"mixed"|"none" {
  let j = 0, i = 0;
  for (const ch of word) {
    if (KZ_VOWELS_JUAN.has(ch)) j++;
    else if (KZ_VOWELS_JIN.has(ch)) i++;
  }
  if (!j && !i) return "none";
  if (j && i) return "mixed";
  return j ? "juan" : "jin";
}

function hasBorrowed(word: string) {
  for (const ch of word) if (BORROWED.has(ch)) return true;
  return false;
}

function hasDuplicateLetter(word: string) {
  const s = new Set<string>();
  for (const ch of word) { if (s.has(ch)) return true; s.add(ch); }
  return false;
}

function endsLikeVerbU(word: string) { return word.endsWith("у"); }

function seedFrom(date: string, salt: string) {
  let h = 2166136261 >>> 0;
  const str = `${salt}::${date}`;
  for (let i=0;i<str.length;i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------- Stats
export function buildStats(words: string[]) {
  const letters = new Map<string, number>();
  const bigrams = new Map<string, number>();
  let totalLetters = 0, totalBigrams = 0;

  for (const wRaw of words) {
    const w = normalize(wRaw);
    for (const ch of w) {
      letters.set(ch, (letters.get(ch) ?? 0) + 1);
      totalLetters++;
    }
    for (let i=0;i<w.length-1;i++) {
      const bg = w[i] + w[i+1];
      bigrams.set(bg, (bigrams.get(bg) ?? 0) + 1);
      totalBigrams++;
    }
  }
  return { letters, totalLetters, bigrams, totalBigrams };
}

function probLetter(ch: string, stats: ReturnType<typeof buildStats>) {
  const c = (stats.letters.get(ch) ?? 0) + 1; // Laplace
  const Z = stats.totalLetters + stats.letters.size;
  return c / Z;
}

function probBigram(bg: string, stats: ReturnType<typeof buildStats>) {
  const c = (stats.bigrams.get(bg) ?? 0) + 1;
  const Z = stats.totalBigrams + stats.bigrams.size;
  return c / Z;
}

// ---------- Difficulty Score
function difficultyScore(word: string, stats: ReturnType<typeof buildStats>) {
  const w = normalize(word);
  let rarity = 0;
  for (const ch of w) rarity += -Math.log(probLetter(ch, stats));
  rarity /= w.length;

  let bgr = 0;
  for (let i=0;i<w.length-1;i++) bgr += -Math.log(probBigram(w[i]+w[i+1], stats));
  bgr /= Math.max(1, w.length-1);

  const dup = hasDuplicateLetter(w) ? 1 : 0;
  let specials = 0; for (const ch of w) if (SPECIALS.has(ch)) specials++;

  const endsU = endsLikeVerbU(w) ? 1 : 0;

  return (
    0.45 * rarity +
    0.25 * bgr +
    0.15 * dup +
    0.10 * (specials ? 0.8 : 1.0) +
    0.05 * (endsU ? 0.6 : 1.0)
  );
}

const TARGET: Record<Difficulty, {min:number; max:number}> = {
  easy:   { min: 0.0, max: 2.4 },
  medium: { min: 2.2, max: 2.9 },
  hard:   { min: 2.8, max: 3.6 },
};

// ---------- Filters
function passLanguageFilters(word: string, opts: PickerOptions) {
  const w = normalize(word);
  if (w.length !== opts.length) return false;

  if (!opts.allowBorrowed && hasBorrowed(w)) return false;

  const g = vowelsGroup(w);
  if (g === "mixed") return false;

  const badSuffixes = ["лар","лер","дың","дің","тың","тің","мен","сыз","сіз","ның","нің"];
  for (const suf of badSuffixes) if (w.endsWith(suf)) return false;

  return true;
}

// ---------- Picker
export function pickDailyWord(
  answerList: string[],
  stats: ReturnType<typeof buildStats>,
  opts: PickerOptions
) {
  if (opts.forceWordByDate?.[opts.date]) {
    const forced = normalize(opts.forceWordByDate[opts.date]);
    if (!opts.usedWords.includes(forced)) return forced;
  }

  const candidates = answerList
    .map(normalize)
    .filter(w => passLanguageFilters(w, opts))
    .filter(w => !opts.usedWords.includes(w));

  if (!candidates.length) {
    const fallbackCandidates = answerList.map(normalize).filter(w => !opts.usedWords.includes(w));
    if(fallbackCandidates.length > 0) {
        const rng = mulberry32(seedFrom(opts.date, opts.salt));
        const index = Math.floor(rng() * fallbackCandidates.length);
        return fallbackCandidates[index];
    }
    const finalFallback = answerList.map(normalize);
    const rng = mulberry32(seedFrom(opts.date, opts.salt));
    const index = Math.floor(rng() * finalFallback.length);
    return finalFallback[index];
  }

  const scored = candidates.map(w => ({ w, s: difficultyScore(w, stats) }));
  const {min, max} = TARGET[opts.difficulty];
  const inRange = scored.filter(x => x.s >= min && x.s <= max);
  const pool = inRange.length ? inRange : scored;

  const last = opts.usedWords[0];
  let preferGroup: "juan"|"jin"|null = null;
  if (last) {
    const lg = vowelsGroup(last);
    preferGroup = lg === "juan" ? "jin" : lg === "jin" ? "juan" : null;
  }

  const rng = mulberry32(seedFrom(opts.date, opts.salt));

  function weight(x: {w:string; s:number}) {
    const mid = (min + max) / 2;
    const closeness = 1 / (1 + Math.abs(x.s - mid));
    const vg = vowelsGroup(x.w);
    const groupBoost = (preferGroup && vg === preferGroup) ? 1.15 : 1.0;
    return closeness * groupBoost;
  }

  const weights = pool.map(weight);
  const total = weights.reduce((a,b)=>a+b,0);
  let r = rng() * total;
  for (let i=0;i<pool.length;i++) {
    if ((r -= weights[i]) <= 0) return pool[i].w;
  }
  return pool[pool.length - 1].w;
}
