const SUPABASE_URL = 'https://xbkvmfqefbarpcsfsrav.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3ZtZnFlZmJhcnBjc2ZzcmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTQ1NTYsImV4cCI6MjEwNjA5MDU1Nn0.dDw3QXook7KMJQ2nf6vubQYcvzXqtuBjyRh49RcCwEc';

export interface AnalyticsEvent {
  event_type: 'visit' | 'game_start' | 'game_end' | 'share' | 'leave';
  word_length?: number;
  game_number?: number;
  game_status?: 'WON' | 'LOST' | 'PLAYING';
  guess_count?: number;
  duration_seconds?: number;
  solution_word?: string;
  platform?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>;
}

// Generate or retrieve persistent anonymous visitor ID
const getVisitorId = (): string => {
  try {
    let vid = localStorage.getItem('sozdil_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('sozdil_vid', vid);
    }
    return vid;
  } catch {
    return 'v_anon';
  }
};

// Generate or retrieve session ID (resets when tab or browser session is closed)
const getSessionId = (): string => {
  try {
    let sid = sessionStorage.getItem('sozdil_sid');
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      sessionStorage.setItem('sozdil_sid', sid);
    }
    return sid;
  } catch {
    return 's_anon';
  }
};

const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(ua)) return 'mobile';
  return 'desktop';
};

const getOS = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'other';
};

const getBrowser = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  if (/OPR|Opera/i.test(ua)) return 'Opera';
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Chrome|CriOS/i.test(ua)) return 'Chrome';
  if (/Firefox|FxiOS/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  return 'other';
};

const getScreenResolution = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.screen?.width || 0}x${window.screen?.height || 0}`;
};

const getConnectionType = (): string => {
  if (typeof navigator === 'undefined') return 'unknown';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conn = (navigator as any).connection;
  return conn?.effectiveType || 'unknown';
};

const getReferrer = (): string => {
  if (typeof document === 'undefined') return 'direct';
  return document.referrer ? document.referrer.slice(0, 300) : 'direct';
};

const getUtmSource = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || params.get('ref') || params.get('from') || '';
  } catch {
    return '';
  }
};

const getIsPwa = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

export const trackEvent = (event: AnalyticsEvent): void => {
  if (typeof window === 'undefined') return;

  const payload = {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    device_type: getDeviceType(),
    os: getOS(),
    browser: getBrowser(),
    screen_resolution: getScreenResolution(),
    connection_type: getConnectionType(),
    language: navigator.language || '',
    referrer: getReferrer(),
    utm_source: getUtmSource(),
    is_pwa: getIsPwa(),
    platform: 'web',
    ...event,
  };

  // Asynchronous non-blocking dispatch using native fetch with keepalive
  try {
    fetch(`${SUPABASE_URL}/rest/v1/game_analytics`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {}
};

// Track session entry and session exit (duration)
let isSessionInitialized = false;
const sessionStartTime = typeof window !== 'undefined' ? Date.now() : 0;

export const initSessionTracking = (): void => {
  if (typeof window === 'undefined' || isSessionInitialized) return;
  isSessionInitialized = true;

  // Log visit once per browser session
  try {
    if (!sessionStorage.getItem('sozdil_visit_logged')) {
      sessionStorage.setItem('sozdil_visit_logged', '1');
      trackEvent({ event_type: 'visit' });
    }
  } catch {}

  // Track user leaving (tab closed or app backgrounded)
  let leaveLogged = false;
  const trackLeave = () => {
    if (leaveLogged) return;
    const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    // Only log leave if user spent at least 3 seconds on the site
    if (durationSeconds >= 3) {
      leaveLogged = true;
      trackEvent({
        event_type: 'leave',
        duration_seconds: durationSeconds,
      });
    }
  };

  window.addEventListener('pagehide', trackLeave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackLeave();
    }
  });
};

export const trackVisit = initSessionTracking;
