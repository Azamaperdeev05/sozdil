

export const MAX_GUESSES = 6;
export const APP_URL =
  typeof window !== 'undefined'
    ? new URL('/', window.location.href).toString()
    : 'https://sozdil.vercel.app/';

export const KEYBOARD_LAYOUT = [
  ['Ә', 'І', 'Ң', 'Ғ', 'Ү', 'Ұ', 'Қ', 'Ө', 'Һ'],
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['BACKSPACE', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'ENTER'],
];

// UI Messages in Kazakh
export const UI_MESSAGES = {
  NOT_ENOUGH_LETTERS: 'Әріптер жеткіліксіз',
  WORD_NOT_IN_LIST: 'Сөз тізімде жоқ',
  GAME_WON: 'Әп, бәрекелді!',
  GAME_LOST: 'Келесі жолы сәттілік!',
  NEW_WORD_ALT: 'Жаңа',
  GAME_RULES: 'Ойын шарттары',
  ENTER: 'ЕНГІЗУ',
  CLOSE: 'Жабу',
  STATISTICS: 'Статистика',
  SHARE_TEXT: 'Бөлісу',
  RESULT_COPIED: 'Нәтиже көшірілді!',
  NEXT_WORD_IN: 'Келесі сөз',
  CALENDAR: 'Күнтізбе',
  WORD_DEFINITION: 'Сөз мағынасы',
};
