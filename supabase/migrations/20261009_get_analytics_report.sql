-- Stored procedure for Sozdil analytics reporting
-- Usage: SELECT get_analytics_report(5);
-- HTTP RPC: POST https://xbkvmfqefbarpcsfsrav.supabase.co/rest/v1/rpc/get_analytics_report

CREATE OR REPLACE FUNCTION get_analytics_report(p_days integer DEFAULT 5)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_time timestamp with time zone;
  v_date_str text;
  v_res jsonb;
BEGIN
  v_start_time := NOW() - (p_days || ' days')::interval;
  v_date_str := to_char(v_start_time, 'YYYY-MM-DD');

  WITH 
  overall AS (
    SELECT 
      count(distinct visitor_id) as total_unique_visitors,
      count(*) filter (where event_type = 'visit') as total_visits,
      count(*) filter (where event_type = 'game_start') as total_games_started,
      count(*) filter (where event_type = 'game_end' and game_status = 'WON') as total_games_won,
      count(*) filter (where event_type = 'game_end' and game_status = 'LOST') as total_games_lost,
      round((count(*) filter (where event_type = 'game_end' and game_status = 'WON')::decimal / nullif(count(*) filter (where event_type = 'game_end'), 0)) * 100, 1) as overall_win_rate_pct,
      count(*) filter (where event_type = 'share') as total_shares,
      count(distinct visitor_id) filter (where is_pwa = true) as pwa_users
    FROM game_analytics
    WHERE created_at >= v_start_time
  ),
  daily AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'day', day,
        'unique_visitors', unique_visitors,
        'total_visits', total_visits,
        'games_started', games_started,
        'games_won', games_won,
        'games_lost', games_lost,
        'win_rate_pct', round((games_won::decimal / nullif(games_won + games_lost, 0)) * 100, 1),
        'shares_count', shares_count,
        'avg_game_duration_sec', avg_game_duration_sec
      ) ORDER BY day ASC
    ) as daily_data
    FROM v_daily_analytics_summary
    WHERE day >= v_date_str
  ),
  modes AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'word_length', word_length,
        'starts', starts,
        'wins', wins,
        'losses', losses,
        'win_rate_pct', round((wins::decimal / nullif(wins + losses, 0)) * 100, 1),
        'avg_guesses', avg_guesses,
        'avg_duration_sec', avg_duration_sec
      ) ORDER BY word_length ASC
    ) as mode_data
    FROM (
      SELECT 
        word_length,
        count(*) filter (where event_type = 'game_start') as starts,
        count(*) filter (where event_type = 'game_end' and game_status = 'WON') as wins,
        count(*) filter (where event_type = 'game_end' and game_status = 'LOST') as losses,
        round(avg(guess_count) filter (where event_type = 'game_end' and game_status = 'WON'), 2) as avg_guesses,
        round(avg(duration_seconds) filter (where event_type = 'game_end'), 1) as avg_duration_sec
      FROM game_analytics
      WHERE created_at >= v_start_time AND word_length IS NOT NULL
      GROUP BY word_length
    ) m
  ),
  devices AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'device', coalesce(device_type, 'unknown'),
        'os', coalesce(os, 'unknown'),
        'unique_users', users,
        'visits', visits
      ) ORDER BY visits DESC
    ) as device_data
    FROM (
      SELECT 
        device_type, os,
        count(distinct visitor_id) as users,
        count(*) filter (where event_type = 'visit') as visits
      FROM game_analytics
      WHERE created_at >= v_start_time
      GROUP BY device_type, os
      ORDER BY visits DESC
      LIMIT 8
    ) d
  ),
  prob_words AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'solution_word', solution_word,
        'word_length', word_length,
        'wins', wins,
        'losses', losses,
        'win_rate_pct', win_rate_pct,
        'avg_guesses', avg_guesses
      )
    ) as prob_word_data
    FROM (
      SELECT 
        solution_word,
        word_length,
        count(*) filter (where game_status = 'WON') as wins,
        count(*) filter (where game_status = 'LOST') as losses,
        round((count(*) filter (where game_status = 'WON')::decimal / nullif(count(*), 0)) * 100, 1) as win_rate_pct,
        round(avg(guess_count), 2) as avg_guesses
      FROM game_analytics
      WHERE created_at >= v_start_time
        AND event_type = 'game_end'
        AND solution_word IS NOT NULL
      GROUP BY solution_word, word_length
      HAVING count(*) >= 10 AND (count(*) filter (where game_status = 'WON')::decimal / nullif(count(*), 0)) < 0.50
      ORDER BY win_rate_pct ASC
      LIMIT 10
    ) pw
  ),
  lb AS (
    SELECT 
      count(*) as total_players,
      max(streak) as max_streak,
      round(avg(streak), 1) as avg_streak,
      jsonb_agg(
        jsonb_build_object(
          'nickname', nickname,
          'streak', streak,
          'score', total_score
        )
      ) filter (where rn <= 5) as top_players
    FROM (
      SELECT 
        nickname, streak, total_score,
        row_number() over (order by streak desc, total_score desc) as rn
      FROM leaderboard
      WHERE is_flagged = false
    ) t
  ),
  anomalies AS (
    SELECT 
      count(*) filter (where duration_seconds < 3) as fast_solves_under_3s,
      count(*) filter (where duration_seconds > 3600) as extreme_duration_over_1h
    FROM game_analytics
    WHERE created_at >= v_start_time AND event_type = 'game_end'
  )
  SELECT jsonb_build_object(
    'period_days', p_days,
    'generated_at', NOW(),
    'summary', (SELECT to_jsonb(overall.*) FROM overall),
    'daily', (SELECT daily_data FROM daily),
    'modes', (SELECT mode_data FROM modes),
    'devices', (SELECT device_data FROM devices),
    'problematic_words', coalesce((SELECT prob_word_data FROM prob_words), '[]'::jsonb),
    'leaderboard', (SELECT to_jsonb(lb.*) FROM lb),
    'anomalies', (SELECT to_jsonb(anomalies.*) FROM anomalies)
  ) INTO v_res;

  RETURN v_res;
END;
$$;

GRANT EXECUTE ON FUNCTION get_analytics_report(integer) TO anon, authenticated, service_role;
