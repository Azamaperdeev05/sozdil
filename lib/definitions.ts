export interface WordDefinition {
  s: string; // source dictionary title
  t: string; // definition text
}

const memoryCache = new Map<string, WordDefinition[]>();
const bucketCache = new Map<number, Record<string, WordDefinition[]>>();

export const formatKazakhDictionaryText = (text: string): string => {
  if (!text) return '';
  let res = text;
  // Fix spaces before punctuation e.g. "Сиық ." -> "Сиық."
  res = res.replace(/\s+([.,;:!?])/g, '$1');
  // Collapse spaced letters e.g. "з а т." -> "зат.", "Қ а р с а қ" -> "Қарсақ", "қ а р с а қ т а р ы н ы ң" -> "қарсақтарының"
  for (let i = 0; i < 3; i++) {
    res = res.replace(/(?:^|\s)([А-Яа-яӘәІіҢңҒғҮүҰұҚқӨөҺһA-Za-z])(?:\s+([А-Яа-яӘәІіҢңҒғҮүҰұҚқӨөҺһA-Za-z]))+(?=[.,;:!?\s]|$)/gui, (match) => {
      const leadingSpace = match.startsWith(' ') ? ' ' : '';
      return leadingSpace + match.trim().replace(/\s+/g, '');
    });
  }
  // Remove unnecessary spaces
  res = res.replace(/\s+/g, ' ').trim();
  return res;
};

export const getWordBucket = (word: string): number => {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash * 31 + word.charCodeAt(i)) >>> 0;
  }
  return hash % 200;
};

export const fetchWordDefinitions = async (word: string): Promise<WordDefinition[]> => {
  if (!word) return [];
  const upper = word.toUpperCase().trim();

  // 1. Check in-memory word cache
  if (memoryCache.has(upper)) {
    return memoryCache.get(upper)!;
  }

  // 2. Check session storage cache (v3 with enhanced formatting)
  try {
    const cached = sessionStorage.getItem(`sq_def_v3_${upper}`);
    if (cached) {
      const parsed = JSON.parse(cached) as WordDefinition[];
      memoryCache.set(upper, parsed);
      return parsed;
    }
  } catch {}

  // 3. Fetch bucket JSON chunk
  const bucket = getWordBucket(upper);
  let bucketData = bucketCache.get(bucket);

  if (!bucketData) {
    try {
      const res = await fetch(`/defs/${bucket}.json`);
      if (res.ok) {
        bucketData = (await res.json()) as Record<string, WordDefinition[]>;
        bucketCache.set(bucket, bucketData);
      }
    } catch (err) {
      console.warn('Failed to fetch definitions bucket', bucket, err);
    }
  }

  const rawDefs = bucketData?.[upper] || [];
  const defs = rawDefs.map(d => ({
    s: d.s,
    t: formatKazakhDictionaryText(d.t)
  }));

  memoryCache.set(upper, defs);

  try {
    sessionStorage.setItem(`sq_def_v3_${upper}`, JSON.stringify(defs));
  } catch {}

  return defs;
};
