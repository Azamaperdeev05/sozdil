const ALPHABET = 'АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ';
const B62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MASK = 0x7E3A95C14Bn;

function toBase62(bn: bigint): string {
  let s = '';
  let n = bn;
  while (n > 0n) {
    s = B62[Number(n % 62n)] + s;
    n = n / 62n;
  }
  return s || '0';
}

function fromBase62(str: string): bigint | null {
  let res = 0n;
  for (const c of str) {
    const idx = B62.indexOf(c);
    if (idx === -1) return null;
    res = res * 62n + BigInt(idx);
  }
  return res;
}

/**
 * Encrypts a 4, 5, or 6-letter Kazakh word into a short (6-8 character) URL-safe string.
 */
export function encodeChallenge(word: string): string | null {
  const letters = word.trim().toUpperCase().split('');
  const len = letters.length;
  if (len < 4 || len > 6) return null;
  let num = 0n;
  for (const char of letters) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) return null;
    num = num * 42n + BigInt(idx);
  }
  const scrambled = (num ^ (MASK + BigInt(len) * 0x1A2B3Cn)) * 8n + BigInt(len);
  return toBase62(scrambled);
}

/**
 * Decrypts a challenge code back into the uppercase Kazakh word.
 */
export function decodeChallenge(code: string): string | null {
  if (!code || typeof code !== 'string') return null;
  try {
    const parsed = fromBase62(code.trim());
    if (parsed === null) return null;
    const len = Number(parsed % 8n);
    if (len < 4 || len > 6) return null;
    let num = (parsed / 8n) ^ (MASK + BigInt(len) * 0x1A2B3Cn);
    const chars: string[] = [];
    for (let i = 0; i < len; i++) {
      const idx = Number(num % 42n);
      if (idx < 0 || idx >= ALPHABET.length) return null;
      chars.unshift(ALPHABET[idx]);
      num = num / 42n;
    }
    if (num !== 0n) return null;
    return chars.join('');
  } catch {
    return null;
  }
}

/**
 * Generates the full challenge URL.
 */
export function getChallengeUrl(word: string): string | null {
  const code = encodeChallenge(word);
  if (!code) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sozdil.vercel.app';
  return `${origin}/?c=${code}`;
}
