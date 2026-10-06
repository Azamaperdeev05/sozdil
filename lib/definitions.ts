export interface WordDefinition {
  s: string; // source dictionary title
  t: string; // definition text
}

const memoryCache = new Map<string, WordDefinition[]>();
const bucketCache = new Map<number, Record<string, WordDefinition[]>>();

export const formatKazakhDictionaryText = (text: string): string => {
  if (!text) return '';
  return text
    // Replace spaced out letters like "з а т .", "з о о л .", "Қ а р с а қ"
    .replace(/(?:^|\s)([а-яәіңғүұқөһA-ZА-ЯӘІҢҒҮҰҚӨҺ])(?:\s+([а-яәіңғүұқөһA-ZА-ЯӘІҢҒҮҰҚӨҺ]))+(?=\s|[.,;:!?]|$)/gui, (match) => {
      const collapsed = match.replace(/\s+/g, '');
      return match.startsWith(' ') ? ' ' + collapsed : collapsed;
    })
    .replace(/\s+/g, ' ')
    .trim();
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

  // 2. Check session storage cache
  try {
    const cached = sessionStorage.getItem(`sq_def_${upper}`);
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
    sessionStorage.setItem(`sq_def_${upper}`, JSON.stringify(defs));
  } catch {}

  return defs;
};
