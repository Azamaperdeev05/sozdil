// Secure-ish daily scheduler for Kazakh Wordle
// Client-side implementation that mimics server-side logic:
// - Deterministic day index anchored to an epoch in Asia/Almaty
// - HMAC-SHA256(seed, message) → SplitMix64 PRNG
// - Per-length deterministic permutation to avoid repeats until cycle wraps
// Note: In a pure client build the SALT is public at runtime. For true secrecy,
// move this module server-side and return results via an API.

type Length = 4 | 5 | 6;

// Epoch for the game schedule (Asia/Almaty midnight based)
const EPOCH_YMD = '2025-01-01';

// ----- Time / Date helpers (Asia/Almaty) -----
export function dateYmdInAlmaty(d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Almaty',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function ymdToEpochDays(ymd: string): number {
  // Interpret YMD at UTC midnight (day arithmetic only)
  const [y, m, d] = ymd.split('-').map((s) => parseInt(s, 10));
  const ms = Date.UTC(y, m - 1, d, 0, 0, 0, 0);
  return Math.floor(ms / 86_400_000);
}

function dayIndexFromYmd(ymd: string): number {
  const d = ymdToEpochDays(ymd);
  const e = ymdToEpochDays(EPOCH_YMD);
  return Math.max(0, d - e);
}

// ----- SALT management -----
function getSaltString(): string {
  // Prefer server/env provided values; fallback to a dev salt
  // Vite client builds expose VITE_* via import.meta.env
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyImportMeta: any = (typeof import.meta !== 'undefined') ? import.meta : {};
  const viteSalt = anyImportMeta?.env?.VITE_WORDLE_SALT || anyImportMeta?.env?.VITE_SALT;
  // Node env (in case this runs server-side)
  // eslint-disable-next-line no-undef
  const nodeSalt = (typeof process !== 'undefined' && (process as any).env)
    ? ((process as any).env.SOZDIL_SALT || (process as any).env.WORDLE_SALT)
    : undefined;
  return (viteSalt || nodeSalt || 'DEV_SALT_SOZDIL_please_override') as string;
}

function utf8Bytes(s: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s);
  // Fallback minimal encoder
  const arr = [] as number[];
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c < 128) arr.push(c);
    else if (c < 2048) { arr.push((c >> 6) | 192, (c & 63) | 128); }
    else if ((c & 0xFC00) === 0xD800 && i + 1 < s.length && (s.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
      // surrogate pair
      c = 0x10000 + ((c & 0x3FF) << 10) + (s.charCodeAt(++i) & 0x3FF);
      arr.push((c >> 18) | 240, ((c >> 12) & 63) | 128, ((c >> 6) & 63) | 128, (c & 63) | 128);
    } else {
      arr.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
    }
  }
  return new Uint8Array(arr);
}

// ----- SHA-256 (pure TS) -----
// Minimal, synchronous SHA-256 for small inputs (schedule seeds)
// Based on FIPS 180-4; 32-bit arithmetic via JS bitwise ops
function sha256(bytes: Uint8Array): Uint8Array {
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const k = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]);

  const l = bytes.length;
  // Pre-processing (padding)
  const bitLenHi = Math.floor((l >>> 29));
  const bitLenLo = (l << 3) >>> 0;
  const withOne = l + 1;
  const kLen = (withOne % 64 <= 56 ? 56 : 120) - withOne % 64; // bytes of zero pad
  const total = l + 1 + kLen + 8;
  const padded = new Uint8Array(total);
  padded.set(bytes);
  padded[l] = 0x80;
  // set 64-bit big-endian length
  padded[total - 8] = (bitLenHi >>> 24) & 0xff;
  padded[total - 7] = (bitLenHi >>> 16) & 0xff;
  padded[total - 6] = (bitLenHi >>> 8) & 0xff;
  padded[total - 5] = (bitLenHi >>> 0) & 0xff;
  padded[total - 4] = (bitLenLo >>> 24) & 0xff;
  padded[total - 3] = (bitLenLo >>> 16) & 0xff;
  padded[total - 2] = (bitLenLo >>> 8) & 0xff;
  padded[total - 1] = (bitLenLo >>> 0) & 0xff;

  const w = new Uint32Array(64);
  for (let i = 0; i < total; i += 64) {
    for (let j = 0; j < 16; j++) {
      const off = i + j * 4;
      w[j] = ((padded[off] << 24) | (padded[off + 1] << 16) | (padded[off + 2] << 8) | (padded[off + 3])) >>> 0;
    }
    for (let j = 16; j < 64; j++) {
      const s0 = (rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3)) >>> 0;
      const s1 = (rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10)) >>> 0;
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }
    let a = h[0], b = h[1], c = h[2], d2 = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (let j = 0; j < 64; j++) {
      const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + k[j] + w[j]) >>> 0;
      const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d2 + t1) >>> 0; d2 = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d2) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 8; i++) {
    out[i * 4 + 0] = (h[i] >>> 24) & 0xff;
    out[i * 4 + 1] = (h[i] >>> 16) & 0xff;
    out[i * 4 + 2] = (h[i] >>> 8) & 0xff;
    out[i * 4 + 3] = (h[i] >>> 0) & 0xff;
  }
  return out;
}

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

