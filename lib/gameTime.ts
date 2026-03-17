const MS_DAY = 86_400_000;
const MAX_RESET_SEARCH_WINDOW_MS = 48 * 60 * 60 * 1000;

export const GAME_TIME_ZONE = 'Asia/Almaty';
export const GAME_EPOCH_DATE = '2024-08-01';

const gameDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: GAME_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function ymdToUtcMs(ymd: string): number {
  const [year, month, day] = ymd.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getGameDateString(date: Date = new Date()): string {
  const parts = gameDateFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';

  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function getGameDayIndex(date: Date = new Date()): number {
  const todayUtcMs = ymdToUtcMs(getGameDateString(date));
  const epochUtcMs = ymdToUtcMs(GAME_EPOCH_DATE);

  return Math.max(0, Math.floor((todayUtcMs - epochUtcMs) / MS_DAY));
}

export function getMsUntilNextGame(date: Date = new Date()): number {
  const currentDate = getGameDateString(date);
  let low = date.getTime();
  let high = low + MAX_RESET_SEARCH_WINDOW_MS;

  if (getGameDateString(new Date(high)) === currentDate) {
    throw new Error(`Could not resolve the next reset boundary for ${GAME_TIME_ZONE}.`);
  }

  while (high - low > 1_000) {
    const mid = Math.floor((low + high) / 2);
    const midDate = getGameDateString(new Date(mid));

    if (midDate === currentDate) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.max(0, high - date.getTime());
}
