export const KAZAKH_ALPHABET = 'АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ';

/**
 * Standard Kazakhstan keyboard mapping for number row:
 * 1=Ә, 2=І, 3=Ң, 4=Ғ, 5=Ү, 6=Ұ, 7=Қ, 8=Ө, 9=Һ
 */
export const NUMBER_TO_KAZAKH: Record<string, string> = {
  '1': 'Ә',
  '2': 'І',
  '3': 'Ң',
  '4': 'Ғ',
  '5': 'Ү',
  '6': 'Ұ',
  '7': 'Қ',
  '8': 'Ө',
  '9': 'Һ',
};

/**
 * Physical QWERTY key code mapping to Cyrillic / Kazakh layout.
 * Ensures users typing on US / English layout get seamless Cyrillic input
 * (e.g. KeyQ -> Қ, KeyF -> А, KeyD -> В, etc.)
 */
export const QWERTY_CODE_TO_KAZAKH: Record<string, string> = {
  // Digit keys
  Digit1: 'Ә',
  Digit2: 'І',
  Digit3: 'Ң',
  Digit4: 'Ғ',
  Digit5: 'Ү',
  Digit6: 'Ұ',
  Digit7: 'Қ',
  Digit8: 'Ө',
  Digit9: 'Һ',
  Numpad1: 'Ә',
  Numpad2: 'І',
  Numpad3: 'Ң',
  Numpad4: 'Ғ',
  Numpad5: 'Ү',
  Numpad6: 'Ұ',
  Numpad7: 'Қ',
  Numpad8: 'Ө',
  Numpad9: 'Һ',

  // Letter row 1
  KeyQ: 'Қ',
  KeyW: 'Ц',
  KeyE: 'У',
  KeyR: 'К',
  KeyT: 'Е',
  KeyY: 'Н',
  KeyU: 'Г',
  KeyI: 'Ш',
  KeyO: 'Щ',
  KeyP: 'З',
  BracketLeft: 'Х',
  BracketRight: 'Ъ',

  // Letter row 2
  KeyA: 'Ф',
  KeyS: 'Ы',
  KeyD: 'В',
  KeyF: 'А',
  KeyG: 'П',
  KeyH: 'Р',
  KeyJ: 'О',
  KeyK: 'Л',
  KeyL: 'Д',
  Semicolon: 'Ж',
  Quote: 'Э',

  // Letter row 3
  KeyZ: 'Я',
  KeyX: 'Ч',
  KeyC: 'С',
  KeyV: 'М',
  KeyB: 'И',
  KeyN: 'Т',
  KeyM: 'Ь',
  Comma: 'Б',
  Period: 'Ю',
  Backquote: 'Ё',
};

/**
 * Latin character fallback if e.code is unavailable
 */
export const LATIN_CHAR_TO_KAZAKH: Record<string, string> = {
  Q: 'Қ',
  W: 'Ц',
  E: 'У',
  R: 'К',
  T: 'Е',
  Y: 'Н',
  U: 'Г',
  I: 'Ш',
  O: 'Щ',
  P: 'З',
  A: 'Ф',
  S: 'Ы',
  D: 'В',
  F: 'А',
  G: 'П',
  H: 'Р',
  J: 'О',
  K: 'Л',
  L: 'Д',
  Z: 'Я',
  X: 'Ч',
  C: 'С',
  V: 'М',
  B: 'И',
  N: 'Т',
  M: 'Ь',
};

/**
 * Smart keyboard resolver that detects and translates physical keys
 * into valid Kazakh letters, Enter, or Backspace.
 */
export function resolveKeyToKazakh(e: KeyboardEvent): string | null {
  // Ignore system hotkeys
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return null;
  }

  // 1. Enter
  if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
    return 'ENTER';
  }

  // 2. Backspace
  if (e.key === 'Backspace' || e.code === 'Backspace') {
    return 'BACKSPACE';
  }

  // 3. Direct Kazakh Cyrillic letter
  const upperKey = e.key.toUpperCase();
  if (upperKey.length === 1 && KAZAKH_ALPHABET.includes(upperKey)) {
    return upperKey;
  }

  // 4. Number keys (1..9 -> Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ)
  if (NUMBER_TO_KAZAKH[e.key]) {
    return NUMBER_TO_KAZAKH[e.key];
  }

  // 5. Physical QWERTY key code
  if (e.code && QWERTY_CODE_TO_KAZAKH[e.code]) {
    return QWERTY_CODE_TO_KAZAKH[e.code];
  }

  // 6. Direct Latin character fallback
  if (upperKey.length === 1 && LATIN_CHAR_TO_KAZAKH[upperKey]) {
    return LATIN_CHAR_TO_KAZAKH[upperKey];
  }

  return null;
}