function hmacSha256(key: Uint8Array, msg: Uint8Array): Uint8Array {
  const blockSize = 64; // bytes
  let k0 = key;
  if (k0.length > blockSize) k0 = sha256(k0);
  if (k0.length < blockSize) {
    const t = new Uint8Array(blockSize);
    t.set(k0); k0 = t;
  }
  const o = new Uint8Array(blockSize);
  const i = new Uint8Array(blockSize);
  for (let idx = 0; idx < blockSize; idx++) {
    o[idx] = k0[idx] ^ 0x5c;
    i[idx] = k0[idx] ^ 0x36;
  }
  const inner = sha256(concat(i, msg));
  const outer = sha256(concat(o, inner));
  return outer;
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0); out.set(b, a.length);
  return out;
}

function u8ToBigIntLE(u8: Uint8Array, offset = 0, length = 8): bigint {
  let x = 0n;
  for (let i = 0; i < length; i++) {
    x |= BigInt(u8[offset + i] || 0) << BigInt(8 * i);
  }
  return x & 0xFFFFFFFFFFFFFFFFn;
}

// ----- SplitMix64 PRNG -----
class SplitMix64 {
  private state: bigint;
  constructor(seed: bigint) {
    this.state = (seed & 0xFFFFFFFFFFFFFFFFn) || 0x9E3779B97F4A7C15n;
  }
  next64(): bigint {
    this.state = (this.state + 0x9E3779B97F4A7C15n) & 0xFFFFFFFFFFFFFFFFn;
    let z = this.state;
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & 0xFFFFFFFFFFFFFFFFn;
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & 0xFFFFFFFFFFFFFFFFn;
    return (z ^ (z >> 31n)) & 0xFFFFFFFFFFFFFFFFn;
  }
  nextDouble(): number {
    // Take top 53 bits to form a JS double in [0,1)
    const z = this.next64();
    const top53 = Number(z >> 11n) / (1 << 53);
    return top53;
  }
  nextInt(n: number): number {
    // uniform int in [0, n)
    return Math.floor(this.nextDouble() * n);
  }
}

function makeRngFor(message: string): SplitMix64 {
  const salt = utf8Bytes(getSaltString());
  const msg = utf8Bytes(message);
  const mac = hmacSha256(salt, msg);
  const seed = u8ToBigIntLE(mac, 0, 8);
  return new SplitMix64(seed);
}

// Fisher-Yates deterministic shuffle using provided RNG
function shuffleInPlace<T>(arr: T[], rng: SplitMix64): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    if (j !== i) {
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
  }
}

// Compute a deterministic permutation for a given word length
function computePermutation(answers: string[], length: Length): number[] {
  const idxs = Array.from({ length: answers.length }, (_, i) => i);
  const rng = makeRngFor(`perm|len:${length}|answers:${answers.length}`);
  shuffleInPlace(idxs, rng);
  return idxs;
}

// Public API: keep signature compatible with previous picker
export function pickWordOfDate(params: { answers: string[]; length: Length; dateYmd?: string; }) {
  const { answers, length } = params;
  // Determine Almaty local day
  const ymd = params.dateYmd || dateYmdInAlmaty();
  const idx = dayIndexFromYmd(ymd);

  // Deterministic per-length permutation avoids repeats until wrap
  const perm = computePermutation(answers, length);
  const choiceIdx = perm[idx % perm.length];
  const word = answers[choiceIdx];

  // Simple season label: YYYY-MM (Almaty)
  const season = ymd.slice(0, 7);

  return { word, idx, season };
}

