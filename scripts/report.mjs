#!/usr/bin/env node

/**
 * Sozdil Analytics & Audit Reporter
 * Usage:
 *   node scripts/report.mjs [days]
 *   npm run report [days]
 * Example:
 *   npm run report 5
 *   npm run report 1
 */

const SUPABASE_URL = 'https://xbkvmfqefbarpcsfsrav.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3ZtZnFlZmJhcnBjc2ZzcmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTQ1NTYsImV4cCI6MjEwNjA5MDU1Nn0.dDw3QXook7KMJQ2nf6vubQYcvzXqtuBjyRh49RcCwEc';

const args = process.argv.slice(2);
const isJson = args.includes('--json');
const daysArg = args.find((a) => !a.startsWith('--'));
const days = parseInt(daysArg, 10) || 5;

async function fetchReport() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_analytics_report`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_days: days }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Қате (HTTP ${res.status}):`, err);
      process.exit(1);
    }

    const data = await res.json();

    if (isJson) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    printKazakhReport(data);
  } catch (err) {
    console.error('Сұраныс орындалмады:', err.message);
    process.exit(1);
  }
}

function printKazakhReport(data) {
  const { summary, daily, modes, devices, problematic_words, leaderboard, anomalies, period_days, generated_at } = data;

  const abandonCount = (summary.total_games_started || 0) - ((summary.total_games_won || 0) + (summary.total_games_lost || 0));
  const abandonPct = summary.total_games_started
    ? ((abandonCount / summary.total_games_started) * 100).toFixed(1)
    : '0';

  console.log(`\n============================================================`);
  console.log(`🇰🇿 СӨЗДІЛ: СОҢҒЫ ${period_days} КҮНДІК ТОЛЫҚ САРАПТАМАЛЫҚ ЕСЕП`);
  console.log(`Уақыты: ${new Date(generated_at).toLocaleString('kk-KZ', { timeZone: 'Asia/Almaty' })} (Алматы)`);
  console.log(`============================================================\n`);

  console.log(`📊 1. ЖАЛПЫ НЕГІЗГІ КӨРСЕТКІШТЕР (${period_days} күн):`);
  console.log(`   • Уникалды ойыншылар: ${summary.total_unique_visitors?.toLocaleString() || 0} адам`);
  console.log(`   • Жалпы кіру (Сессиялар): ${summary.total_visits?.toLocaleString() || 0}`);
  console.log(`   • Басталған ойындар: ${summary.total_games_started?.toLocaleString() || 0}`);
  console.log(`   • Жеңістер: ${summary.total_games_won?.toLocaleString() || 0} (${summary.overall_win_rate_pct || 0}%)`);
  console.log(`   • Жеңілістер: ${summary.total_games_lost?.toLocaleString() || 0}`);
  console.log(`   • Аяқталмаған (Abandon): ${abandonCount} (${abandonPct}%)`);
  console.log(`   • Бөлісулер саны (Shares): ${summary.total_shares || 0}`);
  console.log(`   • PWA орнатқандар (HomeScreen): ${summary.pwa_users || 0} адам\n`);

  console.log(`📅 2. КҮНДЕР БОЙЫНША ДИНАМИКА:`);
  console.log(`--------------------------------------------------------------------------------------`);
  console.log(` Күні        | Адам  | Сессия | Басталды | Жеңіс | Ұтылыс | Винрейт | Бөлісу | Орт. уақыт`);
  console.log(`--------------------------------------------------------------------------------------`);
  (daily || []).forEach((d) => {
    const min = Math.floor((d.avg_game_duration_sec || 0) / 60);
    const sec = (d.avg_game_duration_sec || 0) % 60;
    const durStr = `${min}м ${sec}с`;
    console.log(
      ` ${d.day.padEnd(10)} | ${String(d.unique_visitors).padStart(5)} | ${String(d.total_visits).padStart(6)} | ${String(d.games_started).padStart(8)} | ${String(d.games_won).padStart(5)} | ${String(d.games_lost).padStart(6)} | ${(d.win_rate_pct + '%').padStart(7)} | ${String(d.shares_count).padStart(6)} | ${durStr.padStart(9)}`
    );
  });
  console.log(`--------------------------------------------------------------------------------------\n`);

  console.log(`🔤 3. СӨЗ РЕЖИМДЕРІ БОЙЫНША:`);
  (modes || []).forEach((m) => {
    const min = Math.floor((m.avg_duration_sec || 0) / 60);
    const sec = Math.round((m.avg_duration_sec || 0) % 60);
    console.log(
      `   • ${m.word_length} әріптік: ${m.starts} ойын | Жеңіс: ${m.wins} (${m.win_rate_pct}%) | Ұтылыс: ${m.losses} | Орт. қадам: ${m.avg_guesses} | Орт. уақыт: ${min}м ${sec}с`
    );
  });
  console.log();

  console.log(`📱 4. НЕГІЗГІ ҚҰРЫЛҒЫЛАР ЖӘНЕ ПЛАТФОРМАЛАР:`);
  (devices || []).slice(0, 5).forEach((dev) => {
    console.log(`   • ${dev.os} (${dev.device}): ${dev.unique_users} ойыншы (${dev.visits} сессия)`);
  });
  console.log();

  if (problematic_words && problematic_words.length > 0) {
    console.log(`⚠️ 5. КҮДІКТІ / ЕҢ ҚИЫН СӨЗДЕР (Винрейт < 50%):`);
    problematic_words.forEach((pw) => {
      console.log(
        `   • «${pw.solution_word}» (${pw.word_length} әріп) — Винрейт: ${pw.win_rate_pct}% (${pw.wins} жеңіс, ${pw.losses} жеңіліс, орт. ${pw.avg_guesses} қадам)`
      );
    });
    console.log();
  }

  console.log(`🏆 6. РЕЙТИНГ ЖӘНЕ КӨШБАСШЫЛАР:`);
  console.log(`   • Тіркелген ойыншылар: ${leaderboard.total_players || 0} адам`);
  console.log(`   • Ең жоғарғы күн (стрик): ${leaderboard.max_streak || 0} күн (Орташа: ${leaderboard.avg_streak || 0} күн)`);
  console.log(`   • Топ-5 көшбасшы:`);
  (leaderboard.top_players || []).forEach((p, idx) => {
    console.log(`     ${idx + 1}. ${p.nickname} — ${p.streak} күн | ${p.score} ұпай`);
  });
  console.log();

  console.log(`🚨 7. АНОМАЛИЯЛАР ЖӘНЕ АНТИ-ЧИТ ТЕКСЕРУІ:`);
  console.log(`   • 3 секундтан жылдам аяқталған ойындар (<3s): ${anomalies.fast_solves_under_3s || 0} рет`);
  console.log(`   • 1 сағаттан көп ашық тұрған ойындар (>1h): ${anomalies.extreme_duration_over_1h || 0} рет`);
  console.log(`\n============================================================\n`);
}

fetchReport();
