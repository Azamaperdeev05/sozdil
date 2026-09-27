const SUPABASE_URL = 'https://xbkvmfqefbarpcsfsrav.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3ZtZnFlZmJhcnBjc2ZzcmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTQ1NTYsImV4cCI6MjEwNjA5MDU1Nn0.dDw3QXook7KMJQ2nf6vubQYcvzXqtuBjyRh49RcCwEc';

export interface AnalyticsEvent {
  event_type: 'visit' | 'game_start' | 'game_end' | 'share';
  word_length?: number;
  game_number?: number;
  game_status?: 'WON' | 'LOST' | 'PLAYING';
  guess_count?: number;
  duration_seconds?: number;
  platform?: string;
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

const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(ua)) return 'mobile';
  return 'desktop';
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
    device_type: getDeviceType(),
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

// Track visit once per session
export const trackVisit = (): void => {
  try {
    if (sessionStorage.getItem('sozdil_visit_logged')) return;
    sessionStorage.setItem('sozdil_visit_logged', '1');
    trackEvent({ event_type: 'visit' });
  } catch {}
};
