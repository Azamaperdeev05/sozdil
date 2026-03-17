# Сөзділ

Қазақ тіліндегі күнделікті wordle ойыны. Қосымшада 4, 5 және 6 әріптік режим бар, ойын нәтижесі мен статистикасы `localStorage` ішінде сақталады.

## Локал іске қосу

1. `npm install`
2. `npm run dev`
3. Қосымша `Vite` dev server арқылы ашылады

## Тексеру

- `npm run check` - TypeScript тексерісі
- `npm run build` - production build
- `npm run start` - `dist` бумасын Railway стиліндегі Node static server арқылы беру

## Deploy

- `vercel.json` - Vercel үшін дайын конфиг
- `railway.json` + `nixpacks.toml` - Railway үшін build/start конфигі

Екі платформада да SPA rewrite/static fallback дайын.
