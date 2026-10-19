-- ============================================================================
-- Сөзділ: «Қиын сөздер» зерттеу сұраныстары (READ-ONLY)
-- ----------------------------------------------------------------------------
-- Мақсаты: қай сөздер қиын екенін, НЕГЕ қиын екенін және ойыншылар ол сөзде
--          қандай болжамдар жазатынын деректерден анықтау.
--
-- Қалай іске қосу: Supabase Dashboard → SQL Editor → бөлімді бір-бірлеп
--                  көшіріп, RUN басыңыз.
--
-- Ескерту: game_analytics кестесіне тікелей SELECT рұқсаты тек service_role-де
--          (anon RLS-пен жасырылған). Сондықтан бұл сұраныстар тек SQL Editor-де
--          немесе service_role кілтімен орындалады.
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 1) ӘР СӨЗ БОЙЫНША ҚИЫНДЫҚ КЕСТЕСІ (соңғы 90 күн, n >= 15)
--    win_rate төмен = қиын. avg_guess_won жоғары = жеңгенде де әрең тапқан.
-- ────────────────────────────────────────────────────────────────────────────
WITH base AS (
  SELECT upper(solution_word) AS w, game_status, guess_count, duration_seconds
  FROM game_analytics
  WHERE event_type = 'game_end'
    AND solution_word IS NOT NULL
    AND created_at >= now() - interval '90 days'
)
SELECT
  w                             AS word,
  char_length(w)                AS len,
  count(*)                      AS games,
  count(*) FILTER (WHERE game_status = 'WON')  AS wins,
  count(*) FILTER (WHERE game_status = 'LOST') AS losses,
  round(100.0 * count(*) FILTER (WHERE game_status = 'WON') / count(*), 1) AS win_rate,
  round(avg(guess_count) FILTER (WHERE game_status = 'WON'), 2)  AS avg_guess_won,
  round(avg(duration_seconds) FILTER (WHERE game_status = 'WON'), 0) AS avg_sec_won
FROM base
GROUP BY w
HAVING count(*) >= 15
ORDER BY win_rate ASC, games DESC
LIMIT 50;


-- ────────────────────────────────────────────────────────────────────────────
-- 2) СӘТСІЗДІК ТҮРІ: «соқыр» па әлде «тұзақ» па?
--    best_greens = ойыншының ең жақсы қадамында дұрыс орында тұрған әріп саны.
--      • best_greens аз  → сөзді мүлде білмейді (соқыр) → лексикон мәселесі
--      • best_greens көп → әріптерді тапқан, бірақ аяқтай алмады → тұзақ/омоним
-- ────────────────────────────────────────────────────────────────────────────
WITH base AS (
  SELECT
    upper(solution_word) AS w,
    game_status,
    payload -> 'guesses' AS guesses,
    row_number() OVER () AS gid
  FROM game_analytics
  WHERE event_type = 'game_end'
    AND game_status = 'LOST'
    AND solution_word IS NOT NULL
    AND payload ? 'guesses'
    AND jsonb_array_length(payload -> 'guesses') >= 1
    AND created_at >= now() - interval '90 days'
),
games AS (
  SELECT
    b.gid,
    b.w,
    (SELECT max((SELECT count(*) FROM generate_series(1, char_length(b.w)) i
                 WHERE substr(gg, i, 1) = substr(b.w, i, 1)))
       FROM jsonb_array_elements_text(b.guesses) AS gg) AS best_greens,
    (SELECT z.greens FROM (
        SELECT (SELECT count(*) FROM generate_series(1, char_length(b.w)) i
                WHERE substr(gg, i, 1) = substr(b.w, i, 1)) AS greens
        FROM jsonb_array_elements_text(b.guesses) WITH ORDINALITY AS t(gg, ord)
        ORDER BY ord DESC
        LIMIT 1
     ) z) AS last_greens
  FROM base b
)
SELECT
  w AS word,
  char_length(w) AS len,
  count(*) AS lost_games,
  round(avg(best_greens), 2) AS avg_best_greens,
  round(avg(last_greens), 2) AS avg_last_greens,
  round(100.0 * count(*) FILTER (WHERE best_greens <= 1) / count(*), 1) AS pct_blind,
  round(100.0 * count(*) FILTER (WHERE best_greens >= 3) / count(*), 1) AS pct_almost_had_it
FROM games
GROUP BY w
HAVING count(*) >= 15
ORDER BY avg_best_greens ASC;


-- ────────────────────────────────────────────────────────────────────────────
-- 3) ОЙЫНШЫЛАР НЕ ЖАЗАДЫ? — сәтсіз ойындардағы ең жиі болжамдар
--    Белгілі қиын сөздер бойынша. final=TRUE → соңғы қадамдағы болжам.
-- ────────────────────────────────────────────────────────────────────────────
WITH hard AS (
  SELECT unnest(ARRAY[
    'МЫҢҚ','ҮЗДІР','КУПЕ','ӘБЕС','ТҮГЕС','ЖӨТЕЛТ','КӨПЕНЕ',
    'КЕКЕ','ГЕЛИЙ','КЕУІЛ','ИІРТ','БОМАЗИ','ТІСТЕТ','АҚАҢ'
  ]) AS w
),
lost AS (
  SELECT
    upper(a.solution_word) AS w,
    upper(t.guess)         AS guess,
    t.ord = jsonb_array_length(a.payload -> 'guesses') AS is_final
  FROM game_analytics a
  CROSS JOIN LATERAL jsonb_array_elements_text(a.payload -> 'guesses')
       WITH ORDINALITY AS t(guess, ord)
  WHERE a.event_type = 'game_end'
    AND a.game_status = 'LOST'
    AND a.solution_word IS NOT NULL
    AND a.payload ? 'guesses'
    AND a.created_at >= now() - interval '90 days'
)
SELECT
  l.w AS word,
  l.guess,
  count(*)                                                        AS times,
  count(*) FILTER (WHERE l.is_final)                              AS as_final_guess,
  count(*) FILTER (WHERE l.guess = l.w)                           AS was_solution_itself
FROM lost l
JOIN hard h ON h.w = l.w
GROUP BY l.w, l.guess
HAVING count(*) >= 3
ORDER BY l.w, times DESC, as_final_guess DESC;


-- ────────────────────────────────────────────────────────────────────────────
-- 4) АВТО-ҚАРА ТІЗІМ КАНДИДАТТАРЫ (win_rate < 45%, n >= 20)
--    Осы шығысты lib/wordBlacklist.ts пен mobile word_blacklist.dart-қа қосуға
--    болады. (Feedback loop идеясы — қолмен емес, автоматты.)
-- ────────────────────────────────────────────────────────────────────────────
WITH base AS (
  SELECT upper(solution_word) AS w, game_status
  FROM game_analytics
  WHERE event_type = 'game_end'
    AND solution_word IS NOT NULL
    AND created_at >= now() - interval '120 days'
)
SELECT
  w AS word,
  char_length(w) AS len,
  count(*) AS games,
  count(*) FILTER (WHERE game_status = 'LOST') AS losses,
  round(100.0 * count(*) FILTER (WHERE game_status = 'WON') / count(*), 1) AS win_rate
FROM base
GROUP BY w
HAVING count(*) >= 20
   AND (count(*) FILTER (WHERE game_status = 'WON')::numeric / count(*)) < 0.45
ORDER BY win_rate ASC;
